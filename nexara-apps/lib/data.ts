
export interface AppData {
    id: string;
    slug: string;
    name: string;
    developer: string;
    shortDescription: string;
    fullDescription: string;
    logoGradient: string;
    icon: any | string; // Lucide Icon component or string name
    screenshots: string[]; // URLs or placeholders
    features: {
        title: string;
        description: string;
        icon: any | string;
    }[];
    status: "Beta" | "Live" | "Coming Soon";
    version: string;
    lastUpdated: string;
    category: string;
    downloadUrl?: string; // Play Store / App Store link
    privacyUrl?: string;
    privacyPolicy?: string; // App-specific privacy policy content
    primaryColor: string; // Tailwind class or hex for theming
    logoUrl?: string;
    releaseDate?: string;
    order?: number;
    createdAt?: any; // Firestore Timestamp
}

export const apps: AppData[] = [];

export function getAppBySlug(slug: string) {
    return apps.find((app) => app.slug === slug);
}
