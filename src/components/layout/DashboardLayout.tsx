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

const CurrencyOnboardingModal = dynamic(
  () => import("@/components/common/CurrencyOnboardingModal").then((mod) => mod.CurrencyOnboardingModal),
  { ssr: false }
);

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  // If session is verifying or unauthenticated, block rendering and show secure verification state
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen min-h-dvh bg-[#F0F5FF] flex flex-col items-center justify-center p-6 text-center select-none pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
        <div className="mb-4 flex items-center justify-center">
          <BrandLogo className="h-10 w-auto" href="" />
        </div>
        <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
          <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span>Verifying secure session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen min-h-dvh bg-[#F0F5FF] flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      {/* Desktop Fixed Sidebar */}
      <Suspense fallback={<div className="hidden lg:block w-64 bg-white fixed inset-y-0" />}>
        <Sidebar />
      </Suspense>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen min-h-dvh">
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Page Viewport with safe-area padding for bottom mobile nav */}
        <main className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-12 overflow-x-hidden">
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
