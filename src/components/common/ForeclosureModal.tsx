"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  X,
  CheckCircle2,
  Hash,
  AlertTriangle,
  User,
  Check,
  ShieldCheck,
  Landmark,
} from "lucide-react";
import { formatCurrency, getCurrencySymbol } from "@/lib/formatters";
import { useAuth } from "@/modules/authentication/AuthContext";
import { emiService } from "@/services/emiService";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { FamilyMemberWithUser, Emi } from "@/types";
import { cn } from "@/lib/utils";

const paymentMethodOptions = [
  { value: "NetBanking", label: "NetBanking / NEFT / RTGS" },
  { value: "UPI Transfer", label: "UPI (GPay / PhonePe / Paytm)" },
  { value: "Auto Debit", label: "Auto Debit (Bank Mandate)" },
  { value: "Cheque / Cash", label: "Cheque / Cash Deposit" },
  { value: "Credit Card", label: "Credit Card" },
];

interface ForeclosureModalProps {
  isOpen: boolean;
  onClose: () => void;
  emi: Emi | null;
  remainingInstalmentsCount?: number;
  familyMembers?: FamilyMemberWithUser[] | null;
  onSuccess: (updatedEmi: Emi) => void;
}

export function ForeclosureModal({
  isOpen,
  onClose,
  emi,
  remainingInstalmentsCount = 0,
  familyMembers,
  onSuccess,
}: ForeclosureModalProps) {
  const { user } = useAuth();
  const currency = emi?.currency || user?.preferred_currency || "INR";
  const currencySymbol = getCurrencySymbol(currency);

  const outstanding = useMemo(() => {
    return Number(emi?.outstanding_principal ?? 0);
  }, [emi]);

  const [settlementAmount, setSettlementAmount] = useState<string>("0");
  const [foreclosureCharges, setForeclosureCharges] = useState<string>("0");
  const [paymentDate, setPaymentDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("NetBanking");
  const [reference, setReference] = useState(() => `FORECLOSE-${Math.floor(100000 + Math.random() * 900000)}`);
  const [notes, setNotes] = useState("");
  const [paidByUserId, setPaidByUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Available family members for shared commitments
  const membersList = useMemo(() => {
    if (familyMembers && familyMembers.length > 0) return familyMembers;
    if (emi && "family" in emi && emi.family && Array.isArray((emi.family as any).members)) {
      return (emi.family as any).members as FamilyMemberWithUser[];
    }
    return [];
  }, [familyMembers, emi]);

  useEffect(() => {
    if (emi) {
      setSettlementAmount(String(outstanding || 0));
      setForeclosureCharges("0");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setReference(`FORECLOSE-${Math.floor(100000 + Math.random() * 900000)}`);
      setNotes("");
      setPaidByUserId(user?.id || null);
      setErrorMessage(null);
      setIsDone(false);
    }
  }, [emi, outstanding, user]);

  const totalPayable = useMemo(() => {
    const s = parseFloat(settlementAmount) || 0;
    const c = parseFloat(foreclosureCharges) || 0;
    return Math.max(0, s + c);
  }, [settlementAmount, foreclosureCharges]);

  if (!isOpen || !emi) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const updated = await emiService.forecloseEmi(emi.id, {
        settlement_amount: parseFloat(settlementAmount) || 0,
        foreclosure_charges: parseFloat(foreclosureCharges) || 0,
        payment_date: paymentDate,
        payment_method: paymentMethod,
        transaction_reference: reference.trim(),
        notes: notes.trim() || undefined,
        paid_by_user_id: paidByUserId || undefined,
      });

      setIsDone(true);
      setTimeout(() => {
        onSuccess(updated);
        setIsDone(false);
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errorObj.response?.data?.message || "Failed to process foreclosure. Please verify the settlement details."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in select-none">
      <div className="relative w-full max-w-lg bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh] pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-0 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile Pull Handle */}
        <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 sm:hidden shrink-0" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-2xs">
              <Landmark className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#0B132B]">
                Loan Foreclosure & Early Pre-Closure
              </h3>
              <p className="text-xs text-slate-500">
                Settle and close <span className="font-bold text-slate-700">{emi.loan_name}</span> ({emi.lender_name})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer touch-manipulation"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {isDone ? (
          <div className="p-8 text-center space-y-3.5">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-black text-[#0B132B]">Loan Successfully Foreclosed!</h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
              All remaining instalments have been marked settled. Your outstanding debt has been reduced to zero and this loan is now 100% completed.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
            {/* Error Banner */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Foreclosure Overview Card */}
            <div className="p-4 bg-gradient-to-br from-amber-50/70 via-indigo-50/40 to-slate-50 rounded-2xl border border-amber-200/70 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Remaining Principal Balance
                </span>
                <span className="font-mono text-xs font-bold text-amber-800">
                  {remainingInstalmentsCount} {remainingInstalmentsCount === 1 ? "instalment" : "instalments"} remaining
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className="text-2xl sm:text-3xl font-black text-[#0B132B] tracking-tight">
                  {formatCurrency(totalPayable, currency)}
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  Full Payoff Amount
                </span>
              </div>
            </div>

            {/* Who Paid Section (For Family Workspaces / Shared Commitments) */}
            {membersList.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Who Is Paying the Foreclosure Settlement?</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    Household audit record
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {membersList.map((m) => {
                    const isSelected = paidByUserId === m.user_id;
                    const isMe = m.user_id === user?.id;
                    const name = m.user?.name || "Family Member";

                    return (
                      <button
                        key={m.user_id}
                        type="button"
                        onClick={() => setPaidByUserId(m.user_id)}
                        className={cn(
                          "p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5",
                          isSelected
                            ? "bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-2xs"
                            : "bg-white border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0 overflow-hidden shadow-2xs">
                          {m.user?.profile_photo ? (
                            <Image
                              src={m.user.profile_photo}
                              alt={name}
                              fill
                              unoptimized
                              sizes="28px"
                              className="object-cover"
                            />
                          ) : (
                            <span>{name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {name} {isMe ? "(You)" : ""}
                          </span>
                          <span className="text-[10px] text-slate-400 block capitalize">
                            {m.role || "Member"}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Inputs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  Settlement Amount ({currencySymbol}) *
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  required
                  value={settlementAmount}
                  onChange={(e) => setSettlementAmount(e.target.value)}
                  className="w-full text-xs font-semibold px-3 h-11 sm:h-9 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  Pre-Closure Penalty / Fees ({currencySymbol})
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  value={foreclosureCharges}
                  onChange={(e) => setForeclosureCharges(e.target.value)}
                  placeholder="0.00 (or waived)"
                  className="w-full text-xs font-semibold px-3 h-11 sm:h-9 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Settlement Date *
                </label>
                <CustomDatePicker
                  value={paymentDate}
                  onChange={(date) => setPaymentDate(date)}
                  required
                  placeholder="Select payment date"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Payment Mode *
                </label>
                <CustomDropdown
                  size="md"
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                  options={paymentMethodOptions}
                  className="w-full"
                  triggerClassName="rounded-xl border-slate-200 h-11 sm:h-9"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                Foreclosure Receipt / UTR Ref
              </label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. UTR-FORECLOSE-9821420"
                className="w-full text-xs px-3 h-11 sm:h-9 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Settlement Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Foreclosed early with annual savings"
                className="w-full text-xs px-3 h-11 sm:h-9 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
            </div>

            {/* Confirmation Note */}
            <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 flex items-start gap-2 text-[11px] text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Foreclosure will settle all remaining {remainingInstalmentsCount} instalments, set the outstanding balance to {currencySymbol}0, and mark this loan commitment as 100% completed.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] sm:min-h-[38px] px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all touch-manipulation cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[44px] sm:min-h-[38px] px-5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5 touch-manipulation"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing Foreclosure...</span>
                  </>
                ) : (
                  <>
                    <Landmark className="w-3.5 h-3.5" />
                    <span>Confirm Foreclosure ({formatCurrency(totalPayable, currency)})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
