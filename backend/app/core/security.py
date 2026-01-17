"""
Auth0 JWT Authentication and Authorization.

Provides security dependencies for FastAPI endpoints using Auth0 as the identity provider.
Implements scope-based authorization for fine-grained access control.
"""
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, SecurityScopes
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
import httpx
from pydantic import BaseModel, Field

from app.core.config import settings


# =============================================================================
# OAUTH2 SCHEME CONFIGURATION
# =============================================================================

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"https://{settings.AUTH0_DOMAIN}/oauth/token",
    scopes={
        "openid": "OpenID Connect",
        "email": "Email address",
        "profile": "User profile information",
        "admin": "Administrator access",
        "read:clients": "Read client data",
        "write:clients": "Create/update clients",
        "delete:clients": "Delete clients",
        "read:metrics": "Read metrics data",
    },
    auto_error=True,
)


# =============================================================================
# USER MODELS
# =============================================================================

class Auth0User(BaseModel):
    """
    Represents an authenticated user from Auth0.
    
    Contains claims extracted from the JWT token payload.
    """
    id: str = Field(..., description="Auth0 user ID (sub claim)")
    email: str | None = Field(None, description="User's email address")
    permissions: list[str] = Field(default_factory=list, description="User's scopes/permissions")
    
    class Config:
        frozen = True  # Immutable user object


# =============================================================================
# JWKS CACHING (Performance Optimization)
# =============================================================================

_jwks_cache: dict | None = None


async def _get_jwks() -> dict:
    """
    Fetch and cache Auth0 JWKS for token verification.
    
    The JWKS (JSON Web Key Set) is cached to avoid repeated HTTP requests.
    In production, consider using a proper cache with TTL.
    """
    global _jwks_cache
    
    if _jwks_cache is None:
        async with httpx.AsyncClient() as client:
            response = await client.get(settings.AUTH0_JWKS_URL)
            response.raise_for_status()
            _jwks_cache = response.json()
    
    return _jwks_cache


def _get_rsa_key(jwks: dict, token: str) -> dict:
    """Extract the RSA key matching the token's 'kid' header."""
    try:
        unverified_header = jwt.get_unverified_header(token)
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token header: {e}",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    for key in jwks.get("keys", []):
        if key.get("kid") == unverified_header.get("kid"):
            return {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Unable to find appropriate signing key",
        headers={"WWW-Authenticate": "Bearer"},
    )


# =============================================================================
# SECURITY DEPENDENCIES
# =============================================================================

async def get_current_user(
    security_scopes: SecurityScopes,
    token: Annotated[str, Depends(oauth2_scheme)],
) -> Auth0User:
    """
    Validate JWT token and extract user information.
    
    This is the core security dependency that:
    1. Fetches Auth0 JWKS for token verification
    2. Validates the JWT signature, expiration, audience, and issuer
    3. Checks that the user has all required scopes (if specified)
    
    Args:
        security_scopes: Scopes required by the endpoint (from Security())
        token: Bearer token from Authorization header
        
    Returns:
        Auth0User: Authenticated user with their permissions
        
    Raises:
        HTTPException 401: Invalid token, expired, or missing authentication
        HTTPException 403: User lacks required scopes
    """
    # Build authenticate header with required scopes
    if security_scopes.scopes:
        authenticate_value = f'Bearer scope="{security_scopes.scope_str}"'
    else:
        authenticate_value = "Bearer"
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": authenticate_value},
    )
    
    try:
        # Get JWKS and find matching RSA key
        jwks = await _get_jwks()
        rsa_key = _get_rsa_key(jwks, token)
        
        # Decode and validate JWT
        payload = jwt.decode(
            token,
            rsa_key,
            algorithms=[settings.AUTH0_ALGORITHM],
            audience=settings.AUTH0_API_AUDIENCE,
            issuer=settings.AUTH0_ISSUER,
        )
        
        # Extract user information
        user_id: str | None = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
        # Auth0 stores permissions in the "permissions" claim for API tokens
        # or "scope" claim for ID tokens (space-separated string)
        permissions: list[str] = payload.get("permissions", [])
        if not permissions:
            scope_str = payload.get("scope", "")
            permissions = scope_str.split() if scope_str else []
        
        user = Auth0User(
            id=user_id,
            email=payload.get("email"),
            permissions=permissions,
        )
        
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": authenticate_value},
        )
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token validation failed: {e}",
            headers={"WWW-Authenticate": authenticate_value},
        )
    except httpx.HTTPError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"Unable to verify token: Auth0 unavailable",
        )
    
    # Check required scopes (Authorization)
    if security_scopes.scopes:
        for scope in security_scopes.scopes:
            if scope not in user.permissions:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Not enough permissions. Required: {security_scopes.scope_str}",
                    headers={"WWW-Authenticate": authenticate_value},
                )
    
    return user


# =============================================================================
# UTILITY FUNCTIONS
# =============================================================================

def clear_jwks_cache() -> None:
    """
    Clear the JWKS cache.
    
    Useful for testing or when Auth0 keys are rotated.
    """
    global _jwks_cache
    _jwks_cache = None
