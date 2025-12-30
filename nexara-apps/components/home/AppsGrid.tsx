"use client";

import { AppData } from "@/lib/db";
import { motion } from "framer-motion";
import { Rocket, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface AppsGridProps {
    apps: AppData[];
}

export default function AppsGrid({ apps }: AppsGridProps) {
    return (
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
                                className={`relative h-full group rounded-2xl sm:rounded-[2.5rem] bg-card border border-border p-5 sm:p-8 overflow-hidden shadow-xl flex flex-col justify-between cursor-pointer ${isFeatured ? 'min-h-[280px] md:min-h-[600px]' : 'min-h-[200px]'
                                    }`}
                            >
                                {/* Background Decor for Featured */}
                                {isFeatured && (
                                    <>
                                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 blur-[80px] rounded-full group-hover:from-blue-500/25 group-hover:to-purple-500/25 transition-all duration-500" />
                                        <div className="absolute bottom-[-50px] right-[-50px] md:bottom-[-20px] md:right-[-20px] w-64 h-64 bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl rotate-[-10deg] opacity-80 group-hover:rotate-[-5deg] group-hover:scale-105 transition-all duration-500 hidden md:block" />
                                    </>
                                )}

                                <div className="z-10 relative">
                                    <div className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center shadow-lg mb-4 sm:mb-6 ${isFeatured
                                        ? 'bg-gradient-to-br from-blue-600 to-cyan-500 transform group-hover:-rotate-6 transition-transform'
                                        : 'bg-gradient-to-br from-purple-500 to-pink-500'
                                        }`}>
                                        {app.logoUrl ? (
                                            <Image
                                                src={app.logoUrl}
                                                alt={app.name}
                                                width={40}
                                                height={40}
                                                className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-md"
                                                unoptimized={app.logoUrl.startsWith('http')}
                                            />
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
                    className="relative group rounded-2xl sm:rounded-[2.5rem] bg-secondary border border-dashed border-border p-5 sm:p-8 overflow-hidden flex flex-col items-center justify-center text-center gap-4 hover:bg-accent transition-colors min-h-[200px]"
                >
                    <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
                        <Rocket className="w-8 h-8 text-muted-foreground opacity-50" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-muted-foreground">Next Big Thing</h3>
                        <p className="text-xs text-muted-foreground/60 mt-1">Coming {new Date().getFullYear() + 1}</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
