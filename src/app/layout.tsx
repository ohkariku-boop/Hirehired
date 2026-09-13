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

// GitHub Pages serves under /Hirehired
const BASE = process.env.NODE_ENV === "production" ? "/Hirehired" : "";

export const metadata: Metadata = {
  title: "Hirehired — Find the job before everyone else",
  description:
    "Jobs sourced directly from company career pages. Less noise. Higher signal. Apply earlier with fewer applicants.",
  metadataBase: new URL(
    process.env.NODE_ENV === "production"
      ? "https://ohkariku-boop.github.io/Hirehired"
      : "http://localhost:3000"
  ),
  icons: {
    icon: [
      { url: `${BASE}/favicon.ico`, sizes: "any" },
      { url: `${BASE}/favicon-32.png`, sizes: "32x32", type: "image/png" },
      { url: `${BASE}/favicon-16.png`, sizes: "16x16", type: "image/png" },
      { url: `${BASE}/icon.png`, sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: `${BASE}/apple-touch-icon.png`, sizes: "180x180" }],
    shortcut: `${BASE}/favicon.ico`,
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
      <head>
        <link rel="icon" href={`${BASE}/favicon.ico`} sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href={`${BASE}/favicon-32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${BASE}/favicon-16.png`} />
        <link rel="apple-touch-icon" href={`${BASE}/apple-touch-icon.png`} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
