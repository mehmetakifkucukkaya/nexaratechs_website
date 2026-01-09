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
        "nav.about": "About",
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
        "appDetails.privacyPolicy": "Privacy Policy",
        "appDetails.privacyDescription": "How we handle and protect your data",
        "appDetails.privacyNotAvailable": "Privacy Policy Not Available",
        "appDetails.privacyComingSoon": "Privacy policy for this app is coming soon.",
        "appDetails.backToApp": "Back to App",

        // Apps Page
        "appsPage.title": "Our Apps",
        "appsPage.subtitle": "Explore our collection of innovative mobile applications",
        "appsPage.learnMore": "Learn More",
        "appsPage.noApps": "No apps available at the moment",
        "appsPage.badge": "Our Applications",
        "appsPage.heroTitle1": "Discover Our",
        "appsPage.heroTitle2": "Premium Apps",
        "appsPage.heroSubtitle": "Beautifully crafted mobile applications designed to enhance your daily life. Each app is built with care, attention to detail, and a focus on user experience.",
        "appsPage.comingSoon": "Coming Soon",
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

        // About Page
        "about.title": "My Vision",
        "about.subtitle": "Building the future of digital experiences.",
        "about.missionTitle": "My Mission",
        "about.missionDesc": "At NexaraTechs, I believe in the power of simplicity. My mission is to create natural, intuitive, and empowering applications. I don't just write code; I design experiences that improve your daily life.",
        "about.valuesTitle": "Core Values",
        "about.value1Title": "Innovation",
        "about.value1Desc": "Constantly pushing boundaries and exploring new technologies.",
        "about.value2Title": "Quality",
        "about.value2Desc": "Obsessive attention to detail in every pixel and interaction.",
        "about.value3Title": "Privacy",
        "about.value3Desc": "Your data is yours. I design with privacy first.",
        "about.teamTitle": "Developer",
        "about.teamDesc": "A passionate designer and engineer based in Istanbul.",

        // Privacy Page
        "privacy.general.title": "Privacy Policy",
        "privacy.general.subtitle": "General Website Policy",
        "privacy.general.intro": "NexaraTechs is a portfolio website showcasing mobile applications. This website itself does not collect personal data from visitors, except for the optional newsletter subscription.",
        "privacy.general.newsletterTitle": "Newsletter",
        "privacy.general.newsletterDesc": "If you subscribe to our newsletter, we only store your email address to send you updates about our apps. We do not share your email with third parties.",
        "privacy.general.appsTitle": "App Privacy Policies",
        "privacy.general.appsDesc": "Each application handles data differently. Please refer to the specific \"Privacy Policy\" link within each app's page or settings for details on how they process your data.",
        "privacy.general.contact": "Questions? Contact us at",
    },
    tr: {
        // Navbar
        "nav.home": "Ana Sayfa",
        "nav.apps": "Uygulamalar",
        "nav.about": "Hakkımızda",
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
        "appDetails.privacyPolicy": "Gizlilik Politikası",
        "appDetails.privacyDescription": "Verilerinizi nasıl işlediğimiz ve koruduğumuz",
        "appDetails.privacyNotAvailable": "Gizlilik Politikası Mevcut Değil",
        "appDetails.privacyComingSoon": "Bu uygulama için gizlilik politikası yakında eklenecektir.",
        "appDetails.backToApp": "Uygulamaya Dön",

        // Apps Page
        "appsPage.title": "Uygulamalarımız",
        "appsPage.subtitle": "Yenilikçi mobil uygulama koleksiyonumuzu keşfedin",
        "appsPage.learnMore": "Detaylar",
        "appsPage.noApps": "Henüz uygulama bulunmuyor",
        "appsPage.badge": "Uygulama Kataloğu",
        "appsPage.heroTitle1": "Keşfedin:",
        "appsPage.heroTitle2": "Özel Uygulamalar",
        "appsPage.heroSubtitle": "Günlük hayatınızı kolaylaştırmak için özenle tasarlanmış mobil uygulamalar. Her biri kullanıcı deneyimi öncelikli, detaylara önem verilerek geliştirildi.",
        "appsPage.comingSoon": "Çok Yakında",
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

        // About Page
        "about.title": "Vizyonum",
        "about.subtitle": "Dijital deneyimlerin geleceğini inşa ediyorum.",
        "about.missionTitle": "Misyonum",
        "about.missionDesc": "NexaraTechs olarak sadeliğin gücüne inanıyorum. Misyonum, doğal, sezgisel ve güçlendirici uygulamalar yaratmaktır. Sadece kod yazmıyorum; günlük yaşamınızı iyileştiren deneyimler tasarlıyorum.",
        "about.valuesTitle": "Değerlerim",
        "about.value1Title": "İnovasyon",
        "about.value1Desc": "Sınırları zorluyor ve sürekli yeni teknolojileri keşfediyorum.",
        "about.value2Title": "Kalite",
        "about.value2Desc": "Her pikselde ve etkileşimde detaylara takıntılı özen.",
        "about.value3Title": "Gizlilik",
        "about.value3Desc": "Verileriniz sizindir. Gizlilik odaklı tasarım yapıyorum.",
        "about.teamTitle": "Geliştirici",
        "about.teamDesc": "İstanbul merkezli tutkulu bir tasarımcı ve mühendis.",

        // Privacy Page
        "privacy.general.title": "Gizlilik Politikası",
        "privacy.general.subtitle": "Genel Web Sitesi Politikası",
        "privacy.general.intro": "NexaraTechs, mobil uygulamaları sergileyen bir portföy web sitesidir. Bu web sitesi, opsiyonel bülten aboneliği dışında ziyaretçilerden kişisel veri toplamaz.",
        "privacy.general.newsletterTitle": "Bülten",
        "privacy.general.newsletterDesc": "Bültenimize abone olursanız, e-posta adresinizi sadece uygulamalarımızla ilgili güncellemeleri göndermek için saklarız. E-postanızı üçüncü taraflarla paylaşmayız.",
        "privacy.general.appsTitle": "Uygulama Gizlilik Politikaları",
        "privacy.general.appsDesc": "Her uygulama  verileri farklı şekilde işler. Verilerinizi nasıl işlediklerine dair detaylar için lütfen her uygulamanın sayfasındaki veya ayarlarındaki \"Gizlilik Politikası\" linkine başvurun.",
        "privacy.general.contact": "Sorularınız mı var? Bize ulaşın:",
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
