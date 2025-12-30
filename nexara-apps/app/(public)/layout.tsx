"use client";

import Footer from "@/components/Footer";
import FloatingNavbar from "@/components/home/FloatingNavbar";
import SkipLink from "@/components/SkipLink";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col font-sans relative">
            {/* Skip Link for Accessibility */}
            <SkipLink />

            {/* Subtle background gradient with noise texture for reduced eye strain */}
            <div className="fixed inset-0 -z-10" aria-hidden="true">
                {/* Base gradient - darker at top, slightly lighter toward bottom */}
                <div className="absolute inset-0 bg-background" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[hsl(260_28%_11%)] dark:to-[hsl(260_28%_11%)] opacity-0 dark:opacity-40" />

                {/* Subtle noise texture overlay for reduced eye strain */}
                <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none bg-noise" />

                {/* Decorative gradient orbs */}
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl" />
            </div>

            <FloatingNavbar />

            {/* Main Content - ARIA landmark */}
            <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
                {children}
            </main>

            <Footer />
        </div>
    );
}
