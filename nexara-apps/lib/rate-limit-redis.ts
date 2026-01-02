// lib/rate-limit-redis.ts
// Redis-based rate limiting using Upstash for production use
// Falls back to in-memory rate limiting if Redis is not configured

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Check if Upstash Redis is configured
const isRedisConfigured = !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
);

// Create Redis client if configured
const redis = isRedisConfigured
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL!,
        token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    : null;

// Rate limiter instances with different configurations
export const rateLimiters = {
    // Strict: 5 requests per minute (for auth endpoints)
    strict: redis
        ? new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(5, '1 m'),
            analytics: true,
            prefix: 'ratelimit:strict',
        })
        : null,

    // Standard: 30 requests per minute
    standard: redis
        ? new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(30, '1 m'),
            analytics: true,
            prefix: 'ratelimit:standard',
        })
        : null,

    // Relaxed: 100 requests per minute
    relaxed: redis
        ? new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(100, '1 m'),
            analytics: true,
            prefix: 'ratelimit:relaxed',
        })
        : null,

    // Newsletter: 3 requests per hour
    newsletter: redis
        ? new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(3, '1 h'),
            analytics: true,
            prefix: 'ratelimit:newsletter',
        })
        : null,
};

export interface RateLimitResult {
    success: boolean;
    remaining: number;
    resetAt: number;
    limit: number;
}

// In-memory fallback store
const memoryStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Rate limit check with Redis (production) or in-memory (development) fallback
 */
export async function checkRateLimit(
    identifier: string,
    type: keyof typeof rateLimiters = 'standard'
): Promise<RateLimitResult> {
    const limiter = rateLimiters[type];

    // Use Redis rate limiter if available
    if (limiter) {
        const result = await limiter.limit(identifier);
        return {
            success: result.success,
            remaining: result.remaining,
            resetAt: result.reset,
            limit: result.limit,
        };
    }

    // Fallback to in-memory rate limiting
    const configs = {
        strict: { maxRequests: 5, interval: 60000 },
        standard: { maxRequests: 30, interval: 60000 },
        relaxed: { maxRequests: 100, interval: 60000 },
        newsletter: { maxRequests: 3, interval: 3600000 },
    };

    const config = configs[type];
    const now = Date.now();
    const key = `${type}:${identifier}`;
    const entry = memoryStore.get(key);

    if (!entry || entry.resetAt < now) {
        memoryStore.set(key, { count: 1, resetAt: now + config.interval });
        return {
            success: true,
            remaining: config.maxRequests - 1,
            resetAt: now + config.interval,
            limit: config.maxRequests,
        };
    }

    if (entry.count >= config.maxRequests) {
        return {
            success: false,
            remaining: 0,
            resetAt: entry.resetAt,
            limit: config.maxRequests,
        };
    }

    entry.count++;
    return {
        success: true,
        remaining: config.maxRequests - entry.count,
        resetAt: entry.resetAt,
        limit: config.maxRequests,
    };
}

/**
 * Get client IP from request headers
 */
export function getClientIp(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const cfIp = request.headers.get('cf-connecting-ip');

    if (cfIp) return cfIp;
    if (realIp) return realIp;
    if (forwarded) return forwarded.split(',')[0].trim();

    return 'unknown';
}

/**
 * Create rate limit error response
 */
export function rateLimitResponse(result: RateLimitResult): Response {
    const retryAfter = Math.ceil((result.resetAt - Date.now()) / 1000);

    return new Response(
        JSON.stringify({
            error: 'Too Many Requests',
            message: 'Çok fazla istek gönderdiniz. Lütfen bir süre bekleyip tekrar deneyin.',
            retryAfter: retryAfter > 0 ? retryAfter : 1,
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'X-RateLimit-Limit': result.limit.toString(),
                'X-RateLimit-Remaining': result.remaining.toString(),
                'X-RateLimit-Reset': result.resetAt.toString(),
                'Retry-After': (retryAfter > 0 ? retryAfter : 1).toString(),
            },
        }
    );
}

/**
 * Check if Redis rate limiting is active
 */
export function isRedisRateLimitingActive(): boolean {
    return isRedisConfigured;
}
