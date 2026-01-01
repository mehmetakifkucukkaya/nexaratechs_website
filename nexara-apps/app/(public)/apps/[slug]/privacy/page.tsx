import PrivacyPolicyViewer from "@/components/apps/PrivacyPolicyViewer";
import { getApp } from "@/lib/firebase";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface PrivacyPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
    const { slug } = await params;
    const app = await getApp(slug);

    if (!app) {
        return {
            title: "App Not Found - NexaraTechs",
        };
    }

    return {
        title: `${app.name} Privacy Policy - NexaraTechs`,
        description: `Privacy Policy for ${app.name}`,
    };
}

export default async function PrivacyPolicyPage({ params }: PrivacyPageProps) {
    const { slug } = await params;

    // Fetch from Firebase
    const app = await getApp(slug);

    if (!app) {
        notFound();
    }

    return <PrivacyPolicyViewer app={app} />;
}
