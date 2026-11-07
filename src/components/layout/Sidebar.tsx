"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Clock,
  FileText,
  Users,
  Bell,
  Settings,
  HelpCircle,
  Smartphone,
  Download,
  ChevronDown,
  Check,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { familyWorkspaces } from "@/lib/mockData";
import { PwaInstallModal } from "@/components/common/PwaInstallModal";

export function Sidebar() {
  const pathname = usePathname();
  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState(familyWorkspaces[0]);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);

  const mainNav = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
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
    {
      label: "Documents",
      href: "#",
      icon: FileText,
      active: false,
      badge: "Coming Soon",
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
      badgeCount: 3,
    },
  ];

  const accountNav = [
    {
      label: "Settings",
      href: "/settings",
      icon: Settings,
      active: pathname === "/settings",
    },
    {
      label: "Help & Support",
      href: "https://www.myvello.life",
      icon: HelpCircle,
      active: false,
      external: true,
    },
  ];

  return (
    <>
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 left-0 z-30 bg-[#0C1222] text-white border-r border-slate-800/80 select-none">
        {/* Brand Header */}
        <div className="h-18 flex items-center px-6 border-b border-slate-800/50">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-md shadow-indigo-900/30">
              <span className="font-extrabold text-white text-base tracking-tighter">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white flex items-center">
              myvello
            </span>
          </Link>
        </div>

        {/* Family Workspace Selector */}
        <div className="px-4 py-4 relative">
          <button
            onClick={() => setIsFamilyDropdownOpen(!isFamilyDropdownOpen)}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Users className="w-3.5 h-3.5" />
              </div>
              <span className="truncate">{selectedFamily.name}</span>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform shrink-0",
                isFamilyDropdownOpen && "rotate-180"
              )}
            />
          </button>

          {/* Family Switcher Dropdown */}
          {isFamilyDropdownOpen && (
            <div className="absolute top-16 left-4 right-4 z-40 bg-[#141C33] border border-slate-700/80 rounded-xl shadow-xl p-1.5 space-y-1">
              <div className="px-2 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Workspaces
              </div>
              {familyWorkspaces.map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    setSelectedFamily(f);
                    setIsFamilyDropdownOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium text-left transition-colors",
                    selectedFamily.id === f.id
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-white/5"
                  )}
                >
                  <span className="truncate">{f.name}</span>
                  {selectedFamily.id === f.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
              <div className="pt-1 border-t border-slate-700/60">
                <Link
                  href="/family/setup"
                  onClick={() => setIsFamilyDropdownOpen(false)}
                  className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-indigo-400 hover:bg-white/5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Workspace</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Main Navigation */}
        <div className="flex-1 px-3 space-y-6 overflow-y-auto py-2">
          <nav className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group",
                    item.active
                      ? "bg-[#4F46E5] text-white shadow-md shadow-indigo-950/40 font-semibold"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        item.active ? "text-white" : "text-slate-400 group-hover:text-white"
                      )}
                    />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-indigo-200">
                      {item.badge}
                    </span>
                  )}

                  {item.badgeCount && (
                    <span className="w-5 h-5 rounded-full text-[10px] font-bold bg-[#EF4444] text-white flex items-center justify-center">
                      {item.badgeCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Account Group */}
          <div>
            <div className="px-3 pb-2 text-[10px] uppercase font-bold tracking-wider text-slate-500">
              Account
            </div>
            <nav className="space-y-1">
              {accountNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group",
                      item.active
                        ? "bg-[#4F46E5] text-white font-semibold"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom PWA Install Card Matching Screenshot */}
        <div className="p-4 border-t border-slate-800/60">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-indigo-900/40 border border-indigo-500/20 space-y-2.5">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">Install Myvello App</h4>
                <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                  Add to your home screen for a faster experience.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsPwaModalOpen(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-slate-100 text-[#0C1222] font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Install App
            </button>
          </div>
        </div>
      </aside>

      {/* PWA Modal */}
      <PwaInstallModal
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
      />
    </>
  );
}
