"""
API v1 Router Aggregator.

Combines all domain routers into a single router with proper prefixes and tags.
This follows the modular design pattern specified in the backend skill.
"""
from fastapi import APIRouter

from app.api.v1.endpoints import users, clients, metrics


api_router = APIRouter()

# User endpoints - /api/v1/users
api_router.include_router(
    users.router,
    prefix="/users",
    tags=["users"],
)

# Client endpoints - /api/v1/clients
api_router.include_router(
    clients.router,
    prefix="/clients",
    tags=["clients"],
)

# Metrics endpoints - /api/v1/metrics
api_router.include_router(
    metrics.router,
    prefix="/metrics",
    tags=["metrics"],
)
