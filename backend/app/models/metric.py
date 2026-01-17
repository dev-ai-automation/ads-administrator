"""
Metric Model - Stores advertising performance metrics from various platforms.

Uses SQLAlchemy 2.0+ patterns with explicit relationship configuration
for selectinload() optimization to prevent N+1 query problems.
"""
from datetime import datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import ForeignKey, String, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.client import Client


class Metric(Base):
    """
    Advertising performance metric entity.
    
    Stores daily aggregated metrics from advertising platforms (Meta, Google, etc.).
    Uses JSONB for flexible storage of platform-specific breakdown data.
    
    Attributes:
        client_id: Foreign key to the owning client.
        date: Date of the metric (daily granularity).
        platform: Source platform identifier ('meta', 'google', etc.).
        impressions: Number of ad impressions.
        clicks: Number of ad clicks.
        spend: Advertising spend in USD.
        leads: Number of leads/conversions.
        raw_data: Platform-specific breakdown data.
    """
    __tablename__ = "metrics"

    # Primary Key
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Foreign Key with index for efficient joins
    client_id: Mapped[int] = mapped_column(
        ForeignKey("clients.id", ondelete="CASCADE"),
        index=True,
    )
    
    # Time & Platform
    date: Mapped[datetime] = mapped_column(index=True)
    platform: Mapped[str] = mapped_column(String(50), index=True)
    
    # Standard Metrics
    impressions: Mapped[int] = mapped_column(default=0)
    clicks: Mapped[int] = mapped_column(default=0)
    spend: Mapped[float] = mapped_column(default=0.0)
    leads: Mapped[int] = mapped_column(default=0)
    
    # Flexible Storage (JSONB for PostgreSQL efficiency, JSON for SQLite tests)
    raw_data: Mapped[dict] = mapped_column(
        JSON().with_variant(JSONB, "postgresql"), 
        default=dict, 
        server_default="{}"
    )
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # Relationship - Use selectinload(Metric.client) to avoid N+1
    client: Mapped["Client"] = relationship(
        back_populates="metrics",
        lazy="raise",  # Force explicit loading to catch N+1 issues
    )

    def __repr__(self) -> str:
        return f"<Metric(id={self.id}, client_id={self.client_id}, date={self.date}, platform='{self.platform}')>"
