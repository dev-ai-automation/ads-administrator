---
name: ads-admin-frontend
description: Project-specific frontend rules for Ads Administrator Dashboard. Use when working on UI components, pages, or frontend authentication.
---

## When to Use

- Creating dashboard pages.
- Building UI components.
- Integrating Auth0 login (SDK v4).
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
│   ├── lib/
│   │   ├── auth0.ts         # Auth0 integration (v4 SDK)
│   │   └── api/             # API clients
│   └── middleware.ts        # Auth middleware
├── public/
├── Dockerfile.dev
└── package.json
```

---

## Auth0 SDK v4 Integration

### Middleware Pattern (Required)

Auth0 SDK v4 handles auth routes via middleware:

```typescript
// src/middleware.ts
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { auth0, isAuth0Configured, getAuth0Client } from '@/lib/auth0';

export async function middleware(request: NextRequest) {
    if (!isAuth0Configured()) {
        return NextResponse.next();
    }

    // Auth0 handles /auth/* routes automatically
    const authResponse = await getAuth0Client().middleware(request);
    if (authResponse) {
        return authResponse;
    }

    // Check protected routes
    const session = await auth0.getSession(request);
    if (!session && isProtectedRoute(request.nextUrl.pathname)) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    return NextResponse.next();
}
```

### Auth Routes (v4 - No /api prefix)

| Route | Purpose |
|-------|---------|
| `/auth/login` | Initiate Auth0 login |
| `/auth/logout` | Logout and clear session |
| `/auth/callback` | Handle Auth0 callback |

```tsx
// Links in components
<a href="/auth/login">Login</a>
<a href="/auth/logout">Logout</a>
```

### Auth0 Client Configuration

```typescript
// src/lib/auth0.ts
export function getAuth0Client(): Auth0Client {
    return new Auth0Client({
        domain: process.env['AUTH0_DOMAIN'],
        appBaseUrl: getBaseUrl(),
        clientId: process.env['AUTH0_CLIENT_ID'],
        clientSecret: process.env['AUTH0_CLIENT_SECRET'],
        secret: process.env['AUTH0_SECRET'],
        authorizationParameters: {
            audience: process.env['AUTH0_AUDIENCE'],
            scope: 'openid profile email offline_access',
        },
        routes: {
            login: '/auth/login',
            logout: '/auth/logout',
            callback: '/auth/callback',
        },
    });
}
```

---

## API Fetching

### Server-Side (with Auth)

```typescript
import { getAccessToken } from '@/lib/auth0';

const token = await getAccessToken();
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/clients`, {
    headers: {
        Authorization: `Bearer ${token}`,
    },
});
```

### Client-Side (SWR recommended)

```typescript
import useSWR from 'swr';

const { data, error } = useSWR('/api/clients', fetcher);
```

---

## Styling Rules

- Use **Vanilla CSS** with CSS Modules.
- Use **HSL colors** for theming.
- No TailwindCSS unless explicitly requested.

---

## Performance Optimization

Follow the [Vercel React Best Practices](../vercel-react-best-practices/SKILL.md) for:

- **CRITICAL**: Eliminating waterfalls with `Promise.all()`
- **CRITICAL**: Bundle optimization with dynamic imports
- **HIGH**: Server-side caching with `React.cache()`
- **MEDIUM**: Re-render optimization with `useMemo`/`useCallback`

---

## Commands

```bash
# Run dev server (port 10000)
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Lint
cd frontend && npm run lint
```

## Resources

- **Code**: See [frontend/](../../frontend/) for implementation.
- **Generic Skill**: See [nextjs/](../nextjs/) for generic patterns.
- **Performance**: See [vercel-react-best-practices/](../vercel-react-best-practices/) for optimization rules.
