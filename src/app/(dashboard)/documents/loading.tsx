import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DocumentsLoading() {
  return (
    <DashboardLayout>
      <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-[calc(100dvh-6rem)] flex items-center justify-center">
        <div className="relative z-10 w-full max-w-sm mx-auto text-center space-y-5 py-6 animate-pulse">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-200/80 mx-auto" />
          <div className="space-y-2">
            <div className="h-8 w-36 bg-slate-200/80 rounded-xl mx-auto" />
            <div className="h-6 w-24 bg-slate-200/50 rounded-full mx-auto" />
          </div>
          <div className="pt-2">
            <div className="h-10 w-48 bg-slate-200/70 rounded-xl mx-auto" />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
