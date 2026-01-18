/**
 * Metric Zod Schemas - Runtime validation for metrics API responses.
 *
 * These schemas validate API responses at runtime, catching backend
 * regressions and type mismatches early.
 *
 * Keep in sync with: backend/app/api/v1/schemas/metric.py
 */
import { z } from 'zod';

// =============================================================================
// BASE SCHEMAS
// =============================================================================

/**
 * Base metric schema with core fields.
 */
export const MetricBaseSchema = z.object({
  date: z.string().datetime(),
  platform: z.string().min(1).max(50),
  impressions: z.number().int().nonnegative(),
  clicks: z.number().int().nonnegative(),
  spend: z.number().nonnegative(),
  leads: z.number().int().nonnegative(),
});

// =============================================================================
// REQUEST SCHEMAS
// =============================================================================

/**
 * Schema for creating a new metric.
 */
export const MetricCreateSchema = MetricBaseSchema.extend({
  client_id: z.number().int().positive(),
  raw_data: z.record(z.string(), z.unknown()).optional().default({}),
});

/**
 * Schema for updating a metric (all fields optional).
 */
export const MetricUpdateSchema = z.object({
  impressions: z.number().int().nonnegative().optional(),
  clicks: z.number().int().nonnegative().optional(),
  spend: z.number().nonnegative().optional(),
  leads: z.number().int().nonnegative().optional(),
  raw_data: z.record(z.string(), z.unknown()).nullable().optional(),
});

// =============================================================================
// RESPONSE SCHEMAS
// =============================================================================

/**
 * Schema for validating metric API responses.
 */
export const MetricResponseSchema = MetricBaseSchema.extend({
  id: z.number().int().positive(),
  client_id: z.number().int().positive(),
  raw_data: z.record(z.string(), z.unknown()),
  created_at: z.string().datetime(),
});

/**
 * Schema for validating paginated metric list responses.
 */
export const MetricListResponseSchema = z.object({
  items: z.array(MetricResponseSchema),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  page_size: z.number().int().positive().max(500),
});

/**
 * Schema for validating metric summary responses.
 */
export const MetricSummarySchema = z.object({
  client_id: z.number().int().positive(),
  platform: z.string(),
  date_from: z.string().datetime(),
  date_to: z.string().datetime(),
  total_impressions: z.number().int().nonnegative(),
  total_clicks: z.number().int().nonnegative(),
  total_spend: z.number().nonnegative(),
  total_leads: z.number().int().nonnegative(),
  ctr: z.number().nonnegative(),
  cpl: z.number().nonnegative().nullable(),
});

// =============================================================================
// TYPE INFERENCE (Zod-inferred types for type safety)
// =============================================================================

/** Inferred type from MetricResponseSchema */
export type MetricResponseZod = z.infer<typeof MetricResponseSchema>;

/** Inferred type from MetricListResponseSchema */
export type MetricListResponseZod = z.infer<typeof MetricListResponseSchema>;

/** Inferred type from MetricSummarySchema */
export type MetricSummaryZod = z.infer<typeof MetricSummarySchema>;

/** Inferred type from MetricCreateSchema */
export type MetricCreateZod = z.infer<typeof MetricCreateSchema>;

/** Inferred type from MetricUpdateSchema */
export type MetricUpdateZod = z.infer<typeof MetricUpdateSchema>;
