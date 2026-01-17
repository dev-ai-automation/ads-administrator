---
name: ads-admin-orchestrator
description: Root orchestrator for Ads Administrator. Governs all sub-skills and defines project-wide standards. Use when starting any work on this project or needing architectural guidance.
---


## When to Use

- Starting any development task in this project.
- Needing clarity on project architecture or conventions.
- Delegating work to specialized skills.

---

## Critical Patterns

| Pattern | Rule |
|---------|------|
| **Stack** | FastAPI (Backend), Next.js (Frontend), PostgreSQL (DB), Docker (Infra) |
| **Auth** | Auth0 for all authentication (JWT validation in backend, SDK in frontend) |
| **Type Safety** | 100% type hints (Python), strict TypeScript (Frontend) |
| **API Design** | RESTful, versioned (`/api/v1/`), modular routers |
| **Testing** | `pytest` (backend), `vitest` (frontend) |

---

## Skill Delegation

| Skill | Path | Purpose |
|-------|------|---------|
| `fastapi` | [skills/fastapi/](fastapi/) | Generic FastAPI patterns |
| `nextjs` | [skills/nextjs/](nextjs/) | Generic Next.js patterns |
| `sqlalchemy` | [skills/sqlalchemy/](sqlalchemy/) | Database ORM patterns |
| `docker` | [skills/docker/](docker/) | Containerization patterns |
| `ads-admin-backend` | [skills/ads-admin-backend/](ads-admin-backend/) | Project backend specifics |
| `ads-admin-frontend` | [skills/ads-admin-frontend/](ads-admin-frontend/) | Project frontend specifics |
| `ads-admin-devops` | [skills/ads-admin-devops/](ads-admin-devops/) | Project deployment |

---

## Commands

```bash
# Start development environment
docker-compose up --build

# Run backend tests
cd backend && pytest

# Run frontend dev server
cd frontend && npm run dev
```

## Resources

- **Skill Registry**: See [AGENTS.md](AGENTS.md)
