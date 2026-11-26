import type { Metadata } from "next";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://reactbd.com";
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Schola";
export const TWITTER_HANDLE =
  process.env.NEXT_PUBLIC_TWITTER_HANDLE ?? "@schola";

interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  noindex?: boolean;
}

export function pageMetadata({
  title,
  description,
  path,
  ogImage,
  noindex,
}: PageSeoInput): Metadata {
  const url = new URL(path, APP_URL).toString();
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url,
      siteName: APP_NAME,
      title,
      description,
      images: [
        {
          url: ogImage ?? "/opengraph-image",
          width: 1200,
          height: 630,
          alt: APP_NAME,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      images: [ogImage ?? "/twitter-image"],
    },
    robots: noindex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : undefined,
  };
}
