"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth";
import { useState } from "react";
import {
    LayoutDashboard,
    AppWindow,
    Users,
    LogOut,
    Menu,
    X,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    const [loggingOut, setLoggingOut] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            await logoutAdmin();
            await fetch('/api/auth/logout', { method: 'POST' });
            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoggingOut(false);
        }
    };

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    return (
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
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
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
                                    active ? "text-purple-400" : "group-hover:text-purple-400"
                                )} />
                                <span className="font-medium">{item.name}</span>
                                {active && (
                                    <div className="ml-auto w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/5">
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 disabled:opacity-50"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">{loggingOut ? 'Logging out...' : 'Logout'}</span>
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
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
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
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>{loggingOut ? 'Logging out...' : 'Logout'}</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 relative z-10">
                {/* Top Header */}
                <header className="h-16 border-b border-white/5 bg-white/[0.02] backdrop-blur-xl flex items-center px-6 justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden text-gray-400 hover:text-white transition-colors"
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
    );
}

