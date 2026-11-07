"use client";

import React, { useState, Suspense } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Desktop Fixed Sidebar */}
      <Suspense fallback={<div className="hidden lg:block w-64 bg-[#0C1222] fixed inset-y-0" />}>
        <Sidebar />
      </Suspense>

      {/* Main Content Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <Header onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Page Viewport with padding for bottom mobile nav */}
        <main className="flex-1 pb-24 lg:pb-12">
          {children}
        </main>
      </div>

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
