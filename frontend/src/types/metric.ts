/**
 * Metric Types - TypeScript interfaces matching backend Pydantic schemas.
 * 
 * These types define the contract between frontend and backend for metrics.
 * Keep in sync with: backend/app/api/v1/schemas/metric.py
 */

// =============================================================================
// BASE TYPES
// =============================================================================

/**
 * Core metric properties.
 */
export interface MetricBase {
    /** Date of the metric (ISO 8601) */
    date: string;
    /** Source platform identifier */
    platform: string;
    /** Number of ad impressions */
    impressions: number;
    /** Number of ad clicks */
    clicks: number;
    /** Advertising spend in USD */
    spend: number;
    /** Number of leads/conversions */
    leads: number;
}

// =============================================================================
// REQUEST TYPES
// =============================================================================

/**
 * Payload for creating a new metric.
 */
export interface MetricCreate extends MetricBase {
    /** ID of the owning client */
    client_id: number;
    /** Platform-specific breakdown data */
    raw_data?: Record<string, unknown>;
}

/**
 * Payload for updating an existing metric.
 */
export interface MetricUpdate {
    impressions?: number;
    clicks?: number;
    spend?: number;
    leads?: number;
    raw_data?: Record<string, unknown> | null;
}

// =============================================================================
// RESPONSE TYPES
// =============================================================================

/**
 * Metric data returned from the API.
 */
export interface MetricResponse extends MetricBase {
    /** Unique metric identifier */
    id: number;
    /** ID of the owning client */
    client_id: number;
    /** Platform-specific breakdown data */
    raw_data: Record<string, unknown>;
    /** When the metric was recorded */
    created_at: string;
}

/**
 * Paginated list of metrics.
 */
export interface MetricListResponse {
    /** List of metrics */
    items: MetricResponse[];
    /** Total number of metrics matching the query */
    total: number;
    /** Current page number (1-indexed) */
    page: number;
    /** Number of items per page */
    page_size: number;
}

/**
 * Aggregated metrics summary.
 */
export interface MetricSummary {
    /** Client ID */
    client_id: number;
    /** Platform (or 'all') */
    platform: string;
    /** Start date of the range */
    date_from: string;
    /** End date of the range */
    date_to: string;
    /** Total impressions */
    total_impressions: number;
    /** Total clicks */
    total_clicks: number;
    /** Total spend in USD */
    total_spend: number;
    /** Total leads/conversions */
    total_leads: number;
    /** Click-through rate (percentage) */
    ctr: number;
    /** Cost per lead (nullable if no leads) */
    cpl: number | null;
}

// =============================================================================
// QUERY PARAMS
// =============================================================================

/**
 * Query parameters for listing metrics.
 */
export interface MetricListParams {
    client_id?: number;
    platform?: string;
    date_from?: string;
    date_to?: string;
    page?: number;
    page_size?: number;
}

/**
 * Query parameters for metrics summary.
 */
export interface MetricSummaryParams {
    platform?: string;
    date_from?: string;
    date_to?: string;
}
