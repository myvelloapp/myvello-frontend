"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Calendar, Plus, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MarkAsPaidModal } from "@/components/common/MarkAsPaidModal";
import { NextEmiHeroData, emiService } from "@/services/emiService";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/modules/authentication/AuthContext";
import { cn } from "@/lib/utils";
import { getCategoryIcon, getCategoryBgClass } from "@/lib/categoryConfig";

export interface NextPaymentCardProps {
  heroData?: NextEmiHeroData | null;
  cards?: NextEmiHeroData[];
  onPaymentRecorded?: () => void;
  isLoading?: boolean;
}

export function NextPaymentCard({
  heroData,
  cards,
  onPaymentRecorded,
  isLoading,
}: NextPaymentCardProps) {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isCycling, setIsCycling] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currency = user?.preferred_currency || "INR";

  // Resolve all cards belonging to the target month
  const emiCards = useMemo(() => {
    if (cards && cards.length > 0) return cards;
    if (heroData) return [heroData];
    return [];
  }, [cards, heroData]);

  const totalCards = emiCards.length;
  const safeIndex = totalCards > 0 ? activeIndex % totalCards : 0;
  const activeCard = totalCards > 0 ? emiCards[safeIndex] : null;

  // Next cards in deck for physical stacked peek effect
  const cardBehindLeft = totalCards >= 2 ? emiCards[(safeIndex + 1) % totalCards] : null;
  const cardBehindRight = totalCards >= 3 ? emiCards[(safeIndex + 2) % totalCards] : null;

  // Infinite Cycle Action ("Send to back")
  const handleSendToBack = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (totalCards <= 1 || isCycling) return;
    setIsCycling(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % totalCards);
      setIsCycling(false);
    }, 180);
  };

  // Mobile Swipe Gesture Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchStartX - touchEndX;
    if (Math.abs(diffX) > 40 && totalCards > 1) {
      handleSendToBack();
    }
    setTouchStartX(null);
  };

  if (isLoading) {
    return (
      <div className="w-full pt-4 pb-2 px-1">
        <div className="bg-white rounded-[26px] p-5.5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-4 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-4.5 h-4.5 rounded bg-slate-200" />
              <div className="h-4 bg-slate-200 rounded w-28" />
            </div>
            <div className="h-5 bg-slate-100 rounded-full w-20" />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-13 h-13 rounded-2xl bg-slate-100 shrink-0" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-3.5 bg-slate-200 rounded w-36" />
                <div className="h-7 bg-slate-200 rounded w-28" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="h-3.5 bg-slate-100 rounded w-32" />
              <div className="h-3.5 bg-slate-100 rounded w-20" />
            </div>

            <div className="h-12 bg-slate-100 rounded-2xl w-full" />
          </div>
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
    if (activeCard?.schedule_id && activeCard?.emi_id) {
      try {
        await emiService.markScheduleAsPaid(activeCard.emi_id, activeCard.schedule_id, {
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
    activeCard &&
      activeCard.days_remaining !== undefined &&
      activeCard.days_remaining !== null &&
      activeCard.days_remaining <= 3 &&
      activeCard.days_remaining >= 0
  );

  const isOverdue = Boolean(
    activeCard &&
      activeCard.days_remaining !== undefined &&
      activeCard.days_remaining !== null &&
      activeCard.days_remaining < 0
  );

  // If no upcoming EMIs at all
  if (!activeCard) {
    return (
      <div className="w-full pt-4 pb-2 px-1">
        <div className="bg-white rounded-[26px] p-6 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 text-center space-y-3.5">
          <div className="w-13 h-13 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 tracking-tight">
              No Upcoming Payments
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
              All scheduled payments for this month have been cleared.
            </p>
          </div>
          <Link href="/emis/new" className="inline-block pt-1">
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5 border-slate-200 rounded-xl hover:bg-slate-50 font-bold"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              Add New EMI
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Outer Deck Wrapper with overflow margins for stacked cards */}
      <div className="relative w-full pt-4 pb-2 px-1 select-none">
        {/* Layer 1: Left Peek Card (Behind) */}
        {cardBehindLeft && (
          <div
            className={cn(
              "absolute inset-x-1 inset-y-2 bg-white rounded-[26px] sm:rounded-[28px] border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] pointer-events-none transition-all duration-300",
              "-rotate-[3.2deg] -translate-x-3 -translate-y-0.5 scale-[0.98] z-0 opacity-95"
            )}
            aria-hidden="true"
          >
            {/* Peek elements: Category Icon & Outline */}
            <div className="p-5 flex items-center justify-between opacity-30">
              <div
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  getCategoryBgClass(cardBehindLeft.loan_category || cardBehindLeft.loan_name)
                )}
              >
                {getCategoryIcon(cardBehindLeft.loan_category || cardBehindLeft.loan_name, "w-5 h-5")}
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">
                Upcoming
              </span>
            </div>
            {/* Peek Bottom Button */}
            <div className="px-5 pt-12 opacity-25">
              <div className="w-full h-10 bg-[#6366F1] rounded-2xl" />
            </div>
          </div>
        )}

        {/* Layer 2: Right Peek Card (Behind) */}
        {cardBehindRight && (
          <div
            className={cn(
              "absolute inset-x-1 inset-y-2 bg-white rounded-[26px] sm:rounded-[28px] border border-slate-200/70 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] pointer-events-none transition-all duration-300",
              "rotate-[3.2deg] translate-x-3 -translate-y-0.5 scale-[0.97] z-0 opacity-90"
            )}
            aria-hidden="true"
          >
            {/* Peek elements: Upcoming badge and lender on the right */}
            <div className="p-5 flex flex-col justify-between h-full opacity-35">
              <div className="flex justify-end">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EEF2FF] text-[#4F46E5]">
                  Upcoming
                </span>
              </div>
              <div className="flex justify-end pt-10">
                <span className="text-[11px] font-medium text-slate-500 truncate max-w-[90px]">
                  {cardBehindRight.lender_name}
                </span>
              </div>
              <div className="pt-2 opacity-30">
                <div className="w-full h-10 bg-[#6366F1] rounded-2xl" />
              </div>
            </div>
          </div>
        )}

        {/* Layer 3: Active Front Card */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "relative z-10 bg-white rounded-[26px] sm:rounded-[28px] p-5 sm:p-5.5 border border-slate-200/90 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] hover:shadow-md transition-all duration-200 ease-out",
            isCycling
              ? "translate-x-7 -translate-y-2 rotate-6 opacity-0 scale-95"
              : "scale-100 rotate-0 translate-x-0 translate-y-0 opacity-100"
          )}
        >
          {/* Top Floating Circular Button (Next EMI / Cycle Deck) */}
          {totalCards > 1 && (
            <button
              type="button"
              onClick={handleSendToBack}
              className="absolute -top-3.5 right-11 sm:right-13 z-30 w-8 h-8 rounded-full bg-white shadow-md border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-indigo-600 hover:bg-slate-50 hover:shadow-lg active:scale-90 transition-all cursor-pointer group"
              title="Next EMI (Cycle deck)"
              aria-label="Next EMI"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5] text-slate-600 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </button>
          )}

          {/* Card Header matching screenshot */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[#0B132B]">
              <Calendar className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="text-sm sm:text-base font-extrabold tracking-tight text-[#0B132B]">
                Next EMI Payment
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold",
                  isOverdue
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : isDueSoon
                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                    : "bg-[#EEF2FF] text-[#4F46E5]"
                )}
              >
                {isOverdue ? "Overdue" : isDueSoon ? "Due Soon" : "Upcoming"}
              </span>
            </div>
          </div>

          {/* Middle Content Box matching screenshot */}
          <div className="flex items-center gap-3.5 my-4.5">
            {/* Category Icon in Blue Container */}
            <div
              className={cn(
                "w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100/70 shadow-2xs",
                getCategoryBgClass(activeCard.loan_category || activeCard.loan_name)
              )}
            >
              {getCategoryIcon(
                activeCard.loan_category || activeCard.loan_name,
                "w-6 h-6 sm:w-6.5 sm:h-6.5"
              )}
            </div>

            {/* Details */}
            <div className="min-w-0 flex-1">
              {activeCard.emi_id ? (
                <Link
                  href={`/emis/${activeCard.emi_id}`}
                  className="text-xs sm:text-sm font-extrabold text-[#0B132B] hover:text-indigo-600 transition-colors truncate block"
                  title={activeCard.loan_name}
                >
                  {activeCard.loan_name}
                </Link>
              ) : (
                <div
                  className="text-xs sm:text-sm font-extrabold text-[#0B132B] truncate"
                  title={activeCard.loan_name}
                >
                  {activeCard.loan_name}
                </div>
              )}

              {/* Amount & Days Left Row */}
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span
                  suppressHydrationWarning
                  className="text-2xl sm:text-[26px] font-black text-[#0B132B] tracking-tight"
                >
                  {formatCurrency(activeCard.amount, currency)}
                </span>

                {activeCard.days_remaining !== null && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold shrink-0 border",
                      isOverdue
                        ? "bg-rose-50 text-rose-800 border-rose-200"
                        : isDueSoon
                        ? "bg-amber-50 text-amber-800 border-amber-200/90"
                        : "bg-[#FEF9C3] text-[#854D0E] border-[#FEF08A]"
                    )}
                  >
                    <Clock className="w-3 h-3 text-[#A16207]" />
                    <span>
                      {isOverdue
                        ? `${Math.abs(activeCard.days_remaining)}d overdue`
                        : `${activeCard.days_remaining} ${
                            activeCard.days_remaining === 1 ? "day left" : "days left"
                          }`}
                    </span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Info Row with Divider */}
          <div className="text-xs font-semibold text-slate-500 flex items-center justify-between pt-3.5 border-t border-slate-100">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Due on{" "}
              <strong className="text-slate-800 font-bold">{activeCard.due_date}</strong>
            </span>
            <span className="text-xs font-bold text-slate-600 truncate max-w-[130px]">
              {activeCard.lender_name}
            </span>
          </div>

          {/* Action Button: Mark as Paid */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="w-full h-12 bg-gradient-to-r from-[#6366F1] to-[#4F46E5] hover:from-[#4F46E5] hover:to-[#4338CA] text-white rounded-2xl text-sm font-bold shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] touch-manipulation mt-4"
          >
            <CheckCircle2 className="w-4.5 h-4.5 stroke-[2.2]" />
            <span>Mark as Paid</span>
          </button>

          {/* Subtle Card Deck Dots / Pagination for Multiple EMIs */}
          {totalCards > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-3">
              {emiCards.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (idx !== safeIndex && !isCycling) {
                      setIsCycling(true);
                      setTimeout(() => {
                        setActiveIndex(idx);
                        setIsCycling(false);
                      }, 180);
                    }
                  }}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300 cursor-pointer",
                    idx === safeIndex
                      ? "w-5 bg-indigo-600"
                      : "w-1.5 bg-slate-200 hover:bg-slate-300"
                  )}
                  aria-label={`Go to EMI ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mark As Paid Modal */}
      {activeCard && (
        <MarkAsPaidModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          emi={{
            id: activeCard.emi_id,
            loanName: activeCard.loan_name,
            bankName: activeCard.lender_name,
            emiAmount: activeCard.amount,
            nextDueDate: activeCard.due_date,
            scheduleId: activeCard.schedule_id,
          }}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
}
