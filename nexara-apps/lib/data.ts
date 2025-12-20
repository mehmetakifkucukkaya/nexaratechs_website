import { BarChart3, Zap as FastIcon, Globe, Moon, Share2, Shield, Smartphone, Sparkles, Stars, Zap } from "lucide-react";

export interface AppData {
    id: string;
    slug: string;
    name: string;
    developer: string;
    shortDescription: string;
    fullDescription: string;
    logoGradient: string;
    icon: any; // Lucide Icon
    screenshots: string[]; // URLs or placeholders
    features: {
        title: string;
        description: string;
        icon: any;
    }[];
    status: "Beta" | "Live" | "Coming Soon";
    version: string;
    lastUpdated: string;
    category: string;
    downloadUrl?: string; // Play Store / App Store link
    privacyUrl?: string;
    primaryColor: string; // Tailwind class or hex for theming
    logoUrl?: string;
    releaseDate?: string;
}

export const apps: AppData[] = [
    {
        id: "walletta",
        slug: "walletta",
        name: "Walletta",
        developer: "NexaraTechs Team",
        shortDescription: "The ultimate personal finance companion. Track expenses, set budgets, and achieve financial freedom.",
        fullDescription: "Walletta isn't just an expense tracker; it's your personal financial guardian. Built with a focus on simplicity and speed, Walletta helps you understand where your money goes without the headache of complex spreadsheets. With intelligent categorization, recurring transaction support, and beautiful insights, taking control of your finances has never been this satisfying.",
        logoGradient: "from-blue-600 to-cyan-500",
        icon: Zap,
        primaryColor: "blue",
        screenshots: [
            "/screenshots/walletta-1.png",
            "/screenshots/walletta-2.png",
            "/screenshots/walletta-3.png"
        ],
        features: [
            {
                title: "Smart Budgeting",
                description: "Set monthly or category-based budgets and get alerted before you overspend.",
                icon: BarChart3
            },
            {
                title: "Secure & Private",
                description: "Your financial data stays on your device. We don't sell your data to third parties.",
                icon: Shield
            },
            {
                title: "Instant Insights",
                description: "Visualize your spending habits with interactive charts and monthly reports.",
                icon: FastIcon
            },
            {
                title: "Data Export",
                description: "Export your financial data to CSV or PDF for detailed analysis or tax purposes.",
                icon: Share2
            }
        ],
        status: "Live",
        version: "2.1.0",
        lastUpdated: "Dec 10, 2025",
        category: "Finance",
        downloadUrl: "#",
        privacyUrl: "/privacy"
    },
    {
        id: "dream-ai",
        slug: "dream-ai",
        name: "Dream AI",
        developer: "NexaraTechs Team",
        shortDescription: "Unlock the secrets of your subconscious with AI-powered dream interpretation.",
        fullDescription: "Have you ever woken up wondering what that strange dream meant? Dream AI combines ancient symbolism with modern artificial intelligence to analyze your dreams. Keep a digital dream journal, discover recurring themes, and gain deeper self-awareness through the power of interpretation.",
        logoGradient: "from-purple-500 to-pink-500",
        icon: Stars,
        primaryColor: "purple",
        screenshots: [
            "/screenshots/dreamai-1.png",
            "/screenshots/dreamai-2.png"
        ],
        features: [
            {
                title: "AI Interpretation",
                description: "Get instant, personalized analysis of your dreams using advanced LLMs.",
                icon: Sparkles
            },
            {
                title: "Dream Journal",
                description: "Record your dreams immediately upon waking with voice-to-text or quick typing.",
                icon: Smartphone
            },
            {
                title: "Symbol Dictionary",
                description: "Explore a vast database of improved dream symbols and meanings.",
                icon: Globe
            },
            {
                title: "Dark Mode",
                description: "A soothing interface designed for late-night journaling without straining your eyes.",
                icon: Moon
            }
        ],
        status: "Beta",
        version: "1.0.0-beta.4",
        lastUpdated: "Nov 28, 2025",
        category: "Lifestyle",
        downloadUrl: "#",
        privacyUrl: "/privacy"
    }
];

export function getAppBySlug(slug: string) {
    return apps.find((app) => app.slug === slug);
}
