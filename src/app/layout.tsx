import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { AuthProvider } from "@/modules/authentication/AuthContext";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { NotificationProvider } from "@/context/NotificationContext";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://myvello.life"
  ),
  title: "Myvello | Your Life. Your Records. One Place.",
  description:
    "Personal and family-oriented digital management platform for EMIs, loans, schedules, and important documents.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/images/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/images/favicon.svg",
  },
  openGraph: {
    title: "Myvello | Your Life. Your Records. One Place.",
    description:
      "Personal and family-oriented digital management platform for EMIs, loans, schedules, and important documents.",
    url: "https://myvello.life",
    siteName: "Myvello",
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: "Myvello - Your Life. Your Records. One Place.",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Myvello | Your Life. Your Records. One Place.",
    description:
      "Personal and family-oriented digital management platform for EMIs, loans, schedules, and important documents.",
    images: ["/images/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#172554",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>
          <WorkspaceProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </WorkspaceProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
