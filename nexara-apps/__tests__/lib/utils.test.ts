// __tests__/lib/utils.test.ts
// Unit tests for utility functions

import { cn } from '@/lib/utils';

describe('Utils', () => {
    describe('cn function', () => {
        it('should merge single class', () => {
            expect(cn('text-red-500')).toBe('text-red-500');
        });

        it('should merge multiple classes', () => {
            const result = cn('p-4', 'text-white', 'bg-black');
            expect(result).toContain('p-4');
            expect(result).toContain('text-white');
            expect(result).toContain('bg-black');
        });

        it('should handle conditional classes', () => {
            const isActive = true;
            const result = cn('base-class', isActive && 'active-class');
            expect(result).toContain('base-class');
            expect(result).toContain('active-class');
        });

        it('should filter out falsy values', () => {
            const result = cn('base', false && 'hidden', null, undefined, 'visible');
            expect(result).toBe('base visible');
        });

        it('should merge Tailwind conflicting classes correctly', () => {
            // twMerge should keep the last conflicting class
            const result = cn('p-2', 'p-4');
            expect(result).toBe('p-4');
        });

        it('should merge conflicting text colors', () => {
            const result = cn('text-red-500', 'text-blue-500');
            expect(result).toBe('text-blue-500');
        });

        it('should handle object syntax', () => {
            const result = cn({
                'bg-red-500': true,
                'bg-blue-500': false,
            });
            expect(result).toBe('bg-red-500');
        });

        it('should handle array syntax', () => {
            const result = cn(['p-4', 'm-2']);
            expect(result).toContain('p-4');
            expect(result).toContain('m-2');
        });

        it('should handle mixed syntax', () => {
            const result = cn('base', ['array-class'], { 'object-class': true });
            expect(result).toContain('base');
            expect(result).toContain('array-class');
            expect(result).toContain('object-class');
        });

        it('should return empty string for no arguments', () => {
            expect(cn()).toBe('');
        });

        it('should handle empty string arguments', () => {
            expect(cn('', 'valid-class', '')).toBe('valid-class');
        });

        it('should handle complex responsive classes', () => {
            const result = cn('p-2', 'md:p-4', 'lg:p-6');
            expect(result).toContain('p-2');
            expect(result).toContain('md:p-4');
            expect(result).toContain('lg:p-6');
        });

        it('should handle pseudo-class variants', () => {
            const result = cn('bg-white', 'hover:bg-gray-100', 'focus:ring-2');
            expect(result).toContain('bg-white');
            expect(result).toContain('hover:bg-gray-100');
            expect(result).toContain('focus:ring-2');
        });
    });
});
