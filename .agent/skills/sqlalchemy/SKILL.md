---
name: sqlalchemy
description: Async SQLAlchemy ORM patterns for PostgreSQL databases. Use when creating database models, relationships, or session management.
---


## When to Use

- Creating database models.
- Defining relationships between tables.
- Setting up async database sessions.
- Writing database queries.

---

## Critical Patterns

### 1. Async Base Model
Use `AsyncAttrs` and `DeclarativeBase`.

```python
from sqlalchemy.ext.asyncio import AsyncAttrs
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(AsyncAttrs, DeclarativeBase):
    pass
```

### 2. Typed Columns
Use `Mapped[]` for type-safe columns.

```python
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True)
    is_active: Mapped[bool] = mapped_column(default=True)
```

### 3. Async Session Factory
Use `async_sessionmaker` with `expire_on_commit=False`.

```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker

engine = create_async_engine("postgresql+asyncpg://...")
async_session = async_sessionmaker(engine, expire_on_commit=False)

async def get_db():
    async with async_session() as session:
        yield session
```

### 4. Relationships
Use `relationship()` with `selectinload` for eager loading.

```python
from sqlalchemy.orm import relationship, selectinload

class Client(Base):
    metrics: Mapped[list["Metric"]] = relationship(back_populates="client")

# Query with eager load
stmt = select(Client).options(selectinload(Client.metrics))
```

---

## Commands

```bash
# Run migrations (with Alembic)
alembic upgrade head

# Generate new migration
alembic revision --autogenerate -m "description"
```

## Resources

- **Templates**: See [assets/](assets/) for model templates.
