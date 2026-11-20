"use client";

import React from "react";
import Link from "next/link";
import { FileText, ArrowLeft } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-[calc(100dvh-6rem)] flex items-center justify-center">
        <div className="relative z-10 w-full max-w-sm mx-auto text-center space-y-5 py-6">
          {/* Document Icon Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-sm">
            <FileText className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2] text-[#1C9E30]" />
          </div>

          {/* Minimal Title & Coming Soon Badge */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#02361B] tracking-tight">
              Documents
            </h1>
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                Coming Soon
              </span>
            </div>
          </div>

          {/* Action Button: Back to EMI Management */}
          <div className="pt-2">
            <Link href="/emis">
              <button
                type="button"
                className="h-10 px-5 rounded-xl btn-gradient-glow text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 touch-manipulation"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to EMI Management</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
