"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  CheckCircle2,
  Clock,
  Search,
  X,
  Copy,
  Check,
  Printer,
  Receipt,
  Landmark,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Zap,
  Building2,
  ExternalLink,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { emiService } from "@/services/emiService";
import { EmiPayment } from "@/types";
import { useAuth } from "@/modules/authentication/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { getCategoryIcon, getCategoryBgClass } from "@/lib/categoryConfig";
import { BankLogo } from "@/components/ui/BankLogo";
import { cn } from "@/lib/utils";

const paymentMethodFilterOptions = [
  { value: "All", label: "All Payment Methods" },
  { value: "Auto Debit", label: "Auto Debit" },
  { value: "UPI Transfer", label: "UPI Transfer" },
  { value: "NetBanking", label: "NetBanking" },
  { value: "Bank Transfer", label: "Bank Transfer" },
];

const sortOptions = [
  { value: "newest", label: "Date: Newest First" },
  { value: "oldest", label: "Date: Oldest First" },
  { value: "amount_desc", label: "Amount: Highest First" },
  { value: "amount_asc", label: "Amount: Lowest First" },
];

// Deep-equality comparison to prevent unnecessary DOM re-renders on identical API responses
function arePaymentsEqual(a: EmiPayment[], b: EmiPayment[]): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    const itemA = a[i];
    const itemB = b[i];

    if (
      itemA.id !== itemB.id ||
      itemA.amount !== itemB.amount ||
      itemA.paid_amount !== itemB.paid_amount ||
      itemA.payment_date !== itemB.payment_date ||
      itemA.transaction_reference !== itemB.transaction_reference ||
      itemA.payment_method !== itemB.payment_method ||
      itemA.emi_id !== itemB.emi_id ||
      itemA.emi_schedule_id !== itemB.emi_schedule_id
    ) {
      return false;
    }
  }

  return true;
}

// High-fidelity shimmer skeleton matching exact table & mobile card geometry to guarantee zero layout shift (CLS = 0)
function PaymentHistoryTableSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Mobile Card Skeletons */}
      <div className="block md:hidden divide-y divide-slate-100">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-200/80 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-32 bg-slate-200/80 rounded" />
                  <div className="h-3 w-20 bg-slate-200/50 rounded" />
                </div>
              </div>
              <div className="space-y-1 text-right">
                <div className="h-4 w-20 bg-slate-200/80 rounded ml-auto" />
                <div className="h-3 w-16 bg-slate-200/50 rounded ml-auto" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-1.5">
                <div className="h-5 w-18 bg-slate-200/60 rounded-md" />
                <div className="h-5 w-8 bg-slate-200/60 rounded-md" />
              </div>
              <div className="h-7 w-16 bg-slate-200/60 rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View Skeleton */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
              <th className="py-3.5 px-5">Loan & Creditor</th>
              <th className="py-3.5 px-4">Instalment</th>
              <th className="py-3.5 px-4">Payment Date</th>
              <th className="py-3.5 px-4">Amount Paid</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4">Reference / UTR</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-5 text-right">Receipt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/90">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <tr key={i} className="hover:bg-slate-50/60">
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200/80 shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-36 bg-slate-200/80 rounded" />
                      <div className="h-3 w-28 bg-slate-200/50 rounded" />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-5 w-10 bg-slate-200/70 rounded-md" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-4 w-24 bg-slate-200/60 rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-4 w-20 bg-slate-200/80 rounded" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-5 w-20 bg-slate-200/60 rounded-md" />
                </td>
                <td className="py-3.5 px-4">
                  <div className="h-4 w-28 bg-slate-200/60 rounded" />
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="h-5 w-16 bg-slate-200/60 rounded-full mx-auto" />
                </td>
                <td className="py-3.5 px-5 text-right">
                  <div className="h-7 w-16 bg-slate-200/60 rounded-lg ml-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PaymentHistoryPage() {
  const { isAuthenticated, user } = useAuth();
  const currency = user?.preferred_currency || "INR";
  const { activeWorkspace } = useWorkspace();
  const [payments, setPayments] = useState<EmiPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [selectedSort, setSelectedSort] = useState("newest");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const activeFiltersCount =
    (selectedMethod !== "All" ? 1 : 0) +
    (selectedSort !== "newest" ? 1 : 0);
  const hasActiveFilters = activeFiltersCount > 0;

  const resetAllFilters = () => {
    setSelectedMethod("All");
    setSelectedSort("newest");
  };

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Receipt Modal State
  const [receiptPayment, setReceiptPayment] = useState<EmiPayment | null>(null);

  // Header 3-dot dropdown popover state & click-outside handling
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const headerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setIsHeaderMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsHeaderMenuOpen(false);
      }
    }

    if (isHeaderMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isHeaderMenuOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const isInitialLoading = isLoading && payments.length === 0;

  const loadHistory = useCallback(async (page = 1, isSilent = false) => {
    if (!isSilent && payments.length === 0) {
      setIsLoading(true);
    }
    try {
      const familyFilter =
        activeWorkspace.id === "all" ? undefined : activeWorkspace.id;
      const response = await emiService.getPaymentHistory(page, 50, familyFilter);
      if (response && response.data) {
        setPayments((prev) => (arePaymentsEqual(prev, response.data) ? prev : response.data));
        setCurrentPage(response.current_page || 1);
        setTotalPages(response.last_page || 1);
        setTotalCount(response.total || response.data.length);
      }
    } catch (err) {
      console.error("Failed to fetch payment history:", err);
    } finally {
      if (!isSilent) {
        setIsLoading(false);
      }
    }
  }, [activeWorkspace.id, payments.length]);

  useEffect(() => {
    loadHistory(currentPage);
  }, [loadHistory, currentPage]);

  // Live real-time background sync for payment history ledger (Event-driven without interval polling)
  useEffect(() => {
    const handleRefresh = () => {
      loadHistory(currentPage, true);
    };

    const handleFocus = () => {
      loadHistory(currentPage, true);
    };

    window.addEventListener("myvello:refresh_payments", handleRefresh);
    window.addEventListener("myvello:live_data_update", handleRefresh);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("myvello:refresh_payments", handleRefresh);
      window.removeEventListener("myvello:live_data_update", handleRefresh);
      window.removeEventListener("focus", handleFocus);
    };
  }, [loadHistory, currentPage]);

  const handleCopyUtr = (e: React.MouseEvent, utr: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    showToast(`Copied UTR: ${utr}`);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  // Filter and sort items
  const filteredHistory = useMemo(() => {
    const result = payments.filter((item) => {
      // Payment Method filter
      if (selectedMethod !== "All" && item.payment_method !== selectedMethod) {
        return false;
      }

      // Keyword search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const loanName = (item.emi?.loan_name || item.loan_name || "").toLowerCase();
        const bankName = (item.emi?.lender_name || item.lender_name || "").toLowerCase();
        const category = (item.emi?.loan_category || "").toLowerCase();
        const ref = (item.transaction_reference || "").toLowerCase();
        const method = (item.payment_method || "").toLowerCase();

        return (
          loanName.includes(q) ||
          bankName.includes(q) ||
          category.includes(q) ||
          ref.includes(q) ||
          method.includes(q)
        );
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      const amountA = Number(a.amount ?? a.paid_amount ?? 0);
      const amountB = Number(b.amount ?? b.paid_amount ?? 0);
      const dateA = new Date(a.payment_date || a.created_at).getTime();
      const dateB = new Date(b.payment_date || b.created_at).getTime();

      switch (selectedSort) {
        case "oldest":
          return dateA - dateB;
        case "amount_desc":
          return amountB - amountA;
        case "amount_asc":
          return amountA - amountB;
        case "newest":
        default:
          return dateB - dateA;
      }
    });

    return result;
  }, [payments, selectedMethod, searchQuery, selectedSort]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalReconciled = filteredHistory.reduce(
      (sum, item) => sum + (Number(item.amount ?? item.paid_amount) || 0),
      0
    );

    const uniqueLoans = new Set(
      filteredHistory.map((item) => item.emi_id || item.emi?.id || item.loan_name)
    ).size;

    const avgPayment = filteredHistory.length > 0 ? totalReconciled / filteredHistory.length : 0;

    return {
      totalReconciled,
      count: filteredHistory.length,
      uniqueLoans,
      avgPayment,
    };
  }, [filteredHistory]);

  // Real CSV Export
  const handleExportCSV = () => {
    if (!filteredHistory.length) {
      showToast("No payment records to export");
      return;
    }

    const headers = [
      "Transaction Reference / UTR",
      "Loan Name",
      "Lender / Bank",
      "Loan Category",
      "Instalment Number",
      "Payment Date",
      "Amount (INR)",
      "Payment Method",
      "Verification Status",
    ];

    const rows = filteredHistory.map((p) => [
      p.transaction_reference || "N/A",
      p.emi?.loan_name || p.loan_name || "Loan",
      p.emi?.lender_name || p.lender_name || "Bank",
      p.emi?.loan_category || "General",
      `#${p.schedule?.installment_number || p.installment_number || 1}`,
      formatDate(p.payment_date),
      Number(p.amount ?? p.paid_amount ?? 0).toFixed(2),
      p.payment_method || "Auto Debit",
      "100% Reconciled",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        headers.join(","),
        ...rows.map((e) =>
          e.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `myvello-payment-statement-${new Date().toISOString().split("T")[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Statement exported successfully as CSV");
  };

  const getMethodBadge = (method: string) => {
    const m = (method || "").toLowerCase();
    if (m.includes("auto") || m.includes("mandate") || m.includes("nach")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
          <Zap className="w-3 h-3 text-indigo-500" />
          Auto Debit
        </span>
      );
    }
    if (m.includes("upi")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
          <Smartphone className="w-3 h-3 text-purple-500" />
          UPI Transfer
        </span>
      );
    }
    if (m.includes("net") || m.includes("internet") || m.includes("online")) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
          <Landmark className="w-3 h-3 text-blue-500" />
          NetBanking
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Building2 className="w-3 h-3 text-slate-500" />
        {method || "Bank Transfer"}
      </span>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-[1500px] pt-3.5 sm:pt-5 space-y-3.5 sm:space-y-5 min-h-dvh overflow-x-hidden pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-[max(5.5rem,calc(5rem+env(safe-area-inset-bottom)))] sm:bottom-6 right-4 sm:right-6 z-50 bg-[#0B132B]/95 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 border border-indigo-500/30 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex items-center justify-between gap-3 min-h-[36px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0B132B] truncate">
              Payment History
            </h1>
          </div>

          {/* Mobile Only: 3-Dot Dropdown Popover */}
          <div className="sm:hidden relative shrink-0" ref={headerMenuRef}>
            <button
              type="button"
              onClick={() => setIsHeaderMenuOpen((prev) => !prev)}
              aria-label="More actions"
              aria-expanded={isHeaderMenuOpen}
              className={cn(
                "w-9 h-9 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation",
                isHeaderMenuOpen && "bg-slate-100 border-indigo-300 ring-2 ring-indigo-500/20"
              )}
            >
              <MoreHorizontal className="w-5 h-5 text-slate-700" />
            </button>

            {/* Dropdown Menu Popover matching Screenshot */}
            {isHeaderMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                {/* Pointer Tip Arrow */}
                <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 z-10" />

                <div className="relative z-20 space-y-0.5">
                  {/* Export CSV */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsHeaderMenuOpen(false);
                      handleExportCSV();
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl flex items-center gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                  >
                    <Download className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>Export CSV</span>
                  </button>

                  {/* Manage EMIs */}
                  <Link
                    href="/emis"
                    onClick={() => setIsHeaderMenuOpen(false)}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 hover:text-indigo-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Manage EMIs</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Only: Classic Action Buttons Row */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCSV}
              className="h-9 px-3.5 rounded-xl border border-slate-200/90 hover:border-indigo-300 bg-white hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-indigo-600" />
              <span>Export CSV</span>
            </button>

            <Link href="/emis">
              <button
                type="button"
                className="h-9 px-4 rounded-xl btn-gradient-glow text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
              >
                <span>Manage EMIs</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Unified Payment Ledger Card (Attached Minimal Toolbar + Table / Cards) */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Mobile Minimal Unified Toolbar (sm:hidden - Search + Filters Popup Trigger) */}
          <div className="sm:hidden p-3 border-b border-slate-100 bg-white space-y-2.5">
            <div className="flex items-center gap-2">
              {/* Search Input */}
              <div className="relative flex-1 min-w-0">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  inputMode="search"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search loans, lenders, UTR..."
                  className="w-full h-10 pl-9 pr-8 text-xs font-medium text-slate-800 bg-slate-50 focus:bg-white border border-slate-200/80 rounded-[12px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 min-w-[28px] min-h-[28px] flex items-center justify-center cursor-pointer touch-manipulation"
                    aria-label="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Filter Button with Count Badge */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(true)}
                className={cn(
                  "h-10 px-3 rounded-[12px] border text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer touch-manipulation active:scale-95",
                  activeFiltersCount > 0
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700 shadow-2xs"
                    : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50"
                )}
                aria-label="Filter payments"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="w-4.5 h-4.5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Active Filter Chips with Reset (if active on mobile) */}
            {hasActiveFilters && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selectedMethod !== "All" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      <span>{selectedMethod}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedMethod("All")}
                        className="p-0.5 hover:text-indigo-900 touch-manipulation cursor-pointer"
                        aria-label="Remove payment method filter"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  )}
                  {selectedSort !== "newest" && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      <span>{sortOptions.find((o) => o.value === selectedSort)?.label}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedSort("newest")}
                        className="p-0.5 hover:text-indigo-900 touch-manipulation cursor-pointer"
                        aria-label="Reset sort"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 shrink-0 ml-2 touch-manipulation active:scale-95 cursor-pointer"
                >
                  Reset All
                </button>
              </div>
            )}
          </div>

          {/* Desktop Single-Row Unified Toolbar (hidden sm:flex) */}
          <div className="hidden sm:flex px-4 py-2.5 border-b border-slate-100 flex-wrap items-center justify-between gap-2.5 bg-white">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                inputMode="search"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search loan, lender, or UTR..."
                className="w-full h-9 pl-9 pr-8 text-xs font-medium text-slate-800 bg-slate-50/80 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-[8px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 w-7 h-7 flex items-center justify-center rounded cursor-pointer active:scale-95 touch-manipulation"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filters & Sorters */}
            <div className="flex items-center gap-2">
              <CustomDropdown
                value={selectedMethod}
                onChange={setSelectedMethod}
                options={paymentMethodFilterOptions}
                triggerClassName="rounded-[8px] border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/70 text-xs h-9 font-semibold touch-manipulation"
              />

              <CustomDropdown
                value={selectedSort}
                onChange={setSelectedSort}
                options={sortOptions}
                triggerClassName="rounded-[8px] border-slate-200/80 bg-slate-50/70 hover:bg-slate-100/70 text-xs h-9 font-semibold touch-manipulation"
              />
            </div>
          </div>

          {/* Payment History Records, Skeleton, or Empty State */}
          {isInitialLoading ? (
            <PaymentHistoryTableSkeleton />
          ) : filteredHistory.length > 0 ? (
            <>
              {/* Mobile Card View (Screens < 768px) */}
              <div className="block md:hidden divide-y divide-slate-100">
              {filteredHistory.map((item) => {
                const loanName = item.emi?.loan_name || item.loan_name || "Loan";
                const lenderName = item.emi?.lender_name || item.lender_name || "Bank";
                const loanCategory = item.emi?.loan_category || "Personal Loan";
                const amount = Number(item.amount ?? item.paid_amount ?? 0);
                const installmentNum =
                  item.schedule?.installment_number || item.installment_number || 1;
                const utr = item.transaction_reference;

                return (
                  <div
                    key={item.id}
                    onClick={() => setReceiptPayment(item)}
                    className="p-4 space-y-3 hover:bg-slate-50/80 active:bg-slate-100/70 transition-colors cursor-pointer select-none active:scale-[0.99] touch-manipulation"
                  >
                    {/* Top: Category Icon + Loan Details + Amount & Date */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative shrink-0">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/80 shadow-2xs",
                              getCategoryBgClass(loanCategory)
                            )}
                            title={`${loanCategory} (${lenderName})`}
                          >
                            {getCategoryIcon(loanCategory, "w-5 h-5")}
                          </div>
                          {lenderName && (
                            <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-2xs border border-slate-200">
                              <BankLogo bankName={lenderName} size="xs" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                            {loanName}
                          </h4>
                          <div className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1.5 flex-wrap">
                            <span>{lenderName}</span>
                            <span>•</span>
                            <span className="capitalize text-slate-500">{loanCategory}</span>
                            {item.user && (
                              <>
                                <span>•</span>
                                <span className="inline-flex items-center gap-1 text-indigo-600 font-bold">
                                  <span>Paid by {item.user.name}</span>
                                  {item.user.id === user?.id && (
                                    <span className="opacity-70 text-[9px] font-semibold">(You)</span>
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-sm font-black text-[#0B132B] block">
                          {formatCurrency(amount, item.emi?.currency || currency)}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                          {formatDate(item.payment_date)}
                        </span>
                      </div>
                    </div>

                    {/* Middle: Method badge + Installment pill + Status badge + Receipt button */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100/70 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getMethodBadge(item.payment_method)}
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                          #{installmentNum}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                          Verified
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReceiptPayment(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 min-h-[36px] rounded-lg text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50/70 border border-indigo-100/80 active:scale-95 touch-manipulation shrink-0"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        <span>Receipt</span>
                      </button>
                    </div>

                    {/* Bottom: Reference / UTR 1-tap copy row */}
                    {utr && (
                      <div className="flex items-center justify-between text-[11px] bg-slate-50/80 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
                        <span className="text-slate-400 font-medium">Ref / UTR:</span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyUtr(e, utr)}
                          className="inline-flex items-center gap-1 font-mono font-bold text-slate-700 hover:text-indigo-600 active:scale-95 touch-manipulation cursor-pointer"
                          title="Click to copy UTR"
                        >
                          <span>{utr}</span>
                          {copiedUtr === utr ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3 text-slate-400" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Desktop Table View (Screens >= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                    <th className="py-3.5 px-5">Loan & Creditor</th>
                    <th className="py-3.5 px-4">Instalment</th>
                    <th className="py-3.5 px-4">Payment Date</th>
                    <th className="py-3.5 px-4">Amount Paid</th>
                    <th className="py-3.5 px-4">Method</th>
                    <th className="py-3.5 px-4">Reference / UTR</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/90">
                  {filteredHistory.map((item) => {
                    const loanName = item.emi?.loan_name || item.loan_name || "Loan";
                    const lenderName = item.emi?.lender_name || item.lender_name || "Bank";
                    const loanCategory = item.emi?.loan_category || "Personal Loan";
                    const amount = Number(item.amount ?? item.paid_amount ?? 0);
                    const installmentNum =
                      item.schedule?.installment_number || item.installment_number || 1;
                    const utr = item.transaction_reference;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setReceiptPayment(item)}
                        className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                      >
                        {/* Loan & Creditor with Category Icon + Bank Logo */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="relative shrink-0">
                              <div
                                className={cn(
                                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/80 shadow-2xs transition-transform duration-200 group-hover:scale-105",
                                  getCategoryBgClass(loanCategory)
                                )}
                                title={`${loanCategory} (${lenderName})`}
                              >
                                {getCategoryIcon(loanCategory, "w-5 h-5")}
                              </div>
                              {lenderName && (
                                <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-2xs border border-slate-200">
                                  <BankLogo bankName={lenderName} size="xs" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors truncate max-w-[200px]">
                                {loanName}
                              </div>
                              <div className="text-[11px] text-slate-400 font-medium truncate flex items-center gap-1.5 flex-wrap">
                                <span>{lenderName}</span>
                                <span>•</span>
                                <span className="capitalize text-slate-500">{loanCategory}</span>
                                {item.user && (
                                  <>
                                    <span>•</span>
                                    <span className="inline-flex items-center gap-1.5 text-indigo-600 font-bold">
                                      <div className="relative w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-black text-[9px] flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-indigo-200">
                                        {item.user.profile_photo ? (
                                          <Image
                                            src={item.user.profile_photo}
                                            alt={item.user.name}
                                            fill
                                            unoptimized
                                            sizes="16px"
                                            className="object-cover"
                                          />
                                        ) : (
                                          <span>{item.user.name.charAt(0).toUpperCase()}</span>
                                        )}
                                      </div>
                                      <span>Paid by {item.user.name}</span>
                                      {item.user.id === user?.id && (
                                        <span className="opacity-70 text-[9px] font-semibold">(You)</span>
                                      )}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Instalment Number */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200/60">
                            #{installmentNum}
                          </span>
                        </td>

                        {/* Payment Date */}
                        <td className="py-3.5 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {formatDate(item.payment_date)}
                        </td>

                        {/* Amount Paid */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className="text-sm font-black text-[#0B132B]">
                            {formatCurrency(amount, item.emi?.currency || currency)}
                          </span>
                        </td>

                        {/* Payment Method Badge */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {getMethodBadge(item.payment_method)}
                        </td>

                        {/* Reference / UTR with 1-click Copy */}
                        <td className="py-3.5 px-4">
                          {utr ? (
                            <button
                              type="button"
                              onClick={(e) => handleCopyUtr(e, utr)}
                              className="group/utr inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 text-[11px] font-mono text-slate-600 hover:text-indigo-700 transition-all cursor-pointer active:scale-95 touch-manipulation"
                              title="Click to copy UTR"
                            >
                              <span>{utr}</span>
                              {copiedUtr === utr ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3 text-slate-400 group-hover/utr:text-indigo-600" />
                              )}
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>

                        {/* Verification Status */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        </td>

                        {/* View Receipt Action */}
                        <td className="py-3.5 px-5 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setReceiptPayment(item);
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all cursor-pointer active:scale-95 touch-manipulation"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            <span>Receipt</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-4 sm:px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-0 text-xs text-slate-500 font-medium">
                <div>
                  Showing page <span className="font-bold text-slate-800">{currentPage}</span> of{" "}
                  <span className="font-bold text-slate-800">{totalPages}</span> ({totalCount} total)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="h-10 sm:h-8 min-h-[40px] sm:min-h-[32px] px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95 touch-manipulation"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="h-10 sm:h-8 min-h-[40px] sm:min-h-[32px] px-3.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-semibold text-slate-700 transition-all cursor-pointer shadow-2xs active:scale-95 touch-manipulation"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="p-8 sm:p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-3.5">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-[#0B132B]">No Payment Records Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5 leading-relaxed font-medium">
              {searchQuery || selectedMethod !== "All"
                ? "No transactions match your current search query or filter criteria. Try resetting your search."
                : "When you record EMI payments on your repayment schedule, they are permanently logged here with bank UTRs and timestamps."}
            </p>

            {searchQuery || selectedMethod !== "All" ? (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedMethod("All");
                }}
                className="h-11 sm:h-9 min-h-[44px] sm:min-h-[36px] px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer active:scale-95 touch-manipulation inline-flex items-center justify-center"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                href="/emis"
                className="h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl shadow-xs text-xs font-semibold px-5 py-2.5 cursor-pointer active:scale-95 touch-manipulation inline-flex items-center justify-center"
              >
                Go to EMI Management
              </Link>
            )}
          </div>
        )}
      </div>


        {/* Mobile Bottom Sheet Filters Tray */}
        {isMobileFilterOpen && (
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 z-50 flex items-end sm:hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 select-none"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-[28px] border-t border-slate-200/90 shadow-2xl w-full p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto"
            >
              {/* Drag Handle */}
              <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-1 mb-2" />

              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-base font-black text-[#0B132B]">Filters & Refinements</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center touch-manipulation active:scale-95 cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Filter by Payment Method */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Payment Method
                </label>
                <CustomDropdown
                  value={selectedMethod}
                  onChange={setSelectedMethod}
                  options={paymentMethodFilterOptions}
                  className="w-full"
                />
              </div>

              {/* Filter by Sort Order */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Sort By
                </label>
                <CustomDropdown
                  value={selectedSort}
                  onChange={setSelectedSort}
                  options={sortOptions}
                  className="w-full"
                />
              </div>

              {/* Bottom Sheet Actions */}
              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      resetAllFilters();
                      setIsMobileFilterOpen(false);
                    }}
                    className="flex-1 h-11 rounded-[12px] border border-slate-200 bg-white text-slate-700 text-xs font-bold active:scale-95 touch-manipulation cursor-pointer"
                  >
                    Reset All
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 h-11 rounded-[12px] btn-gradient-glow text-white text-xs font-bold active:scale-95 touch-manipulation shadow-xs cursor-pointer"
                >
                  Apply Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modern Repayment Receipt Modal / Mobile Bottom Sheet */}
        {receiptPayment && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-t-[24px] sm:rounded-3xl max-w-md w-full shadow-2xl border-t sm:border border-slate-200 max-h-[90dvh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 pb-[env(safe-area-inset-bottom)] sm:pb-0">
              {/* Mobile Sheet Drag Handle */}
              <div className="flex sm:hidden justify-center pt-2.5 pb-1">
                <div className="w-10 h-1 bg-slate-300 rounded-full" />
              </div>

              {/* Receipt Header */}
              <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-indigo-50/40 border-b border-slate-100 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={cn(
                        "w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center border border-slate-200/80 shadow-2xs",
                        getCategoryBgClass(receiptPayment.emi?.loan_category || "Personal Loan")
                      )}
                    >
                      {getCategoryIcon(
                        receiptPayment.emi?.loan_category || "Personal Loan",
                        "w-5 h-5 sm:w-6 sm:h-6"
                      )}
                    </div>
                    {receiptPayment.emi?.lender_name && (
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-2xs border border-slate-200">
                        <BankLogo bankName={receiptPayment.emi?.lender_name} size="xs" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#0B132B]">
                      {receiptPayment.emi?.loan_name || receiptPayment.loan_name || "Loan Repayment"}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {receiptPayment.emi?.lender_name || "Verified Creditor"} •{" "}
                      {receiptPayment.emi?.loan_category || "EMI"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setReceiptPayment(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer active:scale-95 touch-manipulation"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Receipt Amount Hero */}
              <div className="p-5 sm:p-6 text-center border-b border-dashed border-slate-200 bg-slate-50/50">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Amount Paid
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#0B132B] mt-1 tracking-tight">
                  {formatCurrency(receiptPayment.amount ?? receiptPayment.paid_amount ?? 0, receiptPayment.emi?.currency || currency)}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Settled & Reconciled</span>
                </div>
              </div>

              {/* Receipt Key-Value Details */}
              <div className="p-4 sm:p-6 space-y-3.5 text-xs overflow-y-auto">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Transaction Reference</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-800">
                      {receiptPayment.transaction_reference || "TXN-VERIFIED"}
                    </span>
                    {receiptPayment.transaction_reference && (
                      <button
                        type="button"
                        onClick={(e) =>
                          handleCopyUtr(e, receiptPayment.transaction_reference!)
                        }
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded active:scale-95 touch-manipulation cursor-pointer"
                        title="Copy Reference"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Instalment Schedule</span>
                  <span className="font-bold text-slate-800">
                    Instalment #{receiptPayment.schedule?.installment_number || receiptPayment.installment_number || 1}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Payment Date</span>
                  <span className="font-bold text-slate-800">
                    {formatDate(receiptPayment.payment_date)}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-400 font-medium">Payment Method</span>
                  <span>{getMethodBadge(receiptPayment.payment_method)}</span>
                </div>

                {receiptPayment.user && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-400 font-medium">Paid By</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <div className="relative w-4 h-4 rounded-full bg-indigo-100 text-indigo-700 font-black text-[9px] flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-indigo-200">
                        {receiptPayment.user.profile_photo ? (
                          <Image
                            src={receiptPayment.user.profile_photo}
                            alt={receiptPayment.user.name}
                            fill
                            unoptimized
                            sizes="16px"
                            className="object-cover"
                          />
                        ) : (
                          <span>{receiptPayment.user.name.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <span>{receiptPayment.user.name}</span>
                      {receiptPayment.user.id === user?.id && (
                        <span className="text-[10px] text-slate-400 font-medium">(You)</span>
                      )}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400 font-medium">Audit Status</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Immutable Log
                  </span>
                </div>
              </div>

              {/* Receipt Footer Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="h-11 sm:h-9 min-h-[44px] sm:min-h-[36px] px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs inline-flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95 touch-manipulation"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print Receipt</span>
                </button>

                <button
                  type="button"
                  onClick={() => setReceiptPayment(null)}
                  className="h-11 sm:h-9 min-h-[44px] sm:min-h-[36px] px-5 py-2 rounded-xl bg-[#0B132B] hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95 touch-manipulation"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}