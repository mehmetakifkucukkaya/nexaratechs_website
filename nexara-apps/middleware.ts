import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if accessing admin route
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const session = request.cookies.get('admin_session');

        // If no session cookie, redirect to login
        if (!session) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
