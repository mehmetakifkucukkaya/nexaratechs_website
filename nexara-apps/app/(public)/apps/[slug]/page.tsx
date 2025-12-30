import AppDetailsClient from "@/components/apps/AppDetailsClient";
import { getApp } from "@/lib/firebase";
import { Metadata } from "next";
import { notFound } from "next/navigation";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const app = await getApp(slug);

    if (!app) {
        return {
            title: "App Not Found - NexaraTechs",
            description: "The requested application could not be found."
        };
    }

    return {
        title: `${app.name} - NexaraTechs`,
        description: app.shortDescription,
        openGraph: {
            title: `${app.name} - NexaraTechs`,
            description: app.shortDescription,
            images: app.logoUrl ? [{ url: app.logoUrl }] : [],
        },
    };
}

export default async function AppPage({ params }: PageProps) {
    const { slug } = await params;
    const app = await getApp(slug);

    if (!app) {
        notFound();
    }

    return <AppDetailsClient app={app} />;
}
