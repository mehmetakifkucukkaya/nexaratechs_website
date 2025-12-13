"use client";

import { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import { apps } from "@/lib/data";

export default function SeedPage() {
    const [status, setStatus] = useState("Idle");
    const [logs, setLogs] = useState<string[]>([]);

    async function handleSeed() {
        setStatus("Seeding...");
        setLogs([]);
        try {
            if (!auth) throw new Error("Auth not initialized");
            await signInAnonymously(auth);
            setLogs(prev => [...prev, "Signed in anonymously"]);

            for (const app of apps) {
                // Map main icon
                let iconName = "Sparkles";
                if (app.slug === "walletta") iconName = "Zap";
                if (app.slug === "dream-ai") iconName = "Stars";

                // Map feature icons
                const features = app.features.map(f => {
                    let fIcon = "Star";
                    if (f.title === "Smart Budgeting") fIcon = "BarChart3";
                    if (f.title === "Secure & Private") fIcon = "Shield";
                    if (f.title === "Instant Insights") fIcon = "FastIcon";
                    if (f.title === "Data Export") fIcon = "Share2";

                    if (f.title === "AI Interpretation") fIcon = "Sparkles";
                    if (f.title === "Dream Journal") fIcon = "Smartphone";
                    if (f.title === "Symbol Dictionary") fIcon = "Globe";
                    if (f.title === "Dark Mode") fIcon = "Moon";

                    return { ...f, icon: fIcon };
                });

                const appData = {
                    ...app,
                    icon: iconName,
                    features: features
                };

                await setDoc(doc(db, "apps", app.id), appData);
                setLogs(prev => [...prev, `Seeded: ${app.name}`]);
            }
            setStatus("Success");
        } catch (error: any) {
            console.error(error);
            setStatus("Error: " + error.message);
            setLogs(prev => [...prev, "Error: " + error.message]);
        }
    }

    return (
        <div className="p-10">
            <h1>Seed Data</h1>
            <button onClick={handleSeed} className="bg-blue-500 text-white px-4 py-2 rounded">
                Start Seeding
            </button>
            <div className="mt-4">
                <p>Status: <span id="status">{status}</span></p>
                <pre>{logs.join("\n")}</pre>
            </div>
        </div>
    );
}
