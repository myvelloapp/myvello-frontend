"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  LayoutList,
  LayoutGrid,
  MoreHorizontal,
  ChevronRight,
  Eye,
  Check,
  CreditCard,
  Search,
  X,
  Calendar,
  Clock,
  ArrowUpRight,
  RotateCcw,
  Archive,
  ArchiveRestore,
  Trash2,
  AlertCircle,
  Layers,
  SlidersHorizontal,
  CheckCircle2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCardRow } from "@/components/dashboard/StatCardRow";
import { NextPaymentCard } from "@/components/dashboard/NextPaymentCard";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { MarkAsPaidTarget } from "@/components/common/MarkAsPaidModal";

const MarkAsPaidModal = dynamic(
  () => import("@/components/common/MarkAsPaidModal").then((mod) => mod.MarkAsPaidModal),
  { ssr: false }
);
import { emiService, EmiIndexResponse, EmiListItem } from "@/services/emiService";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { useWorkspace } from "@/context/WorkspaceContext";
import { MemberAvatarStack } from "@/components/common/MemberAvatarStack";
import { formatCurrency } from "@/lib/formatters";
import { useAuth } from "@/modules/authentication/AuthContext";
import { BankLogo } from "@/components/ui/BankLogo";
import {
  CATEGORY_FILTER_OPTIONS,
  getCategoryIcon,
  getCategoryBgClass,
} from "@/lib/categoryConfig";

function EmptyEmiState({
  isFiltered,
  onResetFilters,
}: {
  isFiltered?: boolean;
  onResetFilters?: () => void;
}) {
  return (
    <div className="py-12 sm:py-16 px-6 text-center max-w-md mx-auto select-none">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/80 flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-2xs">
        {isFiltered ? (
          <Search className="w-6 h-6 text-indigo-500" />
        ) : (
          <CreditCard className="w-6 h-6 text-indigo-600" />
        )}
      </div>

      <h3 className="text-base sm:text-lg font-black text-[#0B132B]">
        {isFiltered ? "No Matching EMI Records" : "No EMI Records Found"}
      </h3>

      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mt-1.5 mb-6 leading-relaxed font-normal">
        {isFiltered
          ? "No loan commitments match your search criteria or selected filters. Try searching with a different keyword or resetting your filters."
          : "You haven't added any loan or EMI commitments yet. Add your first EMI to automatically generate your amortization schedule and payment reminders."}
      </p>

      {isFiltered ? (
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset All Filters</span>
        </button>
      ) : (
        <Link href="/emis/new" className="inline-block">
          <button
            type="button"
            className="h-9 px-4 rounded-[12px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer active:scale-[0.99] transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Your First EMI</span>
          </button>
        </Link>
      )}
    </div>
  );
}

function TableSkeleton() {
  return (
    <>
      {/* Mobile High-Fidelity Shimmer Card Skeleton (sm:hidden) */}
      <div className="sm:hidden divide-y divide-slate-100 p-3 space-y-3">
        {[1, 2, 3].map((row) => (
          <div
            key={row}
            className="bg-white rounded-xl p-3.5 space-y-3 animate-pulse border border-slate-100 shadow-[0_2px_10px_-2px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-100 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-3.5 bg-slate-200/80 rounded w-28" />
                  <div className="h-2.5 bg-slate-100 rounded w-20" />
                </div>
              </div>
              <div className="h-4 bg-slate-200/80 rounded w-16" />
            </div>

            <div className="flex items-center justify-between">
              <div className="h-3 bg-slate-100 rounded w-24" />
              <div className="h-4 bg-slate-100 rounded-full w-16" />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <div className="h-2 bg-slate-100 rounded w-12" />
                <div className="h-2 bg-slate-100 rounded w-8" />
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full w-full" />
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
              <div className="flex-1 h-9 rounded-[8px] bg-slate-100" />
              <div className="h-9 w-9 rounded-[8px] bg-slate-100 shrink-0" />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Rich Table Skeleton (hidden sm:block) */}
      <div className="hidden sm:block overflow-x-auto min-h-[160px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100/90 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
              <th className="py-2.5 px-4 sm:px-5">LOAN DETAILS</th>
              <th className="py-2.5 px-3 sm:px-4">EMI AMOUNT</th>
              <th className="py-2.5 px-3 sm:px-4">NEXT DUE DATE</th>
              <th className="py-2.5 px-3 sm:px-4">STATUS</th>
              <th className="py-2.5 px-3 sm:px-4">PROGRESS</th>
              <th className="py-2.5 px-4 sm:px-5 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {[1, 2, 3].map((row) => (
              <tr key={row} className="animate-pulse">
                <td className="py-3.5 px-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8.5 h-8.5 rounded-[10px] bg-slate-100 shrink-0 border border-slate-100" />
                    <div className="space-y-1.5 flex-1 max-w-[160px]">
                      <div className="h-3.5 bg-slate-200/80 rounded w-28" />
                      <div className="h-2.5 bg-slate-100 rounded w-20" />
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                  <div className="h-3.5 bg-slate-200/80 rounded w-16 mb-1" />
                  <div className="h-2 bg-slate-100 rounded w-12" />
                </td>
                <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                  <div className="h-3.5 bg-slate-200/80 rounded w-20 mb-1" />
                  <div className="h-3 bg-slate-100 rounded-full w-16" />
                </td>
                <td className="py-3.5 px-3 sm:px-4 whitespace-nowrap">
                  <div className="h-5 bg-slate-100 rounded-full w-20" />
                </td>
                <td className="py-3.5 px-3 sm:px-4 min-w-[120px]">
                  <div className="h-2.5 bg-slate-100 rounded w-14 mb-1.5" />
                  <div className="w-full h-1.5 bg-slate-100 rounded-full" />
                </td>
                <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 justify-end">
                    <div className="h-7 w-12 rounded-[8px] bg-slate-100" />
                    <div className="h-7 w-7 rounded-[8px] bg-slate-100" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function GridSkeleton() {
  return (
    <div className="p-3 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-[16px] p-4 sm:p-5 border border-slate-100 space-y-4 animate-pulse shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-slate-100 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-4 bg-slate-200/80 rounded w-28 sm:w-32" />
                  <div className="h-3 bg-slate-100 rounded w-20 sm:w-24" />
                </div>
              </div>
              <div className="h-5 bg-slate-200/80 rounded w-16 shrink-0" />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="h-3 bg-slate-100 rounded w-16" />
              <div className="h-3 bg-slate-100 rounded w-24" />
            </div>

            <div className="space-y-1.5">
              <div className="h-2.5 bg-slate-100 rounded w-20" />
              <div className="h-1.5 bg-slate-100 rounded-full w-full" />
            </div>

            <div className="pt-2 flex items-center gap-2">
              <div className="flex-1 h-9 rounded-[16px] bg-slate-100" />
              <div className="flex-1 h-9 rounded-[16px] bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const categoryFilterOptions = CATEGORY_FILTER_OPTIONS;

const statusFilterOptions = [
  {
    value: "All",
    label: "All Status",
    icon: <span className="w-2 h-2 rounded-full bg-slate-400 inline-block" />,
  },
  {
    value: "Upcoming",
    label: "Upcoming",
    icon: <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block ring-2 ring-indigo-500/20" />,
  },
  {
    value: "Due Soon",
    label: "Due Soon",
    icon: <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ring-2 ring-amber-500/20" />,
  },
  {
    value: "Overdue",
    label: "Overdue",
    icon: <span className="w-2 h-2 rounded-full bg-rose-500 inline-block ring-2 ring-rose-500/20" />,
  },
  {
    value: "Paid",
    label: "Paid / Completed",
    icon: <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ring-2 ring-emerald-500/20" />,
  },
];

function areEmiResponsesEqual(
  a: EmiIndexResponse | null,
  b: EmiIndexResponse | null
): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.emis.length !== b.emis.length) return false;
  if (a.summary.active_emis !== b.summary.active_emis) return false;
  if (a.summary.monthly_emi !== b.summary.monthly_emi) return false;
  if (a.summary.outstanding !== b.summary.outstanding) return false;
  if (a.summary.paid_emis !== b.summary.paid_emis) return false;
  if (a.next_emi_hero?.schedule_id !== b.next_emi_hero?.schedule_id) return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function EmiManagementPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { activeWorkspace, switchWorkspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "archived">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [bankFilter, setBankFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid" | "calendar">("list");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [selectedEmiForPay, setSelectedEmiForPay] = useState<MarkAsPaidTarget | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(null);

  // Mobile Tab Dropdown Popover (3-dot menu beside Active Loans title)
  const [isTabMenuOpen, setIsTabMenuOpen] = useState(false);
  const tabMenuRef = useRef<HTMLDivElement>(null);

  // Mobile Top Header 3-Dot Quick Actions & Tab Menu Popover
  const [isMobileHeaderMenuOpen, setIsMobileHeaderMenuOpen] = useState(false);
  const mobileHeaderMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (tabMenuRef.current && !tabMenuRef.current.contains(event.target as Node)) {
        setIsTabMenuOpen(false);
      }
      if (mobileHeaderMenuRef.current && !mobileHeaderMenuRef.current.contains(event.target as Node)) {
        setIsMobileHeaderMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsTabMenuOpen(false);
        setIsMobileHeaderMenuOpen(false);
      }
    }

    if (isTabMenuOpen || isMobileHeaderMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isTabMenuOpen, isMobileHeaderMenuOpen]);

  // Deletion modal state
  const [loanToDelete, setLoanToDelete] = useState<EmiListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Live API State
  const [apiData, setApiData] = useState<EmiIndexResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadEmis = useCallback(
    async (isSilent = false) => {
      if (!isSilent) {
        setIsLoading(true);
      }
      try {
        const familyFilter =
          activeWorkspace.id === "all" ? undefined : activeWorkspace.id;

        const data = await emiService.getEmis({
          status: "all",
          family_id: familyFilter,
        });

        setApiData((prev) => (areEmiResponsesEqual(prev, data) ? prev : data));
      } catch (err) {
        console.error("Failed to fetch EMIs:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [activeWorkspace.id]
  );

  useEffect(() => {
    loadEmis();
  }, [loadEmis]);

  // Event-driven real-time background sync (no aggressive 5s polling loop)
  useEffect(() => {
    const handleRefresh = () => {
      loadEmis(true);
    };

    window.addEventListener("myvello:refresh_emis", handleRefresh);
    window.addEventListener("myvello:live_data_update", handleRefresh);
    window.addEventListener("focus", handleRefresh);

    return () => {
      window.removeEventListener("myvello:refresh_emis", handleRefresh);
      window.removeEventListener("myvello:live_data_update", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
    };
  }, [loadEmis]);

  // Close 3-dot menu on outside click
  useEffect(() => {
    const handleClickOutside = () => setActiveActionMenuId(null);
    if (activeActionMenuId !== null) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [activeActionMenuId]);

  const rawRealLoans = apiData?.emis || [];

  // Dynamic bank filter options combining any banks in user's loans + popular banks
  const bankFilterOptions = useMemo(() => {
    const popularBanks = [
      "Bajaj Finance",
      "HDFC Bank",
      "SBI",
      "ICICI Bank",
      "Axis Bank",
      "Kotak Bank",
      "Bank of Baroda",
      "Punjab National Bank",
      "Canara Bank",
      "Federal Bank",
    ];
    const loanBanks = Array.from(new Set(rawRealLoans.map((l) => l.lender_name).filter(Boolean)));
    const allBankNames = Array.from(new Set([...loanBanks, ...popularBanks]));

    return [
      { value: "All", label: "All Banks" },
      ...allBankNames.map((name) => ({
        value: name,
        label: name,
        icon: <BankLogo bankName={name} size="xs" />,
      })),
    ];
  }, [rawRealLoans]);

  // Filter live loans with 0ms in-memory instant tab switches, search and dropdowns
  const filteredRealLoans = useMemo(() => {
    return rawRealLoans.filter((loan) => {
      // 1. Tab Status Filter (0ms instant switch)
      if (activeTab === "active" && loan.status !== "active") return false;
      if (activeTab === "completed" && loan.status !== "completed") return false;
      if (activeTab === "archived" && loan.status !== "closed") return false;

      // 2. Category Filter (0ms instant switch)
      if (categoryFilter !== "All" && loan.loan_category !== categoryFilter) return false;

      // 3. Bank Filter (0ms instant switch)
      if (bankFilter !== "All" && loan.lender_name !== bankFilter) return false;

      // 4. Search Query filter (0ms instant search)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = loan.loan_name.toLowerCase().includes(query);
        const matchesBank = loan.lender_name.toLowerCase().includes(query);
        const matchesCategory = loan.loan_category.toLowerCase().includes(query);
        const matchesRef = loan.loan_reference?.toLowerCase().includes(query);
        const matchesDebitBank = loan.debit_bank_name?.toLowerCase().includes(query);
        const matchesDebitAcc = loan.debit_account_number?.toLowerCase().includes(query);
        if (!matchesName && !matchesBank && !matchesCategory && !matchesRef && !matchesDebitBank && !matchesDebitAcc) {
          return false;
        }
      }

      // 5. Status dropdown filter
      if (statusFilter !== "All") {
        const isOverdue =
          loan.next_due_status === "overdue" ||
          (loan.days_remaining !== null && loan.days_remaining !== undefined && loan.days_remaining < 0);
        const isDueSoon =
          !isOverdue &&
          (loan.next_due_status === "due_soon" ||
            (loan.days_remaining !== null &&
              loan.days_remaining !== undefined &&
              loan.days_remaining <= 3 &&
              loan.days_remaining >= 0));

        if (statusFilter === "Overdue") {
          if (!isOverdue) return false;
        } else if (statusFilter === "Due Soon") {
          if (!isDueSoon) return false;
        } else if (statusFilter === "Upcoming") {
          if (loan.next_due_status !== "upcoming" || isOverdue || isDueSoon) return false;
        } else if (statusFilter === "Paid") {
          if (loan.status !== "completed") return false;
        }
      }

      return true;
    });
  }, [rawRealLoans, activeTab, categoryFilter, bankFilter, searchQuery, statusFilter]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    categoryFilter !== "All" ||
    bankFilter !== "All" ||
    statusFilter !== "All";

  const activeFiltersCount =
    (categoryFilter !== "All" ? 1 : 0) +
    (bankFilter !== "All" ? 1 : 0) +
    (statusFilter !== "All" ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All");
    setBankFilter("All");
    setStatusFilter("All");
  };

  // Archive / Reactivate
  const handleToggleArchive = async (loan: EmiListItem) => {
    try {
      await emiService.archiveEmi(loan.id);
      loadEmis(true);
    } catch (err) {
      console.error("Failed to archive/unarchive loan:", err);
    }
  };

  // Delete Confirm
  const handleDeleteConfirm = async () => {
    if (!loanToDelete) return;
    setIsDeleting(true);
    try {
      await emiService.deleteEmi(loanToDelete.id);
      setLoanToDelete(null);
      loadEmis(true);
    } catch (err) {
      console.error("Failed to delete loan commitment:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const activeLoansCount = apiData?.summary.active_emis ?? 0;
  const completedLoansCount = apiData?.summary.completed_emis ?? 0;
  const archivedLoansCount = apiData?.summary.archived_emis ?? 0;
  const isInitialLoading = isLoading && !apiData;

  return (
    <DashboardLayout>
      {/* Unified Main Viewport with Pure CSS Brand Aurora Gradient */}
      <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
        {/* Fixed Pure CSS Brand Gradient Backdrop (No Image) */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Smooth downward fade blending into light canvas */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#F0F5FF]/80 to-[#F0F5FF]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-3.5 sm:space-y-5">
          {/* Page Heading */}
          <div className="flex items-center justify-between gap-3 min-h-[36px]">
            <div className="flex items-center gap-2.5 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0B132B] truncate">
                EMI Management
              </h1>
              <span
                className={cn(
                  "hidden sm:inline-flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full text-xs font-bold border shadow-2xs",
                  activeWorkspace.type === "personal"
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200/80"
                    : "bg-teal-50 text-teal-700 border-teal-200/80"
                )}
                title="Current Active Workspace Filter"
              >
                <MemberAvatarStack
                  members={activeWorkspace.members_preview}
                  count={activeWorkspace.members_count}
                  type={activeWorkspace.type}
                  size="sm"
                />
                <span>{activeWorkspace.name}</span>
              </span>
            </div>

            {/* Mobile Only: 3-Dot Quick Actions & Tab Menu Trigger */}
            <div className="sm:hidden relative shrink-0" ref={mobileHeaderMenuRef}>
              <button
                type="button"
                onClick={() => setIsMobileHeaderMenuOpen((prev) => !prev)}
                aria-label="Loan options & filters"
                aria-expanded={isMobileHeaderMenuOpen}
                className={cn(
                  "w-9 h-9 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation",
                  isMobileHeaderMenuOpen && "bg-slate-100 border-indigo-300 ring-2 ring-indigo-500/20"
                )}
              >
                <MoreHorizontal className="w-5 h-5 text-slate-700" />
              </button>

              {/* Popover Dropdown matching Payment History & Notifications */}
              {isMobileHeaderMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                  {/* Pointer Tip Arrow */}
                  <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 z-10" />

                  <div className="relative z-20 space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("active");
                        setIsMobileHeaderMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-3.5 py-2.5 text-left text-xs font-semibold rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation",
                        activeTab === "active" ? "bg-indigo-50/70 text-indigo-700 font-bold" : "text-slate-800 hover:text-indigo-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Layers className={cn("w-4 h-4", activeTab === "active" ? "text-indigo-600" : "text-slate-500")} />
                        <span>Active Loans</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", activeTab === "active" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600")}>
                        {activeLoansCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("completed");
                        setIsMobileHeaderMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-3.5 py-2.5 text-left text-xs font-semibold rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation",
                        activeTab === "completed" ? "bg-indigo-50/70 text-indigo-700 font-bold" : "text-slate-800 hover:text-indigo-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className={cn("w-4 h-4", activeTab === "completed" ? "text-emerald-600" : "text-slate-500")} />
                        <span>Completed Loans</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", activeTab === "completed" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600")}>
                        {completedLoansCount}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab("archived");
                        setIsMobileHeaderMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-3.5 py-2.5 text-left text-xs font-semibold rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation",
                        activeTab === "archived" ? "bg-indigo-50/70 text-indigo-700 font-bold" : "text-slate-800 hover:text-indigo-600 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Archive className={cn("w-4 h-4", activeTab === "archived" ? "text-slate-600" : "text-slate-500")} />
                        <span>Archived Loans</span>
                      </div>
                      <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", activeTab === "archived" ? "bg-slate-600 text-white" : "bg-slate-100 text-slate-600")}>
                        {archivedLoansCount}
                      </span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <Link
                      href="/emis/new"
                      onClick={() => setIsMobileHeaderMenuOpen(false)}
                      className="w-full px-3.5 py-2.5 text-left text-xs font-bold text-indigo-600 hover:bg-indigo-50/60 rounded-xl flex items-center gap-2.5 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
                      <span>Add New EMI</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Unified Two-Column Main Layout */}
          <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-6">
            {/* Left Column: Stat Cards, Tabs with Add Button, and Loans Management */}
            <div className="flex-1 min-w-0 space-y-5 w-full">
              {/* Row 1: 4 Stat Cards */}
              <StatCardRow
                stats={
                  apiData
                    ? {
                        activeEmis: apiData.summary.active_emis,
                        monthlyEmi: apiData.summary.monthly_emi,
                        totalOutstanding: apiData.summary.outstanding,
                        paidEmis: apiData.summary.paid_emis,
                      }
                    : undefined
                }
                isLoading={isInitialLoading}
              />

              {/* Mobile Sleek Next Payment Quick Glance Banner (1st Image Kept) */}
              {apiData?.next_emi_hero && (
                <div
                  onClick={() => {
                    if (apiData.next_emi_hero?.emi_id) {
                      router.push(`/emis/${apiData.next_emi_hero.emi_id}`);
                    }
                  }}
                  className="sm:hidden px-3.5 py-2.5 rounded-[14px] bg-gradient-to-r from-indigo-50/90 via-white to-violet-50/80 border border-indigo-100/90 shadow-2xs flex items-center justify-between gap-2.5 cursor-pointer active:scale-[0.99] transition-transform select-none"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {(() => {
                      const heroLoan = rawRealLoans.find((l) => l.id === apiData.next_emi_hero?.emi_id);
                      const catName = apiData.next_emi_hero?.loan_category || heroLoan?.loan_category || apiData.next_emi_hero?.loan_name || "";
                      return (
                        <div
                          className={cn(
                            "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-slate-100/80 shadow-2xs",
                            getCategoryBgClass(catName)
                          )}
                        >
                          {getCategoryIcon(catName, "w-4 h-4")}
                        </div>
                      );
                    })()}
                    <div className="min-w-0 flex-1 truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600">Next Due:</span>
                        <span className="text-xs font-bold text-slate-800 truncate">{apiData.next_emi_hero.loan_name}</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 mt-0.5 truncate">
                        <strong className="text-slate-900 font-extrabold">{formatCurrency(apiData.next_emi_hero.amount, user?.preferred_currency || "INR")}</strong>
                        <span className="mx-1">•</span>
                        <span>Due {apiData.next_emi_hero.due_date}</span>
                        {apiData.next_emi_hero.days_remaining !== null && (
                          <span className="ml-1 text-amber-700 font-bold">({apiData.next_emi_hero.days_remaining}d left)</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-extrabold text-indigo-600 shrink-0 bg-white px-2.5 py-1 rounded-full border border-indigo-100 shadow-2xs">
                    <span>View</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              )}

              {/* Row 2: Tabs and Action Header */}

              {/* Mobile Only (sm:hidden): Section Title + 3-Dot Dropdown Tab Selector + Add Button */}
              <div className="sm:hidden flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2 min-w-0">
                  <h2 className="text-xl font-black text-[#0B132B] tracking-tight truncate">
                    {activeTab === "active"
                      ? "Active Loans"
                      : activeTab === "completed"
                      ? "Completed Loans"
                      : "Archived Loans"}
                  </h2>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* 3-Dot Tab Selector Popover */}
                  <div className="relative shrink-0" ref={tabMenuRef}>
                    <button
                      type="button"
                      onClick={() => setIsTabMenuOpen((prev) => !prev)}
                      aria-label="Filter loans by tab"
                      aria-expanded={isTabMenuOpen}
                      className={cn(
                        "w-9 h-9 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation",
                        isTabMenuOpen && "bg-slate-100 border-indigo-300 ring-2 ring-indigo-500/20"
                      )}
                    >
                      <MoreHorizontal className="w-5 h-5 text-slate-700" />
                    </button>

                    {/* Dropdown Menu Popover matching Screenshot */}
                    {isTabMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                        {/* Pointer Tip Arrow */}
                        <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 z-10" />

                        <div className="relative z-20 space-y-0.5">
                          {/* Active Loans */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("active");
                              setIsTabMenuOpen(false);
                            }}
                            className={cn(
                              "w-full px-3.5 py-2.5 text-left text-xs font-semibold rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation",
                              activeTab === "active"
                                ? "bg-indigo-50/70 text-indigo-700 font-bold"
                                : "text-slate-800 hover:text-indigo-600 hover:bg-slate-50"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <Layers className={cn("w-4 h-4", activeTab === "active" ? "text-indigo-600" : "text-slate-500")} />
                              <span>Active Loans</span>
                            </div>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                activeTab === "active"
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              )}
                            >
                              {activeLoansCount}
                            </span>
                          </button>

                          {/* Completed Loans */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("completed");
                              setIsTabMenuOpen(false);
                            }}
                            className={cn(
                              "w-full px-3.5 py-2.5 text-left text-xs font-semibold rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation",
                              activeTab === "completed"
                                ? "bg-indigo-50/70 text-indigo-700 font-bold"
                                : "text-slate-800 hover:text-indigo-600 hover:bg-slate-50"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <CheckCircle2 className={cn("w-4 h-4", activeTab === "completed" ? "text-indigo-600" : "text-slate-500")} />
                              <span>Completed Loans</span>
                            </div>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                activeTab === "completed"
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              )}
                            >
                              {completedLoansCount}
                            </span>
                          </button>

                          {/* Archived Loans */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTab("archived");
                              setIsTabMenuOpen(false);
                            }}
                            className={cn(
                              "w-full px-3.5 py-2.5 text-left text-xs font-semibold rounded-xl flex items-center justify-between gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation",
                              activeTab === "archived"
                                ? "bg-indigo-50/70 text-indigo-700 font-bold"
                                : "text-slate-800 hover:text-indigo-600 hover:bg-slate-50"
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <Archive className={cn("w-4 h-4", activeTab === "archived" ? "text-indigo-600" : "text-slate-500")} />
                              <span>Archived Loans</span>
                            </div>
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-bold",
                                activeTab === "archived"
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 text-slate-600"
                              )}
                            >
                              {archivedLoansCount}
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* + Add Button */}
                  <Link href="/emis/new" className="inline-block shrink-0">
                    <button
                      type="button"
                      className="h-9 px-3.5 rounded-[12px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
                    >
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Add</span>
                    </button>
                  </Link>
                </div>
              </div>

              {/* Desktop Only (hidden sm:flex): Themed Segmented Tab Control on Left & Add New EMI on Right */}
              <div className="hidden sm:flex items-center justify-between gap-3 pt-0.5">
                {/* Themed Segmented Tab Control */}
                <div className="p-1 rounded-[8px] bg-white border border-slate-200/80 shadow-2xs flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab("active")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-[6px] text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 min-h-[32px] touch-manipulation active:scale-95",
                      activeTab === "active"
                        ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                        : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                    )}
                  >
                    <span>Active Loans</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded-full text-[10px] font-bold transition-colors min-w-[18px] text-center",
                        activeTab === "active"
                          ? "bg-white/25 text-white"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {isInitialLoading ? (
                        <span className="w-3.5 h-2 bg-slate-300/60 rounded-full inline-block animate-pulse align-middle" />
                      ) : (
                        activeLoansCount
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("completed")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-[6px] text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 min-h-[32px] touch-manipulation active:scale-95",
                      activeTab === "completed"
                        ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                        : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                    )}
                  >
                    <span>Completed</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded-full text-[10px] font-bold transition-colors min-w-[18px] text-center",
                        activeTab === "completed"
                          ? "bg-white/25 text-white"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {isInitialLoading ? (
                        <span className="w-3.5 h-2 bg-slate-300/60 rounded-full inline-block animate-pulse align-middle" />
                      ) : (
                        completedLoansCount
                      )}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("archived")}
                    className={cn(
                      "px-3.5 py-1.5 rounded-[6px] text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 min-h-[32px] touch-manipulation active:scale-95",
                      activeTab === "archived"
                        ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                        : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                    )}
                  >
                    <span>Archived</span>
                    <span
                      className={cn(
                        "px-1.5 py-0.2 rounded-full text-[10px] font-bold transition-colors min-w-[18px] text-center",
                        activeTab === "archived"
                          ? "bg-white/25 text-white"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {isInitialLoading ? (
                        <span className="w-3.5 h-2 bg-slate-300/60 rounded-full inline-block animate-pulse align-middle" />
                      ) : (
                        archivedLoansCount
                      )}
                    </span>
                  </button>
                </div>

                {/* + Add New EMI Button on Desktop */}
                <Link href="/emis/new" className="inline-block shrink-0">
                  <button
                    type="button"
                    className="h-9 min-h-[36px] px-4 rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add New EMI</span>
                  </button>
                </Link>
              </div>

              {/* Row 3: Minimal Unified Loans Management Table Card */}
              <div className="bg-white rounded-[16px] shadow-[0_4px_20px_-4px_rgba(99,102,241,0.06)] border border-slate-200/80 relative">
                {/* Mobile Minimal Unified Toolbar (sm:hidden) */}
                <div className="sm:hidden p-3 border-b border-slate-100 bg-white rounded-t-[16px] space-y-2.5">
                  <div className="flex items-center gap-2">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-0">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        inputMode="search"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search loans, banks..."
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
                      aria-label="Filter loans"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Filters</span>
                      {activeFiltersCount > 0 && (
                        <span className="w-4.5 h-4.5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
                          {activeFiltersCount}
                        </span>
                      )}
                    </button>

                    {/* Mobile View Toggle: List vs Due Calendar */}
                    <div className="flex items-center p-0.5 bg-slate-100 rounded-[10px] border border-slate-200/60 shrink-0">
                      <button
                        type="button"
                        onClick={() => setViewMode("list")}
                        className={cn(
                          "w-8 h-8 rounded-[8px] transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95",
                          viewMode === "list"
                            ? "bg-white text-indigo-600 shadow-2xs font-bold"
                            : "text-slate-400 hover:text-slate-700"
                        )}
                        aria-label="List view"
                        title="List view"
                      >
                        <LayoutList className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewMode("calendar")}
                        className={cn(
                          "w-8 h-8 rounded-[8px] transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95",
                          viewMode === "calendar"
                            ? "bg-white text-indigo-600 shadow-2xs font-bold"
                            : "text-slate-400 hover:text-slate-700"
                        )}
                        aria-label="Due calendar view"
                        title="Due Calendar View"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Active Filter Chips with Reset (if active on mobile) */}
                  {hasActiveFilters && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {categoryFilter !== "All" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            <span>{categoryFilter}</span>
                            <button type="button" onClick={() => setCategoryFilter("All")}>
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        )}
                        {bankFilter !== "All" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            <span>{bankFilter}</span>
                            <button type="button" onClick={() => setBankFilter("All")}>
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        )}
                        {statusFilter !== "All" && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            <span>Status: {statusFilter}</span>
                            <button type="button" onClick={() => setStatusFilter("All")}>
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </span>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={resetAllFilters}
                        className="text-[11px] font-bold text-rose-600 hover:text-rose-700 shrink-0 ml-2"
                      >
                        Reset All
                      </button>
                    </div>
                  )}
                </div>

                {/* Desktop Single-Row Unified Toolbar (100% Locked for Desktop) */}
                <div className="hidden sm:flex px-4 py-2.5 border-b border-slate-100 flex-wrap items-center justify-between gap-2.5 bg-white rounded-t-[16px]">
                  {/* Left: Search Input & Inline Filter Selects */}
                  <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[240px]">
                    {/* Search Input */}
                    <div className="relative w-full sm:w-56 max-w-full sm:max-w-xs">
                      <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-400 absolute left-3 sm:left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        inputMode="search"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search loans, banks, account..."
                        className="w-full h-10 sm:h-8 pl-9 sm:pl-8 pr-8 sm:pr-7 text-xs font-medium text-slate-800 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-[8px] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all placeholder:text-slate-400"
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

                    {/* Filter Selects */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <CustomDropdown
                        value={categoryFilter}
                        onChange={setCategoryFilter}
                        options={categoryFilterOptions}
                      />

                      <CustomDropdown
                        value={bankFilter}
                        onChange={setBankFilter}
                        options={bankFilterOptions}
                      />

                      <CustomDropdown
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={statusFilterOptions}
                      />

                      {hasActiveFilters && (
                        <button
                          type="button"
                          onClick={resetAllFilters}
                          className="h-9 sm:h-8 min-h-[36px] sm:min-h-[32px] inline-flex items-center gap-1 px-2.5 rounded-[8px] text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200/60 transition-colors cursor-pointer touch-manipulation active:scale-95"
                          title="Reset Filters"
                        >
                          <RotateCcw className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
                          <span>Reset</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right: View Mode Toggle */}
                  <div className="flex items-center p-0.5 bg-slate-100 rounded-[8px] border border-slate-200/60 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "w-8 h-8 sm:w-7 sm:h-7 min-w-[32px] min-h-[32px] rounded-[6px] transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95",
                        viewMode === "list"
                          ? "bg-white text-indigo-600 shadow-2xs border border-indigo-100/60"
                          : "text-slate-400 hover:text-slate-700"
                      )}
                      aria-label="List view"
                      title="List view"
                    >
                      <LayoutList className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={cn(
                        "w-8 h-8 sm:w-7 sm:h-7 min-w-[32px] min-h-[32px] rounded-[6px] transition-all cursor-pointer flex items-center justify-center touch-manipulation active:scale-95",
                        viewMode === "grid"
                          ? "bg-white text-indigo-600 shadow-2xs border border-indigo-100/60"
                          : "text-slate-400 hover:text-slate-700"
                      )}
                      aria-label="Grid view"
                      title="Grid view"
                    >
                      <LayoutGrid className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>

                {/* View Switching: Due Calendar View vs List Table vs Grid */}
                {viewMode === "calendar" ? (
                  <div className="p-3 sm:p-5">
                    <MiniCalendar />
                  </div>
                ) : viewMode === "list" ? (
                  isInitialLoading ? (
                    <TableSkeleton />
                  ) : filteredRealLoans.length === 0 ? (
                    <EmptyEmiState
                      isFiltered={hasActiveFilters}
                      onResetFilters={resetAllFilters}
                    />
                  ) : (
                    <>
                      {/* Mobile View: High-Density Native App Card Stack (320px–639px) */}
                      <div className="sm:hidden divide-y divide-slate-100">
                        {filteredRealLoans.map((loan, index) => {
                          const isActionOpen = activeActionMenuId === loan.id;
                          const isLastRow = index >= filteredRealLoans.length - 1;

                          const isOverdue =
                            loan.next_due_status === "overdue" ||
                            (loan.days_remaining !== null &&
                              loan.days_remaining !== undefined &&
                              loan.days_remaining < 0);

                          const isDueSoon =
                            !isOverdue &&
                            (loan.next_due_status === "due_soon" ||
                              (loan.days_remaining !== null &&
                                loan.days_remaining !== undefined &&
                                loan.days_remaining <= 3 &&
                                loan.days_remaining >= 0));

                          const isCompleted = loan.status === "completed";
                          const isArchived = loan.status === "closed";

                          return (
                            <div
                              key={loan.id}
                              onClick={() => router.push(`/emis/${loan.id}`)}
                              className="p-3.5 space-y-3 hover:bg-slate-50/70 transition-colors cursor-pointer group active:bg-slate-100/50"
                            >
                              {/* Top: Category Icon + Title + Shared Tag + Amount */}
                              <div className="flex items-start justify-between gap-2.5">
                                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                  <div
                                    className={cn(
                                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border border-slate-100/80 shadow-2xs group-hover:scale-105 transition-transform",
                                      getCategoryBgClass(loan.loan_category)
                                    )}
                                  >
                                    {getCategoryIcon(loan.loan_category)}
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-1.5 truncate">
                                      <span className="font-bold text-slate-900 text-xs truncate group-hover:text-indigo-600 transition-colors">
                                        {loan.loan_name}
                                      </span>
                                      {loan.ownership_type === "family_shared" && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 shrink-0">
                                          Shared
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px] font-medium text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                                      <BankLogo bankName={loan.lender_name} size="xs" />
                                      <span className="font-semibold text-slate-600 truncate max-w-[120px]">
                                        {loan.lender_name}
                                      </span>
                                      <span>•</span>
                                      <span className="truncate">{loan.loan_category}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <span
                                    suppressHydrationWarning
                                    className="font-black text-slate-900 text-sm block"
                                  >
                                    {formatCurrency(loan.emi_amount, loan.currency || user?.preferred_currency || "INR")}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-normal block">
                                    per month
                                  </span>
                                </div>
                              </div>

                              {/* Auto Debit Mandate Chip if present */}
                              {(loan.payment_method === "Auto Debit" || loan.debit_bank_name) && (
                                <div className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 max-w-full truncate">
                                  <RotateCcw className="w-2.5 h-2.5 shrink-0" />
                                  <span className="truncate">Auto-Debit: {loan.debit_bank_name || loan.lender_name}</span>
                                  {loan.debit_account_number && (
                                    <span className="text-emerald-600/80 font-mono">({loan.debit_account_number})</span>
                                  )}
                                </div>
                              )}

                              {/* Next Due Date & Status Row */}
                              <div className="flex items-center justify-between text-xs pt-0.5">
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                  <span className="font-semibold text-slate-700 text-xs">
                                    {loan.next_due_date || "—"}
                                  </span>
                                  {loan.days_remaining !== null && (
                                    isOverdue ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100/80 text-rose-800 border border-rose-200">
                                        <AlertCircle className="w-2.5 h-2.5" />
                                        {Math.abs(loan.days_remaining ?? 0)}d overdue
                                      </span>
                                    ) : isDueSoon ? (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 border border-rose-200/70">
                                        <Clock className="w-2.5 h-2.5" />
                                        {loan.days_remaining}d left
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70">
                                        <Clock className="w-2.5 h-2.5" />
                                        {loan.days_remaining}d left
                                      </span>
                                    )
                                  )}
                                </div>

                                <div>
                                  {isArchived ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                      <Archive className="w-2.5 h-2.5 text-slate-500" />
                                      Archived
                                    </span>
                                  ) : isCompleted ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                      <Check className="w-2.5 h-2.5 text-emerald-600" />
                                      Paid
                                    </span>
                                  ) : isOverdue ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                                      <AlertCircle className="w-2.5 h-2.5 text-rose-600" />
                                      Overdue
                                    </span>
                                  ) : isDueSoon ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                      Due Soon
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-50/80 text-violet-700 border border-violet-200/60">
                                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shadow-2xs" />
                                      Upcoming
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div>
                                <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
                                  <span>
                                    {loan.paid_emis} / {loan.total_emis} EMIs
                                  </span>
                                  <span className="text-slate-800 font-bold">{loan.progress_percentage}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all duration-500",
                                      loan.progress_percentage > 0
                                        ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 shadow-2xs"
                                        : "bg-transparent"
                                    )}
                                    style={{ width: `${loan.progress_percentage}%` }}
                                  />
                                </div>
                              </div>

                              {/* Actions Row */}
                              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
                                {isCompleted || isArchived ? (
                                  <Link
                                    href={`/emis/${loan.id}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1"
                                  >
                                    <button
                                      type="button"
                                      className="w-full h-9 min-h-[38px] px-3 rounded-[8px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer inline-flex items-center justify-center gap-1 active:scale-95 touch-manipulation"
                                    >
                                      <span>View Details</span>
                                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                    </button>
                                  </Link>
                                ) : (
                                  <>
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedEmiForPay(loan);
                                      }}
                                      className="flex-1 h-10 min-h-[42px] px-4 rounded-[12px] text-xs font-extrabold text-white btn-gradient-glow shadow-sm hover:shadow-indigo-500/25 transition-all cursor-pointer active:scale-[0.98] inline-flex items-center justify-center gap-2 touch-manipulation"
                                    >
                                      <Check className="w-4 h-4 stroke-[2.5]" />
                                      <span>Pay {formatCurrency(loan.emi_amount, loan.currency || user?.preferred_currency || "INR")}</span>
                                    </button>
                                  </>
                                )}

                                {/* 3-Dot More Actions Menu */}
                                <div className="relative inline-block text-left shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setActiveActionMenuId(isActionOpen ? null : loan.id);
                                    }}
                                    className={cn(
                                      "w-10 h-10 min-w-[42px] min-h-[42px] rounded-[12px] text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 flex items-center justify-center transition-colors cursor-pointer active:scale-95 touch-manipulation",
                                      isActionOpen && "bg-slate-200 text-slate-900"
                                    )}
                                    aria-label="More actions"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </button>

                                  {isActionOpen && (
                                    <div
                                      onClick={(e) => e.stopPropagation()}
                                      className={cn(
                                        "absolute right-0 z-50 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 text-left space-y-0.5 animate-fade-in",
                                        isLastRow ? "bottom-full mb-1.5" : "top-full mt-1.5"
                                      )}
                                    >
                                      <Link
                                        href={`/emis/${loan.id}`}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors touch-manipulation"
                                      >
                                        <Eye className="w-4 h-4 text-slate-400" />
                                        <span>View EMI Account</span>
                                      </Link>

                                      {!isCompleted && !isArchived && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setSelectedEmiForPay(loan);
                                            setActiveActionMenuId(null);
                                          }}
                                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer text-left touch-manipulation"
                                        >
                                          <Check className="w-4 h-4 text-indigo-600" />
                                          <span>Mark as Paid</span>
                                        </button>
                                      )}

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveActionMenuId(null);
                                          handleToggleArchive(loan);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left touch-manipulation"
                                      >
                                        {isArchived ? (
                                          <>
                                            <ArchiveRestore className="w-4 h-4 text-indigo-600" />
                                            <span>Reactivate Account</span>
                                          </>
                                        ) : (
                                          <>
                                            <Archive className="w-4 h-4 text-slate-400" />
                                            <span>Archive Account</span>
                                          </>
                                        )}
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => {
                                          setActiveActionMenuId(null);
                                          setLoanToDelete(loan);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left touch-manipulation"
                                      >
                                        <Trash2 className="w-4 h-4 text-rose-500" />
                                        <span>Delete Commitment</span>
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Desktop Rich Table View (hidden sm:block) */}
                      <div className="hidden sm:block overflow-x-auto min-h-[160px]">
                        <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100/90 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                            <th className="py-2.5 px-4 sm:px-5">LOAN DETAILS</th>
                            <th className="py-2.5 px-3 sm:px-4">EMI AMOUNT</th>
                            <th className="py-2.5 px-3 sm:px-4">NEXT DUE DATE</th>
                            <th className="py-2.5 px-3 sm:px-4">STATUS</th>
                            <th className="py-2.5 px-3 sm:px-4">PROGRESS</th>
                            <th className="py-2.5 px-4 sm:px-5 text-right">ACTIONS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {filteredRealLoans.map((loan, index) => {
                            const isActionOpen = activeActionMenuId === loan.id;
                            const isLastRow = index >= filteredRealLoans.length - 1;

                            const isOverdue =
                              loan.next_due_status === "overdue" ||
                              (loan.days_remaining !== null &&
                                loan.days_remaining !== undefined &&
                                loan.days_remaining < 0);

                            const isDueSoon =
                              !isOverdue &&
                              (loan.next_due_status === "due_soon" ||
                                (loan.days_remaining !== null &&
                                  loan.days_remaining !== undefined &&
                                  loan.days_remaining <= 3 &&
                                  loan.days_remaining >= 0));

                            const isCompleted = loan.status === "completed";
                            const isArchived = loan.status === "closed";

                            return (
                              <tr
                                key={loan.id}
                                onClick={() => router.push(`/emis/${loan.id}`)}
                                className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                              >
                                {/* Loan Details */}
                                <td className="py-3 px-4 sm:px-5">
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={cn(
                                        "w-8.5 h-8.5 rounded-[10px] flex items-center justify-center shrink-0 border border-slate-100/80 shadow-2xs group-hover:scale-105 transition-transform",
                                        getCategoryBgClass(loan.loan_category)
                                      )}
                                    >
                                      {getCategoryIcon(loan.loan_category)}
                                    </div>
                                    <div className="min-w-0">
                                      <Link
                                        href={`/emis/${loan.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-xs truncate"
                                      >
                                        <span>{loan.loan_name}</span>
                                        {loan.ownership_type === "family_shared" && (
                                          <span
                                            title="Family Shared Record"
                                            className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 shrink-0"
                                          >
                                            Shared
                                          </span>
                                        )}
                                      </Link>
                                      <div className="text-[11px] font-medium text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                                        <BankLogo bankName={loan.lender_name} size="xs" />
                                        <span className="font-semibold text-slate-600 truncate max-w-[150px]">
                                          {loan.lender_name}
                                        </span>
                                        <span>•</span>
                                        <span>{loan.loan_category}</span>
                                        {(loan.payment_method === "Auto Debit" || loan.debit_bank_name) && (
                                          <span
                                            className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                            title={`Auto-debit registered with ${loan.debit_bank_name || loan.lender_name}${loan.debit_account_number ? ` (A/c ${loan.debit_account_number})` : ""}`}
                                          >
                                            <RotateCcw className="w-2.5 h-2.5" />
                                            <span>Auto-Debit: {loan.debit_bank_name || loan.lender_name}</span>
                                            {loan.debit_account_number && (
                                              <span className="text-emerald-600/80 font-mono">({loan.debit_account_number})</span>
                                            )}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>

                                {/* EMI Amount */}
                                <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                                  <span
                                    suppressHydrationWarning
                                    className="font-bold text-slate-900 text-xs block"
                                  >
                                    {formatCurrency(loan.emi_amount, loan.currency || user?.preferred_currency || "INR")}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-normal block">
                                    per month
                                  </span>
                                </td>

                                {/* Next Due Date */}
                                <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                                  {isCompleted ? (
                                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100 inline-block">
                                      All EMIs Cleared
                                    </span>
                                  ) : isArchived ? (
                                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200 inline-block">
                                      Account Closed
                                    </span>
                                  ) : (
                                    <>
                                      <div className="font-semibold text-slate-700 text-xs flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{loan.next_due_date || "—"}</span>
                                      </div>
                                      {loan.days_remaining !== null && (
                                        <div className="mt-0.5">
                                          {isOverdue ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100/80 text-rose-800 border border-rose-200">
                                              <AlertCircle className="w-2.5 h-2.5" />
                                              {Math.abs(loan.days_remaining ?? 0)} {Math.abs(loan.days_remaining ?? 0) === 1 ? "day overdue" : "days overdue"}
                                            </span>
                                          ) : isDueSoon ? (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-rose-50 text-rose-700 border border-rose-200/70">
                                              <Clock className="w-2.5 h-2.5" />
                                              {loan.days_remaining} {loan.days_remaining === 1 ? "day left" : "days left"}
                                            </span>
                                          ) : (
                                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.2 rounded-md bg-amber-50 text-amber-700 border border-amber-200/70">
                                              <Clock className="w-2.5 h-2.5" />
                                              {loan.days_remaining} {loan.days_remaining === 1 ? "day left" : "days left"}
                                            </span>
                                          )}
                                        </div>
                                      )}
                                    </>
                                  )}
                                </td>

                                {/* Status Badge */}
                                <td className="py-3 px-3 sm:px-4 whitespace-nowrap">
                                  {isArchived ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                                      <Archive className="w-3 h-3 text-slate-500" />
                                      Archived
                                    </span>
                                  ) : isCompleted ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      Paid
                                    </span>
                                  ) : isOverdue ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                                      <AlertCircle className="w-3 h-3 text-rose-600" />
                                      Overdue
                                    </span>
                                  ) : isDueSoon ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
                                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                      Due Soon
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-violet-50/80 text-violet-700 border border-violet-200/60">
                                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shadow-2xs" />
                                      Upcoming
                                    </span>
                                  )}
                                </td>

                                {/* Progress */}
                                <td className="py-3 px-3 sm:px-4 min-w-[120px]">
                                  <div className="flex items-center justify-between text-[10px] font-semibold text-slate-500 mb-1">
                                    <span>
                                      {loan.paid_emis} / {loan.total_emis}
                                    </span>
                                    <span className="text-slate-800 font-bold">
                                      {loan.progress_percentage}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        loan.progress_percentage > 0
                                          ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 shadow-2xs"
                                          : "bg-transparent"
                                      )}
                                      style={{ width: `${loan.progress_percentage}%` }}
                                    />
                                  </div>
                                </td>

                                {/* Actions */}
                                <td className="py-3 px-4 sm:px-5 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5 justify-end">
                                    {isCompleted || isArchived ? (
                                      <Link href={`/emis/${loan.id}`} onClick={(e) => e.stopPropagation()}>
                                        <button
                                          type="button"
                                          className="h-8 px-3 rounded-[8px] text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer inline-flex items-center gap-1 active:scale-95 touch-manipulation"
                                        >
                                          <span>View</span>
                                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                        </button>
                                      </Link>
                                    ) : (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedEmiForPay(loan);
                                        }}
                                        className="h-8 px-3.5 rounded-[6px] text-xs font-bold text-white btn-gradient-glow shadow-2xs hover:shadow-xs transition-all cursor-pointer active:scale-95 inline-flex items-center justify-center touch-manipulation"
                                      >
                                        Pay
                                      </button>
                                    )}

                                    <div className="relative inline-block text-left">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setActiveActionMenuId(isActionOpen ? null : loan.id);
                                        }}
                                        className={cn(
                                          "w-8 h-8 rounded-[8px] text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer active:scale-95 touch-manipulation",
                                          isActionOpen && "bg-slate-100 text-slate-800"
                                        )}
                                        aria-label="More actions"
                                      >
                                        <MoreHorizontal className="w-4 h-4" />
                                      </button>

                                      {isActionOpen && (
                                        <div
                                          onClick={(e) => e.stopPropagation()}
                                          className={cn(
                                            "absolute right-0 z-50 w-52 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 text-left space-y-0.5 animate-fade-in",
                                            isLastRow
                                              ? "bottom-full mb-1.5"
                                              : "top-full mt-1.5"
                                          )}
                                        >
                                          <Link
                                            href={`/emis/${loan.id}`}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors touch-manipulation"
                                          >
                                            <Eye className="w-4 h-4 text-slate-400" />
                                            <span>View EMI Account</span>
                                          </Link>

                                          {!isCompleted && !isArchived && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setSelectedEmiForPay(loan);
                                                setActiveActionMenuId(null);
                                              }}
                                              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer text-left touch-manipulation"
                                            >
                                              <Check className="w-4 h-4 text-indigo-600" />
                                              <span>Mark as Paid</span>
                                            </button>
                                          )}

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveActionMenuId(null);
                                              handleToggleArchive(loan);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-left touch-manipulation"
                                          >
                                            {isArchived ? (
                                              <>
                                                <ArchiveRestore className="w-4 h-4 text-indigo-600" />
                                                <span>Reactivate Account</span>
                                              </>
                                            ) : (
                                              <>
                                                <Archive className="w-4 h-4 text-slate-400" />
                                                <span>Archive Account</span>
                                              </>
                                            )}
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() => {
                                              setActiveActionMenuId(null);
                                              setLoanToDelete(loan);
                                            }}
                                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left touch-manipulation"
                                          >
                                            <Trash2 className="w-4 h-4 text-rose-500" />
                                            <span>Delete Commitment</span>
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )
              ) : (
                  /* Grid View Alternative */
                  isInitialLoading ? (
                    <GridSkeleton />
                  ) : (
                    <div className="p-4 sm:p-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredRealLoans.length === 0 ? (
                          <div className="sm:col-span-2">
                            <EmptyEmiState
                              isFiltered={hasActiveFilters}
                              onResetFilters={resetAllFilters}
                            />
                          </div>
                        ) : (
                          filteredRealLoans.map((loan) => {
                            const isOverdue =
                              loan.next_due_status === "overdue" ||
                              (loan.days_remaining !== null &&
                                loan.days_remaining !== undefined &&
                                loan.days_remaining < 0);

                            const isDueSoon =
                              !isOverdue &&
                              (loan.next_due_status === "due_soon" ||
                                (loan.days_remaining !== null &&
                                  loan.days_remaining !== undefined &&
                                  loan.days_remaining <= 3 &&
                                  loan.days_remaining >= 0));

                            const isCompleted = loan.status === "completed";
                            const isArchived = loan.status === "closed";

                            return (
                              <div
                                key={loan.id}
                                onClick={() => router.push(`/emis/${loan.id}`)}
                                className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-4 hover:shadow-lg transition-all cursor-pointer group"
                              >
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div
                                      className={cn(
                                        "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border shadow-2xs group-hover:scale-105 transition-transform",
                                        getCategoryBgClass(loan.loan_category)
                                      )}
                                    >
                                      {getCategoryIcon(loan.loan_category)}
                                    </div>
                                    <div className="min-w-0">
                                      <Link
                                        href={`/emis/${loan.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors block text-sm truncate"
                                      >
                                        {loan.loan_name}
                                      </Link>
                                      <span className="text-[11px] font-medium text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                                        <BankLogo bankName={loan.lender_name} size="xs" />
                                        <span className="font-semibold text-slate-600 truncate">
                                          {loan.lender_name}
                                        </span>
                                        <span>•</span>
                                        <span className="truncate">{loan.loan_category}</span>
                                      </span>
                                    </div>
                                  </div>

                                  <span
                                    suppressHydrationWarning
                                    className="text-base font-black text-[#0B132B] shrink-0"
                                  >
                                    {formatCurrency(loan.emi_amount, loan.currency || user?.preferred_currency || "INR")}
                                  </span>
                                </div>

                                {(loan.payment_method === "Auto Debit" || loan.debit_bank_name) && (
                                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="text-slate-500 font-medium">Auto-Debit Mandate:</span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                                      <RotateCcw className="w-2.5 h-2.5" />
                                      <span>{loan.debit_bank_name || loan.lender_name}</span>
                                      {loan.debit_account_number && (
                                        <span className="text-emerald-600/80 font-mono">({loan.debit_account_number})</span>
                                      )}
                                    </span>
                                  </div>
                                )}

                                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                                  <span className="text-slate-500 font-medium">Next Due:</span>
                                  <div className="text-right">
                                    {isCompleted ? (
                                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                        All Paid
                                      </span>
                                    ) : isArchived ? (
                                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                        Archived
                                      </span>
                                    ) : (
                                      <>
                                        <span className="font-bold text-slate-800">
                                          {loan.next_due_date || "—"}
                                        </span>
                                        {loan.days_remaining !== null && (
                                          <span
                                            className={cn(
                                              "text-[10px] font-black ml-1.5 px-2 py-0.5 rounded-full border",
                                              isOverdue
                                                ? "bg-rose-100/80 text-rose-800 border-rose-200"
                                                : isDueSoon
                                                ? "bg-rose-50 text-rose-700 border-rose-200"
                                                : "bg-amber-50 text-amber-800 border-amber-200/80"
                                            )}
                                          >
                                            {isOverdue
                                              ? `${Math.abs(loan.days_remaining ?? 0)}d overdue`
                                              : `${loan.days_remaining}d left`}
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div>
                                  <div className="flex items-center justify-between text-[11px] font-black text-slate-600 mb-1.5">
                                    <span>
                                      {loan.paid_emis} / {loan.total_emis} EMIs
                                    </span>
                                    <span className="text-indigo-600 font-black">
                                      {loan.progress_percentage}%
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className={cn(
                                        "h-full rounded-full transition-all duration-500",
                                        loan.progress_percentage > 0
                                          ? "bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 shadow-2xs"
                                          : "bg-transparent"
                                      )}
                                      style={{ width: `${loan.progress_percentage}%` }}
                                    />
                                  </div>
                                </div>

                                <div className="pt-2 flex items-center gap-2">
                                  {isCompleted || isArchived ? (
                                    <Link href={`/emis/${loan.id}`} className="w-full" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        type="button"
                                        className="w-full h-10 sm:h-9 min-h-[40px] sm:min-h-[36px] rounded-[12px] sm:rounded-[10px] border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                                      >
                                        <span>View Account Details</span>
                                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                      </button>
                                    </Link>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedEmiForPay(loan);
                                        }}
                                        className="flex-1 h-10 sm:h-9 min-h-[40px] sm:min-h-[36px] rounded-[12px] sm:rounded-[10px] btn-gradient-glow text-white text-xs font-black shadow-xs hover:shadow-indigo-500/25 flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 touch-manipulation"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Mark Paid</span>
                                      </button>
                                      <Link href={`/emis/${loan.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                                        <button
                                          type="button"
                                          className="w-full h-10 sm:h-9 min-h-[40px] sm:min-h-[36px] rounded-[12px] sm:rounded-[10px] border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-bold bg-white hover:bg-slate-50 transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                                        >
                                          <span>Details</span>
                                          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                                        </button>
                                      </Link>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Right Column (Desktop Only - Locked): Next Payment & Mini Calendar */}
            <div className="hidden lg:block w-[350px] xl:w-[380px] shrink-0 space-y-5">
              <NextPaymentCard
                heroData={apiData?.next_emi_hero}
                onPaymentRecorded={loadEmis}
                isLoading={isInitialLoading}
              />
              <MiniCalendar />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Filters Tray */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:hidden bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
          <div className="bg-white rounded-t-[28px] border-t border-slate-200/90 shadow-2xl w-full p-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[85vh] overflow-y-auto">
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
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center touch-manipulation active:scale-95"
                aria-label="Close filters"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filter by Category */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Loan Category
              </label>
              <CustomDropdown
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={categoryFilterOptions}
                className="w-full"
              />
            </div>

            {/* Filter by Bank */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Lending Bank
              </label>
              <CustomDropdown
                value={bankFilter}
                onChange={setBankFilter}
                options={bankFilterOptions}
                className="w-full"
              />
            </div>

            {/* Filter by Status */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Payment Status
              </label>
              <CustomDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusFilterOptions}
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
                  className="flex-1 h-11 rounded-[12px] border border-slate-200 bg-white text-slate-700 text-xs font-bold active:scale-95 touch-manipulation"
                >
                  Reset All
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 h-11 rounded-[12px] btn-gradient-glow text-white text-xs font-bold active:scale-95 touch-manipulation shadow-xs"
              >
                Apply Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal - Native Bottom Sheet on Mobile */}
      {loanToDelete && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150 select-none">
          <div className="bg-white rounded-t-[28px] sm:rounded-[24px] border-t sm:border border-slate-200/90 shadow-2xl max-w-sm sm:max-w-md w-full p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Mobile Drag Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto -mt-2 mb-2 sm:hidden" />

            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5 pb-1">
              <h3 className="text-base sm:text-lg font-black text-[#0B132B]">Delete EMI Commitment?</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                Are you sure you want to permanently delete <strong className="text-slate-900 font-bold">{loanToDelete.loan_name}</strong>? This will remove all schedules, payment records, and reminders. This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setLoanToDelete(null)}
                className="h-11 sm:h-9 min-h-[44px] sm:min-h-[36px] flex-1 sm:flex-none px-5 rounded-[10px] sm:rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation flex items-center justify-center"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="h-11 sm:h-9 min-h-[44px] sm:min-h-[36px] flex-1 sm:flex-none px-5 rounded-[10px] sm:rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60 touch-manipulation"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Commitment"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark As Paid Modal */}
      <MarkAsPaidModal
        isOpen={Boolean(selectedEmiForPay)}
        onClose={() => setSelectedEmiForPay(null)}
        emi={selectedEmiForPay}
        onSuccess={() => {
          loadEmis();
        }}
      />
    </DashboardLayout>
  );
}
