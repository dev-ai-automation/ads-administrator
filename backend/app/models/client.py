"""
Client Model - Represents advertising clients with their platform configurations.
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import String, Text, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.metric import Metric


class Client(Base):
    """
    Client entity for managing advertising accounts.
    
    Attributes:
        name: Display name for the client.
        slug: URL-friendly identifier for metrics sources.
        active: Whether the client is currently active.
        meta_ad_account_id: Facebook/Meta Ads account ID.
        meta_access_token: Access token for Meta API (should be encrypted in production).
        config: Flexible JSON configuration storage.
    """
    __tablename__ = "clients"

    # Primary Key
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Core Fields
    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    slug: Mapped[Optional[str]] = mapped_column(String(100), unique=True, index=True)
    active: Mapped[bool] = mapped_column(default=True)
    
    # Meta Ads Configuration
    meta_ad_account_id: Mapped[Optional[str]] = mapped_column(String(50))
    meta_access_token: Mapped[Optional[str]] = mapped_column(Text)  # Encrypt in production
    
    # Flexible Configuration (JSONB for PostgreSQL efficiency, JSON for SQLite tests)
    config: Mapped[dict] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"), 
        default=dict, 
        server_default="{}"
    )
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(onupdate=datetime.utcnow)
    
    # Relationships - Use selectinload(Client.metrics) to avoid N+1
    metrics: Mapped[list["Metric"]] = relationship(
        back_populates="client",
        lazy="raise",  # Force explicit loading to catch N+1 issues
        cascade="all, delete-orphan",
    )

    def __repr__(self) -> str:
        return f"<Client(id={self.id}, name='{self.name}', active={self.active})>"
