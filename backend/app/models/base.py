"""
Base SQLAlchemy Model with async support and naming conventions.
All models should inherit from this Base class.
"""
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy import MetaData

# Consistent naming convention for database constraints
naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
}


class Base(AsyncAttrs, DeclarativeBase):
    """
    Base class for all SQLAlchemy models.
    - AsyncAttrs: Enables awaitable attribute access for relationships in async context.
    - Naming Convention: Ensures consistent constraint naming for Alembic migrations.
    """
    metadata = MetaData(naming_convention=naming_convention)
