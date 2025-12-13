"use client";

import AppForm from "@/components/admin/AppForm";
import { getAppById, AppData } from "@/lib/db";
import { useEffect, useState } from "react";
import { Pencil, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function EditAppPage({ params }: { params: { id: string } }) {
    const [app, setApp] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAppById(params.id).then(data => {
            setApp(data);
            setLoading(false);
        });
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
        );
    }

    if (!app) {
        return (
            <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 p-12 text-center">
                <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-red-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">App Not Found</h2>
                <p className="text-gray-400 mb-4">The application you're looking for doesn't exist.</p>
                <Link
                    href="/admin/apps"
                    className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                >
                    ← Back to Applications
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                    <Pencil className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Edit App</h1>
                    <p className="text-gray-400">Editing: {app.title}</p>
                </div>
            </div>
            <AppForm initialData={app} isEdit={true} />
        </div>
    );
}

