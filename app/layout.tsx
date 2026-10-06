import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.roxylabs.io"),
  title: {
    default: "roxylabs",
    template: "%s · roxylabs",
  },
  description:
    "Applied AI, experimentation, and useful things made from messy problems.",
  openGraph: {
    title: "roxylabs",
    description:
      "Applied AI, experimentation, and useful things made from messy problems.",
    url: "https://www.roxylabs.io",
    siteName: "roxylabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "roxylabs",
    description:
      "Applied AI, experimentation, and useful things made from messy problems.",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
