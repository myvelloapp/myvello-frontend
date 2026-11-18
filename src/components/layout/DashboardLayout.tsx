"use client";

import React, { useState, Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/modules/authentication/AuthContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { LogoutConfirmationModal } from "@/components/common/LogoutConfirmationModal";
import { BrandLogo } from "@/components/common/BrandLogo";
import { AppWaveBackground } from "@/components/layout/AppWaveBackground";
import { cn } from "@/lib/utils";

const CurrencyOnboardingModal = dynamic(
  () => import("@/components/common/CurrencyOnboardingModal").then((mod) => mod.CurrencyOnboardingModal),
  { ssr: false }
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  hideSidebar?: boolean;
  hideNotifications?: boolean;
  isPopup?: boolean;
}

export function DashboardLayout({
  children,
  hideSidebar,
  hideNotifications,
  isPopup,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPopupMode = isPopup ?? (hideSidebar ?? (pathname === "/emis/new"));
  const shouldHideNotifications = hideNotifications ?? (isPopupMode || pathname === "/emis/new");

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (user && !user.email_verified_at) {
        router.replace("/verify-email");
      }
    }
  }, [isLoading, isAuthenticated, user, router, pathname]);

  // If session is verifying, unauthenticated, or email not verified, block rendering
  if (isLoading || !isAuthenticated || (user && !user.email_verified_at)) {
    return (
      <div className="min-h-screen min-h-dvh bg-[#EDF8F2] flex flex-col items-center justify-center p-6 text-center select-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] relative">
        <AppWaveBackground />
        <div className="relative z-10 flex flex-col items-center">
          <div className="mb-4 flex items-center justify-center">
            <BrandLogo className="h-10 w-auto" href="" />
          </div>
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
            <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Verifying secure session...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#EDF8F2] flex flex-col font-sans text-slate-900 antialiased selection:bg-emerald-600 selection:text-white overflow-x-hidden relative">
      {/* Pure Code Vector Organic Wave Background */}
      <AppWaveBackground />

      {/* Desktop Fixed Sidebar (Omitted in popup modal flow) */}
      {!isPopupMode && (
        <Suspense fallback={<div className="hidden lg:block w-64 bg-white/95 backdrop-blur-md fixed inset-y-0 z-30" />}>
          <Sidebar />
        </Suspense>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "flex flex-col min-h-screen min-h-dvh relative z-10 transition-all duration-300",
          !isPopupMode && "lg:pl-64"
        )}
      >
        {/* Top Header */}
        <Header
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isPopupMode={isPopupMode}
          hideNotifications={shouldHideNotifications}
        />

        {/* Page Viewport with safe-area padding for bottom mobile nav */}
        <main
          className={cn(
            "flex-1 overflow-x-hidden",
            isPopupMode
              ? "pb-8 sm:pb-12"
              : "pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-12"
          )}
        >
          {children}
        </main>
      </div>

      {/* Global Currency & Regional Onboarding Modal */}
      <CurrencyOnboardingModal />

      {/* Global Logout Confirmation Modal */}
      <LogoutConfirmationModal />

      {/* Mobile Navigation Drawer & Bottom Bar (Omitted in popup modal flow) */}
      {!isPopupMode && (
        <Suspense fallback={null}>
          <MobileNav
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </Suspense>
      )}
    </div>
  );
}
