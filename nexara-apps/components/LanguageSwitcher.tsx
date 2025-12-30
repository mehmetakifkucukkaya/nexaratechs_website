"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const languages = [
        { code: "en" as const, label: "EN" },
        { code: "tr" as const, label: "TR" },
    ];

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all",
                    "border border-border bg-background/50 hover:bg-accent",
                    "focus:outline-none focus:ring-2 focus:ring-indigo-500"
                )}
                aria-label="Change language"
                aria-expanded={isOpen}
            >
                <span className="text-xs font-semibold uppercase">{language === "en" ? "EN" : "TR"}</span>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-20 rounded-xl bg-popover border border-border shadow-xl z-50 overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "w-full flex items-center justify-center px-4 py-2.5 text-sm font-semibold transition-colors",
                                "hover:bg-accent",
                                language === lang.code && "bg-accent text-primary"
                            )}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

