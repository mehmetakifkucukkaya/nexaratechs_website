import Footer from "@/components/Footer";
import FloatingNavbar from "@/components/home/FloatingNavbar";
import SkipLink from "@/components/SkipLink";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col font-sans relative">
            {/* Skip Link for Accessibility */}
            <SkipLink />

            {/* Subtle background gradient */}
            <div className="fixed inset-0 -z-10 bg-background" aria-hidden="true">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl" />
            </div>

            <FloatingNavbar />

            {/* Main Content - ARIA landmark */}
            <main id="main-content" className="flex-1" role="main" tabIndex={-1}>
                {children}
            </main>

            <Footer />
        </div>
    );
}
