// __tests__/lib/rate-limit.test.ts
// Unit tests for rate limiting functionality

import { getClientIp, rateLimit, rateLimitConfigs } from '@/lib/rate-limit';

describe('Rate Limit', () => {
    beforeEach(() => {
        // Clear any state between tests by waiting for intervals to reset
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('rateLimit function', () => {
        it('should allow first request', () => {
            const result = rateLimit('test-ip-1', { interval: 60000, maxRequests: 5 });

            expect(result.success).toBe(true);
            expect(result.remaining).toBe(4);
            expect(result.limit).toBe(5);
        });

        it('should track request count', () => {
            const key = 'test-ip-2';
            const config = { interval: 60000, maxRequests: 3 };

            const result1 = rateLimit(key, config);
            const result2 = rateLimit(key, config);
            const result3 = rateLimit(key, config);

            expect(result1.remaining).toBe(2);
            expect(result2.remaining).toBe(1);
            expect(result3.remaining).toBe(0);
        });

        it('should block requests when limit exceeded', () => {
            const key = 'test-ip-3';
            const config = { interval: 60000, maxRequests: 2 };

            rateLimit(key, config); // 1st
            rateLimit(key, config); // 2nd
            const result = rateLimit(key, config); // 3rd - should be blocked

            expect(result.success).toBe(false);
            expect(result.remaining).toBe(0);
        });

        it('should reset after interval expires', () => {
            const key = 'test-ip-4';
            const config = { interval: 1000, maxRequests: 1 };

            rateLimit(key, config); // Use up the limit
            const blockedResult = rateLimit(key, config);
            expect(blockedResult.success).toBe(false);

            // Advance time past the interval
            jest.advanceTimersByTime(1500);

            const resetResult = rateLimit(key, config);
            expect(resetResult.success).toBe(true);
        });

        it('should use default config when not provided', () => {
            const result = rateLimit('test-ip-5');

            expect(result.limit).toBe(10); // Default maxRequests
            expect(result.success).toBe(true);
        });
    });

    describe('getClientIp function', () => {
        it('should extract IP from cf-connecting-ip header', () => {
            const mockRequest = {
                headers: new Headers({
                    'cf-connecting-ip': '1.2.3.4',
                    'x-forwarded-for': '5.6.7.8',
                }),
            } as Request;

            expect(getClientIp(mockRequest)).toBe('1.2.3.4');
        });

        it('should extract IP from x-real-ip header', () => {
            const mockRequest = {
                headers: new Headers({
                    'x-real-ip': '1.2.3.4',
                    'x-forwarded-for': '5.6.7.8',
                }),
            } as Request;

            expect(getClientIp(mockRequest)).toBe('1.2.3.4');
        });

        it('should extract first IP from x-forwarded-for header', () => {
            const mockRequest = {
                headers: new Headers({
                    'x-forwarded-for': '1.2.3.4, 5.6.7.8, 9.10.11.12',
                }),
            } as Request;

            expect(getClientIp(mockRequest)).toBe('1.2.3.4');
        });

        it('should return unknown when no IP headers present', () => {
            const mockRequest = {
                headers: new Headers({}),
            } as Request;

            expect(getClientIp(mockRequest)).toBe('unknown');
        });
    });

    describe('rateLimitConfigs', () => {
        it('should have strict config with 5 requests per minute', () => {
            expect(rateLimitConfigs.strict).toEqual({
                interval: 60000,
                maxRequests: 5,
            });
        });

        it('should have standard config with 30 requests per minute', () => {
            expect(rateLimitConfigs.standard).toEqual({
                interval: 60000,
                maxRequests: 30,
            });
        });

        it('should have relaxed config with 100 requests per minute', () => {
            expect(rateLimitConfigs.relaxed).toEqual({
                interval: 60000,
                maxRequests: 100,
            });
        });

        it('should have newsletter config with 3 requests per hour', () => {
            expect(rateLimitConfigs.newsletter).toEqual({
                interval: 3600000,
                maxRequests: 3,
            });
        });
    });
});
