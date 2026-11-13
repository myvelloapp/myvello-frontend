"use client";

import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  AlertCircle,
  Plus,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Check,
  Building2,
  Trash2,
  Archive,
  ArchiveRestore,
  Zap,
  CreditCard,
  Lock,
  Share2,
  History,
  Pencil,
  X,
  Filter,
  Download,
  Receipt,
  Layers,
  Landmark,
  MoreHorizontal,
} from "lucide-react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";
import type { PayTarget } from "@/components/common/MarkAsPaidModal";

const MarkAsPaidModal = dynamic(
  () => import("@/components/common/MarkAsPaidModal").then((mod) => mod.MarkAsPaidModal),
  { ssr: false }
);

const ForeclosureModal = dynamic(
  () => import("@/components/common/ForeclosureModal").then((mod) => mod.ForeclosureModal),
  { ssr: false }
);
import { formatCurrency, formatDate, getCurrencySymbol } from "@/lib/formatters";
import { emiService } from "@/services/emiService";
import { useAuth } from "@/modules/authentication/AuthContext";
import { Emi, EmiSchedule, EmiPayment, FamilyMemberWithUser } from "@/types";
import { BankLogo } from "@/components/ui/BankLogo";
import { BankSelector } from "@/components/ui/BankSelector";
import { CustomDatePicker } from "@/components/ui/CustomDatePicker";
import { TenureInput } from "@/components/ui/TenureInput";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MemberAvatarStack } from "@/components/common/MemberAvatarStack";
import {
  LOAN_CATEGORY_OPTIONS,
  PAYMENT_METHOD_OPTIONS,
  CURRENCY_OPTIONS,
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

// Quick due day options
const QUICK_DUE_DAYS = ["5", "10", "15", "20", "25", "30"];

type DetailedEmi = Emi & {
  schedules: EmiSchedule[];
  payments: EmiPayment[];
  family?: {
    id: number;
    name: string;
    members?: FamilyMemberWithUser[];
  } | null;
};

// Deep equality diffing to prevent unnecessary DOM re-renders on silent updates
function areLoanDetailsEqual(a: DetailedEmi | null, b: DetailedEmi | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  if (
    a.id !== b.id ||
    a.loan_name !== b.loan_name ||
    a.lender_name !== b.lender_name ||
    a.loan_category !== b.loan_category ||
    a.status !== b.status ||
    a.original_loan_amount !== b.original_loan_amount ||
    a.outstanding_principal !== b.outstanding_principal ||
    a.emi_amount !== b.emi_amount ||
    a.interest_rate !== b.interest_rate ||
    a.total_emis !== b.total_emis ||
    a.loan_tenure_months !== b.loan_tenure_months ||
    a.due_day !== b.due_day ||
    a.ownership_type !== b.ownership_type ||
    a.family_id !== b.family_id ||
    a.debit_bank_name !== b.debit_bank_name ||
    a.debit_account_number !== b.debit_account_number ||
    a.payment_method !== b.payment_method ||
    a.notes !== b.notes
  ) {
    return false;
  }

  // Schedules comparison
  const aSchedules = a.schedules || [];
  const bSchedules = b.schedules || [];
  if (aSchedules.length !== bSchedules.length) return false;
  for (let i = 0; i < aSchedules.length; i++) {
    const sA = aSchedules[i];
    const sB = bSchedules[i];
    if (
      sA.id !== sB.id ||
      sA.status !== sB.status ||
      sA.due_amount !== sB.due_amount ||
      sA.paid_amount !== sB.paid_amount ||
      sA.paid_date !== sB.paid_date
    ) {
      return false;
    }
  }

  // Payments comparison
  const aPayments = a.payments || [];
  const bPayments = b.payments || [];
  if (aPayments.length !== bPayments.length) return false;
  for (let i = 0; i < aPayments.length; i++) {
    if (
      aPayments[i].id !== bPayments[i].id ||
      aPayments[i].amount !== bPayments[i].amount ||
      aPayments[i].payment_date !== bPayments[i].payment_date
    ) {
      return false;
    }
  }

  return true;
}

// High-fidelity shimmer skeleton matching exact page geometry to guarantee zero layout shift (CLS = 0)
function EmiDetailSkeleton() {
  return (
    <div className="relative -mt-18 pt-20 pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden min-h-dvh select-none">
      {/* Living Aurora Gradient Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#F0F5FF]/80 to-[#F0F5FF]" />
      </div>

      <div className="relative z-10 max-w-[1500px] mx-auto space-y-5 sm:space-y-6 animate-pulse">
        {/* HERO CARD SKELETON */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Bank Logo & Loan Identity */}
            <div className="flex items-start sm:items-center gap-3 sm:gap-3.5">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-200/80 shrink-0 shadow-2xs" />
              <div className="space-y-2 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="h-6 w-44 sm:w-56 bg-slate-200/80 rounded-md" />
                  <div className="h-5 w-16 bg-slate-200/70 rounded-full" />
                  <div className="h-5 w-24 bg-slate-200/70 rounded-full" />
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="h-3.5 w-28 bg-slate-200/60 rounded" />
                  <div className="h-3.5 w-24 bg-slate-200/60 rounded" />
                  <div className="h-3.5 w-20 bg-slate-200/60 rounded" />
                </div>
              </div>
            </div>

            {/* Right: Actions Bar Skeleton */}
            <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
              <div className="h-10 sm:h-8.5 flex-1 lg:flex-initial w-full sm:w-28 bg-slate-200/70 rounded-xl" />
              <div className="h-10 sm:h-8.5 w-24 bg-slate-200/70 rounded-xl" />
              <div className="h-10 sm:h-8.5 w-24 bg-slate-200/70 rounded-xl" />
            </div>
          </div>

          {/* 4 Financial KPI Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-3.5 border-t border-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 space-y-2">
                <div className="h-3 w-20 sm:w-24 bg-slate-200/70 rounded" />
                <div className="h-5 sm:h-6 w-28 sm:w-32 bg-slate-200/80 rounded-md" />
                <div className="h-3 w-20 sm:w-28 bg-slate-200/50 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* 2-COLUMN MAIN LANDING PAGE CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN: Tabs & Table / Cards */}
          <div className="lg:col-span-8 space-y-4">
            {/* Themed Segmented Tab Switcher */}
            <div className="flex items-center justify-between pb-1 gap-2">
              <div className="p-1 rounded-[13px] bg-white border border-slate-200/80 shadow-2xs flex items-center gap-1 overflow-hidden">
                <div className="h-8 sm:h-7 w-28 sm:w-44 bg-slate-200/70 rounded-[10px]" />
                <div className="h-8 sm:h-7 w-24 sm:w-36 bg-slate-100 rounded-[10px]" />
                <div className="h-8 sm:h-7 w-24 sm:w-36 bg-slate-100 rounded-[10px]" />
              </div>
              <div className="h-8 w-24 bg-slate-200/60 rounded-[10px] hidden sm:block" />
            </div>

            {/* Container: Desktop Table Skeleton + Mobile Card Skeleton */}
            <div className="bg-white rounded-[16px] border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="h-6 w-14 sm:w-16 bg-slate-200/70 rounded-[8px]" />
                  <div className="h-6 w-14 sm:w-16 bg-slate-200/50 rounded-[8px]" />
                  <div className="h-6 w-14 sm:w-16 bg-slate-200/50 rounded-[8px]" />
                </div>
                <div className="h-4 w-28 sm:w-32 bg-slate-200/60 rounded" />
              </div>

              {/* Desktop Table Rows */}
              <div className="hidden md:block divide-y divide-slate-100">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="py-3 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-4 w-8 bg-slate-200/60 rounded" />
                      <div className="h-4 w-24 bg-slate-200/60 rounded" />
                      <div className="h-4 w-20 bg-slate-200/70 rounded" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-16 bg-slate-200/60 rounded-full" />
                      <div className="h-7 w-20 bg-slate-200/70 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Stacked Card Skeletons */}
              <div className="md:hidden divide-y divide-slate-100">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="h-5 w-12 bg-slate-200/70 rounded-md" />
                      <div className="h-5 w-20 bg-slate-200/60 rounded-full" />
                    </div>
                    <div className="flex items-baseline justify-between">
                      <div className="h-6 w-28 bg-slate-200/80 rounded" />
                      <div className="h-4 w-24 bg-slate-200/50 rounded" />
                    </div>
                    <div className="h-10 w-full bg-slate-200/60 rounded-xl" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar Card Skeleton */}
          <div className="lg:col-span-4 space-y-4">
            <div className="hidden lg:block bg-slate-200/60 rounded-2xl p-5 shadow-xs h-48" />
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs h-64" />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmiDetailContent() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useParams();
  const rawId = params?.id;
  const loanId = Number(rawId);
  const { families } = useWorkspace();

  const [loan, setLoan] = useState<DetailedEmi | null>(null);
  const currency = loan?.currency || user?.preferred_currency || "INR";
  const currencySymbol = useMemo(() => getCurrencySymbol(currency), [currency]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payTarget, setPayTarget] = useState<PayTarget | null>(null);

  // Landing Page Tabs & Filters
  const [activeTab, setActiveTab] = useState<"schedule" | "history" | "terms">("schedule");
  const [scheduleFilter, setScheduleFilter] = useState<"all" | "pending" | "paid" | "overdue">("all");

  // Modals & Action Statuses
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isForecloseModalOpen, setIsForecloseModalOpen] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isMobileMoreOpen, setIsMobileMoreOpen] = useState(false);

  // Edit Wizard Step
  const [currentStep, setCurrentStep] = useState(1);

  // Form Mode & Calculation State
  const [autoCalculateEmi, setAutoCalculateEmi] = useState(false);
  const [loanMode, setLoanMode] = useState<"new" | "running">("new");
  const [hasBrokenPeriod, setHasBrokenPeriod] = useState(false);

  // 4-Step Form State for Editing
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    loanName: "",
    loanCategory: "Home Loan",
    bankName: "",
    loanReference: "",
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
    currency: "INR",
    // Step 3: Schedule & Lifecycle
    loanStartDate: "",
    firstEmiDate: "",
    dueDay: "10",
    paidEmisCount: "",
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

  // Load details from backend
  const loadLoanDetails = useCallback(async (isSilent = false) => {
    if (!loanId || isNaN(loanId)) {
      setError("Invalid loan identifier.");
      if (!isSilent) setIsLoading(false);
      return;
    }

    if (!isSilent && !loan) {
      setIsLoading(true);
    }
    setError(null);
    try {
      const data = (await emiService.getEmi(loanId)) as DetailedEmi;
      setLoan((prev) => (areLoanDetailsEqual(prev, data) ? prev : data));

      const schedules = data.schedules || [];
      const paidSchedulesCount = schedules.filter((s) => s.status === "paid").length;

      // Only populate form state when not actively editing in modal
      if (!isEditModalOpen) {
        setFormData((prev) => {
          if (
            prev.loanName === (data.loan_name || "") &&
            prev.originalAmount === String(data.original_loan_amount || "") &&
            prev.interestRate === String(data.interest_rate || "") &&
            prev.emiAmount === String(data.emi_amount || "") &&
            prev.bankName === (data.lender_name || "")
          ) {
            return prev;
          }
          return {
            loanName: data.loan_name || "",
            loanCategory: data.loan_category || "Home Loan",
            bankName: data.lender_name || "",
            loanReference: data.loan_reference || "",
            ownershipType: data.ownership_type || "personal",
            familyId: data.family_id || (data.family?.id ?? null),
            originalAmount: String(data.original_loan_amount || ""),
            tenureMonths: String(data.loan_tenure_months || data.total_emis || ""),
            interestRate: String(data.interest_rate || ""),
            emiAmount: String(data.emi_amount || ""),
            firstEmiAmount: data.first_emi_amount ? String(data.first_emi_amount) : "",
            firstEmiType: (data.first_emi_type as "bpi" | "reamortize") || "bpi",
            processingFee: data.processing_fee ? String(data.processing_fee) : "",
            processingFeeType: (data.processing_fee_type as "deducted" | "financed") || "deducted",
            currency: data.currency || "INR",
            loanStartDate: data.loan_start_date ? data.loan_start_date.slice(0, 10) : "",
            firstEmiDate: data.first_emi_date ? data.first_emi_date.slice(0, 10) : "",
            dueDay: String(data.due_day || "10"),
            paidEmisCount: String(paidSchedulesCount),
            paymentMethod: data.payment_method || "Auto Debit",
            autoDebitEnabled: Boolean(
              data.payment_method === "Auto Debit" || data.debit_bank_name
            ),
            debitBankName: data.debit_bank_name || "",
            debitAccountNumber: data.debit_account_number || "",
            reminder7Days: true,
            reminder3Days: true,
            reminder1Day: true,
            reminderDueDate: true,
            notes: data.notes || "",
          };
        });

        if (paidSchedulesCount > 0) {
          setLoanMode("running");
        }
        if (
          data.first_emi_amount &&
          Number(data.first_emi_amount) > 0 &&
          Number(data.first_emi_amount) !== Number(data.emi_amount)
        ) {
          setHasBrokenPeriod(true);
        }
      }
    } catch (err: unknown) {
      if (!isSilent) {
        const apiErr = err as { response?: { data?: { message?: string } } };
        const msg =
          apiErr?.response?.data?.message ||
          "Loan record not found or you do not have permission to view it.";
        setError(msg);
      }
    } finally {
      if (!isSilent) {
        setIsLoading(false);
      }
    }
  }, [loanId, isEditModalOpen, loan]);

  useEffect(() => {
    loadLoanDetails();
  }, [loadLoanDetails]);

  // Live real-time background sync when viewing this EMI (Event-driven without interval polling)
  useEffect(() => {
    const handleRefresh = () => {
      if (!isEditModalOpen) {
        loadLoanDetails(true);
      }
    };

    const handleFocus = () => {
      if (!isEditModalOpen) {
        loadLoanDetails(true);
      }
    };

    window.addEventListener("myvello:refresh_emis", handleRefresh);
    window.addEventListener("myvello:live_data_update", handleRefresh);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("myvello:refresh_emis", handleRefresh);
      window.removeEventListener("myvello:live_data_update", handleRefresh);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadLoanDetails, isEditModalOpen]);

  // Calculations for Edit & Display
  const principalNum = parseFloat(formData.originalAmount) || 0;
  const rateNum = parseFloat(formData.interestRate) || 0;
  const tenureNum = parseInt(formData.tenureMonths, 10) || 0;
  const feeNum = parseFloat(formData.processingFee) || 0;

  const isFeeFinanced = feeNum > 0 && formData.processingFeeType === "financed";
  const effectivePrincipal = isFeeFinanced ? principalNum + feeNum : principalNum;
  const netDisbursedAmount =
    feeNum > 0 && formData.processingFeeType === "deducted"
      ? Math.max(0, principalNum - feeNum)
      : principalNum;

  const standardEmi = useMemo(() => {
    return calculateEmi(effectivePrincipal, rateNum, tenureNum);
  }, [effectivePrincipal, rateNum, tenureNum]);

  const { estimatedBpi } = useMemo(() => {
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
    return { estimatedBpi: bpi };
  }, [formData.loanStartDate, formData.firstEmiDate, rateNum, effectivePrincipal]);

  const { firstMonthEmi, subsequentMonthlyEmi } = useMemo(() => {
    if (!hasBrokenPeriod || tenureNum <= 1) {
      return { firstMonthEmi: standardEmi, subsequentMonthlyEmi: standardEmi };
    }
    const userTyped = parseFloat(formData.firstEmiAmount) || 0;
    if (formData.firstEmiType === "bpi") {
      const m1 = userTyped > 0 ? userTyped : standardEmi + estimatedBpi;
      return { firstMonthEmi: m1, subsequentMonthlyEmi: standardEmi };
    } else {
      const monthlyRate = rateNum / (12 * 100);
      const m1Interest = Math.round(effectivePrincipal * monthlyRate);
      const m1 = userTyped > 0 ? userTyped : Math.round(standardEmi * 1.5);
      if (m1 > m1Interest) {
        const m1PrincipalReduction = m1 - m1Interest;
        const remainingPrincipal = Math.max(0, effectivePrincipal - m1PrincipalReduction);
        const remMonths = tenureNum - 1;
        const reamortizedEmi = calculateEmi(remainingPrincipal, rateNum, remMonths);
        return { firstMonthEmi: m1, subsequentMonthlyEmi: reamortizedEmi };
      }
      return { firstMonthEmi: m1, subsequentMonthlyEmi: standardEmi };
    }
  }, [hasBrokenPeriod, tenureNum, formData.firstEmiAmount, formData.firstEmiType, standardEmi, estimatedBpi, rateNum, effectivePrincipal]);

  // Active EMI amount
  const activeEmiNum = parseFloat(formData.emiAmount) || subsequentMonthlyEmi || 0;

  // Running loan paid count
  const paidCountNum = useMemo(() => {
    const schedulesPaid = (loan?.schedules || []).filter((s) => s.status === "paid").length;
    if (loanMode === "running") {
      const parsed = parseInt(formData.paidEmisCount, 10);
      return !isNaN(parsed) && parsed >= 0 ? parsed : schedulesPaid;
    }
    return schedulesPaid;
  }, [loanMode, formData.paidEmisCount, loan?.schedules]);

  // Outstanding principal calculation
  const estimatedRemainingPrincipal = useMemo(() => {
    if (loan?.outstanding_principal && !autoCalculateEmi) {
      return Number(loan.outstanding_principal);
    }
    if (paidCountNum <= 0 || tenureNum <= 0 || principalNum <= 0) return effectivePrincipal;
    const ratio = Math.max(0, (tenureNum - paidCountNum) / tenureNum);
    return Math.round(effectivePrincipal * ratio);
  }, [loan?.outstanding_principal, autoCalculateEmi, effectivePrincipal, paidCountNum, tenureNum]);

  // Total Interest & Financial Totals
  const totalPayable = useMemo(() => {
    if (!tenureNum || tenureNum <= 0) return 0;
    if (hasBrokenPeriod && tenureNum > 1) {
      return firstMonthEmi + activeEmiNum * (tenureNum - 1);
    }
    return activeEmiNum * tenureNum;
  }, [tenureNum, hasBrokenPeriod, firstMonthEmi, activeEmiNum]);

  const totalInterest = Math.max(0, totalPayable - effectivePrincipal);

  // Maturity Date Prediction
  const maturityDateStr = useMemo(() => {
    if (!tenureNum || tenureNum <= 0) return "—";
    try {
      const d = new Date(formData.loanStartDate || new Date().toISOString().slice(0, 10));
      d.setMonth(d.getMonth() + tenureNum);
      return d.toLocaleDateString("en-IN", { month: "short", year: "numeric" });
    } catch {
      return "—";
    }
  }, [formData.loanStartDate, tenureNum]);

  // Validation & Error Handling
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

  const validateCurrentStep = (step: number): boolean => {
    const newErrors: Record<string, string> = { ...errors };

    if (step === 1) {
      delete newErrors.bankName;
      delete newErrors.loanName;
      delete newErrors.ownershipType;
      if (!formData.bankName.trim()) {
        newErrors.bankName = "Please select or enter the lender / bank name.";
      }
      if (!formData.loanName.trim()) {
        newErrors.loanName = "Please enter the loan commitment name.";
      }
      if (formData.ownershipType === "family_shared" && families.length === 0) {
        newErrors.ownershipType = "Please create a Family Workspace first, or choose Personal Vault.";
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
    } else if (step === 4) {
      delete newErrors.debitBankName;
      if (formData.paymentMethod === "Auto Debit" && !formData.debitBankName.trim()) {
        newErrors.debitBankName = "Please select or enter the bank account from which auto-debit will be deducted.";
      }
    }

    setErrors(newErrors);

    if (step === 1) return !newErrors.bankName && !newErrors.loanName && !newErrors.ownershipType;
    if (step === 2) return !newErrors.originalAmount && !newErrors.tenureMonths && !newErrors.emiAmount && !newErrors.firstEmiAmount;
    if (step === 3) return !newErrors.dueDay && !newErrors.loanStartDate && !newErrors.firstEmiDate;
    if (step === 4) return !newErrors.debitBankName;
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep(currentStep) && currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleApplyStandardRate = (category: string) => {
    const rate = standardRatesByCategory[category] ?? 10.0;
    setFormData((prev) => ({ ...prev, interestRate: rate.toString() }));
  };

  // Archive / Reactivate
  const handleToggleArchive = async () => {
    if (!loan) return;
    setIsArchiving(true);
    setFormError(null);
    try {
      const res = await emiService.archiveEmi(loan.id);
      setLoan((prev) => (prev ? { ...prev, status: res.status as DetailedEmi["status"] } : null));
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setFormError(apiErr?.response?.data?.message || "Failed to update archive status.");
    } finally {
      setIsArchiving(false);
    }
  };

  // Delete
  const handleDeleteLoan = async () => {
    if (!loan) return;
    setIsDeleting(true);
    setFormError(null);
    try {
      await emiService.deleteEmi(loan.id);
      router.push("/emis");
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setFormError(apiErr?.response?.data?.message || "Failed to delete loan commitment.");
      setIsDeleting(false);
    }
  };

  // Save Changes
  const handleSaveChanges = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loan) return;

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
      if (!validateCurrentStep(1)) setCurrentStep(1);
      else if (!validateCurrentStep(2)) setCurrentStep(2);
      else if (!validateCurrentStep(3)) setCurrentStep(3);
      else if (!validateCurrentStep(4)) setCurrentStep(4);
      return;
    }

    setIsSaving(true);
    setFormError(null);
    try {
      const activeReminders: number[] = [];
      if (formData.reminder7Days) activeReminders.push(7);
      if (formData.reminder3Days) activeReminders.push(3);
      if (formData.reminder1Day) activeReminders.push(1);
      if (formData.reminderDueDate) activeReminders.push(0);

      const updated = await emiService.updateEmi(loan.id, {
        loan_name: formData.loanName.trim() || `${formData.bankName} ${formData.loanCategory}`,
        loan_category: formData.loanCategory,
        lender_name: formData.bankName.trim(),
        loan_reference: formData.loanReference.trim() || undefined,
        original_loan_amount: principalNum,
        emi_amount: activeEmiNum,
        interest_rate: rateNum > 0 ? rateNum : undefined,
        processing_fee: feeNum > 0 ? feeNum : undefined,
        processing_fee_type: feeNum > 0 ? formData.processingFeeType : undefined,
        first_emi_amount: hasBrokenPeriod ? firstMonthEmi : undefined,
        first_emi_type: hasBrokenPeriod ? formData.firstEmiType : undefined,
        net_disbursed_amount: netDisbursedAmount,
        due_day: parseInt(formData.dueDay, 10) || 10,
        loan_start_date: formData.loanStartDate || undefined,
        first_emi_date: formData.firstEmiDate || undefined,
        loan_tenure_months: tenureNum,
        payment_method: formData.paymentMethod,
        debit_bank_name:
          formData.paymentMethod === "Auto Debit"
            ? formData.debitBankName.trim() || undefined
            : undefined,
        debit_account_number:
          formData.paymentMethod === "Auto Debit"
            ? formData.debitAccountNumber.trim() || undefined
            : undefined,
        reminder_enabled: true,
        reminder_days_before: activeReminders,
        ownership_type: formData.ownershipType as "personal" | "family_shared",
        family_id:
          formData.ownershipType === "family_shared"
            ? formData.familyId || loan.family_id || (families.length > 0 ? families[0].id : undefined)
            : null,
        notes: formData.notes.trim() || undefined,
      });

      setLoan((prev) => ({
        ...prev!,
        ...updated,
        schedules: updated.schedules || prev?.schedules || [],
        payments: updated.payments || prev?.payments || [],
      }));

      setSaveSuccess(true);
      setIsEditModalOpen(false);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: unknown) {
      const apiErr = err as { response?: { data?: { message?: string } } };
      setFormError(apiErr?.response?.data?.message || "Failed to save loan updates.");
    } finally {
      setIsSaving(false);
    }
  };

  // CSV Statement Export
  const handleExportCsv = () => {
    if (!loan || !loan.schedules?.length) return;
    const headers = "Installment #,Due Date,Due Amount,Paid Amount,Paid Date,Status\n";
    const rows = loan.schedules
      .map(
        (s) =>
          `#${s.installment_number},"${s.due_date}",${s.due_amount},${s.paid_amount || 0},"${s.paid_date || ""}",${s.status}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${loan.loan_name.replace(/\s+/g, "_")}_schedule.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputClass =
    "w-full h-11 sm:h-10 text-xs sm:text-sm px-3.5 rounded-xl border border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all text-slate-900 placeholder:text-slate-400 font-semibold shadow-2xs touch-manipulation";

  const getInputClass = (hasError?: boolean, extra?: string) =>
    cn(
      "w-full h-11 sm:h-10 text-xs sm:text-sm px-3.5 rounded-xl border transition-all placeholder:text-slate-400 font-semibold shadow-2xs focus:outline-none touch-manipulation",
      hasError
        ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20 text-rose-900"
        : "border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900",
      extra
    );

  const schedules = useMemo(() => loan?.schedules || [], [loan?.schedules]);
  const payments = useMemo(() => loan?.payments || [], [loan?.payments]);
  const paidCount = useMemo(() => schedules.filter((s) => s.status === "paid").length, [schedules]);
  const totalCount = loan?.loan_tenure_months || loan?.total_emis || schedules.length || 1;
  const remainingCount = Math.max(0, totalCount - paidCount);
  const progressPercent = Math.min(100, Math.round((paidCount / totalCount) * 100));
  const nextPendingSchedule = schedules.find((s) => s.status !== "paid");

  const isClosed = loan?.status === "closed";
  const isCompleted = loan?.status === "completed";

  // Filtered schedule list memoized for 0ms in-memory instant operations
  const filteredSchedules = useMemo(() => {
    return schedules.filter((s) => {
      if (scheduleFilter === "paid") return s.status === "paid";
      if (scheduleFilter === "pending") return s.status !== "paid";
      if (scheduleFilter === "overdue") return s.status === "overdue";
      return true;
    });
  }, [schedules, scheduleFilter]);

  const steps = [
    { id: 1, title: "Loan Details", icon: Building2 },
    { id: 2, title: "Financials", icon: CreditCard },
    { id: 3, title: "Schedule", icon: Calendar },
    { id: 4, title: "Preferences", icon: Zap },
  ];

  // Loading Skeleton - Only show on cold load when data is empty
  if (isLoading && !loan) {
    return <EmiDetailSkeleton />;
  }

  // Not Found State
  if (error || !loan) {
    return (
      <div className="relative -mt-18 pt-24 pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center select-none min-h-dvh flex flex-col justify-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 mx-auto mb-4 shadow-2xs">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-[#0B132B] tracking-tight">
          EMI Record Not Found
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-2 mb-6 leading-relaxed">
          {error || `The requested EMI record #${loanId} does not exist in your vault or you do not have permission to view it.`}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/emis" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to EMI Management</span>
            </button>
          </Link>
          <Link href="/emis/new" className="w-full sm:w-auto">
            <button
              type="button"
              className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-1.5 px-5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95 touch-manipulation transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add New EMI</span>
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative -mt-18 pt-20 pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden min-h-dvh select-none">
      {/* Living Aurora Gradient Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#F0F5FF]/80 to-[#F0F5FF]" />
      </div>

      <div className="relative z-10 max-w-[1500px] mx-auto space-y-4 sm:space-y-6">
        {/* Mobile Top Navigation: Clean, thumb-friendly return link */}
        <div className="flex items-center justify-between gap-2 lg:hidden">
          <Link
            href="/emis"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs active:scale-95 touch-manipulation transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
            <span>Back to EMI Management</span>
          </Link>
        </div>

        {/* HERO CARD: EMI ACCOUNT MAIN BANNER */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Bank Logo & Loan Identity */}
            <div className="flex items-start gap-3 sm:gap-3.5 min-w-0">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                <BankLogo bankName={loan.lender_name} size="md" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-black text-[#0B132B] tracking-tight break-words">
                    {loan.loan_name}
                  </h1>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize shrink-0",
                      isClosed
                        ? "bg-slate-100 text-slate-600 border border-slate-200"
                        : isCompleted
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    )}
                  >
                    {isClosed ? "Archived" : loan.status}
                  </span>
                  {loan.ownership_type === "family_shared" ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                      <Share2 className="w-3 h-3" />
                      <span>Family Shared {loan.family ? `(${loan.family.name})` : ""}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                      <Lock className="w-3 h-3" />
                      <span>Personal Vault</span>
                    </span>
                  )}
                  {saveSuccess && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white shadow-xs animate-in fade-in duration-200 shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>Changes saved</span>
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-x-2 gap-y-1 text-xs text-slate-500 font-medium flex-wrap">
                  <span>Lender: <strong className="text-slate-800 font-bold">{loan.lender_name}</strong></span>
                  {loan.loan_reference && (
                    <>
                      <span>•</span>
                      <span>Account Ref: <strong className="font-mono text-slate-800 font-bold">{loan.loan_reference}</strong></span>
                    </>
                  )}
                  <span>•</span>
                  <span>Category: <strong className="text-slate-800 font-bold">{loan.loan_category}</strong></span>
                  {loan.debit_bank_name && (
                    <>
                      <span>•</span>
                      <span className="text-emerald-700 font-bold">Auto-Debit: {loan.debit_bank_name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Actions: Prominent Full-Width Pay Next Due Button + Adaptive Action Row (Zero Scrollbars) */}
            <div className="flex flex-col gap-2.5 w-full lg:hidden pt-1">
              {nextPendingSchedule && !isClosed && (
                <button
                  type="button"
                  onClick={() =>
                    setPayTarget({
                      id: loan.id,
                      loanName: loan.loan_name,
                      bankName: loan.lender_name,
                      emiAmount: Number(nextPendingSchedule.due_amount),
                      nextDueDate: nextPendingSchedule.due_date,
                      scheduleId: nextPendingSchedule.id,
                      familyMembers: loan.family?.members,
                    })
                  }
                  className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-600/20 active:scale-95 touch-manipulation cursor-pointer transition-all"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Mark Next Due as Paid ({formatCurrency(nextPendingSchedule.due_amount, currency)})</span>
                </button>
              )}

              {/* Secondary Actions: Clean Full-Width Row without cut-offs or scrollbars */}
              <div className="flex items-center gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setIsEditModalOpen(true);
                  }}
                  className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 rounded-xl border border-indigo-200/80 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-bold shadow-2xs active:scale-95 touch-manipulation cursor-pointer transition-all"
                >
                  <Pencil className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Edit Details</span>
                </button>

                {!isClosed && !isCompleted && Number(loan.outstanding_principal) > 0 && (
                  <button
                    type="button"
                    onClick={() => setIsForecloseModalOpen(true)}
                    className="flex-1 min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold shadow-2xs active:scale-95 touch-manipulation cursor-pointer transition-all"
                  >
                    <Landmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>Foreclose</span>
                  </button>
                )}

                {/* 3-Dot More Actions Menu */}
                <div className="relative inline-block text-left shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsMobileMoreOpen((prev) => !prev)}
                    className={cn(
                      "w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 flex items-center justify-center shadow-2xs transition-all active:scale-95 touch-manipulation cursor-pointer",
                      isMobileMoreOpen && "bg-slate-100 border-indigo-300 text-indigo-700 ring-2 ring-indigo-500/10"
                    )}
                    aria-label="More actions"
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </button>

                  {isMobileMoreOpen && (
                    <>
                      {/* Invisible backdrop to dismiss on tap */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsMobileMoreOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-1.5 z-50 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 text-left space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                        <button
                          type="button"
                          disabled={isArchiving}
                          onClick={() => {
                            setIsMobileMoreOpen(false);
                            handleToggleArchive();
                          }}
                          className="w-full min-h-[40px] px-3 rounded-xl hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer touch-manipulation text-left"
                        >
                          {isClosed ? (
                            <>
                              <ArchiveRestore className="w-4 h-4 text-indigo-600" />
                              <span>Reactivate Commitment</span>
                            </>
                          ) : (
                            <>
                              <Archive className="w-4 h-4 text-slate-500" />
                              <span>Archive Commitment</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setIsMobileMoreOpen(false);
                            setIsDeleteModalOpen(true);
                          }}
                          className="w-full min-h-[40px] px-3 rounded-xl hover:bg-rose-50 text-rose-600 text-xs font-semibold flex items-center gap-2.5 transition-colors cursor-pointer touch-manipulation text-left"
                        >
                          <Trash2 className="w-4 h-4 text-rose-600" />
                          <span>Delete Commitment</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Actions Bar */}
            <div className="hidden lg:flex items-center gap-2 flex-wrap self-start lg:self-auto">
              <Link href="/emis">
                <button
                  type="button"
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs active:scale-95 touch-manipulation transition-all cursor-pointer"
                  title="Back to all commitments"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                  <span>Back</span>
                </button>
              </Link>

              {/* Edit Loan Button */}
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setIsEditModalOpen(true);
                }}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3 rounded-xl border border-indigo-200/80 bg-indigo-50/70 hover:bg-indigo-100 text-indigo-700 text-xs font-bold shadow-2xs active:scale-95 touch-manipulation transition-all cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-indigo-600" />
                <span>Edit Details</span>
              </button>

              {/* Foreclose Loan Button */}
              {!isClosed && !isCompleted && Number(loan.outstanding_principal) > 0 && (
                <button
                  type="button"
                  onClick={() => setIsForecloseModalOpen(true)}
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold shadow-2xs active:scale-95 touch-manipulation transition-all cursor-pointer"
                  title="Pre-close or foreclose this loan ahead of schedule"
                >
                  <Landmark className="w-3.5 h-3.5 text-amber-600" />
                  <span>Foreclose Loan</span>
                </button>
              )}

              {/* Archive / Reactivate */}
              <button
                type="button"
                disabled={isArchiving}
                onClick={handleToggleArchive}
                className={cn(
                  "min-h-[38px] inline-flex items-center gap-1.5 px-3 rounded-xl border text-xs font-bold shadow-2xs active:scale-95 touch-manipulation transition-all cursor-pointer",
                  isClosed
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                    : "bg-white border-slate-200/90 hover:bg-slate-50 text-slate-700"
                )}
              >
                {isClosed ? (
                  <>
                    <ArchiveRestore className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Reactivate</span>
                  </>
                ) : (
                  <>
                    <Archive className="w-3.5 h-3.5 text-slate-500" />
                    <span>Archive</span>
                  </>
                )}
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                className="min-h-[38px] inline-flex items-center gap-1.5 px-3 rounded-xl border border-rose-200/80 bg-rose-50/60 hover:bg-rose-100/70 text-rose-700 text-xs font-bold shadow-2xs active:scale-95 touch-manipulation transition-all cursor-pointer"
                title="Delete loan commitment"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Delete</span>
              </button>

              {/* Pay Next Due Button */}
              {nextPendingSchedule && !isClosed && (
                <button
                  type="button"
                  onClick={() =>
                    setPayTarget({
                      id: loan.id,
                      loanName: loan.loan_name,
                      bankName: loan.lender_name,
                      emiAmount: Number(nextPendingSchedule.due_amount),
                      nextDueDate: nextPendingSchedule.due_date,
                      scheduleId: nextPendingSchedule.id,
                      familyMembers: loan.family?.members,
                    })
                  }
                  className="min-h-[38px] inline-flex items-center gap-1.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs shadow-emerald-600/20 cursor-pointer active:scale-95 touch-manipulation transition-all"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Mark Next Due as Paid</span>
                </button>
              )}
            </div>
          </div>

          {/* 4 Financial KPI Overview Cards - Scaled & Touch Friendly */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 pt-3.5 border-t border-slate-100">
            <div className="p-3 sm:p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/70">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Monthly Instalment
              </span>
              <span className="text-base sm:text-lg lg:text-xl font-black text-indigo-700 mt-0.5 block tracking-tight truncate">
                {formatCurrency(loan.emi_amount, currency)}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block mt-0.5 truncate">
                Due on {loan.due_day}th of every month
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Outstanding Principal
              </span>
              <span className="text-base sm:text-lg lg:text-xl font-black text-slate-900 mt-0.5 block tracking-tight truncate">
                {formatCurrency(loan.outstanding_principal || estimatedRemainingPrincipal, currency)}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block mt-0.5 truncate">
                Sanctioned: {formatCurrency(loan.original_loan_amount, currency)}
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Repayment Progress
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200 shrink-0">
                  {progressPercent}%
                </span>
              </div>
              <span className="text-base sm:text-lg lg:text-xl font-black text-slate-900 mt-0.5 block tracking-tight truncate">
                {paidCount} / {totalCount} EMIs
              </span>
              <div className="w-full h-1.5 bg-slate-200/80 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="p-3 sm:p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Interest & Timeline
              </span>
              <span className="text-base sm:text-lg lg:text-xl font-black text-slate-900 mt-0.5 block tracking-tight truncate">
                {loan.interest_rate || "—"}% <span className="text-xs font-semibold text-slate-400">p.a.</span>
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block mt-0.5 truncate">
                {totalCount} months • Ends {maturityDateStr}
              </span>
            </div>
          </div>
        </div>

        {/* 2-COLUMN MAIN LANDING PAGE CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* LEFT COLUMN: Tabs (Schedule / History / Terms) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Themed Segmented Tab Switcher with Momentum Touch Scroll */}
            <div className="flex items-center justify-between pb-1 gap-2">
              <div className="overflow-x-auto no-scrollbar scroll-smooth p-1 rounded-[14px] bg-white border border-slate-200/80 shadow-2xs flex items-center gap-1 max-w-full">
                <button
                  type="button"
                  onClick={() => setActiveTab("schedule")}
                  className={cn(
                    "min-h-[42px] sm:min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-[10px] text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 touch-manipulation",
                    activeTab === "schedule"
                      ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                      : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                  )}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="sm:hidden">Schedule</span>
                  <span className="hidden sm:inline">Amortization Schedule</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-bold transition-colors min-w-[18px] text-center",
                      activeTab === "schedule" ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {schedules.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("history")}
                  className={cn(
                    "min-h-[42px] sm:min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-[10px] text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 touch-manipulation",
                    activeTab === "history"
                      ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                      : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                  )}
                >
                  <History className="w-3.5 h-3.5" />
                  <span className="sm:hidden">History</span>
                  <span className="hidden sm:inline">Payment History</span>
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-bold transition-colors min-w-[18px] text-center",
                      activeTab === "history" ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"
                    )}
                  >
                    {payments.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("terms")}
                  className={cn(
                    "min-h-[42px] sm:min-h-[36px] px-3 sm:px-3.5 py-1.5 rounded-[10px] text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 active:scale-95 touch-manipulation",
                    activeTab === "terms"
                      ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                      : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                  )}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span className="sm:hidden">Specifications</span>
                  <span className="hidden sm:inline">Loan Specifications</span>
                </button>
              </div>

              {/* CSV Export Button */}
              {activeTab === "schedule" && schedules.length > 0 && (
                <button
                  type="button"
                  onClick={handleExportCsv}
                  className="min-h-[42px] sm:min-h-[36px] inline-flex items-center gap-1.5 px-3 rounded-[10px] border border-slate-200/80 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 touch-manipulation shrink-0"
                  title="Export schedule as CSV spreadsheet"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>
              )}
            </div>

            {/* TAB 1: AMORTIZATION SCHEDULE */}
            {activeTab === "schedule" && (
              <div className="bg-white rounded-[16px] border border-slate-200/80 shadow-xs overflow-hidden animate-in fade-in duration-150">
                {/* Status filter bar */}
                <div className="p-3 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2 bg-slate-50/50">
                  <div className="overflow-x-auto no-scrollbar flex items-center gap-1 -mx-1 px-1 py-0.5 text-xs max-w-full">
                    <Filter className="w-3 h-3 text-slate-400 mr-1 shrink-0" />
                    {(["all", "pending", "paid", "overdue"] as const).map((filter) => {
                      const count =
                        filter === "all"
                          ? schedules.length
                          : filter === "paid"
                          ? paidCount
                          : filter === "pending"
                          ? remainingCount
                          : schedules.filter((s) => s.status === "overdue").length;

                      return (
                        <button
                          key={filter}
                          type="button"
                          onClick={() => setScheduleFilter(filter)}
                          className={cn(
                            "min-h-[36px] px-2.5 py-1 rounded-[8px] text-[11px] font-bold capitalize transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation",
                            scheduleFilter === filter
                              ? "bg-indigo-600 text-white shadow-2xs"
                              : "text-slate-500 hover:text-slate-900 hover:bg-white"
                          )}
                        >
                          {filter} ({count})
                        </button>
                      );
                    })}
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Showing {filteredSchedules.length} of {schedules.length} instalments
                  </span>
                </div>

                {filteredSchedules.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">No instalments found for this filter.</p>
                  </div>
                ) : (
                  <>
                    {/* DESKTOP VIEW: Full Amortization Table */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-slate-100/90 bg-slate-50/50 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                            <th className="py-2.5 px-4">#</th>
                            <th className="py-2.5 px-4">DUE DATE</th>
                            <th className="py-2.5 px-4">INSTALMENT AMOUNT</th>
                            <th className="py-2.5 px-4">PAID AMOUNT</th>
                            <th className="py-2.5 px-4">PAID DATE</th>
                            {loan.ownership_type === "family_shared" && (
                              <th className="py-2.5 px-4">PAID BY</th>
                            )}
                            <th className="py-2.5 px-4">STATUS</th>
                            <th className="py-2.5 px-4 text-right">ACTION</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {filteredSchedules.map((item) => {
                            const isPaid = item.status === "paid";
                            const isDueSoon = item.status === "due_soon";
                            const isOverdue = item.status === "overdue";

                            return (
                              <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                                <td className="py-2.5 px-4 font-bold text-slate-700">
                                  #{item.installment_number}
                                </td>
                                <td className="py-2.5 px-4 font-semibold text-slate-800 whitespace-nowrap">
                                  {formatDate(item.due_date)}
                                </td>
                                <td className="py-2.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                                  {formatCurrency(item.due_amount, currency)}
                                </td>
                                <td className="py-2.5 px-4 text-slate-600 whitespace-nowrap">
                                  {Number(item.paid_amount) > 0 ? formatCurrency(item.paid_amount, currency) : "—"}
                                </td>
                                <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                                  {formatDate(item.paid_date)}
                                </td>
                                {loan.ownership_type === "family_shared" && (
                                  <td className="py-2.5 px-4 whitespace-nowrap">
                                    {isPaid ? (
                                      item.payment?.user ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                                          <div className="relative w-4 h-4 rounded-full bg-indigo-200 text-indigo-700 font-black text-[9px] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                            {item.payment.user.profile_photo ? (
                                              <Image
                                                src={item.payment.user.profile_photo}
                                                alt={item.payment.user.name}
                                                fill
                                                unoptimized
                                                sizes="16px"
                                                className="object-cover"
                                              />
                                            ) : (
                                              <span>{item.payment.user.name.charAt(0).toUpperCase()}</span>
                                            )}
                                          </div>
                                          <span>{item.payment.user.name}</span>
                                          {item.payment.user.id === user?.id && (
                                            <span className="text-[9px] opacity-70">(You)</span>
                                          )}
                                        </span>
                                      ) : (
                                        <span className="text-slate-400 text-xs">—</span>
                                      )
                                    ) : (
                                      <span className="text-slate-400 text-xs">—</span>
                                    )}
                                  </td>
                                )}
                                <td className="py-2.5 px-4 whitespace-nowrap">
                                  {isPaid ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      Paid
                                    </span>
                                  ) : isDueSoon ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                      Due Soon
                                    </span>
                                  ) : isOverdue ? (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                      Overdue
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                                      Upcoming
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 px-4 text-right whitespace-nowrap">
                                  {!isPaid && !isClosed && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setPayTarget({
                                          id: loan.id,
                                          loanName: loan.loan_name,
                                          bankName: loan.lender_name,
                                          emiAmount: Number(item.due_amount),
                                          nextDueDate: item.due_date,
                                          scheduleId: item.id,
                                          familyMembers: loan.family?.members,
                                        })
                                      }
                                      className="min-h-[34px] px-3 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:scale-95 touch-manipulation transition-all cursor-pointer"
                                    >
                                      Mark Paid
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* MOBILE VIEW: Touch-Friendly Native Stacked Cards */}
                    <div className="md:hidden divide-y divide-slate-100">
                      {filteredSchedules.map((item) => {
                        const isPaid = item.status === "paid";
                        const isDueSoon = item.status === "due_soon";
                        const isOverdue = item.status === "overdue";

                        return (
                          <div key={item.id} className="p-4 space-y-3 bg-white transition-colors">
                            {/* Card Header: Installment # + Due Date + Status */}
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="px-2 py-0.5 rounded-md text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0">
                                  #{item.installment_number}
                                </span>
                                <span className="text-xs font-semibold text-slate-700 flex items-center gap-1 truncate">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>Due {formatDate(item.due_date)}</span>
                                </span>
                              </div>

                              <div className="shrink-0">
                                {isPaid ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Paid
                                  </span>
                                ) : isDueSoon ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                    Due Soon
                                  </span>
                                ) : isOverdue ? (
                                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                    Overdue
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                                    Upcoming
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Amount & Paid Details */}
                            <div className="flex items-baseline justify-between pt-0.5">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Instalment Amount
                                </span>
                                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight block">
                                  {formatCurrency(item.due_amount, currency)}
                                </span>
                              </div>
                              {Number(item.paid_amount) > 0 && (
                                <div className="text-right">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                    Paid Amount
                                  </span>
                                  <span className="text-xs font-bold text-emerald-700 block">
                                    {formatCurrency(item.paid_amount, currency)} {item.paid_date ? `(${formatDate(item.paid_date)})` : ""}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Family Shared: Who Paid */}
                            {loan.ownership_type === "family_shared" && isPaid && item.payment?.user && (
                              <div className="pt-0.5 flex items-center gap-1.5 text-xs">
                                <span className="text-[11px] text-slate-400 font-medium">Paid by:</span>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                                  <div className="relative w-3.5 h-3.5 rounded-full bg-indigo-200 text-indigo-700 font-black text-[9px] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                    {item.payment.user.profile_photo ? (
                                      <Image
                                        src={item.payment.user.profile_photo}
                                        alt={item.payment.user.name}
                                        fill
                                        unoptimized
                                        sizes="14px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <span>{item.payment.user.name.charAt(0).toUpperCase()}</span>
                                    )}
                                  </div>
                                  <span>{item.payment.user.name}</span>
                                  {item.payment.user.id === user?.id && (
                                    <span className="text-[9px] opacity-70">(You)</span>
                                  )}
                                </span>
                              </div>
                            )}

                            {/* Action: Mark Paid Button */}
                            {!isPaid && !isClosed && (
                              <button
                                type="button"
                                onClick={() =>
                                  setPayTarget({
                                    id: loan.id,
                                    loanName: loan.loan_name,
                                    bankName: loan.lender_name,
                                    emiAmount: Number(item.due_amount),
                                    nextDueDate: item.due_date,
                                    scheduleId: item.id,
                                    familyMembers: loan.family?.members,
                                  })
                                }
                                className="w-full min-h-[44px] rounded-xl bg-theme-gradient text-white text-xs font-bold shadow-xs active:scale-95 touch-manipulation flex items-center justify-center gap-2 cursor-pointer mt-1"
                              >
                                <Check className="w-4 h-4 stroke-[3]" />
                                <span>Mark Paid ({formatCurrency(item.due_amount, currency)})</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* TAB 2: PAYMENT HISTORY */}
            {activeTab === "history" && (
              <div className="bg-white rounded-[16px] border border-slate-200/80 shadow-xs overflow-hidden p-4 sm:p-5 animate-in fade-in duration-150 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <h3 className="text-xs font-bold text-slate-900">Recorded Payment Transactions</h3>
                  <span className="text-[11px] text-slate-400 font-medium">{payments.length} payments recorded</span>
                </div>

                {payments.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Receipt className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">No recorded payments yet.</p>
                    <p className="text-[11px] text-slate-400">Payments will appear here when installments are marked paid.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {payments.map((p) => (
                      <div
                        key={p.id}
                        className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border border-emerald-200">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-slate-900">
                                Payment for EMI #{schedules.find((s) => s.id === p.emi_schedule_id)?.installment_number || p.emi_schedule_id || "—"}
                              </span>
                              {p.user && (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs">
                                  <div className="relative w-3.5 h-3.5 rounded-full bg-indigo-200 text-indigo-700 font-black text-[9px] flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
                                    {p.user.profile_photo ? (
                                      <Image
                                        src={p.user.profile_photo}
                                        alt={p.user.name}
                                        fill
                                        unoptimized
                                        sizes="14px"
                                        className="object-cover"
                                      />
                                    ) : (
                                      <span>{p.user.name.charAt(0).toUpperCase()}</span>
                                    )}
                                  </div>
                                  <span>Paid by {p.user.name}</span>
                                  {p.user.id === user?.id && <span className="opacity-70 text-[9px]">(You)</span>}
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span>Paid on {formatDate(p.payment_date)}</span>
                              <span>•</span>
                              <span>Mode: {p.payment_method || loan.payment_method}</span>
                              {p.notes && (
                                <>
                                  <span>•</span>
                                  <span className="italic text-slate-600 font-medium truncate max-w-[200px]">
                                    &ldquo;{p.notes}&rdquo;
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-emerald-700 block">
                            {formatCurrency(p.amount, currency)}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            {p.transaction_reference || "Direct Mark"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: LOAN SPECIFICATIONS & TERMS */}
            {activeTab === "terms" && (
              <div className="bg-white rounded-[16px] border border-slate-200/80 shadow-xs p-5 animate-in fade-in duration-150 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <h3 className="text-xs font-bold text-[#0B132B]">Complete Loan Specifications</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Underlying contract parameters and banking terms.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentStep(1);
                      setIsEditModalOpen(true);
                    }}
                    className="h-7 px-2.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Pencil className="w-3 h-3" />
                    <span>Edit Terms</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lender / Financial Institution</span>
                    <span className="font-bold text-slate-900 text-xs block">{loan.lender_name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Loan Commitment Name</span>
                    <span className="font-bold text-slate-900 text-xs block">{loan.loan_name}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Loan Category</span>
                    <span className="font-bold text-slate-900 text-xs block">{loan.loan_category}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sanctioned Principal</span>
                    <span className="font-bold text-slate-900 text-xs block">{formatCurrency(loan.original_loan_amount, currency)}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Annual Interest Rate</span>
                    <span className="font-bold text-slate-900 text-xs block">{loan.interest_rate ? `${loan.interest_rate}% p.a.` : "—"}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Loan Tenure</span>
                    <span className="font-bold text-slate-900 text-xs block">{loan.loan_tenure_months || loan.total_emis} months</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Start Date & Maturity</span>
                    <span className="font-bold text-slate-900 text-xs block">
                      {formatDate(loan.loan_start_date)} to {maturityDateStr}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Due Day</span>
                    <span className="font-bold text-indigo-700 text-xs block">Every month on the {loan.due_day}th</span>
                  </div>

                  {loan.first_emi_amount && Number(loan.first_emi_amount) > 0 && (
                    <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 space-y-0.5">
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block">1st Month Custom / BPI EMI</span>
                      <span className="font-bold text-indigo-900 text-xs block">{formatCurrency(loan.first_emi_amount, currency)}</span>
                    </div>
                  )}

                  {loan.processing_fee && Number(loan.processing_fee) > 0 && (
                    <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 space-y-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Processing Fee</span>
                      <span className="font-bold text-slate-900 text-xs block">
                        {formatCurrency(loan.processing_fee, currency)} ({loan.processing_fee_type === "financed" ? "Financed into EMIs" : "Deducted upfront"})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: STICKY INTELLIGENCE SIDEBAR */}
          <div className="lg:col-span-4 space-y-4">
            {/* Next Due Payment Action Card - Desktop Only (handled cleanly in hero banner on mobile) */}
            {nextPendingSchedule && !isClosed ? (
              <div className="hidden lg:block bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl p-4.5 sm:p-5 shadow-xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white backdrop-blur-xs">
                    Next Due Payment
                  </span>
                  <span className="text-xs font-semibold text-indigo-200">
                    Instalment #{nextPendingSchedule.installment_number}
                  </span>
                </div>

                <div>
                  <span className="text-[11px] text-indigo-200 block font-medium">Amount Payable</span>
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5 block">
                    {formatCurrency(nextPendingSchedule.due_amount, currency)}
                  </span>
                  <span className="text-xs text-indigo-100 font-semibold mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Due on {formatDate(nextPendingSchedule.due_date)}</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setPayTarget({
                      id: loan.id,
                      loanName: loan.loan_name,
                      bankName: loan.lender_name,
                      emiAmount: Number(nextPendingSchedule.due_amount),
                      nextDueDate: nextPendingSchedule.due_date,
                      scheduleId: nextPendingSchedule.id,
                      familyMembers: loan.family?.members,
                    })
                  }
                  className="w-full h-9 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold shadow-xs transition-all cursor-pointer active:scale-[0.99]"
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Mark This EMI as Paid</span>
                </button>
              </div>
            ) : isCompleted ? (
              <div className="hidden lg:block bg-emerald-600 text-white rounded-2xl p-4.5 sm:p-5 shadow-xs space-y-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-base font-black">Loan Fully Repaid!</h3>
                <p className="text-xs text-emerald-100 leading-relaxed">
                  All {totalCount} scheduled installments have been paid off in full. Outstanding balance is {formatCurrency(0, currency)}.
                </p>
              </div>
            ) : null}

            {/* Auto-Debit & Payment Mandate Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Payment Mandate & Automation
              </span>

              {loan.payment_method === "Auto Debit" ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100">
                    <div className="w-8 h-8 rounded-lg bg-white border border-emerald-200 flex items-center justify-center shrink-0">
                      <BankLogo bankName={loan.debit_bank_name || loan.lender_name} size="xs" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-emerald-950 block">
                        Auto-Debit Active
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold block">
                        {loan.debit_bank_name || loan.lender_name}
                        {loan.debit_account_number ? ` (${loan.debit_account_number})` : ""}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600 font-medium">
                    <div className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                      <span>NACH / ECS mandate active</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <CheckCircle2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span>Pre-mandate fund balance reminders on</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <span className="font-bold text-slate-800 block">Manual Payment Mode</span>
                  <span className="text-[11px] text-slate-500 block">
                    Method: {loan.payment_method}
                  </span>
                  <span className="text-[10px] text-indigo-600 font-semibold block pt-0.5">
                    Reminders active on 7d, 3d, 1d & due date
                  </span>
                </div>
              )}
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-4.5 shadow-xs space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Manage Commitment
              </span>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(1);
                  setIsEditModalOpen(true);
                }}
                className="w-full min-h-[44px] inline-flex items-center justify-start gap-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold active:scale-95 touch-manipulation transition-colors cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-indigo-600" />
                <span>Edit Loan Details & Parameters</span>
              </button>

              {!isClosed && !isCompleted && Number(loan.outstanding_principal) > 0 && (
                <button
                  type="button"
                  onClick={() => setIsForecloseModalOpen(true)}
                  className="w-full min-h-[44px] inline-flex items-center justify-start gap-2.5 px-3.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/90 text-amber-900 border border-amber-200/90 text-xs font-bold active:scale-95 touch-manipulation transition-colors cursor-pointer"
                >
                  <Landmark className="w-3.5 h-3.5 text-amber-600" />
                  <span>Foreclose / Full Settlement</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleExportCsv}
                className="w-full min-h-[44px] inline-flex items-center justify-start gap-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold active:scale-95 touch-manipulation transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Export Statement / Schedule (CSV)</span>
              </button>

              <button
                type="button"
                disabled={isArchiving}
                onClick={handleToggleArchive}
                className="w-full min-h-[44px] inline-flex items-center justify-start gap-2.5 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold active:scale-95 touch-manipulation transition-colors cursor-pointer"
              >
                <Archive className="w-3.5 h-3.5 text-slate-500" />
                <span>{isClosed ? "Reactivate Loan" : "Archive Commitment"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* EDIT MODAL: 4-STEP MINIMAL WIZARD FORM (Native Bottom Sheet on Mobile) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in select-none">
          <div className="relative w-full max-w-2xl bg-white rounded-t-[28px] sm:rounded-3xl border-t sm:border border-slate-200/90 shadow-2xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col overflow-hidden pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-0 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Mobile Pull Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-2.5 mb-1 sm:hidden shrink-0" />

            {/* Modal Header */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-[#0B132B]">Edit Loan Commitment</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="min-w-[40px] min-h-[40px] rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-95 transition-all cursor-pointer touch-manipulation"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step Bar */}
            <div className="px-4 sm:px-6 pt-3 pb-2 border-b border-slate-100 bg-white">
              <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
                {steps.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      if (s.id <= currentStep || validateCurrentStep(currentStep)) {
                        setCurrentStep(s.id);
                      }
                    }}
                    className={cn(
                      "min-h-[38px] sm:min-h-[36px] py-1.5 px-1 sm:px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 sm:gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation",
                      currentStep === s.id
                        ? "bg-indigo-600 text-white shadow-2xs"
                        : currentStep > s.id
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "text-slate-400 hover:bg-slate-50"
                    )}
                  >
                    <span>{s.id}.</span>
                    <span className="sm:hidden truncate">{s.title.split(" ")[0]}</span>
                    <span className="hidden sm:inline truncate">{s.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Form Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-4.5 flex-1">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-2.5 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-rose-700">{formError}</span>
                </div>
              )}

              {/* STEP 1: Loan & Institution Details */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-in fade-in duration-150">
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
                        currency={formData.currency || currency}
                        hasError={!!errors.bankName}
                        required
                        placeholder={
                          (formData.currency || currency) === "INR"
                            ? "Search banks (HDFC, SBI, ICICI, etc.)..."
                            : "e.g. Chase Bank, HSBC, Emirates NBD, Barclays..."
                        }
                      />
                      {errors.bankName && (
                        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
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
                        onChange={(val) => setFormData((prev) => ({ ...prev, loanCategory: val }))}
                        options={loanCategoryOptions}
                        className="w-full"
                        triggerClassName="h-10 rounded-xl border-slate-200/90 shadow-2xs font-semibold"
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
                        required
                        placeholder="e.g. HDFC Home Loan or MacBook Pro EMI"
                        value={formData.loanName}
                        onChange={(e) => {
                          setFormData({ ...formData, loanName: e.target.value });
                          clearError("loanName");
                        }}
                        className={getInputClass(!!errors.loanName)}
                      />
                      {errors.loanName && (
                        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
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
                        placeholder="e.g. HDFC-HL-982310"
                        value={formData.loanReference}
                        onChange={(e) => setFormData({ ...formData, loanReference: e.target.value })}
                        className={cn(inputClass, "font-mono")}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Record Privacy
                    </label>
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
                          onClick={() => {
                            setFormData({ ...formData, ownershipType: "personal", familyId: null });
                            clearError("ownershipType");
                          }}
                          className={cn(
                            "relative flex items-center gap-3 p-3 rounded-2xl border text-left cursor-pointer transition-all duration-150 focus:outline-none",
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
                            if (families.length > 0) {
                              clearError("ownershipType");
                            }
                          }}
                          className={cn(
                            "relative flex items-center gap-3 p-3 rounded-2xl border text-left cursor-pointer transition-all duration-150 focus:outline-none",
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
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        familyId: fam.id,
                                      }));
                                      clearError("ownershipType");
                                    }}
                                    className={cn(
                                      "relative flex items-center gap-3 p-3 rounded-xl border text-left cursor-pointer transition-all duration-150 focus:outline-none",
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
                    {errors.ownershipType && (
                      <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{errors.ownershipType}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Financials & Smart Amortization */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Sanctioned Loan Principal ({currencySymbol}) <span className="text-rose-500 font-bold ml-0.5">*</span>
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
                        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
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
                        <span className="text-[10px] text-slate-400 font-medium">Presets inside</span>
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
                        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.tenureMonths}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-bold text-slate-700">Interest Rate (% p.a.)</label>
                        {standardRatesByCategory[formData.loanCategory] !== undefined && (
                          <button
                            type="button"
                            onClick={() => handleApplyStandardRate(formData.loanCategory)}
                            className="text-[10px] font-bold text-indigo-600 hover:underline cursor-pointer"
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Monthly EMI Amount ({currencySymbol}) <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
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
                        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.emiAmount}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Processing Fee ({currencySymbol}) <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                      </label>
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
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Currency</label>
                      <CustomDropdown
                        size="md"
                        value={formData.currency}
                        onChange={(val) => setFormData({ ...formData, currency: val })}
                        options={newEmiCurrencyOptions}
                        className="w-full"
                        triggerClassName="h-10 rounded-xl border-slate-200/90 shadow-2xs font-semibold"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Schedule Dates */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Loan Start Date <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
                      <CustomDatePicker
                        value={formData.loanStartDate}
                        onChange={(val) => {
                          setFormData({ ...formData, loanStartDate: val });
                          clearError("loanStartDate");
                        }}
                        hasError={!!errors.loanStartDate}
                        required
                        placeholder="Select loan start date"
                      />
                      {errors.loanStartDate && (
                        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.loanStartDate}</span>
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        First EMI Due Date <span className="text-rose-500 font-bold ml-0.5">*</span>
                      </label>
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
                        <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>{errors.firstEmiDate}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Monthly Due Day (1 - 31) <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
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
                        className={cn(getInputClass(!!errors.dueDay), "w-24 text-center font-extrabold")}
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
                              "min-h-[40px] min-w-[40px] text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer active:scale-95 touch-manipulation",
                              formData.dueDay === day
                                ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                                : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                            )}
                          >
                            {day}th
                          </button>
                        ))}
                      </div>
                    </div>
                    {errors.dueDay && (
                      <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span>{errors.dueDay}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Preferences & Automation */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-in fade-in duration-150">
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
                        triggerClassName="h-10 rounded-xl border-slate-200/90 shadow-2xs font-semibold"
                      />
                    </div>

                    <div className="flex items-center pt-1 sm:pt-6">
                      {formData.paymentMethod === "Auto Debit" ? (
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold shadow-2xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Auto-Debit (NACH / ECS) Mandate Active</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-500 text-xs font-medium">
                          <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>Manual payment reminders active</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ONLY shown when Auto Debit is selected */}
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
                            currency={formData.currency || currency}
                            placeholder={
                              (formData.currency || currency) === "INR"
                                ? "Search bank (HDFC, SBI, ICICI, etc.)..."
                                : "e.g. Chase Bank, HSBC, Emirates NBD, Barclays..."
                            }
                            required={formData.paymentMethod === "Auto Debit"}
                            hasError={!!errors.debitBankName}
                          />
                          {errors.debitBankName && (
                            <p className="text-[11px] font-semibold text-rose-500 mt-1 flex items-center gap-1">
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
                            placeholder="e.g. •••• 4892 or A/c 501004928"
                            value={formData.debitAccountNumber}
                            onChange={(e) => setFormData({ ...formData, debitAccountNumber: e.target.value })}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="px-5 sm:px-6 py-3.5 sm:py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-semibold text-slate-400">
                Step {currentStep} of 4
              </span>

              <div className="flex items-center gap-2">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="min-h-[44px] px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold active:scale-95 touch-manipulation transition-colors cursor-pointer"
                  >
                    Previous
                  </button>
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="min-h-[44px] px-5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 touch-manipulation flex items-center gap-1.5"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleSaveChanges()}
                    className="min-h-[44px] px-5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 cursor-pointer active:scale-95 touch-manipulation disabled:opacity-60 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Native Bottom Sheet on Mobile) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in select-none">
          <div className="relative w-full max-w-sm sm:max-w-md bg-white rounded-t-[28px] sm:rounded-[24px] border-t sm:border border-slate-200/90 shadow-2xl p-5 sm:p-6 space-y-4 max-sm:pb-[calc(1.5rem+env(safe-area-inset-bottom))] animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Mobile Pull Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto mt-1 mb-2 sm:hidden shrink-0" />

            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5 pb-1">
              <h3 className="text-base sm:text-lg font-black text-[#0B132B]">Delete EMI Commitment?</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Are you sure you want to permanently delete <strong className="text-slate-900 font-bold">{loan.loan_name}</strong>? This will remove all {schedules.length} schedules, payment records, and calendar alerts. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="min-h-[44px] flex-1 sm:flex-initial px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs active:scale-95 touch-manipulation transition-all cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteLoan}
                className="min-h-[44px] flex-1 sm:flex-initial px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Commitment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REAL MARK AS PAID MODAL */}
      <MarkAsPaidModal
        isOpen={Boolean(payTarget)}
        onClose={() => setPayTarget(null)}
        emi={payTarget}
        familyMembers={loan?.family?.members}
        onSuccess={() => {
          setPayTarget(null);
          loadLoanDetails();
        }}
      />

      {/* FORECLOSURE MODAL */}
      <ForeclosureModal
        isOpen={isForecloseModalOpen}
        onClose={() => setIsForecloseModalOpen(false)}
        emi={loan}
        remainingInstalmentsCount={remainingCount}
        familyMembers={loan?.family?.members}
        onSuccess={() => {
          setIsForecloseModalOpen(false);
          loadLoanDetails();
        }}
      />
    </div>
  );
}

export default function EmiDetailPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<EmiDetailSkeleton />}>
        <EmiDetailContent />
      </Suspense>
    </DashboardLayout>
  );
}
