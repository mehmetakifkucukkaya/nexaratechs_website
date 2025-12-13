"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApps, AppData } from "@/lib/db";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Pencil, Trash2, AppWindow, Loader2 } from "lucide-react";

export default function AppsPage() {
    const [apps, setApps] = useState<AppData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchApps = async () => {
        setLoading(true);
        try {
            const data = await getApps();
            setApps(data);
        } catch (error) {
            console.error("Error fetching apps:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this app?")) return;
        setDeleting(id);
        try {
            await deleteDoc(doc(db, "apps", id));
            fetchApps();
        } catch (error) {
            alert("Error deleting app");
            console.error(error);
        }
        setDeleting(null);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'live':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'development':
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            default:
                return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Applications</h1>
                    <p className="text-gray-400 mt-1">Manage your mobile applications</p>
                </div>
                <Link
                    href="/admin/apps/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
                >
                    <Plus className="w-5 h-5" />
                    Add New App
                </Link>
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                ) : (
                    <div className="relative w-full overflow-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-white/5">
                                    <th className="h-14 px-6 text-left font-medium text-gray-400">#</th>
                                    <th className="h-14 px-6 text-left font-medium text-gray-400">Icon</th>
                                    <th className="h-14 px-6 text-left font-medium text-gray-400">Title</th>
                                    <th className="h-14 px-6 text-left font-medium text-gray-400">Status</th>
                                    <th className="h-14 px-6 text-right font-medium text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {apps.map((app) => (
                                    <tr key={app.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6 text-gray-300">{app.order}</td>
                                        <td className="p-6">
                                            {app.iconUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img
                                                    src={app.iconUrl}
                                                    alt={app.title}
                                                    className="h-12 w-12 rounded-xl object-cover bg-white/5 border border-white/10"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                                    <AppWindow className="w-6 h-6 text-purple-400" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-6 font-medium text-white">{app.title}</td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium border ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/apps/edit/${app.id}`}
                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(app.id!)}
                                                    disabled={deleting === app.id}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                                >
                                                    {deleting === app.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {apps.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-12 text-center">
                                            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                <AppWindow className="w-8 h-8 text-gray-600" />
                                            </div>
                                            <p className="text-gray-400 mb-4">No applications found</p>
                                            <Link
                                                href="/admin/apps/new"
                                                className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                                            >
                                                Create your first app →
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

