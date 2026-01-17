"""
User Schemas - Pydantic v2 models for user-related request/response validation.

These schemas define the API contract for user endpoints.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


# =============================================================================
# RESPONSE SCHEMAS
# =============================================================================

class UserProfile(BaseModel):
    """
    User profile response from Auth0 token.
    Used for /users/me endpoint.
    """
    model_config = ConfigDict(strict=True)
    
    id: str = Field(..., description="Auth0 user ID (sub claim)")
    email: str | None = Field(None, description="User email address")
    permissions: list[str] = Field(
        default_factory=list,
        description="User permissions/scopes from JWT"
    )


class UserResponse(BaseModel):
    """
    Full user response from database.
    """
    model_config = ConfigDict(
        from_attributes=True,
        strict=True,
    )
    
    id: int = Field(..., description="Database user ID")
    email: EmailStr = Field(..., description="User email address")
    auth0_sub: str = Field(..., description="Auth0 user ID")
    is_active: bool = Field(..., description="Whether user is active")
    is_superuser: bool = Field(..., description="Whether user has admin privileges")
    full_name: str | None = Field(None, description="User's display name")
    created_at: datetime = Field(..., description="Account creation timestamp")
    updated_at: datetime | None = Field(None, description="Last update timestamp")


# =============================================================================
# REQUEST SCHEMAS
# =============================================================================

class UserCreate(BaseModel):
    """
    Schema for creating a new user (typically from Auth0 callback).
    """
    model_config = ConfigDict(strict=True)
    
    email: EmailStr = Field(..., description="User email address")
    auth0_sub: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Auth0 user ID from 'sub' claim"
    )
    full_name: str | None = Field(
        None,
        max_length=255,
        description="User's display name"
    )
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)


class UserUpdate(BaseModel):
    """
    Schema for updating user data. All fields optional.
    """
    model_config = ConfigDict(strict=True)
    
    full_name: str | None = Field(None, max_length=255)
    is_active: bool | None = None
    is_superuser: bool | None = None
