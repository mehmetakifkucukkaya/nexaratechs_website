import Link from "next/link";
import FloatingNavbar from "@/components/home/FloatingNavbar";
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col font-sans relative">
            {/* Subtle background gradient */}
            <div className="fixed inset-0 -z-10 bg-background">
                <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-indigo-500/5 to-transparent rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-purple-500/5 to-transparent rounded-full blur-3xl" />
            </div>

            <FloatingNavbar />

            {/* Main Content */}
            <main className="flex-1">
                {children}
            </main>

            {/* Modern Professional Footer */}
            <footer className="relative border-t border-white/5 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm">
                {/* Gradient line at top */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

                <div className="container mx-auto px-4 py-10 sm:py-16">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-8 sm:mb-12">
                        <div className="col-span-2 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <span className="text-white font-bold text-lg">N</span>
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                    NexaraTechs
                                </span>
                            </div>
                            <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-md">
                                Building the future of mobile applications with cutting-edge technology and beautiful design.
                                Our apps are crafted to enhance your daily life.
                            </p>
                            <div className="flex items-center gap-2 sm:gap-3 pt-2">
                                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-all hover:scale-110">
                                    <Twitter className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-all hover:scale-110">
                                    <Github className="w-4 h-4" />
                                </a>
                                <a href="#" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-all hover:scale-110">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                                <a href="mailto:contact@nexaratechs.com" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-muted-foreground hover:text-white transition-all hover:scale-110">
                                    <Mail className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Links Column */}
                        <div className="space-y-4">
                            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/80">Legal</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/privacy" className="text-xs sm:text-sm text-muted-foreground hover:text-white transition-colors inline-flex items-center gap-1 group">
                                        <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Privacy Policy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-xs sm:text-sm text-muted-foreground hover:text-white transition-colors inline-flex items-center gap-1 group">
                                        <span className="w-1 h-1 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Terms of Service
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Apps Column */}
                        <div className="space-y-4">
                            <h4 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white/80">Products</h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/apps/walletta" className="text-xs sm:text-sm text-muted-foreground hover:text-white transition-colors inline-flex items-center gap-1 group">
                                        <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        Walletta
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/apps/aifin" className="text-xs sm:text-sm text-muted-foreground hover:text-white transition-colors inline-flex items-center gap-1 group">
                                        <span className="w-1 h-1 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        AiFin
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-6 sm:pt-8 border-t border-white/5">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <p className="text-xs sm:text-sm text-muted-foreground">
                                © {new Date().getFullYear()} NexaraTechs. All rights reserved.
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1">
                                Crafted with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 animate-pulse" /> for you
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
