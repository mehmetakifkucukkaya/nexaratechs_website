"use client";

import AppForm from "@/components/admin/AppForm";
import { getAppById, AppData } from "@/lib/db";
import { useEffect, useState } from "react";

export default function EditAppPage({ params }: { params: { id: string } }) {
    const [app, setApp] = useState<AppData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAppById(params.id).then(data => {
            setApp(data);
            setLoading(false);
        });
    }, [params.id]);

    if (loading) return <div>Loading...</div>;
    if (!app) return <div>App not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Edit App: {app.title}</h1>
            <AppForm initialData={app} isEdit={true} />
        </div>
    );
}
