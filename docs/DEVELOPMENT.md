# Development Guide

> **Best practices, coding standards, and workflows** for contributing to the Ads Administrator Platform.

---

## 📋 Table of Contents

- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Git Conventions](#git-conventions)
- [Testing Guidelines](#testing-guidelines)
- [API Development](#api-development)
- [Frontend Patterns](#frontend-patterns)

---

## 🔄 Development Workflow

### 1. Branch Strategy
```bash
main          # Production-ready code
├── develop   # Integration branch (optional)
└── feature/* # Feature branches
```

### 2. Feature Development Flow
```bash
# Create feature branch
git checkout -b feat/add-campaign-dashboard

# Make changes, commit frequently
git add .
git commit -m "feat(dashboard): add campaign metrics view"

# Keep branch updated
git fetch origin
git rebase origin/main

# Push and create PR
git push -u origin feat/add-campaign-dashboard
```

### 3. Code Review Checklist
- [ ] Tests pass (`pytest` & `npm test`)
- [ ] Type checking passes (`mypy` & `tsc`)
- [ ] Linting passes (`ruff` & `eslint`)
- [ ] Documentation updated
- [ ] No sensitive data in commits
- [ ] Conventional Commits format

---

## 📝 Code Standards

### Python (Backend)

#### Style Guide
- **Line Length**: 88 characters (Black default)
- **Imports**: Sorted with `isort`
- **Quotes**: Double quotes for strings
- **Type Hints**: Required for all functions

#### Example
```python
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_db
from app.models.client import Client
from app.schemas.client import ClientCreate, ClientResponse


router = APIRouter()


@router.post(
    "/",
    response_model=ClientResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a new client",
)
async def create_client(
    client_in: ClientCreate,
    db: AsyncSession = Depends(get_db),
) -> Client:
    """Create a new client with the provided data."""
    client = Client(**client_in.model_dump())
    db.add(client)
    await db.commit()
    await db.refresh(client)
    return client
```

#### Tools
```bash
# Format
black .
isort .

# Lint
ruff check .

# Type check
mypy app/
```

---

### TypeScript (Frontend)

#### Style Guide
- **Naming**: camelCase for variables/functions, PascalCase for components/types
- **Async/Await**: Preferred over `.then()`
- **Type Safety**: No `any` types in production
- **Components**: Functional components with hooks

#### Example
```typescript
import { getSession } from '@auth0/nextjs-auth0';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { clientsApi } from '@/lib/api/clients';
import { Client } from '@/types/client';

export const metadata: Metadata = {
  title: 'Clients | Ads Administrator',
};

interface ClientPageProps {
  params: { id: string };
}

export default async function ClientPage({ params }: ClientPageProps) {
  const session = await getSession();
  
  if (!session) {
    return notFound();
  }

  const client: Client = await clientsApi.get(params.id);

  return (
    <div>
      <h1>{client.name}</h1>
      {/* ... */}
    </div>
  );
}
```

#### Tools
```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit
```

---

## 🌿 Git Conventions

### Commit Message Format
We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, no logic change)
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Adding/updating tests
- `chore`: Tooling, dependencies, config
- `ci`: CI/CD changes

### Scopes
- `backend`: Backend changes
- `frontend`: Frontend changes
- `api`: API endpoints
- `auth`: Authentication
- `db`: Database
- `docs`: Documentation

### Examples
```bash
feat(api): add campaign metrics endpoint
fix(auth): resolve token expiration issue
docs: update deployment guide
chore(deps): upgrade fastapi to 0.115.1
```

---

## 🧪 Testing Guidelines

### Backend Testing

#### Test Structure
```
tests/
├── api/              # API endpoint tests
├── models/           # Database model tests
├── services/         # Business logic tests
└── conftest.py       # Shared fixtures
```

#### Example Test
```python
import pytest
from httpx import AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_create_client(client: AsyncClient, auth_headers: dict):
    """Test creating a new client."""
    payload = {
        "name": "Test Corp",
        "email": "test@example.com",
        "meta_ad_account_id": "act_123456",
    }
    
    response = await client.post(
        "/api/v1/clients",
        json=payload,
        headers=auth_headers,
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Corp"
    assert "id" in data
```

#### Run Tests
```bash
# All tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Specific file
pytest tests/api/test_clients.py

# Docker
docker-compose -f docker-compose.test.yml up --build backend-test
```

---

### Frontend Testing (Recommended Setup)

#### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardPage from '@/app/(authenticated)/dashboard/page';

describe('Dashboard', () => {
  it('renders dashboard heading', () => {
    render(<DashboardPage />);
    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
  });
});
```

---

## 🔌 API Development

### Adding a New Endpoint

#### 1. Create Schema (Pydantic)
```python
# app/schemas/campaign.py
from pydantic import BaseModel
from uuid import UUID

class CampaignResponse(BaseModel):
    id: UUID
    name: str
    status: str
```

#### 2. Create Endpoint
```python
# app/api/v1/endpoints/campaigns.py
from fastapi import APIRouter

router = APIRouter()

@router.get("/", response_model=list[CampaignResponse])
async def list_campaigns():
    # Implementation
    pass
```

#### 3. Register Router
```python
# app/api/v1/api.py
from app.api.v1.endpoints import campaigns

api_router.include_router(campaigns.router, prefix="/campaigns", tags=["campaigns"])
```

#### 4. Test
```python
# tests/api/test_campaigns.py
async def test_list_campaigns(client: AsyncClient):
    response = await client.get("/api/v1/campaigns")
    assert response.status_code == 200
```

---

## 🎨 Frontend Patterns

### Server Components (Default)
```typescript
// app/(authenticated)/dashboard/page.tsx
import { getSession } from '@auth0/nextjs-auth0';

export default async function DashboardPage() {
  const session = await getSession();
  // Fetch data server-side
  return <div>...</div>;
}
```

### Client Components (When Needed)
```typescript
'use client';

import { useState } from 'react';

export default function InteractiveWidget() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### API Integration
```typescript
// lib/api/campaigns.ts
import { apiClient } from './client';
import { Campaign } from '@/types/campaign';

export const campaignsApi = {
  list: () => apiClient<Campaign[]>('/api/v1/campaigns'),
};
```

---

## 🚀 Deployment Checklist

- [ ] All tests pass
- [ ] Type checking passes
- [ ] Linting passes
- [ ] Environment variables documented
- [ ] Database migrations created (if applicable)
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Version bumped

---

## 📚 Additional Resources

- [FastAPI Best Practices](https://fastapi.tiangolo.com/tutorial/)
- [Next.js Conventions](https://nextjs.org/docs/app/building-your-application/routing)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)

---

**Happy coding! 🎉**
