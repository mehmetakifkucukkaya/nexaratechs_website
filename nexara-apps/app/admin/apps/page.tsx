"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getApps, AppData } from "@/lib/db";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Plus, Pencil, Trash2, AppWindow, Loader2, Search, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { AppDetailModal } from "@/components/admin/AppDetailModal";
import { useToast } from "@/components/admin/Toast";
import { useRouter } from "next/navigation";

const ITEMS_PER_PAGE = 10;

export default function AppsPage() {
    const [apps, setApps] = useState<AppData[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<AppData | null>(null);
    const [selectedApp, setSelectedApp] = useState<AppData | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const { showToast } = useToast();
    const router = useRouter();

    const fetchApps = async () => {
        setLoading(true);
        try {
            const data = await getApps();
            setApps(data);
        } catch (error) {
            console.error("Error fetching apps:", error);
            showToast("Failed to load apps", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchApps();
    }, []);

    // Filter apps by search query
    const filteredApps = useMemo(() => {
        if (!searchQuery.trim()) return apps;
        const query = searchQuery.toLowerCase();
        return apps.filter(app =>
            app.name.toLowerCase().includes(query) ||
            app.slug?.toLowerCase().includes(query) ||
            app.status?.toLowerCase().includes(query)
        );
    }, [apps, searchQuery]);

    // Pagination
    const totalPages = Math.ceil(filteredApps.length / ITEMS_PER_PAGE);
    const paginatedApps = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredApps.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredApps, currentPage]);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleDeleteClick = (app: AppData) => {
        setDeleteTarget(app);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteTarget?.id) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "apps", deleteTarget.id));
            showToast(`"${deleteTarget.name}" deleted successfully`, "success");
            fetchApps();
        } catch (error) {
            console.error(error);
            showToast("Failed to delete app", "error");
        }
        setDeleting(false);
        setDeleteTarget(null);
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'Live':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'Beta':
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

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search apps by name, slug, or status..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
            </div>

            {/* Table */}
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">Icon</th>
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">Name</th>
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">Slug</th>
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">Status</th>
                                        <th className="h-14 px-6 text-right font-medium text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedApps.map((app) => (
                                        <tr
                                            key={app.id}
                                            onClick={() => setSelectedApp(app)}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                        >
                                            <td className="p-6">
                                                <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                                                    {app.logoUrl ? (
                                                        <img src={app.logoUrl} alt={app.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-gray-500 font-bold">{app.name.substring(0, 2)}</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-6 font-medium text-white">{app.name}</td>
                                            <td className="p-6 text-gray-400 font-mono text-xs">{app.slug}</td>
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
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteClick(app);
                                                        }}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedApps.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="p-12 text-center">
                                                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                    <AppWindow className="w-8 h-8 text-gray-600" />
                                                </div>
                                                <p className="text-gray-400 mb-4">
                                                    {searchQuery ? "No apps match your search" : "No applications found"}
                                                </p>
                                                {!searchQuery && (
                                                    <Link
                                                        href="/admin/apps/new"
                                                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                                                    >
                                                        Create your first app →
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-white/5">
                                <p className="text-sm text-gray-400">
                                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredApps.length)} of {filteredApps.length} apps
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm text-gray-400 px-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Application"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={handleDeleteConfirm}
                onCancel={() => setDeleteTarget(null)}
                isLoading={deleting}
            />

            {/* App Detail Modal */}
            <AppDetailModal
                app={selectedApp}
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                onEdit={(app) => {
                    setSelectedApp(null);
                    router.push(`/admin/apps/edit/${app.id}`);
                }}
                onDelete={(app) => {
                    setSelectedApp(null);
                    setDeleteTarget(app);
                }}
            />
        </div>
    );
}


