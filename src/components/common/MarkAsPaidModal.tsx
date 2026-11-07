"use client";

import React, { useState } from "react";
import { X, CheckCircle2, Calendar, CreditCard, Hash, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MockEmi } from "@/lib/mockData";

interface MarkAsPaidModalProps {
  isOpen: boolean;
  onClose: () => void;
  emi: MockEmi | null;
  onSuccess: (paymentData: {
    emiId: number;
    amount: number;
    date: string;
    method: string;
    reference: string;
  }) => void;
}

export function MarkAsPaidModal({
  isOpen,
  onClose,
  emi,
  onSuccess,
}: MarkAsPaidModalProps) {
  const [paymentDate, setPaymentDate] = useState("2025-11-08");
  const [paymentAmount, setPaymentAmount] = useState(emi?.emiAmount ? String(emi.emiAmount) : "18500");
  const [paymentMethod, setPaymentMethod] = useState("Auto Debit");
  const [reference, setReference] = useState("TXN-982142");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  if (!isOpen || !emi) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDone(true);
      setTimeout(() => {
        onSuccess({
          emiId: emi.id,
          amount: Number(paymentAmount),
          date: paymentDate,
          method: paymentMethod,
          reference: reference,
        });
        setIsDone(false);
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">Mark EMI as Paid</h3>
            <p className="text-xs text-slate-500">
              Record external payment for <span className="font-medium text-slate-700">{emi.loanName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {isDone ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Payment Successfully Recorded!</h4>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              Schedule updated, remaining instalments recalculated, and entry saved to Payment History.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                  ₹
                </span>
                <div>
                  <div className="font-semibold text-slate-800">{emi.loanName} ({emi.bankName})</div>
                  <div className="text-slate-500">Scheduled Due Date: {emi.nextDueDate}</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-indigo-700">₹{emi.emiAmount.toLocaleString()}</span>
                <div className="text-[10px] text-slate-400">Monthly instalment</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                  Amount Paid (₹)
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/30 font-semibold text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="Auto Debit">Auto Debit (Bank Mandate)</option>
                  <option value="UPI Transfer">UPI (GPay / PhonePe / Paytm)</option>
                  <option value="NetBanking">NetBanking / NEFT / RTGS</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Cheque / Cash">Cheque / Cash</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Transaction Ref / UTR
                </label>
                <input
                  type="text"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  placeholder="e.g. UTR-9821420"
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Notes (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Debited from salary account"
                className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
              <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                This marks your external payment in Myvello for schedule calculation. It does not initiate real bank transactions.
              </span>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" size="sm" isLoading={isSubmitting} className="px-5">
                Confirm & Mark Paid
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
