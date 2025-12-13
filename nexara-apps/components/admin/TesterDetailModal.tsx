"use client";

import { useState, useEffect } from "react";
import { X, User, Mail, Smartphone, Calendar, MessageSquare, AppWindow, Save, Loader2 } from "lucide-react";
import { TesterData, AppData } from "@/lib/db";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "./Toast";

interface TesterDetailModalProps {
    tester: TesterData | null;
    apps: AppData[];
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}

export function TesterDetailModal({ tester, apps, isOpen, onClose, onUpdate }: TesterDetailModalProps) {
    const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
    const [assignedAppId, setAssignedAppId] = useState('');
    const [adminNotes, setAdminNotes] = useState('');
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (tester) {
            setStatus(tester.status || 'pending');
            setAssignedAppId(tester.assignedAppId || '');
            setAdminNotes(tester.adminNotes || '');
        }
    }, [tester]);

    if (!isOpen || !tester) return null;

    const formatDate = (timestamp: { seconds: number } | undefined) => {
        if (!timestamp?.seconds) return 'N/A';
        return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusStyle = (s: string) => {
        switch (s) {
            case 'approved':
                return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected':
                return 'bg-red-500/10 text-red-400 border-red-500/20';
            default:
                return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        }
    };

    const handleSave = async () => {
        if (!tester.id) return;
        setSaving(true);
        try {
            await updateDoc(doc(db, "testers", tester.id), {
                status,
                assignedAppId: assignedAppId || null,
                adminNotes,
                updatedAt: serverTimestamp()
            });
            showToast("Tester updated successfully", "success");
            onUpdate();
            onClose();
        } catch (error) {
            console.error("Error updating tester:", error);
            showToast("Failed to update tester", "error");
        }
        setSaving(false);
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="sticky top-0 bg-[#0a0a1a] border-b border-white/5 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold">
                            {tester.fullName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">{tester.fullName}</h2>
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusStyle(status)}`}>
                                {status}
                            </span>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Info Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Mail className="w-4 h-4" /> Email
                            </div>
                            <p className="text-white text-sm truncate">{tester.email}</p>
                        </div>
                        <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Smartphone className="w-4 h-4" /> Device
                            </div>
                            <p className="text-white text-sm">{tester.device}</p>
                        </div>
                        <div className="col-span-2 rounded-xl bg-white/[0.03] border border-white/5 p-4">
                            <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                                <Calendar className="w-4 h-4" /> Applied At
                            </div>
                            <p className="text-white text-sm">{formatDate(tester.appliedAt)}</p>
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                        <div className="flex gap-2">
                            {(['pending', 'approved', 'rejected'] as const).map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setStatus(s)}
                                    className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium border transition-all ${status === s
                                        ? getStatusStyle(s) + ' border-current'
                                        : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {s.charAt(0).toUpperCase() + s.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Assigned App */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <span className="flex items-center gap-2">
                                <AppWindow className="w-4 h-4" /> Assigned App
                            </span>
                        </label>
                        <select
                            value={assignedAppId}
                            onChange={(e) => setAssignedAppId(e.target.value)}
                            className={inputClass}
                        >
                            <option value="" className="bg-[#0a0a1a]">Not assigned</option>
                            {apps.map((app) => (
                                <option key={app.id} value={app.id} className="bg-[#0a0a1a]">
                                    {app.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Admin Notes */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            <span className="flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" /> Admin Notes
                            </span>
                        </label>
                        <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            rows={3}
                            className={inputClass}
                            placeholder="Add notes about this tester..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-[#0a0a1a] border-t border-white/5 p-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
