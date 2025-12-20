"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

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

export default function Hero() {
    return (
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
    );
}
