"""
Application Configuration using YAML and JSON Schema validation.

Configuration is loaded from backend/config/settings.yaml and validated 
against backend/config/schema.json.
"""
from pathlib import Path
from typing import Any, Dict

from pydantic import BaseModel, computed_field, Field

from app.core.config_loader import load_config_yaml

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
CONFIG_PATH = BASE_DIR / "config" / "settings.yaml"
SCHEMA_PATH = BASE_DIR / "config" / "schema.json"


class Settings(BaseModel):
    """
    Application settings loaded from YAML.
    """
    # Raw config data
    _raw_config: Dict[str, Any] = {}

    def __init__(self, **data: Any):
        super().__init__(**data)

    @classmethod
    def load(cls) -> "Settings":
        """Load and validate configuration."""
        config_data = load_config_yaml(CONFIG_PATH, SCHEMA_PATH)
        
        # Flatten structure or map properties
        return cls(
            PROJECT_NAME=config_data["app"]["project_name"],
            API_V1_STR=config_data["app"]["api_v1_str"],
            DEBUG=config_data["app"]["debug"],
            AUTH0_DOMAIN=config_data["auth0"]["domain"],
            AUTH0_API_AUDIENCE=config_data["auth0"]["api_audience"],
            AUTH0_ALGORITHM=config_data["auth0"].get("algorithm", "RS256"),
            DATABASE_URL=config_data["database"].get("url"),
            POSTGRES_USER=config_data["database"].get("postgres_user"),
            POSTGRES_PASSWORD=config_data["database"].get("postgres_password"),
            POSTGRES_SERVER=config_data["database"].get("postgres_server", "localhost"),
            POSTGRES_PORT=config_data["database"].get("postgres_port", 5432),
            POSTGRES_DB=config_data["database"].get("postgres_db"),
            META_APP_ID=config_data.get("meta", {}).get("app_id"),
            META_APP_SECRET=config_data.get("meta", {}).get("app_secret"),
        )

    # Application
    PROJECT_NAME: str
    API_V1_STR: str
    DEBUG: bool
    
    # Auth0 Configuration
    AUTH0_DOMAIN: str
    AUTH0_API_AUDIENCE: str
    AUTH0_ALGORITHM: str
    
    # Database Configuration
    DATABASE_URL: str | None
    POSTGRES_USER: str | None
    POSTGRES_PASSWORD: str | None
    POSTGRES_SERVER: str
    POSTGRES_PORT: int
    POSTGRES_DB: str | None

    # Meta Ads Configuration
    META_APP_ID: str | None
    META_APP_SECRET: str | None

    @computed_field  # type: ignore[prop-decorator]
    @property
    def ASYNC_DATABASE_URL(self) -> str:
        """Get async PostgreSQL connection URL."""
        if self.DATABASE_URL:
            url = self.DATABASE_URL
            if url.startswith("postgresql://"):
                url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
            elif url.startswith("postgres://"):
                url = url.replace("postgres://", "postgresql+asyncpg://", 1)
            return url
        
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


# Singleton instance
try:
    settings = Settings.load()
except Exception as e:
    # Fail early if configuration is invalid
    print(f"CRITICAL: Failed to load configuration: {e}")
    raise