"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  Clock,
  FileText,
  Users,
  Bell,
  Settings,
  Smartphone,
  Download,
  ChevronDown,
  Check,
  Plus,
  LogOut,
  X,
} from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/common/BrandLogo";
import { useNotifications } from "@/context/NotificationContext";
import { useAuth } from "@/modules/authentication/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MemberAvatarStack } from "@/components/common/MemberAvatarStack";

const PwaInstallModal = dynamic(
  () => import("@/components/common/PwaInstallModal").then((mod) => mod.PwaInstallModal),
  { ssr: false }
);

interface SidebarNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: string;
  badgeCount?: number;
}

export function Sidebar() {
  const pathname = usePathname();
  const { user: authUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { activeWorkspace, workspaces, switchWorkspace } = useWorkspace();
  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isPwaCardVisible, setIsPwaCardVisible] = useState(true);
  const familyDropdownRef = useRef<HTMLDivElement>(null);

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

  const displayName = authUser?.name || "Junaid KT";
  const avatarUrl = authUser?.profile_photo || null;
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    setAvatarError(false);
  }, [authUser?.profile_photo]);

  const initialLetter = (displayName || "J").trim().charAt(0).toUpperCase();

  const isAccountPageActive =
    pathname.startsWith("/family") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/install");

  const [isAccountOpen, setIsAccountOpen] = useState(isAccountPageActive);

  // Auto-expand when navigating to any account/profile route
  useEffect(() => {
    if (isAccountPageActive) {
      setIsAccountOpen(true);
    }
  }, [isAccountPageActive]);

  // Close family dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        familyDropdownRef.current &&
        !familyDropdownRef.current.contains(e.target as Node)
      ) {
        setIsFamilyDropdownOpen(false);
      }
    };
    if (isFamilyDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isFamilyDropdownOpen]);

  const mainNav: SidebarNavItem[] = [
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

  const accountNav: SidebarNavItem[] = [
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

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 bg-white text-slate-800 border-r border-slate-100 shadow-xs select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <BrandLogo className="h-9 w-auto" href="/emis" />
        </div>

        {/* Workspace & Vault Selector */}
        <div ref={familyDropdownRef} className="px-3.5 py-3 relative">
          <button
            type="button"
            onClick={() => setIsFamilyDropdownOpen(!isFamilyDropdownOpen)}
            className={cn(
              "w-full flex items-center justify-between p-2 rounded-[14px] bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all cursor-pointer group text-left",
              isFamilyDropdownOpen && "border-indigo-300 ring-2 ring-indigo-500/10 bg-slate-50/70"
            )}
            title="Switch Workspace"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <MemberAvatarStack
                members={activeWorkspace.members_preview}
                count={activeWorkspace.members_count}
                type={activeWorkspace.type}
                size="md"
              />
              <div className="min-w-0 text-left">
                <span className="font-extrabold text-slate-900 text-xs block truncate leading-tight">
                  {activeWorkspace.name}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 block leading-tight mt-0.5 truncate">
                  {activeWorkspace.subtitle}
                </span>
              </div>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform shrink-0 ml-1.5",
                isFamilyDropdownOpen && "rotate-180 text-indigo-600"
              )}
            />
          </button>

          {/* Workspace Switcher Popover */}
          {isFamilyDropdownOpen && (
            <div className="absolute top-15 left-3.5 right-3.5 z-40 bg-white border border-slate-200/90 rounded-[16px] shadow-[0_16px_36px_-6px_rgba(15,23,42,0.18),0_4px_12px_-2px_rgba(15,23,42,0.08)] p-2 space-y-1 animate-fade-in">
              <div className="flex items-center justify-between px-2.5 py-1 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                <span>WORKSPACES</span>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {workspaces.length} ACTIVE
                </span>
              </div>

              <div className="space-y-1 pt-0.5 max-h-60 overflow-y-auto">
                {workspaces.map((w) => {
                  const isSelected = activeWorkspace.id === w.id;
                  return (
                    <button
                      key={String(w.id)}
                      type="button"
                      onClick={() => {
                        switchWorkspace(w.id);
                        setIsFamilyDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2 rounded-[12px] text-xs transition-all cursor-pointer group text-left",
                        isSelected
                          ? "bg-theme-gradient text-white shadow-md shadow-indigo-500/20"
                          : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MemberAvatarStack
                          members={w.members_preview}
                          count={w.members_count}
                          type={w.type}
                          size="sm"
                          ringClass={isSelected ? "ring-2 ring-white/50" : "ring-2 ring-white"}
                        />
                        <div className="min-w-0">
                          <span
                            className={cn(
                              "truncate block text-xs",
                              isSelected
                                ? "font-black text-white"
                                : "font-bold text-slate-800 group-hover:text-slate-900"
                            )}
                          >
                            {w.name}
                          </span>
                          <span
                            className={cn(
                              "text-[10px] block -mt-0.5 truncate",
                              isSelected ? "text-white/80 font-medium" : "text-slate-400 font-medium"
                            )}
                          >
                            {w.subtitle}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-white/25 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white stroke-[2.5]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1.5 mt-1 border-t border-slate-100 space-y-1">
                <Link
                  href="/family/setup"
                  onClick={() => setIsFamilyDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-[10px] text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50/70 transition-all group"
                >
                  <div className="w-7 h-7 rounded-[8px] bg-indigo-50 group-hover:bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80 transition-colors">
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-xs text-indigo-600 group-hover:text-indigo-700">
                      Create Workspace
                    </span>
                    <span className="text-[10px] font-normal text-slate-400">
                      Add family or team vault
                    </span>
                  </div>
                </Link>

                <Link
                  href="/family"
                  onClick={() => setIsFamilyDropdownOpen(false)}
                  className="w-full flex items-center gap-2.5 p-2 rounded-[10px] text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all group"
                >
                  <div className="w-6 h-6 rounded-[6px] bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-semibold text-xs text-slate-600 group-hover:text-slate-900">
                    Manage Family Members
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation Viewport */}
        <div className="flex-1 px-3 flex flex-col justify-between overflow-y-auto py-3">
          {/* Top Main Navigation */}
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-[8px] text-xs transition-all group",
                    item.active
                      ? "bg-slate-100 text-slate-900 font-bold"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        item.active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-800"
                      )}
                    />
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
          </nav>

          {/* Account Group with Collapsible Profile Section */}
          <div className="mt-auto pt-3 border-t border-slate-100 -mx-3 px-3">
            {/* Interactive Collapsible Header */}
            <button
              type="button"
              onClick={() => setIsAccountOpen((prev) => !prev)}
              className={cn(
                "w-full flex items-center justify-between p-2 rounded-[14px] bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs transition-all cursor-pointer text-left group",
                (isAccountOpen || isAccountPageActive) &&
                  "border-indigo-300 ring-2 ring-indigo-500/10 bg-slate-50/70"
              )}
              aria-expanded={isAccountOpen}
              aria-label="Toggle profile and account menu"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-8.5 h-8.5 rounded-full overflow-hidden shrink-0 ring-2 ring-indigo-500/15 border border-white shadow-2xs bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-800 flex items-center justify-center">
                  {avatarUrl && !avatarError ? (
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      fill
                      unoptimized
                      sizes="34px"
                      className="object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="font-black text-xs text-white select-none leading-none tracking-tight">
                      {initialLetter}
                    </span>
                  )}
                </div>

                <div className="min-w-0">
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block leading-tight">
                    Account
                  </span>
                  <span className="text-xs font-black text-slate-800 group-hover:text-indigo-600 transition-colors block truncate leading-tight mt-0.5">
                    {displayName}
                  </span>
                </div>
              </div>

              <div className="flex items-center pl-2 shrink-0">
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-transform duration-200",
                    isAccountOpen && "rotate-180 text-indigo-600"
                  )}
                />
              </div>
            </button>

            {/* Collapsible Sub-menu */}
            {isAccountOpen && (
              <nav className="mt-1.5 space-y-1 pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                {accountNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 rounded-[14px] text-xs transition-all group",
                        item.active
                          ? "bg-slate-100 text-slate-900 font-bold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            item.active ? "text-slate-900" : "text-slate-400 group-hover:text-slate-800"
                          )}
                        />
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

                {/* Logout Action in Red */}
                <div className="pt-1 mt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.dispatchEvent(
                          new CustomEvent("myvello:open_logout_modal")
                        );
                      }
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-[14px] text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-all group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-2.5">
                      <LogOut className="w-4 h-4 text-red-500 group-hover:text-red-600 transition-colors" />
                      <span>Log Out</span>
                    </div>
                  </button>
                </div>
              </nav>
            )}
          </div>
        </div>

        {/* Bottom PWA Install Card Matching Screenshot */}
        {isPwaCardVisible && (
          <div className="p-3 pb-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="relative p-4 rounded-[8px] bg-theme-gradient text-white shadow-lg shadow-indigo-500/20 space-y-3">
              {/* Close Button Matching Screenshot */}
              <button
                type="button"
                onClick={handleDismissPwaCard}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white text-slate-500 hover:text-slate-800 shadow-sm border border-slate-200/80 flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 z-10"
                aria-label="Dismiss app install banner"
                title="Dismiss"
              >
                <X className="w-3 h-3 stroke-[2.2]" />
              </button>

              <Link href="/install" className="flex items-start gap-2.5 group/card cursor-pointer">
                <div className="w-8 h-8 rounded-[10px] bg-white/20 backdrop-blur-xs text-white flex items-center justify-center shrink-0 mt-0.5 group-hover/card:scale-105 transition-transform">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-white leading-tight group-hover/card:underline">
                    Install Myvello App
                  </h4>
                  <p className="text-[10px] text-white/85 leading-snug mt-0.5">
                    Add to your home screen for a faster experience.
                  </p>
                </div>
              </Link>

              <Link href="/install" className="block w-full">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs rounded-[8px] shadow-xs transition-all cursor-pointer active:scale-[0.99]"
                >
                  <Download className="w-3.5 h-3.5 text-slate-900" strokeWidth={2.5} />
                  <span>Install App</span>
                </button>
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* PWA Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />
    </>
  );
}
