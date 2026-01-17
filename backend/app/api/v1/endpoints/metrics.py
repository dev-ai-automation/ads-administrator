"""
Metrics API Endpoints - CRUD operations for advertising metrics.

Provides endpoints for syncing and querying advertising performance data.
All endpoints require authentication via Auth0 JWT.
"""
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select, func, and_
from sqlalchemy.orm import selectinload

from app.core.deps import DbSession, CurrentUser, MetricsReader
from app.models.metric import Metric
from app.models.client import Client
from app.api.v1.schemas import (
    MetricCreate,
    MetricResponse,
    MetricListResponse,
    MetricSummary,
)


router = APIRouter()


# =============================================================================
# LIST METRICS
# =============================================================================

@router.get(
    "",
    response_model=MetricListResponse,
    summary="List metrics",
    description="Retrieve metrics with filtering and pagination.",
)
async def list_metrics(
    db: DbSession,
    user: MetricsReader,  # Requires 'read:metrics' scope
    client_id: Optional[int] = Query(None, description="Filter by client ID"),
    platform: Optional[str] = Query(None, description="Filter by platform (meta, google)"),
    date_from: Optional[datetime] = Query(None, description="Start date filter"),
    date_to: Optional[datetime] = Query(None, description="End date filter"),
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=50, ge=1, le=500, description="Items per page"),
) -> MetricListResponse:
    """
    List metrics with optional filtering.
    
    Filters:
    - **client_id**: Filter to a specific client
    - **platform**: Filter by platform (meta, google, etc.)
    - **date_from**: Only include metrics from this date onwards
    - **date_to**: Only include metrics up to this date
    """
    # Build query with filters
    query = select(Metric)
    conditions = []
    
    if client_id is not None:
        conditions.append(Metric.client_id == client_id)
    if platform is not None:
        conditions.append(Metric.platform == platform)
    if date_from is not None:
        conditions.append(Metric.date >= date_from)
    if date_to is not None:
        conditions.append(Metric.date <= date_to)
    
    if conditions:
        query = query.where(and_(*conditions))
    
    # Get total count
    count_query = select(func.count()).select_from(Metric)
    if conditions:
        count_query = count_query.where(and_(*conditions))
        
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Metric.date.desc())
    
    result = await db.execute(query)
    metrics = result.scalars().all()
    
    return MetricListResponse(
        items=[MetricResponse.model_validate(m) for m in metrics],
        total=total,
        page=page,
        page_size=page_size,
    )


# =============================================================================
# GET SINGLE METRIC
# =============================================================================

@router.get(
    "/{metric_id}",
    response_model=MetricResponse,
    summary="Get metric by ID",
    responses={404: {"description": "Metric not found"}},
)
async def get_metric(
    metric_id: int,
    db: DbSession,
    user: MetricsReader,
) -> MetricResponse:
    """Retrieve a single metric by its ID."""
    result = await db.execute(select(Metric).where(Metric.id == metric_id))
    metric = result.scalar_one_or_none()
    
    if not metric:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Metric with ID {metric_id} not found",
        )
    
    return MetricResponse.model_validate(metric)


# =============================================================================
# CREATE METRIC
# =============================================================================

@router.post(
    "",
    response_model=MetricResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new metric",
    responses={404: {"description": "Client not found"}},
)
async def create_metric(
    metric_in: MetricCreate,
    db: DbSession,
    user: CurrentUser,  # Any authenticated user can create metrics
) -> MetricResponse:
    """
    Create a new metric entry.
    
    Typically used for syncing data from advertising platforms.
    The client must exist before metrics can be created.
    """
    # Verify client exists
    client_result = await db.execute(
        select(Client).where(Client.id == metric_in.client_id)
    )
    if not client_result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID {metric_in.client_id} not found",
        )
    
    metric = Metric(**metric_in.model_dump())
    db.add(metric)
    await db.commit()
    await db.refresh(metric)
    
    return MetricResponse.model_validate(metric)


# =============================================================================
# GET METRICS SUMMARY
# =============================================================================

@router.get(
    "/summary/{client_id}",
    response_model=MetricSummary,
    summary="Get aggregated metrics for a client",
    responses={404: {"description": "No metrics found"}},
)
async def get_metrics_summary(
    client_id: int,
    db: DbSession,
    user: MetricsReader,
    platform: Optional[str] = Query(None, description="Filter by platform"),
    date_from: Optional[datetime] = Query(None, description="Start date"),
    date_to: Optional[datetime] = Query(None, description="End date"),
) -> MetricSummary:
    """
    Get aggregated metrics summary for a client.
    
    Returns totals for impressions, clicks, spend, leads, and calculated CTR/CPL.
    """
    # Build query with aggregations
    conditions = [Metric.client_id == client_id]
    
    if platform:
        conditions.append(Metric.platform == platform)
    if date_from:
        conditions.append(Metric.date >= date_from)
    if date_to:
        conditions.append(Metric.date <= date_to)
    
    query = select(
        func.sum(Metric.impressions).label("total_impressions"),
        func.sum(Metric.clicks).label("total_clicks"),
        func.sum(Metric.spend).label("total_spend"),
        func.sum(Metric.leads).label("total_leads"),
        func.min(Metric.date).label("date_from"),
        func.max(Metric.date).label("date_to"),
    ).where(and_(*conditions))
    
    result = await db.execute(query)
    row = result.first()
    
    if not row or row.total_impressions is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No metrics found for client {client_id}",
        )
    
    # Calculate derived metrics
    total_impressions = row.total_impressions or 0
    total_clicks = row.total_clicks or 0
    total_spend = row.total_spend or 0.0
    total_leads = row.total_leads or 0
    
    ctr = (total_clicks / total_impressions * 100) if total_impressions > 0 else 0.0
    cpl = (total_spend / total_leads) if total_leads > 0 else None
    
    return MetricSummary(
        client_id=client_id,
        platform=platform or "all",
        date_from=row.date_from,
        date_to=row.date_to,
        total_impressions=total_impressions,
        total_clicks=total_clicks,
        total_spend=total_spend,
        total_leads=total_leads,
        ctr=round(ctr, 2),
        cpl=round(cpl, 2) if cpl else None,
    )
