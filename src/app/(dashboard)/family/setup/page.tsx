"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { familyService } from "@/services/familyService";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

const SUGGESTED_NAMES = [
  "Household & Family",
  "Swift Car Co-owners",
  "Vehicle Fleet",
  "Business Partners",
  "Household Finance",
  "Flatmates & Rent",
];

// High-fidelity shimmer skeleton matching exact 2-column popup geometry to guarantee zero layout shift (CLS = 0)
export function FamilySetupSkeleton() {
  return (
    <div className="relative -mt-18 pt-20 pb-12 px-3.5 sm:px-6 lg:px-8 xl:px-10 min-h-dvh overflow-x-hidden select-none animate-popup-enter">
      {/* Living Brand Gradient Backdrop */}
      <div className="absolute inset-0 pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1360px] mx-auto space-y-4 sm:space-y-6 animate-pulse">
        {/* Mobile Header Skeleton: Sleek compact row with close button placeholder */}
        <div className="sm:hidden flex items-center justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="h-6 w-44 bg-slate-200/80 rounded-md" />
            <div className="h-3.5 w-48 bg-slate-200/50 rounded" />
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-200/60 shrink-0" />
        </div>

        {/* Desktop Page Heading Skeleton */}
        <div className="hidden sm:block space-y-1.5">
          <div className="h-8 w-56 bg-slate-200/80 rounded-xl" />
          <div className="h-4 w-96 bg-slate-200/50 rounded" />
        </div>

        {/* Two-Column Form & Real-Time Group Preview Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* Left Column (8 cols): Form Card Skeleton */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-emerald-100/90 p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(2,54,27,0.06)] space-y-6">
              {/* Card Section Header */}
              <div className="border-b border-slate-100 pb-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-200/80 shrink-0" />
                  <div className="space-y-1">
                    <div className="h-4 w-28 bg-slate-200/80 rounded" />
                    <div className="h-3 w-40 bg-slate-200/50 rounded" />
                  </div>
                </div>
                <div className="h-5 w-20 bg-slate-200/60 rounded-full" />
              </div>

              {/* Group Name Input Skeleton */}
              <div className="space-y-2">
                <div className="h-3.5 w-24 bg-slate-200/70 rounded" />
                <div className="h-11 sm:h-10 w-full bg-slate-100 rounded-xl" />
                {/* Suggestions row skeleton */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  <div className="h-3 w-16 bg-slate-200/40 rounded" />
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-7 w-24 bg-slate-100 rounded-full" />
                  ))}
                </div>
              </div>

              {/* Form Action Buttons Skeleton */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex-1 sm:flex-none h-11 sm:h-9.5 px-6 sm:w-24 bg-slate-100 rounded-xl sm:rounded-lg" />
                <div className="flex-1 sm:flex-none h-11 sm:h-9.5 px-6 sm:w-32 bg-slate-200/80 rounded-xl sm:rounded-lg" />
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Real-Time Live Preview Skeleton */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-emerald-100/90 p-5 shadow-[0_4px_24px_-4px_rgba(2,54,27,0.07)] space-y-5">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 bg-slate-200/70 rounded" />
                <div className="h-5 w-12 bg-slate-200/60 rounded-full" />
              </div>

              {/* Main Visual Preview Card Skeleton */}
              <div className="p-4.5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-200/80 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-4 w-36 bg-slate-200/80 rounded" />
                    <div className="h-3 w-28 bg-slate-200/50 rounded" />
                  </div>
                </div>
                <div className="pt-2.5 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                  <div className="h-10 bg-white/80 rounded-lg" />
                  <div className="h-10 bg-white/80 rounded-lg" />
                </div>
              </div>

              {/* Capabilities Checklist Skeleton */}
              <div className="space-y-2.5">
                <div className="h-3 w-24 bg-slate-200/50 rounded" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-4 w-full bg-slate-100 rounded" />
                  ))}
                </div>
              </div>

              {/* Privacy Footer Skeleton */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="h-3 w-32 bg-slate-200/50 rounded" />
                <div className="h-3 w-24 bg-slate-200/60 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FamilySetupPage() {
  const router = useRouter();
  const { refreshWorkspaces, switchWorkspace } = useWorkspace();

  const [groupName, setGroupName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPopupExiting, setIsPopupExiting] = useState(false);

  // Smooth close / cancel popup handler
  const handleClosePopup = useCallback(() => {
    if (isPopupExiting) return;
    setIsPopupExiting(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("myvello:popup_closing"));
    }
    setTimeout(() => {
      router.push("/family");
    }, 220);
  }, [isPopupExiting, router]);

  // Handle ESC key and closing event
  useEffect(() => {
    const handleClosingEvent = () => {
      setIsPopupExiting(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClosePopup();
      }
    };

    window.addEventListener("myvello:popup_closing", handleClosingEvent);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("myvello:popup_closing", handleClosingEvent);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClosePopup]);

  // Handle Create Group Submission
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setErrorMessage("Please enter a name for your group.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const created = await familyService.createFamily(groupName.trim());
      await refreshWorkspaces();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
        window.dispatchEvent(new CustomEvent("myvello:refresh_workspaces"));
      }
      if (created && created.id) {
        switchWorkspace(created.id);
      }
      router.push("/family");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        error.response?.data?.message ||
          "Failed to create group. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout isPopup={true}>
      <div className="relative -mt-18 pt-20 pb-12 px-3.5 sm:px-6 lg:px-8 xl:px-10 min-h-dvh overflow-x-hidden select-none">
        {/* Pure CSS Brand Gradient Backdrop matching /emis/new */}
        <div className="absolute inset-0 pointer-events-none z-0" />

        {/* Content Container with Entrance & Exit Motion matching /emis/new */}
        <div
          className={cn(
            "relative z-10 max-w-[1360px] mx-auto space-y-4 sm:space-y-6",
            isPopupExiting ? "animate-popup-exit pointer-events-none" : "animate-popup-enter"
          )}
        >
          {/* Mobile Header: Sleek compact row with close button */}
          <div className="sm:hidden flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl font-black tracking-tight text-[#02361B] truncate">
                Create New Group
              </h1>
              <p className="text-[11px] font-semibold text-emerald-700 truncate">
                Shared workspace for joint commitments
              </p>
            </div>
            <button
              type="button"
              onClick={handleClosePopup}
              className="w-9 h-9 rounded-full bg-white/90 border border-slate-200/90 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs active:scale-95 shrink-0 touch-manipulation cursor-pointer"
              aria-label="Close"
              title="Close (Esc)"
            >
              <X className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>

          {/* Desktop Page Heading */}
          <div className="hidden sm:block">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#02361B]">
              Create New Group
            </h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              Set up a shared space for joint vehicle loans, household EMIs, and collaborative records.
            </p>
          </div>

          {/* Two-Column Form & Real-Time Group Preview Layout matching /emis/new */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Left Column (8 cols): Minimal Creation Form Card */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-4">
              <form
                onSubmit={handleCreate}
                className="bg-white rounded-2xl border border-emerald-100/90 p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(2,54,27,0.06)] space-y-6"
              >
                {/* Card Section Header */}
                <div className="border-b border-slate-100 pb-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200/70 shadow-2xs shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-black text-[#02361B] tracking-tight">Group Details</h2>
                      <p className="text-[11px] text-slate-400 font-medium">Define your new shared group vault</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                    Owner Role
                  </span>
                </div>

                {/* Error Alert */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Group Name Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-800">
                    Group Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Users className="w-4 h-4 text-emerald-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      required
                      autoFocus
                      autoCapitalize="words"
                      placeholder="e.g. Household & Family, Swift Car Co-owners, or Business Team"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 min-h-[48px] sm:min-h-[42px] rounded-xl border border-slate-200/90 text-[16px] sm:text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-300 transition-all shadow-2xs bg-white"
                    />
                  </div>

                  {/* Quick Preset Suggestion Chips */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">Suggestions:</span>
                    {SUGGESTED_NAMES.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setGroupName(name)}
                        className={cn(
                          "min-h-[36px] sm:min-h-[28px] px-3 py-1 rounded-full text-xs sm:text-[11px] font-semibold border transition-all cursor-pointer active:scale-95 touch-manipulation inline-flex items-center",
                          groupName === name
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-bold shadow-2xs"
                            : "bg-white border-slate-200/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleClosePopup}
                    className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-4 rounded-xl sm:rounded-lg border border-slate-200/90 hover:bg-slate-50 text-slate-600 hover:text-slate-800 text-xs font-bold transition-all cursor-pointer active:scale-95 touch-manipulation shadow-2xs inline-flex items-center justify-center"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !groupName.trim()}
                    className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-6 rounded-xl sm:rounded-lg btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Creating Group...</span>
                      </>
                    ) : (
                      <>
                        <span>Create Group</span>
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column (4 cols): Real-Time Live Preview Card matching /emis/new */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-4 sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-emerald-100/90 p-5 shadow-[0_4px_24px_-4px_rgba(2,54,27,0.07)] space-y-5">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#02361B]">Group Preview</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                    Live
                  </span>
                </div>

                {/* Main Visual Preview Card */}
                <div className="p-4.5 rounded-2xl bg-gradient-to-br from-emerald-50/60 via-teal-50/25 to-white border border-emerald-100/90 space-y-3.5 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl btn-gradient-glow text-white flex items-center justify-center shadow-md shadow-emerald-500/25 shrink-0 text-base font-black">
                      {groupName.trim() ? groupName.trim().slice(0, 2).toUpperCase() : "GP"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-black text-[#02361B] truncate">
                        {groupName.trim() || "Your Group Name"}
                      </h4>
                      <span className="text-[11px] font-semibold text-emerald-800 block mt-0.5">
                        Group Vault • 1 Member (You)
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-emerald-100/80 grid grid-cols-2 gap-2 text-[10px]">
                    <div className="bg-white/80 rounded-lg p-2 border border-emerald-100/60 shadow-2xs">
                      <span className="text-slate-400 block font-semibold uppercase">Your Role</span>
                      <span className="font-bold text-slate-800 block">Owner / Admin</span>
                    </div>
                    <div className="bg-white/80 rounded-lg p-2 border border-emerald-100/60 shadow-2xs">
                      <span className="text-slate-400 block font-semibold uppercase">Invite Code</span>
                      <span className="font-bold font-mono text-emerald-700 block">Auto-Generated</span>
                    </div>
                  </div>
                </div>

                {/* Group Capabilities Checklist */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    What You Can Do
                  </span>
                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-700">Track pooled loans & repayment schedules</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-700">Record who settled each instalment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-700">Share 6-character code or WhatsApp link</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-slate-700">Instant multi-device cloud sync</span>
                    </div>
                  </div>
                </div>

                {/* Privacy Guarantee Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Zero Personal Exposure</span>
                  </span>
                  <span className="text-emerald-700 font-bold">100% Private Vault</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
