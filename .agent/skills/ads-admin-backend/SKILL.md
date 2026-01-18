---
name: ads-admin-backend
description: Project-specific backend rules for Ads Administrator API. Use when working on backend code, API endpoints, or backend services.
---


## When to Use

- Creating or modifying API endpoints.
- Working with authentication (Auth0).
- Integrating external APIs (Meta Ads).
- Managing database models.

---

## Critical Patterns

### Project Structure

```
backend/
├── alembic/                 # Database migrations
│   ├── versions/            # Migration scripts
│   └── env.py               # Alembic config for async SQLAlchemy
├── alembic.ini              # Alembic configuration
├── app/
│   ├── main.py              # FastAPI app entry
│   ├── api/v1/              # API routers
│   │   ├── api.py           # Router aggregator
│   │   └── endpoints/       # Individual routers
│   ├── core/
│   │   ├── config.py        # Pydantic Settings
│   │   ├── security.py      # Auth0 JWT validation
│   │   └── database.py      # Async session factory
│   ├── models/              # SQLAlchemy models
│   └── services/            # Business logic (Meta API)
├── Dockerfile
└── requirements.txt
```

### Auth0 Integration

```python
from app.core.security import get_current_user, Auth0User
from fastapi import Security

@router.get("/protected")
async def protected(user: Auth0User = Security(get_current_user)):
    return {"user_id": user.id}
```

### Meta Ads Service

```python
from app.services.meta_service import MetaService

service = MetaService(access_token=client.meta_access_token)
insights = service.get_insights(client.meta_ad_account_id)
```

---

## Commands

```bash
# Run dev server
cd backend && uvicorn app.main:app --reload

# Run tests
cd backend && pytest

# Install dependencies
cd backend && pip install -r requirements.txt

# Database Migrations
cd backend && alembic upgrade head           # Apply all migrations
cd backend && alembic downgrade -1           # Rollback one migration
cd backend && alembic revision --autogenerate -m "description"  # Generate migration
cd backend && alembic current                 # Show current revision
cd backend && alembic history                 # Show migration history
```

## Resources

- **Code**: See [backend/](../../backend/) for implementation.
- **Generic Skill**: See [fastapi/](../fastapi/) for generic patterns.
