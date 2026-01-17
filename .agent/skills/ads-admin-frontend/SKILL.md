---
name: ads-admin-frontend
description: Project-specific frontend rules for Ads Administrator Dashboard. Use when working on UI components, pages, or frontend authentication.
---


## When to Use

- Creating dashboard pages.
- Building UI components.
- Integrating Auth0 login.
- Fetching data from backend API.

---

## Critical Patterns

### Project Structure

```
frontend/
├── src/
│   ├── app/                 # App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page
│   │   └── dashboard/       # Dashboard routes
│   ├── components/          # Reusable UI
│   │   ├── ui/              # Primitives
│   │   └── features/        # Domain components
│   └── lib/
│       └── auth0.ts         # Auth0 integration
├── public/
├── Dockerfile.dev
└── package.json
```

### Auth0 Login

```typescript
// src/lib/auth0.ts
export const login = () => {
  window.location.href = `/api/auth/login`;
};

export const logout = () => {
  window.location.href = `/api/auth/logout`;
};
```

### API Fetching

```typescript
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/clients`, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});
```

### Styling Rules
- Use **Vanilla CSS** with CSS Modules.
- Use **HSL colors** for theming.
- No TailwindCSS unless explicitly requested.

---

## Commands

```bash
# Run dev server
cd frontend && npm run dev

# Build
cd frontend && npm run build

# Lint
cd frontend && npm run lint
```

## Resources

- **Code**: See [frontend/](../../frontend/) for implementation.
- **Generic Skill**: See [nextjs/](../nextjs/) for generic patterns.
