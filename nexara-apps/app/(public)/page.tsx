"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { getApps } from "@/lib/firebase";
import { useState, useEffect } from "react";
import { ArrowRight, Smartphone, Gamepad2, Stars, Rocket, ChevronRight, Zap, Globe, Shield } from "lucide-react";

// Animation Variants
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function LandingPage() {
    const [appCount, setAppCount] = useState(0);

    useEffect(() => {
        getApps().then(apps => setAppCount(apps.length));
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">

            {/* Background Gradients */}
            <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[60%] bg-primary/10 rounded-full blur-[100px]" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-28 pb-12 sm:pt-32 md:pt-40 lg:pt-52 lg:pb-32 container mx-auto px-4">
                <div className="flex flex-col items-center text-center max-w-5xl mx-auto z-10 relative">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="space-y-8"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xl text-sm font-medium text-indigo-400">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Next Generation Mobile Experiences
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1]">
                            Building <br className="hidden md:block" />
                            <span className="bg-gradient-to-r from-indigo-400 via-primary to-purple-400 bg-clip-text text-transparent drop-shadow-2xl">Digital Solutions</span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-base sm:text-lg md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed px-4 sm:px-0">
                            We craft polished mobile applications that define the future of productivity and lifestyle. Simple, beautiful, and built for you.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link href="#apps" className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-primary text-primary-foreground font-semibold text-base sm:text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(124,58,237,0.5)]">
                                Explore Apps <ChevronRight className="w-5 h-5" />
                            </Link>
                            <Link href="#contact" className="h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-foreground font-medium text-base sm:text-lg flex items-center gap-2 hover:bg-white/10 transition-colors">
                                Join Beta
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Bento Grid Apps Showcase */}
            <section id="apps" className="py-12 sm:py-16 md:py-24 container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4">Crafted with Passion</h2>
                    <p className="text-muted-foreground text-lg">Our latest releases pushing the boundaries.</p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto h-auto md:h-[600px]">

                    {/* Walletta (Large) */}
                    <Link href="/apps/walletta" className="md:col-span-2 md:row-span-2 block h-full">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative h-full group rounded-2xl sm:rounded-[2.5rem] bg-card border border-white/5 p-5 sm:p-8 overflow-hidden shadow-2xl flex flex-col justify-between cursor-pointer min-h-[280px] md:min-h-0"
                        >
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors" />

                            <div className="z-10">
                                <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 mb-6 flex items-center justify-center shadow-lg transform group-hover:-rotate-6 transition-transform">
                                    <Zap className="text-white w-8 h-8" />
                                </div>
                                <h3 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-3">Walletta</h3>
                                <p className="text-sm sm:text-lg text-muted-foreground max-w-md">The ultimate personal finance companion. Track expenses, set budgets, and achieve financial freedom with an interface that feels like magic.</p>
                            </div>

                            <div className="mt-8 flex gap-3 z-10">
                                <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">Finance</span>
                                <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">Available Now</span>
                            </div>

                            <div className="absolute bottom-[-50px] right-[-50px] md:bottom-[-20px] md:right-[-20px] w-64 h-64 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl rotate-[-10deg] opacity-80 group-hover:rotate-[-5deg] group-hover:scale-105 transition-all duration-500"></div>
                        </motion.div>
                    </Link>

                    {/* Dream AI (Small 1) */}
                    <Link href="/apps/dream-ai" className="block h-full">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative h-full group rounded-2xl sm:rounded-[2.5rem] bg-card border border-white/5 p-5 sm:p-8 overflow-hidden shadow-xl cursor-pointer min-h-[200px] md:min-h-0"
                        >
                            <div className="mb-4 flex justify-between items-start">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                    <Stars className="text-white w-7 h-7" />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-bold uppercase tracking-wide">Beta</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Dream AI</h3>
                            <p className="text-sm text-muted-foreground">Unlock the secrets of your subconscious with AI-powered dream interpretation.</p>
                        </motion.div>
                    </Link>

                    {/* Coming Soon (Small 2) */}
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="relative group rounded-2xl sm:rounded-[2.5rem] bg-white/5 border border-dashed border-white/10 p-5 sm:p-8 overflow-hidden flex flex-col items-center justify-center text-center gap-4 hover:bg-white/10 transition-colors min-h-[200px] md:min-h-0"
                    >
                        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Rocket className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-muted-foreground">Next Big Thing</h3>
                            <p className="text-xs text-muted-foreground/60 mt-1">Coming Q3 2025</p>
                        </div>
                    </motion.div>

                </div>
            </section>

            {/* CTA Section */}
            <section id="contact" className="py-16 sm:py-24 md:py-32 container mx-auto px-4">
                <div className="relative rounded-2xl sm:rounded-[3rem] bg-gradient-to-b from-primary to-indigo-900 overflow-hidden px-4 sm:px-6 py-12 sm:py-20 text-center">
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-30">
                        <div className="absolute top-[-50%] left-[-20%] w-[800px] h-[800px] rounded-full border-[100px] border-white/10 blur-3xl"></div>
                    </div>

                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        <h2 className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-tight">Ready to Shape the Future?</h2>
                        <p className="text-base sm:text-xl text-indigo-100 font-light max-w-2xl mx-auto px-4 sm:px-0">
                            Join our exclusive testing squad. Be the first to try, break, and improve our next generation of apps.
                        </p>

                        <div className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl max-w-md mx-auto border border-white/20 shadow-2xl">
                            <form className="flex flex-col gap-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full bg-transparent border-none text-white placeholder:text-indigo-200 focus:ring-0 px-4 py-3 outline-none"
                                />
                                <button type="button" className="w-full bg-white text-indigo-900 rounded-xl font-bold py-3 hover:bg-indigo-50 transition-colors text-lg">
                                    Get Early Access
                                </button>
                            </form>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-indigo-200 text-sm opacity-80 w-full">
                            <Shield className="w-4 h-4" />
                            <span>No spam. Unsubscribe anytime.</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer removed, handled in layout */}
        </div>
    );
}
