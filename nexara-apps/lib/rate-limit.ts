// lib/rate-limit.ts
// Simple in-memory rate limiter with sliding window

interface RateLimitConfig {
    interval: number; // Time window in milliseconds
    maxRequests: number; // Maximum requests allowed in the window
}

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

// In-memory store (works for single-server deployments)
// For production with multiple servers, use Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        for (const [key, entry] of rateLimitStore.entries()) {
            if (entry.resetAt < now) {
                rateLimitStore.delete(key);
            }
        }
    }, 60000); // Clean up every minute
}

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetAt: number;
    limit: number;
}

/**
 * Check if a request should be rate limited
 * @param key - Unique identifier (usually IP address)
 * @param config - Rate limit configuration
 * @returns RateLimitResult with success status and remaining requests
 */
export function rateLimit(
    key: string,
    config: RateLimitConfig = { interval: 60000, maxRequests: 10 }
): RateLimitResult {
    const now = Date.now();
    const entry = rateLimitStore.get(key);

    // If no entry or window has expired, create new entry
    if (!entry || entry.resetAt < now) {
        const newEntry: RateLimitEntry = {
            count: 1,
            resetAt: now + config.interval
        };
        rateLimitStore.set(key, newEntry);

        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetAt: newEntry.resetAt,
            limit: config.maxRequests
        };
    }

    // Check if limit exceeded
    if (entry.count >= config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetAt: entry.resetAt,
            limit: config.maxRequests
        };
    }

    // Increment count
    entry.count++;

    return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
        limit: config.maxRequests
    };
}

/**
 * Get client IP from request headers
 * Works with Vercel, Cloudflare, and standard proxies
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const cfIp = request.headers.get("cf-connecting-ip");

    if (cfIp) return cfIp;
    if (realIp) return realIp;
    if (forwarded) return forwarded.split(",")[0].trim();

    return "unknown";
}

/**
 * Rate limit response helper
 */
export function rateLimitResponse(result: RateLimitResult): Response {
    return new Response(
        JSON.stringify({
            error: "Too Many Requests",
            message: "Çok fazla istek gönderdiniz. Lütfen bir süre bekleyip tekrar deneyin.",
            retryAfter: Math.ceil((result.resetAt - Date.now()) / 1000)
        }),
        {
            status: 429,
            headers: {
                "Content-Type": "application/json",
                "X-RateLimit-Limit": result.limit.toString(),
                "X-RateLimit-Remaining": result.remaining.toString(),
                "X-RateLimit-Reset": result.resetAt.toString(),
                "Retry-After": Math.ceil((result.resetAt - Date.now()) / 1000).toString()
            }
        }
    );
}

// Preset configurations
export const rateLimitConfigs = {
    // Strict: 5 requests per minute (for auth endpoints)
    strict: { interval: 60000, maxRequests: 5 },
    // Standard: 30 requests per minute
    standard: { interval: 60000, maxRequests: 30 },
    // Relaxed: 100 requests per minute
    relaxed: { interval: 60000, maxRequests: 100 },
    // Newsletter: 3 requests per hour
    newsletter: { interval: 3600000, maxRequests: 3 }
};
