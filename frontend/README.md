# Frontend - Ads Administrator Dashboard

> **Next.js 16 App Router** application with Auth0 authentication and type-safe API integration.

---

## 📋 Overview

The frontend provides a modern, responsive dashboard for:
- Secure user authentication via Auth0
- Client and campaign management interfaces
- Real-time metrics visualization
- Type-safe API communication

---

## 🏗️ Architecture

### Project Structure
```
frontend/
├── src/
│   ├── app/                        # App Router (Next.js 16)
│   │   ├── (authenticated)/       # Protected routes
│   │   │   ├── dashboard/         # Dashboard page
│   │   │   └── clients/           # Client management
│   │   ├── api/auth/[auth0]/      # Auth0 route handler
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing page
│   ├── lib/                       # Utilities
│   │   ├── api/                   # API client
│   │   │   ├── client.ts          # HTTP client setup
│   │   │   ├── clients.ts         # Clients endpoints
│   │   │   └── metrics.ts         # Metrics endpoints
│   │   ├── auth/                  # Auth utilities
│   │   └── utils/                 # Helper functions
│   ├── types/                     # TypeScript definitions
│   │   ├── api.ts                 # API response types
│   │   ├── client.ts              # Client types
│   │   └── user.ts                # User types
│   ├── hooks/                     # Custom React hooks
│   └── middleware.ts              # Next.js middleware (auth)
├── public/                        # Static assets
├── .env.example
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.3 (App Router)
- **React**: 19.2.3
- **Language**: TypeScript 5
- **Auth**: @auth0/nextjs-auth0
- **Validation**: Zod 4.3.5
- **Styling**: CSS Modules (or Tailwind if configured)
- **Linting**: ESLint + eslint-config-next

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env.local` file:
```bash
cp .env.example .env.local
```

Required variables:
```env
# Auth0 Configuration
AUTH0_SECRET=<generate-with-openssl-rand-hex-32>
AUTH0_BASE_URL=http://localhost:3000
AUTH0_ISSUER_BASE_URL=https://your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run Development Server
```bash
npm run dev
```

Access at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🔐 Authentication

### Auth0 Integration
The app uses `@auth0/nextjs-auth0` for authentication:

- **Login**: `/api/auth/login`
- **Logout**: `/api/auth/logout`
- **Callback**: `/api/auth/callback`
- **User Profile**: `/api/auth/me`

### Protected Routes
Routes in `app/(authenticated)/` are protected by middleware:

```typescript
// middleware.ts
export default withMiddlewareAuthRequired();
```

### Usage in Components
```typescript
import { getSession } from '@auth0/nextjs-auth0';

// Server Component
const session = await getSession();
const user = session?.user;

// Client Component
'use client';
import { useUser } from '@auth0/nextjs-auth0/client';

const { user, error, isLoading } = useUser();
```

---

## 📡 API Communication

### API Client
Centralized HTTP client with Auth0 token injection:

```typescript
// lib/api/client.ts
import { getAccessToken } from '@auth0/nextjs-auth0';

export async function apiClient<T>(endpoint: string): Promise<T> {
  const { accessToken } = await getAccessToken();
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  return response.json();
}
```

### Type-Safe Endpoints
```typescript
// lib/api/clients.ts
export const clientsApi = {
  list: () => apiClient<Client[]>('/api/v1/clients'),
  get: (id: string) => apiClient<Client>(`/api/v1/clients/${id}`),
  create: (data: CreateClientDto) => 
    apiClient<Client>('/api/v1/clients', { method: 'POST', body: data }),
};
```

---

## 🎨 Styling

### CSS Modules (Default)
```css
/* app/dashboard/Dashboard.module.css */
.container {
  max-width: 1200px;
  margin: 0 auto;
}
```

```tsx
import styles from './Dashboard.module.css';

export default function Dashboard() {
  return <div className={styles.container}>...</div>;
}
```

---

## 🧪 Testing

### Setup (Recommended)
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

### Example Test
```typescript
import { render, screen } from '@testing-library/react';
import Dashboard from '@/app/(authenticated)/dashboard/page';

test('renders dashboard', () => {
  render(<Dashboard />);
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
});
```

---

## 📝 Development Notes

### Type Safety
- All API responses validated with Zod schemas
- Strict TypeScript configuration
- No `any` types in production code

### Best Practices
- Server Components by default (use `'use client'` only when needed)
- API calls in Server Components or Server Actions
- Error boundaries for graceful error handling
- Loading states with `loading.tsx` files

### Code Style
- **Formatter**: Prettier (if configured)
- **Linter**: ESLint with Next.js config
- **Imports**: Absolute imports via `@/` alias

---

## 🚀 Deployment

### Build Optimization
```bash
npm run build
```

The build output will be in `.next/` directory.

### Environment Variables (Production)
Set these in your hosting platform (e.g., Render):
- `AUTH0_SECRET`
- `AUTH0_BASE_URL` (your production URL)
- `AUTH0_ISSUER_BASE_URL`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `NEXT_PUBLIC_API_URL` (backend URL)

---

## 📚 Additional Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Auth0 Next.js SDK](https://github.com/auth0/nextjs-auth0)
- [React 19 Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**For deployment instructions, see [../docs/TECHNICAL_DEEP_DIVE.md](../docs/TECHNICAL_DEEP_DIVE.md)**
