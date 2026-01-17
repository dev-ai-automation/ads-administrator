---
name: docker
description: Docker and Docker Compose patterns for containerized development and deployment. Use when creating Dockerfiles, docker-compose configurations, or deployment setups.
---


## When to Use

- Creating Dockerfiles for services.
- Setting up multi-container environments.
- Configuring production deployments.
- Optimizing container images.

---

## Critical Patterns

### 1. Multi-Stage Python Dockerfile

```dockerfile
# Build stage
FROM python:3.10-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /wheels -r requirements.txt

# Production stage
FROM python:3.10-slim
WORKDIR /app
COPY --from=builder /wheels /wheels
RUN pip install --no-cache /wheels/*
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Multi-Stage Node.js Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
CMD ["node", "server.js"]
```

### 3. Docker Compose Structure

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports: ["8000:8000"]
    depends_on: [db]
    env_file: [.env]

  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    depends_on: [backend]

  db:
    image: postgres:15-alpine
    volumes: [postgres_data:/var/lib/postgresql/data]
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASS}

volumes:
  postgres_data:
```

---

## Commands

```bash
# Build and start all services
docker-compose up --build

# Stop all services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild single service
docker-compose build backend
```

## Resources

- **Templates**: See [assets/](assets/) for Dockerfile templates.
