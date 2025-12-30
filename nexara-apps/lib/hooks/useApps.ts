"use client";

import { AppData } from "@/lib/data";
import { getApp, getApps } from "@/lib/firebase";
import useSWR from "swr";

// SWR Configuration
const swrConfig = {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    errorRetryCount: 3,
    errorRetryInterval: 5000,
};

/**
 * Hook to fetch all apps with SWR caching
 * @returns Apps data, loading state, error, and mutate function
 */
export function useApps() {
    const { data, error, isLoading, mutate } = useSWR<AppData[]>(
        "apps",
        () => getApps(),
        {
            ...swrConfig,
            fallbackData: [],
        }
    );

    return {
        apps: data || [],
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}

/**
 * Hook to fetch a single app by slug with SWR caching
 * @param slug - App slug
 * @returns App data, loading state, error, and mutate function
 */
export function useApp(slug: string | null) {
    const { data, error, isLoading, mutate } = useSWR<AppData | undefined>(
        slug ? `app-${slug}` : null,
        slug ? () => getApp(slug) : null,
        swrConfig
    );

    return {
        app: data,
        isLoading,
        isError: !!error,
        error,
        mutate,
    };
}

/**
 * Prefetch apps data for faster initial load
 * Call this in a layout or parent component
 */
export function prefetchApps() {
    // Trigger fetch without waiting for result
    getApps().catch(console.error);
}

/**
 * Invalidate apps cache
 * Call this after adding/updating/deleting an app
 */
export async function invalidateAppsCache() {
    const { mutate } = await import("swr");
    await mutate("apps");
}

/**
 * Invalidate single app cache
 * @param slug - App slug to invalidate
 */
export async function invalidateAppCache(slug: string) {
    const { mutate } = await import("swr");
    await mutate(`app-${slug}`);
}
