/**
 * API Client - Centralized HTTP client with type safety and validation.
 * 
 * Features:
 * - Automatic JWT token injection
 * - Zod runtime validation of responses
 * - Consistent error handling
 * - Type-safe request/response
 */
import type { ZodSchema } from 'zod';
import type { ApiError } from '@/types';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:8000';

/**
 * Custom error class for API errors.
 */
export class ApiClientError extends Error {
    public readonly status: number;
    public readonly detail?: string;

    constructor(message: string, status: number, detail?: string) {
        super(message);
        this.name = 'ApiClientError';
        this.status = status;
        this.detail = detail;
    }

    toApiError(): ApiError {
        return {
            success: false,
            message: this.message,
            detail: this.detail,
            status: this.status,
        };
    }
}

// =============================================================================
// TOKEN MANAGEMENT
// =============================================================================

/**
 * Token getter function type.
 * Should be set by the auth provider to supply the current access token.
 */
type TokenGetter = () => Promise<string | null>;

let getAccessToken: TokenGetter = async () => null;

/**
 * Configure the token getter for authenticated requests.
 * Call this during app initialization with your auth provider's token getter.
 * 
 * @example
 * // In your auth provider:
 * import { setTokenGetter } from '@/lib/api/client';
 * setTokenGetter(() => getAccessTokenSilently());
 */
export function setTokenGetter(getter: TokenGetter): void {
    getAccessToken = getter;
}

// =============================================================================
// HTTP METHODS
// =============================================================================

interface RequestOptions {
    /** Skip authentication header */
    skipAuth?: boolean;
    /** Custom headers */
    headers?: Record<string, string>;
    /** Query parameters */
    params?: Record<string, string | number | boolean | undefined>;
}

/**
 * Build URL with query parameters.
 */
function buildUrl(path: string, params?: RequestOptions['params']): string {
    const url = new URL(`${API_BASE_URL}${path}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    return url.toString();
}

/**
 * Core fetch wrapper with authentication and error handling.
 */
async function fetchApi<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
    path: string,
    options: RequestOptions & { body?: unknown; schema?: ZodSchema<T> } = {}
): Promise<T> {
    const { skipAuth = false, headers = {}, params, body, schema } = options;

    // Build headers
    const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        ...headers,
    };

    // Add auth token if not skipped
    if (!skipAuth) {
        const token = await getAccessToken();
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }
    }

    // Make request
    const response = await fetch(buildUrl(path, params), {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
    });

    // Handle non-2xx responses
    if (!response.ok) {
        let errorMessage = `API Error: ${response.statusText}`;
        let errorDetail: string | undefined;

        try {
            const errorBody = await response.json();
            errorMessage = errorBody.detail || errorBody.message || errorMessage;
            errorDetail = typeof errorBody.detail === 'string' ? errorBody.detail : undefined;
        } catch {
            // Response body is not JSON, use default message
        }

        throw new ApiClientError(errorMessage, response.status, errorDetail);
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return undefined as T;
    }

    // Parse response
    const data = await response.json();

    // Validate with Zod schema if provided
    if (schema) {
        const result = schema.safeParse(data);
        if (!result.success) {
            console.error('API Response validation failed:', result.error.format());
            throw new ApiClientError(
                'Invalid API response format',
                500,
                `Validation errors: ${result.error.issues.map((issue) => issue.message).join(', ')}`
            );
        }
        return result.data;
    }

    return data as T;
}

// =============================================================================
// PUBLIC API METHODS
// =============================================================================

/**
 * HTTP GET request with optional Zod validation.
 * 
 * @example
 * const clients = await api.get('/api/v1/clients', {
 *   schema: ClientListResponseSchema,
 *   params: { page: 1, page_size: 20 }
 * });
 */
export async function get<T>(
    path: string,
    options?: RequestOptions & { schema?: ZodSchema<T> }
): Promise<T> {
    return fetchApi<T>('GET', path, options);
}

/**
 * HTTP POST request with optional Zod validation.
 * 
 * @example
 * const newClient = await api.post('/api/v1/clients', {
 *   body: { name: 'New Client', slug: 'new-client' },
 *   schema: ClientResponseSchema
 * });
 */
export async function post<T>(
    path: string,
    options?: RequestOptions & { body?: unknown; schema?: ZodSchema<T> }
): Promise<T> {
    return fetchApi<T>('POST', path, options);
}

/**
 * HTTP PATCH request with optional Zod validation.
 */
export async function patch<T>(
    path: string,
    options?: RequestOptions & { body?: unknown; schema?: ZodSchema<T> }
): Promise<T> {
    return fetchApi<T>('PATCH', path, options);
}

/**
 * HTTP PUT request with optional Zod validation.
 */
export async function put<T>(
    path: string,
    options?: RequestOptions & { body?: unknown; schema?: ZodSchema<T> }
): Promise<T> {
    return fetchApi<T>('PUT', path, options);
}

/**
 * HTTP DELETE request.
 */
export async function del(
    path: string,
    options?: RequestOptions
): Promise<void> {
    return fetchApi<void>('DELETE', path, options);
}

// =============================================================================
// CONVENIENCE EXPORT
// =============================================================================

export const api = {
    get,
    post,
    patch,
    put,
    delete: del,
    setTokenGetter,
};

export default api;
