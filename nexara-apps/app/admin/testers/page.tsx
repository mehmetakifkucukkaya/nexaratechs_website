"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { TesterData } from "@/lib/db";

export default function TestersPage() {
    const [testers, setTesters] = useState<TesterData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTesters = async () => {
            const q = query(collection(db, "testers"), orderBy("appliedAt", "desc"));
            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as TesterData));
            setTesters(data);
            setLoading(false);
        };
        fetchTesters();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Tester Applications</h1>

            <div className="rounded-md border bg-white">
                <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                        <thead className="[&_tr]:border-b">
                            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Full Name</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Email</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Device</th>
                                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Applied At</th>
                            </tr>
                        </thead>
                        <tbody className="[&_tr:last-child]:border-0">
                            {testers.map((tester) => (
                                <tr key={tester.id} className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle font-medium">{tester.fullName}</td>
                                    <td className="p-4 align-middle">{tester.email}</td>
                                    <td className="p-4 align-middle">{tester.device}</td>
                                    <td className="p-4 align-middle">
                                        {tester.appliedAt?.seconds ? new Date(tester.appliedAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                    </td>
                                </tr>
                            ))}
                            {testers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-muted-foreground">No applications found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
