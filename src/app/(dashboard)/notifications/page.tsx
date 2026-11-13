"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCheck,
  AlertTriangle,
  AlertCircle,
  Clock,
  CheckCircle2,
  Users,
  Settings,
  Trash2,
  Shield,
  Check,
  Sparkles,
  ArrowRight,
  ChevronRight,
  X,
  Layers,
  MoreHorizontal,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useNotifications } from "@/context/NotificationContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { familyService } from "@/services/familyService";
import { NotificationItem } from "@/services/notificationService";
import { getCategoryIcon, getCategoryBgClass } from "@/lib/categoryConfig";
import { BankLogo } from "@/components/ui/BankLogo";
import { cn } from "@/lib/utils";
import { NotificationPreferencesModal } from "@/components/common/NotificationPreferencesModal";

/* -------------------------------------------------------------------------
   Skeleton component with exact layout geometry to prevent CLS
------------------------------------------------------------------------- */
function NotificationsSkeleton() {
  return (
    <div className="min-h-dvh overflow-x-hidden max-w-[1500px] mx-auto py-3.5 sm:py-5 px-3.5 sm:px-6 lg:px-8 xl:px-10 pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 space-y-3.5 sm:space-y-5 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 sm:h-8 w-40 sm:w-52 rounded-xl bg-slate-200/80" />
          <div className="h-5 w-16 rounded-full bg-slate-200/60" />
        </div>
        {/* Mobile Skeleton: Circular 3-dot trigger */}
        <div className="sm:hidden w-9 h-9 rounded-full bg-slate-200/70 shrink-0" />
        {/* Desktop Skeleton: Action buttons */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="h-9 w-28 rounded-xl bg-slate-200/70" />
          <div className="h-9 w-24 rounded-xl bg-slate-200/70" />
        </div>
      </div>

      {/* Unified Card Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Attached Toolbar Skeleton */}
        <div className="p-2.5 sm:px-4 sm:py-3 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
            <div className="h-8 w-16 rounded-lg bg-slate-200/80 shrink-0" />
            <div className="h-8 w-20 rounded-lg bg-slate-200/50 shrink-0" />
            <div className="h-8 w-24 rounded-lg bg-slate-200/50 shrink-0" />
            <div className="h-8 w-20 rounded-lg bg-slate-200/50 shrink-0" />
          </div>
        </div>

        {/* Items Skeleton */}
        <div className="divide-y divide-slate-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-3.5 sm:p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200/80 shrink-0" />
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="h-4 w-28 bg-slate-200/70 rounded-full" />
                  <div className="h-3 w-16 bg-slate-200/50 rounded" />
                </div>
                <div className="h-4 w-3/4 bg-slate-200/80 rounded" />
                <div className="h-3 w-full bg-slate-200/50 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Confirmation Modal for Clearing Read Notifications (Destructive Safety)
   Mobile Native Bottom Sheet & Desktop Dialog
------------------------------------------------------------------------- */
function ClearReadConfirmModal({
  isOpen,
  count,
  isClearing,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  count: number;
  isClearing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200/90 max-w-md w-full overflow-hidden p-5 sm:p-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 space-y-4 max-h-[92dvh] sm:max-h-[85vh] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6">
        {/* Native Mobile Drag Handle */}
        <div className="sm:hidden -mt-2 pb-2 flex justify-center w-full">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 sm:w-10 sm:h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Clear Read Notifications?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Are you sure you want to dismiss all <span className="font-bold text-slate-700">{count}</span> read notifications? They will be permanently removed from your activity ledger.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isClearing}
            className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] h-11 sm:h-9.5 px-4 rounded-xl sm:rounded-[8px] border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 touch-manipulation inline-flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isClearing}
            className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] h-11 sm:h-9.5 px-5 rounded-xl sm:rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation disabled:opacity-60"
          >
            {isClearing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Clearing...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Read</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsPageContent() {
  const router = useRouter();
  const { switchWorkspace, refreshWorkspaces } = useWorkspace();
  const {
    notifications,
    unreadCount,
    isLoading,
    filter,
    setFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearRead,
  } = useNotifications();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [acceptingInviteId, setAcceptingInviteId] = useState<number | null>(null);
  const [decliningInviteId, setDecliningInviteId] = useState<number | null>(null);

  // Header 3-dot dropdown popover state & click-outside handling
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const headerMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setIsHeaderMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsHeaderMenuOpen(false);
      }
    }

    if (isHeaderMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isHeaderMenuOpen]);

  // Check if opened with ?preferences=true
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("preferences") === "true") {
        setIsPreferencesOpen(true);
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const readCount = React.useMemo(
    () => notifications.filter((n) => n.is_read).length,
    [notifications]
  );

  const unreadItemsCount = React.useMemo(
    () => notifications.filter((n) => !n.is_read).length,
    [notifications]
  );

  const remindersCount = React.useMemo(
    () => notifications.filter((n) => n.type === "reminder" || n.type === "urgent").length,
    [notifications]
  );

  const familyCount = React.useMemo(
    () => notifications.filter((n) => n.type === "family").length,
    [notifications]
  );

  // Instant in-memory filtering by active tab (0ms latency, zero page reload feeling)
  const filteredNotifications = React.useMemo(() => {
    return notifications.filter((item) => {
      // Tab category filter
      if (filter === "unread" && item.is_read) return false;
      if (filter === "reminders" && item.type !== "reminder" && item.type !== "urgent") return false;
      if (filter === "family" && item.type !== "family") return false;
      return true;
    });
  }, [notifications, filter]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "urgent":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-rose-50 text-rose-700 border border-rose-200/80 inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Payment Urgent
          </span>
        );
      case "reminder":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80 inline-flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            EMI Reminder
          </span>
        );
      case "success":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200/80 inline-flex items-center gap-1">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Payment Recorded
          </span>
        );
      case "family":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-teal-50 text-teal-700 border border-teal-200/80 inline-flex items-center gap-1">
            <Users className="w-2.5 h-2.5" />
            Family Workspace
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-100 text-slate-700 border border-slate-200/80">
            Vault Notice
          </span>
        );
    }
  };

  const handleItemClick = async (item: NotificationItem) => {
    if (!item.is_read) {
      await markAsRead(item.id);
    }
  };

  const handleActionClick = async (e: React.MouseEvent, item: NotificationItem) => {
    e.stopPropagation();
    if (!item.is_read) {
      await markAsRead(item.id);
    }
    if (item.action_url) {
      if (typeof window !== "undefined" && window.location.pathname === item.action_url.split("?")[0]) {
        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
      }
      router.push(item.action_url);
    }
  };

  const handleAcceptInvite = async (e: React.MouseEvent, item: NotificationItem, inviteId: number) => {
    e.stopPropagation();
    setAcceptingInviteId(inviteId);
    try {
      const res = await familyService.acceptInvitationById(inviteId);
      if (!item.is_read) await markAsRead(item.id);
      showToast(res.family_name ? `Welcome to '${res.family_name}'!` : "Invitation accepted! Joined workspace.");

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
        window.dispatchEvent(new CustomEvent("myvello:refresh_notifications"));
      }
      await refreshWorkspaces();
      if (res.family_id) {
        switchWorkspace(res.family_id);
      }
      router.push("/family");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      showToast(errorObj.response?.data?.message || "Failed to accept invitation.");
    } finally {
      setAcceptingInviteId(null);
    }
  };

  const handleDeclineInvite = async (e: React.MouseEvent, item: NotificationItem, inviteId: number) => {
    e.stopPropagation();
    setDecliningInviteId(inviteId);
    try {
      await familyService.declineInvitationById(inviteId);
      await deleteNotification(item.id);
      showToast("Invitation declined.");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      showToast(errorObj.response?.data?.message || "Failed to decline invitation.");
    } finally {
      setDecliningInviteId(null);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await deleteNotification(id);
    showToast("Notification dismissed");
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    showToast("All notifications marked as read");
  };

  const handleConfirmClearRead = async () => {
    setIsClearing(true);
    try {
      await clearRead();
      setIsClearModalOpen(false);
      showToast("Cleared read notifications");
    } catch {
      showToast("Failed to clear read notifications.");
    } finally {
      setIsClearing(false);
    }
  };

  // Cold-load shimmer skeleton: strictly only rendered on initial cold load before data is in memory
  if (isLoading && notifications.length === 0) {
    return (
      <DashboardLayout>
        <NotificationsSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-dvh overflow-x-hidden max-w-[1500px] mx-auto pt-3.5 sm:pt-5 pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 space-y-3.5 sm:space-y-5">
        {/* Floating Modern Toast Feedback - positioned safely above floating mobile capsule nav */}
        {toastMessage && (
          <div className="fixed bottom-[max(5.5rem,calc(4.5rem+env(safe-area-inset-bottom)))] sm:bottom-6 right-4 sm:right-6 z-50 bg-[#0B132B]/95 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200 border border-indigo-500/30 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Page Header with Native 3-dot Action Popover */}
        <div className="flex items-center justify-between gap-3 min-h-[36px]">
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#0B132B] truncate">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-rose-500 text-white shadow-2xs shrink-0">
                {unreadCount} unread
              </span>
            )}
          </div>

          {/* Mobile Only: Quick Actions 3-Dot Dropdown Popover */}
          <div className="sm:hidden relative shrink-0" ref={headerMenuRef}>
            <button
              type="button"
              onClick={() => setIsHeaderMenuOpen((prev) => !prev)}
              aria-label="Notification actions"
              aria-expanded={isHeaderMenuOpen}
              className={cn(
                "w-9 h-9 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation",
                isHeaderMenuOpen && "bg-slate-100 border-indigo-300 ring-2 ring-indigo-500/20"
              )}
            >
              <MoreHorizontal className="w-5 h-5 text-slate-700" />
            </button>

            {/* Dropdown Menu Popover matching Mobile Design */}
            {isHeaderMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                {/* Pointer Tip Arrow */}
                <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 z-10" />

                <div className="relative z-20 space-y-0.5">
                  {/* Mark all as read */}
                  <button
                    type="button"
                    disabled={unreadCount === 0}
                    onClick={() => {
                      setIsHeaderMenuOpen(false);
                      handleMarkAll();
                    }}
                    className={cn(
                      "w-full px-3.5 py-2.5 text-left text-xs font-semibold rounded-xl flex items-center gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation",
                      unreadCount > 0
                        ? "text-slate-800 hover:text-indigo-600 hover:bg-indigo-50/50"
                        : "text-slate-400 opacity-60 cursor-not-allowed"
                    )}
                  >
                    <Check className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Mark all as read</span>
                  </button>

                  {/* Notification settings */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsHeaderMenuOpen(false);
                      setIsPreferencesOpen(true);
                    }}
                    className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-800 hover:text-indigo-600 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                  >
                    <Settings className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>Notification settings</span>
                  </button>

                  {/* Clear read (rendered when read items exist) */}
                  {readCount > 0 && (
                    <>
                      <div className="h-px bg-slate-100 my-1" />
                      <button
                        type="button"
                        onClick={() => {
                          setIsHeaderMenuOpen(false);
                          setIsClearModalOpen(true);
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50/70 rounded-xl flex items-center gap-3 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Clear read ({readCount})</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Only: Classic Action Buttons Row */}
          <div className="hidden sm:flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAll}
                className="h-9 px-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
              >
                <CheckCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mark all read</span>
              </button>
            )}

            {readCount > 0 && (
              <button
                type="button"
                onClick={() => setIsClearModalOpen(true)}
                className="h-9 px-3.5 rounded-xl border border-slate-200/90 hover:border-rose-300 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5 text-slate-500 hover:text-rose-600" />
                <span>Clear read ({readCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsPreferencesOpen(true)}
              title="Notification Preferences"
              className="h-9 px-3.5 rounded-xl border border-slate-200/90 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition-all cursor-pointer inline-flex items-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
            >
              <Settings className="w-3.5 h-3.5 text-slate-500" />
              <span>Preferences</span>
            </button>
          </div>
        </div>

        {/* Unified Notifications Feed Card */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Attached Minimal Toolbar Header (Segmented Filter Pills) */}
          <div className="p-2.5 sm:px-4 sm:py-3 border-b border-slate-100 bg-white">
            {/* Segmented Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth -webkit-overflow-scrolling-touch py-0.5">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95 touch-manipulation",
                  filter === "all"
                    ? "bg-indigo-600 text-white font-bold shadow-2xs"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 font-semibold"
                )}
              >
                <Layers className="w-3 h-3" />
                <span>All</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                    filter === "all"
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-600 border border-slate-200/60"
                  )}
                >
                  {notifications.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilter("unread")}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95 touch-manipulation",
                  filter === "unread"
                    ? "bg-indigo-600 text-white font-bold shadow-2xs"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 font-semibold"
                )}
              >
                <AlertCircle className="w-3 h-3" />
                <span>Unread</span>
                {unreadItemsCount > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                      filter === "unread" ? "bg-white text-indigo-700" : "bg-rose-500 text-white"
                    )}
                  >
                    {unreadItemsCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setFilter("reminders")}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95 touch-manipulation",
                  filter === "reminders"
                    ? "bg-indigo-600 text-white font-bold shadow-2xs"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 font-semibold"
                )}
              >
                <Clock className="w-3 h-3" />
                <span>Reminders</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                    filter === "reminders"
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-600 border border-slate-200/60"
                  )}
                >
                  {remindersCount}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFilter("family")}
                className={cn(
                  "h-8 px-3 rounded-lg text-xs transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap active:scale-95 touch-manipulation",
                  filter === "family"
                    ? "bg-indigo-600 text-white font-bold shadow-2xs"
                    : "bg-slate-100 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 font-semibold"
                )}
              >
                <Users className="w-3 h-3" />
                <span>Family</span>
                <span
                  className={cn(
                    "px-1.5 py-0.2 rounded-full text-[10px] font-bold",
                    filter === "family"
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-600 border border-slate-200/60"
                  )}
                >
                  {familyCount}
                </span>
              </button>
            </div>
          </div>

          {/* Unified Notification Items List (divide-y divide-slate-100) */}
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((item) => {
              const hasEmi = !!item.emi;
              const emiCategory = item.emi?.loan_category || "";
              const emiLender = item.emi?.lender_name || "";

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "p-3.5 sm:p-4.5 transition-colors cursor-pointer flex items-start gap-3 sm:gap-3.5 relative group active:scale-[0.99] touch-manipulation select-none",
                    !item.is_read
                      ? "bg-indigo-50/25 hover:bg-indigo-50/40"
                      : "bg-white hover:bg-slate-50/70"
                  )}
                >
                  {/* Left Category / Type Icon with Corner Bank Badge */}
                  <div className="relative shrink-0">
                    {hasEmi ? (
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/80 shadow-2xs",
                          getCategoryBgClass(emiCategory)
                        )}
                        title={`${emiCategory} (${emiLender})`}
                      >
                        {getCategoryIcon(emiCategory, "w-5 h-5")}
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-2xs",
                          item.type === "urgent"
                            ? "bg-rose-50 border-rose-100 text-rose-600"
                            : item.type === "success"
                            ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                            : item.type === "family"
                            ? "bg-teal-50 border-teal-100 text-teal-600"
                            : item.type === "system"
                            ? "bg-slate-100 border-slate-200 text-slate-700"
                            : "bg-indigo-50 border-indigo-100 text-indigo-600"
                        )}
                      >
                        {item.type === "urgent" && <AlertTriangle className="w-5 h-5" />}
                        {item.type === "success" && <CheckCircle2 className="w-5 h-5" />}
                        {item.type === "family" && <Users className="w-5 h-5" />}
                        {item.type === "system" && <Shield className="w-5 h-5" />}
                        {item.type === "reminder" && <Clock className="w-5 h-5" />}
                      </div>
                    )}

                    {/* Corner Bank Logo Badge if EMI lender is known */}
                    {hasEmi && emiLender && (
                      <div className="absolute -bottom-1 -right-1 p-0.5 bg-white rounded-full shadow-2xs border border-slate-200">
                        <BankLogo bankName={emiLender} size="xs" />
                      </div>
                    )}
                  </div>

                  {/* Center Content */}
                  <div className="flex-1 min-w-0 pr-1">
                    {/* Top Row: Type Badge + Timestamp + Unread Indicator */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {getTypeBadge(item.type)}
                        {!item.is_read && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded-full border border-indigo-200/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                            New
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                        {item.timestamp}
                      </span>
                    </div>

                    {/* EMI Identification Row */}
                    {hasEmi && (
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 mt-1 truncate">
                        <BankLogo bankName={emiLender} size="xs" />
                        <span className="truncate">{item.emi?.loan_name}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400 font-medium capitalize">{emiCategory}</span>
                      </div>
                    )}

                    {/* Title */}
                    <h4 className="text-xs sm:text-sm font-extrabold text-[#0B132B] mt-1 leading-snug">
                      {item.title}
                    </h4>

                    {/* Message */}
                    <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>

                    {/* Dynamic Action Button Row */}
                    {(() => {
                      const inviteIdMatch =
                        item.action_url?.match(/invitation_id=(\d+)/) ||
                        item.trigger_key?.match(/invite_(\d+)/);
                      const inviteId = inviteIdMatch ? Number(inviteIdMatch[1]) : null;
                      const isFamilyInvite =
                        item.type === "family" &&
                        (inviteId !== null ||
                          item.title.toLowerCase().includes("invitation") ||
                          item.message.toLowerCase().includes("invited you"));

                      if (isFamilyInvite && inviteId) {
                        return (
                          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              disabled={acceptingInviteId === inviteId || decliningInviteId === inviteId}
                              onClick={(e) => handleAcceptInvite(e, item, inviteId)}
                              className="h-8 px-3 rounded-lg btn-gradient-glow text-white text-xs font-bold shadow-xs active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
                            >
                              {acceptingInviteId === inviteId ? (
                                <>
                                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                  <span>Joining...</span>
                                </>
                              ) : (
                                <>
                                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                  <span>Accept &amp; Join</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              disabled={acceptingInviteId === inviteId || decliningInviteId === inviteId}
                              onClick={(e) => handleDeclineInvite(e, item, inviteId)}
                              className="h-8 px-3 rounded-lg border border-slate-200 hover:border-rose-200 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer active:scale-95 touch-manipulation inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
                            >
                              {decliningInviteId === inviteId ? (
                                <div className="w-3.5 h-3.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <>
                                  <X className="w-3.5 h-3.5" />
                                  <span>Decline</span>
                                </>
                              )}
                            </button>

                            {!item.is_read && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(item.id);
                                }}
                                className="h-8 px-2.5 inline-flex items-center text-xs text-slate-500 hover:text-indigo-600 font-bold cursor-pointer transition-colors active:scale-95 touch-manipulation"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        );
                      }

                      if (item.action_url && item.action_label) {
                        return (
                          <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={(e) => handleActionClick(e, item)}
                              className="h-8 px-3 rounded-lg btn-gradient-glow text-white text-xs font-bold shadow-xs active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1"
                            >
                              <span>{item.action_label}</span>
                              <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                            </button>

                            {!item.is_read && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(item.id);
                                }}
                                className="h-8 px-2.5 inline-flex items-center text-xs text-slate-500 hover:text-indigo-600 font-bold cursor-pointer transition-colors active:scale-95 touch-manipulation"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>
                        );
                      }

                      if (!item.is_read) {
                        return (
                          <div className="mt-2 flex items-center">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(item.id);
                              }}
                              className="h-7 px-2 inline-flex items-center text-[11px] text-slate-500 hover:text-indigo-600 font-bold cursor-pointer transition-colors active:scale-95 touch-manipulation"
                            >
                              Mark as read
                            </button>
                          </div>
                        );
                      }

                      return null;
                    })()}
                  </div>

                  {/* Quick Dismiss Button */}
                  <button
                    type="button"
                    onClick={(e) => handleDelete(e, item.id)}
                    title="Dismiss alert"
                    className="w-8 h-8 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer active:scale-95 touch-manipulation shrink-0 -mr-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {/* Empty State */}
            {filteredNotifications.length === 0 && (
              <div className="p-8 sm:p-12 text-center text-slate-400 space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600 shadow-2xs">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-[#0B132B]">
                    All caught up!
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                    You have no pending notifications in this category. All loan instalments, due dates, and digital vault activities are in order.
                  </p>
                </div>

                <Link href="/emis">
                  <button
                    type="button"
                    className="h-9 px-4.5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <span>View EMI Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Clearing Read Notifications */}
      <ClearReadConfirmModal
        isOpen={isClearModalOpen}
        count={readCount}
        isClearing={isClearing}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleConfirmClearRead}
      />

      {/* Notification Cadence & Reminder Preferences Modal */}
      <NotificationPreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
        onSaved={(msg) => showToast(msg)}
      />
    </DashboardLayout>
  );
}

export default function NotificationsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <NotificationsSkeleton />
        </DashboardLayout>
      }
    >
      <NotificationsPageContent />
    </Suspense>
  );
}
