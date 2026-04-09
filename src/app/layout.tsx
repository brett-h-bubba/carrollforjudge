import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Keri H. Carroll | Chancery Court Judge — Rankin County, Mississippi",
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
    url: "https://carrollforjudge.com",
    siteName: "Carroll for Judge",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
