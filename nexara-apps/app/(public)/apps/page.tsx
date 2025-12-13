"use client";

import { motion } from "framer-motion";
import Link from "next/link";
// import { apps } from "@/lib/data"; // Removed static data
import { getApps } from "@/lib/firebase";
import { getIcon } from "@/lib/icon-map";
import { AppData } from "@/lib/data";
import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, Download, ExternalLink, Loader2 } from "lucide-react";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1] as const
        }
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "Live":
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
        case "Beta":
            return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
        case "Coming Soon":
            return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        default:
            return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
};

const getCategoryColor = (category: string) => {
    switch (category) {
        case "Finance":
            return "bg-blue-500/10 text-blue-400 border-blue-500/20";
        case "Lifestyle":
            return "bg-purple-500/10 text-purple-400 border-purple-500/20";
        case "Productivity":
            return "bg-orange-500/10 text-orange-400 border-orange-500/20";
        default:
            return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
};

export default function AppsPage() {
    const [apps, setApps] = useState<AppData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadApps() {
            try {
                const fetchedApps = await getApps();
                setApps(fetchedApps);
            } catch (error) {
                console.error("Failed to load apps", error);
            } finally {
                setLoading(false);
            }
        }
        loadApps();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
                <div
                    className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[150px] animate-pulse"
                    style={{ animationDuration: '10s' }}
                />
                <div
                    className="absolute bottom-[-15%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px]"
                />
                <div
                    className="absolute top-[30%] left-[50%] w-[30%] h-[30%] bg-purple-500/5 rounded-full blur-[100px]"
                />
            </div>

            {/* Hero Section */}
            <section className="pt-28 pb-8 sm:pt-32 md:pt-40 lg:pt-44 container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="text-center max-w-4xl mx-auto"
                >
                    <motion.div
                        variants={itemVariants}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xl text-sm font-medium text-primary mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        Our Applications
                    </motion.div>

                    <motion.h1
                        variants={itemVariants}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] mb-6"
                    >
                        Discover Our{" "}
                        <span className="bg-gradient-to-r from-primary via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Premium Apps
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
                    >
                        Beautifully crafted mobile applications designed to enhance your daily life.
                        Each app is built with care, attention to detail, and a focus on user experience.
                    </motion.p>
                </motion.div>
            </section>

            {/* Apps Grid */}
            <section className="py-12 sm:py-16 md:py-20 container mx-auto px-4">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {apps.map((app) => {
                        const IconComponent = getIcon(app.icon as string);
                        return (
                            <motion.div
                                key={app.id}
                                variants={itemVariants}
                                className="group"
                            >
                                <Link href={`/apps/${app.slug}`}>
                                    <div className="relative h-full rounded-2xl sm:rounded-3xl bg-card/50 backdrop-blur-sm border border-white/5 p-6 sm:p-8 overflow-hidden transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:shadow-primary/5">
                                        {/* Gradient Background */}
                                        <div className={`absolute top-0 right-0 w-[200px] h-[200px] bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-10 blur-[80px] rounded-full transition-opacity duration-500 group-hover:opacity-20`} />

                                        {/* App Icon & Status */}
                                        <div className="relative z-10 flex items-start justify-between mb-6">
                                            <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden shadow-lg transform transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 flex items-center justify-center">
                                                {app.logoUrl ? (
                                                    <img src={app.logoUrl} alt={app.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-2xl font-bold text-white/50">{app.name.substring(0, 1)}</span>
                                                )}
                                            </div>
                                            <span className={`px-3 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wide ${getStatusColor(app.status)}`}>
                                                {app.status}
                                            </span>
                                        </div>

                                        {/* App Info */}
                                        <div className="relative z-10 space-y-4">
                                            <div>
                                                <h3 className="text-2xl sm:text-3xl font-bold mb-2 group-hover:text-primary transition-colors">
                                                    {app.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground/80">
                                                    by {app.developer}
                                                </p>
                                            </div>

                                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
                                                {app.shortDescription}
                                            </p>

                                            {/* Tags */}
                                            <div className="flex flex-wrap gap-2 pt-2">
                                                <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getCategoryColor(app.category)}`}>
                                                    {app.category}
                                                </span>
                                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-muted-foreground">
                                                    v{app.version}
                                                </span>
                                            </div>

                                            {/* Features Preview */}
                                            <div className="pt-4 border-t border-white/5">
                                                <div className="flex flex-wrap gap-2">
                                                    {(app.features || []).slice(0, 3).map((feature, index) => {
                                                        const FeatureIcon = getIcon(feature.icon as string);
                                                        return (
                                                            <span
                                                                key={index}
                                                                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/70"
                                                            >
                                                                <FeatureIcon className="w-3 h-3" />
                                                                {feature.title}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* CTA */}
                                            <div className="flex items-center justify-between pt-4">
                                                <span className="text-xs text-muted-foreground/60">
                                                    Released {app.releaseDate}
                                                </span>
                                                <span className="inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                                                    Learn More
                                                    <ArrowRight className="w-4 h-4" />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}

                    {/* Coming Soon Card */}
                    <motion.div
                        variants={itemVariants}
                        className="relative h-full min-h-[400px] rounded-2xl sm:rounded-3xl bg-white/5 border border-dashed border-white/10 p-6 sm:p-8 overflow-hidden flex flex-col items-center justify-center text-center gap-6 hover:bg-white/10 transition-colors"
                    >
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center">
                            <Sparkles className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-bold text-muted-foreground">More Coming Soon</h3>
                            <p className="text-sm text-muted-foreground/60 max-w-xs">
                                We're working on exciting new apps. Stay tuned for updates!
                            </p>
                        </div>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-colors"
                        >
                            Get Notified
                            <ExternalLink className="w-4 h-4" />
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-16 sm:py-20 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 border border-white/5 p-8 sm:p-12"
                >
                    <div className="absolute inset-0 overflow-hidden rounded-2xl sm:rounded-3xl">
                        <div className="absolute top-[-50%] right-[-20%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-2">
                            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-primary">{apps.length}</div>
                            <div className="text-sm sm:text-base text-muted-foreground">Published Apps</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-primary">10K+</div>
                            <div className="text-sm sm:text-base text-muted-foreground">Downloads</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-primary">4.8</div>
                            <div className="text-sm sm:text-base text-muted-foreground">Avg. Rating</div>
                        </div>
                        <div className="space-y-2">
                            <div className="text-3xl sm:text-4xl md:text-5xl font-black text-primary">24/7</div>
                            <div className="text-sm sm:text-base text-muted-foreground">Support</div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 container mx-auto px-4 pb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-2xl mx-auto space-y-6"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                        Can't Find What You're Looking For?
                    </h2>
                    <p className="text-muted-foreground">
                        We're always open to suggestions. Let us know what kind of app you'd like to see.
                    </p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                    >
                        <Download className="w-5 h-5" />
                        Join Our Beta Program
                    </Link>
                </motion.div>
            </section>
        </div>
    );
}
