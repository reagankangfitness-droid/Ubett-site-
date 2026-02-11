import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ubett.app";

export const metadata: Metadata = {
  title: "Ubett — Never forget your keys again",
  description:
    "The 10-second departure checklist for ADHD brains. Auto-triggers when you leave. Phone, wallet, keys, meds — checked.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Ubett — Never forget your keys again",
    description:
      "The 10-second departure checklist for ADHD brains. Auto-triggers when you leave. Phone, wallet, keys, meds — checked.",
    url: siteUrl,
    siteName: "Ubett",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ubett — the phone wallet keys app your brain needed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ubett — Never forget your keys again",
    description:
      "The 10-second departure checklist for ADHD brains. Auto-triggers when you leave.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} ${spaceGrotesk.variable}`}>
        {children}
      </body>
    </html>
  );
}
