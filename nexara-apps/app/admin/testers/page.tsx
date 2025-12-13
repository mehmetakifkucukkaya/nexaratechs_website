"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TesterData } from "@/lib/db";
import { Users, Loader2, Mail, Smartphone, Calendar } from "lucide-react";

export default function TestersPage() {
    const [testers, setTesters] = useState<TesterData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTesters = async () => {
            try {
                const q = query(collection(db, "testers"), orderBy("appliedAt", "desc"));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TesterData));
                setTesters(data);
            } catch (error) {
                console.error("Error fetching testers:", error);
            }
            setLoading(false);
        };
        fetchTesters();
    }, []);

    const formatDate = (timestamp: { seconds: number } | undefined) => {
        if (!timestamp?.seconds) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Tester Applications</h1>
                <p className="text-gray-400 mt-1">View and manage beta tester applications</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                            <Users className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">{testers.length}</div>
                            <p className="text-sm text-gray-400">Total Applications</p>
                        </div>
                    </div>
                </div>
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
                                    <th className="h-14 px-6 text-left font-medium text-gray-400">User</th>
                                    <th className="h-14 px-6 text-left font-medium text-gray-400">
                                        <span className="flex items-center gap-2">
                                            <Mail className="w-4 h-4" /> Email
                                        </span>
                                    </th>
                                    <th className="h-14 px-6 text-left font-medium text-gray-400">
                                        <span className="flex items-center gap-2">
                                            <Smartphone className="w-4 h-4" /> Device
                                        </span>
                                    </th>
                                    <th className="h-14 px-6 text-left font-medium text-gray-400">
                                        <span className="flex items-center gap-2">
                                            <Calendar className="w-4 h-4" /> Applied
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {testers.map((tester) => (
                                    <tr key={tester.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
                                                    {tester.fullName?.charAt(0).toUpperCase() || '?'}
                                                </div>
                                                <span className="font-medium text-white">{tester.fullName}</span>
                                            </div>
                                        </td>
                                        <td className="p-6 text-gray-300">{tester.email}</td>
                                        <td className="p-6">
                                            <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-white/5 text-gray-300 border border-white/10">
                                                {tester.device}
                                            </span>
                                        </td>
                                        <td className="p-6 text-gray-400">{formatDate(tester.appliedAt)}</td>
                                    </tr>
                                ))}
                                {testers.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center">
                                            <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                                                <Users className="w-8 h-8 text-gray-600" />
                                            </div>
                                            <p className="text-gray-400">No tester applications yet</p>
                                            <p className="text-gray-500 text-sm mt-1">Applications will appear here when users sign up for beta testing</p>
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

