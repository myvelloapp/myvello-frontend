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

const CurrencyOnboardingModal = dynamic(
  () => import("@/components/common/CurrencyOnboardingModal").then((mod) => mod.CurrencyOnboardingModal),
  { ssr: false }
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

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
            <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span>Verifying secure session...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#EDF8F2] flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden relative">
      {/* Pure Code Vector Organic Wave Background */}
      <AppWaveBackground />

      {/* Desktop Fixed Sidebar */}
      <Suspense fallback={<div className="hidden lg:block w-64 bg-white/95 backdrop-blur-md fixed inset-y-0 z-30" />}>
        <Sidebar />
      </Suspense>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen min-h-dvh relative z-10">
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Page Viewport with safe-area padding for bottom mobile nav */}
        <main className="flex-1 pb-[calc(6.5rem+env(safe-area-inset-bottom))] lg:pb-12 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* Global Currency & Regional Onboarding Modal */}
      <CurrencyOnboardingModal />

      {/* Global Logout Confirmation Modal */}
      <LogoutConfirmationModal />

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <Suspense fallback={null}>
        <MobileNav
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      </Suspense>
    </div>
  );
}
