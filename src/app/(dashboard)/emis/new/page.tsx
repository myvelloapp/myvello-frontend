"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  Calendar,
  Bell,
  FileText,
  Shield,
  Upload,
  Info,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export default function AddNewEmiPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    loanName: "",
    loanCategory: "Home Loan",
    bankName: "",
    loanReference: "",
    description: "",
    ownershipType: "personal", // personal vs family_shared
    // Step 2: Financials
    originalAmount: "",
    emiAmount: "",
    interestRate: "",
    processingFee: "",
    currency: "INR",
    // Step 3: Schedule
    loanStartDate: "",
    firstEmiDate: "",
    dueDay: "10",
    tenureMonths: "60",
    frequency: "Monthly",
    // Step 4: Payment & Reminders
    paymentMethod: "Auto Debit",
    autoDebitEnabled: true,
    reminder7Days: true,
    reminder3Days: true,
    reminder1Day: true,
    reminderDueDate: true,
    reminderOverdue: true,
    notes: "",
  });

  const steps = [
    { id: 1, title: "Basic Details", icon: Info },
    { id: 2, title: "Financials", icon: CreditCard },
    { id: 3, title: "Schedule", icon: Calendar },
    { id: 4, title: "Reminders & Vault", icon: Bell },
  ];

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Loan "${formData.loanName || 'New Loan'}" created successfully with monthly schedule generated!`);
      router.push("/emis");
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <Link href="/emis" className="hover:text-slate-600 transition-colors">
            EMI Management
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700 font-semibold">Add New EMI</span>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-[#172554] tracking-tight">
              Add New EMI
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Set up loan parameters and auto-generate the complete instalment calendar.
            </p>
          </div>
          <Link href="/emis">
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to EMIs
            </Button>
          </Link>
        </div>

        {/* Step Indicator Wizard Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          <div className="grid grid-cols-4 gap-2">
            {steps.map((s) => {
              const Icon = s.icon;
              const isPassed = currentStep > s.id;
              const isCurrent = currentStep === s.id;

              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(s.id)}
                  className={cn(
                    "flex flex-col sm:flex-row items-center gap-2.5 p-2 rounded-xl text-center sm:text-left transition-all",
                    isCurrent
                      ? "bg-indigo-50/80 text-indigo-700 font-bold"
                      : isPassed
                      ? "text-emerald-700"
                      : "text-slate-400"
                  )}
                >
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center text-xs shrink-0",
                      isCurrent
                        ? "bg-[#4F46E5] text-white"
                        : isPassed
                        ? "bg-emerald-100 text-emerald-700 font-bold"
                        : "bg-slate-100 text-slate-400"
                    )}
                  >
                    {isPassed ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <span className="text-xs hidden sm:inline-block truncate">
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Multi-Step Wizard Body Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          {/* STEP 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 1: Basic Loan Details</h3>
                <p className="text-xs text-slate-500">Identify your loan institution and privacy sharing scope.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Loan Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Home Loan or MacBook EMI"
                    value={formData.loanName}
                    onChange={(e) => setFormData({ ...formData, loanName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Loan Category *
                  </label>
                  <select
                    value={formData.loanCategory}
                    onChange={(e) => setFormData({ ...formData, loanCategory: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Home Loan">Home Loan</option>
                    <option value="Vehicle Loan">Vehicle Loan (Car/Bike)</option>
                    <option value="Personal Loan">Personal Loan</option>
                    <option value="Education Loan">Education Loan</option>
                    <option value="Gold Loan">Gold Loan</option>
                    <option value="Business Loan">Business Loan</option>
                    <option value="Consumer Durable">Consumer Durable / Gadget</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Lender / Bank / Institution *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HDFC Bank, SBI, ICICI, Bajaj Finserv"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Loan Account Reference / Agreement No.
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC-HL-982310"
                    value={formData.loanReference}
                    onChange={(e) => setFormData({ ...formData, loanReference: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-mono"
                  />
                </div>
              </div>

              {/* Privacy Model Selection matching PRD Section 3.4 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  Record Privacy & Family Visibility Model
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                      formData.ownershipType === "personal"
                        ? "bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs"
                        : "bg-white/60 border-slate-200 hover:bg-white"
                    )}
                  >
                    <input
                      type="radio"
                      name="ownershipType"
                      checked={formData.ownershipType === "personal"}
                      onChange={() => setFormData({ ...formData, ownershipType: "personal" })}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Personal Record (Private)</span>
                      <span className="text-[11px] text-slate-500">
                        Only you can see or manage this loan. Hidden from other family workspace members.
                      </span>
                    </div>
                  </label>

                  <label
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all",
                      formData.ownershipType === "family_shared"
                        ? "bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-xs"
                        : "bg-white/60 border-slate-200 hover:bg-white"
                    )}
                  >
                    <input
                      type="radio"
                      name="ownershipType"
                      checked={formData.ownershipType === "family_shared"}
                      onChange={() => setFormData({ ...formData, ownershipType: "family_shared" })}
                      className="mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-slate-900 block">Family Shared</span>
                      <span className="text-[11px] text-slate-500">
                        Permitted Sharma Family members can see upcoming payments and shared schedules.
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Financial Details */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 2: Financial Values</h3>
                <p className="text-xs text-slate-500">Accurate monetary values recorded with decimal precision.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Original Loan Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 850000"
                    value={formData.originalAmount}
                    onChange={(e) => setFormData({ ...formData, originalAmount: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Monthly EMI Amount (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 14000"
                    value={formData.emiAmount}
                    onChange={(e) => setFormData({ ...formData, emiAmount: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-semibold text-indigo-700 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Interest Rate (% per annum)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 8.5"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Processing Fee (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    value={formData.processingFee}
                    onChange={(e) => setFormData({ ...formData, processingFee: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-semibold"
                  >
                    <option value="INR">INR (₹) - Indian Rupee</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="AED">AED (د.إ) - UAE Dirham</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Schedule & Tenure */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 3: Schedule & Due Day Calculation</h3>
                <p className="text-xs text-slate-500">
                  Calendar algorithm ensures February leap year and month-end dates are calculated accurately.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Loan Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.loanStartDate}
                    onChange={(e) => setFormData({ ...formData, loanStartDate: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    First EMI Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.firstEmiDate}
                    onChange={(e) => setFormData({ ...formData, firstEmiDate: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Monthly Due Day (1 - 31) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    required
                    value={formData.dueDay}
                    onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Loan Tenure (Months) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.tenureMonths}
                    onChange={(e) => setFormData({ ...formData, tenureMonths: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Instalment Frequency
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Monthly"
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs text-amber-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Calendar Correction:</strong> If your monthly due day is the 31st, February due dates will adjust automatically to the 28th (or 29th in leap years) without spilling into March.
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: Reminders & Vault */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Step 4: Payment Preferences & Reminders</h3>
                <p className="text-xs text-slate-500">Configure multi-stage reminder alerts and document attachments.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Primary Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                  >
                    <option value="Auto Debit">Auto Debit (Bank Mandate)</option>
                    <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                    <option value="NetBanking">NetBanking / NEFT</option>
                    <option value="Credit Card">Credit Card</option>
                    <option value="Cash / Cheque">Cash / Cheque</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.autoDebitEnabled}
                      onChange={(e) => setFormData({ ...formData, autoDebitEnabled: e.target.checked })}
                      className="w-4 h-4 rounded text-indigo-600"
                    />
                    <span>Account has Auto-Debit Mandate registered</span>
                  </label>
                </div>
              </div>

              {/* Reminders Toggles matching PRD Section 6.1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <span className="text-xs font-bold text-slate-900 block">
                  Automated Reminder Triggers (Email & In-App)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.reminder7Days}
                      onChange={(e) => setFormData({ ...formData, reminder7Days: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>7 days before due date</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.reminder3Days}
                      onChange={(e) => setFormData({ ...formData, reminder3Days: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>3 days before due date</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.reminder1Day}
                      onChange={(e) => setFormData({ ...formData, reminder1Day: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>1 day before due date</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.reminderDueDate}
                      onChange={(e) => setFormData({ ...formData, reminderDueDate: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>On due date</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.reminderOverdue}
                      onChange={(e) => setFormData({ ...formData, reminderOverdue: e.target.checked })}
                      className="rounded text-indigo-600"
                    />
                    <span>1 day after due date if unpaid</span>
                  </label>
                </div>
              </div>

              {/* Document Upload Area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Supporting Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-700">
                    Upload Loan Agreement or Sanction Letter (PDF, JPG, PNG)
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Files are encrypted and stored in your private digital vault.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Navigation Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" size="sm" onClick={handlePrev} className="gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" />
                Previous Step
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 4 ? (
              <Button type="button" variant="secondary" size="sm" onClick={handleNext} className="gap-1.5">
                Next Step
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            ) : (
              <Button type="submit" variant="secondary" size="sm" isLoading={isSubmitting} className="px-6 gap-2">
                <Check className="w-4 h-4" />
                Generate Schedule & Save EMI
              </Button>
            )}
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
