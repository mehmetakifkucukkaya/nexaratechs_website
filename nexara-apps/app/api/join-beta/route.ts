// app/api/join-beta/route.ts - Beta signup endpoint with rate limiting
import { subscribeToBeta } from '@/lib/db';
import { getClientIp, rateLimit, rateLimitConfigs, rateLimitResponse } from '@/lib/rate-limit';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Email validation schema
const JoinBetaSchema = z.object({
    email: z.string().email('Geçersiz email adresi'),
});

export async function POST(request: NextRequest) {
    const ip = getClientIp(request);

    // Rate limiting: 3 requests per hour per IP
    const limitResult = rateLimit(`beta:${ip}`, rateLimitConfigs.newsletter);

    if (!limitResult.success) {
        return rateLimitResponse(limitResult);
    }

    try {
        const body = await request.json();

        // Server-side validation
        const validation = JoinBetaSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                {
                    error: 'Geçersiz email adresi',
                    details: validation.error.issues
                },
                { status: 400 }
            );
        }

        // Subscribe to beta
        const result = await subscribeToBeta(validation.data.email);

        // Check if email was already registered
        if (result.alreadyExists) {
            return NextResponse.json(
                { error: 'Bu email adresi zaten kayıtlı' },
                { status: 409 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Beta kaydınız başarıyla tamamlandı!'
        });

    } catch (error: any) {
        console.error('Beta signup error:', error);

        // Handle duplicate email
        if (error.message?.includes('already registered') ||
            error.message?.includes('zaten kayıtlı')) {
            return NextResponse.json(
                { error: 'Bu email adresi zaten kayıtlı' },
                { status: 409 }
            );
        }

        return NextResponse.json(
            { error: 'Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.' },
            { status: 500 }
        );
    }
}
