/**
 * User Zod Schemas - Runtime validation for user data.
 */
import { z } from 'zod';

/**
 * Schema for validating user profile responses.
 */
export const UserProfileSchema = z.object({
  id: z.string().min(1),
  email: z.string().email().nullable().optional(),
  permissions: z.array(z.string()),
});

// =============================================================================
// TYPE INFERENCE
// =============================================================================

export type UserProfileZod = z.infer<typeof UserProfileSchema>;
