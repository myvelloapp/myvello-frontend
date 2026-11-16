"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Zap,
  Calendar,
  CreditCard,
  Users,
  Smartphone,
  Download,
  Check,
  AlertTriangle,
  Clock,
  Sparkles,
  EyeOff,
  Database,
  Building2,
  ChevronDown,
  Layers,
  Search,
  SlidersHorizontal,
  LayoutList,
  MoreHorizontal,
  Home,
  GraduationCap,
  Car,
  CheckCircle,
  HelpCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useAuth } from "@/modules/authentication/AuthContext";
import { cn } from "@/lib/utils";

// Top Indian lenders for showcase
const FEATURED_BANKS = [
  { name: "State Bank of India", short: "SBI", badge: "Public Bank", logo: "https://cdn.jsdelivr.net/gh/praveenpuglia/indian-banks/assets/logos/sbin/symbol.svg" },
  { name: "HDFC Bank", short: "HDFC", badge: "Private Bank", logo: "https://cdn.jsdelivr.net/gh/praveenpuglia/indian-banks/assets/logos/hdfc/symbol.svg" },
  { name: "ICICI Bank", short: "ICICI", badge: "Private Bank", logo: "https://cdn.jsdelivr.net/gh/praveenpuglia/indian-banks/assets/logos/icic/symbol.svg" },
  { name: "Axis Bank", short: "Axis", badge: "Private Bank", logo: "https://cdn.jsdelivr.net/gh/praveenpuglia/indian-banks/assets/logos/utbi/symbol.svg" },
  { name: "Canara Bank", short: "Canara", badge: "Public Bank", logo: "https://cdn.jsdelivr.net/gh/praveenpuglia/indian-banks/assets/logos/cnrb/symbol.svg" },
  { name: "Bank of Baroda", short: "BoB", badge: "Public Bank", logo: "https://cdn.jsdelivr.net/gh/praveenpuglia/indian-banks/assets/logos/barb/symbol.svg" },
  { name: "Kotak Mahindra", short: "Kotak", badge: "Private Bank", logo: "https://cdn.jsdelivr.net/gh/praveenpuglia/indian-banks/assets/logos/kbl/symbol.svg" },
  { name: "Punjab National Bank", short: "PNB", badge: "Public Bank", logo: "https://cdn.jsdelivr.net/gh/praveenpuglia/indian-banks/assets/logos/punb/symbol.svg" },
  { name: "Bajaj Finserv", short: "Bajaj", badge: "NBFC", logo: "" },
  { name: "L&T Finance", short: "L&T", badge: "NBFC", logo: "" },
];

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [demoLoanTab, setDemoLoanTab] = useState<"active" | "all">("active");

  const faqs = [
    {
      q: "Is Myvello really 100% free? Are there hidden fees?",
      a: "Yes, Myvello is completely 100% free. There are no trial periods, no hidden premium paywalls, and no credit card required. We built Myvello to solve the real chaos of multi-bank loan tracking for Indian families without monetizing personal financial data.",
    },
    {
      q: "Do I need to give my NetBanking password or OTP?",
      a: "NEVER. Myvello will never ask for your bank login credentials, NetBanking passwords, or OTPs. You retain full control over your accounts. You simply log your loan schedule once, and Myvello manages the countdowns and auto-debit alerts securely.",
    },
    {
      q: "Does Myvello read my private SMS messages?",
      a: "No. Unlike other invasive finance apps that require full SMS permissions to spy on your personal messages, Myvello respects your absolute privacy. We do not read, scrape, or access your SMS inbox.",
    },
    {
      q: "How does the Auto-Debit Bank Mandate safeguard work?",
      a: "When you add an EMI, you specify which bank account it automatically debits from (e.g., Canara Bank, SBI, HDFC). Before the due date, Myvello highlights exactly which account needs sufficient funds, helping you avoid costly ₹450–₹500 NACH/ECS bounce fees.",
    },
    {
      q: "Can my spouse or family members track joint loans together?",
      a: "Yes! With Family Workspaces, you can invite co-borrowers or family members into a shared workspace. When one person records an EMI payment, it instantly syncs across everyone's devices.",
    },
    {
      q: "Can I install Myvello on my iPhone, Android, or PC?",
      a: "Yes. Myvello is built as a lightweight Progressive Web App (PWA). You can install it in 2 taps directly from Safari on iOS, Chrome on Android, or Chrome/Edge on Windows and Mac. It uses less than 2MB of phone storage and works offline.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* ========================================================= */}
        {/* HERO SECTION WITH LIVING AURORA BACKDROP & DUAL CTA */}
        {/* ========================================================= */}
        <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-200/60 bg-gradient-to-b from-white via-indigo-50/20 to-[#F8FAFC]">
          {/* Subtle Ambient Background Orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
            <div className="absolute -top-32 left-1/4 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl animate-orb-1" />
            <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-400/15 rounded-full blur-3xl animate-orb-2" />
          </div>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white border border-indigo-100 shadow-xs text-indigo-900">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>100% Free Forever &bull; Zero Bank Passwords &bull; Absolute Privacy</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#0B132B] leading-[1.12]">
                Never Miss an EMI Again. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#8B5CF6]">
                  The Smart, Private Loan Manager.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
                Track all your Home, Vehicle, Education, and Personal loans across 75+ Indian banks in one private dashboard. Protect your bank balance from expensive auto-debit bounce fees and manage shared loans with family.
              </p>

              {/* Dual Primary Call-to-Actions */}
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
                <Link
                  href={isAuthenticated ? "/emis" : "/register"}
                  className="min-h-[46px] px-6 sm:px-8 rounded-xl btn-gradient-glow text-white text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all hover:scale-102 active:scale-95 touch-manipulation"
                >
                  <span>{isAuthenticated ? "Open Your Loans Dashboard" : "Get Started Free – It's Free"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/install"
                  className="min-h-[46px] px-5 sm:px-6 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-800 text-sm font-bold shadow-xs flex items-center justify-center gap-2 transition-all hover:border-slate-300 active:scale-95 touch-manipulation"
                >
                  <Download className="w-4 h-4 text-indigo-600" />
                  <span>Install App (PWA)</span>
                </Link>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  No NetBanking Passwords
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  No Invasive SMS Scraping
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Avoid ₹500 Bounce Fees
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Shared Family Hub
                </span>
              </div>
            </div>

            {/* ========================================================= */}
            {/* INTERACTIVE MOBILE SCREEN DEMO MOCKUP */}
            {/* ========================================================= */}
            <div id="mobile-demo" className="mt-14 sm:mt-20 relative max-w-4xl mx-auto">
              {/* Surrounding Context Cards for Desktop */}
              <div className="hidden lg:block absolute -left-12 top-16 w-64 p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xl backdrop-blur-md space-y-2 z-20 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Auto-Debit Safeguard</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Always know which savings account will be debited before the mandate hits. Zero bounce fees.
                </p>
                <div className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block">
                  Tag: Canara &bull; SBI &bull; HDFC
                </div>
              </div>

              <div className="hidden lg:block absolute -right-12 top-48 w-64 p-4 rounded-2xl bg-white/95 border border-slate-200/80 shadow-xl backdrop-blur-md space-y-2 z-20 animate-fade-in">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Family Co-Borrower Hub</span>
                </div>
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  Track joint home and education loans with your spouse or parents. Instant real-time sync.
                </p>
                <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md inline-block">
                  Single Click Paid Status
                </div>
              </div>

              {/* Realistic Phone Frame */}
              <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[370px] rounded-[44px] bg-[#0B132B] p-3 sm:p-3.5 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] ring-1 ring-slate-800">
                {/* Phone Speaker & Dynamic Island Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 mr-2" />
                  <div className="w-2 h-2 rounded-full bg-blue-950/80" />
                </div>

                {/* Inner Screen Container */}
                <div className="relative bg-[#F8FAFC] rounded-[36px] overflow-hidden border border-slate-200/40 select-none">
                  {/* Status Bar */}
                  <div className="pt-3 pb-2 px-6 flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span>5G</span>
                      <div className="w-4 h-2 rounded-sm border border-slate-800 flex items-center p-0.5">
                        <div className="w-full h-full bg-slate-800 rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* App Mini Header */}
                  <div className="px-4 py-2 flex items-center justify-between border-b border-slate-100 bg-white/90 backdrop-blur-xs">
                    <BrandLogo className="h-6 w-auto" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                        Family Workspace
                      </span>
                      <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white text-[10px] font-black flex items-center justify-center">
                        R
                      </div>
                    </div>
                  </div>

                  {/* Screen Content Body */}
                  <div className="p-3.5 space-y-3 max-h-[580px] overflow-y-auto no-scrollbar">
                    {/* Next Due Stacked Hero Card */}
                    <div className="relative pt-0.5 pb-1">
                      {/* Under card peek 2 */}
                      <div className="absolute inset-x-3.5 top-1 -bottom-1 h-10 bg-slate-100/90 rounded-[16px] border border-slate-200/60 shadow-xs -z-2" />
                      {/* Under card peek 1 */}
                      <div className="absolute inset-x-1.5 top-0.5 -bottom-0.5 h-10 bg-slate-50 rounded-[16px] border border-slate-200/70 shadow-xs -z-1" />

                      {/* Top active card */}
                      <div className="relative bg-white rounded-[16px] p-3 border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] flex items-center justify-between gap-2.5">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Car className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[9px] font-extrabold uppercase tracking-wider text-indigo-600">
                                NEXT DUE:
                              </span>
                              <span className="text-[11px] font-bold text-slate-800 truncate">
                                L&amp;T Finance Ve...
                              </span>
                              <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full shrink-0">
                                1/3
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 mt-0.5">
                              <span className="font-extrabold text-slate-900">₹9,091</span>
                              <span>&bull;</span>
                              <span>Due 10 Dec</span>
                              <span className="text-amber-600 font-bold">(24d left)</span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="h-7 px-2.5 rounded-full border border-indigo-200 text-indigo-600 text-[10px] font-bold bg-indigo-50/60 shrink-0 flex items-center gap-0.5"
                        >
                          <span>Paid</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Stats Pill Row */}
                    <div className="grid grid-cols-3 gap-1.5">
                      <div className="bg-white rounded-xl p-2 border border-slate-200/70 text-center">
                        <span className="text-[9px] font-bold text-slate-400 block">Active</span>
                        <span className="text-xs font-black text-slate-900">3 Loans</span>
                      </div>
                      <div className="bg-white rounded-xl p-2 border border-slate-200/70 text-center">
                        <span className="text-[9px] font-bold text-slate-400 block">Monthly</span>
                        <span className="text-xs font-black text-indigo-600">₹32,893</span>
                      </div>
                      <div className="bg-white rounded-xl p-2 border border-slate-200/70 text-center">
                        <span className="text-[9px] font-bold text-slate-400 block">Balance</span>
                        <span className="text-xs font-black text-slate-900">₹8.4L</span>
                      </div>
                    </div>

                    {/* Toolbar Search & Filter Card */}
                    <div className="bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-2xs space-y-2">
                      <div className="flex items-center gap-1.5">
                        <div className="relative flex-1 min-w-0">
                          <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                          <div className="w-full h-7 pl-7 pr-2 text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200/70 rounded-lg flex items-center">
                            Search loans, banks...
                          </div>
                        </div>
                        <div className="h-7 px-2 rounded-lg border border-slate-200/80 text-[10px] font-bold text-slate-700 flex items-center gap-1 bg-white">
                          <SlidersHorizontal className="w-2.5 h-2.5" />
                          <span>Filters</span>
                        </div>
                        <div className="flex items-center p-0.5 bg-slate-100 rounded-md border border-slate-200/60">
                          <div className="w-6 h-6 rounded bg-white text-indigo-600 flex items-center justify-center shadow-2xs">
                            <LayoutList className="w-3 h-3" />
                          </div>
                          <div className="w-6 h-6 rounded text-slate-400 flex items-center justify-center">
                            <Calendar className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Minimal EMI Cards List */}
                    <div className="space-y-2">
                      {/* Card 1: Bank of Baroda Education Loan */}
                      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <GraduationCap className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                Bank of Baroda Education Loan
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium truncate">
                                Bank of Baroda &bull; Education Loan
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-slate-900 block">₹7,433</span>
                            <span className="text-[9px] text-slate-400">per month</span>
                          </div>
                        </div>

                        {/* Auto-Debit Pill */}
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/70">
                          <Zap className="w-2.5 h-2.5 text-emerald-600" />
                          <span>Auto-Debit: Canara Bank</span>
                        </div>

                        {/* Schedule & Days left */}
                        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 pt-0.5">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>20 Jan, 2027</span>
                            <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                              65d left
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full">
                            Upcoming
                          </span>
                        </div>

                        {/* Hairline Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[9px] font-semibold text-slate-400">
                            <span>1/12 EMIs</span>
                            <span>8%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-600 rounded-full w-[8%]" />
                          </div>
                        </div>

                        {/* Action Row */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            className="flex-1 h-8 rounded-xl btn-gradient-glow text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Pay ₹7,433</span>
                          </button>
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Card 2: Canara Bank Home Loan */}
                      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-2xs space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                              <Home className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">
                                Canara Bank Home Loan
                              </h4>
                              <p className="text-[10px] text-slate-500 font-medium truncate">
                                Canara Bank &bull; Home Loan
                              </p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-xs font-black text-slate-900 block">₹16,369</span>
                            <span className="text-[9px] text-slate-400">per month</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-medium text-slate-500 pt-0.5">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>10 Dec, 2026</span>
                            <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded">
                              24d left
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full">
                            Upcoming
                          </span>
                        </div>

                        {/* Action Row */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <button
                            type="button"
                            className="flex-1 h-8 rounded-xl btn-gradient-glow text-white text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs"
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span>Pay ₹16,369</span>
                          </button>
                          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Bottom Home Indicator */}
                  <div className="py-2 flex justify-center bg-white border-t border-slate-100">
                    <div className="w-28 h-1 bg-slate-900 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BANK COVERAGE MARQUEE & STATS SECTION */}
        {/* ========================================================= */}
        <section className="py-12 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-8">
              <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Universal Indian Lender Coverage
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#0B132B]">
                Track EMIs from 75+ Indian Banks &amp; NBFCs
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Whether you took a home loan from SBI, car loan from L&amp;T Finance, or personal loan from HDFC, manage them in one unified place.
              </p>
            </div>

            {/* Lender Pills Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {FEATURED_BANKS.map((b) => (
                <div
                  key={b.name}
                  className="p-3 rounded-2xl bg-slate-50/80 hover:bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-xs transition-all flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
                    {b.short}
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 block truncate">
                      {b.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {b.badge}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <span className="text-xs text-slate-400 font-medium">
                + All other Public Sector Banks, Private Lenders, NBFCs, and Housing Finance Companies supported.
              </span>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* THE CHAOS VS CLARITY COMPARISON SECTION */}
        {/* ========================================================= */}
        <section id="auto-debit" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200/60">
                Stop Burning Money On Bounce Fees
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B132B]">
                The Chaos of Multiple Loans vs. Clarity with Myvello
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Indian households juggle an average of 3 to 5 EMIs across different salary and savings accounts. A single missed auto-debit costs ₹450+ in bounce charges and damages your CIBIL score.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Without Myvello */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-100 shadow-sm space-y-5">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Without Myvello</h3>
                    <p className="text-xs text-rose-600 font-semibold">Stress, penalties, and blind spots</p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-600 font-medium">
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">&times;</span>
                    <span><strong>₹450 to ₹550 Bounce Penalties:</strong> Forgetting which bank account needs balance before the auto-debit mandate triggers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">&times;</span>
                    <span><strong>Logging Into 4 Different NetBanking Apps:</strong> Switching between SBI, HDFC, and Canara Bank just to check loan balances.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">&times;</span>
                    <span><strong>Invasive SMS-Reading Apps:</strong> Traditional finance apps read all your private text messages, contacts, and personal data.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-4 h-4 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">&times;</span>
                    <span><strong>Family Communication Gaps:</strong> Spouse doesn&apos;t know if the home loan was paid or whether the joint account has enough funds.</span>
                  </li>
                </ul>
              </div>

              {/* With Myvello */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200/80 shadow-md space-y-5 ring-1 ring-emerald-500/20">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">With Myvello</h3>
                    <p className="text-xs text-emerald-600 font-bold">Complete control, zero bounce fees, 100% free</p>
                  </div>
                </div>

                <ul className="space-y-3.5 text-xs text-slate-600 font-medium">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span><strong>Auto-Debit Bank Tagging:</strong> Clear badge shows which bank pays each EMI (e.g. Canara Bank), so you maintain balance in time.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span><strong>Single Unified Dashboard:</strong> See total monthly outflow, remaining principal balance, and live countdowns in seconds.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span><strong>Absolute Privacy &bull; Zero SMS Scraping:</strong> No netbanking passwords requested, zero OTPs, no intrusive SMS snooping.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 stroke-[2.5]" />
                    <span><strong>Shared Family Workspaces:</strong> Invite family members to manage joint loans together. One tap to mark paid.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* CORE FEATURES GRID */}
        {/* ========================================================= */}
        <section id="features" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Engineered for Indian Borrowers
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0B132B]">
                Everything You Need to Master Your Loan Life
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Powerful financial features wrapped in a minimal, delightful experience that works smoothly on mobile and desktop.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Feature 1 */}
              <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-indigo-200 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100/80 text-indigo-600 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B]">Multi-Bank Centralization</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Add Home, Auto, Education, and Personal loans from SBI, HDFC, Canara, BoB, or NBFCs in one single clean overview.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-200 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/80 text-emerald-600 flex items-center justify-center">
                  <Zap className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B]">Auto-Debit Bank Mandate Safeguard</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Tag the source account for each loan. Never wonder which bank is scheduled for auto-debit on the 5th or 10th of the month.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-blue-200 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100/80 text-blue-600 flex items-center justify-center">
                  <Clock className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B]">Live Due Countdowns</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Instantly see &ldquo;24d left&rdquo; or &ldquo;Due in 2 days&rdquo; badges. Record payments with 1 tap to advance the schedule smoothly.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-violet-200 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-violet-100/80 text-violet-600 flex items-center justify-center">
                  <Users className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B]">Family Workspaces</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Collaborate with co-borrowers, spouses, or parents. Everyone stays synchronized on upcoming due dates and payments.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-amber-200 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-amber-600 flex items-center justify-center">
                  <Calendar className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B]">Visual Due Calendar</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Toggle into the calendar view to inspect every due date across the month. Auto-normalizes leap years and month-end dates.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-slate-50/70 hover:bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-purple-200 hover:shadow-md transition-all space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-100/80 text-purple-600 flex items-center justify-center">
                  <Building2 className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-base font-bold text-[#0B132B]">Existing Loan Reconciliation</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Already halfway through a 10-year home loan? Enter past paid EMIs and Myvello accurately recalculates the remaining balance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 100% FREE & BANK-GRADE SECURITY GUARANTEES */}
        {/* ========================================================= */}
        <section id="security" className="py-16 sm:py-24 bg-gradient-to-b from-[#0B132B] via-[#172554] to-[#0B132B] text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-3 mb-14">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
                Trust &amp; Privacy First
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                100% Free Forever. Zero Compromises on Privacy.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 font-normal">
                You should never have to give away your financial privacy or banking passwords just to stay on top of your EMIs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Pillar 1: Why 100% Free */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">100% Free Guarantee</h3>
                    <p className="text-xs text-emerald-400 font-medium">No paywalls, no trial countdowns</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  Myvello is completely free for Indian families. All core features—multi-bank tracking, auto-debit alerts, calendar view, and family sharing—are unlocked from day one.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200 font-medium pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No subscription fees or hidden costs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No credit card or payment information needed</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Never locked behind premium tiers</span>
                  </li>
                </ul>
              </div>

              {/* Pillar 2: Bank-Grade Privacy */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Bank-Grade Privacy</h3>
                    <p className="text-xs text-indigo-400 font-medium">Zero netbanking credentials required</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed font-medium">
                  We built Myvello on a strict Zero-Knowledge Architecture. We never ask for banking credentials and never sell your phone number to loan telemarketers.
                </p>

                <ul className="space-y-2.5 text-xs text-slate-200 font-medium pt-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Zero NetBanking passwords &bull; Zero OTPs requested</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>No SMS scraping or email reading</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>Encrypted records &bull; Your data stays strictly yours</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* HOW IT WORKS (3 SIMPLE STEPS) */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Quick Setup
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B]">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Set up your entire loan profile in under 2 minutes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                  1
                </div>
                <h3 className="text-base font-bold text-slate-900">Add Your Loans</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Select your bank from 75+ Indian lenders, enter the monthly EMI amount, interest rate, and due day of the month.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                  2
                </div>
                <h3 className="text-base font-bold text-slate-900">Tag Auto-Debit Bank</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Assign which salary or savings account each loan automatically debits from so you never get hit with a surprise bounce fee.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center">
                  3
                </div>
                <h3 className="text-base font-bold text-slate-900">Track &amp; Stay Protected</h3>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Enjoy peaceful countdowns, 1-tap payment marks, and shared family visibility without ever checking multiple bank portals.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* INTERACTIVE FREQUENTLY ASKED QUESTIONS */}
        {/* ========================================================= */}
        <section id="faq" className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-2 mb-12">
              <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0B132B]">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer touch-manipulation"
                    >
                      <span className="text-xs sm:text-sm font-bold text-slate-900">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0",
                          isOpen && "rotate-180 text-indigo-600"
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs text-slate-600 leading-relaxed font-medium border-t border-slate-100 pt-3 animate-in fade-in duration-150">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* FINAL CONVERSION BANNER */}
        {/* ========================================================= */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-[#0B132B] via-[#172554] to-[#1e1b4b] rounded-[36px] p-8 sm:p-14 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl mx-auto space-y-3">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-500/30">
                  Join Indian Families Tracking Smarter
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-white">
                  Take Control of Your EMIs Today. 100% Free.
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-normal leading-relaxed">
                  No bank passwords. No SMS scraping. Just clean, stress-free loan management for you and your family.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
                  <Link
                    href={isAuthenticated ? "/emis" : "/register"}
                    className="min-h-[46px] px-8 rounded-xl btn-gradient-glow text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2 hover:scale-102 active:scale-95 transition-all touch-manipulation"
                  >
                    <span>{isAuthenticated ? "Open Your Dashboard" : "Create Free Account"}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    href="/install"
                    className="min-h-[46px] px-6 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-bold flex items-center gap-2 transition-all active:scale-95 touch-manipulation"
                  >
                    <Download className="w-4 h-4" />
                    <span>Install App</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
