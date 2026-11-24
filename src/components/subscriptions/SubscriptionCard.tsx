"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MoreVertical,
  CheckCircle2,
  Calendar,
  AlertCircle,
  PauseCircle,
  PlayCircle,
  XCircle,
  Trash2,
  Edit2,
  CreditCard,
  Mail,
  Users,
} from "lucide-react";
import { Subscription } from "@/types/subscription";

interface SubscriptionCardProps {
  subscription: Subscription;
  onEdit: (sub: Subscription) => void;
  onRecordPayment: (sub: Subscription) => void;
  onStatusChange: (sub: Subscription, action: "pause" | "resume" | "cancel") => void;
  onDelete: (sub: Subscription) => void;
}

export function SubscriptionCard({
  subscription,
  onEdit,
  onRecordPayment,
  onStatusChange,
  onDelete,
}: SubscriptionCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleOutside);
      return () => document.removeEventListener("mousedown", handleOutside);
    }
  }, [menuOpen]);

  const currencySymbol =
    subscription.currency === "INR"
      ? "₹"
      : subscription.currency === "USD"
      ? "$"
      : `${subscription.currency} `;

  const daysLeft = subscription.days_until_due;
  let dueBadgeText = "Due soon";
  let dueBadgeClass = "bg-slate-100 text-slate-700";

  if (typeof daysLeft === "number") {
    if (daysLeft < 0) {
      dueBadgeText = `${Math.abs(daysLeft)}d overdue`;
      dueBadgeClass = "bg-red-100 text-red-700 font-bold";
    } else if (daysLeft === 0) {
      dueBadgeText = "Due today";
      dueBadgeClass = "bg-amber-100 text-amber-800 font-bold";
    } else if (daysLeft === 1) {
      dueBadgeText = "Due tomorrow";
      dueBadgeClass = "bg-amber-50 text-amber-700 font-semibold";
    } else {
      dueBadgeText = `Due in ${daysLeft}d`;
      dueBadgeClass = "bg-emerald-50 text-emerald-700";
    }
  }

  const statusPill = {
    active: "bg-emerald-100 text-emerald-800",
    paused: "bg-amber-100 text-amber-800",
    cancelled: "bg-red-100 text-red-800",
    archived: "bg-slate-100 text-slate-600",
  }[subscription.status];

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between relative">
      <div>
        {/* Top: Category & Menu */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
              style={{
                backgroundColor: `${subscription.category?.color || "#10B981"}15`,
                color: subscription.category?.color || "#047857",
              }}
            >
              {subscription.category?.name || "General"}
            </span>

            {subscription.ownership_type === "family_shared" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                <Users className="w-2.5 h-2.5" /> Shared
              </span>
            )}

            {subscription.source === "gmail" && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                <Mail className="w-2.5 h-2.5 text-red-500" /> Gmail
              </span>
            )}
          </div>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-20 text-xs text-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onRecordPayment(subscription);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 hover:text-emerald-700 flex items-center gap-2 cursor-pointer"
                >
                  <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                  Record Renewal
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(subscription);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-slate-500" />
                  Edit Details
                </button>

                {subscription.status === "active" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onStatusChange(subscription, "pause");
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-amber-50 text-amber-700 flex items-center gap-2 cursor-pointer"
                  >
                    <PauseCircle className="w-3.5 h-3.5" />
                    Pause Subscription
                  </button>
                )}

                {subscription.status === "paused" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onStatusChange(subscription, "resume");
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2 cursor-pointer"
                  >
                    <PlayCircle className="w-3.5 h-3.5" />
                    Resume Subscription
                  </button>
                )}

                {subscription.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onStatusChange(subscription, "cancel");
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Cancel Subscription
                  </button>
                )}

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(subscription);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title and Merchant */}
        <h3 className="text-base font-black text-[#02361B] tracking-tight">
          {subscription.name}
        </h3>
        <p className="text-xs text-slate-500 font-medium">
          {subscription.merchant}
        </p>

        {/* Amount & Cycle */}
        <div className="mt-4 mb-3">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-[#02361B]">
              {currencySymbol}
              {Number(subscription.amount).toFixed(2)}
            </span>
            <span className="text-xs text-slate-400 font-medium capitalize">
              /{subscription.billing_cycle}
            </span>
          </div>

          {subscription.billing_cycle !== "monthly" && subscription.monthly_equivalent && (
            <p className="text-[11px] text-slate-400 mt-0.5">
              ~{currencySymbol}
              {Number(subscription.monthly_equivalent).toFixed(2)} / month
            </p>
          )}
        </div>
      </div>

      {/* Footer: Due date countdown & Mark Paid button */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span className={`px-2 py-0.5 rounded-md text-[11px] ${dueBadgeClass}`}>
            {dueBadgeText}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onRecordPayment(subscription)}
          className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Paid
        </button>
      </div>
    </div>
  );
}
