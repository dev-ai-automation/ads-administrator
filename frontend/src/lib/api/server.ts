/**
 * Server-Side API Client - For use in Server Components and API Routes.
 * 
 * This wrapper automatically injects the Auth0 access token into requests.
 * Use this instead of the regular `api` client when calling from server-side code.
 * 
 * @example
 * // In a Server Component:
 * import { serverApi } from '@/lib/api/server';
 * 
 * export default async function DashboardPage() {
 *   const clients = await serverApi.clients.list();
 *   return <ClientList items={clients.items} />;
 * }
 */
import { getAccessToken } from '@/lib/auth0';
import {
    ClientResponseSchema,
    ClientListResponseSchema,
    MetricListResponseSchema,
    MetricSummarySchema,
    UserProfileSchema,
} from '@/lib/schemas';
import type {
    ClientCreate,
    ClientUpdate,
    ClientResponse,
    ClientListResponse,
    ClientListParams,
    MetricListResponse,
    MetricListParams,
    MetricSummary,
    MetricSummaryParams,
    UserProfile,
} from '@/types';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8000';

// =============================================================================
// CORE FETCH FUNCTION
// =============================================================================

interface FetchOptions {
    method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    body?: unknown;
    params?: Record<string, string | number | boolean | undefined>;
}

async function serverFetch<T>(
    path: string,
    options: FetchOptions = {},
    schema?: { parse: (data: unknown) => T }
): Promise<T> {
    const { method = 'GET', body, params } = options;

    // Get access token from Auth0 (may fail if not configured)
    let token: string | null = null;
    try {
        token = await getAccessToken();
    } catch {
        // Auth0 not configured - continue without token for development
    }

    // Build URL with query params
    const url = new URL(`${API_BASE_URL}${path}`);
    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    // Make request
    const response = await fetch(url.toString(), {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: body ? JSON.stringify(body) : undefined,
        // Disable Next.js caching for API calls
        cache: 'no-store',
    });

    // Handle errors
    if (!response.ok) {
        const errorBody = await response.json().catch(() => ({}));
        throw new Error(
            errorBody['detail'] ?? errorBody['message'] ?? `API Error: ${response.status}`
        );
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    // Parse and validate response
    const data = await response.json();

    if (schema) {
        return schema.parse(data);
    }

    return data as T;
}

// =============================================================================
// SERVER API SERVICES
// =============================================================================

/**
 * Server-side API services for use in Server Components.
 */
export const serverApi = {
    /**
     * Client operations.
     */
    clients: {
        async list(params?: ClientListParams): Promise<ClientListResponse> {
            return serverFetch(
                '/api/v1/clients',
                { params: params as FetchOptions['params'] },
                ClientListResponseSchema
            );
        },

        async get(id: number): Promise<ClientResponse> {
            return serverFetch(`/api/v1/clients/${id}`, {}, ClientResponseSchema);
        },

        async create(data: ClientCreate): Promise<ClientResponse> {
            return serverFetch('/api/v1/clients', { method: 'POST', body: data }, ClientResponseSchema);
        },

        async update(id: number, data: ClientUpdate): Promise<ClientResponse> {
            return serverFetch(`/api/v1/clients/${id}`, { method: 'PATCH', body: data }, ClientResponseSchema);
        },

        async delete(id: number): Promise<void> {
            return serverFetch(`/api/v1/clients/${id}`, { method: 'DELETE' });
        },
    },

    /**
     * Metrics operations.
     */
    metrics: {
        async list(params?: MetricListParams): Promise<MetricListResponse> {
            return serverFetch(
                '/api/v1/metrics',
                { params: params as FetchOptions['params'] },
                MetricListResponseSchema
            );
        },

        async getSummary(clientId: number, params?: MetricSummaryParams): Promise<MetricSummary> {
            return serverFetch(
                `/api/v1/metrics/summary/${clientId}`,
                { params: params as FetchOptions['params'] },
                MetricSummarySchema
            );
        },
    },

    /**
     * User operations.
     */
    users: {
        async getProfile(): Promise<UserProfile> {
            return serverFetch('/api/v1/users/me', {}, UserProfileSchema);
        },

        async getPermissions(): Promise<string[]> {
            return serverFetch('/api/v1/users/me/permissions');
        },
    },
};

export default serverApi;
