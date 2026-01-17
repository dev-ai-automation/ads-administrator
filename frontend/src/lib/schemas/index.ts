/**
 * Schema Exports - Central export for all Zod schemas.
 * 
 * Import schemas from here for cleaner imports:
 * @example
 * import { ClientResponseSchema, MetricSummarySchema } from '@/lib/schemas';
 */

// Client schemas
export {
    ClientBaseSchema,
    ClientMetaConfigSchema,
    ClientCreateSchema,
    ClientUpdateSchema,
    ClientResponseSchema,
    ClientListResponseSchema,
    type ClientResponseZod,
    type ClientListResponseZod,
    type ClientCreateZod,
    type ClientUpdateZod,
} from './client';

// User schemas
export {
    UserProfileSchema,
    type UserProfileZod,
} from './user';

// Metric schemas
export {
    MetricBaseSchema,
    MetricCreateSchema,
    MetricUpdateSchema,
    MetricResponseSchema,
    MetricListResponseSchema,
    MetricSummarySchema,
    type MetricResponseZod,
    type MetricListResponseZod,
    type MetricSummaryZod,
    type MetricCreateZod,
    type MetricUpdateZod,
} from './metric';
