"""
API v1 Endpoint modules.

Each module contains a FastAPI router for a specific domain.
"""
from app.api.v1.endpoints import users
from app.api.v1.endpoints import clients
from app.api.v1.endpoints import metrics

__all__ = ["users", "clients", "metrics"]
