/**
 * Common Types - Shared utility types for the application.
 */

// =============================================================================
// HTTP & NETWORKING
// =============================================================================

/**
 * HTTP methods supported by the API client.
 */
export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

/**
 * Common query parameters for paginated endpoints.
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

/**
 * Date range filter parameters.
 */
export interface DateRangeParams {
  date_from?: string;
  date_to?: string;
}

// =============================================================================
// UI STATE
// =============================================================================

/**
 * Async data loading state.
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/**
 * Generic async data state for components.
 */
export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/**
 * Table sort configuration.
 */
export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

// =============================================================================
// FORM HANDLING
// =============================================================================

/**
 * Form field error state.
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Generic form state.
 */
export interface FormState<T> {
  values: T;
  errors: FieldError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Make all properties in T optional and nullable.
 */
export type PartialNullable<T> = {
  [P in keyof T]?: T[P] | null;
};

/**
 * Extract the resolved type from a Promise.
 */
export type Awaited<T> = T extends Promise<infer R> ? R : T;

/**
 * Make specific keys in T required.
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>;
