"""
Client API Integration Tests.

Tests the full request -> response cycle for client endpoints.
"""
import pytest
from httpx import AsyncClient

pytestmark = pytest.mark.integration


class TestListClients:
    """Tests for GET /api/v1/clients."""

    async def test_list_clients_empty(self, client: AsyncClient):
        """Returns empty list when no clients exist."""
        response = await client.get("/api/v1/clients")
        
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["total"] == 0
        assert data["page"] == 1

    async def test_list_clients_with_data(
        self, client: AsyncClient, sample_client_data: dict
    ):
        """Returns clients after creation."""
        # Create a client first
        await client.post("/api/v1/clients", json=sample_client_data)
        
        response = await client.get("/api/v1/clients")
        
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert len(data["items"]) == 1
        assert data["items"][0]["name"] == sample_client_data["name"]

    async def test_list_clients_pagination(self, client: AsyncClient):
        """Pagination works correctly."""
        # Create multiple clients
        for i in range(15):
            await client.post("/api/v1/clients", json={
                "name": f"Client {i}",
                "slug": f"client-{i}",
                "active": True,
            })
        
        # Get first page
        response = await client.get("/api/v1/clients", params={"page": 1, "page_size": 10})
        
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 15
        assert len(data["items"]) == 10
        assert data["page"] == 1
        assert data["page_size"] == 10

    async def test_list_clients_active_only(
        self, client: AsyncClient, sample_client_data: dict
    ):
        """Filter by active status works."""
        # Create active and inactive clients
        await client.post("/api/v1/clients", json={**sample_client_data, "slug": "active-1"})
        await client.post("/api/v1/clients", json={
            **sample_client_data, 
            "slug": "inactive-1",
            "active": False
        })
        
        response = await client.get("/api/v1/clients", params={"active_only": True})
        
        response = await client.get("/api/v1/clients", params={"active_only": True})
        
        assert response.status_code == 200
        data = response.json()
        assert data["total"] == 1
        assert data["items"][0]["active"] is True


class TestGetClient:
    """Tests for GET /api/v1/clients/{id}."""

    async def test_get_client_success(
        self, client: AsyncClient, sample_client_data: dict
    ):
        """Returns client by ID."""
        # Create client
        create_response = await client.post("/api/v1/clients", json=sample_client_data)
        client_id = create_response.json()["id"]
        
        response = await client.get(f"/api/v1/clients/{client_id}")
        
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == client_id
        assert data["name"] == sample_client_data["name"]

    async def test_get_client_not_found(self, client: AsyncClient):
        """Returns 404 for non-existent client."""
        response = await client.get("/api/v1/clients/99999")
        
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


class TestCreateClient:
    """Tests for POST /api/v1/clients."""

    async def test_create_client_success(
        self, client: AsyncClient, sample_client_data: dict
    ):
        """Creates client with valid data."""
        response = await client.post("/api/v1/clients", json=sample_client_data)
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == sample_client_data["name"]
        assert data["slug"] == sample_client_data["slug"]
        assert "id" in data
        assert "created_at" in data

    async def test_create_client_minimal(self, client: AsyncClient):
        """Creates client with minimal required data."""
        response = await client.post("/api/v1/clients", json={
            "name": "Minimal Client",
            "active": True,
        })
        
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == "Minimal Client"

    async def test_create_client_duplicate_slug(
        self, client: AsyncClient, sample_client_data: dict
    ):
        """Returns 409 for duplicate slug."""
        await client.post("/api/v1/clients", json=sample_client_data)
        
        response = await client.post("/api/v1/clients", json=sample_client_data)
        
        assert response.status_code == 409

    async def test_create_client_invalid_slug(self, client: AsyncClient):
        """Returns 422 for invalid slug format."""
        response = await client.post("/api/v1/clients", json={
            "name": "Test",
            "slug": "Invalid Slug!",  # Invalid characters
            "active": True,
        })
        
        assert response.status_code == 422


class TestUpdateClient:
    """Tests for PATCH /api/v1/clients/{id}."""

    async def test_update_client_success(
        self, client: AsyncClient, sample_client_data: dict
    ):
        """Updates client with partial data."""
        create_response = await client.post("/api/v1/clients", json=sample_client_data)
        client_id = create_response.json()["id"]
        
        response = await client.patch(f"/api/v1/clients/{client_id}", json={
            "name": "Updated Name"
        })
        
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Updated Name"
        assert data["slug"] == sample_client_data["slug"]  # Unchanged

    async def test_update_client_not_found(self, client: AsyncClient):
        """Returns 404 for non-existent client."""
        response = await client.patch("/api/v1/clients/99999", json={"name": "New"})
        
        assert response.status_code == 404


class TestDeleteClient:
    """Tests for DELETE /api/v1/clients/{id}."""

    async def test_delete_client_success(
        self, client: AsyncClient, sample_client_data: dict
    ):
        """Deletes client successfully."""
        create_response = await client.post("/api/v1/clients", json=sample_client_data)
        client_id = create_response.json()["id"]
        
        response = await client.delete(f"/api/v1/clients/{client_id}")
        
        assert response.status_code == 204
        
        # Verify deleted
        get_response = await client.get(f"/api/v1/clients/{client_id}")
        assert get_response.status_code == 404

    async def test_delete_client_not_found(self, client: AsyncClient):
        """Returns 404 for non-existent client."""
        response = await client.delete("/api/v1/clients/99999")
        
        assert response.status_code == 404
