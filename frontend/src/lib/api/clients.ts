/**
 * Client API Service - Type-safe client CRUD operations.
 *
 * This service wraps the generic API client with client-specific
 * methods and Zod validation. It is optimized for use in Client Components.
 * For Server Components, use `serverApi.clients`.
 *
 * @see API_LAYER.md for architecture details.
 */
import { api } from './client';
import { ClientResponseSchema, ClientListResponseSchema } from '@/lib/schemas';
import type {
  ClientCreate,
  ClientUpdate,
  ClientResponse,
  ClientListResponse,
  ClientListParams,
} from '@/types';

const BASE_PATH = '/api/v1/clients';

// =============================================================================
// CLIENT SERVICE
// =============================================================================

/**
 * Client API service with type-safe methods.
 */
export const clientService = {
  /**
   * Get paginated list of clients.
   *
   * @param {ClientListParams} [params] - Optional pagination and filtering.
   * @returns {Promise<ClientListResponse>} A paginated list of client objects.
   * @throws {ApiClientError} If the API returns a non-2xx status or validation fails.
   *
   * @example
   * const { items, total } = await clientService.list({ page: 1, active_only: true });
   */
  async list(params?: ClientListParams): Promise<ClientListResponse> {
    return api.get(BASE_PATH, {
      schema: ClientListResponseSchema,
      params: params as unknown as Record<
        string,
        string | number | boolean | undefined
      >,
    });
  },

  /**
   * Get a single client by ID.
   *
   * @example
   * const client = await clientService.get(123);
   */
  async get(id: number): Promise<ClientResponse> {
    return api.get(`${BASE_PATH}/${id}`, {
      schema: ClientResponseSchema,
    });
  },

  /**
   * Create a new client.
   *
   * @example
   * const newClient = await clientService.create({
   *   name: 'Acme Corp',
   *   slug: 'acme-corp',
   *   active: true
   * });
   */
  async create(data: ClientCreate): Promise<ClientResponse> {
    return api.post(BASE_PATH, {
      body: data,
      schema: ClientResponseSchema,
    });
  },

  /**
   * Update an existing client.
   *
   * @example
   * const updated = await clientService.update(123, { name: 'New Name' });
   */
  async update(id: number, data: ClientUpdate): Promise<ClientResponse> {
    return api.patch(`${BASE_PATH}/${id}`, {
      body: data,
      schema: ClientResponseSchema,
    });
  },

  /**
   * Delete a client.
   *
   * @example
   * await clientService.delete(123);
   */
  async delete(id: number): Promise<void> {
    return api.delete(`${BASE_PATH}/${id}`);
  },
};

export default clientService;
