"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/lib/LanguageContext";
import { ReactNode } from "react";

interface ProvidersProps {
    children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
    return (
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <LanguageProvider>
                {children}
            </LanguageProvider>
        </ThemeProvider>
    );
}
