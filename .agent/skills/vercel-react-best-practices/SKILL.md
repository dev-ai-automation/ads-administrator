---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering. Use when writing, reviewing, or refactoring React/Next.js code to ensure optimal performance patterns.
---

# Vercel React Best Practices

Comprehensive performance optimization guide for React and Next.js applications, based on Vercel Engineering guidelines. Contains 45 rules across 8 categories, prioritized by impact.

## When to Apply

Reference these guidelines when:
- Writing new React components or Next.js pages
- Implementing data fetching (client or server-side)
- Reviewing code for performance issues
- Refactoring existing React/Next.js code
- Optimizing bundle size or load times

---

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Eliminating Waterfalls | CRITICAL | `async-` |
| 2 | Bundle Size Optimization | CRITICAL | `bundle-` |
| 3 | Server-Side Performance | HIGH | `server-` |
| 4 | Client-Side Data Fetching | MEDIUM-HIGH | `client-` |
| 5 | Re-render Optimization | MEDIUM | `rerender-` |
| 6 | Rendering Performance | MEDIUM | `rendering-` |
| 7 | JavaScript Performance | LOW-MEDIUM | `js-` |
| 8 | Advanced Patterns | LOW | `advanced-` |

---

## 1. Eliminating Waterfalls (CRITICAL)

### `async-parallel` — Use Promise.all() for independent operations

**Bad:**
```typescript
const user = await getUser();
const posts = await getPosts();
const comments = await getComments();
```

**Good:**
```typescript
const [user, posts, comments] = await Promise.all([
  getUser(),
  getPosts(),
  getComments(),
]);
```

### `async-defer-await` — Move await into branches where actually used

**Bad:**
```typescript
const data = await fetchData();
if (condition) {
  return data;
}
return null;
```

**Good:**
```typescript
if (condition) {
  return await fetchData();
}
return null;
```

### `async-suspense-boundaries` — Use Suspense to stream content

```tsx
import { Suspense } from 'react';

export default function Page() {
  return (
    <>
      <Header />
      <Suspense fallback={<Loading />}>
        <SlowComponent />
      </Suspense>
    </>
  );
}
```

---

## 2. Bundle Size Optimization (CRITICAL)

### `bundle-barrel-imports` — Import directly, avoid barrel files

**Bad:**
```typescript
import { Button, Card, Modal } from '@/components';
```

**Good:**
```typescript
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

### `bundle-dynamic-imports` — Use next/dynamic for heavy components

```typescript
import dynamic from 'next/dynamic';

const HeavyChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

### `bundle-defer-third-party` — Load analytics/logging after hydration

```tsx
'use client';
import { useEffect } from 'react';

export function Analytics() {
  useEffect(() => {
    // Load after hydration
    import('@/lib/analytics').then(({ init }) => init());
  }, []);
  return null;
}
```

---

## 3. Server-Side Performance (HIGH)

### `server-cache-react` — Use React.cache() for per-request deduplication

```typescript
import { cache } from 'react';

export const getUser = cache(async (userId: string) => {
  return await db.user.findUnique({ where: { id: userId } });
});
```

### `server-parallel-fetching` — Restructure components to parallelize fetches

```tsx
// Start all fetches in parallel at page level
export default async function Page() {
  const userPromise = getUser();
  const postsPromise = getPosts();
  
  return (
    <>
      <UserCard userPromise={userPromise} />
      <Posts postsPromise={postsPromise} />
    </>
  );
}
```

### `server-serialization` — Minimize data passed to client components

**Bad:**
```tsx
<ClientComponent data={fullUserObject} />
```

**Good:**
```tsx
<ClientComponent name={user.name} avatar={user.avatar} />
```

---

## 4. Client-Side Data Fetching (MEDIUM-HIGH)

### `client-swr-dedup` — Use SWR for automatic request deduplication

```typescript
import useSWR from 'swr';

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher);
  // ...
}
```

---

## 5. Re-render Optimization (MEDIUM)

### `rerender-memo` — Extract expensive work into memoized components

```tsx
const ExpensiveList = memo(function ExpensiveList({ items }) {
  return items.map(item => <ExpensiveItem key={item.id} {...item} />);
});
```

### `rerender-derived-state` — Subscribe to derived booleans, not raw values

**Bad:**
```typescript
const items = useStore(state => state.items);
const isEmpty = items.length === 0;
```

**Good:**
```typescript
const isEmpty = useStore(state => state.items.length === 0);
```

### `rerender-functional-setstate` — Use functional setState for stable callbacks

```typescript
// Stable - doesn't need count in dependencies
const increment = useCallback(() => {
  setCount(c => c + 1);
}, []);
```

### `rerender-lazy-state-init` — Pass function to useState for expensive values

```typescript
// Expensive computation only runs once
const [data] = useState(() => computeExpensiveDefault());
```

---

## 6. Rendering Performance (MEDIUM)

### `rendering-content-visibility` — Use content-visibility for long lists

```css
.list-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 100px;
}
```

### `rendering-conditional-render` — Use ternary, not && for conditionals

**Bad:**
```tsx
{count && <Text>{count}</Text>}  // Renders "0" when count is 0
```

**Good:**
```tsx
{count > 0 ? <Text>{count}</Text> : null}
```

---

## 7. JavaScript Performance (LOW-MEDIUM)

### `js-set-map-lookups` — Use Set/Map for O(1) lookups

```typescript
// O(n) - slow
const exists = array.includes(value);

// O(1) - fast
const set = new Set(array);
const exists = set.has(value);
```

### `js-early-exit` — Return early from functions

```typescript
function process(data) {
  if (!data) return null;
  if (data.cached) return data.cached;
  // Main logic here
}
```

### `js-combine-iterations` — Combine multiple filter/map into one loop

**Bad:**
```typescript
items.filter(x => x.active).map(x => x.name).filter(Boolean);
```

**Good:**
```typescript
items.reduce((acc, x) => {
  if (x.active && x.name) acc.push(x.name);
  return acc;
}, []);
```

---

## 8. Advanced Patterns (LOW)

### `advanced-use-latest` — useLatest for stable callback refs

```typescript
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

// Usage: access latest value without re-rendering
const latestCallback = useLatest(callback);
```

---

## Resources

- See [rules/](./rules/) for individual rule files with detailed examples
- Reference the project-specific skill [ads-admin-frontend](../ads-admin-frontend/SKILL.md) for project patterns
