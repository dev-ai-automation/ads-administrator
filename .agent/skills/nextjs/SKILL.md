---
name: nextjs
description: Next.js App Router best practices for building scalable React applications. Use when creating pages, layouts, components, or API routes in Next.js.
---


## When to Use

- Creating new pages or layouts in the App Router.
- Structuring components for reusability.
- Setting up client-side authentication.
- Configuring TypeScript/ESLint.

---

## Critical Patterns

### 1. App Router Structure
File-system routing with `app/` directory.

```
app/
├── layout.tsx       # Root layout (required)
├── page.tsx         # Home page
├── dashboard/
│   ├── layout.tsx   # Dashboard layout
│   └── page.tsx     # Dashboard page
└── api/
    └── route.ts     # API route
```

### 2. Root Layout
Must include `<html>` and `<body>` tags.

```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

### 3. TypeScript Strict Mode
Use strict TypeScript in `tsconfig.json`.

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

### 4. Component Organization
Separate UI components from page logic.

```
src/
├── app/              # Routes
├── components/       # Reusable UI
│   ├── ui/           # Primitives (Button, Card)
│   └── features/     # Domain components
└── lib/              # Utilities, API clients
```

---

## Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## Resources

- **Templates**: See [assets/](assets/) for page and component templates.
