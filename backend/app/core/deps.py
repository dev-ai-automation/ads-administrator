"""
Type-safe Dependency Injection using Annotated pattern.

This module provides reusable dependency aliases for common patterns:
- Database sessions
- Current authenticated user
- Role-based access (Admin)
- Scoped access (read/write permissions)

Usage:
    @router.get("/")
    async def endpoint(db: DbSession, user: CurrentUser):
        ...
        
    @router.delete("/")
    async def admin_endpoint(db: DbSession, user: AdminUser):
        ...  # Requires 'admin' scope
"""
from typing import Annotated

from fastapi import Depends, Security
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.security import get_current_user, Auth0User


# =============================================================================
# DATABASE DEPENDENCIES
# =============================================================================

DbSession = Annotated[AsyncSession, Depends(get_db)]
"""
Async database session dependency.
Automatically manages session lifecycle (open/commit/rollback/close).

Example:
    async def get_items(db: DbSession):
        result = await db.execute(select(Item))
        return result.scalars().all()
"""


# =============================================================================
# AUTHENTICATION DEPENDENCIES (No specific scope required)
# =============================================================================

CurrentUser = Annotated[Auth0User, Security(get_current_user)]
"""
Current authenticated user dependency.
Validates JWT token and returns Auth0User object.
No specific scope required - just valid authentication.

Example:
    async def get_profile(user: CurrentUser):
        return {"user_id": user.id, "email": user.email}
"""


# =============================================================================
# AUTHORIZATION DEPENDENCIES (Require specific scopes)
# =============================================================================

AdminUser = Annotated[Auth0User, Security(get_current_user, scopes=["admin"])]
"""
Admin-only user dependency.
Requires 'admin' scope in JWT permissions.
Returns 403 Forbidden if user lacks this scope.

Example:
    async def admin_action(user: AdminUser):
        return {"message": "Admin access granted"}
"""

ClientReader = Annotated[Auth0User, Security(get_current_user, scopes=["read:clients"])]
"""
User with read access to clients.
Requires 'read:clients' scope.
"""

ClientWriter = Annotated[Auth0User, Security(get_current_user, scopes=["write:clients"])]
"""
User with write access to clients.
Requires 'write:clients' scope (create/update operations).
"""

ClientDeleter = Annotated[Auth0User, Security(get_current_user, scopes=["delete:clients"])]
"""
User with delete access to clients.
Requires 'delete:clients' scope.
"""

MetricsReader = Annotated[Auth0User, Security(get_current_user, scopes=["read:metrics"])]
"""
User with read access to metrics.
Requires 'read:metrics' scope.
"""


# =============================================================================
# TYPE ALIASES FOR DOCUMENTATION
# =============================================================================

# Re-export for type hints in other modules
__all__ = [
    "DbSession",
    "CurrentUser",
    "AdminUser",
    "ClientReader",
    "ClientWriter",
    "ClientDeleter",
    "MetricsReader",
]
