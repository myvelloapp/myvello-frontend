"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Clock,
  Users,
  Bell,
  Settings,
  X,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname();

  const mobileNavLinks = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "EMI Management", href: "/emis", icon: CreditCard },
    { label: "Add New EMI", href: "/emis/new", icon: PlusCircle },
    { label: "Payment History", href: "/payment-history", icon: Clock },
    { label: "Family Workspace", href: "/family", icon: Users },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Slide-out Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={onClose}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 bg-[#0C1222] text-white p-6 shadow-2xl flex flex-col justify-between z-10 animate-slide-right">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center">
                    <span className="font-extrabold text-white text-base">M</span>
                  </div>
                  <span className="text-xl font-bold tracking-tight text-white">myvello</span>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-1">
                {mobileNavLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={onClose}
                      className={cn(
                        "flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors",
                        isActive
                          ? "bg-[#4F46E5] text-white font-semibold"
                          : "text-slate-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="text-xs text-slate-500 pt-6 border-t border-slate-800">
              © 2026 Myvello. All rights reserved.
            </div>
          </div>
        </div>
      )}

      {/* Bottom PWA Mobile Navigation Bar (Always visible on mobile screens) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-2 flex items-center justify-around">
        <Link
          href="/dashboard"
          className={cn(
            "flex flex-col items-center gap-1 text-[11px] font-medium transition-colors py-1",
            pathname === "/dashboard" ? "text-indigo-600 font-bold" : "text-slate-500"
          )}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          href="/emis"
          className={cn(
            "flex flex-col items-center gap-1 text-[11px] font-medium transition-colors py-1",
            pathname.startsWith("/emis") ? "text-indigo-600 font-bold" : "text-slate-500"
          )}
        >
          <CreditCard className="w-5 h-5" />
          <span>EMIs</span>
        </Link>

        <Link
          href="/emis/new"
          className="flex flex-col items-center -mt-5"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#172554] to-[#4F46E5] text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <PlusCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-indigo-700 mt-1">Add</span>
        </Link>

        <Link
          href="/family"
          className={cn(
            "flex flex-col items-center gap-1 text-[11px] font-medium transition-colors py-1",
            pathname.startsWith("/family") ? "text-indigo-600 font-bold" : "text-slate-500"
          )}
        >
          <Users className="w-5 h-5" />
          <span>Family</span>
        </Link>

        <Link
          href="/settings"
          className={cn(
            "flex flex-col items-center gap-1 text-[11px] font-medium transition-colors py-1",
            pathname === "/settings" ? "text-indigo-600 font-bold" : "text-slate-500"
          )}
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </>
  );
}
