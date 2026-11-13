"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Users,
  Plus,
  Link as LinkIcon,
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Lock,
  Layers,
  Check,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { familyService } from "@/services/familyService";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

const SUGGESTED_NAMES = [
  "Family Vault",
  "Home & Loans",
  "Household Finance",
  "Primary Residence",
];

export default function FamilySetupPage() {
  const router = useRouter();
  const { refreshWorkspaces, switchWorkspace } = useWorkspace();

  // Active Tab matching Settings Page: 'create' | 'join'
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");

  // Create Form State
  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Join Form State
  const [inviteCode, setInviteCode] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinErrorMessage, setJoinErrorMessage] = useState<string | null>(null);

  // Handle Create Workspace
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspaceName.trim()) {
      setErrorMessage("Please enter a name for your household workspace.");
      return;
    }

    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const created = await familyService.createFamily(workspaceName.trim());
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
          "Failed to create household workspace. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Join Workspace with Code
  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setJoinErrorMessage("Please paste a valid invitation code or link.");
      return;
    }

    setJoinErrorMessage(null);
    setIsJoining(true);

    try {
      let token = inviteCode.trim();
      if (token.includes("token=")) {
        const urlParams = new URLSearchParams(token.split("?")[1]);
        token = urlParams.get("token") || token;
      } else if (token.includes("code=")) {
        const urlParams = new URLSearchParams(token.split("?")[1]);
        token = urlParams.get("code") || token;
      }

      const res = await familyService.acceptInvitation(token);
      await refreshWorkspaces();
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
        window.dispatchEvent(new CustomEvent("myvello:refresh_workspaces"));
      }
      if (res && res.family_id) {
        switchWorkspace(res.family_id);
      }
      router.push("/family");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setJoinErrorMessage(
        error.response?.data?.message ||
          "Invalid or expired invitation code. Please verify with the workspace owner."
      );
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <DashboardLayout>
      {/* Living Aurora Gradient Backdrop matching Settings page */}
      <div className="relative -mt-18 pt-20 min-h-dvh overflow-x-hidden pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 select-none">
        {/* Pure CSS Brand Gradient Backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#F0F5FF]/80 to-[#F0F5FF]" />
        </div>

        {/* Content Container (Standard 1500px Max-Width matching all core views) */}
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-5 sm:space-y-6">
          {/* Header Title & Subtitle with Quick Back Button */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0B132B]">
                Household Workspace Setup
              </h1>
              <p className="text-xs sm:text-sm font-medium text-slate-500">
                Coordinate joint home loans, pooled repayments, and household commitments with your family.
              </p>
            </div>

            <Link href="/family" className="self-start sm:self-auto">
              <button
                type="button"
                className="min-h-[44px] sm:min-h-[36px] h-11 sm:h-8.5 px-3.5 rounded-xl sm:rounded-[8px] border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95 touch-manipulation shrink-0"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
                <span>Back to Workspaces</span>
              </button>
            </Link>
          </div>

          {/* Themed Segmented Tab Control matching Settings page */}
          <div className="p-1 rounded-xl sm:rounded-[8px] bg-white border border-slate-200/80 shadow-2xs flex items-center gap-1 self-start overflow-x-auto no-scrollbar max-w-full">
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={cn(
                "min-h-[40px] sm:min-h-[34px] px-3.5 py-2 sm:py-1.5 rounded-lg sm:rounded-[6px] text-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap",
                activeTab === "create"
                  ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                  : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
              )}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Workspace</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("join")}
              className={cn(
                "min-h-[40px] sm:min-h-[34px] px-3.5 py-2 sm:py-1.5 rounded-lg sm:rounded-[6px] text-xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap",
                activeTab === "join"
                  ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                  : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
              )}
            >
              <LinkIcon className="w-3.5 h-3.5 stroke-[2.2]" />
              <span>Join with Code</span>
            </button>
          </div>

          {/* Unified Two-Column Main Layout matching Settings page */}
          <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-6">
            {/* Left Column: Active Tab Main Content */}
            <div className="flex-1 min-w-0 space-y-5 w-full">
              {/* TAB 1: Create New Workspace */}
              {activeTab === "create" && (
                <form
                  onSubmit={handleCreate}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6"
                >
                  {/* Card Section Header */}
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <Home className="w-4 h-4 text-indigo-600" />
                      <span>Workspace Details</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Enter a recognizable name for your shared household group.
                    </p>
                  </div>

                  {/* Error Alert */}
                  {errorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Workspace Name Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Household or Family Name <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        autoFocus
                        autoCapitalize="words"
                        placeholder="e.g. Abdullah Family or Sunset Villa"
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 min-h-[48px] sm:min-h-[42px] rounded-xl sm:rounded-[8px] border border-slate-200 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    {/* Quick Suggestion Chips */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <span className="text-[11px] text-slate-400 font-medium">Suggestions:</span>
                      {SUGGESTED_NAMES.map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setWorkspaceName(name)}
                          className={cn(
                            "min-h-[36px] sm:min-h-[28px] px-3 py-1 rounded-full text-xs sm:text-[11px] font-semibold border transition-all cursor-pointer active:scale-95 touch-manipulation inline-flex items-center",
                            workspaceName === name
                              ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                              : "bg-white border-slate-200/80 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                          )}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Role & Permissions Note */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 block">
                        Your Role: Workspace Owner
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        As the creator, you retain full owner permissions to invite members, assign admin privileges, rename the workspace, or link family loans at any time.
                      </p>
                    </div>
                  </div>

                  {/* Privacy Guarantee Card */}
                  <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/80 flex items-start gap-3">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-emerald-900 block">
                        Privacy Guarantee
                      </span>
                      <p className="text-[11px] text-emerald-700/90 leading-relaxed font-medium">
                        Personal commitments in your Private Vault remain completely confidential. Only loans you explicitly link to this workspace will be shared with invited family members.
                      </p>
                    </div>
                  </div>

                  {/* Form Action Buttons matching Settings page */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link href="/family" className="flex-1 sm:flex-none">
                      <button
                        type="button"
                        className="w-full sm:w-auto min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-4 rounded-xl sm:rounded-[8px] border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer active:scale-95 touch-manipulation"
                      >
                        Cancel
                      </button>
                    </Link>

                    <button
                      type="submit"
                      disabled={isSubmitting || !workspaceName.trim()}
                      className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-5 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Join Existing Workspace */}
              {activeTab === "join" && (
                <form
                  onSubmit={handleJoin}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6"
                >
                  {/* Card Section Header */}
                  <div className="border-b border-slate-100 pb-4">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-indigo-600" />
                      <span>Join with Workspace Code</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Enter the 6-character workspace code (e.g. FAM-TI6FSK) or paste an invitation link.
                    </p>
                  </div>

                  {/* Error Alert */}
                  {joinErrorMessage && (
                    <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{joinErrorMessage}</span>
                    </div>
                  )}

                  {/* Invite Code Input */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-800">
                      Workspace Code or Link <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        required
                        autoFocus
                        inputMode="text"
                        autoCapitalize="characters"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="e.g. FAM-TI6FSK or paste invite link"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 min-h-[48px] sm:min-h-[42px] rounded-xl sm:rounded-[8px] border border-slate-200 text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs bg-slate-50/50 focus:bg-white font-mono uppercase"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Ask your household administrator for their workspace code (displayed directly on their Family dashboard).
                    </p>
                  </div>

                  {/* How it works banner */}
                  <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/80 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 block">
                        Instant Multi-Device Sync
                      </span>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        Joining connects your vault immediately. You will be able to see shared EMIs, view amortization schedules, and track pooled payments in real time.
                      </p>
                    </div>
                  </div>

                  {/* Form Action Buttons matching Settings page */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link href="/family" className="flex-1 sm:flex-none">
                      <button
                        type="button"
                        className="w-full sm:w-auto min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-4 rounded-xl sm:rounded-[8px] border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all cursor-pointer active:scale-95 touch-manipulation"
                      >
                        Cancel
                      </button>
                    </Link>

                    <button
                      type="submit"
                      disabled={isJoining || !inviteCode.trim()}
                      className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-5 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isJoining ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Joining...</span>
                        </>
                      ) : (
                        <>
                          <span>Join Workspace</span>
                          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Right Column: Informational Sidebar Cards matching Settings page */}
            <div className="w-full lg:w-[360px] xl:w-[380px] shrink-0 space-y-5">
              {/* Workspace Architecture Overview Card */}
              <div className="bg-white rounded-[16px] p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-3.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100/80">
                  <div className="flex items-center gap-2 text-[#0B132B]">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-black tracking-tight text-[#0B132B]">
                      Workspace Features
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Collaborative
                  </span>
                </div>

                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">Joint Loan Scheduling</span>
                      <span className="text-[11px] text-slate-500">Track combined monthly commitments and outstanding principal balances.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">Who Paid What</span>
                      <span className="text-[11px] text-slate-500">Payment receipts highlight the exact member and photo who settled each instalment.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded-md bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 block">Instant Live Sync</span>
                      <span className="text-[11px] text-slate-500">Payments made by any family member update your dashboard in real time without refreshing.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Isolation Guarantee Card */}
              <div className="p-4.5 rounded-[16px] bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 border border-indigo-100/70 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs">
                  <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Confidential Vault Isolation</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                  Your Personal Vault is isolated from all family workspaces. Personal credit cards, vehicle loans, and personal commitments remain strictly visible to you alone.
                </p>
              </div>

              {/* Quick Help Card */}
              <div className="p-4 rounded-[14px] bg-slate-50/80 border border-slate-200/80 space-y-1.5 text-xs">
                <span className="font-bold text-slate-800 block">Need multiple workspaces?</span>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  You can create and belong to multiple households (e.g. Parental Home and Personal Family) and switch seamlessly anytime from the top-left dropdown.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
