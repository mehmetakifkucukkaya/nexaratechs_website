"use client";

import { ToastProvider } from "@/components/admin/Toast";
import { logoutAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
    AppWindow,
    LayoutDashboard,
    Loader2,
    LogOut,
    Menu,
    Users,
    X
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Applications", href: "/admin/apps", icon: AppWindow },
    { name: "Testers", href: "/admin/testers", icon: Users },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    const [loading, setLoading] = useState(true);

    // Auth Check
    useEffect(() => {
        // Use a dynamic import or accessing global window to avoid SSR issues if necessary,
        // but since this is "use client", importing auth is fine.
        const { auth } = require("@/lib/firebase");
        const { onAuthStateChanged } = require("firebase/auth");

        const unsubscribe = onAuthStateChanged(auth, (user: any) => {
            if (!user) {
                router.push("/login");
            } else {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                    <p className="text-gray-400 text-sm">Verifying access...</p>
                </div>
            </div>
        );
    }

    return (
        <ToastProvider>
            <div className="flex min-h-screen bg-[#0a0a1a]">
                {/* Background Effects */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
                </div>

                {/* Sidebar - Desktop */}
                <aside className="hidden md:flex md:flex-col w-72 bg-white/[0.02] backdrop-blur-xl border-r border-white/5 relative z-10">
                    {/* Logo */}
                    <div className="p-6 border-b border-white/5">
                        <Link href="/admin" className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Nexara"
                                className="h-16 w-16 object-contain hover:scale-105 transition-transform"
                            />
                            <div>
                                <span className="font-bold text-lg text-white">Nexara</span>
                                <span className="text-xs text-purple-400 block -mt-1">Admin Panel</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                        active
                                            ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-white border border-purple-500/30"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        active ? "text-purple-400" : "text-gray-500 group-hover:text-purple-400"
                                    )} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Logout Button */}
                    <div className="p-4 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Mobile Overlay */}
                {mobileMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                )}

                {/* Mobile Sidebar */}
                <aside className={cn(
                    "fixed inset-y-0 left-0 w-72 bg-[#0a0a1a]/95 backdrop-blur-xl border-r border-white/5 z-50 transform transition-transform duration-300 md:hidden",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}>
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <Link href="/admin" className="flex items-center gap-3">
                            <img
                                src="/logo.png"
                                alt="Nexara"
                                className="h-16 w-16 object-contain hover:scale-105 transition-transform"
                            />
                            <span className="font-bold text-lg text-white">Nexara</span>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                    <nav className="p-4 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                        active
                                            ? "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-white border border-purple-500/30"
                                            : "text-gray-400 hover:text-white hover:bg-white/5"
                                    )}
                                >
                                    <Icon className={cn("w-5 h-5", active ? "text-purple-400" : "text-gray-500")} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col relative z-10">
                    {/* Top Bar */}
                    <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02] backdrop-blur-xl">
                        <button
                            className="md:hidden text-gray-400 hover:text-white"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden md:block" />
                        <div className="flex items-center gap-4">
                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                A
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-6 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}
