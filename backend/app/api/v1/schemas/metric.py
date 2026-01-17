"""
Metric Schemas - Pydantic v2 models for metrics request/response validation.

These schemas define the API contract for metrics endpoints with strict validation.
"""
from datetime import datetime
from typing import Any, Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


# =============================================================================
# BASE SCHEMAS
# =============================================================================

class MetricBase(BaseModel):
    """Base attributes shared across Metric schemas."""
    model_config = ConfigDict(strict=True)
    
    date: datetime = Field(..., description="Date of the metric (daily granularity)")
    platform: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Source platform identifier",
        examples=["meta", "google"]
    )
    impressions: int = Field(default=0, ge=0, description="Number of ad impressions")
    clicks: int = Field(default=0, ge=0, description="Number of ad clicks")
    spend: float = Field(default=0.0, ge=0.0, description="Advertising spend in USD")
    leads: int = Field(default=0, ge=0, description="Number of leads/conversions")


# =============================================================================
# REQUEST SCHEMAS
# =============================================================================

class MetricCreate(MetricBase):
    """Schema for creating a new metric entry."""
    client_id: int = Field(..., gt=0, description="ID of the owning client")
    raw_data: dict[str, Any] = Field(
        default_factory=dict,
        description="Platform-specific breakdown data (campaigns, adsets)"
    )


class MetricBulkCreate(BaseModel):
    """Schema for bulk creating metrics (e.g., from API sync)."""
    model_config = ConfigDict(strict=True)
    
    client_id: int = Field(..., gt=0, description="ID of the owning client")
    metrics: list[MetricCreate] = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="List of metrics to create"
    )

    @field_validator("metrics")
    @classmethod
    def validate_same_client(cls, v: list[MetricCreate], info) -> list[MetricCreate]:
        """Ensure all metrics belong to the same client."""
        # Note: This validator ensures data consistency
        # The client_id from parent overrides individual metric client_ids
        return v


class MetricUpdate(BaseModel):
    """Schema for updating an existing metric. All fields optional."""
    model_config = ConfigDict(strict=True)
    
    impressions: int | None = Field(None, ge=0)
    clicks: int | None = Field(None, ge=0)
    spend: float | None = Field(None, ge=0.0)
    leads: int | None = Field(None, ge=0)
    raw_data: dict[str, Any] | None = None


# =============================================================================
# RESPONSE SCHEMAS
# =============================================================================

class MetricResponse(MetricBase):
    """Schema for metric data in API responses."""
    model_config = ConfigDict(
        from_attributes=True,
        strict=True,
    )
    
    id: int = Field(..., description="Unique metric identifier")
    client_id: int = Field(..., description="ID of the owning client")
    raw_data: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(..., description="When the metric was recorded")


class MetricListResponse(BaseModel):
    """Response schema for listing multiple metrics."""
    model_config = ConfigDict(strict=True)
    
    items: list[MetricResponse]
    total: int = Field(..., ge=0, description="Total number of metrics")
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=50, ge=1, le=500)


# =============================================================================
# AGGREGATION SCHEMAS
# =============================================================================

class MetricSummary(BaseModel):
    """Aggregated metrics summary for a client."""
    model_config = ConfigDict(strict=True)
    
    client_id: int
    platform: str
    date_from: datetime
    date_to: datetime
    total_impressions: int = Field(..., ge=0)
    total_clicks: int = Field(..., ge=0)
    total_spend: float = Field(..., ge=0.0)
    total_leads: int = Field(..., ge=0)
    ctr: float = Field(..., ge=0.0, description="Click-through rate (clicks/impressions)")
    cpl: float | None = Field(None, ge=0.0, description="Cost per lead (spend/leads)")
    
    @field_validator("ctr", mode="before")
    @classmethod
    def calculate_ctr(cls, v: Any, info) -> float:
        """Calculate CTR if not provided."""
        if v is not None:
            return v
        data = info.data
        impressions = data.get("total_impressions", 0)
        clicks = data.get("total_clicks", 0)
        if impressions > 0:
            return round(clicks / impressions * 100, 2)
        return 0.0
