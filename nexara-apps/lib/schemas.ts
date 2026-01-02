// lib/schemas.ts
// Zod validation schemas for runtime type safety

import { z } from 'zod';

// Feature schema
export const FeatureSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    icon: z.union([z.string(), z.any()]).optional(),
});

// App Data schema
export const AppDataSchema = z.object({
    id: z.string().optional(),
    slug: z.string()
        .min(1, 'Slug is required')
        .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase letters, numbers, and hyphens only'),
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    developer: z.string().min(1, 'Developer is required'),
    shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(200, 'Short description too long'),
    fullDescription: z.string().min(20, 'Full description must be at least 20 characters'),
    logoGradient: z.string().optional(),
    icon: z.union([z.string(), z.any()]).optional(),
    screenshots: z.array(z.string().url('Invalid screenshot URL')).default([]),
    features: z.array(FeatureSchema).default([]),
    status: z.enum(['Beta', 'Live', 'Coming Soon']),
    version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z'),
    lastUpdated: z.string().optional(),
    category: z.string().min(1, 'Category is required'),
    downloadUrl: z.string().url('Invalid download URL').optional().or(z.literal('')),
    privacyUrl: z.string().optional(),
    privacyPolicy: z.string().optional(),
    primaryColor: z.string().optional(),
    logoUrl: z.string().url('Invalid logo URL').optional().or(z.literal('')),
    releaseDate: z.string().optional(),
    order: z.number().int().min(0).optional(),
    createdAt: z.any().optional(),
});

// Tester Data schema
export const TesterDataSchema = z.object({
    id: z.string().optional(),
    fullName: z.string().min(2, 'Full name must be at least 2 characters').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    device: z.string().min(1, 'Device information is required'),
    status: z.enum(['pending', 'approved', 'rejected']).optional(),
    assignedAppId: z.string().optional(),
    adminNotes: z.string().max(1000, 'Notes too long').optional(),
    appliedAt: z.any().optional(),
    updatedAt: z.any().optional(),
});

// Newsletter subscription schema
export const NewsletterSubscriptionSchema = z.object({
    email: z.string().email('Invalid email address'),
});

// Beta subscription schema
export const BetaSubscriptionSchema = z.object({
    email: z.string().email('Invalid email address'),
});

// n8n Webhook payload schema
export const N8nWebhookPayloadSchema = z.object({
    name: z.string().min(1, 'App name is required'),
    slug: z.string().optional(),
    developer: z.string().optional(),
    shortDescription: z.string().optional(),
    fullDescription: z.string().optional(),
    logoUrl: z.string().url().optional().or(z.literal('')),
    screenshots: z.array(z.string().url()).optional(),
    features: z.array(FeatureSchema).optional(),
    status: z.enum(['Beta', 'Live', 'Coming Soon']).optional(),
    version: z.string().optional(),
    releaseDate: z.string().optional(),
    category: z.string().optional(),
    downloadUrl: z.string().url().optional().or(z.literal('')),
    privacyUrl: z.string().optional(),
    order: z.number().int().optional(),
});

// Type exports inferred from schemas
export type AppDataInput = z.infer<typeof AppDataSchema>;
export type TesterDataInput = z.infer<typeof TesterDataSchema>;
export type NewsletterSubscriptionInput = z.infer<typeof NewsletterSubscriptionSchema>;
export type BetaSubscriptionInput = z.infer<typeof BetaSubscriptionSchema>;
export type N8nWebhookPayloadInput = z.infer<typeof N8nWebhookPayloadSchema>;

// Validation helper functions
export function validateAppData(data: unknown) {
    return AppDataSchema.safeParse(data);
}

export function validateTesterData(data: unknown) {
    return TesterDataSchema.safeParse(data);
}

export function validateEmail(email: unknown) {
    return NewsletterSubscriptionSchema.safeParse({ email });
}

export function validateN8nPayload(data: unknown) {
    return N8nWebhookPayloadSchema.safeParse(data);
}
