"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2, Heart, Download } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

export function Footer() {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      {/* Top Banner / Trust Micro-Bar */}
      <div className="border-b border-slate-100 bg-slate-50/60 py-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Bank-Grade Privacy: Zero NetBanking Passwords &bull; Zero OTPs Requested</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-indigo-600" />
            <span>Client-Side AES Encryption &bull; Zero SMS Scraping</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-bold text-slate-800">100% Free Forever &bull; No Tier Paywalls</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <BrandLogo className="h-8 w-auto" />
            <p className="text-xs text-slate-500 leading-relaxed font-normal">
              Myvello is India&apos;s intelligent, private loan and EMI central tracker. Designed for families and individuals to safeguard bank balances and prevent costly auto-debit bounce penalties.
            </p>
            <div className="pt-1">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                100% Free Community App
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Product &amp; Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <a href="/#features" className="hover:text-indigo-600 transition-colors">
                  Multi-Bank Tracking
                </a>
              </li>
              <li>
                <a href="/#auto-debit" className="hover:text-indigo-600 transition-colors">
                  Auto-Debit Safeguard
                </a>
              </li>
              <li>
                <a href="/#family" className="hover:text-indigo-600 transition-colors">
                  Family Workspaces
                </a>
              </li>
              <li>
                <a href="/#calendar" className="hover:text-indigo-600 transition-colors">
                  Visual Due Calendar
                </a>
              </li>
              <li>
                <Link href="/install" className="hover:text-indigo-600 transition-colors font-bold text-indigo-600 flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Install App (PWA)
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Guarantees */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Privacy &amp; Security
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <a href="/#security" className="hover:text-indigo-600 transition-colors">
                  Zero Password Policy
                </a>
              </li>
              <li>
                <a href="/#security" className="hover:text-indigo-600 transition-colors">
                  No SMS Scraping
                </a>
              </li>
              <li>
                <a href="/#security" className="hover:text-indigo-600 transition-colors">
                  No Data Selling / Ads
                </a>
              </li>
              <li>
                <a href="/#why-free" className="hover:text-indigo-600 transition-colors">
                  Why It&apos;s Free Forever
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
              Account
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              <li>
                <Link href="/register" className="hover:text-indigo-600 transition-colors font-bold text-slate-900">
                  Create Free Account &rarr;
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-indigo-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-indigo-600 transition-colors">
                  Reset Password
                </Link>
              </li>
              <li>
                <a href="/#faq" className="hover:text-indigo-600 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {year} Myvello. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Designed for Indian families &bull; Built with absolute privacy in mind
          </p>
        </div>
      </div>
    </footer>
  );
}
