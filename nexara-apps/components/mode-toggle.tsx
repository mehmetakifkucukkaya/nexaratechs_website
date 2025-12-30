"use client";

import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle({ className }: { className?: string }) {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Avoid hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className={cn("w-9 h-9", className)} />;
    }

    const toggleTheme = () => {
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "relative inline-flex items-center justify-center rounded-full w-9 h-9 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
                isDark
                    ? "bg-slate-800 text-amber-400 hover:bg-slate-700 border border-slate-700"
                    : "bg-white text-slate-900 border border-input shadow-sm hover:bg-zinc-100",
                className
            )}
            aria-label="Toggle theme"
        >
            {isDark ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-amber-400" />
            ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-slate-800" />
            )}
        </button>
    );
}
