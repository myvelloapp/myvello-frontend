"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Home,
  Car,
  User,
  Bike,
  GraduationCap,
  Coins,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  MoreHorizontal,
  ChevronRight,
  Shield,
  Eye,
  Check,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCardRow } from "@/components/dashboard/StatCardRow";
import { NextPaymentCard } from "@/components/dashboard/NextPaymentCard";
import { MiniCalendar } from "@/components/dashboard/MiniCalendar";
import { QuickActionsGrid } from "@/components/dashboard/QuickActionsGrid";
import { Button } from "@/components/ui/Button";
import { mockEmis, MockEmi } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { MarkAsPaidModal } from "@/components/common/MarkAsPaidModal";

export default function EmiManagementPage() {
  const [activeTab, setActiveTab] = useState<"active" | "completed" | "archived">("active");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [bankFilter, setBankFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedEmiForPay, setSelectedEmiForPay] = useState<MockEmi | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<number | null>(null);

  // Filter loans based on tab and dropdowns
  const displayedLoans = mockEmis.filter((loan) => {
    if (activeTab === "active" && loan.status !== "Active") return false;
    if (activeTab === "completed" && loan.status !== "Completed") return false;
    if (activeTab === "archived" && loan.status !== "Archived") return false;
    if (categoryFilter !== "All" && loan.loanCategory !== categoryFilter) return false;
    if (bankFilter !== "All" && loan.bankName !== bankFilter) return false;
    if (statusFilter !== "All" && loan.scheduleStatus !== statusFilter) return false;
    return true;
  });

  const getCategoryIcon = (iconType: string) => {
    switch (iconType) {
      case "home":
        return <Home className="w-5 h-5 text-indigo-600" />;
      case "car":
        return <Car className="w-5 h-5 text-blue-600" />;
      case "user":
        return <User className="w-5 h-5 text-pink-600" />;
      case "bike":
        return <Bike className="w-5 h-5 text-emerald-600" />;
      case "graduation":
        return <GraduationCap className="w-5 h-5 text-purple-600" />;
      default:
        return <Coins className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb Navigation matching screenshot */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700 font-semibold">EMI Management</span>
        </div>

        {/* Page Header matching screenshot */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              EMI Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Track, manage and never miss an EMI payment.
            </p>
          </div>

          <Link href="/emis/new">
            <Button
              variant="secondary"
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl shadow-xs gap-2 font-semibold text-xs px-4 py-2.5"
            >
              <Plus className="w-4 h-4" />
              Add New EMI
            </Button>
          </Link>
        </div>

        {/* 4 Top Summary Metric Cards */}
        <StatCardRow />

        {/* Main 2-Column Content Layout matching screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Loan Table & Filters (8 Cols on desktop) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Tab Pill Navigation matching screenshot */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
                <button
                  onClick={() => setActiveTab("active")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "active"
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Active Loans (4)
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "completed"
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Completed (1)
                </button>
                <button
                  onClick={() => setActiveTab("archived")}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer",
                    activeTab === "archived"
                      ? "bg-[#4F46E5] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  )}
                >
                  Archived (0)
                </button>
              </div>
            </div>

            {/* Filter Bar + View Mode Toggle matching screenshot */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Category Dropdown */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Home Loan">Home Loan</option>
                  <option value="Vehicle Loan">Vehicle Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Education Loan">Education Loan</option>
                </select>

                {/* Bank Dropdown */}
                <select
                  value={bankFilter}
                  onChange={(e) => setBankFilter(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="All">All Banks</option>
                  <option value="HDFC Bank">HDFC Bank</option>
                  <option value="SBI">SBI</option>
                  <option value="ICICI Bank">ICICI Bank</option>
                  <option value="Axis Bank">Axis Bank</option>
                  <option value="Bank of Baroda">Bank of Baroda</option>
                </select>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="All">All Status</option>
                  <option value="Due Soon">Due Soon</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              {/* List / Grid Toggle */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors cursor-pointer",
                    viewMode === "list"
                      ? "bg-[#4F46E5] text-white"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                  aria-label="List view"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-lg transition-colors cursor-pointer",
                    viewMode === "grid"
                      ? "bg-[#4F46E5] text-white"
                      : "text-slate-500 hover:text-slate-800"
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List Table View matching screenshot */}
            {viewMode === "list" ? (
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                        <th className="py-3.5 px-5">Loan Details</th>
                        <th className="py-3.5 px-4">EMI Amount</th>
                        <th className="py-3.5 px-4">Next Due Date</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Progress</th>
                        <th className="py-3.5 px-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {displayedLoans.map((loan) => {
                        const progressPercent = Math.round((loan.paidEmis / loan.totalEmis) * 100);
                        const isActionOpen = activeActionMenuId === loan.id;

                        return (
                          <tr
                            key={loan.id}
                            className="hover:bg-slate-50/80 transition-colors group"
                          >
                            {/* Loan Details Column with Icon */}
                            <td className="py-4 px-5">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${loan.bgClass} border border-slate-100`}
                                >
                                  {getCategoryIcon(loan.categoryIcon)}
                                </div>
                                <div>
                                  <Link
                                    href={`/emis/${loan.id}`}
                                    className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                                  >
                                    {loan.loanName}
                                    {loan.ownershipType === "family_shared" && (
                                      <span
                                        title="Family Shared Record"
                                        className="inline-flex items-center text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-700 border border-teal-200"
                                      >
                                        Shared
                                      </span>
                                    )}
                                  </Link>
                                  <div className="text-[11px] text-slate-400 mt-0.5">
                                    {loan.bankName} • {loan.loanCategory}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* EMI Amount */}
                            <td className="py-4 px-4 font-extrabold text-slate-900">
                              ₹{loan.emiAmount.toLocaleString()}
                            </td>

                            {/* Next Due Date & Days Left */}
                            <td className="py-4 px-4">
                              <div className="font-semibold text-slate-800">
                                {loan.nextDueDate}
                              </div>
                              {loan.daysLeft > 0 && (
                                <div
                                  className={cn(
                                    "text-[11px] font-bold mt-0.5",
                                    loan.daysLeft <= 3 ? "text-rose-600" : "text-slate-400"
                                  )}
                                >
                                  {loan.daysLeft} days left
                                </div>
                              )}
                            </td>

                            {/* Status Badge */}
                            <td className="py-4 px-4">
                              {loan.scheduleStatus === "Due Soon" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                  Due Soon
                                </span>
                              )}
                              {loan.scheduleStatus === "Upcoming" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                                  Upcoming
                                </span>
                              )}
                              {loan.scheduleStatus === "Paid" && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Paid
                                </span>
                              )}
                            </td>

                            {/* Progress Bar & Fraction matching screenshot */}
                            <td className="py-4 px-4 min-w-[140px]">
                              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                                <span>
                                  {loan.paidEmis} / {loan.totalEmis}
                                </span>
                                <span>{progressPercent}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#4F46E5] rounded-full transition-all duration-500"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </td>

                            {/* Actions Dropdown */}
                            <td className="py-4 px-4 text-right relative">
                              <button
                                onClick={() =>
                                  setActiveActionMenuId(isActionOpen ? null : loan.id)
                                }
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {isActionOpen && (
                                <div className="absolute right-4 top-12 z-30 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1 text-left space-y-0.5 animate-fade-in">
                                  <button
                                    onClick={() => {
                                      setSelectedEmiForPay(loan);
                                      setActiveActionMenuId(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    Mark as Paid
                                  </button>
                                  <Link
                                    href={`/emis/${loan.id}`}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                  >
                                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                                    View Schedule
                                  </Link>
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {displayedLoans.length === 0 && (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <p className="text-sm">No loans found matching the selected filters.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCategoryFilter("All");
                        setBankFilter("All");
                        setStatusFilter("All");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* Grid View Alternative */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayedLoans.map((loan) => {
                  const progressPercent = Math.round((loan.paidEmis / loan.totalEmis) * 100);
                  return (
                    <div
                      key={loan.id}
                      className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${loan.bgClass} border border-slate-100`}
                          >
                            {getCategoryIcon(loan.categoryIcon)}
                          </div>
                          <div>
                            <Link
                              href={`/emis/${loan.id}`}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors block text-sm"
                            >
                              {loan.loanName}
                            </Link>
                            <span className="text-[11px] text-slate-400">
                              {loan.bankName}
                            </span>
                          </div>
                        </div>
                        <span className="text-base font-extrabold text-slate-900">
                          ₹{loan.emiAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500">Next Due:</span>
                        <span className="font-bold text-slate-800">{loan.nextDueDate}</span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>
                            {loan.paidEmis} / {loan.totalEmis} EMIs
                          </span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#4F46E5] rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="w-full text-xs"
                          onClick={() => setSelectedEmiForPay(loan)}
                        >
                          Mark as Paid
                        </Button>
                        <Link href={`/emis/${loan.id}`} className="w-full">
                          <Button variant="outline" size="sm" className="w-full text-xs">
                            Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Next Payment, Mini Calendar & Quick Actions (4 Cols on desktop) */}
          <div className="lg:col-span-4 space-y-5">
            <NextPaymentCard />
            <MiniCalendar />
            <QuickActionsGrid />
          </div>
        </div>
      </div>

      {/* Mark As Paid Modal */}
      <MarkAsPaidModal
        isOpen={Boolean(selectedEmiForPay)}
        onClose={() => setSelectedEmiForPay(null)}
        emi={selectedEmiForPay}
        onSuccess={(data) => {
          alert(`Recorded ₹${data.amount.toLocaleString()} payment for ${selectedEmiForPay?.loanName}!`);
        }}
      />
    </DashboardLayout>
  );
}
