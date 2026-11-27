import type { Metadata, Viewport } from "next";
import type { ReactElement, ReactNode } from "react";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/theme_provider";
import { JsonLd } from "@/components/seo/json_id";
import { APP_NAME, APP_URL, TWITTER_HANDLE } from "@/lib/seo";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
});
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "fluxlearn - Smart education that helps you grow",
    template: "%s · fluxlearn",
  },
  description:
    "fluxlearn is an online school platform for classes, live sessions, attendance, grades, and fees - one place for students, teachers, and families.",
  applicationName: APP_NAME,
  keywords: [
    "school management software",
    "student information system",
    "SIS",
    "school ERP",
    "attendance tracking",
    "fee management",
    "gradebook",
    "multi-tenant SIS",
  ],
  authors: [{ name: APP_NAME }],
  creator: APP_NAME,
  publisher: APP_NAME,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: APP_NAME,
    title: "fluxlearn - Smart education that helps you grow",
    description:
      "Interactive classes and a flexible learning experience, with attendance, grades, and fees in one school platform.",
    images: [
      { url: "/opengraph-image", width: 1200, height: 630, alt: APP_NAME },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
    title: "fluxlearn - Smart education that helps you grow",
    description:
      "Interactive classes and a flexible learning experience, with attendance, grades, and fees in one school platform.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/icon", apple: "/apple-icon" },
  manifest: "/manifest.webmanifest",
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  // AdSense site verification. The meta tag shows no ads by itself - the ad
  // script loads only on the marketing pages (components/seo/adsense.tsx).
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#202124" },
  ],
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: APP_NAME,
  url: APP_URL,
  logo: `${APP_URL}/icon`,
  sameAs: [`https://twitter.com/${TWITTER_HANDLE.replace(/^@/, "")}`],
  description:
    "fluxlearn is an online school platform for classes, live sessions, attendance, grades, and fees.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): ReactElement {
  return (
    <html
      lang="en"
      className={`${ibmPlexSans.variable} ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground min-h-dvh antialiased">
        <ThemeProvider>{children}</ThemeProvider>
        <JsonLd json={organizationLd} />
      </body>
    </html>
  );
}
