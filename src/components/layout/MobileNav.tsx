"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Clock,
  Users,
  Bell,
  Settings,
  X,
  LogOut,
  Smartphone,
  User,
  ChevronDown,
  FileText,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/modules/authentication/AuthContext";
import { BrandLogo } from "@/components/common/BrandLogo";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const [isPwaCardVisible, setIsPwaCardVisible] = useState(true);

  useEffect(() => {
    try {
      const isDismissed = sessionStorage.getItem("myvello_pwa_dismissed_session");
      if (isDismissed === "true") {
        setIsPwaCardVisible(false);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleDismissPwaCard = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPwaCardVisible(false);
    try {
      sessionStorage.setItem("myvello_pwa_dismissed_session", "true");
    } catch {
      // ignore
    }
  };

  const mainNav = [
    {
      label: "EMI Management",
      href: "/emis",
      icon: CreditCard,
      active: pathname.startsWith("/emis"),
    },
    {
      label: "Payment History",
      href: "/payment-history",
      icon: Clock,
      active: pathname === "/payment-history",
    },
  ];

  const accountNav = [
    {
      label: "Documents",
      href: "#",
      icon: FileText,
      active: false,
      badge: "Coming Soon",
    },
    {
      label: "Install App",
      href: "/install",
      icon: Smartphone,
      active: pathname.startsWith("/install"),
    },
    {
      label: "Family Members",
      href: "/family",
      icon: Users,
      active: pathname.startsWith("/family"),
    },
    {
      label: "Notifications",
      href: "/notifications",
      icon: Bell,
      active: pathname === "/notifications",
      badgeCount: unreadCount > 0 ? unreadCount : undefined,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
  ];

  const isEmiActive = pathname.startsWith("/emis");
  const isHistoryActive = pathname === "/payment-history";
  const isNotificationActive = pathname === "/notifications";
  const isFamilyActive = pathname.startsWith("/family");
  const isAccountActive = pathname === "/settings";

  return (
    <>
      {/* Slide-out Mobile Drawer (Clean Light Theme matching Desktop Sidebar) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 sm:w-80 max-w-[85vw] bg-white text-slate-800 border-r border-slate-200/90 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.3)] flex flex-col justify-between z-10 animate-slide-right overflow-y-auto pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] select-none">
            <div className="flex-1 flex flex-col">
              {/* Header with Brand Logo & Close Button */}
              <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
                <BrandLogo className="h-8 w-auto" href="/emis" onClick={onClose} />
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all active:scale-95 touch-manipulation cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Links (Matching Desktop Sidebar) */}
              <div className="px-3 py-3 space-y-1">
                {mainNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-xs transition-all active:scale-[0.98] touch-manipulation",
                        item.active
                          ? "bg-slate-100 text-slate-900 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={cn("w-4 h-4 transition-colors", item.active ? "text-slate-900" : "text-slate-400")} />
                        <span>{item.label}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Account Group with Collapsible Submenu (Matching Desktop Sidebar) */}
              <div className="mt-auto px-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className={cn(
                    "w-full flex items-center justify-between p-2 rounded-[14px] bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all cursor-pointer text-left active:scale-[0.98] touch-manipulation",
                    isAccountOpen && "border-indigo-300 ring-2 ring-indigo-500/10 bg-slate-50/70"
                  )}
                  aria-expanded={isAccountOpen}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8.5 h-8.5 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500/15 border border-white shadow-2xs bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-800 flex items-center justify-center">
                      {user?.profile_photo ? (
                        <Image
                          src={user.profile_photo}
                          alt={user?.name || "Account"}
                          fill
                          unoptimized
                          sizes="34px"
                          className="object-cover"
                        />
                      ) : (
                        <span className="font-black text-xs text-white leading-none">
                          {user?.name ? user.name.charAt(0).toUpperCase() : "J"}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block leading-tight">
                        Account
                      </span>
                      <span className="text-xs font-black text-slate-800 truncate block leading-tight mt-0.5">
                        {user?.name || "Junaid KT"}
                      </span>
                    </div>
                  </div>

                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-slate-400 transition-transform duration-200",
                      isAccountOpen && "rotate-180 text-indigo-600"
                    )}
                  />
                </button>

                {isAccountOpen && (
                  <nav className="mt-1.5 space-y-1 pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {accountNav.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={onClose}
                          className={cn(
                            "flex items-center justify-between px-3 py-2 rounded-[12px] text-xs transition-all active:scale-[0.98] touch-manipulation",
                            item.active
                              ? "bg-slate-100 text-slate-900 font-bold"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={cn("w-4 h-4 transition-colors", item.active ? "text-slate-900" : "text-slate-400")} />
                            <span>{item.label}</span>
                          </div>

                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                              {item.badge}
                            </span>
                          )}

                          {item.badgeCount && (
                            <span className="w-5 h-5 rounded-full text-[10px] font-black bg-[#EF4444] text-white flex items-center justify-center shadow-xs">
                              {item.badgeCount}
                            </span>
                          )}
                        </Link>
                      );
                    })}

                    {/* Logout in Red */}
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(new CustomEvent("myvello:open_logout_modal"));
                          }
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-[12px] text-xs font-semibold text-red-600 hover:bg-red-50/80 transition-all cursor-pointer text-left active:scale-[0.98] touch-manipulation"
                      >
                        <div className="flex items-center gap-2.5">
                          <LogOut className="w-4 h-4 text-red-500" />
                          <span>Log Out</span>
                        </div>
                      </button>
                    </div>
                  </nav>
                )}
              </div>
            </div>

            {/* Bottom PWA Install Banner (Matching Desktop Sidebar) */}
            {isPwaCardVisible && (
              <div className="p-3 animate-in fade-in zoom-in-95 duration-200">
                <div className="relative p-3.5 rounded-[14px] bg-theme-gradient text-white shadow-md shadow-indigo-500/20 space-y-2.5">
                  {/* Close Button Matching Desktop */}
                  <button
                    type="button"
                    onClick={handleDismissPwaCard}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-slate-500 hover:text-slate-800 shadow-sm border border-slate-200/80 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 z-10"
                    aria-label="Dismiss app install banner"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3 stroke-[2.2]" />
                  </button>

                  <Link
                    href="/install"
                    onClick={onClose}
                    className="flex items-start gap-2.5 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white leading-tight">
                        Install Myvello App
                      </h4>
                      <p className="text-[10px] text-white/85 leading-snug mt-0.5">
                        Faster standalone experience on your device.
                      </p>
                    </div>
                  </Link>

                  <Link href="/install" onClick={onClose} className="block w-full">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs rounded-[8px] shadow-xs transition-all cursor-pointer active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-900" strokeWidth={2.5} />
                      <span>Install App</span>
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Instagram-Style Floating Pill Navigation Bar (Mobile & Tablet) */}
      <nav
        className="lg:hidden fixed bottom-[max(0.75rem,calc(0.5rem+env(safe-area-inset-bottom)))] inset-x-3 max-w-[380px] mx-auto z-40 bg-white/85 backdrop-blur-2xl border border-white/70 shadow-[0_12px_40px_-6px_rgba(15,23,42,0.18),0_4px_16px_-2px_rgba(15,23,42,0.08)] rounded-full px-2 py-1.5 flex items-center justify-between select-none"
        aria-label="Mobile Navigation"
      >
        {/* 1st Icon: EMI Management */}
        <Link
          href="/emis"
          className="flex items-center justify-center flex-1 min-w-[44px] min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="EMI Management"
        >
          <div
            className={cn(
              "transition-all flex items-center justify-center",
              isEmiActive
                ? "bg-indigo-50/90 text-indigo-600 rounded-full h-11 w-13 sm:w-15 shadow-2xs border border-indigo-100/60 font-bold"
                : "text-slate-500 hover:text-slate-900 w-11 h-11 rounded-full"
            )}
          >
            <CreditCard className="w-5.5 h-5.5 stroke-[2.2]" />
          </div>
        </Link>

        {/* 2nd Icon: Payment History */}
        <Link
          href="/payment-history"
          className="flex items-center justify-center flex-1 min-w-[44px] min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="Payment History"
        >
          <div
            className={cn(
              "transition-all flex items-center justify-center",
              isHistoryActive
                ? "bg-indigo-50/90 text-indigo-600 rounded-full h-11 w-13 sm:w-15 shadow-2xs border border-indigo-100/60 font-bold"
                : "text-slate-500 hover:text-slate-900 w-11 h-11 rounded-full"
            )}
          >
            <Clock className="w-5.5 h-5.5 stroke-[2.2]" />
          </div>
        </Link>

        {/* 3rd Icon (Center): Notifications with Red Dot */}
        <Link
          href="/notifications"
          className="relative flex items-center justify-center flex-1 min-w-[44px] min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="Notifications"
        >
          <div
            className={cn(
              "transition-all flex items-center justify-center",
              isNotificationActive
                ? "bg-indigo-50/90 text-indigo-600 rounded-full h-11 w-13 sm:w-15 shadow-2xs border border-indigo-100/60 font-bold"
                : "text-slate-500 hover:text-slate-900 w-11 h-11 rounded-full"
            )}
          >
            <div className="relative flex items-center justify-center">
              <Bell className="w-5.5 h-5.5 stroke-[2.2]" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white shadow-2xs" />
              )}
            </div>
          </div>
        </Link>

        {/* 4th Icon: Family Workspace */}
        <Link
          href="/family"
          className="flex items-center justify-center flex-1 min-w-[44px] min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="Family Workspace"
        >
          <div
            className={cn(
              "transition-all flex items-center justify-center",
              isFamilyActive
                ? "bg-indigo-50/90 text-indigo-600 rounded-full h-11 w-13 sm:w-15 shadow-2xs border border-indigo-100/60 font-bold"
                : "text-slate-500 hover:text-slate-900 w-11 h-11 rounded-full"
            )}
          >
            <Users className="w-5.5 h-5.5 stroke-[2.2]" />
          </div>
        </Link>

        {/* 5th Icon: Account (Instagram-Style Avatar Circle) */}
        <Link
          href="/settings"
          className="flex items-center justify-center flex-1 min-w-[44px] min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="Account Settings"
        >
          <div
            className={cn(
              "transition-all flex items-center justify-center",
              isAccountActive
                ? "bg-indigo-50/90 rounded-full h-11 w-13 sm:w-15 shadow-2xs border border-indigo-100/60"
                : "w-11 h-11 rounded-full"
            )}
          >
            <div
              className={cn(
                "w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs transition-all shadow-2xs",
                isAccountActive
                  ? "ring-2 ring-indigo-600 ring-offset-2 ring-offset-white scale-105"
                  : "opacity-85 hover:opacity-100"
              )}
            >
              {user?.profile_photo ? (
                <Image
                  src={user.profile_photo}
                  alt={user?.name || "Account"}
                  width={30}
                  height={30}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center",
                    isAccountActive
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-700"
                  )}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
              )}
            </div>
          </div>
        </Link>
      </nav>
    </>
  );
}
