"""
User API Integration Tests.
"""
import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.integration


class TestUserProfile:
    """Tests for GET /api/v1/users/me."""

    async def test_get_profile_success(self, client: AsyncClient, mock_user):
        """Returns current user profile."""
        response = await client.get("/api/v1/users/me")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == mock_user.id
        assert data["email"] == mock_user.email
        assert data["permissions"] == mock_user.permissions

    async def test_get_profile_admin(self, admin_client: AsyncClient, mock_admin_user):
        """Returns admin user profile with admin permissions."""
        response = await admin_client.get("/api/v1/users/me")
        
        assert response.status_code == 200
        data = response.json()
        assert "admin" in data["permissions"]


class TestUserPermissions:
    """Tests for GET /api/v1/users/me/permissions."""

    async def test_get_permissions(self, client: AsyncClient, mock_user):
        """Returns user permissions list."""
        response = await client.get("/api/v1/users/me/permissions")
        
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert "read:clients" in data
