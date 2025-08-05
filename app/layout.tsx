import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/ConvexClientProvider";
import { AuthProvider } from "@/hooks/use-auth";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rwanda Young Water Professionals (RYWP)",
  description:
    "Empowering young water professionals in Rwanda to address water scarcity, sanitation, climate resilience, and sustainable development through innovation and collaboration.",
  metadataBase: new URL("https://rywp.org"),

  icons: {
    icon: "/images/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },

  openGraph: {
    title: "Rwanda Young Water Professionals (RYWP)",
    description:
      "Empowering youth in Rwanda’s water sector through capacity building, leadership, and innovation.",
    url: "https://rywp.org",
    siteName: "RYWP",
    images: [
      {
        url: "/images/logo-2.png",
        width: 1200,
        height: 630,
        alt: "RYWP – Rwanda Young Water Professionals Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Rwanda Young Water Professionals (RYWP)",
    description:
      "Empowering youth in Rwanda’s water sector through leadership and sustainable solutions.",
    images: ["/images/logo-2.png"],
    creator: "@ywprwanda",
  },


  keywords: [
    "RYWP",
    "Rwanda",
    "Young Water Professionals",
    "Water",
    "Sanitation",
    "WASH",
    "Climate",
    "Youth Leadership",
    "Sustainable Development",
    "SDGs",
    "Non-profit",
  ],

  alternates: {
    canonical: "https://rywp.org",
  },
};


export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <ConvexClientProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ConvexClientProvider>
    </body>
    </html>
  );
}