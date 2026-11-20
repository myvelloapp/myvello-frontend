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

interface MobileNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: string;
  badgeCount?: number;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const { unreadCount } = useNotifications();
  const { user } = useAuth();
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const [isPwaCardVisible, setIsPwaCardVisible] = useState(true);
  const [isCompact, setIsCompact] = useState(false);

  // Instagram-style scroll listener: shrink navigation on scroll down, expand on scroll up
  useEffect(() => {
    let lastScrollY = typeof window !== "undefined" ? window.scrollY : 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = Math.max(0, window.scrollY);

          // If near top of page, always keep normal full size
          if (currentScrollY <= 30) {
            setIsCompact(false);
          } else {
            const diff = currentScrollY - lastScrollY;
            // Scroll down past threshold -> shrink compact
            if (diff > 8 && currentScrollY > 50) {
              setIsCompact(true);
            }
            // Scroll up -> restore normal size
            else if (diff < -8) {
              setIsCompact(false);
            }
          }

          lastScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Reset to normal when route changes
  useEffect(() => {
    setIsCompact(false);
  }, [pathname]);

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

  const mainNav: MobileNavItem[] = [
    {
      label: "EMI Management",
      href: "/emis",
      icon: CreditCard,
      active: pathname.startsWith("/emis"),
    },
    {
      label: "Documents",
      href: "#",
      icon: FileText,
      active: false,
      badge: "Coming Soon",
    },
  ];

  const accountNav: MobileNavItem[] = [
    {
      label: "Groups",
      href: "/family",
      icon: Users,
      active: pathname.startsWith("/family"),
    },
    {
      label: "Payment History",
      href: "/payment-history",
      icon: Clock,
      active: pathname === "/payment-history",
    },
    {
      label: "Reminders",
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
                      onClick={(e) => {
                        if (item.href === "#") {
                          e.preventDefault();
                        }
                        onClose();
                      }}
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

                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">
                          {item.badge}
                        </span>
                      )}
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
                    isAccountOpen && "border-emerald-300 ring-2 ring-emerald-500/15 bg-slate-50/70"
                  )}
                  aria-expanded={isAccountOpen}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative w-8.5 h-8.5 rounded-full overflow-hidden shrink-0 ring-2 ring-emerald-500/20 border border-white shadow-2xs bg-gradient-to-tr from-[#1C9E30] to-[#005E35] flex items-center justify-center">
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
                      isAccountOpen && "rotate-180 text-emerald-700"
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
                <div className="relative p-3.5 rounded-[14px] card-gradient-vibrant text-white shadow-[0_8px_24px_-4px_rgba(16,185,129,0.28)] space-y-2.5 border border-white/40">
                  {/* Close Button Matching Desktop */}
                  <button
                    type="button"
                    onClick={handleDismissPwaCard}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-slate-500 hover:text-slate-800 shadow-md border border-slate-200/90 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 z-10"
                    aria-label="Dismiss app install banner"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3 stroke-[2.4]" />
                  </button>

                  <Link
                    href="/install"
                    onClick={onClose}
                    className="flex items-start gap-2.5 group cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-[10px] bg-white/20 backdrop-blur-md text-white flex items-center justify-center shrink-0 mt-0.5 border border-white/30 shadow-2xs">
                      <Smartphone className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white leading-tight drop-shadow-[0_1px_2px_rgba(0,35,20,0.5)]">
                        Install Myvello App
                      </h4>
                      <p className="text-[10px] text-white/95 font-medium leading-snug mt-0.5 drop-shadow-[0_1px_2px_rgba(0,35,20,0.4)]">
                        Faster standalone experience on your device.
                      </p>
                    </div>
                  </Link>

                  <Link href="/install" onClick={onClose} className="block w-full">
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-emerald-50 text-[#02361B] font-black text-xs rounded-[8px] shadow-sm transition-all cursor-pointer active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5 text-[#1C9E30]" strokeWidth={2.5} />
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
        className={cn(
          "lg:hidden fixed inset-x-3 sm:inset-x-4 mx-auto z-40 bg-white/95 backdrop-blur-2xl border border-white/80 rounded-full flex items-center justify-between select-none transition-all duration-300 ease-out will-change-[transform,max-width,padding,bottom]",
          isCompact
            ? "bottom-[max(12px,calc(12px+env(safe-area-inset-bottom)))] max-w-[286px] px-1.5 py-1 shadow-[0_8px_24px_-4px_rgba(15,23,42,0.14),0_2px_8px_-2px_rgba(15,23,42,0.06)]"
            : "bottom-[max(18px,calc(18px+env(safe-area-inset-bottom)))] max-w-[364px] px-2 py-1.5 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.16),0_4px_16px_-2px_rgba(15,23,42,0.08)]"
        )}
        aria-label="Mobile Navigation"
      >
        {/* 1st Icon: EMI Management */}
        <Link
          href="/emis"
          className="flex items-center justify-center flex-1 min-w-[38px] min-h-[38px] sm:min-w-[44px] sm:min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="EMI Management"
        >
          <div
            className={cn(
              "transition-all duration-300 flex items-center justify-center",
              isEmiActive
                ? cn(
                    "bg-emerald-50 text-emerald-800 rounded-full shadow-2xs border border-emerald-200/60 font-bold",
                    isCompact ? "h-8.5 w-10.5 sm:w-11" : "h-11 w-13 sm:w-15"
                  )
                : cn(
                    "text-slate-500 hover:text-slate-900 rounded-full",
                    isCompact ? "w-8.5 h-8.5" : "w-11 h-11"
                  )
            )}
          >
            <CreditCard
              className={cn(
                "stroke-[2.2] transition-all duration-300",
                isCompact ? "w-4.5 h-4.5" : "w-5.5 h-5.5"
              )}
            />
          </div>
        </Link>

        {/* 2nd Icon: Payment History */}
        <Link
          href="/payment-history"
          className="flex items-center justify-center flex-1 min-w-[38px] min-h-[38px] sm:min-w-[44px] sm:min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="Payment History"
        >
          <div
            className={cn(
              "transition-all duration-300 flex items-center justify-center",
              isHistoryActive
                ? cn(
                    "bg-emerald-50 text-emerald-800 rounded-full shadow-2xs border border-emerald-200/60 font-bold",
                    isCompact ? "h-8.5 w-10.5 sm:w-11" : "h-11 w-13 sm:w-15"
                  )
                : cn(
                    "text-slate-500 hover:text-slate-900 rounded-full",
                    isCompact ? "w-8.5 h-8.5" : "w-11 h-11"
                  )
            )}
          >
            <Clock
              className={cn(
                "stroke-[2.2] transition-all duration-300",
                isCompact ? "w-4.5 h-4.5" : "w-5.5 h-5.5"
              )}
            />
          </div>
        </Link>

        {/* 3rd Icon (Center): Notifications with Red Dot */}
        <Link
          href="/notifications"
          className="relative flex items-center justify-center flex-1 min-w-[38px] min-h-[38px] sm:min-w-[44px] sm:min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="Notifications"
        >
          <div
            className={cn(
              "transition-all duration-300 flex items-center justify-center",
              isNotificationActive
                ? cn(
                    "bg-emerald-50 text-emerald-800 rounded-full shadow-2xs border border-emerald-200/60 font-bold",
                    isCompact ? "h-8.5 w-10.5 sm:w-11" : "h-11 w-13 sm:w-15"
                  )
                : cn(
                    "text-slate-500 hover:text-slate-900 rounded-full",
                    isCompact ? "w-8.5 h-8.5" : "w-11 h-11"
                  )
            )}
          >
            <div className="relative flex items-center justify-center">
              <Bell
                className={cn(
                  "stroke-[2.2] transition-all duration-300",
                  isCompact ? "w-4.5 h-4.5" : "w-5.5 h-5.5"
                )}
              />
              {unreadCount > 0 && (
                <span
                  className={cn(
                    "absolute rounded-full bg-rose-500 ring-2 ring-white shadow-2xs transition-all duration-300",
                    isCompact
                      ? "-top-0.5 -right-0.5 w-2 h-2"
                      : "-top-0.5 -right-0.5 w-2.5 h-2.5"
                  )}
                />
              )}
            </div>
          </div>
        </Link>

        {/* 4th Icon: Groups Workspace */}
        <Link
          href="/family"
          className="flex items-center justify-center flex-1 min-w-[38px] min-h-[38px] sm:min-w-[44px] sm:min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="Groups"
        >
          <div
            className={cn(
              "transition-all duration-300 flex items-center justify-center",
              isFamilyActive
                ? cn(
                    "bg-emerald-50 text-emerald-800 rounded-full shadow-2xs border border-emerald-200/60 font-bold",
                    isCompact ? "h-8.5 w-10.5 sm:w-11" : "h-11 w-13 sm:w-15"
                  )
                : cn(
                    "text-slate-500 hover:text-slate-900 rounded-full",
                    isCompact ? "w-8.5 h-8.5" : "w-11 h-11"
                  )
            )}
          >
            <Users
              className={cn(
                "stroke-[2.2] transition-all duration-300",
                isCompact ? "w-4.5 h-4.5" : "w-5.5 h-5.5"
              )}
            />
          </div>
        </Link>

        {/* 5th Icon: Account (Instagram-Style Avatar Circle) */}
        <Link
          href="/settings"
          className="flex items-center justify-center flex-1 min-w-[38px] min-h-[38px] sm:min-w-[44px] sm:min-h-[44px] touch-manipulation active:scale-90 transition-transform"
          aria-label="Account Settings"
        >
          <div
            className={cn(
              "transition-all duration-300 flex items-center justify-center",
              isAccountActive
                ? cn(
                    "bg-emerald-50 rounded-full shadow-2xs border border-emerald-200/60",
                    isCompact ? "h-8.5 w-10.5 sm:w-11" : "h-11 w-13 sm:w-15"
                  )
                : cn(
                    "rounded-full",
                    isCompact ? "w-8.5 h-8.5" : "w-11 h-11"
                  )
            )}
          >
            <div
              className={cn(
                "rounded-full overflow-hidden flex items-center justify-center font-bold text-xs transition-all duration-300 shadow-2xs",
                isCompact ? "w-6 h-6" : "w-7 h-7 sm:w-7.5 sm:h-7.5",
                isAccountActive
                  ? "ring-2 ring-emerald-600 ring-offset-2 ring-offset-white scale-105"
                  : "opacity-85 hover:opacity-100"
              )}
            >
              {user?.profile_photo ? (
                <Image
                  src={user.profile_photo}
                  alt={user?.name || "Account"}
                  width={isCompact ? 24 : 30}
                  height={isCompact ? 24 : 30}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "w-full h-full flex items-center justify-center",
                    isAccountActive
                      ? "bg-[#1C9E30] text-white"
                      : "bg-slate-200 text-slate-700"
                  )}
                >
                  {user?.name ? (
                    user.name.charAt(0).toUpperCase()
                  ) : (
                    <User className={isCompact ? "w-3.5 h-3.5" : "w-4 h-4"} />
                  )}
                </div>
              )}
            </div>
          </div>
        </Link>
      </nav>
    </>
  );
}
