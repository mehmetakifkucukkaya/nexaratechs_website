"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getApps, AppData } from "@/lib/db";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AppsPage() {
    const [apps, setApps] = useState<AppData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchApps = async () => {
        setLoading(true);
        const data = await getApps();
        setApps(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this app?")) return;
        try {
            await deleteDoc(doc(db, "apps", id));
            fetchApps(); // Refresh list
        } catch (error) {
            alert("Error deleting app");
            console.error(error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Applications</h1>
                <Link href="/admin/apps/new" className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm font-medium">
                    + Add New App
                </Link>
            </div>

            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Order</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Icon</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Title</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {apps.map((app) => (
                                <tr key={app.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">{app.order}</td>
                                    <td className="p-4 align-middle">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={app.iconUrl} alt="icon" className="h-10 w-10 rounded-lg object-cover bg-gray-100" />
                                    </td>
                                    <td className="p-4 align-middle font-medium">{app.title}</td>
                                    <td className="p-4 align-middle">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${app.status === 'live' ? 'bg-green-100 text-green-800' :
                                                app.status === 'development' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="p-4 align-middle text-right">
                                        <Link href={`/admin/apps/edit/${app.id}`} className="mr-4 hover:underline text-blue-600">Edit</Link>
                                        <button onClick={() => handleDelete(app.id!)} className="text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                            {apps.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-muted-foreground">No applications found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
