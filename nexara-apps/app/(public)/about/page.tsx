"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import { Shield, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden pt-24 pb-24">
            {/* Hero Section */}
            <section className="relative px-4 sm:px-6 lg:px-8 mb-24 md:mb-32">
                {/* Background Blurs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] opacity-15 bg-purple-600" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-5xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs sm:text-sm font-medium mb-6 backdrop-blur-sm text-muted-foreground"
                    >
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span>NexaraTechs</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/60"
                    >
                        {t("about.title")}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    >
                        {t("about.subtitle")}
                    </motion.p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/5 relative group">
                            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px] z-0"></div>
                            {/* Abstract Image */}
                            <img
                                src="/mission-abstract.png"
                                alt="Abstract Vision"
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent z-10 pointer-events-none"></div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold">{t("about.missionTitle")}</h2>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            {t("about.missionDesc")}
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link href="/apps" className="px-6 py-3 rounded-xl bg-foreground text-background font-bold hover:opacity-90 transition-opacity">
                                {t("nav.apps")}
                            </Link>
                            <Link href="https://x.com/mehmetakifkkaya" target="_blank" className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2">
                                <svg
                                    role="img"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-4 h-4 fill-current"
                                >
                                    <title>X</title>
                                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                                </svg>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Values Grid */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-bold mb-4">{t("about.valuesTitle")}</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ValueCard
                        icon={<Zap className="w-6 h-6 text-yellow-400" />}
                        title={t("about.value1Title")}
                        desc={t("about.value1Desc")}
                        delay={0.1}
                    />
                    <ValueCard
                        icon={<Sparkles className="w-6 h-6 text-purple-400" />}
                        title={t("about.value2Title")}
                        desc={t("about.value2Desc")}
                        delay={0.2}
                    />
                    <ValueCard
                        icon={<Shield className="w-6 h-6 text-green-400" />}
                        title={t("about.value3Title")}
                        desc={t("about.value3Desc")}
                        delay={0.3}
                    />
                </div>
            </section>


        </div>
    );
}

function ValueCard({ icon, title, desc, delay }: { icon: any, title: string, desc: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, duration: 0.5 }}
            className="p-6 rounded-2xl bg-card border border-white/5 hover:border-white/10 transition-colors"
        >
            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-2">{title}</h3>
            <p className="text-muted-foreground">{desc}</p>
        </motion.div>
    );
}
