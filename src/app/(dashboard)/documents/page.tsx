"use client";

import React from "react";
import Link from "next/link";
import { FileText, ShieldCheck, Sparkles, FolderLock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function DocumentsPage() {
  return (
    <DashboardLayout>
      <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#02361B]">
                Documents Vault
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                Coming Soon
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Securely store and organize your loan agreements, sanction letters, and NOC certificates
            </p>
          </div>

          {/* Featured Coming Soon Hero Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-10 lg:p-12 shadow-xs text-center relative overflow-hidden">
            {/* Subtle Gradient Glow Background */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto space-y-5">
              {/* Animated Icon Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2] text-[#1C9E30]" />
              </div>

              {/* Title & Badge */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Document Vault is on the way!</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  All your loan records in one place
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  We are building an encrypted personal document safe so you can upload, view, and store loan sanction letters, agreements, repayment schedules, and bank NOC certificates with complete peace of mind.
                </p>
              </div>

              {/* Preview Feature List */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left pt-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">Sanction Letters</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Store signed loan sanction orders & bank terms.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">Bank-Grade Safe</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    End-to-end encrypted personal cloud storage.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
                    <FolderLock className="w-4 h-4" />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800">NOC & Closure</h3>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Preserve debt-free certificates upon loan closure.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-center gap-3">
                <Link href="/emis">
                  <button
                    type="button"
                    className="min-h-[42px] px-5 rounded-xl btn-gradient-glow text-white font-bold text-xs inline-flex items-center gap-2 shadow-md shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 touch-manipulation"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to EMI Management</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
