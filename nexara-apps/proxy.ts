import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    // Check if accessing admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const token = request.cookies.get('admin_token');

        // If no token cookie, redirect to login
        if (!token || !token.value) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
