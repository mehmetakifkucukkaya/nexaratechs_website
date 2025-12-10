"use client";

import { notFound, useParams } from "next/navigation";
import { getAppBySlug } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, User, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";

// Screenshot images for the phone mockup slider
const screenshots = [
    "/images/Apple iPhone 16 Pro Max Screenshot 1.png",
    "/images/Apple iPhone 16 Pro Max Screenshot 2.png",
    "/images/Apple iPhone 16 Pro Max Screenshot 3.png",
    "/images/Apple iPhone 16 Pro Max Screenshot 4.png",
    "/images/Apple iPhone 16 Pro Max Screenshot 5.png",
    "/images/Apple iPhone 16 Pro Max Screenshot 6.png",
];

export default function AppPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const app = getAppBySlug(slug);

    if (!app) {
        notFound();
    }

    const Icon = app.icon;

    // Slider state and controls
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const nextSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % screenshots.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + screenshots.length) % screenshots.length);
    }, []);

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000);
    };

    // Auto-rotate every 4 seconds
    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(nextSlide, 4000);
        return () => clearInterval(interval);
    }, [isAutoPlaying, nextSlide]);

    // Use app-specific color for gradients/accents
    const gradientColor = app.primaryColor === "blue" ? "from-blue-600 to-cyan-500" : "from-purple-600 to-pink-500";
    const accentColor = app.primaryColor === "blue" ? "text-blue-400" : "text-purple-400";
    const bgGlow = app.primaryColor === "blue" ? "bg-blue-600" : "bg-purple-600";

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-24 pb-12 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
                {/* Background Blurs */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className={cn(
                        "absolute top-[-20%] right-[-10%] w-[70%] h-[70%] rounded-full blur-[140px] opacity-15",
                        bgGlow
                    )} />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[100px]" />
                </div>

                <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
                    <Link href="/#apps" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-12 transition-colors">
                        <ArrowLeft className="w-4 h-4" /> Back to Apps
                    </Link>

                    <div className="flex flex-col lg:flex-row gap-16 items-start">

                        {/* 1. Content / Text Side */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 text-center lg:text-left space-y-8"
                        >
                            <div className="flex flex-col items-center lg:items-start gap-6">
                                <div className={cn(
                                    "h-28 w-28 rounded-[2rem] bg-gradient-to-br flex items-center justify-center shadow-2xl ring-1 ring-white/10",
                                    app.logoGradient
                                )}>
                                    <Icon className="text-white w-14 h-14" />
                                </div>

                                <div className="space-y-3 sm:space-y-4">
                                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight leading-none">
                                        {app.name}
                                    </h1>
                                    <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                                        {app.shortDescription}
                                    </p>
                                </div>

                                {/* About Section - Premium Card */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                    className="relative mt-6 max-w-xl group"
                                >
                                    {/* Animated glow background */}
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradientColor} rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

                                    <div className="relative p-5 rounded-xl bg-slate-900/90 border border-slate-700/50 overflow-hidden">
                                        {/* Gradient accent line on left */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${gradientColor}`} />

                                        {/* Content */}
                                        <div className="pl-4">
                                            <p className="text-[15px] text-slate-300 leading-relaxed">
                                                {app.fullDescription}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-6">
                                {/* Google Play Badge Style Button */}
                                <Link
                                    href={app.downloadUrl || "#"}
                                    className="h-16 px-8 rounded-xl bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-105 flex items-center gap-3 shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
                                >
                                    <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg"><path d="M3.609 1.814L13.792 12 3.61 22.186c-.185.185-.425.226-.593.136a.6.6 0 0 1-.362-.511V2.389c0-.214.116-.403.3-.511.084-.055.182-.08.274-.064h.38zm11.2 11.2l-1.02-1.019L3.896 21.88c.11.096.262.143.415.111.23-.048.428-.198.536-.407l10.057-10.05-1.096-1.095V13.014zm1.268-1.267l5.448-5.46a.801.801 0 0 0 .226-.583.83.83 0 0 0-.215-.595.776.776 0 0 0-.583-.226.83.83 0 0 0-.594.215L15.06 10.63l1.017 1.117v.001zm-1.066-1.067l4.52-4.52-13.88-8.23c-.097-.058-.21-.08-.324-.058L14.73 10.4l.28.28z" /></svg>
                                    <div className="text-left">
                                        <div className="text-xs font-medium opacity-80 uppercase tracking-wide">Get it on</div>
                                        <div className="text-xl font-bold leading-none">Google Play</div>
                                    </div>
                                </Link>

                                {/* Closed Beta / Testers */}
                                {app.status === "Beta" && (
                                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                                        <div className="flex -space-x-2">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-background flex items-center justify-center text-[10px] font-bold">U{i}</div>
                                            ))}
                                        </div>
                                        <div className="text-sm font-medium">
                                            <span className="block text-white">Join 20+ Testers</span>
                                            <span className="text-xs text-muted-foreground">Limited spots left</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* 2. Visual Side (Phone Mockup with Image Slider) */}
                        <motion.div
                            initial={{ opacity: 0, y: 50, rotateX: 10 }}
                            animate={{ opacity: 1, y: 0, rotateX: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex-1 w-full max-w-[240px] lg:max-w-xs mx-auto perspective-1000"
                        >
                            {/* Phone Frame - 1320x2868 aspect ratio (approximately 1:2.17) */}
                            <div
                                className="relative rounded-[3rem] border-[12px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.02] duration-500 group"
                                style={{ aspectRatio: '1320/2868' }}
                            >
                                {/* Notch / Dynamic Island */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-30" />

                                {/* Screen Content - Image Slider */}
                                <div className="relative w-full h-full overflow-hidden bg-black">
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentSlide}
                                            initial={{ opacity: 0, scale: 1.05 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.5, ease: "easeInOut" }}
                                            className="absolute inset-0"
                                        >
                                            <Image
                                                src={screenshots[currentSlide]}
                                                alt={`App Screenshot ${currentSlide + 1}`}
                                                fill
                                                className="object-cover"
                                                priority={currentSlide === 0}
                                            />
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Navigation Arrows - Show on hover */}
                                    <button
                                        onClick={() => { prevSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
                                        aria-label="Previous screenshot"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => { nextSlide(); setIsAutoPlaying(false); setTimeout(() => setIsAutoPlaying(true), 10000); }}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-20 hover:bg-black/70"
                                        aria-label="Next screenshot"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>

                                    {/* Slide Indicators */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                                        {screenshots.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToSlide(index)}
                                                className={cn(
                                                    "w-2 h-2 rounded-full transition-all duration-300",
                                                    currentSlide === index
                                                        ? "bg-white w-6"
                                                        : "bg-white/40 hover:bg-white/60"
                                                )}
                                                aria-label={`Go to screenshot ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Glossy Reflection */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-10" />
                            </div>

                            {/* Decorative Elements behind phone */}
                            <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Description & Features */}
            <section className="py-12 sm:py-16 md:py-24 container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-24">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 flex items-center gap-3">
                                <span className={`w-2 h-8 rounded-full bg-gradient-to-b ${gradientColor}`} />
                                Key Features
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {app.features.map((feature, idx) => {
                                    const FeatureIcon = feature.icon;
                                    return (
                                        <div key={idx} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-card border border-white/5 hover:border-white/10 transition-colors group shadow-lg">
                                            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${gradientColor} bg-opacity-10 flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform shadow-inner`}>
                                                <FeatureIcon className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
                                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{feature.description}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8">
                        <div className="p-5 sm:p-8 rounded-2xl sm:rounded-[2rem] bg-card border border-white/5 shadow-2xl lg:sticky lg:top-24">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-green-500" />
                                App Information
                            </h3>
                            <ul className="space-y-6">
                                <li className="flex justify-between items-center pb-4 border-b border-border/40">
                                    <span className="text-muted-foreground flex items-center gap-2"><User className="w-4 h-4" /> Developer</span>
                                    <span className="font-medium text-right">{app.developer}</span>
                                </li>
                                <li className="flex justify-between items-center pb-4 border-b border-border/40">
                                    <span className="text-muted-foreground">Category</span>
                                    <span className="font-medium px-3 py-1 rounded-full bg-white/5 text-sm">{app.category}</span>
                                </li>
                                <li className="flex justify-between items-center pb-4 border-b border-border/40">
                                    <span className="text-muted-foreground">Version</span>
                                    <span className="font-medium">{app.version}</span>
                                </li>
                                <li className="flex justify-between items-center pb-4 border-b border-border/40">
                                    <span className="text-muted-foreground">Updated</span>
                                    <span className="font-medium">{app.lastUpdated}</span>
                                </li>
                                {app.privacyUrl && (
                                    <li className="pt-2">
                                        <Link href={app.privacyUrl} className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
                                            Read Privacy Policy <ArrowLeft className="w-3 h-3 rotate-180" />
                                        </Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    );
}
