export default function TermsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">Terms of Service</h1>
                    <p className="text-sm sm:text-base text-muted-foreground">Last updated: December 10, 2024</p>
                </div>

                {/* Content */}
                <div className="space-y-6 md:space-y-8">
                    <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                            Please read these Terms of Service ("Terms") carefully before using the NexaraTechs website and mobile applications operated by us.
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">1</span>
                                Acceptance of Terms
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11">
                                By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the Service.
                            </p>
                        </div>

                        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">2</span>
                                Use License
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11">
                                Permission is granted to temporarily download one copy of the materials (information or software) on NexaraTechs's website for personal, non-commercial transitory viewing only.
                            </p>
                        </div>

                        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">3</span>
                                Disclaimer
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11">
                                The materials on NexaraTechs's website are provided on an 'as is' basis. NexaraTechs makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                        </div>

                        <div className="p-4 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 text-sm font-bold">4</span>
                                Changes
                            </h2>
                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed pl-11">
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
