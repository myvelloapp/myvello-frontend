"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Home,
  CheckCircle2,
  FileText,
  Download,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { mockEmis } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { MarkAsPaidModal } from "@/components/common/MarkAsPaidModal";

function EmiDetailContent() {
  const params = useParams();
  const loanId = Number(params?.id) || 1;
  const loan = mockEmis.find((e) => e.id === loanId) || mockEmis[0];

  const [activeTab, setActiveTab] = useState<"schedule" | "history" | "documents">("schedule");
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);

  // Generate realistic 12-month schedule snippet for visual prototype
  const sampleSchedule = [
    { no: 27, dueDate: "10 Oct, 2025", amount: loan.emiAmount, paidAmount: loan.emiAmount, paidDate: "09 Oct, 2025", status: "Paid" },
    { no: 28, dueDate: "10 Nov, 2025", amount: loan.emiAmount, paidAmount: 0, paidDate: null, status: "Due Soon" },
    { no: 29, dueDate: "10 Dec, 2025", amount: loan.emiAmount, paidAmount: 0, paidDate: null, status: "Upcoming" },
    { no: 30, dueDate: "10 Jan, 2026", amount: loan.emiAmount, paidAmount: 0, paidDate: null, status: "Upcoming" },
    { no: 31, dueDate: "10 Feb, 2026", amount: loan.emiAmount, paidAmount: 0, paidDate: null, status: "Upcoming" },
    { no: 32, dueDate: "10 Mar, 2026", amount: loan.emiAmount, paidAmount: 0, paidDate: null, status: "Upcoming" },
    { no: 33, dueDate: "10 Apr, 2026", amount: loan.emiAmount, paidAmount: 0, paidDate: null, status: "Upcoming" },
    { no: 34, dueDate: "10 May, 2026", amount: loan.emiAmount, paidAmount: 0, paidDate: null, status: "Upcoming" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
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
        <span className="text-slate-700 font-semibold">{loan.loanName}</span>
      </div>

      {/* Hero Loan Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <Home className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-[#172554] tracking-tight">
                  {loan.loanName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {loan.status}
                </span>
                {loan.ownershipType === "family_shared" && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200">
                    Family Shared
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {loan.bankName} • Account Ref: <span className="font-mono text-slate-600">{loan.loanReference}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl shadow-xs text-xs font-semibold px-4"
              onClick={() => setIsPayModalOpen(true)}
            >
              Mark as Paid
            </Button>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-400 font-semibold block">EMI Amount</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
              ₹{loan.emiAmount.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">Monthly</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-semibold block">Outstanding Principal</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
              ₹{loan.outstandingPrincipal.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">Sanctioned: ₹{loan.originalAmount.toLocaleString()}</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-semibold block">Interest Rate</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
              {loan.interestRate}%
            </span>
            <span className="text-[10px] text-slate-400">p.a. floating</span>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-semibold block">Instalments Progress</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">
              {loan.paidEmis} / {loan.totalEmis}
            </span>
            <span className="text-[10px] text-indigo-600 font-semibold">
              {loan.remainingEmis} remaining ({loan.tenureMonths} mo tenure)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-semibold text-slate-600">
            <span>Repayment Progress</span>
            <span>{Math.round((loan.paidEmis / loan.totalEmis) * 100)}% Complete</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#4F46E5] rounded-full"
              style={{ width: `${(loan.paidEmis / loan.totalEmis) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("schedule")}
          className={cn(
            "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer",
            activeTab === "schedule"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          Instalment Schedule
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={cn(
            "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer",
            activeTab === "history"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          Payment Transactions (28)
        </button>
        <button
          onClick={() => setActiveTab("documents")}
          className={cn(
            "px-4 py-3 text-xs font-bold border-b-2 transition-all cursor-pointer",
            activeTab === "documents"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          )}
        >
          Loan Vault & Documents (2)
        </button>
      </div>

      {/* TAB 1: Instalment Schedule Table */}
      {activeTab === "schedule" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Monthly Schedule Breakdown</span>
            <span className="text-slate-400">Due day: Every 10th of the month</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase bg-slate-50/50">
                  <th className="py-3 px-5">Instalment #</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Due Amount</th>
                  <th className="py-3 px-4">Paid Amount</th>
                  <th className="py-3 px-4">Paid Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleSchedule.map((item) => (
                  <tr key={item.no} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-slate-900">
                      #{item.no}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {item.dueDate}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-slate-900">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {item.paidAmount > 0 ? `₹${item.paidAmount.toLocaleString()}` : "-"}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {item.paidDate || "-"}
                    </td>
                    <td className="py-3.5 px-4">
                      {item.status === "Paid" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Paid
                        </span>
                      ) : item.status === "Due Soon" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Due Soon
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          Upcoming
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      {item.status !== "Paid" && (
                        <button
                          onClick={() => setIsPayModalOpen(true)}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Payment Transactions */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">28 Previous Payments Successfully Verified</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All external payments logged for {loan.loanName} with transaction reference IDs, UPI timestamps, and receipts.
          </p>
          <Link href="/payment-history">
            <Button variant="outline" size="sm" className="mt-2 text-xs">
              Open Full Transaction Ledger
            </Button>
          </Link>
        </div>
      )}

      {/* TAB 3: Documents */}
      {activeTab === "documents" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Encrypted Loan Documents</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">HDFC_Home_Loan_Agreement.pdf</div>
                  <div className="text-[10px] text-slate-400">1.8 MB • Uploaded Aug 2023</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 text-slate-500" />
              </Button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">Sanction_Letter_HDFC.pdf</div>
                  <div className="text-[10px] text-slate-400">640 KB • Uploaded Aug 2023</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Download className="w-4 h-4 text-slate-500" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <MarkAsPaidModal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        emi={loan}
        onSuccess={(data) => {
          alert(`Recorded payment of ₹${data.amount.toLocaleString()} for ${loan.loanName}!`);
        }}
      />
    </div>
  );
}

export default function EmiDetailPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading loan details...</div>}>
        <EmiDetailContent />
      </Suspense>
    </DashboardLayout>
  );
}
