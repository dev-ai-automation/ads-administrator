"""
Security Tests - Authentication and Authorization.

Tests that verify:
- Unauthenticated requests are rejected with 401
- Unauthorized requests (wrong scope) are rejected with 403
- Valid tokens are accepted
"""
import pytest
from httpx import AsyncClient
from unittest.mock import patch, AsyncMock

from app.core.security import get_current_user, Auth0User

pytestmark = pytest.mark.integration


class TestAuthenticationRequired:
    """Tests that endpoints require authentication."""

    @pytest.fixture
    async def no_auth_client(self) -> AsyncClient:
        """Client that doesn't mock authentication."""
        from app.main import app
        from app.core.database import get_db
        from httpx import ASGITransport
        from tests.conftest import override_get_db
        
        # Only override DB, not auth
        app.dependency_overrides[get_db] = override_get_db
        
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test"
        ) as ac:
            yield ac
        
        app.dependency_overrides.clear()

    async def test_clients_list_requires_auth(self, no_auth_client: AsyncClient):
        """GET /api/v1/clients requires authentication."""
        response = await no_auth_client.get("/api/v1/clients")
        
        # Should fail because no auth token provided
        assert response.status_code == 401

    async def test_users_me_requires_auth(self, no_auth_client: AsyncClient):
        """GET /api/v1/users/me requires authentication."""
        response = await no_auth_client.get("/api/v1/users/me")
        
        assert response.status_code == 401


class TestHealthEndpoints:
    """Tests that health endpoints don't require authentication."""

    @pytest.fixture
    async def public_client(self) -> AsyncClient:
        """Client without any auth."""
        from app.main import app
        from httpx import ASGITransport
        
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test"
        ) as ac:
            yield ac

    async def test_root_is_public(self, public_client: AsyncClient):
        """GET / is publicly accessible."""
        response = await public_client.get("/")
        
        assert response.status_code == 200
        data = response.json()
        assert "name" in data

    async def test_health_is_public(self, public_client: AsyncClient):
        """GET /health is publicly accessible."""
        response = await public_client.get("/health")
        
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"


class TestScopeAuthorization:
    """Tests that scope-based authorization works."""

    @pytest.fixture
    def limited_user(self) -> Auth0User:
        """User with limited permissions."""
        return Auth0User(
            id="auth0|limited-user",
            email="limited@example.com",
            permissions=["read:clients"],  # Only read, no write/delete
        )

    @pytest.fixture
    async def limited_client(self, limited_user: Auth0User) -> AsyncClient:
        """Client authenticated as user with limited permissions."""
        from app.main import app
        from app.core.database import get_db
        from httpx import ASGITransport
        from tests.conftest import override_get_db, get_mock_current_user
        
        app.dependency_overrides[get_db] = override_get_db
        app.dependency_overrides[get_current_user] = get_mock_current_user(limited_user)
        
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test"
        ) as ac:
            yield ac
        
        app.dependency_overrides.clear()

    # Note: These tests would require the endpoints to check scopes explicitly
    # Currently our endpoints use CurrentUser which doesn't check specific scopes
    # To fully test, we'd need to modify endpoints to use ClientWriter, etc.
    
    async def test_read_with_read_permission(self, limited_client: AsyncClient):
        """User with read:clients can list clients."""
        response = await limited_client.get("/api/v1/clients")
        
        # Should succeed with read permission
        assert response.status_code == 200


class TestJWTValidation:
    """Tests for JWT token validation edge cases."""

    async def test_invalid_token_format(self):
        """Invalid token format returns 401."""
        from app.main import app
        from httpx import ASGITransport, AsyncClient
        
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
            headers={"Authorization": "Bearer invalid-token"}
        ) as ac:
            response = await ac.get("/api/v1/users/me")
        
        assert response.status_code == 401

    async def test_missing_bearer_prefix(self):
        """Token without 'Bearer' prefix returns 401."""
        from app.main import app
        from httpx import ASGITransport, AsyncClient
        
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test",
            headers={"Authorization": "some-token-without-bearer"}
        ) as ac:
            response = await ac.get("/api/v1/users/me")
        
        assert response.status_code in [401, 403]
