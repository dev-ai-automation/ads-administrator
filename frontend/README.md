# Frontend - Ads Administrator Dashboard

> **Ultra-Minimalist Dashboard** built with Next.js 16 App Router, Zinc-themed design system, and type-safe API integration.

---

## 📋 Overview

The frontend provides a high-performance, responsive platform for advertising management:

- **Surgical Precision UI**: Custom-built minimalist UI kit using Zinc palette.
- **Secure Auth**: Full Auth0 integration with scoped permissions.
- **Data Integrity**: Runtime validation of all API responses using Zod.
- **Performance**: Standardized Sass-based styling and optimized Server Components.

---

## 🏗️ Architecture

### Custom UI Kit (`src/components/ui/`)

We avoid heavy external libraries in favor of high-quality, proprietary components:

- **`Card`**: Responsive container with subtle borders and hover states.
- **`Button`**: Consistent action elements with primary, secondary, and danger variants.
- **`Table`**: Standardized data visualization for metrics and lists.
- **`Input` / `Form`**: Type-safe form controls with integrated validation feedback.
- **`Badge`**: Small status indicators for active/inactive/pending states.
- **`Page`**: Layout primitives (`Container`, `Header`, `Title`, `Grid`) for page consistency.

### Project Structure

```
frontend/
├── src/
│   ├── app/                        # App Router (Next.js 16)
│   │   ├── dashboard/              # Protected dashboard routes
│   │   ├── api/auth/               # Auth0 route handlers
│   │   └── layout.tsx              # Zinc-themed root layout
│   ├── components/ui/             # High-End UI Component Library
│   ├── lib/                        # Core Utilities
│   │   ├── api/                    # Type-safe API Services
│   │   │   ├── client.ts           # Core fetch wrapper (Client-side)
│   │   │   ├── server.ts           # Secure API wrapper (Server-side)
│   │   │   └── clients.ts          # Domain-specific services
│   │   └── schemas/                # Zod schemas for contract validation
│   ├── styles/                     # Centralized Design System
│   │   ├── variables.scss          # Zinc palette, spacing, and breakpoints
│   │   └── globals.scss            # Global resets and modern typography
│   ├── types/                      # Comprehensive TypeScript definitions
│   └── hooks/                      # Custom hooks (e.g., useAsync)
```

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.3 (App Router / Turbopack)
- **React**: 19.2.3
- **Styling**: Sass (SCSS) + CSS Modules
- **Design Language**: Minimalist Zinc (Zinc-50 to Zinc-950)
- **Validation**: Zod 4.3.5
- **Linting**: ESLint + Prettier

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local`:

```env
# Auth0 Configuration
AUTH0_SECRET=<generate-with-openssl-rand-hex-32>
AUTH0_BASE_URL=http://localhost:10000
AUTH0_DOMAIN=your-tenant.us.auth0.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
AUTH0_AUDIENCE=https://api.ads-admin.com

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Development & Build

```bash
npm run dev      # Local development
npm run build    # Production build
npm test         # Run unit tests (Jest)
```

---

## 📡 API Layer

We use a two-tier API approach:

1.  **`serverApi`**: Used in Server Components. Automatically injects Auth0 session tokens server-side.
2.  **`clientService`**: Used in Client Components. Requires manual token getter setup.

**Parallel Fetching Example:**
```tsx
const [client, metrics] = await Promise.all([
  serverApi.clients.get(id),
  serverApi.metrics.getSummary(id)
]);
```

---

## 📝 Standards

### Code Style
- **Formatting**: Prettier is mandatory. Run `npm run format`.
- **Linting**: No warnings allowed in CI. Run `npm run lint`.
- **TypeScript**: `strict` mode enabled with `exactOptionalPropertyTypes`.

### Accessibility
- All interactive components must support `aria-invalid`, `tabIndex`, and semantic HTML tags.
- High contrast (Zinc-themed) ensures WCAG compliance.

---

**Detailed architecture guide: [docs/API_LAYER.md](./docs/API_LAYER.md)**