"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Monitor,
  Smartphone,
  Download,
  Apple,
  CheckCircle2,
  Share2,
  Check,
  Zap,
  ArrowRight,
  PlusSquare,
  ShieldCheck,
  Star,
  Lock,
  Bell,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

type DeviceType = "windows" | "mac" | "ios" | "android";

export default function InstallAppPage() {
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("windows");
  const [currentDevice, setCurrentDevice] = useState<DeviceType | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect standalone PWA mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone);

    // Detect User Operating System
    const ua = window.navigator.userAgent.toLowerCase();
    let detected: DeviceType = "windows";
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod")) {
      detected = "ios";
    } else if (ua.includes("android")) {
      detected = "android";
    } else if (ua.includes("mac")) {
      detected = "mac";
    } else {
      detected = "windows";
    }

    setCurrentDevice(detected);
    setSelectedDevice(detected);

    // Capture PWA install prompt event
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handlePrompt);
    return () => window.removeEventListener("beforeinstallprompt", handlePrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        showToast("Myvello application installed successfully!");
      }
      setDeferredPrompt(null);
    } else {
      showToast("Look for the install icon (⊕) on the right side of your browser address bar.");
    }
  };

  const devices: { id: DeviceType; label: string; icon: React.ElementType }[] = [
    { id: "windows", label: "Windows PC", icon: Monitor },
    { id: "mac", label: "macOS", icon: Apple },
    { id: "ios", label: "iPhone / iPad", icon: Smartphone },
    { id: "android", label: "Android", icon: Smartphone },
  ];

  const isCurrentDevice = currentDevice === selectedDevice;

  return (
    <DashboardLayout>
      {/* Living Aurora Gradient Backdrop matching /settings */}
      <div className="relative pt-3.5 sm:pt-5 min-h-dvh overflow-x-hidden pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 select-none">
        {/* Pure CSS Brand Gradient Backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#F0F5FF]/80 to-[#F0F5FF]" />
        </div>

        {/* Content Container (Standard 1500px Max-Width matching settings page) */}
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-3.5 sm:space-y-5">
          {/* Floating Toast Notification - positioned safely above floating mobile capsule nav */}
          {toastMessage && (
            <div className="fixed bottom-[max(5.5rem,calc(4.5rem+env(safe-area-inset-bottom)))] sm:bottom-6 right-4 sm:right-6 z-50 bg-[#0B132B]/95 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 border border-indigo-500/30 backdrop-blur-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Desktop Layout (hidden lg:block) */}
          <div className="hidden lg:block space-y-6">
            {/* Page Header (Matching Settings & EMI Management) */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0B132B]">
                Install Myvello App
              </h1>
            </div>

          {/* Themed Segmented Tab Control matching settings page with smooth momentum touch scrolling */}
          <div className="p-1 rounded-xl sm:rounded-[8px] bg-white border border-slate-200/80 shadow-2xs flex items-center gap-1 self-start overflow-x-auto no-scrollbar scroll-smooth -webkit-overflow-scrolling-touch max-w-full w-full sm:w-auto">
            {devices.map((d) => {
              const isSelected = selectedDevice === d.id;
              const isUserDevice = currentDevice === d.id;
              const Icon = d.icon;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDevice(d.id)}
                  className={cn(
                    "min-h-[40px] sm:min-h-[34px] px-3.5 py-2 sm:py-1.5 rounded-lg sm:rounded-[6px] text-xs transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap active:scale-95 touch-manipulation",
                    isSelected
                      ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                      : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                  )}
                >
                  <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-slate-400")} />
                  <span>{d.label}</span>
                  {isUserDevice && (
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        isSelected ? "bg-white" : "bg-indigo-600"
                      )}
                      title="Your detected device"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Unified Two-Column Main Layout matching settings page */}
          <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-6">
            {/* Left Column: Main Installation Card & Steps */}
            <div className="flex-1 min-w-0 space-y-5 w-full">
              {/* Hero Spotlight Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
                {/* Header: App Identity & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className="relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white border border-slate-200/90 p-2 sm:p-2.5 flex items-center justify-center shadow-xs shrink-0 ring-4 ring-slate-100/80">
                      <Image
                        src="/icons/icon-192x192.png"
                        alt="Myvello App Icon"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <h2 className="text-lg sm:text-xl font-black text-[#0B132B] truncate">
                        Myvello
                      </h2>
                      <p className="text-xs text-slate-500 font-medium truncate">
                        Personal EMI &amp; Loan Vault
                      </p>
                      <div className="flex items-center gap-2 pt-0.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>4.9</span>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[11px] font-bold text-slate-600">Finance</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          Free PWA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="self-start sm:self-auto">
                    {isCurrentDevice && isInstalled ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Installed &amp; Active</span>
                      </span>
                    ) : isCurrentDevice ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                        <span>Ready to Install</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                        Platform Guide
                      </span>
                    )}
                  </div>
                </div>

                {/* Platform-Specific Action & Content */}
                {selectedDevice === "windows" && (
                  <div className="space-y-4">
                    {isInstalled && isCurrentDevice ? (
                      <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-emerald-950">
                              Myvello is Installed &amp; Ready
                            </h3>
                            <p className="text-xs text-emerald-700 font-medium mt-0.5">
                              Running as a standalone native desktop app on your Windows PC.
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/dashboard"
                          className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] h-11 sm:h-9 px-4 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 touch-manipulation"
                        >
                          <span>Go to Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-indigo-50/70 via-slate-50/40 to-white border border-indigo-100/80 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                              1-Click Windows Installation
                            </h3>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">
                              Pins Myvello directly to your Windows Taskbar and Start Menu.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleInstallClick}
                            className="w-full sm:w-auto min-h-[44px] h-11 sm:h-10 px-5 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
                          >
                            <Download className="w-4 h-4 stroke-[2.5]" />
                            <span>Install on Windows</span>
                          </button>
                        </div>

                        <div className="pt-3 border-t border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>
                            Alternatively, click the install icon <strong>(⊕)</strong> at the right end of your Chrome or Edge address bar.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Step-by-Step Installation Instructions */}
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Installation Steps
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
                            <span className="text-xs font-bold text-slate-900">Click Install</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Click &ldquo;Install on Windows&rdquo; or the ⊕ icon in your browser address bar.
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">2</span>
                            <span className="text-xs font-bold text-slate-900">Confirm Prompt</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Confirm the browser prompt to install Myvello as a native application.
                          </p>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">3</span>
                            <span className="text-xs font-bold text-slate-900">Pin &amp; Launch</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Myvello opens in its own window. Right-click the taskbar icon and select &ldquo;Pin to taskbar&rdquo;.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDevice === "mac" && (
                  <div className="space-y-4">
                    {isInstalled && isCurrentDevice ? (
                      <div className="p-4 sm:p-5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <Check className="w-5 h-5 stroke-[2.5]" />
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-emerald-950">
                              Myvello is Installed on macOS
                            </h3>
                            <p className="text-xs text-emerald-700 font-medium mt-0.5">
                              Running as a standalone native app on your Mac.
                            </p>
                          </div>
                        </div>
                        <Link
                          href="/dashboard"
                          className="w-full sm:w-auto min-h-[44px] sm:min-h-[36px] h-11 sm:h-9 px-4 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 touch-manipulation"
                        >
                          <span>Go to Dashboard</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <span className="text-sm font-bold text-slate-900 block">Chrome, Edge or Brave:</span>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">Install directly into your Applications folder.</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleInstallClick}
                            className="w-full sm:w-auto min-h-[44px] h-11 sm:h-10 px-5 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 shrink-0 active:scale-95 touch-manipulation"
                          >
                            <Download className="w-4 h-4 stroke-[2.5]" />
                            <span>Install on Mac</span>
                          </button>
                        </div>

                        <div className="p-5 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                          <span className="text-sm font-bold text-slate-900 block">Safari on macOS (Sonoma &amp; Sequoia):</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
                            <div className="flex items-center gap-3 p-3.5 sm:p-3 rounded-xl bg-white border border-slate-200/80">
                              <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">1</span>
                              <span>Click <strong>File</strong> in the top Mac menu bar</span>
                            </div>
                            <div className="flex items-center gap-3 p-3.5 sm:p-3 rounded-xl bg-white border border-slate-200/80">
                              <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">2</span>
                              <span>Select <strong>&ldquo;Add to Dock...&rdquo;</strong> and click Add</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedDevice === "ios" && (
                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-50/60 via-slate-50/40 to-white border border-indigo-100/70">
                      <h3 className="text-sm font-bold text-slate-900 mb-1">
                        Safari on iPhone &amp; iPad
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Install in 2 taps directly from Safari (no App Store credentials or downloads needed):
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                      <div className="p-4 sm:p-4.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">1</span>
                          <span className="text-xs font-bold text-slate-900">Tap Share Button</span>
                          <Share2 className="w-4 h-4 text-indigo-600 ml-auto" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Tap the <strong>Share</strong> icon in the bottom Safari navigation bar.
                        </p>
                      </div>

                      <div className="p-4 sm:p-4.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">2</span>
                          <span className="text-xs font-bold text-slate-900">Add to Home Screen</span>
                          <PlusSquare className="w-4 h-4 text-indigo-600 ml-auto" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>, then confirm by tapping <strong>Add</strong>.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedDevice === "android" && (
                  <div className="space-y-4">
                    <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-br from-indigo-50/70 via-slate-50/40 to-white border border-indigo-100/80 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-slate-900">
                            Android Chrome &amp; Samsung Internet
                          </h3>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Instantly add Myvello to your home screen and app launcher.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleInstallClick}
                          className="w-full sm:w-auto min-h-[44px] h-11 sm:h-10 px-5 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
                        >
                          <Download className="w-4 h-4 stroke-[2.5]" />
                          <span>Install on Android</span>
                        </button>
                      </div>

                      <div className="pt-3 border-t border-slate-200/60 text-xs text-slate-500 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        <span>
                          Or tap the three dots <strong>(⋮)</strong> menu in Chrome and select <strong>&ldquo;Install app&rdquo;</strong>.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: System Diagnostics */}
            <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 space-y-5">
              {/* System Diagnostics Card */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0B132B]">
                    <Monitor className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-black tracking-tight text-[#0B132B]">
                      System Diagnostics
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                </div>

                <div className="space-y-2.5 pt-1 text-xs">
                  <div className="p-3.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Detected Platform</span>
                    <span className="font-bold text-slate-900 capitalize flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                      {currentDevice ? `${currentDevice} PC` : "Desktop"}
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Display Mode</span>
                    <span className="font-bold text-slate-900">
                      {isInstalled ? "Standalone App" : "Web Browser"}
                    </span>
                  </div>

                  <div className="p-3.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Service Worker</span>
                    <span className="font-bold text-emerald-700">Active (v1.0)</span>
                  </div>

                  <div className="p-3.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Offline Engine</span>
                    <span className="font-bold text-indigo-700">Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile-First Dedicated Installation Experience (lg:hidden) */}
        <div className="lg:hidden space-y-4">
          {/* 1. Header */}
          <div className="flex items-center justify-between gap-2.5 min-h-[36px]">
            <div className="space-y-0.5 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0B132B] truncate">
                Install App
              </h1>
              {/* <p className="text-[11px] font-bold text-indigo-600 truncate">
                Fast Home Screen Standalone Experience
              </p> */}
            </div>
            {isInstalled && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Installed</span>
              </span>
            )}
          </div>

          {/* 2. Hero App Store Style Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-start gap-4">
              {/* App Icon */}
              <div className="relative w-16 h-16 rounded-2xl bg-white border border-slate-200/90 p-2 flex items-center justify-center shadow-xs shrink-0 ring-4 ring-slate-100/80">
                <Image
                  src="/icons/icon-192x192.png"
                  alt="Myvello App Icon"
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>

              {/* App Title & Metadata */}
              <div className="min-w-0 flex-1">
                <h2 className="text-base font-black text-[#0B132B] truncate">Myvello</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5 truncate">
                  Personal EMI &amp; Loan Vault
                </p>

                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>4.9</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[11px] font-bold text-slate-600">Finance</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    Free PWA
                  </span>
                </div>
              </div>
            </div>

            {/* Install Call to Action */}
            {isCurrentDevice && isInstalled ? (
              <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/90 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-emerald-950 block truncate">
                      Running as Standalone App
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium block">
                      Installed on your home screen.
                    </span>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="px-3.5 py-1.5 rounded-lg btn-gradient-glow text-white text-xs font-bold shrink-0 shadow-xs active:scale-95 transition-all"
                >
                  Dashboard →
                </Link>
              </div>
            ) : selectedDevice === "ios" ? (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("mobile-guide-section");
                    el?.scrollIntoView({ behavior: "smooth" });
                    showToast("Follow the 2 simple Safari steps below to add to Home Screen!");
                  }}
                  className="w-full min-h-[46px] rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <PlusSquare className="w-4 h-4" />
                  <span>Add to Home Screen (2 Taps)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Instant install in Safari • No Apple ID or App Store required
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="w-full min-h-[46px] rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>Install Myvello App</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  Direct browser installation • Fullscreen offline support
                </p>
              </div>
            )}
          </div>

          {/* 3. Platform Selection Pills (Scrollable horizontal bar) */}
          <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
              {devices.map((d) => {
                const isSelected = selectedDevice === d.id;
                const isUserDevice = currentDevice === d.id;
                const Icon = d.icon;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setSelectedDevice(d.id)}
                    className={cn(
                      "min-h-[40px] px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation select-none flex items-center gap-1.5",
                      isSelected
                        ? "bg-[#6366F1] text-white shadow-xs"
                        : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
                    )}
                  >
                    <Icon className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-slate-400")} />
                    <span>{d.label}</span>
                    {isUserDevice && (
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          isSelected ? "bg-white" : "bg-indigo-600"
                        )}
                        title="Detected Device"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Visual Step-by-Step Guide for Selected Platform */}
          <div id="mobile-guide-section" className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                How to Install on {devices.find((d) => d.id === selectedDevice)?.label}
              </h3>
              {isCurrentDevice && (
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  Your Device
                </span>
              )}
            </div>

            {selectedDevice === "ios" && (
              <div className="space-y-3">
                {/* Step 1 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      Tap the Share Button
                      <Share2 className="w-3.5 h-3.5 text-[#007AFF] shrink-0" />
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      In the bottom toolbar of Safari on your iPhone or iPad, tap the square icon with an upward arrow.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      Select &quot;Add to Home Screen&quot;
                      <PlusSquare className="w-3.5 h-3.5 text-slate-800 shrink-0" />
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Scroll through the sharing options and tap <strong>Add to Home Screen</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      Tap &quot;Add&quot; at Top-Right
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Confirm by tapping <strong>Add</strong>. Myvello will immediately appear on your Home Screen!
                    </p>
                  </div>
                </div>

                {/* Safari Visual Helper Pill */}
                <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100/80 flex items-center justify-center gap-2 text-xs font-bold text-indigo-900">
                  <span>Look for</span>
                  <div className="w-6 h-6 rounded-md bg-white border border-indigo-200/80 shadow-2xs flex items-center justify-center text-[#007AFF]">
                    <Share2 className="w-3.5 h-3.5" />
                  </div>
                  <span>in Safari&apos;s bottom bar</span>
                </div>
              </div>
            )}

            {selectedDevice === "android" && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      Tap the &quot;Install Myvello App&quot; Button
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Tap the install button above to trigger the instant browser install banner.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      Confirm Installation
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Tap <strong>Install</strong> on the browser confirmation sheet. Myvello will be added to your app drawer.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-slate-400 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    Alt
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      Chrome 3-Dots Menu
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Alternatively, tap the three dots <strong>(⋮)</strong> at top-right of Chrome and choose <strong>&ldquo;Install app&rdquo;</strong>.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {(selectedDevice === "windows" || selectedDevice === "mac") && (
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      Click the Install Button
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Use Chrome, Edge, or Brave on your computer to install Myvello directly into your applications.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="text-xs font-bold text-slate-900">
                      Address Bar Icon (⊕)
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Look for the install badge icon <strong>(⊕)</strong> on the right side of the browser URL bar.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Why Install Myvello? (App Highlights Grid) */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 px-1">
              Why Install Myvello?
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Instant Launch</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Fullscreen standalone view without browser address bars.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Vault Privacy</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Confidential loan and EMI records stay encrypted locally.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Offline Resilience</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Browse loans and payment histories without active WiFi.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Due Date Alerts</h4>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Never miss an instalment with native reminder notifications.
                </p>
              </div>
            </div>
          </div>

          {/* 6. Compact Diagnostics Status Capsule */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span className="font-bold text-slate-800">
                {currentDevice ? `${currentDevice.toUpperCase()}` : "MOBILE"}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[11px] text-slate-500">
                {isInstalled ? "Standalone App" : "Web Browser"}
              </span>
            </div>
            <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
              PWA Ready
            </span>
          </div>
        </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
