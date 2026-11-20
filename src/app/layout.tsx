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
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Myvello",
  },
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
  themeColor: "#EDF8F2",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} h-full bg-[#EDF8F2]`}>
      <head>
        <meta name="theme-color" content="#EDF8F2" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="msapplication-navbutton-color" content="#EDF8F2" />
        <meta name="apple-mobile-web-app-title" content="Myvello" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var token = localStorage.getItem('myvello_token');
                if (token && !document.cookie.includes('myvello_token=')) {
                  var maxAge = 315360000;
                  var expires = new Date(Date.now() + maxAge * 1000).toUTCString();
                  document.cookie = 'myvello_token=' + encodeURIComponent(token) + '; path=/; max-age=' + maxAge + '; expires=' + expires + '; SameSite=Lax';
                }

                // If running in installed app / desktop software mode (standalone) on root path '/' or '/install', immediately bypass landing page
                if (window.location.pathname === '/' || window.location.pathname === '/install') {
                  var isApp = window.matchMedia('(display-mode: standalone)').matches ||
                              window.matchMedia('(display-mode: window-controls-overlay)').matches ||
                              window.matchMedia('(display-mode: minimal-ui)').matches ||
                              window.navigator.standalone === true;
                  if (isApp) {
                    window.location.replace(token ? '/emis' : '/register');
                  }
                }
              } catch (e) {}

              // Prevent iOS Safari auto-zoom on input focus while maintaining standard sleek text size
              if (typeof window !== 'undefined') {
                document.addEventListener('touchstart', function(e) {
                  var t = e.target;
                  if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) {
                    if (t.type !== 'checkbox' && t.type !== 'radio' && t.type !== 'range' && t.type !== 'button' && t.type !== 'submit') {
                      var prev = t.style.fontSize;
                      t.style.fontSize = '16px';
                      setTimeout(function() {
                        t.style.fontSize = prev;
                      }, 100);
                    }
                  }
                }, { passive: true });
              }
              // Register background service worker for lock-screen push notifications
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#EDF8F2] text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
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
