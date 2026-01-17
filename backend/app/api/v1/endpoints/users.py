"""
User API Endpoints - User profile and authentication info.

Uses Auth0 for authentication. User profile data comes from JWT claims.
"""
from fastapi import APIRouter

from app.core.deps import CurrentUser
from app.api.v1.schemas import UserProfile


router = APIRouter()


# =============================================================================
# USER PROFILE ENDPOINTS
# =============================================================================

@router.get(
    "/me",
    response_model=UserProfile,
    summary="Get current user profile",
    description="Returns the profile of the currently authenticated user from JWT claims.",
    responses={
        401: {"description": "Not authenticated or invalid token"},
    },
)
async def get_current_user_profile(user: CurrentUser) -> UserProfile:
    """
    Get the current user's profile information.
    
    This endpoint returns user data extracted from the Auth0 JWT token.
    No database queries are made - all data comes from the token claims.
    
    **Authentication Required**: Valid Auth0 Bearer token.
    """
    return UserProfile(
        id=user.id,
        email=user.email,
        permissions=user.permissions,
    )


@router.get(
    "/me/permissions",
    response_model=list[str],
    summary="List current user permissions",
    description="Returns the list of permissions/scopes for the authenticated user.",
)
async def get_user_permissions(user: CurrentUser) -> list[str]:
    """
    Get the current user's permissions list.
    
    Useful for frontend to determine what actions the user can perform.
    """
    return user.permissions
