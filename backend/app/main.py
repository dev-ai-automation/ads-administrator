"""
FastAPI Application Entry Point.

Configures the FastAPI application with:
- CORS middleware for frontend access
- API routers with versioning
- Health check endpoints
- OpenAPI documentation
"""
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.api import api_router


# =============================================================================
# LIFESPAN MANAGEMENT
# =============================================================================

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Application lifespan manager.
    
    Handles startup and shutdown events:
    - Startup: Initialize connections, caches, etc.
    - Shutdown: Clean up resources.
    """
    # Startup
    # Could initialize database connections, cache, etc.
    yield
    # Shutdown
    # Clean up resources here


# =============================================================================
# APPLICATION FACTORY
# =============================================================================

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="API for managing advertising clients and their Meta Ads metrics.",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)


# =============================================================================
# MIDDLEWARE
# =============================================================================

# CORS - Allow frontend access
# CORS - Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:10000", # Added purely for safe local testing parity
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://.*\.onrender\.com",  # Allow all Render subdomains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =============================================================================
# ROUTES
# =============================================================================

# Health check endpoint (no auth required)
@app.get(
    "/",
    tags=["health"],
    summary="Root endpoint",
    description="Returns basic API information and links to documentation.",
)
async def root() -> dict:
    """Root endpoint with API information."""
    return {
        "name": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": f"{settings.API_V1_STR}/openapi.json",
    }


@app.get(
    "/health",
    tags=["health"],
    summary="Health check",
    description="Simple health check endpoint for load balancers.",
)
async def health_check() -> dict:
    """Health check endpoint for monitoring."""
    return {"status": "healthy"}


# API v1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)
