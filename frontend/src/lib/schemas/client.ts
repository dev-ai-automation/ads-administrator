/**
 * Client Zod Schemas - Runtime validation for API responses.
 * 
 * These schemas validate API responses at runtime, catching backend
 * regressions and type mismatches early.
 * 
 * Keep in sync with: backend/app/api/v1/schemas/client.py
 */
import { z } from 'zod';

// =============================================================================
// BASE SCHEMAS
// =============================================================================

/**
 * Base client schema with shared fields.
 */
export const ClientBaseSchema = z.object({
    name: z.string().min(1).max(255),
    slug: z.string().max(100).regex(/^[a-z0-9-]+$/).nullable().optional(),
    active: z.boolean(),
});

/**
 * Meta Ads configuration schema.
 */
export const ClientMetaConfigSchema = z.object({
    meta_ad_account_id: z.string().max(50).nullable().optional(),
});

// =============================================================================
// REQUEST SCHEMAS
// =============================================================================

/**
 * Schema for creating a new client.
 */
export const ClientCreateSchema = ClientBaseSchema.merge(ClientMetaConfigSchema).extend({
    meta_access_token: z.string().nullable().optional(),
    config: z.record(z.string(), z.unknown()).default({}),
});

/**
 * Schema for updating an existing client (all fields optional).
 */
export const ClientUpdateSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    slug: z.string().max(100).regex(/^[a-z0-9-]+$/).nullable().optional(),
    active: z.boolean().optional(),
    meta_ad_account_id: z.string().max(50).nullable().optional(),
    meta_access_token: z.string().nullable().optional(),
    config: z.record(z.string(), z.unknown()).nullable().optional(),
});

// =============================================================================
// RESPONSE SCHEMAS
// =============================================================================

/**
 * Schema for validating client API responses.
 */
export const ClientResponseSchema = ClientBaseSchema.merge(ClientMetaConfigSchema).extend({
    id: z.number().int().positive(),
    config: z.record(z.string(), z.unknown()),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime().nullable().optional(),
});

/**
 * Schema for validating paginated client list responses.
 */
export const ClientListResponseSchema = z.object({
    items: z.array(ClientResponseSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    page_size: z.number().int().positive().max(100),
});

// =============================================================================
// TYPE INFERENCE (Zod-inferred types for type safety)
// =============================================================================

/** Inferred type from ClientResponseSchema */
export type ClientResponseZod = z.infer<typeof ClientResponseSchema>;

/** Inferred type from ClientListResponseSchema */
export type ClientListResponseZod = z.infer<typeof ClientListResponseSchema>;

/** Inferred type from ClientCreateSchema */
export type ClientCreateZod = z.infer<typeof ClientCreateSchema>;

/** Inferred type from ClientUpdateSchema */
export type ClientUpdateZod = z.infer<typeof ClientUpdateSchema>;
