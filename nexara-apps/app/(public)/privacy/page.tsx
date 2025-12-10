export default function PrivacyPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Privacy Policy</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Last updated: December 10, 2024</p>
                </div>

                {/* Content */}
                <div className="space-y-6 md:space-y-8">
                    <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            At NexaraTechs, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our mobile applications and website.
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold">1</span>
                                Information We Collect
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11">
                                We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support. This may include your name, email address, and device information.
                            </p>
                        </div>

                        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold">2</span>
                                How We Use Your Information
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11">
                                We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.
                            </p>
                        </div>

                        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold">3</span>
                                Data Security
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11">
                                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                            </p>
                        </div>

                        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-sm font-bold">4</span>
                                Contact Us
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11">
                                If you have any questions about this Privacy Policy, please contact us at{" "}
                                <a href="mailto:support@nexaratechs.com" className="text-indigo-400 hover:underline">
                                    support@nexaratechs.com
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
