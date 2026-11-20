"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function SettingsLoading() {
  return (
    <DashboardLayout>
      <div className="relative w-full max-w-full min-w-0 pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
        <div className="relative z-10 w-full max-w-[1500px] mx-auto space-y-4 sm:space-y-6 animate-pulse min-w-0">
          {/* Header Title Placeholder */}
          <div className="space-y-1">
            <div className="h-8 w-48 rounded-xl bg-slate-200/80" />
            <div className="h-4 w-72 rounded-lg bg-slate-200/60 mt-1" />
          </div>

          {/* Tab Selector Placeholder */}
          <div className="p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs inline-flex items-center gap-1.5 w-full sm:w-auto">
            <div className="h-9 w-28 rounded-lg bg-slate-200/70" />
            <div className="h-9 w-28 rounded-lg bg-slate-200/50" />
          </div>

          {/* Form Card Placeholder */}
          <div className="w-full max-w-full min-w-0 bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 lg:p-8 shadow-xs space-y-7">
            {/* Profile Avatar & Info Row */}
            <div className="flex items-center gap-4 sm:gap-5 pb-6 border-b border-slate-100">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200/80 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-5 w-40 bg-slate-200/80 rounded" />
                <div className="h-3.5 w-56 bg-slate-200/60 rounded" />
              </div>
            </div>

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
              <div className="h-11 rounded-xl bg-slate-200/50" />
              <div className="h-11 rounded-xl bg-slate-200/50" />
              <div className="h-11 rounded-xl bg-slate-200/50" />
              <div className="h-11 rounded-xl bg-slate-200/50" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
