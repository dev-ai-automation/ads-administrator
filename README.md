# Ads Administrator Platform

> **High-End Minimalist Advertising Management** built with FastAPI and Next.js.
> Featuring a Zinc-themed Design System, Scoped Auth0 Security, and YAML-based Configuration.

[![Python 3.12+](https://img.shields.io/badge/Python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🎯 Overview

The **Ads Administrator Platform** is a surgical-precision tool for agencies to manage advertising clients and track Meta Ads performance. We prioritize **zero-dependency UI**, **type safety**, and **minimalist aesthetics**.

### Key Pillars
- 🌑 **Ultra-Minimalist UI**: Proprietary Zinc design system (Linear/Vercel vibe).
- 🔐 **Scoped Security**: RBAC via Auth0 scopes (`read:metrics`, `admin`).
- 🛠️ **Modern Configuration**: Validated YAML/JSON Schema architecture.
- 📡 **Tiered API**: Robust fetching with automatic request deduplication.

---

## ✨ Core Features

- **Dynamic Dashboard**: Real-time client overview and metric visualization.
- **Client Management**: Full CRUD with Meta Ad Account integration.
- **Advanced Metrics**: Tabular data view with responsive Zinc UI components.
- **Reliable Backend**: Validated configurations and strict Pydantic contract integrity.

---

## 🏗️ Technical Stack

| Layer | Technology | Key Features |
|:------|:-----------|:-------------|
| **Frontend** | Next.js 16 (React 19) | Custom UI Kit, SCSS, App Router, Zod |
| **Backend** | FastAPI | Async SQLAlchemy 2.0, YAML Config, Scoped Auth |
| **Database** | PostgreSQL | Managed via asyncpg and Alembic |
| **Identity** | Auth0 | Scoped JWTs, Next.js Auth0 v4 SDK |
| **Deployment** | Render | Automated CI/CD via IaC (render.yaml) |

---

## 📁 Project Architecture

```
ads-administrator/
├── backend/            # FastAPI (Async, YAML Config, Pytest)
├── frontend/           # Next.js (Zinc UI Kit, Sass, Jest)
├── docs/               # Technical and Business Deep Dives
├── render.yaml         # Infrastructure as Code
└── docker-compose.yml  # Standard Orchestration
```

---

## 🚀 Getting Started

Refer to the **[Development Guide](./docs/DEVELOPMENT.md)** for detailed local setup, coding standards, and testing procedures.

### Summary
1. **Auth0 Setup**: Configure an API with scopes: `read:metrics`, `read:clients`, `write:clients`, `admin`.
2. **Backend**: `pip install -r requirements.txt`, then `python -m uvicorn app.main:app`.
3. **Frontend**: `npm install`, then `npm run dev`.

---

## 📚 Documentation Index

- 📑 **[API Layer Architecture](./frontend/docs/API_LAYER.md)** - Data fetching standards.
- ⚙️ **[Development Guide](./docs/DEVELOPMENT.md)** - Workflow and coding standards.
- 🏗️ **[Technical Deep Dive](./docs/TECHNICAL_DEEP_DIVE.md)** - Systems overview.
- 🚀 **[Deployment Manual](./docs/DEPLOYMENT_MANUAL.md)** - Render setup.

---

## 🤝 Contributing

We follow **Conventional Commits** and strict **Sass/TypeScript/Python** linting. Ensure all tests pass before pushing:
- `npm test` (Frontend)
- `python -m pytest` (Backend)

---

**Built with Precision by the Ads Admin Engineering Team.**