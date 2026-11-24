"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar, DollarSign, Bell, CreditCard, Shield, Users } from "lucide-react";
import { subscriptionService } from "@/services/subscriptionService";
import { Subscription, SubscriptionCategory } from "@/types/subscription";
import { useWorkspace } from "@/context/WorkspaceContext";

interface AddEditSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  subscriptionToEdit?: Subscription | null;
  initialData?: Partial<Subscription> | null;
}

export function AddEditSubscriptionModal({
  isOpen,
  onClose,
  onSuccess,
  subscriptionToEdit,
  initialData,
}: AddEditSubscriptionModalProps) {
  const { activeWorkspace, workspaces } = useWorkspace();
  const [categories, setCategories] = useState<SubscriptionCategory[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [merchant, setMerchant] = useState("");
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [currency, setCurrency] = useState("INR");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Auto-Debit");
  const [autoRenewal, setAutoRenewal] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderDays, setReminderDays] = useState<number[]>([1, 3, 7]);
  const [ownershipType, setOwnershipType] = useState<"personal" | "family_shared">("personal");
  const [familyId, setFamilyId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    subscriptionService.getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    if (subscriptionToEdit) {
      setName(subscriptionToEdit.name);
      setMerchant(subscriptionToEdit.merchant);
      setCategoryId(subscriptionToEdit.category_id || "");
      setAmount(subscriptionToEdit.amount);
      setCurrency(subscriptionToEdit.currency);
      setBillingCycle(subscriptionToEdit.billing_cycle);
      setStartDate(subscriptionToEdit.start_date);
      setNextPaymentDate(subscriptionToEdit.next_payment_date);
      setPaymentMethod(subscriptionToEdit.payment_method || "Auto-Debit");
      setAutoRenewal(subscriptionToEdit.auto_renewal);
      setReminderEnabled(subscriptionToEdit.reminder_enabled);
      setReminderDays(subscriptionToEdit.reminder_days_before || [1, 3, 7]);
      setOwnershipType(subscriptionToEdit.ownership_type);
      setFamilyId(subscriptionToEdit.family_id || null);
      setNotes(subscriptionToEdit.notes || "");
    } else if (initialData) {
      setName(initialData.name || initialData.merchant || "");
      setMerchant(initialData.merchant || "");
      setAmount(initialData.amount || "");
      setCurrency(initialData.currency || "INR");
      setBillingCycle(initialData.billing_cycle || "monthly");
      setStartDate(initialData.start_date || new Date().toISOString().split("T")[0]);
      setNextPaymentDate(initialData.next_payment_date || "");
      setOwnershipType(initialData.ownership_type || "personal");
      setFamilyId(initialData.family_id || null);
      setNotes(initialData.notes || "");
    } else {
      // Defaults
      setName("");
      setMerchant("");
      setCategoryId(categories[0]?.id || "");
      setAmount("");
      setCurrency("INR");
      setBillingCycle("monthly");
      const today = new Date().toISOString().split("T")[0];
      setStartDate(today);
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      setNextPaymentDate(nextMonth.toISOString().split("T")[0]);
      setPaymentMethod("Auto-Debit");
      setAutoRenewal(true);
      setReminderEnabled(true);
      setReminderDays([1, 3, 7]);
      setOwnershipType(activeWorkspace?.type === "family" ? "family_shared" : "personal");
      setFamilyId(activeWorkspace?.type === "family" ? Number(activeWorkspace.id) : null);
      setNotes("");
    }
  }, [subscriptionToEdit, initialData, isOpen, categories, activeWorkspace]);

  if (!isOpen) return null;

  const toggleReminderDay = (day: number) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter((d) => d !== day));
    } else {
      setReminderDays([...reminderDays, day].sort((a, b) => b - a));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !merchant.trim() || amount === "") {
      setErrorMsg("Please fill in the subscription name, merchant, and amount.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload: Partial<Subscription> = {
      name: name.trim(),
      merchant: merchant.trim(),
      category_id: categoryId ? Number(categoryId) : null,
      amount: Number(amount),
      currency,
      billing_cycle: billingCycle as any,
      start_date: startDate,
      next_payment_date: nextPaymentDate || startDate,
      payment_method: paymentMethod,
      auto_renewal: autoRenewal,
      reminder_enabled: reminderEnabled,
      reminder_days_before: reminderDays,
      ownership_type: ownershipType,
      family_id: ownershipType === "family_shared" ? familyId : null,
      notes: notes.trim() || null,
    };

    try {
      if (subscriptionToEdit) {
        await subscriptionService.updateSubscription(subscriptionToEdit.id, payload);
      } else {
        await subscriptionService.createSubscription(payload);
      }
      onSuccess();
      onClose();
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || "Failed to save subscription.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-emerald-100 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-black text-[#02361B] tracking-tight mb-1">
          {subscriptionToEdit ? "Edit Subscription" : "Add Recurring Subscription"}
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          Track recurring commitments, renewals, and automated payment alerts.
        </p>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-100">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subscription Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Netflix Premium 4K"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Merchant / Provider *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Netflix"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                placeholder="649.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? parseFloat(e.target.value) : "")}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-bold text-[#02361B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium bg-white"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Billing Cycle
              </label>
              <select
                value={billingCycle}
                onChange={(e) => setBillingCycle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium bg-white"
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="quarterly">Quarterly</option>
                <option value="half_yearly">Half-Yearly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : "")}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium bg-white"
              >
                <option value="">Select Category...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Next Renewal Date *
              </label>
              <input
                type="date"
                required
                value={nextPaymentDate}
                onChange={(e) => setNextPaymentDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium"
              />
            </div>
          </div>

          {/* Reminders section */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#02361B] flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5 text-emerald-600" />
                Renewal Reminders
              </span>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={reminderEnabled}
                  onChange={(e) => setReminderEnabled(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                Enable Reminders
              </label>
            </div>

            {reminderEnabled && (
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[11px] text-slate-500 font-medium">Alert me:</span>
                {[7, 3, 1].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleReminderDay(day)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      reminderDays.includes(day)
                        ? "bg-emerald-600 text-white border-emerald-600"
                        : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {day === 1 ? "1 day before" : `${day} days before`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Shared with brother, billing tied to HDFC card"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-emerald-600 font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : subscriptionToEdit ? "Update Subscription" : "Create Subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
