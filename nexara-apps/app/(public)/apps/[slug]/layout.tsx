import { Metadata } from "next";
import { getAppBySlug } from "@/lib/data";

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const app = getAppBySlug(slug);

    if (!app) {
        return {
            title: "App Not Found",
            description: "The requested application could not be found.",
        };
    }

    return {
        title: app.name,
        description: app.shortDescription,
        keywords: [app.name, app.category, "mobile app", "NexaraTechs", ...app.features.map(f => f.title)],
        openGraph: {
            title: `${app.name} | NexaraTechs`,
            description: app.shortDescription,
            type: "website",
            images: [
                {
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: `${app.name} - ${app.shortDescription}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${app.name} | NexaraTechs`,
            description: app.shortDescription,
        },
    };
}

export default function AppLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
