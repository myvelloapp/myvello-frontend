"use client";

import React, { useState, useMemo, useEffect } from "react";
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
  Sparkles,
  Zap,
  Clock,
  Users,
  CheckCircle2,
  History,
  Building2,
  AlertCircle,
  AlertTriangle,
  Lock,
  X,
} from "lucide-react";
import { useAuth } from "@/modules/authentication/AuthContext";
import { getCurrencyInfo, getCurrencySymbol } from "@/lib/currencyTimezoneData";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import { emiService } from "@/services/emiService";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { formatAmount } from "@/lib/formatters";
import { BankSelector } from "@/components/ui/BankSelector";
import { BankLogo } from "@/components/ui/BankLogo";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { TenureInput } from "@/components/ui/TenureInput";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MemberAvatarStack } from "@/components/common/MemberAvatarStack";
import {
  LOAN_CATEGORY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  CURRENCY_OPTIONS,
  getCategoryIcon,
} from "@/lib/categoryConfig";

const loanCategoryOptions = LOAN_CATEGORY_OPTIONS;
const newEmiCurrencyOptions = CURRENCY_OPTIONS;
const newEmiPaymentMethodOptions = PAYMENT_METHOD_OPTIONS;

const standardRatesByCategory: Record<string, number> = {
  "Home Loan": 8.5,
  "Vehicle Loan": 8.85,
  "Personal Loan": 11.5,
  "Education Loan": 9.25,
  "Consumer Durable": 0.0,
  "Gold Loan": 9.0,
  "Business Loan": 12.0,
  Other: 10.0,
};

// Standard banking reducing-balance amortization formula
function calculateEmi(principal: number, annualRate: number, tenureMonths: number): number {
  if (!principal || principal <= 0 || !tenureMonths || tenureMonths <= 0) return 0;
  if (!annualRate || annualRate <= 0) {
    return Math.round(principal / tenureMonths);
  }
  const monthlyRate = annualRate / (12 * 100);
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * factor) / (factor - 1);
  return Math.round(emi);
}

// Predict next monthly due date based on start date and chosen due day
function getNextDueDate(startDateStr: string, dueDayNum: number): string {
  try {
    const start = new Date(startDateStr || new Date().toISOString().slice(0, 10));
    let year = start.getFullYear();
    let month = start.getMonth() + 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
    const safeDay = Math.min(Math.max(1, dueDayNum || 10), 28);
    const d = new Date(year, month, safeDay);
    return d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
}

// Quick due day options
const QUICK_DUE_DAYS = ["5", "10", "15", "20", "25", "30"];

// High-fidelity shimmer skeleton matching exact geometry of the add EMI wizard (CLS = 0)
function NewEmiSkeleton() {
  return (
    <div className="relative -mt-18 pt-20 pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 min-h-dvh overflow-x-hidden select-none">
      {/* Living Brand Gradient Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#F0F5FF]/80 to-[#F0F5FF]" />
      </div>

      <div className="relative z-10 max-w-[1500px] mx-auto space-y-5 sm:space-y-6 animate-pulse">
        {/* Page Heading & Back Action Skeleton */}
        {/* Mobile Skeleton: Single compact row */}
        <div className="sm:hidden flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="h-5 w-32 bg-slate-200/80 rounded" />
            <div className="h-3 w-28 bg-slate-200/50 rounded" />
          </div>
          <div className="h-6 w-12 rounded-full bg-slate-200/60 shrink-0" />
        </div>

        {/* Mobile Progress Bar Skeleton */}
        <div className="sm:hidden grid grid-cols-4 gap-1.5 -mt-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-1.5 rounded-full bg-slate-200/70" />
          ))}
        </div>

        {/* Desktop Heading Skeleton */}
        <div className="hidden sm:flex sm:items-center justify-between gap-3">
          <div className="space-y-2">
            <div className="h-8 w-44 bg-slate-200/80 rounded-xl" />
          </div>
          <div className="h-9 w-32 bg-slate-200/70 rounded-xl self-start sm:self-auto" />
        </div>

        {/* Two-Column Form & Real-Time Automation Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left: Multi-Step Interactive Form (7/8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Step Indicator Wizard Bar (Desktop Only) */}
            <div className="hidden sm:block bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {[1, 2, 3, 4].map((s) => (
                  <div key={s} className="h-10 rounded-xl bg-slate-100 flex items-center gap-2 px-3">
                    <div className="w-5 h-5 rounded-lg bg-slate-200 shrink-0" />
                    <div className="h-3 w-16 bg-slate-200/70 rounded hidden sm:block" />
                  </div>
                ))}
              </div>
            </div>

            {/* Main Step Form Container */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.06)] space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div className="h-5 w-52 bg-slate-200/80 rounded" />
                <div className="h-5 w-16 bg-slate-200/60 rounded-full" />
              </div>

              {/* Mode Selector Tabs */}
              <div className="p-1 rounded-xl bg-slate-100 inline-flex items-center gap-1">
                <div className="h-8 w-36 bg-white rounded-lg shadow-2xs" />
                <div className="h-8 w-36 bg-slate-200/60 rounded-lg" />
              </div>

              {/* Input Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-36 bg-slate-200/70 rounded" />
                  <div className="h-10 w-full bg-slate-100 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-slate-200/70 rounded" />
                  <div className="h-10 w-full bg-slate-100 rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-44 bg-slate-200/70 rounded" />
                  <div className="h-10 w-full bg-slate-100 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-slate-200/70 rounded" />
                  <div className="h-10 w-full bg-slate-100 rounded-xl" />
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="h-10 w-28 bg-slate-100 rounded-xl" />
                <div className="h-10 w-32 bg-slate-200/80 rounded-xl" />
              </div>
            </div>
          </div>

          {/* Right: Live Preview Sidebar (Desktop Only: hidden lg:block) */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.06)] space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-200/80 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-3 w-24 bg-slate-200/60 rounded" />
                    <div className="h-4 w-32 bg-slate-200/80 rounded" />
                  </div>
                </div>
                <div className="h-5 w-24 bg-slate-200/60 rounded-full" />
              </div>

              {/* Big Monthly EMI Box */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-center space-y-2">
                <div className="h-3 w-28 bg-slate-200/60 rounded mx-auto" />
                <div className="h-8 w-36 bg-slate-200/80 rounded mx-auto" />
                <div className="h-3 w-40 bg-slate-200/50 rounded mx-auto" />
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-slate-200/60 rounded" />
                  <div className="h-3 w-20 bg-slate-200/60 rounded" />
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full" />
              </div>

              {/* Financial Summary Rows */}
              <div className="divide-y divide-slate-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-2.5 flex items-center justify-between">
                    <div className="h-3 w-28 bg-slate-200/60 rounded" />
                    <div className="h-3.5 w-20 bg-slate-200/70 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AddNewEmiPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuth();
  const { families, isLoading: isWorkspaceLoading } = useWorkspace();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoCalculateEmi, setAutoCalculateEmi] = useState(true);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // Cold load state guard for zero layout shift (CLS = 0)
  const isColdLoading = (isAuthLoading || isWorkspaceLoading) && !user;

  const vaultCurrency = user?.preferred_currency || "INR";
  const vaultCurrencySymbol = useMemo(() => getCurrencySymbol(vaultCurrency), [vaultCurrency]);
  const vaultCurrencyInfo = useMemo(() => getCurrencyInfo(vaultCurrency), [vaultCurrency]);

  // Loan Modes
  const [loanMode, setLoanMode] = useState<"new" | "running">("new");
  const [hasBrokenPeriod, setHasBrokenPeriod] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    loanName: "",
    loanCategory: "Home Loan",
    bankName: "",
    loanReference: "",
    description: "",
    ownershipType: "personal",
    familyId: null as number | null,
    // Step 2: Financials & Tenure
    originalAmount: "",
    tenureMonths: "",
    interestRate: "",
    emiAmount: "",
    processingFee: "",
    processingFeeType: "deducted" as "deducted" | "financed",
    firstEmiAmount: "",
    firstEmiType: "bpi" as "bpi" | "reamortize",
    currency: vaultCurrency,
    // Step 3: Schedule & Lifecycle
    loanStartDate: todayStr,
    firstEmiDate: getNextDueDate(todayStr, 10),
    dueDay: "10",
    paidEmisCount: "", // For Existing / Running loans
    frequency: "Monthly",
    // Step 4: Payment & Automation
    paymentMethod: "Auto Debit",
    autoDebitEnabled: true,
    debitBankName: "",
    debitAccountNumber: "",
    reminder7Days: true,
    reminder3Days: true,
    reminder1Day: true,
    reminderDueDate: true,
    notes: "",
  });

  const selectedFamily = useMemo(() => {
    return families.find((f) => f.id === formData.familyId) || families[0];
  }, [families, formData.familyId]);

  // Track if user manually set the loan name
  const [isCustomLoanName, setIsCustomLoanName] = useState(false);

  // Keep form currency locked to user's vault baseline without triggering unnecessary re-renders
  useEffect(() => {
    if (user?.preferred_currency) {
      setFormData((prev) => {
        if (prev.currency === user.preferred_currency) return prev;
        return { ...prev, currency: user.preferred_currency };
      });
    }
  }, [user?.preferred_currency]);

  // Auto-name helper when Bank or Category changes (if user hasn't typed custom name)
  useEffect(() => {
    if (!isCustomLoanName && formData.bankName) {
      const autoName = `${formData.bankName} ${formData.loanCategory}`;
      setFormData((prev) => {
        if (prev.loanName === autoName) return prev;
        return { ...prev, loanName: autoName };
      });
    }
  }, [formData.bankName, formData.loanCategory, isCustomLoanName]);

  // Automatically update firstEmiDate when loanStartDate or dueDay changes with equality guard
  useEffect(() => {
    const nextDue = getNextDueDate(formData.loanStartDate, parseInt(formData.dueDay, 10) || 10);
    if (nextDue) {
      setFormData((prev) => {
        if (prev.firstEmiDate === nextDue) return prev;
        return { ...prev, firstEmiDate: nextDue };
      });
    }
  }, [formData.loanStartDate, formData.dueDay]);

  // Live Comprehensive Financial & Amortization Calculations
  const principalNum = parseFloat(formData.originalAmount) || 0;
  const rateNum = parseFloat(formData.interestRate) || 0;
  const tenureNum = parseInt(formData.tenureMonths, 10) || 0;
  const feeNum = parseFloat(formData.processingFee) || 0;

  // Processing fee impact
  const isFeeFinanced = feeNum > 0 && formData.processingFeeType === "financed";
  const effectivePrincipal = isFeeFinanced ? principalNum + feeNum : principalNum;
  const netDisbursedAmount =
    feeNum > 0 && formData.processingFeeType === "deducted"
      ? Math.max(0, principalNum - feeNum)
      : principalNum;

  // Standard regular EMI on effective principal
  const standardEmi = useMemo(() => {
    return calculateEmi(effectivePrincipal, rateNum, tenureNum);
  }, [effectivePrincipal, rateNum, tenureNum]);

  // Base EMI without processing fee (for comparison badge)
  const baseEmiWithoutFee = useMemo(() => {
    return calculateEmi(principalNum, rateNum, tenureNum);
  }, [principalNum, rateNum, tenureNum]);

  // Odd days & estimated Broken Period Interest (BPI)
  const { oddDays, estimatedBpi } = useMemo(() => {
    let days = 0;
    try {
      if (formData.loanStartDate && formData.firstEmiDate) {
        const d1 = new Date(formData.loanStartDate).getTime();
        const d2 = new Date(formData.firstEmiDate).getTime();
        const diff = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        days = Math.max(0, diff - 30);
      }
    } catch {}
    if (days <= 0) days = 15;
    const daily = rateNum / (365 * 100);
    const bpi = Math.round(effectivePrincipal * daily * days);
    return { oddDays: days, estimatedBpi: bpi };
  }, [formData.loanStartDate, formData.firstEmiDate, rateNum, effectivePrincipal]);

  // First EMI amount & Subsequent EMI amount
  const { firstMonthEmi, subsequentMonthlyEmi, monthlySavings } = useMemo(() => {
    if (!hasBrokenPeriod || tenureNum <= 1) {
      return { firstMonthEmi: standardEmi, subsequentMonthlyEmi: standardEmi, monthlySavings: 0 };
    }

    const userTyped = parseFloat(formData.firstEmiAmount) || 0;

    if (formData.firstEmiType === "bpi") {
      // Broken Period Interest added to Month 1; subsequent months remain standard
      const m1 = userTyped > 0 ? userTyped : standardEmi + estimatedBpi;
      return { firstMonthEmi: m1, subsequentMonthlyEmi: standardEmi, monthlySavings: 0 };
    } else {
      // Re-amortization mode: Higher Month 1 payment lowers remaining (tenure - 1) months
      const monthlyRate = rateNum / (12 * 100);
      const m1Interest = Math.round(effectivePrincipal * monthlyRate);
      const m1 = userTyped > 0 ? userTyped : Math.round(standardEmi * 1.5);

      if (m1 > m1Interest) {
        const m1PrincipalReduction = m1 - m1Interest;
        const remainingPrincipal = Math.max(0, effectivePrincipal - m1PrincipalReduction);
        const remMonths = tenureNum - 1;
        const reamortizedEmi = calculateEmi(remainingPrincipal, rateNum, remMonths);
        const savings = Math.max(0, standardEmi - reamortizedEmi);
        return { firstMonthEmi: m1, subsequentMonthlyEmi: reamortizedEmi, monthlySavings: savings };
      }
      return { firstMonthEmi: m1, subsequentMonthlyEmi: standardEmi, monthlySavings: 0 };
    }
  }, [
    hasBrokenPeriod,
    tenureNum,
    formData.firstEmiAmount,
    formData.firstEmiType,
    standardEmi,
    estimatedBpi,
    rateNum,
    effectivePrincipal,
  ]);

  // Sync computed EMI to formData when auto-calculate is active with equality diffing
  useEffect(() => {
    if (autoCalculateEmi) {
      if (subsequentMonthlyEmi > 0) {
        const nextVal = subsequentMonthlyEmi.toString();
        setFormData((prev) => (prev.emiAmount === nextVal ? prev : { ...prev, emiAmount: nextVal }));
      } else if (!formData.originalAmount || !formData.tenureMonths) {
        setFormData((prev) => (prev.emiAmount === "" ? prev : { ...prev, emiAmount: "" }));
      }
    }
  }, [subsequentMonthlyEmi, autoCalculateEmi, formData.originalAmount, formData.tenureMonths]);

  // Running Loan Paid Count & Calculations
  const paidCountNum = useMemo(() => {
    if (loanMode !== "running") return 0;
    const count = parseInt(formData.paidEmisCount, 10);
    return isNaN(count) || count < 0 ? 0 : count;
  }, [loanMode, formData.paidEmisCount]);

  const remainingMonths = Math.max(0, tenureNum - paidCountNum);
  const runningProgressPct = tenureNum > 0 ? Math.round((paidCountNum / tenureNum) * 100) : 0;

  // Estimated Outstanding Principal for running loan
  const estimatedRemainingPrincipal = useMemo(() => {
    if (paidCountNum <= 0 || tenureNum <= 0 || principalNum <= 0) return effectivePrincipal;
    const ratio = Math.max(0, (tenureNum - paidCountNum) / tenureNum);
    return Math.round(effectivePrincipal * ratio);
  }, [effectivePrincipal, paidCountNum, tenureNum]);

  // Computed Financial Totals
  const activeEmiNum = parseFloat(formData.emiAmount) || subsequentMonthlyEmi || 0;
  const totalPayable = useMemo(() => {
    if (!tenureNum || tenureNum <= 0) return 0;
    if (hasBrokenPeriod && tenureNum > 1) {
      return firstMonthEmi + activeEmiNum * (tenureNum - 1);
    }
    return activeEmiNum * tenureNum;
  }, [tenureNum, hasBrokenPeriod, firstMonthEmi, activeEmiNum]);

  const totalInterest = Math.max(0, totalPayable - effectivePrincipal);
  const totalCostOfLoan =
    totalPayable + (feeNum > 0 && formData.processingFeeType === "deducted" ? feeNum : 0);
  const principalPct = totalPayable > 0 ? Math.round((effectivePrincipal / totalPayable) * 100) : 0;
  const interestPct = totalPayable > 0 ? 100 - principalPct : 0;

  // Maturity Date Prediction
  const maturityDateStr = useMemo(() => {
    if (!tenureNum || tenureNum <= 0) return "—";
    try {
      const d = new Date(formData.loanStartDate || todayStr);
      d.setMonth(d.getMonth() + tenureNum);
      return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    } catch {
      return "—";
    }
  }, [formData.loanStartDate, tenureNum, todayStr]);

  const steps = [
    { id: 1, title: "Loan Details", icon: Building2 },
    { id: 2, title: "Financials", icon: CreditCard },
    { id: 3, title: "Schedule", icon: Calendar },
    { id: 4, title: "Preferences", icon: Zap },
  ];

  // Inline Field Validation Errors State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);

  const clearError = (field: string) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  // Step Validation before progressing (Populates inline errors in red under fields)
  const validateCurrentStep = (step: number): boolean => {
    const newErrors: Record<string, string> = { ...errors };

    if (step === 1) {
      delete newErrors.bankName;
      delete newErrors.loanName;
      if (!formData.bankName.trim()) {
        newErrors.bankName = "Please select or enter the lender / bank name.";
      }
      if (!formData.loanName.trim()) {
        newErrors.loanName = "Please enter the loan commitment name.";
      }
    } else if (step === 2) {
      delete newErrors.originalAmount;
      delete newErrors.tenureMonths;
      delete newErrors.emiAmount;
      delete newErrors.firstEmiAmount;

      if (!principalNum || principalNum <= 0) {
        newErrors.originalAmount = "Please enter a valid loan principal amount.";
      }
      if (!tenureNum || tenureNum <= 0) {
        newErrors.tenureMonths = "Please specify the loan tenure in months.";
      }
      if (!activeEmiNum || activeEmiNum <= 0) {
        newErrors.emiAmount = "Please enter or compute a valid monthly EMI amount.";
      }
      if (hasBrokenPeriod && (!formData.firstEmiAmount || parseFloat(formData.firstEmiAmount) <= 0)) {
        newErrors.firstEmiAmount = "Please enter the actual 1st month EMI amount or uncheck Broken Period Interest.";
      }
    } else if (step === 3) {
      delete newErrors.dueDay;
      delete newErrors.loanStartDate;
      delete newErrors.firstEmiDate;
      delete newErrors.paidEmisCount;

      const dueDayVal = parseInt(formData.dueDay, 10);
      if (isNaN(dueDayVal) || dueDayVal < 1 || dueDayVal > 31) {
        newErrors.dueDay = "Please enter a valid monthly due day between 1 and 31.";
      }
      if (!formData.loanStartDate) {
        newErrors.loanStartDate = "Please select the loan start date.";
      }
      if (!formData.firstEmiDate) {
        newErrors.firstEmiDate = "Please select the first EMI due date.";
      }
      if (loanMode === "running") {
        if (formData.paidEmisCount === "" || paidCountNum < 0) {
          newErrors.paidEmisCount = "Please enter how many EMIs have already been paid (0 or more).";
        } else if (paidCountNum > tenureNum) {
          newErrors.paidEmisCount = "Paid EMIs count cannot exceed the total loan tenure.";
        }
      }
    } else if (step === 4) {
      delete newErrors.debitBankName;
      if (
        formData.paymentMethod === "Auto Debit" &&
        !formData.debitBankName.trim()
      ) {
        newErrors.debitBankName = "Please select or enter the bank account from which auto-debit will be deducted.";
      }
    }

    setErrors(newErrors);

    if (step === 1) return !newErrors.bankName && !newErrors.loanName;
    if (step === 2) return !newErrors.originalAmount && !newErrors.tenureMonths && !newErrors.emiAmount && !newErrors.firstEmiAmount;
    if (step === 3) return !newErrors.dueDay && !newErrors.loanStartDate && !newErrors.firstEmiDate && !newErrors.paidEmisCount;
    if (step === 4) return !newErrors.debitBankName;
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep((prev) => Math.min(4, prev + 1));
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => Math.max(1, prev - 1));
    }
  };

  const handleApplyStandardRate = (category: string) => {
    const rate = standardRatesByCategory[category] ?? 10.0;
    setFormData((prev) => ({ ...prev, interestRate: rate.toString() }));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Strict guard: If user is not yet on Step 4 (Preferences), advance to next step and NEVER save
    if (currentStep < 4) {
      handleNext();
      return;
    }

    if (
      !validateCurrentStep(1) ||
      !validateCurrentStep(2) ||
      !validateCurrentStep(3) ||
      !validateCurrentStep(4)
    ) {
      return;
    }

    setIsSubmitting(true);
    setFormError(null);
    try {
      const activeReminderDays: number[] = [];
      if (formData.reminder7Days) activeReminderDays.push(7);
      if (formData.reminder3Days) activeReminderDays.push(3);
      if (formData.reminder1Day) activeReminderDays.push(1);
      if (formData.reminderDueDate) activeReminderDays.push(0);

      const sanitizeText = (val: string) => val.replace(/<[^>]*>?/gm, "").trim();

      await emiService.createEmi({
        loan_name: sanitizeText(formData.loanName) || `${sanitizeText(formData.bankName)} ${formData.loanCategory}`,
        loan_category: formData.loanCategory || "Home Loan",
        lender_name: sanitizeText(formData.bankName) || "Financial Institution",
        loan_reference: formData.loanReference ? sanitizeText(formData.loanReference) : undefined,
        description: formData.description ? sanitizeText(formData.description) : undefined,
        original_loan_amount: principalNum,
        emi_amount: activeEmiNum,
        interest_rate: rateNum > 0 ? rateNum : undefined,
        processing_fee: feeNum > 0 ? feeNum : undefined,
        processing_fee_type: feeNum > 0 ? formData.processingFeeType : undefined,
        outstanding_principal: loanMode === "running" && paidCountNum > 0 ? estimatedRemainingPrincipal : undefined,
        currency: formData.currency || "INR",
        loan_start_date: formData.loanStartDate || todayStr,
        first_emi_date: formData.firstEmiDate || todayStr,
        due_day: parseInt(formData.dueDay, 10) || 10,
        loan_tenure_months: tenureNum,
        total_emis: tenureNum,
        paid_emis_count: paidCountNum > 0 ? paidCountNum : undefined,
        first_emi_amount: hasBrokenPeriod ? firstMonthEmi : undefined,
        first_emi_type: hasBrokenPeriod ? formData.firstEmiType : undefined,
        net_disbursed_amount: netDisbursedAmount,
        payment_method: formData.paymentMethod || "Auto Debit",
        debit_bank_name:
          formData.paymentMethod === "Auto Debit" || formData.autoDebitEnabled
            ? (formData.debitBankName ? sanitizeText(formData.debitBankName) : undefined)
            : undefined,
        debit_account_number:
          formData.paymentMethod === "Auto Debit" || formData.autoDebitEnabled
            ? (formData.debitAccountNumber ? sanitizeText(formData.debitAccountNumber) : undefined)
            : undefined,
        reminder_enabled: true,
        reminder_days_before: activeReminderDays.length > 0 ? activeReminderDays : [1, 3],
        ownership_type: formData.ownershipType as "personal" | "family_shared",
        family_id:
          formData.ownershipType === "family_shared"
            ? formData.familyId || (families.length > 0 ? families[0].id : undefined)
            : undefined,
        notes: formData.notes ? sanitizeText(formData.notes) : undefined,
      });

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("myvello:refresh_emis"));
        window.dispatchEvent(new CustomEvent("myvello:live_data_update"));
      }

      router.push("/emis");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setFormError(errorObj.response?.data?.message || "Failed to create EMI. Please verify all fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable Theme Input Class with Red Error Styling
  const inputClass =
    "w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm px-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 font-semibold shadow-2xs touch-manipulation";

  const getInputClass = (hasError?: boolean, extra?: string) =>
    cn(
      "w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm px-3.5 rounded-xl border transition-all placeholder:text-slate-400 font-semibold shadow-2xs focus:outline-none touch-manipulation",
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20 text-rose-900"
        : "border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900",
      extra
    );

  if (isColdLoading) {
    return (
      <DashboardLayout>
        <NewEmiSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative -mt-18 pt-20 pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 min-h-dvh overflow-x-hidden select-none">
        {/* Living Brand Gradient Backdrop matching /emis */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#F0F5FF]/80 to-[#F0F5FF]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-6">
          {/* Mobile Header & Progress Track */}
          <div className="sm:hidden space-y-2.5">
            <div className="flex items-center justify-between gap-2.5">
              <div className="min-w-0">
                <h1 className="text-lg font-black tracking-tight text-[#0B132B] truncate">
                  Add New EMI
                </h1>
                <p className="text-[11px] font-bold text-indigo-600 truncate">
                  Step {currentStep} of 4: {steps[currentStep - 1]?.title}
                </p>
              </div>

              {/* Step Completion Badge */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs">
                  {currentStep === 1 ? "25%" : currentStep === 2 ? "50%" : currentStep === 3 ? "75%" : "100%"}
                </span>
              </div>
            </div>

            {/* 4-Segment Slim Progress Bar Track */}
            <div className="grid grid-cols-4 gap-1.5 pt-0.5">
              {steps.map((s) => {
                const isPassed = currentStep > s.id;
                const isCurrent = currentStep === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (s.id <= currentStep) {
                        setCurrentStep(s.id);
                      } else {
                        let canProceed = true;
                        for (let stepIdx = 1; stepIdx < s.id; stepIdx++) {
                          if (!validateCurrentStep(stepIdx)) {
                            canProceed = false;
                            setCurrentStep(stepIdx);
                            break;
                          }
                        }
                        if (canProceed) {
                          setCurrentStep(s.id);
                        }
                      }
                    }}
                    className="group flex flex-col gap-1 cursor-pointer text-left focus:outline-none"
                    aria-label={`Step ${s.id}: ${s.title}`}
                  >
                    <div
                      className={cn(
                        "h-1.5 w-full rounded-full transition-all duration-300",
                        isCurrent
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 shadow-xs shadow-indigo-500/30"
                          : isPassed
                          ? "bg-emerald-500"
                          : "bg-slate-200"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] font-bold truncate transition-colors",
                        isCurrent
                          ? "text-indigo-600 font-black"
                          : isPassed
                          ? "text-slate-600 font-semibold"
                          : "text-slate-400 font-medium"
                      )}
                    >
                      {s.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Desktop Page Heading & Back Action (Hidden on Mobile) */}
          <div className="hidden sm:flex sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0B132B]">
                Add New EMI
              </h1>
            </div>

            <Link href="/emis">
              <button
                type="button"
                className="h-9 min-h-[36px] inline-flex items-center gap-1.5 px-3.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Back to EMIs</span>
              </button>
            </Link>
          </div>

          {/* Two-Column Form & Real-Time Automation Preview Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Left: Multi-Step Interactive Form (7 of 12 cols / 8 of 12 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              {/* Minimal Step Indicator Wizard Bar (Desktop Only) */}
              <div className="hidden sm:block bg-white rounded-2xl border border-slate-200/80 p-2 shadow-2xs">
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                  {steps.map((s) => {
                    const isPassed = currentStep > s.id;
                    const isCurrent = currentStep === s.id;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          if (s.id <= currentStep) {
                            setCurrentStep(s.id);
                          } else {
                            let canProceed = true;
                            for (let stepIdx = 1; stepIdx < s.id; stepIdx++) {
                              if (!validateCurrentStep(stepIdx)) {
                                canProceed = false;
                                setCurrentStep(stepIdx);
                                break;
                              }
                            }
                            if (canProceed) {
                              setCurrentStep(s.id);
                            }
                          }
                        }}
                        className={cn(
                          "flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5 px-2 sm:px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[40px] rounded-xl text-xs transition-all cursor-pointer select-none active:scale-95 touch-manipulation",
                          isCurrent
                            ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                            : isPassed
                            ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60"
                            : "text-slate-400 hover:text-slate-700 hover:bg-slate-50 font-semibold"
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 transition-colors",
                            isCurrent
                              ? "bg-white/25 text-white"
                              : isPassed
                              ? "bg-emerald-200/70 text-emerald-800"
                              : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : s.id}
                        </div>
                        <span className="hidden sm:inline-block font-bold tracking-tight truncate">
                          {s.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Live EMI Quick-Bar / Capsule */}
              <div className="lg:hidden bg-white rounded-2xl border border-indigo-100/90 p-3 shadow-xs">
                <div className="flex items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      {formData.bankName ? (
                        <BankLogo bankName={formData.bankName} size="sm" />
                      ) : (
                        getCategoryIcon(formData.loanCategory)
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                        {formData.bankName || formData.loanCategory || "EMI Estimate"}
                      </span>
                      <div className="text-sm font-black text-[#0B132B] truncate flex items-baseline gap-1">
                        <span>
                          {activeEmiNum > 0
                            ? `${vaultCurrencySymbol}${formatAmount(activeEmiNum, vaultCurrency)}`
                            : `${vaultCurrencySymbol}0`}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">/ mo</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsMobilePreviewOpen(true)}
                    className="h-8 min-h-[32px] inline-flex items-center gap-1 px-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all cursor-pointer shrink-0 active:scale-95 border border-indigo-100/80"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>Breakdown</span>
                    <ChevronRight className="w-3 h-3 text-indigo-500" />
                  </button>
                </div>
              </div>

              {/* Main Step Form Container */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (currentStep < 4) {
                    handleNext();
                  } else {
                    handleSubmit(e);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.target as HTMLElement).tagName === "INPUT") {
                    e.preventDefault();
                    if (currentStep < 4) {
                      handleNext();
                    } else {
                      handleSubmit();
                    }
                  }
                }}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.06)] space-y-5"
              >
                {/* Global Form Error Banner (if API returns error) */}
                {formError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2 animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* STEP 1: Loan & Institution Details */}
                {currentStep === 1 && (
                  <div className="space-y-4.5 animate-in fade-in duration-200">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-extrabold text-[#0B132B] truncate">
                          Step 1: Loan & Institution Details
                        </h3>
                        {/* <p className="text-xs text-slate-500 font-normal mt-0.5">
                          Specify institution name, loan category, and identifier.
                        </p> */}
                      </div>
                      <span className="shrink-0 whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs">
                        1 of 4
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Lender / Bank / Institution <span className="text-rose-500 font-bold ml-0.5">*</span>
                        </label>
                        <BankSelector
                          value={formData.bankName}
                          onChange={(bank) => {
                            setFormData((prev) => ({ ...prev, bankName: bank }));
                            clearError("bankName");
                          }}
                          currency={formData.currency}
                          required
                          placeholder={formData.currency === "INR" ? "Search banks (HDFC, SBI, ICICI, etc.)..." : "e.g. Chase Bank, HSBC, Emirates NBD, Barclays..."}
                        />
                        {errors.bankName && (
                          <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{errors.bankName}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Loan Category <span className="text-rose-500 font-bold ml-0.5">*</span>
                        </label>
                        <CustomDropdown
                          size="md"
                          value={formData.loanCategory}
                          onChange={(val) => {
                            setFormData((prev) => ({ ...prev, loanCategory: val }));
                          }}
                          options={loanCategoryOptions}
                          className="w-full"
                          triggerClassName="h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] rounded-xl border-slate-200/90 shadow-2xs font-semibold touch-manipulation"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Loan Commitment Name <span className="text-rose-500 font-bold ml-0.5">*</span>
                        </label>
                        <input
                          type="text"
                          inputMode="text"
                          autoCapitalize="words"
                          required
                          placeholder="e.g. HDFC Home Loan or MacBook Pro EMI"
                          value={formData.loanName}
                          onChange={(e) => {
                            setIsCustomLoanName(true);
                            setFormData({ ...formData, loanName: e.target.value });
                            clearError("loanName");
                          }}
                          className={getInputClass(!!errors.loanName)}
                        />
                        {errors.loanName && (
                          <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{errors.loanName}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Loan Account / Reference No. <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          autoCapitalize="characters"
                          placeholder="e.g. HDFC-HL-982310"
                          value={formData.loanReference}
                          onChange={(e) => setFormData({ ...formData, loanReference: e.target.value })}
                          className={cn(inputClass, "font-mono")}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 2: Financials & Smart Amortization (Tenure + Principal + EMI together!) */}
                {currentStep === 2 && (
                  <div className="space-y-4.5 animate-in fade-in duration-200">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-extrabold text-[#0B132B] truncate">
                          Step 2: Financials & Smart Amortization
                        </h3>
                        {/* <p className="text-xs text-slate-500 font-normal mt-0.5">
                          Enter loan amount, tenure, and rate. EMI calculates automatically.
                        </p> */}
                      </div>
                      <span className="shrink-0 whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs">
                        2 of 4
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Original Loan Principal ({vaultCurrencySymbol}) <span className="text-rose-500 font-bold ml-0.5">*</span>
                        </label>
                        <input
                          type="number"
                          inputMode="decimal"
                          required
                          min="1"
                          placeholder="e.g. 500000"
                          value={formData.originalAmount}
                          onChange={(e) => {
                            setFormData({ ...formData, originalAmount: e.target.value });
                            clearError("originalAmount");
                          }}
                          className={getInputClass(!!errors.originalAmount, "font-bold text-slate-900")}
                        />
                        {errors.originalAmount && (
                          <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{errors.originalAmount}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Loan Tenure (Months) <span className="text-rose-500 font-bold ml-0.5">*</span>
                          </label>
                          <span className="text-[10px] text-slate-400 font-medium">
                            Presets & years inside field
                          </span>
                        </div>
                        <TenureInput
                          value={formData.tenureMonths}
                          onChange={(val) => {
                            setFormData((prev) => ({ ...prev, tenureMonths: val }));
                            clearError("tenureMonths");
                          }}
                          hasError={!!errors.tenureMonths}
                          required
                          placeholder="e.g. 60"
                        />
                        {errors.tenureMonths && (
                          <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{errors.tenureMonths}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Interest Rate (% p.a.)
                          </label>
                          {standardRatesByCategory[formData.loanCategory] !== undefined && (
                            <button
                              type="button"
                              onClick={() => handleApplyStandardRate(formData.loanCategory)}
                              className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer py-0.5 active:scale-95 touch-manipulation"
                            >
                              Standard ({standardRatesByCategory[formData.loanCategory]}%)
                            </button>
                          )}
                        </div>
                        <input
                          type="number"
                          inputMode="decimal"
                          step="0.01"
                          placeholder="e.g. 8.5"
                          value={formData.interestRate}
                          onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Monthly EMI Amount ({vaultCurrencySymbol}) <span className="text-rose-500 font-bold ml-0.5">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setAutoCalculateEmi((prev) => !prev);
                              if (!autoCalculateEmi && subsequentMonthlyEmi > 0) {
                                setFormData((prev) => ({ ...prev, emiAmount: subsequentMonthlyEmi.toString() }));
                                clearError("emiAmount");
                              }
                            }}
                            className={cn(
                              "inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md cursor-pointer transition-all active:scale-95 touch-manipulation",
                              autoCalculateEmi
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                                : "bg-slate-100 text-slate-600 border border-slate-200/60"
                            )}
                          >
                            <Zap className="w-2.5 h-2.5 text-indigo-600" />
                            <span>{autoCalculateEmi ? "Auto" : "Manual"}</span>
                          </button>
                        </div>
                        <input
                          type="number"
                          inputMode="decimal"
                          required
                          min="1"
                          placeholder="e.g. 15000"
                          value={formData.emiAmount}
                          onChange={(e) => {
                            setAutoCalculateEmi(false);
                            setFormData({ ...formData, emiAmount: e.target.value });
                            clearError("emiAmount");
                          }}
                          className={getInputClass(!!errors.emiAmount, "font-extrabold text-indigo-700 text-sm")}
                        />
                        {errors.emiAmount && (
                          <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{errors.emiAmount}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            Processing Fee ({vaultCurrencySymbol}) <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                          </label>
                          {parseFloat(formData.processingFee) > 0 && (
                            <label className="inline-flex items-center gap-1.5 text-[10px] font-bold text-indigo-700 cursor-pointer min-h-[24px]">
                              <input
                                type="checkbox"
                                checked={formData.processingFeeType === "financed"}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    processingFeeType: e.target.checked ? "financed" : "deducted",
                                  }))
                                }
                                className="w-3.5 h-3.5 rounded text-indigo-600 accent-indigo-600"
                              />
                              <span>Finance into EMIs</span>
                            </label>
                          )}
                        </div>
                        <input
                          type="number"
                          inputMode="decimal"
                          placeholder="e.g. 2500"
                          value={formData.processingFee}
                          onChange={(e) => setFormData({ ...formData, processingFee: e.target.value })}
                          className={inputClass}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span>Currency (Vault Baseline)</span>
                          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            Locked
                          </span>
                        </label>
                        <div
                          className="w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] px-3.5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs font-bold text-slate-800 select-none"
                          title="Locked to your Vault Base Currency to maintain calculation accuracy."
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="text-sm">{vaultCurrencyInfo?.flag || "🌐"}</span>
                            <span>
                              {vaultCurrencyInfo?.code || formData.currency} ({vaultCurrencySymbol})
                            </span>
                            <span className="text-[11px] text-slate-400 font-normal truncate hidden sm:inline">
                              — {vaultCurrencyInfo?.name}
                            </span>
                          </div>
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>
                      </div>
                    </div>

                    {/* Broken Period Interest (BPI) / 1st EMI Custom Amount Toggle */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                      <label className="flex items-start gap-2.5 cursor-pointer select-none min-h-[44px] sm:min-h-0">
                        <input
                          type="checkbox"
                          checked={hasBrokenPeriod}
                          onChange={(e) => {
                            setHasBrokenPeriod(e.target.checked);
                            if (!e.target.checked) {
                              setFormData((prev) => ({ ...prev, firstEmiAmount: "" }));
                            }
                          }}
                          className="mt-0.5 w-4 h-4 rounded text-indigo-600 accent-indigo-600 cursor-pointer"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">
                            First Month EMI is different (Broken Period Interest / BPI)
                          </span>
                          <span className="text-[11px] text-slate-500 block mt-0.5 leading-relaxed">
                            If odd-days simple interest was clubbed into the 1st installment upon loan disbursement.
                          </span>
                        </div>
                      </label>

                      {hasBrokenPeriod && (
                        <div className="pt-2 border-t border-slate-200/60 pl-6 space-y-2 animate-in fade-in duration-150">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">
                                Actual 1st Month EMI Amount ({vaultCurrencySymbol}) <span className="text-rose-500 font-bold ml-0.5">*</span>
                              </label>
                              <input
                                type="number"
                                inputMode="decimal"
                                min="1"
                                required={hasBrokenPeriod}
                                placeholder="e.g. 18450"
                                value={formData.firstEmiAmount}
                                onChange={(e) => {
                                  setFormData({ ...formData, firstEmiAmount: e.target.value });
                                  clearError("firstEmiAmount");
                                }}
                                className={getInputClass(!!errors.firstEmiAmount, "border-indigo-200 bg-indigo-50/30 font-extrabold text-indigo-900")}
                              />
                              {errors.firstEmiAmount && (
                                <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  <span>{errors.firstEmiAmount}</span>
                                </p>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 pt-3">
                              {formData.firstEmiAmount && parseFloat(formData.firstEmiAmount) > 0 ? (
                                <>
                                  Month 1 is set to <strong className="text-indigo-700 font-bold">{vaultCurrencySymbol}{formatAmount(parseFloat(formData.firstEmiAmount), vaultCurrency)}</strong>. Subsequent months remain standard <strong className="text-slate-800 font-bold">{vaultCurrencySymbol}{formatAmount(activeEmiNum, vaultCurrency)}</strong>.
                                </>
                              ) : (
                                <>
                                  Enter the 1st installment amount. Subsequent months remain standard <strong className="text-slate-800 font-bold">{vaultCurrencySymbol}{formatAmount(activeEmiNum, vaultCurrency)}</strong>.
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: Schedule & Lifecycle Status (Running Loan + Calendar Dates) */}
                {currentStep === 3 && (
                  <div className="space-y-4.5 animate-in fade-in duration-200">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-extrabold text-[#0B132B] truncate">
                          Step 3: Schedule & Lifecycle Status
                        </h3>
                        {/* <p className="text-xs text-slate-500 font-normal mt-0.5">
                          Configure whether this is a brand new loan or an existing running loan.
                        </p> */}
                      </div>
                      <span className="shrink-0 whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs">
                        3 of 4
                      </span>
                    </div>

                    {/* Loan Lifecycle Status Segmented Control */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Loan Lifecycle Status <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-100/80 border border-slate-200/70">
                        <button
                          type="button"
                          onClick={() => setLoanMode("new")}
                          className={cn(
                            "flex items-center justify-center gap-2 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 touch-manipulation",
                            loanMode === "new"
                              ? "bg-white text-indigo-700 shadow-2xs border border-slate-200/80"
                              : "text-slate-500 hover:text-slate-800"
                          )}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Brand New Loan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setLoanMode("running")}
                          className={cn(
                            "flex items-center justify-center gap-2 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 touch-manipulation",
                            loanMode === "running"
                              ? "bg-white text-purple-700 shadow-2xs border border-purple-200/80"
                              : "text-slate-500 hover:text-slate-800"
                          )}
                        >
                          <History className="w-3.5 h-3.5" />
                          <span>Existing / Running Loan</span>
                        </button>
                      </div>
                    </div>

                    {/* Running Loan Historical Reconciliation */}
                    {loanMode === "running" && (
                      <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200/60 space-y-2.5 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                            <History className="w-3.5 h-3.5 text-purple-600" />
                            <span>Historical Reconciliation</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                            {paidCountNum > 0 ? `${paidCountNum} EMIs Paid` : "Enter past payments"}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              EMIs Already Paid (Count) <span className="text-rose-500 font-bold ml-0.5">*</span>
                            </label>
                            <input
                              type="number"
                              inputMode="numeric"
                              min="0"
                              max={tenureNum > 0 ? tenureNum : 600}
                              required={loanMode === "running"}
                              placeholder="e.g. 12"
                              value={formData.paidEmisCount}
                              onChange={(e) => {
                                setFormData({ ...formData, paidEmisCount: e.target.value });
                                clearError("paidEmisCount");
                              }}
                              className={cn(getInputClass(!!errors.paidEmisCount), "border-purple-200 font-bold text-purple-950")}
                            />
                            {errors.paidEmisCount && (
                              <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span>{errors.paidEmisCount}</span>
                              </p>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-600 pt-1 sm:pt-4">
                            {paidCountNum > 0 ? (
                              <span>
                                <strong className="text-purple-700 font-bold">{paidCountNum} of {tenureNum || "?"} EMIs</strong> marked Paid. Reminders begin at installment #{paidCountNum + 1}.
                              </span>
                            ) : (
                              <span>Specify how many EMIs have already been paid before today.</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Schedule Dates */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          {loanMode === "running" ? "Original Loan Start Date" : "Loan Start Date"} <span className="text-rose-500 font-bold ml-0.5">*</span>
                        </label>
                        <CustomDatePicker
                          value={formData.loanStartDate}
                          onChange={(val) => {
                            setFormData({ ...formData, loanStartDate: val });
                            clearError("loanStartDate");
                          }}
                          hasError={!!errors.loanStartDate}
                          required
                          placeholder="Select start date"
                        />
                        {errors.loanStartDate && (
                          <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{errors.loanStartDate}</span>
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700">
                            {loanMode === "running" ? "First EMI Date (Historical)" : "First EMI Due Date"} <span className="text-rose-500 font-bold ml-0.5">*</span>
                          </label>
                          <span className="text-[10px] text-indigo-600 font-bold flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" /> Auto-Predicted
                          </span>
                        </div>
                        <CustomDatePicker
                          value={formData.firstEmiDate}
                          onChange={(val) => {
                            setFormData({ ...formData, firstEmiDate: val });
                            clearError("firstEmiDate");
                          }}
                          hasError={!!errors.firstEmiDate}
                          required
                          placeholder="Select first EMI date"
                        />
                        {errors.firstEmiDate && (
                          <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{errors.firstEmiDate}</span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">
                          Monthly Due Day (1 - 31) <span className="text-rose-500 font-bold ml-0.5">*</span>
                        </label>
                        <span className="text-[10px] text-slate-400">
                          Every month on the {formData.dueDay || 10}th
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="1"
                          max="31"
                          required
                          value={formData.dueDay}
                          onChange={(e) => {
                            setFormData({ ...formData, dueDay: e.target.value });
                            clearError("dueDay");
                          }}
                          className={cn(getInputClass(!!errors.dueDay), "w-20 sm:w-24 text-center font-extrabold text-sm")}
                        />
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {QUICK_DUE_DAYS.map((day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                setFormData((prev) => ({ ...prev, dueDay: day }));
                                clearError("dueDay");
                              }}
                              className={cn(
                                "text-xs font-bold px-3 py-2 sm:py-1.5 min-h-[44px] sm:min-h-[36px] min-w-[44px] sm:min-w-[36px] rounded-xl border transition-all cursor-pointer active:scale-95 touch-manipulation",
                                formData.dueDay === day
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                                  : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
                              )}
                            >
                              {day}th
                            </button>
                          ))}
                        </div>
                      </div>
                      {errors.dueDay && (
                        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.dueDay}</span>
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Dynamic calendar auto-normalizes leap years & February 28/29th end-of-month cycles.</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* STEP 4: Preferences, Payment & Automation */}
                {currentStep === 4 && (
                  <div className="space-y-4.5 animate-in fade-in duration-200">
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm sm:text-base font-extrabold text-[#0B132B] truncate">
                          Step 4: Payment & Automation Preferences
                        </h3>
                        {/* <p className="text-xs text-slate-500 font-normal mt-0.5">
                          Set payment method, mandate, privacy, and notification alerts.
                        </p> */}
                      </div>
                      <span className="shrink-0 whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs">
                        4 of 4
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                          Primary Payment Method
                        </label>
                        <CustomDropdown
                          size="md"
                          value={formData.paymentMethod}
                          onChange={(val) => {
                            const isAuto = val === "Auto Debit";
                            setFormData((prev) => ({
                              ...prev,
                              paymentMethod: val,
                              autoDebitEnabled: isAuto,
                            }));
                            if (!isAuto) {
                              clearError("debitBankName");
                            }
                          }}
                          options={newEmiPaymentMethodOptions}
                          className="w-full"
                          triggerClassName="h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] rounded-xl border-slate-200/90 shadow-2xs font-semibold touch-manipulation"
                        />
                      </div>

                      <div className="flex items-center pt-1 sm:pt-6">
                        {formData.paymentMethod === "Auto Debit" ? (
                          <div className="inline-flex items-center gap-2 px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-2xs animate-in fade-in duration-150">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Auto-Debit (NACH / ECS) Mandate Active</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-3 py-2.5 sm:py-2 min-h-[44px] sm:min-h-[38px] rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 text-xs font-medium animate-in fade-in duration-150">
                            <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                            <span>Manual payment reminders active</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Auto-Debit Deducting Bank Assignment (ONLY shown when Auto Debit is selected) */}
                    {formData.paymentMethod === "Auto Debit" && (
                      <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-3 animate-in fade-in duration-150">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Deduct From Bank (Debit Account) <span className="text-rose-500 font-bold ml-0.5">*</span>
                            </label>
                            <BankSelector
                              value={formData.debitBankName}
                              onChange={(bank) => {
                                setFormData((prev) => ({ ...prev, debitBankName: bank }));
                                clearError("debitBankName");
                              }}
                              currency={formData.currency}
                              placeholder={
                                formData.currency === "INR"
                                  ? "Search bank (HDFC, SBI, ICICI, etc.)..."
                                  : "e.g. Chase Bank, HSBC, Emirates NBD, Barclays..."
                              }
                              required={formData.paymentMethod === "Auto Debit"}
                              hasError={!!errors.debitBankName}
                            />
                            {errors.debitBankName && (
                              <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1 animate-in fade-in duration-150">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                <span>{errors.debitBankName}</span>
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Debit Account No. / Last 4 Digits <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              inputMode="numeric"
                              placeholder="e.g. •••• 4892 or A/c 501004928"
                              value={formData.debitAccountNumber}
                              onChange={(e) => setFormData({ ...formData, debitAccountNumber: e.target.value })}
                              className={inputClass}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Vault & Privacy Assignment */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700">
                          Record Privacy & Workspace Vault <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                          Select the target vault for this commitment
                        </span>
                      </div>

                      {/* Primary 2 Options: Personal Vault vs Family Vault */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {/* 1. Personal Vault Card */}
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, ownershipType: "personal", familyId: null })}
                          className={cn(
                            "relative flex items-center gap-3 p-3 min-h-[52px] sm:min-h-[48px] rounded-2xl border text-left cursor-pointer transition-all duration-150 focus:outline-none active:scale-[0.99] touch-manipulation",
                            formData.ownershipType === "personal"
                              ? "bg-indigo-50/60 border-indigo-500 ring-2 ring-indigo-500/15 shadow-2xs"
                              : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs"
                          )}
                        >
                          <div className="shrink-0">
                            <MemberAvatarStack type="personal" size="md" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-extrabold text-slate-900 text-xs block truncate leading-tight">
                              Personal Vault
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 block leading-tight mt-0.5 truncate">
                              Private • Only you
                            </span>
                          </div>
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-1 transition-colors",
                              formData.ownershipType === "personal"
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-slate-300 bg-white"
                            )}
                          >
                            {formData.ownershipType === "personal" && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </button>

                        {/* 2. Family Vault Card */}
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              ownershipType: "family_shared",
                              familyId: formData.familyId || (families.length > 0 ? families[0].id : null),
                            });
                          }}
                          className={cn(
                            "relative flex items-center gap-3 p-3 min-h-[52px] sm:min-h-[48px] rounded-2xl border text-left cursor-pointer transition-all duration-150 focus:outline-none active:scale-[0.99] touch-manipulation",
                            formData.ownershipType === "family_shared"
                              ? "bg-indigo-50/60 border-indigo-500 ring-2 ring-indigo-500/15 shadow-2xs"
                              : "bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs"
                          )}
                        >
                          <div className="shrink-0">
                            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-2xs">
                              <Users className="w-3.5 h-3.5 stroke-[2.2]" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-extrabold text-slate-900 text-xs block truncate leading-tight">
                              Family Vault
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 block leading-tight mt-0.5 truncate">
                              Shared • Household budgeting
                            </span>
                          </div>
                          <div
                            className={cn(
                              "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-1 transition-colors",
                              formData.ownershipType === "family_shared"
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-slate-300 bg-white"
                            )}
                          >
                            {formData.ownershipType === "family_shared" && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white" />
                            )}
                          </div>
                        </button>
                      </div>

                      {/* ONLY SHOW GROUPS WHEN FAMILY VAULT IS CLICKED / SELECTED */}
                      {formData.ownershipType === "family_shared" && (
                        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-2.5 animate-in fade-in slide-in-from-top-1 duration-150">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-indigo-600" />
                              Select Family Group / Household <span className="text-rose-500">*</span>
                            </span>
                            <span className="text-[10px] font-semibold text-indigo-600 bg-white px-2 py-0.5 rounded-full border border-indigo-100 shadow-2xs">
                              {families.length} {families.length === 1 ? "Vault" : "Vaults"}
                            </span>
                          </div>

                          {families.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              {families.map((fam) => {
                                const isSelected =
                                  formData.familyId === fam.id ||
                                  (!formData.familyId && families[0]?.id === fam.id);

                                return (
                                  <button
                                    key={fam.id}
                                    type="button"
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        familyId: fam.id,
                                      }))
                                    }
                                    className={cn(
                                      "relative flex items-center gap-3 p-3 min-h-[52px] sm:min-h-[48px] rounded-xl border text-left cursor-pointer transition-all duration-150 focus:outline-none active:scale-[0.99] touch-manipulation",
                                      isSelected
                                        ? "bg-white border-indigo-500 ring-2 ring-indigo-500/15 shadow-2xs"
                                        : "bg-white/80 border-slate-200/90 hover:border-slate-300 shadow-2xs"
                                    )}
                                  >
                                    <div className="shrink-0">
                                      <MemberAvatarStack
                                        members={fam.members_preview}
                                        count={fam.members_count}
                                        type="family"
                                        size="md"
                                      />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <span className="font-extrabold text-slate-900 text-xs block truncate leading-tight">
                                        {fam.name}
                                      </span>
                                      <span className="text-[10px] font-semibold text-slate-400 block leading-tight mt-0.5 truncate">
                                        Family Vault • {fam.members_count || 1} member{(fam.members_count || 1) > 1 ? "s" : ""}
                                      </span>
                                    </div>
                                    <div
                                      className={cn(
                                        "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-1 transition-colors",
                                        isSelected
                                          ? "border-indigo-600 bg-indigo-600"
                                          : "border-slate-300 bg-white"
                                      )}
                                    >
                                      {isSelected && (
                                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                      )}
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                              <div className="flex items-center gap-1.5 font-bold">
                                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                                <span>No Family Workspace Created Yet</span>
                              </div>
                              <p className="text-[11px] text-amber-700 leading-relaxed font-normal">
                                To share loans with family, you first need to create a household workspace on the{" "}
                                <Link href="/family/setup" target="_blank" className="font-bold underline text-indigo-700">
                                  Family page
                                </Link>
                                . Until then, keep this loan in your <strong>Personal Vault</strong>.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Reminder Toggles */}
                    <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Bell className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Automated Reminder Alerts</span>
                        </span>
                        <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                          Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <label className="flex items-center gap-2 p-2.5 sm:p-2 min-h-[44px] rounded-xl bg-white border border-slate-200/60 cursor-pointer active:scale-95 touch-manipulation">
                          <input
                            type="checkbox"
                            checked={formData.reminder7Days}
                            onChange={(e) => setFormData({ ...formData, reminder7Days: e.target.checked })}
                            className="rounded text-indigo-600 accent-indigo-600 w-4 h-4"
                          />
                          <span className="font-semibold text-slate-700 text-xs">7 Days</span>
                        </label>

                        <label className="flex items-center gap-2 p-2.5 sm:p-2 min-h-[44px] rounded-xl bg-white border border-slate-200/60 cursor-pointer active:scale-95 touch-manipulation">
                          <input
                            type="checkbox"
                            checked={formData.reminder3Days}
                            onChange={(e) => setFormData({ ...formData, reminder3Days: e.target.checked })}
                            className="rounded text-indigo-600 accent-indigo-600 w-4 h-4"
                          />
                          <span className="font-semibold text-slate-700 text-xs">3 Days</span>
                        </label>

                        <label className="flex items-center gap-2 p-2.5 sm:p-2 min-h-[44px] rounded-xl bg-white border border-slate-200/60 cursor-pointer active:scale-95 touch-manipulation">
                          <input
                            type="checkbox"
                            checked={formData.reminder1Day}
                            onChange={(e) => setFormData({ ...formData, reminder1Day: e.target.checked })}
                            className="rounded text-indigo-600 accent-indigo-600 w-4 h-4"
                          />
                          <span className="font-semibold text-slate-700 text-xs">1 Day</span>
                        </label>

                        <label className="flex items-center gap-2 p-2.5 sm:p-2 min-h-[44px] rounded-xl bg-white border border-slate-200/60 cursor-pointer active:scale-95 touch-manipulation">
                          <input
                            type="checkbox"
                            checked={formData.reminderDueDate}
                            onChange={(e) => setFormData({ ...formData, reminderDueDate: e.target.checked })}
                            className="rounded text-indigo-600 accent-indigo-600 w-4 h-4"
                          />
                          <span className="font-semibold text-slate-700 text-xs">Due Date</span>
                        </label>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Notes & Remarks <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Salary account debited automatically on 10th morning"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 font-medium shadow-2xs touch-manipulation"
                      />
                    </div>
                  </div>
                )}

                {/* Form Footer Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-0">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] inline-flex items-center justify-center gap-1.5 px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Previous Step</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  {currentStep < 4 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNext();
                      }}
                      className="h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] inline-flex items-center justify-center gap-1.5 px-6 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95 transition-all touch-manipulation"
                    >
                      <span>Next Step</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                      className="h-12 sm:h-10 min-h-[48px] sm:min-h-[40px] inline-flex items-center justify-center gap-2 px-6 rounded-xl btn-gradient-glow text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95 transition-all disabled:opacity-60 touch-manipulation"
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{isSubmitting ? "Generating Amortization..." : "Auto-Generate Schedule & Save EMI"}</span>
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right: Live Amortization & Smart Preview Card (Desktop Only: hidden lg:block) */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-[0_4px_20px_-4px_rgba(99,102,241,0.06)] space-y-5">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 overflow-hidden shadow-2xs">
                      {formData.bankName ? (
                        <BankLogo bankName={formData.bankName} size="md" />
                      ) : (
                        getCategoryIcon(formData.loanCategory)
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                        {formData.bankName || "Commitment Preview"}
                      </span>
                      <h4 className="text-xs font-black text-[#0B132B] truncate max-w-[160px] sm:max-w-xs">
                        {formData.loanName || (formData.bankName ? `${formData.bankName} ${formData.loanCategory}` : "New Commitment")}
                      </h4>
                    </div>
                  </div>

                  {loanMode === "running" ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60">
                      <History className="w-2.5 h-2.5 text-purple-600" />
                      <span>Running ({paidCountNum}/{tenureNum || "?"})</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-50 text-violet-700 border border-violet-200/60">
                      {/* <Sparkles className="w-2.5 h-2.5 text-violet-600" /> */}
                      <span>Auto-Schedule</span>
                    </span>
                  )}
                </div>

                {/* Family Shared Workspace Banner in Preview */}
                {formData.ownershipType === "family_shared" && selectedFamily && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100/90 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <MemberAvatarStack
                        members={selectedFamily.members_preview}
                        count={selectedFamily.members_count}
                        type="family"
                        size="xs"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-indigo-950 truncate block">
                          {selectedFamily.name}
                        </span>
                        <span className="text-[10px] font-medium text-indigo-600 block">
                          Shared Family Commitment • {selectedFamily.members_count || 1} members
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-100 shadow-2xs shrink-0">
                      Family Vault
                    </span>
                  </div>
                )}

                {/* Big Monthly EMI Display */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-center">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                    Monthly Instalment
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-[#0B132B] tracking-tight mt-1">
                    {activeEmiNum > 0 ? `${vaultCurrencySymbol}${formatAmount(activeEmiNum, vaultCurrency)}` : `${vaultCurrencySymbol}0`}
                  </div>
                  {hasBrokenPeriod && tenureNum > 1 ? (
                    <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                      1st Month: {vaultCurrencySymbol}{formatAmount(firstMonthEmi, vaultCurrency)} ({formData.firstEmiType === "bpi" ? "BPI" : "Custom"}) • then {vaultCurrencySymbol}{formatAmount(activeEmiNum, vaultCurrency)}/mo
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                      {tenureNum > 0 ? `for ${tenureNum} consecutive months` : "Enter loan amount & tenure"}
                    </span>
                  )}
                </div>

                {/* Running Loan Progress Banner (if running loan selected) */}
                {loanMode === "running" && (
                  <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100/90 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-purple-900 flex items-center gap-1">
                        <History className="w-3 h-3 text-purple-600" />
                        Completed EMIs
                      </span>
                      <span className="text-purple-800">
                        {paidCountNum} of {tenureNum || 0} ({runningProgressPct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-purple-200/60 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, runningProgressPct)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-purple-700 font-semibold pt-0.5">
                      <span>{remainingMonths} EMIs remaining</span>
                      <span>Next due: #{paidCountNum + 1}</span>
                    </div>
                  </div>
                )}

                {/* Visual Principal vs Interest Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-indigo-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                      Principal: {principalPct}%
                    </span>
                    <span className="text-cyan-600 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
                      Interest: {interestPct}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                    {totalPayable > 0 ? (
                      <>
                        <div
                          className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
                          style={{ width: `${principalPct}%` }}
                        />
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-300"
                          style={{ width: `${interestPct}%` }}
                        />
                      </>
                    ) : (
                      <div className="h-full bg-slate-200/50 w-full rounded-full" />
                    )}
                  </div>
                </div>

                {/* Financial Summary Figures */}
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Sanctioned Principal</span>
                    <span className="font-bold text-slate-800">
                      {principalNum > 0 ? `${vaultCurrencySymbol}${formatAmount(principalNum, vaultCurrency)}` : `${vaultCurrencySymbol}0`}
                    </span>
                  </div>

                  {feeNum > 0 && (
                    <>
                      <div className="py-2 flex items-center justify-between bg-slate-50/60 -mx-2 px-2 rounded">
                        <span className="text-slate-600 font-medium">Processing Fee</span>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">{vaultCurrencySymbol}{formatAmount(feeNum, vaultCurrency)}</span>
                          <span className="text-[10px] text-indigo-600 font-semibold block">
                            {isFeeFinanced ? "Financed into EMIs" : "Deducted upfront"}
                          </span>
                        </div>
                      </div>

                      {isFeeFinanced ? (
                        <div className="py-2 flex items-center justify-between bg-indigo-50/40 -mx-2 px-2 rounded">
                          <span className="text-indigo-900 font-medium">Total Financed Loan</span>
                          <span className="font-extrabold text-indigo-700">
                            {vaultCurrencySymbol}{formatAmount(effectivePrincipal, vaultCurrency)}
                          </span>
                        </div>
                      ) : (
                        <div className="py-2 flex items-center justify-between bg-slate-50/60 -mx-2 px-2 rounded">
                          <span className="text-slate-600 font-medium">Net Disbursed to Account</span>
                          <span className="font-bold text-emerald-700">
                            {vaultCurrencySymbol}{formatAmount(netDisbursedAmount, vaultCurrency)}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {loanMode === "running" && paidCountNum > 0 && (
                    <div className="py-2 flex items-center justify-between bg-purple-50/40 -mx-2 px-2 rounded">
                      <span className="text-purple-800 font-medium">Est. Remaining Principal</span>
                      <span className="font-extrabold text-purple-900">
                        {vaultCurrencySymbol}{formatAmount(estimatedRemainingPrincipal, vaultCurrency)}
                      </span>
                    </div>
                  )}

                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Total Interest</span>
                    <span className="font-bold text-cyan-600">
                      {totalInterest > 0 ? `+${vaultCurrencySymbol}${formatAmount(totalInterest, vaultCurrency)}` : `${vaultCurrencySymbol}0`}
                    </span>
                  </div>

                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Total Cost of Loan</span>
                    <span className="font-extrabold text-slate-900">
                      {totalCostOfLoan > 0 ? `${vaultCurrencySymbol}${formatAmount(totalCostOfLoan, vaultCurrency)}` : `${vaultCurrencySymbol}0`}
                    </span>
                  </div>

                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">
                      {loanMode === "running" ? "Initial Start Date" : "First Due Date"}
                    </span>
                    <span className="font-bold text-slate-800">
                      {loanMode === "running" ? formData.loanStartDate || "—" : formData.firstEmiDate || "—"}
                    </span>
                  </div>

                  <div className="py-2 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Payoff / Maturity</span>
                    <span className="font-bold text-indigo-600">{tenureNum > 0 ? maturityDateStr : "—"}</span>
                  </div>

                  {formData.paymentMethod === "Auto Debit" && formData.debitBankName && (
                    <div className="py-2 flex items-center justify-between bg-indigo-50/50 -mx-2 px-2 rounded">
                      <span className="text-indigo-900 font-medium shrink-0">Auto-Debit From</span>
                      <span className="font-bold text-indigo-700 truncate max-w-[150px] sm:max-w-[220px] text-right">
                        {formData.debitBankName}
                        {formData.debitAccountNumber ? ` (${formData.debitAccountNumber})` : ""}
                      </span>
                    </div>
                  )}
                </div>

                {/* Automation Engine Checklist */}
                {/* <div className="pt-2 border-t border-slate-100 space-y-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                    Automation Guarantee
                  </span>
                  <div className="space-y-1.5 text-[11px] text-slate-600 font-medium">
                    {loanMode === "running" && paidCountNum > 0 ? (
                      <>
                        <div className="flex items-center gap-1.5 text-purple-700 font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                          <span>{paidCountNum} past EMIs auto-reconciled as Paid</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Reminders active starting from EMI #{paidCountNum + 1}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-1.5 text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>
                          {tenureNum > 0
                            ? `${tenureNum} schedules generated upon submit`
                            : "Automatic amortization schedule generation"}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Dynamic February leap year date correction</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Multi-stage reminders tagged automatically</span>
                    </div>
                    {formData.paymentMethod === "Auto Debit" && (
                      <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>
                          {formData.debitBankName
                            ? `Auto-debit active from ${formData.debitBankName}`
                            : "Auto-debit NACH mandate active"}
                        </span>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Live Amortization Bottom Sheet Modal */}
        {isMobilePreviewOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-amortization-sheet-title"
            className="fixed inset-0 z-50 flex items-end justify-center lg:hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
            onClick={() => setIsMobilePreviewOpen(false)}
          >
            <div
              className="w-full max-h-[85vh] bg-white rounded-t-3xl p-5 shadow-2xl overflow-y-auto space-y-4 animate-in slide-in-from-bottom duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Drag Handle */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto -mt-1 mb-1" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    {formData.bankName ? (
                      <BankLogo bankName={formData.bankName} size="md" />
                    ) : (
                      getCategoryIcon(formData.loanCategory)
                    )}
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block truncate">
                      {formData.bankName || "Commitment Preview"}
                    </span>
                    <h3
                      id="mobile-amortization-sheet-title"
                      className="text-sm font-black text-[#0B132B] truncate max-w-[200px]"
                    >
                      {formData.loanName || (formData.bankName ? `${formData.bankName} ${formData.loanCategory}` : "New Commitment")}
                    </h3>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobilePreviewOpen(false)}
                  aria-label="Close amortization preview"
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer active:scale-95 transition-all shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Family Shared Workspace Banner in Preview */}
              {formData.ownershipType === "family_shared" && selectedFamily && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-50/70 border border-indigo-100/90">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MemberAvatarStack
                      members={selectedFamily.members_preview}
                      count={selectedFamily.members_count}
                      type="family"
                      size="xs"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-indigo-950 truncate block">
                        {selectedFamily.name}
                      </span>
                      <span className="text-[10px] font-medium text-indigo-600 block">
                        Shared Family Commitment • {selectedFamily.members_count || 1} members
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded-full border border-indigo-100 shadow-2xs shrink-0">
                    Family Vault
                  </span>
                </div>
              )}

              {/* Big Monthly EMI Box */}
              <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                  Monthly Instalment
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#0B132B] tracking-tight mt-1">
                  {activeEmiNum > 0 ? `${vaultCurrencySymbol}${formatAmount(activeEmiNum, vaultCurrency)}` : `${vaultCurrencySymbol}0`}
                </div>
                {hasBrokenPeriod && tenureNum > 1 ? (
                  <div className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                    1st Month: {vaultCurrencySymbol}{formatAmount(firstMonthEmi, vaultCurrency)} ({formData.firstEmiType === "bpi" ? "BPI" : "Custom"}) • then {vaultCurrencySymbol}{formatAmount(activeEmiNum, vaultCurrency)}/mo
                  </div>
                ) : (
                  <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                    {tenureNum > 0 ? `for ${tenureNum} consecutive months` : "Enter loan amount & tenure"}
                  </span>
                )}
              </div>

              {/* Running Loan Progress Banner (if running loan selected) */}
              {loanMode === "running" && (
                <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100/90 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-purple-900 flex items-center gap-1">
                      <History className="w-3 h-3 text-purple-600" />
                      Completed EMIs
                    </span>
                    <span className="text-purple-800">
                      {paidCountNum} of {tenureNum || 0} ({runningProgressPct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-purple-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, runningProgressPct)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-purple-700 font-semibold pt-0.5">
                    <span>{remainingMonths} EMIs remaining</span>
                    <span>Next due: #{paidCountNum + 1}</span>
                  </div>
                </div>
              )}

              {/* Visual Principal vs Interest Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-indigo-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" />
                    Principal: {principalPct}%
                  </span>
                  <span className="text-cyan-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
                    Interest: {interestPct}%
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  {totalPayable > 0 ? (
                    <>
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 transition-all duration-300"
                        style={{ width: `${principalPct}%` }}
                      />
                      <div
                        className="h-full bg-gradient-to-r from-indigo-400 to-cyan-400 transition-all duration-300"
                        style={{ width: `${interestPct}%` }}
                      />
                    </>
                  ) : (
                    <div className="h-full bg-slate-200/50 w-full rounded-full" />
                  )}
                </div>
              </div>

              {/* Financial Summary Figures */}
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Sanctioned Principal</span>
                  <span className="font-bold text-slate-800">
                    {principalNum > 0 ? `${vaultCurrencySymbol}${formatAmount(principalNum, vaultCurrency)}` : `${vaultCurrencySymbol}0`}
                  </span>
                </div>

                {feeNum > 0 && (
                  <>
                    <div className="py-2 flex items-center justify-between bg-slate-50/60 -mx-2 px-2 rounded">
                      <span className="text-slate-600 font-medium">Processing Fee</span>
                      <div className="text-right">
                        <span className="font-bold text-slate-900 block">{vaultCurrencySymbol}{formatAmount(feeNum, vaultCurrency)}</span>
                        <span className="text-[10px] text-indigo-600 font-semibold block">
                          {isFeeFinanced ? "Financed into EMIs" : "Deducted upfront"}
                        </span>
                      </div>
                    </div>

                    {isFeeFinanced ? (
                      <div className="py-2 flex items-center justify-between bg-indigo-50/40 -mx-2 px-2 rounded">
                        <span className="text-indigo-900 font-medium">Total Financed Loan</span>
                        <span className="font-extrabold text-indigo-700">
                          {vaultCurrencySymbol}{formatAmount(effectivePrincipal, vaultCurrency)}
                        </span>
                      </div>
                    ) : (
                      <div className="py-2 flex items-center justify-between bg-slate-50/60 -mx-2 px-2 rounded">
                        <span className="text-slate-600 font-medium">Net Disbursed to Account</span>
                        <span className="font-bold text-emerald-700">
                          {vaultCurrencySymbol}{formatAmount(netDisbursedAmount, vaultCurrency)}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {loanMode === "running" && paidCountNum > 0 && (
                  <div className="py-2 flex items-center justify-between bg-purple-50/40 -mx-2 px-2 rounded">
                    <span className="text-purple-800 font-medium">Est. Remaining Principal</span>
                    <span className="font-extrabold text-purple-900">
                      {vaultCurrencySymbol}{formatAmount(estimatedRemainingPrincipal, vaultCurrency)}
                    </span>
                  </div>
                )}

                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Total Interest</span>
                  <span className="font-bold text-cyan-600">
                    {totalInterest > 0 ? `+${vaultCurrencySymbol}${formatAmount(totalInterest, vaultCurrency)}` : `${vaultCurrencySymbol}0`}
                  </span>
                </div>

                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Total Cost of Loan</span>
                  <span className="font-extrabold text-slate-900">
                    {totalCostOfLoan > 0 ? `${vaultCurrencySymbol}${formatAmount(totalCostOfLoan, vaultCurrency)}` : `${vaultCurrencySymbol}0`}
                  </span>
                </div>

                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">
                    {loanMode === "running" ? "Initial Start Date" : "First Due Date"}
                  </span>
                  <span className="font-bold text-slate-800">
                    {loanMode === "running" ? formData.loanStartDate || "—" : formData.firstEmiDate || "—"}
                  </span>
                </div>

                <div className="py-2 flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Payoff / Maturity</span>
                  <span className="font-bold text-indigo-600">{tenureNum > 0 ? maturityDateStr : "—"}</span>
                </div>

                {formData.paymentMethod === "Auto Debit" && formData.debitBankName && (
                  <div className="py-2 flex items-center justify-between bg-indigo-50/50 -mx-2 px-2 rounded">
                    <span className="text-indigo-900 font-medium shrink-0">Auto-Debit From</span>
                    <span className="font-bold text-indigo-700 truncate max-w-[150px] sm:max-w-[220px] text-right">
                      {formData.debitBankName}
                      {formData.debitAccountNumber ? ` (${formData.debitAccountNumber})` : ""}
                    </span>
                  </div>
                )}
              </div>

              {/* Done Button */}
              <button
                type="button"
                onClick={() => setIsMobilePreviewOpen(false)}
                className="w-full h-11 min-h-[44px] rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center touch-manipulation"
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
