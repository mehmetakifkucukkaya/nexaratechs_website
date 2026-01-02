// __tests__/lib/schemas.test.ts
// Unit tests for Zod validation schemas

import {
    AppDataSchema,
    BetaSubscriptionSchema,
    N8nWebhookPayloadSchema,
    NewsletterSubscriptionSchema,
    TesterDataSchema,
    validateAppData,
    validateEmail,
    validateTesterData,
} from '@/lib/schemas';

describe('Zod Schemas', () => {
    describe('AppDataSchema', () => {
        const validAppData = {
            slug: 'test-app',
            name: 'Test App',
            developer: 'Test Developer',
            shortDescription: 'A short description for testing purposes.',
            fullDescription: 'A full description that is at least 20 characters long.',
            status: 'Beta' as const,
            version: '1.0.0',
            category: 'Productivity',
        };

        it('should validate correct app data', () => {
            const result = AppDataSchema.safeParse(validAppData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid slug format', () => {
            const result = AppDataSchema.safeParse({
                ...validAppData,
                slug: 'Invalid Slug With Spaces',
            });
            expect(result.success).toBe(false);
        });

        it('should reject empty name', () => {
            const result = AppDataSchema.safeParse({
                ...validAppData,
                name: '',
            });
            expect(result.success).toBe(false);
        });

        it('should reject invalid version format', () => {
            const result = AppDataSchema.safeParse({
                ...validAppData,
                version: 'v1.0',
            });
            expect(result.success).toBe(false);
        });

        it('should reject invalid status', () => {
            const result = AppDataSchema.safeParse({
                ...validAppData,
                status: 'Invalid',
            });
            expect(result.success).toBe(false);
        });

        it('should allow optional fields to be omitted', () => {
            const result = AppDataSchema.safeParse(validAppData);
            expect(result.success).toBe(true);
        });

        it('should reject short descriptions that are too short', () => {
            const result = AppDataSchema.safeParse({
                ...validAppData,
                shortDescription: 'Too short',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('TesterDataSchema', () => {
        const validTesterData = {
            fullName: 'John Doe',
            email: 'john@example.com',
            device: 'iPhone 15 Pro',
        };

        it('should validate correct tester data', () => {
            const result = TesterDataSchema.safeParse(validTesterData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const result = TesterDataSchema.safeParse({
                ...validTesterData,
                email: 'not-an-email',
            });
            expect(result.success).toBe(false);
        });

        it('should reject short full name', () => {
            const result = TesterDataSchema.safeParse({
                ...validTesterData,
                fullName: 'A',
            });
            expect(result.success).toBe(false);
        });

        it('should accept valid status values', () => {
            const statuses = ['pending', 'approved', 'rejected'] as const;

            statuses.forEach(status => {
                const result = TesterDataSchema.safeParse({
                    ...validTesterData,
                    status,
                });
                expect(result.success).toBe(true);
            });
        });

        it('should reject invalid status', () => {
            const result = TesterDataSchema.safeParse({
                ...validTesterData,
                status: 'invalid',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('NewsletterSubscriptionSchema', () => {
        it('should validate correct email', () => {
            const result = NewsletterSubscriptionSchema.safeParse({
                email: 'test@example.com',
            });
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidEmails = [
                'not-an-email',
                '@nodomain.com',
                'missing@',
                '',
            ];

            invalidEmails.forEach(email => {
                const result = NewsletterSubscriptionSchema.safeParse({ email });
                expect(result.success).toBe(false);
            });
        });
    });

    describe('BetaSubscriptionSchema', () => {
        it('should validate correct email', () => {
            const result = BetaSubscriptionSchema.safeParse({
                email: 'beta@example.com',
            });
            expect(result.success).toBe(true);
        });
    });

    describe('N8nWebhookPayloadSchema', () => {
        it('should validate minimal payload', () => {
            const result = N8nWebhookPayloadSchema.safeParse({
                name: 'New App',
            });
            expect(result.success).toBe(true);
        });

        it('should validate full payload', () => {
            const result = N8nWebhookPayloadSchema.safeParse({
                name: 'New App',
                slug: 'new-app',
                developer: 'Developer',
                shortDescription: 'Short desc',
                fullDescription: 'Full description',
                logoUrl: 'https://example.com/logo.png',
                screenshots: ['https://example.com/ss1.png', 'https://example.com/ss2.png'],
                features: [{ title: 'Feature', description: 'Desc' }],
                status: 'Beta',
                version: '1.0.0',
                category: 'Tools',
                downloadUrl: 'https://play.google.com/store/apps/details?id=com.example',
                order: 1,
            });
            expect(result.success).toBe(true);
        });

        it('should reject payload without name', () => {
            const result = N8nWebhookPayloadSchema.safeParse({
                developer: 'Developer',
            });
            expect(result.success).toBe(false);
        });
    });

    describe('Helper Functions', () => {
        it('validateAppData should work correctly', () => {
            const valid = validateAppData({
                slug: 'test',
                name: 'Test',
                developer: 'Dev',
                shortDescription: 'A valid short description here.',
                fullDescription: 'A valid full description here.',
                status: 'Live',
                version: '1.0.0',
                category: 'Test',
            });
            expect(valid.success).toBe(true);

            const invalid = validateAppData({ name: 'Test' });
            expect(invalid.success).toBe(false);
        });

        it('validateTesterData should work correctly', () => {
            const valid = validateTesterData({
                fullName: 'John Doe',
                email: 'john@example.com',
                device: 'iPhone',
            });
            expect(valid.success).toBe(true);
        });

        it('validateEmail should work correctly', () => {
            const valid = validateEmail('test@example.com');
            expect(valid.success).toBe(true);

            const invalid = validateEmail('not-an-email');
            expect(invalid.success).toBe(false);
        });
    });
});
