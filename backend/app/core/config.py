"""
Application Configuration using Pydantic Settings v2.

All configuration is loaded from environment variables or .env file.
Uses the modern SettingsConfigDict pattern for strict validation.
"""
from pydantic import computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings with strict type validation.
    
    Environment variables are automatically loaded and type-coerced.
    Required fields without defaults must be set in the environment.
    """
    model_config = SettingsConfigDict(
        case_sensitive=True,
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",  # Ignore extra env vars not defined here
    )

    # Application
    PROJECT_NAME: str = "Ads Administrator"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
    
    # Auth0 Configuration
    AUTH0_DOMAIN: str
    AUTH0_API_AUDIENCE: str
    AUTH0_ALGORITHM: str = "RS256"
    
    # Database Configuration
    # Option 1: Use DATABASE_URL directly (Render, production)
    DATABASE_URL: str | None = None
    
    # Option 2: Use individual fields (local development)
    POSTGRES_USER: str | None = None
    POSTGRES_PASSWORD: str | None = None
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str | None = None

    # Meta Ads Configuration
    META_APP_ID: str | None = None
    META_APP_SECRET: str | None = None

    @computed_field  # type: ignore[prop-decorator]
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """
        Get async PostgreSQL connection URL.
        
        Priority:
        1. Use DATABASE_URL if provided (Render deployment)
        2. Construct from individual fields (local development)
        """
        if self.DATABASE_URL:
            # If using Render's DATABASE_URL, ensure it uses asyncpg driver
            url = self.DATABASE_URL
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            return url
        
        # Construct from individual fields for local development
        if not all([self.POSTGRES_USER, self.POSTGRES_PASSWORD, self.POSTGRES_DB]):
            raise ValueError(
                "Either DATABASE_URL or all of (POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB) must be set"
            )
        
        return (
            f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )
    
    @computed_field  # type: ignore[prop-decorator]
    @property
    def AUTH0_ISSUER(self) -> str:
        """Construct Auth0 issuer URL."""
        return f"https://{self.AUTH0_DOMAIN}/"
    
    @computed_field  # type: ignore[prop-decorator]
    @property
    def AUTH0_JWKS_URL(self) -> str:
        """Construct Auth0 JWKS URL for JWT validation."""
        return f"https://{self.AUTH0_DOMAIN}/.well-known/jwks.json"


settings = Settings()
