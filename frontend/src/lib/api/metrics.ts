/**
 * Metrics API Service - Type-safe metrics operations.
 * 
 * This service wraps the generic API client with metrics-specific
 * methods and Zod validation.
 */
import { api } from './client';
import {
    MetricResponseSchema,
    MetricListResponseSchema,
    MetricSummarySchema,
} from '@/lib/schemas';
import type {
    MetricCreate,
    MetricResponse,
    MetricListResponse,
    MetricListParams,
    MetricSummary,
    MetricSummaryParams,
} from '@/types';

const BASE_PATH = '/api/v1/metrics';

// =============================================================================
// METRICS SERVICE
// =============================================================================

/**
 * Metrics API service with type-safe methods.
 */
export const metricsService = {
    /**
     * Get paginated list of metrics with optional filters.
     * 
     * @example
     * const { items, total } = await metricsService.list({
     *   client_id: 123,
     *   platform: 'meta',
     *   date_from: '2024-01-01',
     * });
     */
    async list(params?: MetricListParams): Promise<MetricListResponse> {
        return api.get(BASE_PATH, {
            schema: MetricListResponseSchema,
            params: params as Record<string, string | number | boolean | undefined>,
        });
    },

    /**
     * Get a single metric by ID.
     * 
     * @example
     * const metric = await metricsService.get(123);
     */
    async get(id: number): Promise<MetricResponse> {
        return api.get(`${BASE_PATH}/${id}`, {
            schema: MetricResponseSchema,
        });
    },

    /**
     * Create a new metric entry.
     * 
     * @example
     * const metric = await metricsService.create({
     *   client_id: 123,
     *   date: '2024-01-15T00:00:00Z',
     *   platform: 'meta',
     *   impressions: 1500,
     *   clicks: 45,
     *   spend: 75.50,
     *   leads: 3,
     * });
     */
    async create(data: MetricCreate): Promise<MetricResponse> {
        return api.post(BASE_PATH, {
            body: data,
            schema: MetricResponseSchema,
        });
    },

    /**
     * Get aggregated metrics summary for a client.
     * 
     * @example
     * const summary = await metricsService.getSummary(123, {
     *   platform: 'meta',
     *   date_from: '2024-01-01',
     *   date_to: '2024-01-31',
     * });
     * console.log(`CTR: ${summary.ctr}%, CPL: $${summary.cpl}`);
     */
    async getSummary(clientId: number, params?: MetricSummaryParams): Promise<MetricSummary> {
        return api.get(`${BASE_PATH}/summary/${clientId}`, {
            schema: MetricSummarySchema,
            params: params as Record<string, string | number | boolean | undefined>,
        });
    },

    /**
     * Get metrics for a specific client.
     * Convenience method that pre-filters by client_id.
     * 
     * @example
     * const clientMetrics = await metricsService.getByClient(123, {
     *   platform: 'meta'
     * });
     */
    async getByClient(
        clientId: number,
        params?: Omit<MetricListParams, 'client_id'>
    ): Promise<MetricListResponse> {
        return this.list({ ...params, client_id: clientId });
    },
};

export default metricsService;
