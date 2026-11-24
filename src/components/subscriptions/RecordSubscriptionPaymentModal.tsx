"use client";

import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Calendar, CreditCard } from "lucide-react";
import { subscriptionService } from "@/services/subscriptionService";
import { Subscription } from "@/types/subscription";

interface RecordSubscriptionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subscription: Subscription | null;
}

export function RecordSubscriptionPaymentModal({
  isOpen,
  onClose,
  onSuccess,
  subscription,
}: RecordSubscriptionPaymentModalProps) {
  const [amount, setAmount] = useState<number | "">("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [paymentMethod, setPaymentMethod] = useState("Auto-Debit");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (subscription) {
      setAmount(subscription.amount);
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setPaymentMethod(subscription.payment_method || "Auto-Debit");
      setReferenceNumber("");
      setNotes("");
      setErrorMsg(null);
    }
  }, [subscription, isOpen]);

  if (!isOpen || !subscription) return null;

  const currencySymbol =
    subscription.currency === "INR"
      ? "₹"
      : subscription.currency === "USD"
      ? "$"
      : `${subscription.currency} `;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount === "" || Number(amount) <= 0) {
      setErrorMsg("Please enter a valid payment amount.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await subscriptionService.recordPayment(subscription.id, {
        amount: Number(amount),
        payment_date: paymentDate,
        currency: subscription.currency,
        payment_status: "paid",
        reference_number: referenceNumber.trim() || undefined,
        notes: notes.trim() || undefined,
      });

      onSuccess();
      onClose();
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || "Failed to record payment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-emerald-100 max-w-md w-full p-6 shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#02361B] tracking-tight">
              Record Renewal Payment
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {subscription.name} ({subscription.merchant})
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Amount Paid ({subscription.currency}) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-sm font-bold text-slate-400">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : "")}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#02361B] focus:outline-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Payment Date *
            </label>
            <input
              type="date"
              required
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium bg-white"
            >
              <option value="Auto-Debit">Auto-Debit</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="UPI">UPI</option>
              <option value="Net Banking">Net Banking</option>
              <option value="Apple Pay / Google Pay">Apple Pay / Google Pay</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Transaction ID / Ref (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. UPI-TXN-12948210"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium"
            />
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 leading-relaxed">
            <span className="font-semibold text-slate-800">Smart Advance:</span> Saving this payment will log the transaction in your history and automatically advance the next renewal date for your {subscription.billing_cycle} cycle.
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Logging..." : "Confirm Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
