"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TesterData, AppData, getApps } from "@/lib/db";
import {
    Users, Loader2, Mail, Smartphone, Calendar, Search, ChevronLeft, ChevronRight,
    Trash2, Download, CheckCircle, XCircle, Clock, Eye, Filter
} from "lucide-react";
import { useToast } from "@/components/admin/Toast";
import { ConfirmModal } from "@/components/admin/ConfirmModal";
import { TesterDetailModal } from "@/components/admin/TesterDetailModal";

const ITEMS_PER_PAGE = 10;

export default function TestersPage() {
    const [testers, setTesters] = useState<TesterData[]>([]);
    const [apps, setApps] = useState<AppData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState<TesterData | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [selectedTester, setSelectedTester] = useState<TesterData | null>(null);
    const { showToast } = useToast();

    const fetchData = async () => {
        setLoading(true);
        try {
            const [testersData, appsData] = await Promise.all([
                getDocs(query(collection(db, "testers"), orderBy("appliedAt", "desc"))),
                getApps()
            ]);
            setTesters(testersData.docs.map(doc => ({ id: doc.id, ...doc.data() } as TesterData)));
            setApps(appsData);
        } catch (error) {
            console.error("Error fetching data:", error);
            showToast("Failed to load data", "error");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter testers by search query and status
    const filteredTesters = useMemo(() => {
        let result = testers;

        // Status filter
        if (statusFilter !== 'all') {
            result = result.filter(t => (t.status || 'pending') === statusFilter);
        }

        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(t =>
                t.fullName?.toLowerCase().includes(q) ||
                t.email?.toLowerCase().includes(q) ||
                t.device?.toLowerCase().includes(q)
            );
        }

        return result;
    }, [testers, searchQuery, statusFilter]);

    // Stats
    const stats = useMemo(() => ({
        total: testers.length,
        pending: testers.filter(t => !t.status || t.status === 'pending').length,
        approved: testers.filter(t => t.status === 'approved').length,
        rejected: testers.filter(t => t.status === 'rejected').length
    }), [testers]);

    // Pagination
    const totalPages = Math.ceil(filteredTesters.length / ITEMS_PER_PAGE);
    const paginatedTesters = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredTesters.slice(start, start + ITEMS_PER_PAGE);
    }, [filteredTesters, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, statusFilter]);

    const handleDelete = async () => {
        if (!deleteTarget?.id) return;
        setDeleting(true);
        try {
            await deleteDoc(doc(db, "testers", deleteTarget.id));
            showToast(`"${deleteTarget.fullName}" deleted successfully`, "success");
            fetchData();
        } catch (error) {
            console.error(error);
            showToast("Failed to delete tester", "error");
        }
        setDeleting(false);
        setDeleteTarget(null);
    };

    const exportToCSV = () => {
        const headers = ['Full Name', 'Email', 'Device', 'Status', 'Assigned App', 'Admin Notes', 'Applied At'];
        const rows = testers.map(t => [
            t.fullName,
            t.email,
            t.device,
            t.status || 'pending',
            apps.find(a => a.id === t.assignedAppId)?.title || '',
            t.adminNotes || '',
            t.appliedAt?.seconds ? new Date(t.appliedAt.seconds * 1000).toISOString() : ''
        ]);

        const csv = [headers, ...rows].map(row =>
            row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
        ).join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `testers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("CSV exported successfully", "success");
    };

    const formatDate = (timestamp: { seconds: number } | undefined) => {
        if (!timestamp?.seconds) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            default:
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-4 h-4" />;
            case 'rejected':
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Tester Applications</h1>
                    <p className="text-gray-400 mt-1">View and manage beta tester applications</p>
                </div>
                <button
                    onClick={exportToCSV}
                    disabled={testers.length === 0}
                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                    <Download className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            {/* Stats */}
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                <button
                    onClick={() => setStatusFilter('all')}
                    className={`rounded-2xl bg-white/[0.03] backdrop-blur-xl border p-4 text-left transition-all ${statusFilter === 'all' ? 'border-blue-500/50' : 'border-white/5 hover:border-white/10'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">{stats.total}</div>
                            <p className="text-xs text-gray-400">Total</p>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => setStatusFilter('pending')}
                    className={`rounded-2xl bg-white/[0.03] backdrop-blur-xl border p-4 text-left transition-all ${statusFilter === 'pending' ? 'border-yellow-500/50' : 'border-white/5 hover:border-white/10'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <Clock className="w-5 h-5 text-yellow-400" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">{stats.pending}</div>
                            <p className="text-xs text-gray-400">Pending</p>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => setStatusFilter('approved')}
                    className={`rounded-2xl bg-white/[0.03] backdrop-blur-xl border p-4 text-left transition-all ${statusFilter === 'approved' ? 'border-emerald-500/50' : 'border-white/5 hover:border-white/10'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">{stats.approved}</div>
                            <p className="text-xs text-gray-400">Approved</p>
                        </div>
                    </div>
                </button>
                <button
                    onClick={() => setStatusFilter('rejected')}
                    className={`rounded-2xl bg-white/[0.03] backdrop-blur-xl border p-4 text-left transition-all ${statusFilter === 'rejected' ? 'border-red-500/50' : 'border-white/5 hover:border-white/10'
                        }`}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <XCircle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <div className="text-xl font-bold text-white">{stats.rejected}</div>
                            <p className="text-xs text-gray-400">Rejected</p>
                        </div>
                    </div>
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search by name, email, or device..."
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
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">User</th>
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">Email</th>
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">Device</th>
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">Status</th>
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">Assigned App</th>
                                        <th className="h-14 px-6 text-left font-medium text-gray-400">Applied</th>
                                        <th className="h-14 px-6 text-right font-medium text-gray-400">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedTesters.map((tester) => (
                                        <tr
                                            key={tester.id}
                                            className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer"
                                            onClick={() => setSelectedTester(tester)}
                                        >
                                            <td className="p-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                                        {tester.fullName?.charAt(0).toUpperCase() || '?'}
                                                    </div>
                                                    <div>
                                                        <span className="font-medium text-white block">{tester.fullName}</span>
                                                        {tester.adminNotes && (
                                                            <span className="text-xs text-gray-500 truncate block max-w-[150px]">📝 Has notes</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6 text-gray-300">{tester.email}</td>
                                            <td className="p-6">
                                                <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                                                    {tester.device}
                                                </span>
                                            </td>
                                            <td className="p-6">
                                                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium border ${getStatusStyle(tester.status || 'pending')}`}>
                                                    {getStatusIcon(tester.status || 'pending')}
                                                    {(tester.status || 'pending').charAt(0).toUpperCase() + (tester.status || 'pending').slice(1)}
                                                </span>
                                            </td>
                                            <td className="p-6 text-gray-400">
                                                {tester.assignedAppId ? (
                                                    <span className="text-purple-400">
                                                        {apps.find(a => a.id === tester.assignedAppId)?.title || 'Unknown'}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">Not assigned</span>
                                                )}
                                            </td>
                                            <td className="p-6 text-gray-400">{formatDate(tester.appliedAt)}</td>
                                            <td className="p-6">
                                                <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                                                    <button
                                                        onClick={() => setSelectedTester(tester)}
                                                        className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteTarget(tester)}
                                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {paginatedTesters.length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-12 text-center">
                                                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                    <Users className="w-8 h-8 text-gray-600" />
                                                </div>
                                                <p className="text-gray-400">
                                                    {searchQuery || statusFilter !== 'all' ? "No testers match your filters" : "No tester applications yet"}
                                                </p>
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
                                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredTesters.length)} of {filteredTesters.length}
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-sm text-gray-400 px-2">
                                        Page {currentPage} of {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors disabled:opacity-50"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Delete Modal */}
            <ConfirmModal
                isOpen={!!deleteTarget}
                title="Delete Tester"
                message={`Are you sure you want to delete "${deleteTarget?.fullName}"? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
                isLoading={deleting}
            />

            {/* Detail Modal */}
            <TesterDetailModal
                tester={selectedTester}
                apps={apps}
                isOpen={!!selectedTester}
                onClose={() => setSelectedTester(null)}
                onUpdate={fetchData}
            />
        </div>
    );
}



