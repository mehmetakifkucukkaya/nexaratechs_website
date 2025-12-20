"use client";

import { AppData, TesterData } from "@/lib/db";
import { db } from "@/lib/firebase";
import { collection, getCountFromServer, getDocs, limit, orderBy, query } from "firebase/firestore";
import { AppWindow, ArrowUpRight, Clock, Loader2, Plus, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [appsCount, setAppsCount] = useState(0);
    const [testersCount, setTestersCount] = useState(0);
    const [recentApps, setRecentApps] = useState<AppData[]>([]);
    const [recentTesters, setRecentTesters] = useState<TesterData[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get apps count
                const appsSnapshot = await getCountFromServer(collection(db, "apps"));
                setAppsCount(appsSnapshot.data().count);

                // Get testers count
                const testersSnapshot = await getCountFromServer(collection(db, "testers"));
                setTestersCount(testersSnapshot.data().count);

                // Get recent apps (last 5)
                const appsQuery = query(collection(db, "apps"), orderBy("order", "asc"), limit(5));
                const appsDocsSnapshot = await getDocs(appsQuery);
                const appsData = appsDocsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppData));
                setRecentApps(appsData);

                // Get recent testers (last 5)
                const testersQuery = query(collection(db, "testers"), orderBy("appliedAt", "desc"), limit(5));
                const testersDocsSnapshot = await getDocs(testersQuery);
                const testersData = testersDocsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TesterData));
                setRecentTesters(testersData);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back! Here&apos;s an overview of your apps.</p>
                </div>
                <Link
                    href="/admin/apps/new"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/25"
                >
                    <Plus className="w-5 h-5" />
                    New App
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Apps */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/50 to-indigo-500/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                    <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                <AppWindow className="w-6 h-6 text-purple-400" />
                            </div>
                            <Link href="/admin/apps" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
                                View →
                            </Link>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : appsCount}
                        </div>
                        <p className="text-sm text-gray-400">Total Apps</p>
                    </div>
                </div>

                {/* Tester Applications */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/50 to-cyan-500/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                    <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                <Users className="w-6 h-6 text-blue-400" />
                            </div>
                            <Link href="/admin/testers" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                                View →
                            </Link>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : testersCount}
                        </div>
                        <p className="text-sm text-gray-400">Tester Applications</p>
                    </div>
                </div>

                {/* Live Apps */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                    <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Active</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">
                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : recentApps.filter(a => a.status === 'Live').length}
                        </div>
                        <p className="text-sm text-gray-400">Live Apps</p>
                    </div>
                </div>

                {/* Last Update */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/50 to-amber-500/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                    <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Clock className="w-6 h-6 text-orange-400" />
                            </div>
                        </div>
                        <div className="text-xl font-bold text-white mb-1">Just now</div>
                        <p className="text-sm text-gray-400">Last Refresh</p>
                    </div>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid gap-6 lg:grid-cols-7">
                {/* Recent Apps */}
                <div className="lg:col-span-4">
                    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <AppWindow className="w-5 h-5 text-purple-400" />
                                Recent Apps
                            </h3>
                            <Link href="/admin/apps" className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1 transition-colors">
                                View all <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="p-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
                                </div>
                            ) : recentApps.length > 0 ? (
                                <div className="space-y-2">
                                    {recentApps.map((app) => (
                                        <Link
                                            key={app.id}
                                            href={`/admin/apps/edit/${app.id}`}
                                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                                        >
                                            {app.logoUrl ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img src={app.logoUrl} alt={app.name} className="h-10 w-10 rounded-lg object-cover" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                                                    <AppWindow className="w-5 h-5 text-purple-400" />
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white truncate">{app.name}</p>
                                                <p className="text-xs text-gray-500">{app.slug}</p>
                                            </div>
                                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusStyle(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <AppWindow className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-400 mb-4">No apps found</p>
                                    <Link
                                        href="/admin/apps/new"
                                        className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                                    >
                                        Create your first app →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Testers */}
                <div className="lg:col-span-3">
                    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 overflow-hidden">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-400" />
                                Recent Testers
                            </h3>
                            <Link href="/admin/testers" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors">
                                View all <ArrowUpRight className="w-4 h-4" />
                            </Link>
                        </div>
                        <div className="p-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                                </div>
                            ) : recentTesters.length > 0 ? (
                                <div className="space-y-2">
                                    {recentTesters.map((tester) => (
                                        <div
                                            key={tester.id}
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-colors"
                                        >
                                            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                                                {tester.fullName?.charAt(0).toUpperCase() || '?'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-white truncate text-sm">{tester.fullName}</p>
                                                <p className="text-xs text-gray-500 truncate">{tester.email}</p>
                                            </div>
                                            <span className="text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-full flex-shrink-0">
                                                {tester.device}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <Users className="w-8 h-8 text-gray-600" />
                                    </div>
                                    <p className="text-gray-400">No applications yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


