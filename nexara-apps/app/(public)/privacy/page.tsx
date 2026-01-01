"use client";

import { useLanguage } from "@/lib/LanguageContext";

export default function PrivacyPage() {
    const { t } = useLanguage();
    return (
        <div className="min-h-screen pt-24 pb-16 md:pt-32 md:pb-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">{t("privacy.general.title")}</h1>
                    <p className="text-muted-foreground">{t("privacy.general.subtitle")}</p>
                </div>

                {/* Content */}
                <div className="space-y-8">
                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5">
                        <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                            {t("privacy.general.intro")}
                        </p>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">1</span>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{t("privacy.general.newsletterTitle")}</h3>
                                    <p className="text-muted-foreground">
                                        {t("privacy.general.newsletterDesc")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold">2</span>
                                <div>
                                    <h3 className="text-xl font-semibold mb-2">{t("privacy.general.appsTitle")}</h3>
                                    <p className="text-muted-foreground">
                                        {t("privacy.general.appsDesc")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        <p>{t("privacy.general.contact")} <a href="mailto:nexaratechs@gmail.com" className="text-primary hover:underline">nexaratechs@gmail.com</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
