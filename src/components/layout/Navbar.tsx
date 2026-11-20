"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Menu, X, ShieldCheck, Download, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useAuth } from "@/modules/authentication/AuthContext";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Auto-Debit", href: "/#auto-debit" },
    { label: "Security & Free", href: "/#security" },
    { label: "App Demo", href: "/#mobile-demo" },
    { label: "FAQ", href: "/#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-8">
          <BrandLogo className="h-8 w-auto" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/install"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install App</span>
            </Link>
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <span className="hidden xl:inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            100% Free Forever
          </span>

          {isAuthenticated ? (
            <Link
              href="/emis"
              className="h-9 px-4 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 active:scale-95 touch-manipulation"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="h-9 px-3.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="h-9 px-4 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-xs flex items-center gap-1 transition-all hover:scale-102 active:scale-95 touch-manipulation"
              >
                <span>Get Started Free</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 sm:hidden">
          {isAuthenticated ? (
            <Link
              href="/emis"
              className="h-8 px-3 rounded-lg btn-gradient-glow text-white text-[11px] font-bold shadow-xs flex items-center gap-1"
            >
              <span>Dashboard</span>
            </Link>
          ) : (
            <Link
              href="/register"
              className="h-8 px-3 rounded-lg btn-gradient-glow text-white text-[11px] font-bold shadow-xs flex items-center gap-1"
            >
              <span>Start Free</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden border-t border-slate-200/80 bg-white px-4 py-4 space-y-3 shadow-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/install"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50/50 rounded-lg transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install App (PWA)</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full h-10 rounded-xl btn-gradient-glow text-white text-xs font-bold flex items-center justify-center gap-1 shadow-md shadow-emerald-500/25"
                >
                  <span>Create Free Account</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </>
            ) : (
              <Link
                href="/emis"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full h-10 rounded-xl btn-gradient-glow text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
