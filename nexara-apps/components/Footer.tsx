"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { ArrowRight, Mail } from "lucide-react";

import { subscribeToNewsletter } from "@/lib/db";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
    const { t } = useLanguage();
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        setError("");

        try {
            await subscribeToNewsletter(email);
            setIsSuccess(true);
            setEmail("");
        } catch (err) {
            console.error("Newsletter error:", err);
            setError(t("footer.subscribeError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className="relative border-t border-border bg-background overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] translate-y-1/2 pointer-events-none" />

            {/* Top Gradient Line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-flex items-center gap-3 group">
                            <img src="/logo.png" alt="NexaraTechs" className="w-20 h-20 object-contain hover:scale-105 transition-transform duration-300 drop-shadow-lg" />
                            <span className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                                NexaraTechs
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            {t("footer.description")}
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                {
                                    icon: (props: any) => (
                                        <svg
                                            {...props}
                                            role="img"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                        >
                                            <title>X</title>
                                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                        </svg>
                                    ),
                                    href: "https://x.com/mehmetakifkkaya",
                                    label: ""
                                },
                                { icon: Mail, href: "mailto:nexaratechs@gmail.com", label: "Email" },
                            ].map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-9 h-9 rounded-lg bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent hover:border-border hover:scale-105 transition-all duration-300"
                                >
                                    <social.icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Column */}
                    <div className="md:justify-self-center">
                        <ul className="space-y-4 mt-6">
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-indigo-400 text-sm transition-colors flex items-center gap-2 group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {t("footer.privacy")}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div className="bg-secondary rounded-2xl p-6 border border-border backdrop-blur-sm">
                        <h4 className="font-semibold text-foreground mb-2">{t("footer.newsletterTitle")}</h4>
                        <p className="text-muted-foreground text-sm mb-4">
                            {t("footer.newsletterDescription")}
                        </p>

                        {isSuccess ? (
                            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                                <span className="text-sm font-medium">{t("footer.thanks")}</span>
                            </div>
                        ) : (
                            <form className="flex gap-2" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t("footer.emailPlaceholder")}
                                    className="flex-1 bg-muted border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 disabled:opacity-50"
                                    disabled={isSubmitting}
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-4 py-2.5 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                    aria-label="Subscribe"
                                >
                                    {isSubmitting ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <ArrowRight className="w-4 h-4" />
                                    )}
                                </button>
                            </form>
                        )}
                        {error && (
                            <p className="text-red-400 text-xs mt-2">{error}</p>
                        )}
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex items-center justify-center">
                    <p className="text-muted-foreground text-sm text-center">
                        &copy; {currentYear} NexaraTechs. {t("footer.rights")}
                    </p>
                </div>
            </div>
        </footer >
    );
}

