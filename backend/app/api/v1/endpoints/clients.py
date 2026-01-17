"""
Client API Endpoints - CRUD operations for advertising clients.

All endpoints require authentication via Auth0 JWT.
"""
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, status
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError

from app.core.deps import DbSession, CurrentUser
from app.models.client import Client
from app.api.v1.schemas.client import (
    ClientCreate,
    ClientUpdate,
    ClientResponse,
    ClientListResponse,
)

router = APIRouter()


# =============================================================================
# LIST CLIENTS
# =============================================================================

@router.get(
    "",
    response_model=ClientListResponse,
    summary="List all clients",
    description="Retrieve a paginated list of clients. Requires authentication.",
)
async def list_clients(
    db: DbSession,
    user: CurrentUser,
    page: int = Query(default=1, ge=1, description="Page number"),
    page_size: int = Query(default=20, ge=1, le=100, description="Items per page"),
    active_only: bool = Query(default=False, description="Filter to active clients only"),
) -> ClientListResponse:
    """
    List all clients with pagination support.
    
    - **page**: Page number (1-indexed)
    - **page_size**: Number of items per page (max 100)
    - **active_only**: If true, only return active clients
    """
    # Build query
    query = select(Client)
    if active_only:
        query = query.where(Client.active == True)
    
    # Get total count
    count_query = select(func.count()).select_from(Client)
    if active_only:
        count_query = count_query.where(Client.active == True)
        
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0
    
    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size).order_by(Client.id)
    
    result = await db.execute(query)
    clients = result.scalars().all()
    
    return ClientListResponse(
        items=[ClientResponse.model_validate(c) for c in clients],
        total=total,
        page=page,
        page_size=page_size,
    )


# =============================================================================
# GET SINGLE CLIENT
# =============================================================================

@router.get(
    "/{client_id}",
    response_model=ClientResponse,
    summary="Get client by ID",
    responses={404: {"description": "Client not found"}},
)
async def get_client(
    client_id: int,
    db: DbSession,
    user: CurrentUser,
) -> ClientResponse:
    """Retrieve a single client by their ID."""
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID {client_id} not found",
        )
    
    return ClientResponse.model_validate(client)


# =============================================================================
# CREATE CLIENT
# =============================================================================

@router.post(
    "",
    response_model=ClientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new client",
    responses={409: {"description": "Client with this slug already exists"}},
)
async def create_client(
    client_in: ClientCreate,
    db: DbSession,
    user: CurrentUser,
) -> ClientResponse:
    """
    Create a new advertising client.
    
    - **name**: Required. Display name for the client.
    - **slug**: Optional. URL-friendly identifier (must be unique).
    - **active**: Optional. Defaults to True.
    - **meta_ad_account_id**: Optional. Facebook Ads account ID.
    - **meta_access_token**: Optional. Facebook API token.
    """
    client = Client(**client_in.model_dump())
    
    try:
        db.add(client)
        await db.commit()
        await db.refresh(client)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Client with slug '{client_in.slug}' already exists",
        )
    
    return ClientResponse.model_validate(client)


# =============================================================================
# UPDATE CLIENT
# =============================================================================

@router.patch(
    "/{client_id}",
    response_model=ClientResponse,
    summary="Update a client",
    responses={
        404: {"description": "Client not found"},
        409: {"description": "Slug conflict"},
    },
)
async def update_client(
    client_id: int,
    client_in: ClientUpdate,
    db: DbSession,
    user: CurrentUser,
) -> ClientResponse:
    """Update an existing client. Only provided fields will be updated."""
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID {client_id} not found",
        )
    
    # Update only provided fields
    update_data = client_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(client, field, value)
    
    try:
        await db.commit()
        await db.refresh(client)
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Client with slug '{client_in.slug}' already exists",
        )
    
    return ClientResponse.model_validate(client)


# =============================================================================
# DELETE CLIENT
# =============================================================================

@router.delete(
    "/{client_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete a client",
    responses={404: {"description": "Client not found"}},
)
async def delete_client(
    client_id: int,
    db: DbSession,
    user: CurrentUser,
) -> None:
    """Permanently delete a client and all associated data."""
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()
    
    if not client:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Client with ID {client_id} not found",
        )
    
    await db.delete(client)
    await db.commit()

