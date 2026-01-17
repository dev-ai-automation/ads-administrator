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
```

## Resources

- **Code**: See [backend/](../../backend/) for implementation.
- **Generic Skill**: See [fastapi/](../fastapi/) for generic patterns.
