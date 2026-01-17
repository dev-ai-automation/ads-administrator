/**
 * Type Exports - Central export for all application types.
 * 
 * Import types from here for cleaner imports:
 * @example
 * import type { ClientResponse, MetricSummary, UserProfile } from '@/types';
 */

// Client types
export type {
    ClientBase,
    ClientMetaConfig,
    ClientCreate,
    ClientUpdate,
    ClientResponse,
    ClientListResponse,
    ClientListParams,
} from './client';

// User types
export type {
    UserProfile,
    AuthConfig,
} from './user';

// Metric types
export type {
    MetricBase,
    MetricCreate,
    MetricUpdate,
    MetricResponse,
    MetricListResponse,
    MetricSummary,
    MetricListParams,
    MetricSummaryParams,
} from './metric';

// API types
export type {
    ApiResponse,
    ApiError,
    PaginatedResponse,
    ApiResult,
} from './api';

// Common/utility types
export type {
    HttpMethod,
    PaginationParams,
    DateRangeParams,
    LoadingState,
    AsyncState,
    SortConfig,
    FieldError,
    FormState,
    PartialNullable,
    RequireKeys,
} from './common';

