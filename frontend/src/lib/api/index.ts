/**
 * API Services Export - Central export for all API services.
 * 
 * @example
 * import { clientService, userService, metricsService, api } from '@/lib/api';
 * 
 * // Use domain-specific services
 * const clients = await clientService.list();
 * const profile = await userService.getProfile();
 * const summary = await metricsService.getSummary(123);
 * 
 * // Or use the generic API client for custom endpoints
 * const data = await api.get('/custom/endpoint', { schema: MySchema });
 */

// Core API client
export { api, ApiClientError, setTokenGetter } from './client';

// Domain services
export { clientService } from './clients';
export { userService } from './users';
export { metricsService } from './metrics';

// Server-side API (for Server Components)
export { serverApi } from './server';

