import Link from "next/link";
import { Plus, AppWindow, Users, TrendingUp, Clock, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
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
                            <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">Live</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">0</div>
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
                            <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +0
                            </span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">0</div>
                        <p className="text-sm text-gray-400">Tester Applications</p>
                    </div>
                </div>

                {/* Active Users */}
                <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 to-teal-500/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                    <div className="relative rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6 hover:border-white/10 transition-all">
                        <div className="flex items-center justify-between mb-4">
                            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-emerald-400" />
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">0</div>
                        <p className="text-sm text-gray-400">Active Users</p>
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
                        <p className="text-sm text-gray-400">Last Update</p>
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
                        <div className="p-6">
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
                        <div className="p-6">
                            <div className="text-center py-12">
                                <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-gray-600" />
                                </div>
                                <p className="text-gray-400">No applications yet</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

