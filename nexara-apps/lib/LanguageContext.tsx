"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export type Language = "en" | "tr";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations
const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navbar
        "nav.home": "Home",
        "nav.apps": "Apps",
        "nav.roadmap": "Roadmap",
        "nav.joinBeta": "Join Beta",
        "nav.menuOpen": "Open menu",
        "nav.menuClose": "Close menu",

        // Hero
        "hero.badge": "Next Generation Mobile Experiences",
        "hero.title1": "Building",
        "hero.title2": "Digital Solutions",
        "hero.subtitle": "We craft polished mobile applications that define the future of productivity and lifestyle. Simple, beautiful, and built for you.",
        "hero.exploreApps": "Explore Apps",
        "hero.joinBeta": "Join Beta",

        // Apps Grid
        "apps.title": "Crafted with Passion",
        "apps.subtitle": "Our latest releases pushing the boundaries.",
        "apps.nextBigThing": "Next Big Thing",
        "apps.coming": "Coming",

        // Contact Form
        "contact.title": "Ready to Shape the Future?",
        "contact.subtitle": "Join our exclusive testing squad. Be the first to try, break, and improve our next generation of apps.",
        "contact.welcomeTitle": "Welcome Aboard!",
        "contact.welcomeMessage": "You've been added to our priority waiting list. We'll be in touch soon.",
        "contact.registerAnother": "Register another email",
        "contact.emailPlaceholder": "Enter your email address",
        "contact.joining": "Joining...",
        "contact.getEarlyAccess": "Get Early Access",
        "contact.noSpam": "No spam. Unsubscribe anytime.",
        "contact.errorMessage": "Something went wrong. Please try again.",

        // Footer
        "footer.description": "We craft polished mobile applications that define the future of productivity and lifestyle. Our software is designed to enhance your daily digital experience.",
        "footer.product": "Product",
        "footer.roadmap": "Roadmap",
        "footer.company": "Company",
        "footer.privacy": "Privacy Policy",
        "footer.terms": "Terms of Service",
        "footer.contact": "Contact",
        "footer.newsletterTitle": "Subscribe to our newsletter",
        "footer.newsletterDescription": "Get the latest updates on our apps and technology.",
        "footer.emailPlaceholder": "Enter your email",
        "footer.thanks": "Thanks for subscribing!",
        "footer.subscribeError": "Failed to subscribe. Please try again.",
        "footer.rights": "All rights reserved.",
        "footer.craftedWith": "Crafted with",
        "footer.inIstanbul": "in Istanbul",

        // App Details
        "appDetails.backToApps": "Back to Apps",
        "appDetails.getItOn": "Get it on",
        "appDetails.googlePlay": "Google Play",
        "appDetails.joinTesters": "Join 20+ Testers",
        "appDetails.limitedSpots": "Limited spots left",
        "appDetails.keyFeatures": "Key Features",
        "appDetails.appInfo": "App Information",
        "appDetails.developer": "Developer",
        "appDetails.category": "Category",
        "appDetails.version": "Version",
        "appDetails.updated": "Updated",
        "appDetails.readPrivacy": "Read Privacy Policy",
        "appDetails.featuresComingSoon": "Features Coming Soon",
        "appDetails.featuresComingDesc": "Detailed feature list for {appName} is currently being updated. Check back soon for more information.",

        // Apps Page
        "appsPage.title": "Our Apps",
        "appsPage.subtitle": "Explore our collection of innovative mobile applications",
        "appsPage.learnMore": "Learn More",
        "appsPage.noApps": "No apps available at the moment",
        "appsPage.badge": "Our Applications",
        "appsPage.heroTitle1": "Discover Our",
        "appsPage.heroTitle2": "Premium Apps",
        "appsPage.heroSubtitle": "Beautifully crafted mobile applications designed to enhance your daily life. Each app is built with care, attention to detail, and a focus on user experience.",
        "appsPage.comingSoon": "More Coming Soon",
        "appsPage.comingSoonDesc": "We're working on exciting new apps. Stay tuned for updates!",
        "appsPage.getNotified": "Get Notified",
        "appsPage.released": "Released",
        "appsPage.by": "by",
        "appsPage.publishedApps": "Published Apps",
        "appsPage.downloads": "Downloads",
        "appsPage.avgRating": "Avg. Rating",
        "appsPage.support": "Support",
        "appsPage.cantFind": "Can't Find What You're Looking For?",
        "appsPage.suggestions": "We're always open to suggestions. Let us know what kind of app you'd like to see.",
        "appsPage.joinBeta": "Join Our Beta Program",

        // Categories
        "category.Finance": "Finance",
        "category.Productivity": "Productivity",
        "category.Lifestyle": "Lifestyle",
        "category.Education": "Education",
        "category.Entertainment": "Entertainment",
        "category.Games": "Games",
        "category.Health & Fitness": "Health & Fitness",
        "category.Music": "Music",
        "category.News": "News",
        "category.Photography": "Photography",
        "category.Shopping": "Shopping",
        "category.Social": "Social",
        "category.Sports": "Sports",
        "category.Tools": "Tools",
        "category.Travel": "Travel",
        "category.Weather": "Weather",
        "category.Books": "Books",
        "category.Food & Drink": "Food & Drink",
        "category.Business": "Business",
        "category.Art & Design": "Art & Design",
        "category.Communication": "Communication",

        // Months
        "month.january": "January",
        "month.february": "February",
        "month.march": "March",
        "month.april": "April",
        "month.may": "May",
        "month.june": "June",
        "month.july": "July",
        "month.august": "August",
        "month.september": "September",
        "month.october": "October",
        "month.november": "November",
        "month.december": "December",
    },
    tr: {
        // Navbar
        "nav.home": "Ana Sayfa",
        "nav.apps": "Uygulamalar",
        "nav.roadmap": "Yol Haritası",
        "nav.joinBeta": "Beta'ya Katıl",
        "nav.menuOpen": "Menüyü aç",
        "nav.menuClose": "Menüyü kapat",

        // Hero
        "hero.badge": "Yeni Nesil Mobil Deneyimler",
        "hero.title1": "Dijital",
        "hero.title2": "Çözümler Üretiyoruz",
        "hero.subtitle": "Geleceğin mobil deneyimlerini bugünden tasarlıyoruz. Basit, şık ve tamamen sizin için.",
        "hero.exploreApps": "Uygulamaları Keşfet",
        "hero.joinBeta": "Beta'ya Katıl",

        // Apps Grid
        "apps.title": "Tutkuyla Geliştirdik",
        "apps.subtitle": "Sınırları zorlayan en yeni uygulamalarımız.",
        "apps.nextBigThing": "Yeni Projeler Yolda",
        "apps.coming": "Çok Yakında",

        // Contact Form
        "contact.title": "Geleceği Birlikte Şekillendirelim",
        "contact.subtitle": "Beta test ekibimize katılın. Yeni uygulamalarımızı ilk deneyen, geri bildirim veren ve geliştirmemize yardımcı olan siz olun.",
        "contact.welcomeTitle": "Aramıza Hoş Geldiniz!",
        "contact.welcomeMessage": "Öncelikli bekleme listesine eklendiniz. En kısa sürede sizinle iletişime geçeceğiz.",
        "contact.registerAnother": "Başka bir e-posta ekle",
        "contact.emailPlaceholder": "E-posta adresiniz",
        "contact.joining": "Kaydediliyor...",
        "contact.getEarlyAccess": "Erken Erişim İste",
        "contact.noSpam": "Spam göndermiyoruz. İstediğinizde çıkabilirsiniz.",
        "contact.errorMessage": "Bir şeyler ters gitti. Lütfen tekrar deneyin.",

        // Footer
        "footer.description": "Geleceğin mobil deneyimlerini bugünden tasarlıyoruz. Üretkenliğinizi artıran, hayatınızı kolaylaştıran uygulamalar geliştiriyoruz.",
        "footer.product": "Ürünler",
        "footer.roadmap": "Yol Haritası",
        "footer.company": "Kurumsal",
        "footer.privacy": "Gizlilik Politikası",
        "footer.terms": "Kullanım Şartları",
        "footer.contact": "İletişim",
        "footer.newsletterTitle": "Bültenimize Abone Olun",
        "footer.newsletterDescription": "Yeni uygulamalar ve güncellemelerden ilk siz haberdar olun.",
        "footer.emailPlaceholder": "E-posta adresiniz",
        "footer.thanks": "Abone olduğunuz için teşekkürler!",
        "footer.subscribeError": "Kayıt başarısız. Lütfen tekrar deneyin.",
        "footer.rights": "Tüm hakları saklıdır.",
        "footer.craftedWith": "Sevgiyle",
        "footer.inIstanbul": "İstanbul'da üretildi",

        // App Details
        "appDetails.backToApps": "Uygulamalara Dön",
        "appDetails.getItOn": "Şimdi İndir",
        "appDetails.googlePlay": "Google Play",
        "appDetails.joinTesters": "20+ Beta Kullanıcısına Katıl",
        "appDetails.limitedSpots": "Sınırlı kontenjan",
        "appDetails.keyFeatures": "Öne Çıkan Özellikler",
        "appDetails.appInfo": "Uygulama Bilgileri",
        "appDetails.developer": "Geliştirici",
        "appDetails.category": "Kategori",
        "appDetails.version": "Sürüm",
        "appDetails.updated": "Son Güncelleme",
        "appDetails.readPrivacy": "Gizlilik Politikasını Görüntüle",
        "appDetails.featuresComingSoon": "Özellikler Yakında Eklenecek",
        "appDetails.featuresComingDesc": "{appName} için detaylı özellik listesi hazırlanıyor. Kısa süre içinde güncellenecektir.",

        // Apps Page
        "appsPage.title": "Uygulamalarımız",
        "appsPage.subtitle": "Yenilikçi mobil uygulama koleksiyonumuzu keşfedin",
        "appsPage.learnMore": "Detaylar",
        "appsPage.noApps": "Henüz uygulama bulunmuyor",
        "appsPage.badge": "Uygulama Kataloğu",
        "appsPage.heroTitle1": "Keşfedin:",
        "appsPage.heroTitle2": "Özel Uygulamalar",
        "appsPage.heroSubtitle": "Günlük hayatınızı kolaylaştırmak için özenle tasarlanmış mobil uygulamalar. Her biri kullanıcı deneyimi öncelikli, detaylara önem verilerek geliştirildi.",
        "appsPage.comingSoon": "Yeni Uygulamalar Yolda",
        "appsPage.comingSoonDesc": "Heyecan verici projeler üzerinde çalışıyoruz. Takipte kalın!",
        "appsPage.getNotified": "Beni Haberdar Et",
        "appsPage.released": "Yayın:",
        "appsPage.by": "tarafından",
        "appsPage.publishedApps": "Uygulama",
        "appsPage.downloads": "İndirme",
        "appsPage.avgRating": "Puan",
        "appsPage.support": "Destek",
        "appsPage.cantFind": "Aradığınızı Bulamadınız mı?",
        "appsPage.suggestions": "Fikirlerinizi duymak isteriz. Hangi uygulamayı görmek istediğinizi bize bildirin.",
        "appsPage.joinBeta": "Beta Programına Katıl",

        // Categories
        "category.Finance": "Finans",
        "category.Productivity": "Üretkenlik",
        "category.Lifestyle": "Yaşam Tarzı",
        "category.Education": "Eğitim",
        "category.Entertainment": "Eğlence",
        "category.Games": "Oyunlar",
        "category.Health & Fitness": "Sağlık ve Fitness",
        "category.Music": "Müzik",
        "category.News": "Haberler",
        "category.Photography": "Fotoğrafçılık",
        "category.Shopping": "Alışveriş",
        "category.Social": "Sosyal",
        "category.Sports": "Spor",
        "category.Tools": "Araçlar",
        "category.Travel": "Seyahat",
        "category.Weather": "Hava Durumu",
        "category.Books": "Kitaplar",
        "category.Food & Drink": "Yiyecek ve İçecek",
        "category.Business": "İş",
        "category.Art & Design": "Sanat ve Tasarım",
        "category.Communication": "İletişim",

        // Months
        "month.january": "Ocak",
        "month.february": "Şubat",
        "month.march": "Mart",
        "month.april": "Nisan",
        "month.may": "Mayıs",
        "month.june": "Haziran",
        "month.july": "Temmuz",
        "month.august": "Ağustos",
        "month.september": "Eylül",
        "month.october": "Ekim",
        "month.november": "Kasım",
        "month.december": "Aralık",
    },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        // Get language from localStorage on mount
        const saved = localStorage.getItem("language") as Language;
        if (saved && (saved === "en" || saved === "tr")) {
            setLanguageState(saved);
        }
        setIsHydrated(true);
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
    };

    const t = (key: string): string => {
        return translations[language][key] || key;
    };

    // Prevent hydration mismatch by not rendering until hydrated
    if (!isHydrated) {
        return <>{children}</>;
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

// Default fallback for SSR
const defaultLanguageContext: LanguageContextType = {
    language: "en",
    setLanguage: () => { },
    t: (key: string) => translations.en[key] || key,
};

export function useLanguage() {
    const context = useContext(LanguageContext);
    // Return default context during SSR instead of throwing error
    if (context === undefined) {
        return defaultLanguageContext;
    }
    return context;
}
