import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nexaratechs.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "NexaraTechs - Modern Mobile Applications",
    template: "%s | NexaraTechs",
  },
  description:
    "We craft polished mobile applications that define the future of productivity and lifestyle. Discover Walletta, Dream AI, and more innovative apps.",
  keywords: [
    "mobile apps",
    "NexaraTechs",
    "Walletta",
    "Dream AI",
    "finance app",
    "dream interpretation",
    "Android apps",
    "iOS apps",
    "mobile development",
  ],
  authors: [{ name: "NexaraTechs Team" }],
  creator: "NexaraTechs",
  publisher: "NexaraTechs",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "NexaraTechs",
    title: "NexaraTechs - Modern Mobile Applications",
    description:
      "We craft polished mobile applications that define the future of productivity and lifestyle.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "NexaraTechs - Building Digital Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexaraTechs - Modern Mobile Applications",
    description:
      "We craft polished mobile applications that define the future of productivity and lifestyle.",
    images: ["/og-image.png"],
    creator: "@nexaratechs",
  },
  alternates: {
    canonical: siteUrl,
  },
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f23" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/pwa/ios/180.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/pwa/ios/32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/pwa/ios/16.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "NexaraTechs",
              url: siteUrl,
              logo: `${siteUrl}/logo.png`,
              description:
                "We craft polished mobile applications that define the future of productivity and lifestyle.",
              sameAs: [
                "https://twitter.com/nexaratechs",
                "https://github.com/nexaratechs",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "contact@nexaratechs.com",
                contactType: "customer service",
              },
            }),
          }}
        />
        {/* Structured Data - WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "NexaraTechs",
              url: siteUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${siteUrl}/apps?search={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

