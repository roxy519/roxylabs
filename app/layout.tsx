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
    "Experiments in ai, automation, marketing, operations, and creative projects.",
  openGraph: {
    title: "roxylabs",
    description:
      "Experiments in ai, automation, marketing, operations, and creative projects.",
    url: "https://www.roxylabs.io",
    siteName: "roxylabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "roxylabs",
    description:
      "Experiments in ai, automation, marketing, operations, and creative projects.",
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
