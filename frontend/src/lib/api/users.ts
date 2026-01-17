/**
 * User API Service - Authentication and user profile operations.
 */
import { api } from './client';
import { UserProfileSchema } from '@/lib/schemas';
import type { UserProfile } from '@/types';

const BASE_PATH = '/api/v1/users';

// =============================================================================
// USER SERVICE
// =============================================================================

/**
 * User API service with type-safe methods.
 */
export const userService = {
    /**
     * Get the current authenticated user's profile.
     * 
     * @example
     * const profile = await userService.getProfile();
     * console.log(profile.email, profile.permissions);
     */
    async getProfile(): Promise<UserProfile> {
        return api.get(`${BASE_PATH}/me`, {
            schema: UserProfileSchema,
        });
    },
};

export default userService;
