// app/api/auth/validate/route.ts - Token validation endpoint for middleware
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const adminToken = request.cookies.get('admin_token')?.value;

    if (!adminToken) {
        return NextResponse.json(
            { valid: false, reason: 'no_token' },
            { status: 401 }
        );
    }

    try {
        // Firebase ID tokens are JWTs - we decode and verify basic structure
        // Full verification would require firebase-admin SDK
        // For now, we verify the token structure and expiration

        const tokenParts = adminToken.split('.');

        if (tokenParts.length !== 3) {
            // Not a valid JWT structure
            return NextResponse.json(
                { valid: false, reason: 'invalid_structure' },
                { status: 401 }
            );
        }

        // Decode the payload (second part)
        const payloadBase64 = tokenParts[1];
        // Handle base64url encoding
        const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
        const payloadJson = Buffer.from(base64, 'base64').toString('utf-8');
        const payload = JSON.parse(payloadJson);

        // Check expiration
        const now = Math.floor(Date.now() / 1000);

        if (payload.exp && payload.exp < now) {
            return NextResponse.json(
                { valid: false, reason: 'expired' },
                { status: 401 }
            );
        }

        // Check issued at (iat) - token shouldn't be from the future
        if (payload.iat && payload.iat > now + 60) {
            return NextResponse.json(
                { valid: false, reason: 'invalid_iat' },
                { status: 401 }
            );
        }

        // Token structure is valid and not expired
        return NextResponse.json({
            valid: true,
            expiresAt: payload.exp ? new Date(payload.exp * 1000).toISOString() : null
        });

    } catch (error) {
        console.error('Token validation error:', error);
        return NextResponse.json(
            { valid: false, reason: 'parse_error' },
            { status: 401 }
        );
    }
}
