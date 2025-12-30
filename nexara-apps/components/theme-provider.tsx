"use client";

import ErrorBoundary from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import * as React from "react";

export function ThemeProvider({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
    return (
        <NextThemesProvider {...props}>
            <LanguageProvider>
                <ErrorBoundary>
                    {children}
                </ErrorBoundary>
            </LanguageProvider>
        </NextThemesProvider>
    );
}

