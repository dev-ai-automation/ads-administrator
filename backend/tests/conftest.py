"""
Pytest Configuration and Fixtures.

This module contains shared fixtures for all tests:
- Database session with SQLite in-memory
- FastAPI test client
- Mock authentication
- Mock external services
"""
import asyncio
from typing import AsyncGenerator, Generator
from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy import StaticPool
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import settings
from app.core.database import get_db
from app.core.security import Auth0User, get_current_user
from app.main import app
from app.models.base import Base


# =============================================================================
# DATABASE FIXTURES
# =============================================================================

# Use SQLite in-memory for fast tests
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

test_engine = create_async_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = async_sessionmaker(
    bind=test_engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autoflush=False,
)


@pytest.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create a fresh database session for each test.
    
    Creates all tables before the test and drops them after.
    """
    # Create tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with TestingSessionLocal() as session:
        yield session
    
    # Drop tables
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
    """Override dependency for FastAPI."""
    async with TestingSessionLocal() as session:
        yield session


# =============================================================================
# AUTHENTICATION FIXTURES
# =============================================================================

@pytest.fixture
def mock_user() -> Auth0User:
    """Create a mock authenticated user."""
    return Auth0User(
        id="auth0|test-user-123",
        email="test@example.com",
        permissions=["read:clients", "write:clients", "read:metrics"],
    )


@pytest.fixture
def mock_admin_user() -> Auth0User:
    """Create a mock admin user with all permissions."""
    return Auth0User(
        id="auth0|admin-user-456",
        email="admin@example.com",
        permissions=["admin", "read:clients", "write:clients", "delete:clients", "read:metrics"],
    )


def get_mock_current_user(user: Auth0User):
    """Factory to create a mock get_current_user dependency."""
    async def mock_get_current_user() -> Auth0User:
        return user
    return mock_get_current_user


# =============================================================================
# HTTP CLIENT FIXTURES
# =============================================================================

@pytest.fixture
async def client(db_session: AsyncSession, mock_user: Auth0User) -> AsyncGenerator[AsyncClient, None]:
    """
    Create an async HTTP client for testing FastAPI endpoints.
    
    Automatically:
    - Uses test database
    - Mocks authentication as regular user
    """
    # Override dependencies
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = get_mock_current_user(mock_user)
    
    # Ensure tables exist
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac
    
    # Cleanup overrides
    app.dependency_overrides.clear()


@pytest.fixture
async def admin_client(db_session: AsyncSession, mock_admin_user: Auth0User) -> AsyncGenerator[AsyncClient, None]:
    """HTTP client authenticated as admin user."""
    app.dependency_overrides[get_db] = override_get_db
    app.dependency_overrides[get_current_user] = get_mock_current_user(mock_admin_user)
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac
    
    app.dependency_overrides.clear()


@pytest.fixture
async def unauthenticated_client() -> AsyncGenerator[AsyncClient, None]:
    """HTTP client without authentication (for testing 401 responses)."""
    # Don't override get_current_user - let it validate (and fail)
    app.dependency_overrides[get_db] = override_get_db
    
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        yield ac
    
    app.dependency_overrides.clear()


# =============================================================================
# MOCK EXTERNAL SERVICES
# =============================================================================

@pytest.fixture(autouse=True)
def mock_auth0_jwks():
    """Mock Auth0 JWKS endpoint silently for all tests."""
    mock_jwks = {
        "keys": [
            {
                "kty": "RSA",
                "kid": "test-key-id",
                "use": "sig",
                "n": "test-n-value",
                "e": "AQAB",
            }
        ]
    }
    
    # Create an AsyncMock that returns the dictionary
    async_mock = AsyncMock(return_value=mock_jwks)
    
    with patch("app.core.security._get_jwks", side_effect=async_mock):
        yield mock_jwks


@pytest.fixture
def mock_meta_service():
    """Mock Meta Ads API service."""
    mock = AsyncMock()
    mock.get_insights.return_value = [
        {
            "impressions": "1500",
            "clicks": "45",
            "spend": "75.50",
            "actions": [{"action_type": "lead", "value": "3"}],
            "date_start": "2024-01-01",
            "date_stop": "2024-01-31",
        }
    ]
    
    with patch("app.services.meta_service.MetaService", return_value=mock):
        yield mock


# =============================================================================
# DATA FIXTURES
# =============================================================================

@pytest.fixture
def sample_client_data() -> dict:
    """Sample data for creating a client."""
    return {
        "name": "Test Client",
        "slug": "test-client",
        "active": True,
        "meta_ad_account_id": "act_123456789",
        "config": {"timezone": "America/New_York"},
    }


@pytest.fixture
def sample_metric_data() -> dict:
    """Sample data for creating a metric."""
    return {
        "client_id": 1,
        "date": "2024-01-15T00:00:00Z",
        "platform": "meta",
        "impressions": 1500,
        "clicks": 45,
        "spend": 75.50,
        "leads": 3,
        "raw_data": {"campaign_id": "123"},
    }
