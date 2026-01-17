from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase
from datetime import datetime


class Base(AsyncAttrs, DeclarativeBase):
    """Base model with async support."""
    pass


class ExampleModel(Base):
    """Template for a new database model."""
    __tablename__ = "example"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    is_active: Mapped[bool] = mapped_column(default=True)

    # Example foreign key relationship
    # parent_id: Mapped[int] = mapped_column(ForeignKey("parent.id"))
    # parent: Mapped["Parent"] = relationship(back_populates="children")
