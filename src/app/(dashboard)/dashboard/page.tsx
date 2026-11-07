"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  TrendingUp,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Calendar,
  Users,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCardRow } from "@/components/dashboard/StatCardRow";
import { NextPaymentCard } from "@/components/dashboard/NextPaymentCard";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid";
import { Button } from "@/components/ui/Button";
import { mockEmis, mockPaymentHistory, currentUser } from "@/lib/mockData";
import { MarkAsPaidModal } from "@/components/common/MarkAsPaidModal";

export default function DashboardOverviewPage() {
  const [selectedEmiForPay, setSelectedEmiForPay] = useState(mockEmis[0]);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[#172554] via-[#1E1B4B] to-[#312E81] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-teal-300 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              {currentUser.familyName} Vault Active
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good afternoon, {currentUser.name.split(" ")[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              You have <strong className="text-white">4 active EMIs</strong> totaling{" "}
              <strong className="text-teal-300">₹32,500</strong> due this month. Next payment of{" "}
              <strong>₹18,500</strong> is due in 2 days.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link href="/emis/new">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl shadow-xs gap-1.5 text-xs font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Loan
                </Button>
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPayModalOpen(true)}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs font-semibold backdrop-blur-xs"
              >
                Quick Mark Paid
              </Button>
            </div>
          </div>

          {/* Decorative glowing gradient circle */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/20 to-teal-400/20 blur-2xl pointer-events-none" />
        </div>

        {/* 4 Summary Cards */}
        <StatCardRow />

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Area: Upcoming Payments & Recent History */}
          <div className="lg:col-span-8 space-y-6">
            {/* Upcoming Payments Priority Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Upcoming EMI Payments
                  </h3>
                  <p className="text-xs text-slate-400">
                    Chronological schedule of payments due this month
                  </p>
                </div>
                <Link
                  href="/emis"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {mockEmis.slice(0, 3).map((emi) => (
                  <div
                    key={emi.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all gap-3"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${emi.bgClass} border border-slate-100`}
                      >
                        <CreditCard className={`w-5 h-5 ${emi.colorClass}`} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          {emi.loanName}
                          {emi.daysLeft <= 3 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                              Due in {emi.daysLeft}d
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {emi.bankName} • Due on {emi.nextDueDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-left sm:text-right">
                        <span className="text-base font-extrabold text-slate-900">
                          ₹{emi.emiAmount.toLocaleString()}
                        </span>
                        <div className="text-[10px] text-slate-400">
                          {emi.paymentMethod}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs font-semibold"
                        onClick={() => {
                          setSelectedEmiForPay(emi);
                          setIsPayModalOpen(true);
                        }}
                      >
                        Mark Paid
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Payment Activity */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Recent Payment Ledger
                  </h3>
                  <p className="text-xs text-slate-400">
                    External payments recorded & reconciled
                  </p>
                </div>
                <Link
                  href="/payment-history"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  Full History
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-slate-100">
                {mockPaymentHistory.slice(0, 4).map((record) => (
                  <div
                    key={record.id}
                    className="py-3 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">
                          {record.loanName} ({record.bankName})
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Instalment #{record.installmentNo} • {record.paymentDate} • Ref: {record.transactionReference}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-extrabold text-slate-900">
                        ₹{record.amount.toLocaleString()}
                      </span>
                      <span className="block text-[10px] font-semibold text-emerald-700">
                        Success
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Rail: Next Payment Highlight + Calendar + Quick Actions */}
          <div className="lg:col-span-4 space-y-5">
            <NextPaymentCard />
            <MiniCalendar />
            <QuickActionsGrid />
          </div>
        </div>
      </div>

      <MarkAsPaidModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        emi={selectedEmiForPay}
        onSuccess={(data) => {
          alert(`Recorded ₹${data.amount.toLocaleString()} for ${selectedEmiForPay.loanName}!`);
        }}
      />
    </DashboardLayout>
  );
}
