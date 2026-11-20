"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Users, Clock, Settings, User } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/modules/authentication/AuthContext";
import { cn } from "@/lib/utils";
import FamilyPage from "@/app/(dashboard)/family/page";
import PaymentHistoryPage from "@/app/(dashboard)/payment-history/page";
import SettingsPage from "@/app/(dashboard)/settings/page";

type AccountTab = "group" | "history" | "settings";

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const tabParam = searchParams.get("tab") as AccountTab | null;
  const initialTab: AccountTab =
    tabParam === "history"
      ? "history"
      : tabParam === "settings"
      ? "settings"
      : "group";

  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);

  // Sync state if URL query param changes
  useEffect(() => {
    if (tabParam && (tabParam === "group" || tabParam === "history" || tabParam === "settings")) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (newTab: AccountTab) => {
    setActiveTab(newTab);
    router.replace(`/account?tab=${newTab}`, { scroll: false });
  };

  return (
    <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
      <div className="relative z-10 max-w-[1500px] mx-auto space-y-3.5 sm:space-y-5">
        {/* Account Header (Mobile only, hidden on desktop where sidebar navigation already provides context) */}
        <div className="lg:hidden flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#02361B] truncate">
              Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate">
              Manage your groups, payment history, and preferences
            </p>
          </div>

          {/* Quick Profile Summary Badge */}
          <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-2xs shrink-0">
            <div className="w-7 h-7 sm:w-7.5 sm:h-7.5 rounded-full overflow-hidden bg-gradient-to-tr from-[#1C9E30] to-[#005E35] text-white flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/20 shrink-0">
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
                <span>{user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}</span>
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[140px]">
                {user?.name || "Account"}
              </p>
              <p className="text-[10px] text-slate-400 leading-tight truncate max-w-[140px]">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>

        {/* Themed Segmented Tab Control (Mobile only, hidden on desktop where sidebar navigation is used) */}
        <div className="lg:hidden p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-1 w-full sm:w-auto">
          {/* Tab 1: My Group */}
          <button
            type="button"
            onClick={() => handleTabChange("group")}
            className={cn(
              "flex-1 sm:flex-initial min-h-[38px] px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 touch-manipulation select-none outline-none focus:outline-none focus-visible:outline-none",
              activeTab === "group"
                ? "btn-gradient-glow text-white font-bold shadow-xs shadow-emerald-500/25"
                : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
            )}
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="font-bold whitespace-nowrap">My Group</span>
          </button>

          {/* Tab 2: Payment History */}
          <button
            type="button"
            onClick={() => handleTabChange("history")}
            className={cn(
              "flex-1 sm:flex-initial min-h-[38px] px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 touch-manipulation select-none outline-none focus:outline-none focus-visible:outline-none",
              activeTab === "history"
                ? "btn-gradient-glow text-white font-bold shadow-xs shadow-emerald-500/25"
                : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
            )}
          >
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="font-bold whitespace-nowrap">
              <span className="xs:hidden">History</span>
              <span className="hidden xs:inline">Payment History</span>
            </span>
          </button>

          {/* Tab 3: Settings */}
          <button
            type="button"
            onClick={() => handleTabChange("settings")}
            className={cn(
              "flex-1 sm:flex-initial min-h-[38px] px-2.5 sm:px-4 py-2 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 active:scale-95 touch-manipulation select-none outline-none focus:outline-none focus-visible:outline-none",
              activeTab === "settings"
                ? "btn-gradient-glow text-white font-bold shadow-xs shadow-emerald-500/25"
                : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
            )}
          >
            <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="font-bold whitespace-nowrap">Settings</span>
          </button>
        </div>

        {/* Tab Panels: Keep mounted for instant 0ms switching */}
        <div className="relative">
          <div className={activeTab === "group" ? "block" : "hidden"}>
            <FamilyPage embedded />
          </div>

          <div className={activeTab === "history" ? "block" : "hidden"}>
            <PaymentHistoryPage embedded />
          </div>

          <div className={activeTab === "settings" ? "block" : "hidden"}>
            <SettingsPage embedded />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={null}>
        <AccountContent />
      </Suspense>
    </DashboardLayout>
  );
}
