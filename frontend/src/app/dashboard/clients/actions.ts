'use server';

import { serverApi } from '@/lib/api/server';
import { ClientCreateSchema } from '@/lib/schemas/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export type CreateClientState = {
    success?: boolean;
    errors?: Record<string, string[]>;
    message?: string;
} | null;

export async function createClientAction(data: unknown) {
    // 1. Validate input data against schema
    // We add default values for optional fields to ensure schema passes if they are missing
    const parsed = ClientCreateSchema.safeParse(data);

    if (!parsed.success) {
        return {
            success: false,
            errors: parsed.error.flatten().fieldErrors,
            message: 'Validation failed. Please check the form.'
        };
    }

    try {
        // 2. Call Backend API
        // serverApi handles token retrieval from cookies automatically
        await serverApi.clients.create(parsed.data);

    } catch (error: any) {
        console.error('Create Client Error:', error);
        return {
            success: false,
            message: error.message || 'Failed to create client. Please try again.'
        };
    }

    // 3. Revalidate and Redirect
    // This must happen outside try/catch because redirect() throws an error (NEXT_REDIRECT)
    revalidatePath('/dashboard/clients');
    redirect('/dashboard/clients');
}
