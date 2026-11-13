"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  CreditCard,
  Clock,
  Users,
  Bell,
  Settings,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { mockEmis } from "@/lib/mockData";
import { formatCurrency, getCurrencySymbol } from "@/lib/formatters";
import { useAuth } from "@/modules/authentication/AuthContext";

interface CommandSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearchModal({ isOpen, onClose }: CommandSearchModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const currency = user?.preferred_currency || "INR";
  const currencySymbol = getCurrencySymbol(currency);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredLoans = mockEmis.filter(
    (l) =>
      l.loanName.toLowerCase().includes(query.toLowerCase()) ||
      l.bankName.toLowerCase().includes(query.toLowerCase()) ||
      l.loanReference.toLowerCase().includes(query.toLowerCase())
  );

  const quickLinks = [
    { label: "EMI Management", href: "/emis", icon: CreditCard },
    { label: "Add New EMI", href: "/emis/new", icon: PlusCircle },
    { label: "Payment History", href: "/payment-history", icon: Clock },
    { label: "Family Members", href: "/family", icon: Users },
    { label: "Notifications", href: "/notifications", icon: Bell },
    { label: "User Settings", href: "/settings", icon: Settings },
  ].filter((item) => item.label.toLowerCase().includes(query.toLowerCase()));

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search loans, banks, payment records or pages..."
            className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Loan Matches */}
          {filteredLoans.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Loan Records ({filteredLoans.length})
              </div>
              <div className="mt-1 space-y-1">
                {filteredLoans.map((loan) => (
                  <button
                    key={loan.id}
                    onClick={() => handleNavigate(`/emis/${loan.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-indigo-50/60 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100/70 text-indigo-600 flex items-center justify-center font-bold text-xs">
                        {currencySymbol}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600">
                          {loan.loanName}
                        </div>
                        <div suppressHydrationWarning className="text-xs text-slate-400">
                          {loan.bankName} • {formatCurrency(loan.emiAmount, currency)}/mo • Due: {loan.nextDueDate}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Page Links */}
          {quickLinks.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Quick Navigation
              </div>
              <div className="mt-1 space-y-1">
                {quickLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavigate(item.href)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                          {item.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">Jump</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredLoans.length === 0 && quickLinks.length === 0 && (
            <div className="py-8 text-center text-slate-400 text-sm">
              No results found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Use <strong>Esc</strong> to close</span>
          <span>Press <strong>Enter</strong> to select</span>
        </div>
      </div>
    </div>
  );
}
