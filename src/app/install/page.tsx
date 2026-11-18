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
  Sparkles,
  WifiOff,
  ChevronRight,
  Info,
  HelpCircle,
  Laptop,
} from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useAuth } from "@/modules/authentication/AuthContext";
import { cn } from "@/lib/utils";

type DeviceType = "windows" | "mac" | "ios" | "android";

export default function InstallPage() {
  const { user, isAuthenticated } = useAuth();
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
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Universal Top Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <BrandLogo className="h-9 w-auto" />
            <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
              <Link href="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <Link href="/#features" className="hover:text-indigo-600 transition-colors">
                Features
              </Link>
              <Link href="/#security" className="hover:text-indigo-600 transition-colors">
                Security &amp; Free
              </Link>
              <Link href="/#faq" className="hover:text-indigo-600 transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Link
                href="/emis"
                className="h-9 px-4 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 active:scale-95 touch-manipulation"
              >
                <span>Go to Dashboard</span>
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
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#0B132B]/95 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 border border-indigo-500/30 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Hero Section */}
        <section className="relative overflow-hidden py-10 sm:py-16 border-b border-slate-200/60 bg-gradient-to-b from-white via-indigo-50/20 to-[#F8FAFC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Next-Generation Progressive Web App (PWA)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#0B132B] leading-tight">
                Install Myvello on{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#8B5CF6]">
                  Any Device
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
                No app store accounts or large downloads needed. Install Myvello directly from your browser in seconds for offline access, instant launch, and zero storage clutter (&lt;2MB).
              </p>

              {/* OS Selector Tabs */}
              <div className="pt-4 flex justify-center">
                <div className="p-1 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-1 overflow-x-auto max-w-full">
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
                          "min-h-[40px] px-4 py-2 rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap active:scale-95 touch-manipulation",
                          isSelected
                            ? "btn-gradient-glow text-white font-bold shadow-xs shadow-emerald-500/25"
                            : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                        )}
                      >
                        <Icon className={cn("w-4 h-4", isSelected ? "text-white" : "text-slate-400")} />
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
            </div>
          </div>
        </section>

        {/* Installation Instructions & App Card Container */}
        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
            {/* Spotlight Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              {/* Header: App Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-white border border-slate-200/90 p-2.5 flex items-center justify-center shadow-xs shrink-0 ring-4 ring-slate-100/80">
                    <Image
                      src="/icons/icon-192x192.png"
                      alt="Myvello App Icon"
                      width={64}
                      height={64}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-black text-[#0B132B]">Myvello</h2>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                        100% Free
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">
                      Smart Multi-Bank Loan &amp; EMI Manager
                    </p>
                    <div className="flex items-center gap-2 pt-0.5 text-[11px] font-bold text-slate-500">
                      <span className="inline-flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>4.9</span>
                      </span>
                      <span>•</span>
                      <span>Bank-Grade Security</span>
                      <span>•</span>
                      <span className="text-indigo-600 font-semibold">Under 2MB</span>
                    </div>
                  </div>
                </div>

                <div>
                  {isCurrentDevice && isInstalled ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Installed &amp; Active</span>
                    </span>
                  ) : isCurrentDevice ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                      <span>Ready to Install</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-50 text-slate-600 border border-slate-200">
                      Platform Guide
                    </span>
                  )}
                </div>
              </div>

              {/* Platform-Specific Step Content */}
              {/* 1. WINDOWS */}
              {selectedDevice === "windows" && (
                <div className="space-y-5">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50/40 to-white border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#0B132B]">
                        1-Click Windows Installation
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Pins Myvello directly to your Windows Taskbar and Start Menu.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="min-h-[44px] px-6 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Install on Windows</span>
                    </button>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Quick 3-Step Setup
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">1</span>
                          <span className="text-xs font-bold text-slate-900">Click Install</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Click &ldquo;Install on Windows&rdquo; above or the ⊕ icon on the right edge of your browser URL bar.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">2</span>
                          <span className="text-xs font-bold text-slate-900">Confirm Prompt</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Confirm the dialog to install Myvello as a native standalone desktop app.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">3</span>
                          <span className="text-xs font-bold text-slate-900">Pin to Taskbar</span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Right-click the Myvello app icon on your Windows Taskbar and select &ldquo;Pin to taskbar&rdquo;.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. MACOS */}
              {selectedDevice === "mac" && (
                <div className="space-y-5">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50/40 to-white border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#0B132B]">
                        Chrome, Edge or Brave on Mac
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Install directly into your Applications folder and macOS Dock.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="min-h-[44px] px-6 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Install on Mac</span>
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                    <span className="text-xs font-bold text-slate-900 block">
                      Using Safari on macOS (Sonoma &amp; Sequoia):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">1</span>
                        <span>Click <strong>File</strong> in the top Apple menu bar</span>
                      </div>
                      <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/80">
                        <span className="w-6 h-6 rounded-md bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">2</span>
                        <span>Select <strong>&ldquo;Add to Dock...&rdquo;</strong> and click Add</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. IOS (IPHONE / IPAD) */}
              {selectedDevice === "ios" && (
                <div className="space-y-5">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50/40 to-white border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-[#0B132B]">
                          Direct iOS App Installation (No App Store Needed)
                        </h3>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                          100% Free
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        Installs the full standalone Myvello app directly to your iPhone Home Screen. Opens directly to Login &amp; Dashboard without any browser bars or marketing pages.
                      </p>
                    </div>

                    <a
                      href="/api/ios-profile"
                      className="min-h-[44px] px-6 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Download iOS App Profile</span>
                    </a>
                  </div>

                  {/* Method 1: Safari Add to Home Screen (Instant 2-tap) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Method 1: Instant Add from Safari (2 Taps)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">1</span>
                          <span className="text-sm font-bold text-slate-900">Tap the Share Button</span>
                          <Share2 className="w-4 h-4 text-indigo-600 ml-auto" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Tap the <strong>Share</strong> icon (the square with an arrow pointing up) in the bottom Safari toolbar.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">2</span>
                          <span className="text-sm font-bold text-slate-900">Add to Home Screen</span>
                          <PlusSquare className="w-4 h-4 text-indigo-600 ml-auto" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Scroll down and tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>, then confirm by tapping <strong>Add</strong> in the top-right corner.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Method 2: Download Configuration Profile Guide */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span className="w-2 h-2 rounded-full bg-indigo-600" />
                      <span>How Profile Installation Works:</span>
                    </div>
                    <p className="leading-relaxed text-slate-500">
                      1. Tap <strong>Download iOS App Profile</strong> above and tap <strong>Allow</strong> &bull; 
                      2. Open your iPhone <strong>Settings</strong> &bull; 
                      3. Tap <strong>&ldquo;Profile Downloaded&rdquo;</strong> at the top &bull; 
                      4. Tap <strong>Install</strong> in the top-right corner.
                    </p>
                    <p className="text-[11px] text-slate-400 font-medium pt-1 border-t border-slate-200/60">
                      ✨ Launches directly to Login/Signup, never expires, runs full screen without Safari bars, and requires zero App Store fees.
                    </p>
                  </div>
                </div>
              )}

              {/* 4. ANDROID */}
              {selectedDevice === "android" && (
                <div className="space-y-5">
                  <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-indigo-50/70 via-slate-50/40 to-white border border-indigo-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-[#0B132B]">
                        Android Chrome &amp; Samsung Internet
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        Instantly add Myvello to your home screen and native app drawer.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleInstallClick}
                      className="min-h-[44px] px-6 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-2 shrink-0"
                    >
                      <Download className="w-4 h-4 stroke-[2.5]" />
                      <span>Install on Android</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                    <span>
                      Alternatively, tap the three dots <strong>(⋮)</strong> in Chrome and select <strong>&ldquo;Install app&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Why PWA / Benefits Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Zap className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-bold text-[#0B132B]">Instant Launch (&lt;0.5s)</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Opens instantaneously without waiting for slow web pages or heavy app frameworks.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <WifiOff className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-bold text-[#0B132B]">Offline Capable</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Review your loan schedules and payment history even when your mobile signal drops.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-2">
                <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                  <Lock className="w-5 h-5 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-bold text-[#0B132B]">Zero Bloatware (&lt;2MB)</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Saves your phone storage. No 150MB store downloads, automatic background updates.
                </p>
              </div>
            </div>

            {/* Bottom Action CTA */}
            <div className="bg-gradient-to-r from-[#0B132B] via-[#172554] to-[#1e1b4b] rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div className="space-y-1.5 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-bold">
                  Ready to simplify your family&apos;s loans?
                </h3>
                <p className="text-xs text-slate-300">
                  Create your free private account in less than 30 seconds.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={isAuthenticated ? "/emis" : "/register"}
                  className="h-11 px-6 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all hover:scale-102 active:scale-95 touch-manipulation"
                >
                  <span>{isAuthenticated ? "Open Dashboard" : "Get Started Free"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <BrandLogo className="h-6 w-auto" />
            <span>© {new Date().getFullYear()} Myvello. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <Link href="/" className="hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/login" className="hover:text-indigo-600 transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-indigo-600 transition-colors">
              Register Free
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
