"use client";

import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { logoutAdmin } from "@/lib/auth";
import { useState } from "react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        setLoggingOut(true);
        try {
            // Sign out from Firebase
            await logoutAdmin();

            // Clear the secure cookie via API
            await fetch('/api/auth/logout', { method: 'POST' });

            router.push("/login");
            router.refresh();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoggingOut(false);
        }
    };

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white min-h-screen hidden md:block relative">
                <div className="p-6">
                    <h2 className="text-xl font-bold">Nexara Admin</h2>
                </div>
                <nav className="flex flex-col px-4 space-y-2 mt-4">
                    <Link href="/admin" className="px-4 py-2 hover:bg-slate-800 rounded transition-colors">
                        Dashboard
                    </Link>
                    <Link href="/admin/apps" className="px-4 py-2 hover:bg-slate-800 rounded transition-colors">
                        Applications
                    </Link>
                    <Link href="/admin/testers" className="px-4 py-2 hover:bg-slate-800 rounded transition-colors">
                        Testers
                    </Link>
                </nav>
                <div className="absolute bottom-4 left-4 right-4">
                    <button
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center w-full px-4 py-2 text-red-400 hover:bg-slate-800 rounded transition-colors disabled:opacity-50"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        {loggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 bg-slate-50">
                <header className="bg-white border-b h-16 flex items-center px-6 justify-between md:hidden">
                    <span className="font-bold">Nexara Admin</span>
                    {/* Mobile menu trigger could go here */}
                </header>
                <div className="p-6">
                    {children}
                </div>
            </main>
        </div>
    );
}
