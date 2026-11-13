"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCardRow } from "@/components/dashboard/StatCardRow";
import { NextPaymentCard } from "@/components/dashboard/NextPaymentCard";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid";
import { Button } from "@/components/ui/Button";
import { MarkAsPaidModal, MarkAsPaidTarget } from "@/components/common/MarkAsPaidModal";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/modules/authentication/AuthContext";
import { emiService, EmiIndexResponse } from "@/services/emiService";
import { familyService } from "@/services/familyService";
import { getCategoryIcon, getCategoryBgClass } from "@/lib/categoryConfig";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------
   Deep-Equality Diffing Helpers to Avoid Virtual DOM Thrashing & Re-renders
------------------------------------------------------------------------- */
function areSummaryEqual(a?: any, b?: any): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.active_emis === b.active_emis &&
    a.monthly_emi === b.monthly_emi &&
    a.outstanding === b.outstanding &&
    a.paid_emis === b.paid_emis
  );
}

function areNextHeroEqual(a?: any, b?: any): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    a.emi_id === b.emi_id &&
    a.schedule_id === b.schedule_id &&
    a.amount === b.amount &&
    a.days_remaining === b.days_remaining &&
    a.loan_name === b.loan_name
  );
}

function areEmiItemsEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].id !== b[i].id ||
      a[i].loan_name !== b[i].loan_name ||
      a[i].emi_amount !== b[i].emi_amount ||
      a[i].days_remaining !== b[i].days_remaining ||
      a[i].next_due_status !== b[i].next_due_status ||
      a[i].paid_emis !== b[i].paid_emis
    ) {
      return false;
    }
  }
  return true;
}

function arePaymentsEqual(a: any[], b: any[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (
      a[i].id !== b[i].id ||
      a[i].amount !== b[i].amount ||
      a[i].payment_date !== b[i].payment_date ||
      a[i].transaction_reference !== b[i].transaction_reference
    ) {
      return false;
    }
  }
  return true;
}

/* -------------------------------------------------------------------------
   High-Fidelity Shimmer Skeleton with Zero Layout Shift (CLS)
------------------------------------------------------------------------- */
function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6 select-none">
      {/* Welcome Banner Skeleton */}
      <div className="bg-slate-200/80 rounded-[16px] p-6 sm:p-8 animate-pulse h-48 sm:h-52 relative overflow-hidden flex flex-col justify-between">
        <div className="space-y-3 max-w-2xl">
          <div className="h-6 w-36 rounded-full bg-slate-300/80 animate-pulse" />
          <div className="h-8 w-64 rounded-xl bg-slate-300/90 animate-pulse" />
          <div className="space-y-1.5">
            <div className="h-4 w-96 rounded bg-slate-300/70 animate-pulse" />
            <div className="h-4 w-72 rounded bg-slate-300/60 animate-pulse" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <div className="h-9 w-24 rounded-xl bg-slate-300/80 animate-pulse" />
            <div className="h-9 w-28 rounded-xl bg-slate-300/70 animate-pulse" />
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Row Skeleton */}
      <StatCardRow isLoading={true} />

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Upcoming EMI Payments Skeleton */}
          <div className="bg-white rounded-[16px] border border-slate-200/90 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1.5">
                <div className="h-5 w-48 rounded bg-slate-200/80 animate-pulse" />
                <div className="h-3.5 w-64 rounded bg-slate-200/60 animate-pulse" />
              </div>
              <div className="h-4 w-16 rounded bg-slate-200/60 animate-pulse" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-200/70 animate-pulse shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-36 rounded bg-slate-200/80 animate-pulse" />
                      <div className="h-3 w-48 rounded bg-slate-200/50 animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="space-y-1 text-right">
                      <div className="h-5 w-20 rounded bg-slate-200/80 animate-pulse ml-auto" />
                      <div className="h-2.5 w-12 rounded bg-slate-200/50 animate-pulse ml-auto" />
                    </div>
                    <div className="h-8 w-20 rounded-[8px] bg-slate-200/60 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payment Ledger Skeleton */}
          <div className="bg-white rounded-[16px] border border-slate-200/90 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="space-y-1.5">
                <div className="h-5 w-44 rounded bg-slate-200/80 animate-pulse" />
                <div className="h-3.5 w-52 rounded bg-slate-200/60 animate-pulse" />
              </div>
              <div className="h-4 w-18 rounded bg-slate-200/60 animate-pulse" />
            </div>
            <div className="divide-y divide-slate-100">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200/70 animate-pulse shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 rounded bg-slate-200/70 animate-pulse" />
                      <div className="h-3 w-40 rounded bg-slate-200/50 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="h-4 w-16 rounded bg-slate-200/70 animate-pulse ml-auto" />
                    <div className="h-3 w-12 rounded bg-slate-200/50 animate-pulse ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Rail (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <NextPaymentCard isLoading={true} />

          {/* Mini Calendar Skeleton */}
          <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="w-6 h-6 rounded-lg bg-slate-200" />
              <div className="h-4 w-28 rounded bg-slate-200" />
              <div className="w-6 h-6 rounded-lg bg-slate-200" />
            </div>
            <div className="grid grid-cols-7 gap-1 pt-2">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-3 rounded bg-slate-200 mx-auto w-6 mb-2" />
              ))}
              {Array.from({ length: 28 }).map((_, i) => (
                <div key={i} className="h-7 w-7 rounded-xl bg-slate-100 mx-auto" />
              ))}
            </div>
          </div>

          {/* Quick Actions Skeleton */}
          <div className="bg-white rounded-[16px] border border-slate-200/80 p-5 shadow-[0_2px_10px_-3px_rgba(15,23,42,0.05)] space-y-4 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-200" />
              <div className="h-4 w-28 rounded bg-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 rounded-xl bg-slate-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPageContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedEmiForPay, setSelectedEmiForPay] = useState<MarkAsPaidTarget | null>(null);
  const [apiData, setApiData] = useState<EmiIndexResponse | null>(null);
  const [familyName, setFamilyName] = useState<string | null>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currency = user?.preferred_currency || "INR";

  // Data loader with Deep-Equality Diffing to eliminate re-renders
  const loadDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent && !apiData) {
      setIsLoading(true);
    }
    try {
      const [emisData, familiesData, historyData] = await Promise.allSettled([
        emiService.getEmis(),
        familyService.getFamilies(),
        emiService.getPaymentHistory(1),
      ]);

      if (emisData.status === "fulfilled" && emisData.value) {
        setApiData((prev) => {
          if (!prev) return emisData.value;
          const summaryEqual = areSummaryEqual(prev.summary, emisData.value.summary);
          const nextHeroEqual = areNextHeroEqual(prev.next_emi_hero, emisData.value.next_emi_hero);
          const listEqual = areEmiItemsEqual(prev.emis || [], emisData.value.emis || []);
          if (summaryEqual && nextHeroEqual && listEqual) {
            return prev;
          }
          return emisData.value;
        });
      }

      if (familiesData.status === "fulfilled" && familiesData.value && familiesData.value.length > 0) {
        const primaryName = familiesData.value[0].name;
        setFamilyName((prev) => (prev !== primaryName ? primaryName : prev));
      }

      if (historyData.status === "fulfilled" && historyData.value?.data) {
        const newPayments = historyData.value.data;
        setPayments((prev) => {
          if (arePaymentsEqual(prev, newPayments)) {
            return prev;
          }
          return newPayments;
        });
      }
    } catch {
      // offline/silent fallback
    } finally {
      setIsLoading(false);
    }
  }, [apiData]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Event-Driven Listeners for Real-Time Sync (No aggressive interval polling)
  useEffect(() => {
    const handleRefresh = () => {
      loadDashboardData(true);
    };

    window.addEventListener("focus", handleRefresh);
    window.addEventListener("myvello:live_data_update", handleRefresh);
    window.addEventListener("myvello:refresh_emis", handleRefresh);
    window.addEventListener("myvello:refresh_payments", handleRefresh);
    window.addEventListener("myvello:refresh_family", handleRefresh);

    return () => {
      window.removeEventListener("focus", handleRefresh);
      window.removeEventListener("myvello:live_data_update", handleRefresh);
      window.removeEventListener("myvello:refresh_emis", handleRefresh);
      window.removeEventListener("myvello:refresh_payments", handleRefresh);
      window.removeEventListener("myvello:refresh_family", handleRefresh);
    };
  }, [loadDashboardData]);

  const firstName = user?.name ? user.name.split(" ")[0] : "there";
  const activeEmisCount = apiData?.summary?.active_emis ?? 0;
  const monthlyEmiTotal = apiData?.summary?.monthly_emi ?? 0;
  const upcomingLoans = apiData?.emis?.slice(0, 3) || [];

  // Cold-load shimmer skeleton: strictly rendered only when data is not yet in memory
  if (isLoading && !apiData) {
    return (
      <DashboardLayout>
        <DashboardSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-theme-gradient rounded-[16px] p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-teal-300 border border-white/10 backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              {familyName ? `${familyName} Vault Active` : "Personal Vault Active"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good day, {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {activeEmisCount > 0 ? (
                <>
                  You have <strong className="text-white">{activeEmisCount} active {activeEmisCount === 1 ? "EMI" : "EMIs"}</strong> totaling{" "}
                  <strong className="text-teal-300">{formatCurrency(monthlyEmiTotal, currency)}</strong> due this month.
                  {apiData?.next_emi_hero && (
                    <> Next payment of <strong>{formatCurrency(apiData.next_emi_hero.amount, currency)}</strong> is due in {apiData.next_emi_hero.days_remaining} days.</>
                  )}
                </>
              ) : (
                <>
                  Welcome to your digital vault. You have 0 active EMI commitments. Add your first EMI loan to track repayment schedules and reminders.
                </>
              )}
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
              {upcomingLoans.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedEmiForPay(upcomingLoans[0])}
                  className="bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs font-semibold backdrop-blur-xs"
                >
                  Quick Mark Paid
                </Button>
              )}
            </div>
          </div>

          {/* Decorative glowing gradient circle */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/20 to-teal-400/20 blur-2xl pointer-events-none" />
        </div>

        {/* 4 Summary Cards */}
        <StatCardRow
          stats={
            apiData
              ? {
                  activeEmis: apiData.summary.active_emis,
                  monthlyEmi: apiData.summary.monthly_emi,
                  totalOutstanding: apiData.summary.outstanding,
                  paidEmis: apiData.summary.paid_emis,
                }
              : {
                  activeEmis: 0,
                  monthlyEmi: 0,
                  totalOutstanding: 0,
                  paidEmis: 0,
                }
          }
        />

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Area: Upcoming Payments & Recent History */}
          <div className="lg:col-span-8 space-y-6">
            {/* Upcoming Payments Priority Card */}
            <div className="bg-white rounded-[16px] border border-slate-200/90 p-5 shadow-xs">
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

              {upcomingLoans.length > 0 ? (
                <div className="space-y-3">
                  {upcomingLoans.map((emi) => {
                    const isDueSoon =
                      emi.next_due_status === "due_soon" ||
                      (emi.days_remaining !== null &&
                        emi.days_remaining !== undefined &&
                        emi.days_remaining <= 3);

                    return (
                      <div
                        key={emi.id}
                        onClick={() => router.push(`/emis/${emi.id}`)}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/70 transition-all gap-3 cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border shadow-2xs group-hover:scale-105 transition-transform",
                              getCategoryBgClass(emi.loan_category)
                            )}
                          >
                            {getCategoryIcon(emi.loan_category, "w-5 h-5")}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-sm flex items-center gap-2">
                              {emi.loan_name}
                              {isDueSoon && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                  Due in {emi.days_remaining}d
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {emi.lender_name} • Due on {emi.next_due_date || "—"}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-4">
                          <div className="text-left sm:text-right">
                            <span suppressHydrationWarning className="text-base font-extrabold text-slate-900">
                              {formatCurrency(emi.emi_amount, emi.currency || currency)}
                            </span>
                            <div className="text-[10px] text-slate-400 capitalize">
                              {emi.loan_category}
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs font-semibold"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEmiForPay(emi);
                            }}
                          >
                            Mark Paid
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-8 text-center text-slate-400 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">No Upcoming EMI Payments</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add your first loan to generate payment schedules and reminders.</p>
                  </div>
                  <Link href="/emis/new">
                    <Button variant="secondary" size="sm" className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl text-xs font-semibold px-4 py-2">
                      <Plus className="w-3.5 h-3.5 mr-1" />
                      Add Loan
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Payment Activity */}
            <div className="bg-white rounded-[16px] border border-slate-200/90 p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Recent Payment Ledger
                  </h3>
                  <p className="text-xs text-slate-400">
                    External payments recorded &amp; reconciled
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

              {payments.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {payments.slice(0, 4).map((record) => (
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
                            {record.loan_name || record.emi?.loan_name || "Loan Payment"} ({record.lender_name || record.emi?.lender_name || "Bank"})
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {record.payment_date} • Ref: {record.transaction_reference || "Direct"}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span suppressHydrationWarning className="font-extrabold text-slate-900">
                          {formatCurrency(record.paid_amount || record.amount, currency)}
                        </span>
                        <span className="block text-[10px] font-semibold text-emerald-700">
                          Success
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400 space-y-1">
                  <p className="text-xs font-semibold text-slate-600">No Recent Payment Activity</p>
                  <p className="text-[11px] text-slate-400">Recorded EMI payments and transaction references will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Rail: Next Payment Highlight + Calendar + Quick Actions */}
          <div className="lg:col-span-4 space-y-5">
            <NextPaymentCard
              heroData={apiData?.next_emi_hero ?? null}
              onPaymentRecorded={() => loadDashboardData(true)}
            />
            <MiniCalendar />
            <QuickActionsGrid />
          </div>
        </div>
      </div>

      <MarkAsPaidModal
        isOpen={Boolean(selectedEmiForPay)}
        onClose={() => setSelectedEmiForPay(null)}
        emi={selectedEmiForPay}
        onSuccess={() => {
          loadDashboardData(true);
        }}
      />
    </DashboardLayout>
  );
}

export default function DashboardOverviewPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <DashboardSkeleton />
        </DashboardLayout>
      }
    >
      <DashboardPageContent />
    </Suspense>
  );
}
