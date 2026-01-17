"""
Centralized schema exports for API v1.

Import all schemas from this module for cleaner imports:
    from app.api.v1.schemas import ClientCreate, ClientResponse, UserProfile
"""
from app.api.v1.schemas.client import (
    ClientBase,
    ClientCreate,
    ClientUpdate,
    ClientResponse,
    ClientListResponse,
    ClientInDB,
    ClientMetaConfig,
)

from app.api.v1.schemas.user import (
    UserProfile,
    UserResponse,
    UserCreate,
    UserUpdate,
)

from app.api.v1.schemas.metric import (
    MetricBase,
    MetricCreate,
    MetricBulkCreate,
    MetricUpdate,
    MetricResponse,
    MetricListResponse,
    MetricSummary,
)


__all__ = [
    # Client schemas
    "ClientBase",
    "ClientCreate",
    "ClientUpdate",
    "ClientResponse",
    "ClientListResponse",
    "ClientInDB",
    "ClientMetaConfig",
    # User schemas
    "UserProfile",
    "UserResponse",
    "UserCreate",
    "UserUpdate",
    # Metric schemas
    "MetricBase",
    "MetricCreate",
    "MetricBulkCreate",
    "MetricUpdate",
    "MetricResponse",
    "MetricListResponse",
    "MetricSummary",
]
