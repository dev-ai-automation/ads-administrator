/**
 * API Types - Generic types for API communication.
 */

/**
 * Generic API success response wrapper.
 */
export interface ApiResponse<T> {
  data: T;
  success: true;
}

/**
 * API error response structure.
 */
export interface ApiError {
  success: false;
  message: string;
  detail?: string;
  status: number;
}

/**
 * Generic paginated response.
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * Union type for API results.
 */
export type ApiResult<T> = ApiResponse<T> | ApiError;
