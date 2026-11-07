"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Download,
  Filter,
  CheckCircle2,
  Calendar,
  CreditCard,
  Search,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { mockPaymentHistory } from "@/lib/mockData";

export default function PaymentHistoryPage() {
  const [selectedLoan, setSelectedLoan] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = mockPaymentHistory.filter((item) => {
    if (selectedLoan !== "All" && item.loanName !== selectedLoan) return false;
    if (selectedMethod !== "All" && item.paymentMethod !== selectedMethod) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.loanName.toLowerCase().includes(q) ||
        item.bankName.toLowerCase().includes(q) ||
        item.transactionReference.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalPaidSum = filteredHistory.reduce((sum, item) => sum + item.amount, 0);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700 font-semibold">Payment History</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Payment History
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Immutable ledger of external EMI repayments, timestamps, and reference IDs.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs font-semibold"
            onClick={() => alert("Exporting payment history ledger as CSV/PDF...")}
          >
            <Download className="w-3.5 h-3.5" />
            Export Statement
          </Button>
        </div>

        {/* Summary Metric Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 block">Total Payments Logged</span>
            <span className="text-xl font-extrabold text-slate-900 mt-0.5 block">{filteredHistory.length} Transactions</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 block">Total Amount Reconciled</span>
            <span className="text-xl font-extrabold text-emerald-700 mt-0.5 block">₹{totalPaidSum.toLocaleString()}</span>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 block">Reconciliation Status</span>
            <span className="text-xl font-extrabold text-indigo-700 mt-0.5 block flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 100% Verified
            </span>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search reference or loan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <select
              value={selectedLoan}
              onChange={(e) => setSelectedLoan(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Loans</option>
              <option value="Home Loan">Home Loan</option>
              <option value="Car Loan">Car Loan</option>
              <option value="Personal Loan">Personal Loan</option>
              <option value="Bike Loan">Bike Loan</option>
              <option value="Education Loan">Education Loan</option>
            </select>

            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Payment Methods</option>
              <option value="Auto Debit">Auto Debit</option>
              <option value="UPI Transfer">UPI Transfer</option>
              <option value="NetBanking">NetBanking</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </div>
        </div>

        {/* Payment History Table */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase bg-slate-50/50">
                  <th className="py-3.5 px-5">Loan / Creditor</th>
                  <th className="py-3.5 px-4">Instalment</th>
                  <th className="py-3.5 px-4">Payment Date</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Payment Method</th>
                  <th className="py-3.5 px-4">Reference / UTR</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-slate-900">{item.loanName}</div>
                      <div className="text-[11px] text-slate-400">{item.bankName}</div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      #{item.installmentNo}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-700">
                      {item.paymentDate}
                    </td>
                    <td className="py-4 px-4 font-extrabold text-slate-900">
                      ₹{item.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">
                      {item.paymentMethod}
                    </td>
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-500">
                      {item.transactionReference}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
