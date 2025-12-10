"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

export default function FloatingNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu on resize to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Apps", href: "/#apps" },
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
            >
                <div className={cn(
                    "flex items-center justify-between px-4 sm:px-6 py-3 rounded-full backdrop-blur-md transition-all duration-300 border",
                    scrolled
                        ? "bg-background/80 border-border shadow-lg w-full sm:w-[90%] md:w-[70%]"
                        : "bg-background/50 sm:bg-transparent border-white/10 sm:border-transparent w-full sm:container"
                )}>
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                            N
                        </div>
                        <span className="font-bold text-lg tracking-tight hidden sm:block">NexaraTechs</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1 sm:gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground rounded-full hover:bg-foreground/5 transition-colors"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href="#contact"
                            className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                        >
                            Join Beta
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
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
                            <div className="bg-background/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl">
                                <nav className="flex flex-col gap-1">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="px-4 py-3 text-base font-medium text-foreground/80 hover:text-foreground rounded-xl hover:bg-white/5 transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <Link
                                        href="#contact"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center justify-center w-full px-5 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
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
