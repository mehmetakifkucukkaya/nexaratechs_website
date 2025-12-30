import AppsGrid from "@/components/home/AppsGrid";
import ContactForm from "@/components/home/ContactForm";
import Hero from "@/components/home/Hero";
import { getApps } from "@/lib/db";

// Force dynamic rendering to prevent static generation issues
export const dynamic = "force-dynamic";

export default async function LandingPage() {
    const apps = await getApps();

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            {/* Hero Section */}
            <Hero />

            {/* Bento Grid Apps Showcase */}
            <AppsGrid apps={apps} />

            {/* CTA Section */}
            <ContactForm />
        </div>
    );
}
