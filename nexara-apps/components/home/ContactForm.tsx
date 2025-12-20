"use client";

import { createTesterApplication } from "@/lib/db";
import { Shield } from "lucide-react";
import { useState } from "react";

export default function ContactForm() {
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

    return (
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
                                <p className="text-indigo-200">You&apos;ve been added to our priority waiting list. We&apos;ll be in touch soon.</p>
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
    );
}
