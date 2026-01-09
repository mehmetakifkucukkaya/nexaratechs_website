// lib/env.ts - Environment Variable Validation
import { z } from 'zod';

/**
 * Schema for environment variables
 * Validates all required and optional environment variables at startup
 */
const envSchema = z.object({
    // Firebase (Required for app to work)
    NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),
    NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),

    // Security
    ADMIN_PASSWORD: z.string().min(8, 'Admin password must be at least 8 characters'),
    N8N_WEBHOOK_SECRET: z.string().min(16, 'Webhook secret must be at least 16 characters').optional(),

    // Upstash Redis (Optional - for production rate limiting)
    UPSTASH_REDIS_REST_URL: z.string().url().optional(),
    UPSTASH_REDIS_REST_TOKEN: z.string().optional(),

    // Site Configuration
    NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('https://nexaratechs.com'),

    // Node environment
    NODE_ENV: z.enum(['development', 'production', 'test']).optional().default('development'),
});

export type EnvSchema = z.infer<typeof envSchema>;

/**
 * Validates environment variables at startup
 * Logs warnings in development, throws errors in production
 */
function validateEnv(): EnvSchema | null {
    // Skip validation on client-side
    if (typeof window !== 'undefined') {
        return null;
    }

    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('❌ Invalid or missing environment variables:');
        result.error.issues.forEach((issue) => {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
        });

        // In production, throw error to prevent startup with invalid config
        if (process.env.NODE_ENV === 'production') {
            throw new Error('Environment validation failed. Check logs for details.');
        }

        console.warn('⚠️ Continuing with potentially invalid environment (development mode)');
        return null;
    }

    if (process.env.NODE_ENV !== 'test') {
        console.log('✅ Environment variables validated successfully');
    }

    return result.data;
}

// Validate on module load (server-side only)
let validatedEnv: EnvSchema | null = null;

try {
    validatedEnv = validateEnv();
} catch (error) {
    // Re-throw in production, log in development
    if (process.env.NODE_ENV === 'production') {
        throw error;
    }
    console.error('Environment validation error:', error);
}

/**
 * Type-safe access to environment variables
 * Falls back to process.env if validation failed
 */
export function getEnv<K extends keyof EnvSchema>(key: K): EnvSchema[K] | undefined {
    if (validatedEnv) {
        return validatedEnv[key];
    }
    return process.env[key] as EnvSchema[K] | undefined;
}

/**
 * Check if a specific env var is set
 */
export function hasEnv(key: keyof EnvSchema): boolean {
    return !!getEnv(key);
}

/**
 * Get all validated environment variables
 * Returns null if validation failed
 */
export function getValidatedEnv(): EnvSchema | null {
    return validatedEnv;
}
