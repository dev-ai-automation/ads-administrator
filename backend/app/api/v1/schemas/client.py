"""
Client Schemas - Pydantic v2 models for request/response validation.

These schemas define the API contract and ensure strict type safety.
All schemas use strict mode to prevent implicit type coercion.
"""
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field


# =============================================================================
# BASE SCHEMAS (Shared attributes)
# =============================================================================

class ClientBase(BaseModel):
    """Base attributes shared across all Client schemas."""
    model_config = ConfigDict(strict=True)
    name: str = Field(
        ...,
        min_length=1,
        max_length=255,
        description="Display name for the client",
        examples=["Acme Corporation"]
    )
    slug: Optional[str] = Field(
        default=None,
        max_length=100,
        pattern=r"^[a-z0-9-]+$",
        description="URL-friendly identifier (lowercase alphanumeric with hyphens)",
        examples=["acme-corp"]
    )
    active: bool = Field(
        default=True,
        description="Whether the client is currently active"
    )


class ClientMetaConfig(BaseModel):
    """Meta Ads specific configuration."""
    meta_ad_account_id: Optional[str] = Field(
        default=None,
        max_length=50,
        description="Facebook/Meta Ads account ID",
        examples=["act_123456789"]
    )
    # Note: meta_access_token is write-only and never returned in responses


# =============================================================================
# REQUEST SCHEMAS
# =============================================================================

class ClientCreate(ClientBase, ClientMetaConfig):
    """Schema for creating a new client."""
    meta_access_token: Optional[str] = Field(
        default=None,
        description="Meta API access token (write-only, never returned)",
        examples=["EAAxxxxxxxx"]
    )
    config: dict[str, Any] = Field(
        default_factory=dict,
        description="Flexible JSON configuration"
    )


class ClientUpdate(BaseModel):
    """Schema for updating an existing client. All fields optional."""
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    slug: Optional[str] = Field(default=None, max_length=100, pattern=r"^[a-z0-9-]+$")
    active: Optional[bool] = None
    meta_ad_account_id: Optional[str] = Field(default=None, max_length=50)
    meta_access_token: Optional[str] = None
    config: Optional[dict[str, Any]] = None


# =============================================================================
# RESPONSE SCHEMAS
# =============================================================================

class ClientResponse(ClientBase, ClientMetaConfig):
    """
    Schema for client data returned in API responses.
    Note: Sensitive fields like meta_access_token are excluded.
    """
    model_config = ConfigDict(from_attributes=True)

    id: int = Field(..., description="Unique client identifier")
    config: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(..., description="When the client was created")
    updated_at: Optional[datetime] = Field(None, description="Last update timestamp")


class ClientListResponse(BaseModel):
    """Response schema for listing multiple clients."""
    items: list[ClientResponse]
    total: int = Field(..., ge=0, description="Total number of clients")
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)


# =============================================================================
# INTERNAL SCHEMAS (for service layer)
# =============================================================================

class ClientInDB(ClientResponse):
    """Schema representing the full client data in database (internal use)."""
    meta_access_token: Optional[str] = None  # Included for internal operations
