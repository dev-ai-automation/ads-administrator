# Frontend API Layer Documentation (Advanced Senior Edition)

This project utilizes a centralized, type-safe API architecture. It integrates **Zod** for runtime validation and **Auth0** for secure token management, adhering to Vercel's best practices for Next.js App Router.

## Architecture Philosophy

We prioritize:
1. **Type Safety:** 100% TypeScript coverage from schema to component.
2. **Performance:** Parallel fetching by default for independent operations.
3. **Resilience:** Centralized error handling via `ApiClientError`.
4. **Efficiency:** Automatic request deduplication in Server Components.

---

## Core Modules

- **`src/lib/api/client.ts`**: Standard fetch wrapper for Client Components.
- **`src/lib/api/server.ts`**: Secure wrapper for Server Components. Injects session tokens server-side.
- **`src/lib/schemas/`**: Zod definitions ensuring backend contract integrity.

---

## Advanced Usage Patterns

### 1. Parallel Fetching (Senior Pattern)

When fetching multiple independent resources (e.g., Client details AND their Metrics), avoid waterfalls. Use `Promise.all` to reduce latency.

```tsx
// Correct: Parallel execution
const [client, metrics] = await Promise.all([
  serverApi.clients.get(id),
  serverApi.metrics.getSummary(id)
]);
```

### 2. Request Memoization

In Server Components, Next.js automatically deduplicates `fetch` calls. If you call `serverApi.clients.list()` in multiple components within the same request, the network call happens only once.

> **Tip:** If you implement a service that does **not** use `fetch` (e.g., direct DB access or complex parsing), wrap it in `React.cache()` to maintain this deduplication behavior.

### 3. Server-Side Guard Rails

Always use `serverApi` within Server Components to prevent leaking sensitive Auth0 logic to the client bundle. The middleware handles redirecting unauthenticated users before they reach your pages.

---

## Error Handling Standards

We use a structured error system to differentiate between network failures, validation errors, and backend business logic errors.

```typescript
try {
  const newClient = await clientService.create(data);
} catch (error) {
  if (error instanceof ApiClientError) {
    // status: HTTP Code (400, 401, 500...)
    // detail: Specific backend message (e.g., "Meta ID is invalid")
    // message: Generic UI-friendly message
    showToast(error.message);
  }
}
```

## Best Practices (Context7 Sychronized)

- **Early Exit:** Validate form data with Zod schemas *before* hitting the API to save round-trips.
- **Async Parallel:** Always audit your components for sequential `await` calls that could be parallelized.
- **Strict Typing:** Never use `any` for API responses. If a schema is missing, create it.