import { getClientIp, rateLimit, rateLimitConfigs, rateLimitResponse } from '@/lib/rate-limit';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    // Rate limiting: 5 attempts per minute to prevent brute-force
    const ip = getClientIp(request);
    const limitResult = rateLimit(`login:${ip}`, rateLimitConfigs.strict);

    if (!limitResult.success) {
        return rateLimitResponse(limitResult);
    }

    try {
        const { idToken } = await request.json();

        if (!idToken || typeof idToken !== 'string') {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 400 }
            );
        }

        // Set secure HTTP-only cookie
        const cookieStore = await cookies();

        // Cookie expires in 7 days
        const maxAge = 60 * 60 * 24 * 7;

        cookieStore.set('admin_token', idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
}

