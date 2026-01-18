# Ads Administrator Platform - Technical Deep Dive

## Architecture Overview
The platform follows a modern **Client-Server** architecture, organized as a monorepo. It prioritizes type safety, minimalist design, and robust configuration management.

### Tech Stack
- **Frontend**: Next.js 16 (React 19) with a custom **Zinc-themed UI Kit**.
- **Backend**: FastAPI (Python 3.12+) with asynchronous SQLAlchemy 2.0.
- **Database**: PostgreSQL (managed via asyncpg).
- **Authentication**: **Auth0 v4 SDK** for Next.js and Scoped JWT verification for Python.
- **Styling**: Sass (SCSS) + CSS Modules for a zero-dependency minimalist UI.

---

## Key Technical Systems

### 1. Unified Design System (Minimalist Zinc)
We avoid third-party UI libraries (like Shadcn or Material UI) to maintain 100% control over the bundle size and brand identity. 
- **Palette**: Grayscale series (Zinc-50 to Zinc-950) with high contrast.
- **Components**: Proprietary `Table`, `Card`, `Button`, and `Input` components designed for surgical precision.
- **Responsiveness**: Mobile-first grid layouts built with Sass variables.

### 2. Robust Configuration (YAML + Schema)
The backend uses a production-grade configuration loader:
- **`backend/config/settings.yaml`**: Hierarchical configuration.
- **`backend/config/schema.json`**: Structural validation ensuring all required settings exist before the server starts.
- **Environment Injection**: Variables like `${AUTH0_DOMAIN}` are dynamically expanded at runtime.

### 3. Scoped Security (Auth0 RBAC)
Authentication is enforced at the edge via Next.js Middleware and verified at the API level via JWT scopes.
- **Scopes implemented**: `openid`, `profile`, `email`, `admin`, `read:clients`, `write:clients`, `read:metrics`.
- **Backend enforcement**: Scopes are checked using FastAPI's `SecurityScopes` dependency injection.

---

## Project Structure
```text
ads-administrator/
├── backend/            # FastAPI application
│   ├── app/            # Application logic (models, schemas, api)
│   ├── config/         # YAML/JSON Schema configuration
│   └── tests/          # Pytest suite (coverage > 80%)
├── frontend/           # Next.js application
│   ├── src/
│   │   ├── components/ui/ # Custom UI Kit
│   │   ├── lib/api/       # Tiered API Layer (Client/Server)
│   │   └── styles/        # Zinc Design System
│   └── docs/           # Frontend-specific API guides
├── docs/               # Platform-wide documentation
└── render.yaml         # Infrastructure as Code (IaC)
```

## Deployment Strategy (Render)
The project is configured for **Automated Continuous Deployment** via the `main` branch.

1.  **Infrastructure as Code**: The `render.yaml` orchestrates the DB, API, and Frontend services.
2.  **Build Hooks**: 
    - Backend: Installs dependencies and runs Alembic migrations.
    - Frontend: Compiles TypeScript and builds optimized static pages.
3.  **Environment Sync**: Auth0 secrets are injected directly into Render services to maintain security.

---

## Technical Debt & Roadmap
- [x] Migrate to Sass-based UI Kit.
- [x] Implement YAML-based configuration.
- [x] Resolve ISO Datetime validation inconsistencies.
- [ ] Implement advanced Charts using D3.js or Tremor-like lightweight components.
- [ ] Add E2E testing with Playwright.