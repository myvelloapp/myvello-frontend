"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Plus, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MarkAsPaidModal } from "@/components/common/MarkAsPaidModal";
import { NextEmiHeroData, emiService } from "@/services/emiService";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/modules/authentication/AuthContext";
import { cn } from "@/lib/utils";
import { getCategoryIcon, getCategoryBgClass } from "@/lib/categoryConfig";

export interface NextPaymentCardProps {
  heroData?: NextEmiHeroData | null;
  onPaymentRecorded?: () => void;
  isLoading?: boolean;
}

export function NextPaymentCard({ heroData, onPaymentRecorded, isLoading }: NextPaymentCardProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const currency = user?.preferred_currency || "INR";

  if (isLoading) {
    return (
      <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-4 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-200" />
            <div className="h-4 bg-slate-200 rounded w-28" />
          </div>
          <div className="h-5 bg-slate-100 rounded-full w-18" />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-slate-100 shrink-0" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-3.5 bg-slate-200 rounded w-32" />
              <div className="h-6 bg-slate-200 rounded w-24" />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div className="h-3 bg-slate-100 rounded w-28" />
            <div className="h-3 bg-slate-100 rounded w-16" />
          </div>

          <div className="h-11 bg-slate-100 rounded-[16px] w-full" />
        </div>
      </div>
    );
  }

  const handlePaymentSuccess = async (data: {
    emiId: number;
    amount: number;
    date: string;
    method: string;
    reference: string;
  }) => {
    if (heroData?.schedule_id && heroData?.emi_id) {
      try {
        await emiService.markScheduleAsPaid(heroData.emi_id, heroData.schedule_id, {
          paid_amount: data.amount,
          payment_date: data.date,
          payment_method: data.method,
          transaction_reference: data.reference,
        });
      } catch (err) {
        console.error("Failed to mark schedule as paid in backend:", err);
      }
    }
    if (onPaymentRecorded) {
      onPaymentRecorded();
    }
  };

  const isDueSoon = Boolean(
    heroData &&
      (heroData.days_remaining !== undefined &&
        heroData.days_remaining !== null &&
        heroData.days_remaining <= 3)
  );

  return (
    <>
      <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 transition-all hover:shadow-md space-y-4">
        {/* Card Header matching screenshot */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#0B132B]">
            <Calendar className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-black tracking-tight text-[#0B132B]">
              Next EMI Payment
            </h3>
          </div>

          <span
            className={cn(
              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border",
              isDueSoon
                ? "bg-rose-50 text-rose-700 border-rose-200"
                : "bg-indigo-50 text-indigo-700 border-indigo-100"
            )}
          >
            {/* <Sparkles className="w-3 h-3 text-indigo-600" /> */}
            {isDueSoon ? "Due Soon" : "Upcoming"}
          </span>
        </div>

        {/* Content Box */}
        {heroData ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border border-slate-100/80 shadow-2xs",
                  getCategoryBgClass(heroData.loan_category || heroData.loan_name)
                )}
              >
                {getCategoryIcon(heroData.loan_category || heroData.loan_name, "w-5 h-5")}
              </div>
              <div className="min-w-0 flex-1">
                {heroData.emi_id ? (
                  <Link
                    href={`/emis/${heroData.emi_id}`}
                    className="text-xs font-black text-[#0B132B] hover:text-indigo-600 transition-colors truncate block"
                  >
                    {heroData.loan_name}
                  </Link>
                ) : (
                  <div className="text-xs font-black text-[#0B132B] truncate">
                    {heroData.loan_name}
                  </div>
                )}
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span
                    suppressHydrationWarning
                    className="text-xl font-black text-[#0B132B] tracking-tight"
                  >
                    {formatCurrency(heroData.amount, currency)}
                  </span>
                  {heroData.days_remaining !== null && (
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0",
                        isDueSoon
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : "bg-amber-50 text-amber-800 border-amber-200/80"
                      )}
                    >
                      <Clock className="w-2.5 h-2.5 text-amber-600" />
                      {heroData.days_remaining} {heroData.days_remaining === 1 ? "day left" : "days left"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs font-semibold text-slate-500 flex items-center justify-between pt-4 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Due on <strong className="text-slate-800 font-bold">{heroData.due_date}</strong>
              </span>
              <span className="text-[11px] font-bold text-slate-500 truncate max-w-[120px]">
                {heroData.lender_name}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full h-11 min-h-[44px] btn-gradient-glow text-white rounded-[10px] text-xs font-black shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] touch-manipulation"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark as Paid</span>
            </button>
          </div>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-indigo-500 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold text-slate-800">No Upcoming Payments</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-[210px] mx-auto leading-relaxed">
                You have no instalments scheduled for debit.
              </p>
            </div>
            <Link href="/emis/new" className="inline-block pt-1">
              <Button size="sm" variant="outline" className="text-xs gap-1.5 border-slate-200 rounded-xl hover:bg-slate-50">
                <Plus className="w-3.5 h-3.5 text-indigo-600" />
                Add New EMI
              </Button>
            </Link>
          </div>
        )}
      </div>

      {heroData && (
        <MarkAsPaidModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          emi={{
            id: heroData.emi_id,
            loanName: heroData.loan_name,
            bankName: heroData.lender_name,
            emiAmount: heroData.amount,
            nextDueDate: heroData.due_date,
            scheduleId: heroData.schedule_id,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
