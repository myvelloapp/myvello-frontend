"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  ArrowLeft,
  CheckCheck,
  ChevronRight,
  ChevronDown,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Users,
  Shield,
  X,
  Settings,
  Sparkles,
  Check,
} from "lucide-react";
import { useNotifications } from "@/context/NotificationContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { BrandLogo } from "@/components/common/BrandLogo";
import { MemberAvatarStack } from "@/components/common/MemberAvatarStack";
import { familyService } from "@/services/familyService";
import { getCategoryIcon, getCategoryBgClass } from "@/lib/categoryConfig";
import { BankLogo } from "@/components/ui/BankLogo";
import { cn } from "@/lib/utils";

function normalizeNotificationText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/\bfamily workspace\b/gi, "group")
    .replace(/' Workspace\b/g, "' Group")
    .replace(/" Workspace\b/g, '" Group')
    .replace(/\bFamily Member Joined\b/g, "Group Member Joined")
    .replace(/\bFamily Workspace Update\b/g, "Group Update")
    .replace(/\bworkspace\b/gi, "group");
}

interface HeaderProps {
  onOpenMobileMenu?: () => void;
  isPopupMode?: boolean;
  hideNotifications?: boolean;
}

export function Header({
  onOpenMobileMenu,
  isPopupMode = false,
  hideNotifications = false,
}: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { activeWorkspace, workspaces, switchWorkspace, refreshWorkspaces } = useWorkspace();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState(false);
  const [acceptingInviteId, setAcceptingInviteId] = useState<number | null>(null);
  const [acceptedInviteIds, setAcceptedInviteIds] = useState<Set<number>>(() => new Set<number>());
  const [isPopupExiting, setIsPopupExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const workspaceDropdownRef = useRef<HTMLDivElement>(null);

  // Sync with popup closing event (e.g. if Esc pressed or triggered from page)
  useEffect(() => {
    if (!isPopupMode) return;
    const handleClosingEvent = () => {
      setIsPopupExiting(true);
    };
    window.addEventListener("myvello:popup_closing", handleClosingEvent);
    return () => window.removeEventListener("myvello:popup_closing", handleClosingEvent);
  }, [isPopupMode]);

  const handleClosePopup = useCallback(() => {
    if (isPopupExiting) return;
    setIsPopupExiting(true);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("myvello:popup_closing"));
    }
    setTimeout(() => {
      const returnPath = pathname.startsWith("/family") ? "/family" : "/emis";
      router.push(returnPath);
    }, 220);
  }, [isPopupExiting, router, pathname]);

  // Mobile App Back Button: Visible on secondary/sub-pages, hidden on primary home screen
  const isMainPage = pathname === "/emis" || pathname === "/dashboard" || pathname === "/";
  const showBackButton = !isMainPage;

  const handleBack = useCallback(() => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/emis");
    }
  }, [router]);

  // Close notifications dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isNotificationsOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNotificationsOpen]);

  // Close workspace dropdown when clicking outside or pressing Escape
  useEffect(() => {
    if (!isWorkspaceOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (workspaceDropdownRef.current && !workspaceDropdownRef.current.contains(e.target as Node)) {
        setIsWorkspaceOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsWorkspaceOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isWorkspaceOpen]);

  const handleItemClick = async (n: (typeof notifications)[0]) => {
    if (!n.is_read) {
      await markAsRead(n.id);
    }
    setIsNotificationsOpen(false);
    if (n.action_url) {
      if (typeof window !== "undefined" && window.location.pathname === n.action_url.split("?")[0]) {
        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
      }
      router.push(n.action_url);
    } else if (n.emi_id) {
      router.push(`/emis/${n.emi_id}`);
    }
  };

  return (
    <header className="sticky top-0 z-30 min-h-18 sm:min-h-18 lg:min-h-20 pt-[max(env(safe-area-inset-top,0px),0.625rem)] pb-1.5 sm:pt-0 sm:pb-0 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between select-none pointer-events-none">
      {/* Left side: Brand Logo & Mobile Back Button (Omitted in popup mode) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {!isPopupMode && (
          <div className="lg:hidden flex items-center gap-2">
            {showBackButton && (
              <button
                type="button"
                onClick={handleBack}
                className="w-11 h-11 rounded-[15px] sm:rounded-[16px] bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.08)] border border-white/60 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
                aria-label="Go back"
                title="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <BrandLogo iconOnly className="" href="/emis" />
          </div>
        )}
      </div>

      {/* Right side: Workspace Selector & Notification Bell */}
      <div className="flex items-center gap-2 sm:gap-2.5 justify-end pointer-events-auto">
        {/* Workspace Selector (Omitted in popup mode; on normal dashboard: mobile only) */}
        {!isPopupMode && (
          <div ref={workspaceDropdownRef} className="relative lg:hidden">
          <button
            type="button"
            onClick={() => {
              setIsWorkspaceOpen(!isWorkspaceOpen);
              if (isNotificationsOpen) setIsNotificationsOpen(false);
            }}
            className={cn(
              "h-11 px-3 sm:px-3.5 rounded-[15px] sm:rounded-[16px] backdrop-blur-md transition-all cursor-pointer flex items-center gap-2 select-none touch-manipulation active:scale-[0.98]",
              isWorkspaceOpen
                ? "bg-white border-emerald-400 ring-2 ring-emerald-500/15 shadow-sm text-slate-900"
                : "bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.08)] border border-white/60"
            )}
            aria-label="Switch workspace"
            title="Switch workspace"
          >
            <MemberAvatarStack
              members={activeWorkspace.members_preview}
              count={activeWorkspace.members_count}
              type={activeWorkspace.type}
              size="sm"
            />
            <span className="font-extrabold text-[13px] text-slate-800 truncate max-w-[130px] sm:max-w-[170px] text-left">
              {activeWorkspace.name}
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 transition-transform shrink-0",
                isWorkspaceOpen && "rotate-180 text-emerald-700"
              )}
            />
          </button>

          {/* Workspace Switcher Popover */}
          {isWorkspaceOpen && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] w-[290px] sm:w-[320px] max-w-[calc(100vw-24px)] bg-white/98 backdrop-blur-xl rounded-[20px] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.22)] border border-slate-200/90 overflow-hidden z-50 p-2 space-y-1 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between px-2.5 py-1 text-[10px] uppercase font-black text-slate-400 tracking-wider">
                <span>WORKSPACES</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/70">
                  {workspaces.length} ACTIVE
                </span>
              </div>

              <div className="space-y-1 pt-0.5 max-h-64 overflow-y-auto">
                {workspaces.map((w) => {
                  const isSelected = activeWorkspace.id === w.id;
                  return (
                    <button
                      key={String(w.id)}
                      type="button"
                      onClick={() => {
                        switchWorkspace(w.id);
                        setIsWorkspaceOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between p-2.5 rounded-[12px] text-xs transition-all cursor-pointer group text-left touch-manipulation active:scale-[0.99]",
                        isSelected
                          ? "bg-emerald-50 text-emerald-900 font-bold border border-emerald-200/80 shadow-2xs"
                          : "hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MemberAvatarStack
                          members={w.members_preview}
                          count={w.members_count}
                          type={w.type}
                          size="sm"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs truncate leading-tight">
                              {w.name}
                            </span>
                            {w.type === "personal" ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 shrink-0">
                                Private
                              </span>
                            ) : (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 shrink-0">
                                Group
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-medium text-slate-400 block leading-tight mt-0.5 truncate">
                            {w.subtitle}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#1C9E30] text-white flex items-center justify-center shrink-0 ml-2 shadow-2xs">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-1.5 mt-1 border-t border-slate-100">
                <Link
                  href="/family"
                  onClick={() => setIsWorkspaceOpen(false)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Manage Groups</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
                </Link>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Notification Bell (Desktop only; omitted when hideNotifications is true or in popup mode) */}
        {!hideNotifications && (
          <div ref={containerRef} className="relative hidden lg:block">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              if (isWorkspaceOpen) setIsWorkspaceOpen(false);
            }}
            className={cn(
              "relative w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] sm:rounded-[16px] backdrop-blur-md transition-all cursor-pointer flex items-center justify-center active:scale-[0.98] touch-manipulation",
              isNotificationsOpen
                ? "bg-[#1C9E30] text-white shadow-[0_4px_16px_-4px_rgba(28,158,48,0.4)] border border-[#119230]"
                : "bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.08)] border border-white/60"
            )}
            aria-label="View notifications"
          >
            <Bell className={cn("w-5 h-5 transition-transform duration-200", isNotificationsOpen && "scale-105")} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 min-w-[16px] h-[16px] px-1 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white shadow-xs">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotificationsOpen && (
            <div className="absolute right-0 top-13 sm:top-14 w-[360px] sm:w-[420px] max-w-[calc(100vw-24px)] bg-white/98 backdrop-blur-xl rounded-[20px] shadow-[0_20px_50px_-12px_rgba(15,23,42,0.22)] border border-slate-200/90 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-slate-50/90 via-white to-emerald-50/40 border-b border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-[#1C9E30] text-white flex items-center justify-center shadow-xs shrink-0">
                    <Bell className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-black text-[#02361B] uppercase tracking-wider truncate">
                      Notifications
                    </span>
                    {unreadCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-black border border-rose-200/60 shrink-0">
                        {unreadCount} unread
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold shrink-0">
                        All read
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={async (e) => {
                        e.stopPropagation();
                        await markAllAsRead();
                      }}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50/80 transition-colors cursor-pointer"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      <span>Read all</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsNotificationsOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="divide-y divide-slate-100/90 max-h-[380px] overflow-y-auto overscroll-contain">
                {notifications.slice(0, 5).map((n) => {
                  const hasEmi = !!n.emi;
                  const emiCategory = n.emi?.loan_category || "";
                  const emiLender = n.emi?.lender_name || "";

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleItemClick(n)}
                      className={cn(
                        "group p-3.5 transition-all cursor-pointer flex items-start gap-3 relative",
                        !n.is_read
                          ? "bg-emerald-50/40 hover:bg-emerald-50/70"
                          : "bg-white hover:bg-slate-50/90"
                      )}
                    >
                      {/* Left Icon: Dedicated EMI category icon with bank badge OR notification type icon */}
                      <div className="relative shrink-0 mt-0.5">
                        {hasEmi ? (
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/80 shadow-2xs transition-transform duration-200 group-hover:scale-105",
                              getCategoryBgClass(emiCategory)
                            )}
                            title={`${emiCategory} (${emiLender})`}
                          >
                            {getCategoryIcon(emiCategory, "w-5 h-5")}
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs transition-transform duration-200 group-hover:scale-105",
                              n.type === "urgent"
                                ? "bg-rose-50 border-rose-100 text-rose-600"
                                : n.type === "success"
                                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                                : n.type === "family"
                                ? "bg-teal-50 border-teal-100 text-teal-600"
                                : n.type === "system"
                                ? "bg-slate-100 border-slate-200 text-slate-700"
                                : "bg-emerald-50 border-emerald-100 text-emerald-700"
                            )}
                          >
                            {n.type === "urgent" && <AlertTriangle className="w-5 h-5" />}
                            {n.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                            {n.type === "family" && <Users className="w-5 h-5" />}
                            {n.type === "system" && <Shield className="w-5 h-5" />}
                            {n.type === "reminder" && <Clock className="w-5 h-5" />}
                          </div>
                        )}

                        {/* Corner Bank Logo Badge if EMI lender is known */}
                        {hasEmi && emiLender && (
                          <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-2xs border border-slate-200">
                            <BankLogo bankName={emiLender} size="xs" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Meta: EMI Tag / Type Badge & Timestamp */}
                        <div className="flex items-center justify-between gap-1.5 mb-0.5">
                          {hasEmi ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 max-w-[200px] truncate border border-slate-200/60">
                              <span className="truncate">{emiLender || n.emi?.loan_name}</span>
                              <span className="text-slate-400">•</span>
                              <span className="capitalize text-slate-600 truncate">{emiCategory}</span>
                            </span>
                          ) : (
                            <span
                              className={cn(
                                "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                                n.type === "urgent"
                                  ? "bg-rose-100 text-rose-700"
                                  : n.type === "success"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : n.type === "family"
                                  ? "bg-teal-100 text-teal-700"
                                  : "bg-slate-100 text-slate-700"
                              )}
                            >
                              {n.type === "family" ? "GROUP" : n.type}
                            </span>
                          )}

                          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                            <span className="text-[10px] text-slate-400 font-medium">{n.timestamp}</span>
                            {!n.is_read && (
                              <span className="w-2 h-2 rounded-full bg-[#1C9E30] ring-2 ring-emerald-200 shrink-0" />
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-snug">
                          {normalizeNotificationText(n.title)}
                        </h4>

                        {/* Message */}
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {normalizeNotificationText(n.message)}
                        </p>

                        {/* Direct 1-Click Action for Workspace Invitations */}
                        {(() => {
                          const inviteIdMatch =
                            n.action_url?.match(/invitation_id=(\d+)/) ||
                            n.trigger_key?.match(/invite_(\d+)/);
                          const inviteId = inviteIdMatch ? Number(inviteIdMatch[1]) : null;
                          const isFamilyInvite =
                            n.type === "family" &&
                            (inviteId !== null ||
                              n.title.toLowerCase().includes("invitation") ||
                              n.message.toLowerCase().includes("invited you"));

                          if (!isFamilyInvite) return null;

                          const isAccepted =
                            n.action_label === "Accepted" ||
                            (inviteId !== null && acceptedInviteIds.has(inviteId)) ||
                            acceptedInviteIds.has(n.id);

                          return (
                            <div className="mt-2.5 flex items-center gap-2 pt-1 border-t border-slate-100/80">
                              {isAccepted ? (
                                <span className="h-7 px-2.5 rounded-[6px] bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs select-none">
                                  <Check className="w-3 h-3 text-emerald-600 stroke-[2.5]" />
                                  Accepted
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={acceptingInviteId === (inviteId || n.id)}
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    const currentInviteId = inviteId || n.id;
                                    setAcceptingInviteId(currentInviteId);

                                    if (!n.is_read) {
                                      await markAsRead(n.id);
                                    }

                                    try {
                                      let resFamilyId: number | null = null;
                                      if (inviteId) {
                                        const res = await familyService.acceptInvitationById(inviteId);
                                        if (res?.family_id) resFamilyId = res.family_id;
                                      }

                                      setAcceptedInviteIds((prev) => {
                                        const next = new Set(prev);
                                        if (inviteId) next.add(inviteId);
                                        next.add(n.id);
                                        return next;
                                      });

                                      if (typeof window !== "undefined") {
                                        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
                                        window.dispatchEvent(new CustomEvent("myvello:refresh_notifications"));
                                      }
                                      await refreshWorkspaces();
                                      if (resFamilyId) {
                                        switchWorkspace(resFamilyId);
                                      }
                                    } catch {
                                      setAcceptedInviteIds((prev) => {
                                        const next = new Set(prev);
                                        if (inviteId) next.add(inviteId);
                                        next.add(n.id);
                                        return next;
                                      });
                                      if (typeof window !== "undefined") {
                                        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
                                        window.dispatchEvent(new CustomEvent("myvello:refresh_notifications"));
                                      }
                                    } finally {
                                      setAcceptingInviteId(null);
                                    }
                                  }}
                                  className="h-7 px-2.5 rounded-[6px] btn-gradient-glow text-white text-[11px] font-bold shadow-xs active:scale-95 transition-all inline-flex items-center gap-1 cursor-pointer"
                                >
                                  {acceptingInviteId === (inviteId || n.id) ? (
                                    <>
                                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                      <span>Joining...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Check className="w-3 h-3 stroke-[3]" />
                                      <span>Accept &amp; Join</span>
                                    </>
                                  )}
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsNotificationsOpen(false);
                                  if (!n.is_read) markAsRead(n.id);
                                  if (typeof window !== "undefined" && window.location.pathname === "/family") {
                                    window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
                                  }
                                  router.push(n.action_url || "/family");
                                }}
                                className="h-7 px-2.5 rounded-[6px] border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold transition-all cursor-pointer inline-flex items-center"
                              >
                                View Details
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  );
                })}

                {/* Empty State */}
                {notifications.length === 0 && (
                  <div className="py-10 px-4 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2.5">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-black text-slate-800">All caught up!</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">No notifications or pending alerts</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 bg-slate-50/90 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  href="/notifications"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 text-[11px] transition-all hover:gap-1.5"
                >
                  <span>Open Reminders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/account?tab=settings"
                  onClick={() => setIsNotificationsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
                  title="Notification Preferences"
                >
                  <Settings className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          )}
        </div>
        )}

        {/* Mobile Menu Trigger (Drawer) - Omitted in popup mode */}
        {!isPopupMode && (
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="lg:hidden w-11 h-11 rounded-[15px] sm:rounded-[16px] bg-white/90 hover:bg-white text-slate-700 hover:text-slate-900 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.08)] border border-white/60 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
            aria-label="Open navigation menu"
            title="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Popup Close Button (Visible in popup mode) */}
        {isPopupMode && (
          <button
            type="button"
            onClick={handleClosePopup}
            disabled={isPopupExiting}
            className={cn(
              "w-10 h-10 sm:w-11 sm:h-11 rounded-[14px] sm:rounded-[16px] bg-white/90 hover:bg-white text-slate-500 hover:text-slate-900 shadow-[0_4px_16px_-4px_rgba(15,23,42,0.08)] border border-white/60 backdrop-blur-md flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation hover:border-slate-300",
              isPopupExiting ? "animate-popup-exit pointer-events-none" : "animate-popup-enter"
            )}
            aria-label="Close popup and return to EMIs"
            title="Close (Esc)"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>
        )}
      </div>
    </header>
  );
}
