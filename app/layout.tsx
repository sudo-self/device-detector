import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Head from "next/head";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JRs Device Detector",
  description: "Identify basic device info with optional share and QR code generator",
  metadataBase: new URL("https://jrs-device-detector.vercel.app"),
  openGraph: {
    type: "website",
    url: "https://jrs-device-detector.vercel.app",
    title: "JRs Device Detector",
    description: "Identify basic device info with optional share and QR code generator",
    images: ["/preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "JRs Device Detector",
    description: "Identify basic device info with optional share and QR code generator",
    images: ["/preview.png"],
  },
  authors: [{ name: "JR" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta property="og:site_name" content="Link preview site name" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
