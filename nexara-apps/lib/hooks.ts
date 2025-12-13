// lib/hooks.ts
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * A hook that returns a debounced version of the provided value.
 * The debounced value only updates after the specified delay has passed
 * since the last change to the input value.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * A hook that returns a debounced version of the provided callback.
 * The callback will only be executed after the specified delay has passed
 * since the last invocation.
 */
export function useDebouncedCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number
): (...args: Parameters<T>) => void {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const callbackRef = useRef(callback);

    // Update the callback ref on each render
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return useCallback(
        (...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callbackRef.current(...args);
            }, delay);
        },
        [delay]
    );
}

/**
 * A hook that returns a throttled version of the provided callback.
 * The callback will only be executed at most once per specified interval.
 */
export function useThrottledCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    interval: number
): (...args: Parameters<T>) => void {
    const lastExecutedRef = useRef<number>(0);
    const callbackRef = useRef(callback);

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback(
        (...args: Parameters<T>) => {
            const now = Date.now();
            if (now - lastExecutedRef.current >= interval) {
                lastExecutedRef.current = now;
                callbackRef.current(...args);
            }
        },
        [interval]
    );
}
