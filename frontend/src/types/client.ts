/**
 * Client Types - TypeScript interfaces matching backend Pydantic schemas.
 * 
 * These types define the contract between frontend and backend.
 * Keep in sync with: backend/app/api/v1/schemas/client.py
 */

// =============================================================================
// BASE TYPES
// =============================================================================

/**
 * Core client properties shared across create/update/response.
 */
export interface ClientBase {
    /** Display name for the client */
    name: string;
    /** URL-friendly identifier (lowercase alphanumeric with hyphens) */
    slug?: string | null;
    /** Whether the client is currently active */
    active: boolean;
}

/**
 * Meta Ads platform configuration.
 */
export interface ClientMetaConfig {
    /** Facebook/Meta Ads account ID */
    meta_ad_account_id?: string | null;
}

// =============================================================================
// REQUEST TYPES
// =============================================================================

/**
 * Payload for creating a new client.
 */
export interface ClientCreate extends ClientBase, ClientMetaConfig {
    /** Meta API access token (write-only, never returned) */
    meta_access_token?: string | null;
    /** Flexible JSON configuration */
    config?: Record<string, unknown>;
}

/**
 * Payload for updating an existing client.
 * All fields are optional - only provided fields will be updated.
 */
export interface ClientUpdate {
    name?: string;
    slug?: string | null;
    active?: boolean;
    meta_ad_account_id?: string | null;
    meta_access_token?: string | null;
    config?: Record<string, unknown> | null;
}

// =============================================================================
// RESPONSE TYPES
// =============================================================================

/**
 * Client data returned from the API.
 * Note: Sensitive fields like meta_access_token are excluded.
 */
export interface ClientResponse extends ClientBase, ClientMetaConfig {
    /** Unique client identifier */
    id: number;
    /** Flexible JSON configuration */
    config: Record<string, unknown>;
    /** When the client was created */
    created_at: string; // ISO 8601 datetime string
    /** Last update timestamp */
    updated_at?: string | null;
}

/**
 * Paginated list of clients.
 */
export interface ClientListResponse {
    /** List of clients */
    items: ClientResponse[];
    /** Total number of clients matching the query */
    total: number;
    /** Current page number (1-indexed) */
    page: number;
    /** Number of items per page */
    page_size: number;
}

// =============================================================================
// QUERY PARAMS
// =============================================================================

/**
 * Query parameters for listing clients.
 */
export interface ClientListParams {
    page?: number;
    page_size?: number;
    active_only?: boolean;
}
