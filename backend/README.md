# Backend - Ads Administrator API

> **FastAPI-based REST API** for managing advertising clients and Meta Ads metrics with Auth0 authentication.

---

## 📋 Overview

The backend provides a secure, high-performance API layer that:
- Authenticates users via Auth0 JWT tokens
- Manages client and campaign data in PostgreSQL
- Integrates with Meta Ads API for real-time metrics
- Exposes OpenAPI-compliant REST endpoints

---

## 🏗️ Architecture

### Project Structure
```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── api.py              # Main API router
│   │       └── endpoints/          # Route handlers
│   │           ├── clients.py      # Client management
│   │           ├── metrics.py      # Meta Ads metrics
│   │           └── users.py        # User endpoints
│   ├── core/
│   │   ├── config.py               # Settings (env vars)
│   │   ├── security.py             # Auth0 verification
│   │   └── deps.py                 # FastAPI dependencies
│   ├── models/
│   │   ├── client.py               # Client ORM model
│   │   └── user.py                 # User ORM model
│   └── services/
│       └── meta_ads.py             # Meta Ads service
├── tests/                          # Pytest test suite
│   ├── api/                        # API endpoint tests
│   └── conftest.py                 # Test fixtures
├── Dockerfile
├── requirements.txt
└── pyproject.toml                  # Project metadata & tools
```

---

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.115+
- **Server**: Uvicorn (ASGI)
- **ORM**: SQLAlchemy 2.0 (async)
- **Database Driver**: asyncpg
- **Authentication**: python-jose (JWT)
- **Validation**: Pydantic 2.0
- **Testing**: pytest, pytest-asyncio
- **Ads Integration**: facebook_business SDK

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment
Create `.env` file:
```bash
cp .env.example .env
```

Required variables:
```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/ads_admin

# Auth0
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_API_AUDIENCE=https://api.ads-admin.com

# Optional
SECRET_KEY=your-secret-key
ALGORITHM=HS256
```

### 3. Run Server
```bash
# Development
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn app.main:app --host 0.0.0.0 --port 10000 --workers 4
```

### 4. Access API Documentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **OpenAPI JSON**: `http://localhost:8000/api/v1/openapi.json`

---

## 🧪 Testing

### Run All Tests
```bash
# Local
pytest

# Coverage report
pytest --cov=app --cov-report=html

# Docker
docker-compose -f ../docker-compose.test.yml up --build backend-test
```

### Test Structure
- `tests/api/` - API endpoint tests
- `tests/models/` - Database model tests
- `tests/services/` - Business logic tests

---

## 🔐 Authentication

All protected endpoints require a valid Auth0 JWT token:

```bash
curl -H "Authorization: Bearer <TOKEN>" \
     http://localhost:8000/api/v1/clients
```

### Token Validation
- Verifies signature using Auth0 public key
- Checks audience matches `AUTH0_API_AUDIENCE`
- Validates expiration and claims

---

## 📡 Key Endpoints

| Method | Endpoint | Description | Auth |
|:-------|:---------|:------------|:-----|
| `GET` | `/` | API info | ❌ |
| `GET` | `/health` | Health check | ❌ |
| `GET` | `/api/v1/clients` | List clients | ✅ |
| `POST` | `/api/v1/clients` | Create client | ✅ |
| `GET` | `/api/v1/metrics/campaigns` | Campaign metrics | ✅ |
| `GET` | `/api/v1/users/me` | Current user | ✅ |

---

## 🗄️ Database Models

### Client
```python
class Client(Base):
    __tablename__ = "clients"
    
    id: UUID (PK)
    name: str
    email: str
    meta_ad_account_id: str
    created_at: datetime
    updated_at: datetime
```

### User
```python
class User(Base):
    __tablename__ = "users"
    
    id: UUID (PK)
    auth0_id: str (unique)
    email: str
    created_at: datetime
```

---

## 🔧 Configuration

Settings are managed via Pydantic Settings in `app/core/config.py`:

```python
class Settings(BaseSettings):
    PROJECT_NAME: str = "Ads Administrator API"
    API_V1_STR: str = "/api/v1"
    DATABASE_URL: str
    AUTH0_DOMAIN: str
    AUTH0_API_AUDIENCE: str
    
    class Config:
        env_file = ".env"
```

---

## 📝 Development Notes

### Code Style
- **Formatter**: Black (line length 88)
- **Linter**: Ruff
- **Type Checker**: mypy
- **Imports**: isort

### Best Practices
- Use async/await for all I/O operations
- Dependency injection via FastAPI `Depends()`
- Pydantic schemas for request/response validation
- Comprehensive error handling with HTTP exceptions

---

## 🐳 Docker

Build and run via Docker:
```bash
# Build image
docker build -t ads-backend .

# Run container
docker run -p 8000:8000 --env-file .env ads-backend
```

---

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy 2.0 Guide](https://docs.sqlalchemy.org/en/20/)
- [Auth0 FastAPI Integration](https://auth0.com/docs/quickstart/backend/python)
- [Meta Ads API Reference](https://developers.facebook.com/docs/marketing-apis)

---

**For deployment instructions, see [../docs/TECHNICAL_DEEP_DIVE.md](../docs/TECHNICAL_DEEP_DIVE.md)**
