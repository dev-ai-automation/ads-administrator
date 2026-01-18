# Backend - Ads Administrator API

> **High-Performance FastAPI REST API** utilizing modern configuration standards (YAML/JSON Schema) and scoped Auth0 authorization.

---

## 📋 Overview

The backend provides a secure, production-grade API layer:
- **Scoped RBAC**: Fine-grained access control (`read:metrics`, `admin`, etc.).
- **Modern Config**: Decoupled configuration using YAML and strict JSON Schema validation.
- **Async Core**: 100% asynchronous I/O with SQLAlchemy 2.0 and FastAPI.
- **Contract-First**: Pydantic v2 schemas for rock-solid request/response validation.

---

## 🏗️ Architecture

### Project Structure
```
backend/
├── app/
│   ├── api/v1/                     # API routes and endpoints
│   ├── core/
│   │   ├── config.py               # Singleton Settings (from YAML)
│   │   ├── config_loader.py        # YAML loader with Env expansion
│   │   ├── security.py             # Auth0 JWT verification
│   │   └── deps.py                 # Scoped Dependency Injection
│   ├── models/                     # SQLAlchemy 2.0 Async models
│   └── services/                   # Business logic and external SDKs
├── config/
│   ├── settings.yaml               # Application configuration
│   └── schema.json                 # Configuration validation schema
├── tests/                          # Comprehensive Pytest suite
│   ├── api/                        # Endpoint tests
│   └── test_config.py              # Configuration validation tests
├── alembic/                        # Database migration scripts
├── Dockerfile
└── requirements.txt
```

---

## 🛠️ Tech Stack

- **Framework**: FastAPI 0.128.0+
- **Database**: PostgreSQL (SQLAlchemy 2.0 / asyncpg)
- **Config**: PyYAML + jsonschema
- **Validation**: Pydantic 2.12
- **Testing**: pytest + pytest-asyncio
- **Security**: python-jose (Auth0 Integration)

---

## 🔧 Configuration System (YAML)

We've moved away from standard `.env` flat files to a structured YAML system in `backend/config/`.

### 1. Structure
Settings are defined in `settings.yaml` and validated against `schema.json` during application startup.

### 2. Environment Variables
The YAML loader supports `${VAR:-default}` syntax, allowing seamless environment variable expansion:
```yaml
app:
  debug: ${DEBUG:-false}
auth0:
  domain: ${AUTH0_DOMAIN}
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
pip install -r requirements-dev.txt
```

### 2. Configure Environment
Set required env vars (refer to `backend/.env.example`):
```bash
export AUTH0_DOMAIN=...
export AUTH0_API_AUDIENCE=...
export DATABASE_URL=...
```

### 3. Run Server
```bash
# Production-like with Uvicorn
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

---

## 🧪 Testing

### Config Validation Tests
Ensures the configuration loader and schema are working correctly:
```bash
python -m pytest tests/test_config.py
```

### API Integration Tests
```bash
python -m pytest tests/api/
```

---

## 🔐 Scoped Authorization

Endpoints use `Annotated` dependencies to enforce Auth0 scopes:

- `CurrentUser`: Any authenticated user.
- `MetricsReader`: Requires `read:metrics`.
- `AdminUser`: Requires `admin`.

**Example:**
```python
@router.get("")
async def list_metrics(user: MetricsReader):
    # This code only runs if JWT has 'read:metrics' scope
    ...
```

---

## 📝 Development Standards

- **Strict Validation**: All configuration must match `schema.json`.
- **Async Everywhere**: Use `await` for all DB and network calls.
- **Type Hints**: Mandatory for all function signatures.
- **FastAPI Tags**: Group endpoints correctly for Swagger UI.

---

**Detailed deployment guide: [../docs/TECHNICAL_DEEP_DIVE.md](../docs/TECHNICAL_DEEP_DIVE.md)**