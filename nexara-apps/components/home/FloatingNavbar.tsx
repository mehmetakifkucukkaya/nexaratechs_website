"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// Simple debounce helper
function debounce<T extends (...args: Parameters<T>) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    return (...args: Parameters<T>) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), wait);
    };
}

export default function FloatingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = debounce(() => {
            setScrolled(window.scrollY > 20);
        }, 10);

        // Set initial state
        setScrolled(window.scrollY > 20);

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = debounce(() => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        }, 100);

        window.addEventListener("resize", handleResize, { passive: true });
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Apps", href: "/apps" },
        { name: "Roadmap", href: "/#roadmap" },
    ];

    return (
        <>
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 flex justify-center px-4 transition-all duration-300",
                    scrolled ? "pt-2" : "pt-4 sm:pt-6"
                )}
                role="banner"
            >
                <div className={cn(
                    "flex items-center justify-between px-4 sm:px-6 py-3 rounded-full backdrop-blur-xl transition-all duration-300 border",
                    scrolled
                        ? "bg-[#0A0A0A]/80 border-white/10 shadow-xl shadow-indigo-500/5 w-full sm:w-[90%] md:w-[70%]"
                        : "bg-transparent border-transparent w-full sm:container"
                )}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2" aria-label="NexaraTechs - Go to homepage">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20" aria-hidden="true">
                            N
                        </div>
                        <span className={cn(
                            "font-bold text-lg tracking-tight hidden sm:block bg-clip-text text-transparent bg-gradient-to-r",
                            scrolled ? "from-white to-white/90" : "from-foreground to-foreground/80"
                        )}>
                            NexaraTechs
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 sm:gap-2" aria-label="Main navigation">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium rounded-full transition-all",
                                    scrolled
                                        ? "text-white/70 hover:text-white hover:bg-white/5"
                                        : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="#contact"
                            className="px-5 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105"
                        >
                            Join Beta
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={cn(
                            "md:hidden p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500",
                            scrolled ? "text-white/80 hover:bg-white/10" : "text-foreground/80 hover:bg-foreground/5"
                        )}
                        aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={mobileMenuOpen}
                        aria-controls="mobile-menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5" aria-hidden="true" />
                        ) : (
                            <Menu className="w-5 h-5" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Mobile Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="fixed top-20 left-4 right-4 z-50 md:hidden"
                        >
                            <div className="bg-[#0A0A0A]/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                                <nav className="flex flex-col gap-1">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-4 py-3 text-base font-medium text-white/80 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <Link
                                        href="#contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center w-full px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20"
                                    >
                                        Join Beta
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
