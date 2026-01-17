---
name: fastapi
description: FastAPI best practices for building modular, type-safe, and scalable APIs. Use when creating API endpoints, routers, dependencies, or security in Python.
---


## When to Use

- Creating new API endpoints or routers.
- Implementing dependency injection.
- Setting up authentication/authorization.
- Structuring a FastAPI application.

---

## Critical Patterns

### 1. Modular Routers
Use `APIRouter` to organize endpoints by domain.

```python
from fastapi import APIRouter

router = APIRouter(prefix="/items", tags=["items"])

@router.get("/")
async def read_items():
    return [{"name": "Item 1"}]
```

### 2. Dependency Injection
Use `Depends()` for reusable logic (DB sessions, auth).

```python
from typing import Annotated
from fastapi import Depends

async def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

DbDep = Annotated[Session, Depends(get_db)]
```

### 3. Type-Safe Dependencies
Use `Annotated` for reusable dependency aliases.

```python
CurrentUser = Annotated[User, Depends(get_current_user)]

@router.get("/me")
async def read_me(user: CurrentUser):
    return user
```

### 4. Security with Scopes
Use `Security()` for scope-based authorization.

```python
from fastapi import Security

@router.get("/admin")
async def admin_only(user: User = Security(get_current_user, scopes=["admin"])):
    return {"message": "Admin access granted"}
```

---

## Commands

```bash
# Run FastAPI dev server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest
```

## Resources

- **Templates**: See [assets/](assets/) for router and dependency templates.
