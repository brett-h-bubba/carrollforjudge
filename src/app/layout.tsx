import type { Metadata } from "next";
import { Cormorant_Garamond, Allura } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const allura = Allura({
  variable: "--font-allura",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://carrollforjudge.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Keri H. Carroll | Chancery Court Judge - Rankin County, Mississippi",
    template: "%s | Keri H. Carroll for Chancery Court Judge",
  },
  description:
    "Keri H. Carroll is running for Chancery Court Judge in Mississippi's 20th District, Place 1. With 21 years of family law experience, she brings the preparation, patience, and judicial temperament Rankin County families deserve.",
  keywords: [
    "Keri Carroll",
    "Chancery Court Judge",
    "Rankin County",
    "Mississippi",
    "20th Chancery Court District",
    "family law",
    "judicial election",
    "2026",
  ],
  openGraph: {
    title: "Keri H. Carroll for Chancery Court Judge",
    description:
      "The experience Rankin County families deserve. 21 years of family law practice. Vote November 3, 2026.",
    url: SITE_URL,
    siteName: "Carroll for Judge",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/social-share.png",
        width: 1200,
        height: 630,
        alt: "Keri H. Carroll for Chancery Court Judge",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${allura.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <GoogleAnalytics />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
