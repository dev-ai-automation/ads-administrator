---
name: ads-admin-devops
description: Project-specific DevOps rules for Ads Administrator deployment. Use when working on Docker, deployment, or CI/CD configurations.
---


## When to Use

- Configuring Docker or docker-compose.
- Setting up Render.com deployment.
- Managing environment variables.
- Troubleshooting container issues.

---

## Critical Patterns

### Docker Compose Services

| Service | Port | Image/Build |
|---------|------|-------------|
| `backend` | 8000 | `./backend` |
| `frontend` | 3000 | `./frontend` |
| `db` | 5432 | `postgres:15-alpine` |

### Environment Variables

**Backend (.env)**:
```
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_API_AUDIENCE=https://ads-admin-api
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_SERVER=db
POSTGRES_DB=ads_admin
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
```

**Frontend (.env.local)**:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AUTH0_DOMAIN=your-tenant.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
```

### Render.com Deployment
- Use `render.yaml` blueprint for auto-deployment.
- Services: `ads-backend` (Python), `ads-frontend` (Node), `ads-db` (Postgres).

---

## Commands

```bash
# Start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild specific service
docker-compose build frontend
```

## Resources

- **Config Files**: See [docker-compose.yml](../../docker-compose.yml), [render.yaml](../../render.yaml).
- **Generic Skill**: See [docker/](../docker/) for generic patterns.
