import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DocumentsLoading() {
  return (
    <DashboardLayout>
      <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-4 sm:space-y-6 animate-pulse">
          <div className="space-y-2">
            <div className="h-8 w-44 bg-slate-200/80 rounded-xl" />
            <div className="h-4 w-72 bg-slate-200/50 rounded-lg" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-xs h-96 flex items-center justify-center">
            <div className="space-y-4 text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 mx-auto" />
              <div className="h-6 w-48 bg-slate-200/70 rounded-lg mx-auto" />
              <div className="h-4 w-64 bg-slate-200/50 rounded-lg mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
