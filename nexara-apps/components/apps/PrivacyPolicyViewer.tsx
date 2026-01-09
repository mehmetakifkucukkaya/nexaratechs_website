"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { AppData } from "@/lib/data";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";

interface PrivacyPolicyViewerProps {
    app: AppData;
}

export default function PrivacyPolicyViewer({ app }: PrivacyPolicyViewerProps) {
    const { t } = useLanguage();

    // Sanitize markdown content to prevent XSS attacks
    const sanitizedContent = DOMPurify.sanitize(app.privacyPolicy || '', {
        USE_PROFILES: { html: true },
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'a', 'ul', 'ol', 'li',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'code', 'pre'],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
        // Prevent javascript: URLs
        FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
    });

    if (!app.privacyPolicy) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <h1 className="text-2xl font-bold mb-4">{t("appDetails.privacyNotAvailable")}</h1>
                    <p className="text-muted-foreground mb-6">{t("appDetails.privacyComingSoon")}</p>
                    <Link href={`/apps/${app.slug}`} className="text-primary hover:underline">
                        {t("appDetails.backToApp")}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 overflow-hidden">
                {/* Background Blurs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] opacity-15 bg-purple-600" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <Link
                        href={`/apps/${app.slug}`}
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> {t("appDetails.backToApp")}
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg">
                            <Shield className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">
                                {app.name} - {t("appDetails.privacyPolicy")}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {t("appDetails.privacyDescription")}
                            </p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Privacy Policy Content */}
            <section className="pb-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl"
                    >
                        <div className="prose prose-invert prose-lg max-w-none">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }: { children?: ReactNode }) => (
                                        <h1 className="text-3xl font-bold text-foreground mb-6 mt-8 first:mt-0">
                                            {children}
                                        </h1>
                                    ),
                                    h2: ({ children }: { children?: ReactNode }) => (
                                        <h2 className="text-xl font-semibold text-foreground mb-4 mt-8 pb-2 border-b border-border/40">
                                            {children}
                                        </h2>
                                    ),
                                    h3: ({ children }: { children?: ReactNode }) => (
                                        <h3 className="text-lg font-medium text-foreground mb-3 mt-6">
                                            {children}
                                        </h3>
                                    ),
                                    p: ({ children }: { children?: ReactNode }) => (
                                        <p className="text-muted-foreground mb-4 leading-relaxed">
                                            {children}
                                        </p>
                                    ),
                                    ul: ({ children }: { children?: ReactNode }) => (
                                        <ul className="space-y-2 mb-4 ml-4">
                                            {children}
                                        </ul>
                                    ),
                                    li: ({ children }: { children?: ReactNode }) => (
                                        <li className="text-muted-foreground flex items-start gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2.5 flex-shrink-0" />
                                            <span>{children}</span>
                                        </li>
                                    ),
                                    strong: ({ children }: { children?: ReactNode }) => (
                                        <strong className="font-semibold text-foreground">
                                            {children}
                                        </strong>
                                    ),
                                    a: ({ href, children }: { href?: string; children?: ReactNode }) => (
                                        <a
                                            href={href}
                                            className="text-purple-400 hover:text-purple-300 underline transition-colors"
                                        >
                                            {children}
                                        </a>
                                    ),
                                }}
                            >
                                {sanitizedContent}
                            </ReactMarkdown>
                        </div>

                        {/* Back button */}
                        <div className="mt-12 pt-8 border-t border-border/40">
                            <Link
                                href={`/apps/${app.slug}`}
                                className={cn(
                                    "inline-flex items-center gap-2 px-6 py-3 rounded-xl",
                                    "bg-white/5 border border-white/10 hover:bg-white/10",
                                    "text-foreground transition-all"
                                )}
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t("appDetails.backToApp")}
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}
