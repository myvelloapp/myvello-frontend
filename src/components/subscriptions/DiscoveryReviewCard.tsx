"use client";

import React, { useState } from "react";
import { Check, Edit2, EyeOff, Sparkles, AlertCircle, ArrowUpRight } from "lucide-react";
import { subscriptionService } from "@/services/subscriptionService";
import { SubscriptionDiscovery } from "@/types/subscription";

interface DiscoveryReviewCardProps {
  discovery: SubscriptionDiscovery;
  onApprove: (discovery: SubscriptionDiscovery) => void;
  onEditAndApprove: (discovery: SubscriptionDiscovery) => void;
  onIgnore: (discoveryId: number) => void;
}

export function DiscoveryReviewCard({
  discovery,
  onApprove,
  onEditAndApprove,
  onIgnore,
}: DiscoveryReviewCardProps) {
  const [loadingAction, setLoadingAction] = useState<"approve" | "ignore" | null>(null);

  const handleQuickApprove = async () => {
    setLoadingAction("approve");
    try {
      await subscriptionService.approveDiscovery(discovery.id, { create_payment: true });
      onApprove(discovery);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to approve subscription.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleQuickIgnore = async () => {
    setLoadingAction("ignore");
    try {
      await subscriptionService.ignoreDiscovery(discovery.id);
      onIgnore(discovery.id);
    } catch (e: any) {
      alert(e?.response?.data?.message || "Failed to ignore discovery.");
    } finally {
      setLoadingAction(null);
    }
  };

  const confidenceBadge = {
    high: "bg-emerald-100 text-emerald-800 border-emerald-200",
    medium: "bg-amber-100 text-amber-800 border-amber-200",
    low: "bg-slate-100 text-slate-700 border-slate-200",
  }[(discovery.confidence_level || "medium") as "high" | "medium" | "low"];

  const currencySymbol = discovery.currency === "INR" ? "₹" : discovery.currency === "USD" ? "$" : `${discovery.currency} `;

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between">
      <div>
        {/* Header: Merchant & Confidence */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-black text-[#02361B] tracking-tight">
                {discovery.merchant}
              </h4>
              <span
                className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${confidenceBadge}`}
              >
                {discovery.confidence_level} confidence
              </span>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5 truncate max-w-xs">
              {discovery.email_sender || "Gmail Detection"}
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-lg font-black text-[#02361B]">
              {discovery.amount ? `${currencySymbol}${Number(discovery.amount).toFixed(2)}` : "Amount Review"}
            </span>
            <p className="text-[11px] text-slate-400 capitalize">
              {discovery.billing_cycle || "Monthly"}
            </p>
          </div>
        </div>

        {/* Email Context Snippet */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-600 mb-4">
          <p className="font-semibold text-slate-800 truncate mb-0.5">
            Subject: {discovery.email_subject}
          </p>
          {discovery.raw_metadata?.snippet && (
            <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
              &ldquo;{discovery.raw_metadata.snippet}&rdquo;
            </p>
          )}
          {discovery.transaction_date && (
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Date in email: {new Date(discovery.transaction_date).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={handleQuickIgnore}
          disabled={loadingAction !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <EyeOff className="w-3.5 h-3.5" />
          Ignore
        </button>

        <button
          type="button"
          onClick={() => onEditAndApprove(discovery)}
          disabled={loadingAction !== null}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#02361B] bg-slate-100 hover:bg-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit & Confirm
        </button>

        <button
          type="button"
          onClick={handleQuickApprove}
          disabled={loadingAction !== null}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          {loadingAction === "approve" ? "Adding..." : "Confirm & Add"}
        </button>
      </div>
    </div>
  );
}
