import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function AccountLoading() {
  return (
    <DashboardLayout>
      <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-4 sm:space-y-6 animate-pulse">
          {/* Header Title Skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-2">
              <div className="h-8 w-36 bg-slate-200/80 rounded-xl" />
              <div className="h-4 w-64 bg-slate-200/50 rounded-lg" />
            </div>
            <div className="h-9 w-44 rounded-full bg-slate-200/60" />
          </div>

          {/* Segmented Tab Control Skeleton */}
          <div className="p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs inline-flex items-center gap-1.5 w-full sm:w-auto">
            <div className="h-9 w-28 rounded-lg bg-slate-200/80" />
            <div className="h-9 w-32 rounded-lg bg-slate-200/60" />
            <div className="h-9 w-28 rounded-lg bg-slate-200/60" />
          </div>

          {/* Tab Content Shimmer */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
            <div className="h-6 w-48 bg-slate-200/70 rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="h-28 rounded-xl bg-slate-100" />
              <div className="h-28 rounded-xl bg-slate-100" />
              <div className="h-28 rounded-xl bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
