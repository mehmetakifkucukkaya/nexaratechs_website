"use client";

/**
 * SkipLink component for keyboard accessibility
 * Allows keyboard users to skip directly to main content
 */
export default function SkipLink() {
    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all"
        >
            Skip to main content
        </a>
    );
}
