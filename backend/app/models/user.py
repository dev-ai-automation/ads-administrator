"""
User Model - Represents application users synchronized with Auth0.

Uses SQLAlchemy 2.0+ patterns with Mapped[] type hints for full type safety.
"""
from datetime import datetime
from typing import Optional

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base


class User(Base):
    """
    Application user entity synchronized with Auth0.
    
    Attributes:
        email: User's email address (unique).
        auth0_sub: Auth0 user ID from 'sub' claim (unique).
        is_active: Whether user can access the system.
        is_superuser: Whether user has admin privileges.
        full_name: Display name for the user.
    """
    __tablename__ = "users"

    # Primary Key
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Auth0 Integration
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    auth0_sub: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    
    # Status Flags
    is_active: Mapped[bool] = mapped_column(default=True)
    is_superuser: Mapped[bool] = mapped_column(default=False)
    
    # Profile
    full_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[Optional[datetime]] = mapped_column(onupdate=datetime.utcnow)

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email='{self.email}', is_active={self.is_active})>"
