import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
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
