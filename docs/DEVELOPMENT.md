# Development Guide

> **Surgical Precision, Zero Dependencies, Absolute Reliability.**
> Standardized workflows for the Ads Administrator Platform.

---

## 🔄 Development Workflow

### 1. Code Standards (Seniority Rigor)
- **Frontend**: Mandatory use of the **Zinc UI Kit**. Avoid external UI libraries.
- **Backend**: All configuration must be validated via `backend/config/schema.json`.
- **Validation**: Every API contract must have a Zod schema (frontend) and Pydantic model (backend).

### 2. Feature Development
```bash
# Frontend Development
cd frontend
npm run dev

# Backend Development
cd backend
python -m uvicorn app.main:app --reload
```

---

## 📝 Coding Standards

### Python (Backend)
- **Formatting**: **Ruff** for linting and formatting.
- **Async**: Mandatory use of `async/await` for all DB/I/O.
- **Strictness**: Configuration is strictly validated against JSON Schema at startup.

### TypeScript (Frontend)
- **Formatting**: **Prettier** mandatory. Run `npm run format`.
- **Linting**: **ESLint** (Next.js preset) mandatory. Run `npm run lint`.
- **Types**: `strict` mode. No `any`. Use `unknown` or specific interfaces.

---

## 🧪 Testing Strategy

### Backend (Pytest)
Run tests for configuration and API endpoints:
```bash
cd backend
python -m pytest tests/test_config.py  # Validation Logic
python -m pytest tests/api/            # Integration
```

### Frontend (Jest + RTL)
Run unit tests for UI components and hooks:
```bash
cd frontend
npm test              # Run all tests
npm run test:watch    # Development mode
```

---

## 🔌 API Architectural Pattern

### The Tiered Approach
1. **Schema Definition**: Create Zod schemas in `src/lib/schemas/`.
2. **Fetch Logic**: Extend `src/lib/api/client.ts` (Client) or `src/lib/api/server.ts` (Server).
3. **Usage**: Use the `useAsync` hook in Client Components for standardized loading/error states.

---

## 🌿 Git Strategy

We follow **Conventional Commits** with strict scoping:

- `feat(ui)`: UI Kit additions.
- `feat(api)`: Backend endpoint changes.
- `fix(logic)`: Critical bug fixes.
- `refactor(config)`: Configuration system updates.

---

## 🚀 Deployment (Render)
Pushes to the `main` branch trigger an automatic redeploy. 
**Verification before push:**
1. `npm run build` (Frontend)
2. `python -m pytest` (Backend)
3. `npx tsc` (Type check)

---

**Detailed Architecture: [TECHNICAL_DEEP_DIVE.md](./TECHNICAL_DEEP_DIVE.md)**