"use client";

import { AppData, createTesterApplication, getApps } from "@/lib/db";
import { motion } from "framer-motion";
import { ChevronRight, Rocket, Shield, Smartphone } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    const [apps, setApps] = useState<AppData[]>([]);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsSubmitting(true);
        try {
            await createTesterApplication({
                email,
                fullName: 'Website Visitor',
                device: 'Web Client',
                status: 'pending'
            });
            setIsSuccess(true);
            setEmail("");
        } catch (error) {
            console.error("Error joining beta:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        getApps().then(data => setApps(data));
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto auto-rows-[minmax(200px,auto)] md:auto-rows-[minmax(280px,auto)]">
                    {apps.map((app, index) => {
                        const isFeatured = index === 0;
                        const Wrapper = ({ children }: { children: React.ReactNode }) => (
                            <Link href={`/apps/${app.slug}`} className={`block h-full ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''}`}>
                                {children}
                            </Link>
                        );

                        return (
                            <Wrapper key={app.id || index}>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    whileHover={{ scale: 1.02 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative h-full group rounded-2xl sm:rounded-[2.5rem] bg-card border border-white/5 p-5 sm:p-8 overflow-hidden shadow-xl flex flex-col justify-between cursor-pointer ${isFeatured ? 'min-h-[280px] md:min-h-[600px]' : 'min-h-[200px]'
                                        }`}
                                >
                                    {/* Background Decor for Featured */}
                                    {isFeatured && (
                                        <>
                                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-[80px] rounded-full group-hover:bg-blue-500/30 transition-colors" />
                                            <div className="absolute bottom-[-50px] right-[-50px] md:bottom-[-20px] md:right-[-20px] w-64 h-64 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl rotate-[-10deg] opacity-80 group-hover:rotate-[-5deg] group-hover:scale-105 transition-all duration-500 hidden md:block" />
                                        </>
                                    )}

                                    <div className="z-10 relative">
                                        <div className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 sm:mb-6 ${isFeatured
                                            ? 'bg-gradient-to-br from-blue-600 to-cyan-500 transform group-hover:-rotate-6 transition-transform'
                                            : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                            }`}>
                                            {app.logoUrl ? (
                                                <img src={app.logoUrl} alt={app.name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md" />
                                            ) : (
                                                <Smartphone className="text-white w-7 h-7 sm:w-8 sm:h-8" />
                                            )}
                                        </div>

                                        {/* Badges */}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {app.status === 'Beta' && (
                                                <span className="px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-bold uppercase tracking-wide">
                                                    Beta
                                                </span>
                                            )}
                                            {app.status === 'Live' && (
                                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wide">
                                                    Live
                                                </span>
                                            )}
                                        </div>

                                        <h3 className={`font-bold mb-2 ${isFeatured ? 'text-2xl sm:text-4xl' : 'text-xl sm:text-2xl'}`}>
                                            {app.name}
                                        </h3>
                                        <p className={`text-muted-foreground ${isFeatured ? 'text-sm sm:text-lg max-w-md' : 'text-sm line-clamp-3'}`}>
                                            {app.shortDescription}
                                        </p>
                                    </div>

                                    {/* Footer tags for featured */}
                                    {isFeatured && (
                                        <div className="mt-8 flex gap-3 z-10 relative">
                                            <span className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm font-medium">
                                                {app.category || 'App'}
                                            </span>
                                        </div>
                                    )}
                                </motion.div>
                            </Wrapper>
                        );
                    })}

                    {/* Coming Soon Card (Always present) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        viewport={{ once: true }}
                        transition={{ delay: apps.length * 0.1 }}
                        className="relative group rounded-2xl sm:rounded-[2.5rem] bg-white/5 border border-dashed border-white/10 p-5 sm:p-8 overflow-hidden flex flex-col items-center justify-center text-center gap-4 hover:bg-white/10 transition-colors min-h-[200px]"
                    >
                        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Rocket className="w-8 h-8 text-muted-foreground opacity-50" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-muted-foreground">Next Big Thing</h3>
                            <p className="text-xs text-muted-foreground/60 mt-1">Coming {new Date().getFullYear() + 1}</p>
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
                            {isSuccess ? (
                                <div className="py-8 px-4 text-center">
                                    <div className="h-16 w-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Shield className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">Welcome Aboard!</h3>
                                    <p className="text-indigo-200">You've been added to our priority waiting list. We'll be in touch soon.</p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="mt-4 text-sm text-indigo-300 hover:text-white underline"
                                    >
                                        Register another email
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleJoin} className="flex flex-col gap-2">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full bg-transparent border-none text-white placeholder:text-indigo-200 focus:ring-0 px-4 py-3 outline-none"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-white text-indigo-900 rounded-xl font-bold py-3 hover:bg-indigo-50 transition-colors text-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? 'Joining...' : 'Get Early Access'}
                                    </button>
                                </form>
                            )}
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
