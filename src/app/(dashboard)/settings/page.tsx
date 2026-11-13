"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Globe,
  Shield,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Mail,
  Clock,
  Coins,
  Check,
  Eye,
  EyeOff,
  Camera,
  Sparkles,
  ArrowRight,
  Smartphone,
  X,
  Users,
  LogOut,
} from "lucide-react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/modules/authentication/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { profileService, NotificationPreferences } from "@/services/profileService";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { cn } from "@/lib/utils";

const AvatarCropModal = dynamic(
  () => import("@/components/common/AvatarCropModal").then((mod) => mod.AvatarCropModal),
  { ssr: false }
);
import {
  getAllWorldCurrencies,
  getAllWorldTimezones,
  getDefaultTimezoneForCurrency,
  formatLocalTime,
  getTimezoneOffset,
} from "@/lib/currencyTimezoneData";

/* -------------------------------------------------------------------------
   High-Fidelity Shimmer Skeleton with Zero Layout Shift (CLS)
------------------------------------------------------------------------- */
function SettingsSkeleton() {
  return (
    <div className="relative -mt-18 pt-20 pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#F0F5FF]/80 to-[#F0F5FF]" />
      </div>

      <div className="relative z-10 max-w-[1500px] mx-auto space-y-4 sm:space-y-6">
        {/* Mobile Skeleton (lg:hidden) */}
        <div className="lg:hidden space-y-4 animate-pulse">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-3.5">
            <div className="w-16 h-16 rounded-2xl bg-slate-200/80 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-32 bg-slate-200/80 rounded" />
              <div className="h-3.5 w-44 bg-slate-200/60 rounded" />
              <div className="h-4 w-24 bg-slate-200/50 rounded-full" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200/80 p-1.5 shadow-2xs flex items-center gap-2 overflow-hidden">
            <div className="h-10 w-28 rounded-xl bg-slate-200/80 shrink-0" />
            <div className="h-10 w-28 rounded-xl bg-slate-200/50 shrink-0" />
            <div className="h-10 w-32 rounded-xl bg-slate-200/50 shrink-0" />
          </div>
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="h-8 w-40 rounded-xl bg-slate-200/60" />
          </div>
        </div>

        {/* Desktop Skeleton (hidden lg:block) */}
        <div className="hidden lg:block space-y-6">
          {/* Title skeleton */}
          <div className="space-y-1">
            <div className="h-8 sm:h-9 w-52 sm:w-64 rounded-xl bg-slate-200/80 animate-pulse" />
          </div>

        {/* Tab control skeleton */}
        <div className="p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs inline-flex items-center gap-1.5 self-start">
          <div className="h-9 sm:h-8 w-36 rounded-lg bg-slate-200/70 animate-pulse" />
          <div className="h-9 sm:h-8 w-36 rounded-lg bg-slate-200/50 animate-pulse" />
        </div>

        {/* Main 2-column layout */}
        <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-6">
          {/* Left Column Skeleton */}
          <div className="flex-1 min-w-0 space-y-5 w-full">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-6">
              {/* Identity Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-200/80 animate-pulse shrink-0" />
                  <div className="space-y-2">
                    <div className="h-5 w-40 bg-slate-200/80 rounded animate-pulse" />
                    <div className="h-3.5 w-52 bg-slate-200/60 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-slate-200/50 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Section 1: Personal Details */}
              <div className="space-y-3">
                <div className="h-4 w-28 bg-slate-200/70 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-20 bg-slate-200/60 rounded animate-pulse" />
                    <div className="h-11 sm:h-10 rounded-xl bg-slate-200/50 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-24 bg-slate-200/60 rounded animate-pulse" />
                    <div className="h-11 sm:h-10 rounded-xl bg-slate-200/50 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Section 2: Regional Preferences */}
              <div className="space-y-3">
                <div className="h-4 w-36 bg-slate-200/70 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-28 bg-slate-200/60 rounded animate-pulse" />
                    <div className="h-11 sm:h-10 rounded-xl bg-slate-200/50 animate-pulse" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-20 bg-slate-200/60 rounded animate-pulse" />
                    <div className="h-11 sm:h-10 rounded-xl bg-slate-200/50 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Submit button skeleton */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <div className="h-11 sm:h-10 w-full sm:w-32 rounded-xl bg-slate-200/70 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Right Column Skeleton */}
          <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 space-y-5">
            {/* Regional Clock & Currency Snapshot Card */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-40 bg-slate-200/70 rounded animate-pulse" />
                <div className="h-4 w-16 bg-slate-200/50 rounded-full animate-pulse" />
              </div>
              <div className="space-y-3 pt-1">
                <div className="p-3.5 rounded-xl bg-slate-100/70 space-y-2">
                  <div className="h-3 w-28 bg-slate-200/60 rounded animate-pulse" />
                  <div className="h-7 w-32 bg-slate-200/80 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-slate-200/50 rounded animate-pulse" />
                </div>
                <div className="p-3 rounded-xl bg-slate-100/50 flex items-center justify-between">
                  <div className="h-4 w-32 bg-slate-200/70 rounded animate-pulse" />
                  <div className="h-4 w-12 bg-slate-200/60 rounded animate-pulse" />
                </div>
              </div>
            </div>

            {/* Third-Party Auth Card Skeleton */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-3.5">
              <div className="h-4 w-44 bg-slate-200/70 rounded animate-pulse" />
              <div className="p-3 rounded-xl bg-slate-100/70 flex items-center justify-between">
                <div className="h-4 w-28 bg-slate-200/70 rounded animate-pulse" />
                <div className="h-4.5 w-16 bg-slate-200/60 rounded-full animate-pulse" />
              </div>
              <div className="h-3 w-5/6 bg-slate-200/50 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

/* -------------------------------------------------------------------------
   Confirmation Modal for Photo Removal (Native Mobile Bottom Sheet Ready)
------------------------------------------------------------------------- */
function RemovePhotoConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isRemoving,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isRemoving: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden p-6 pt-3 sm:pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 space-y-4">
        {/* Mobile Pull Handle */}
        <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto sm:hidden" />

        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900">Remove Profile Photo?</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Your profile picture will be reset to your default initials avatar.
            </p>
          </div>
        </div>

        <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isRemoving}
            className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-4 rounded-xl sm:rounded-[8px] border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 touch-manipulation"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isRemoving}
            className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-5 rounded-xl sm:rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation disabled:opacity-60"
          >
            {isRemoving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Removing...</span>
              </>
            ) : (
              <span>Yes, Remove</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SettingsPageContent() {
  const router = useRouter();
  const { user: authUser, refreshUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");
  const [mobileTab, setMobileTab] = useState<
    "documents" | "install" | "family" | "settings"
  >("documents");

  // Read tab parameter if provided, or redirect legacy ?tab=notifications
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "notifications") {
        router.replace("/notifications?preferences=true");
      } else if (tab === "settings") {
        setMobileTab("settings");
      } else if (tab === "install") {
        setMobileTab("install");
      } else if (tab === "family") {
        setMobileTab("family");
      } else if (tab === "documents") {
        setMobileTab("documents");
      }
    }
  }, [router]);

  // Profile Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [isCurrencyLocked, setIsCurrencyLocked] = useState(false);
  const [activeEmisCount, setActiveEmisCount] = useState(0);
  const [isGoogleLinked, setIsGoogleLinked] = useState(false);
  const [hasPassword, setHasPassword] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email_enabled: true,
    rem_7_days: true,
    rem_3_days: true,
    rem_1_day: true,
    rem_due_date: true,
    rem_overdue: true,
  });

  // Avatar Crop & Remove Modals State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isRemoveAvatarModalOpen, setIsRemoveAvatarModalOpen] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Floating Toast State
  const [toast, setToast] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Live Timezone Clock
  const [liveTime, setLiveTime] = useState("");
  useEffect(() => {
    const update = () => setLiveTime(formatLocalTime(timezone));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  // Load World Currencies Dataset
  const allCurrencies = useMemo(() => getAllWorldCurrencies(), []);

  const currencyOptions = useMemo(() => {
    return allCurrencies.map((c) => ({
      value: c.code,
      label: `${c.flag} ${c.code} (${c.symbol}) - ${c.name}`,
      badge: c.symbol,
    }));
  }, [allCurrencies]);

  // Selected Currency Details
  const selectedCurrencyInfo = useMemo(() => {
    return allCurrencies.find((c) => c.code === currency) || allCurrencies[0];
  }, [allCurrencies, currency]);

  // Load World Timezones Dataset linked to selected currency
  const timezoneOptions = useMemo(() => {
    const tzs = getAllWorldTimezones(currency);
    return tzs.map((t) => ({
      value: t.value,
      label: t.label,
      badge: t.badge,
    }));
  }, [currency]);

  // Handle Currency selection with automatic timezone suggestion
  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    const suggestedTz = getDefaultTimezoneForCurrency(newCurrency);
    if (suggestedTz) {
      setTimezone(suggestedTz);
      const friendlyTz = suggestedTz.replace(/_/g, " ");
      showToast(`Timezone auto-aligned to ${friendlyTz} for ${newCurrency}`, "info");
    }
  };

  // Load Profile from Backend API with Deep-Equality Diffing
  const loadProfile = useCallback(async (isSilent = false) => {
    if (!isSilent && !name && !email) {
      setIsLoading(true);
    }
    try {
      const data = await profileService.getProfile();
      const newName = data.name || "";
      const newEmail = data.email || "";
      const cur = data.preferred_currency || "INR";
      const rawTz = data.timezone || getDefaultTimezoneForCurrency(cur);
      const normalizedTz =
        rawTz === "Asia/Calcutta" ? "Asia/Kolkata" :
        rawTz === "Asia/Katmandu" ? "Asia/Kathmandu" :
        rawTz === "Asia/Saigon" ? "Asia/Ho_Chi_Minh" :
        rawTz;
      const newGoogle = Boolean(data.is_google_linked);
      const newHasPass = Boolean(data.has_password);
      const newPhoto = data.profile_photo || null;
      const newLocked = Boolean(data.is_currency_locked);
      const newCount = data.active_emis_count || 0;

      // Deep equality diffing before state updates to prevent unnecessary DOM re-renders
      setName((prev) => (prev !== newName ? newName : prev));
      setEmail((prev) => (prev !== newEmail ? newEmail : prev));
      setCurrency((prev) => (prev !== cur ? cur : prev));
      setTimezone((prev) => (prev !== normalizedTz ? normalizedTz : prev));
      setIsGoogleLinked((prev) => (prev !== newGoogle ? newGoogle : prev));
      setHasPassword((prev) => (prev !== newHasPass ? newHasPass : prev));
      setProfilePhoto((prev) => (prev !== newPhoto ? newPhoto : prev));
      setIsCurrencyLocked((prev) => (prev !== newLocked ? newLocked : prev));
      setActiveEmisCount((prev) => (prev !== newCount ? newCount : prev));
      if (data.notification_preferences) {
        setNotifications((prev) =>
          JSON.stringify(prev) !== JSON.stringify(data.notification_preferences)
            ? data.notification_preferences!
            : prev
        );
      }
    } catch {
      if (authUser) {
        setName((prev) => (prev !== (authUser.name || "") ? (authUser.name || "") : prev));
        setEmail((prev) => (prev !== (authUser.email || "") ? (authUser.email || "") : prev));
        const cur = authUser.preferred_currency || "INR";
        setCurrency((prev) => (prev !== cur ? cur : prev));
        const rawTz = authUser.timezone || getDefaultTimezoneForCurrency(cur);
        const normalizedTz =
          rawTz === "Asia/Calcutta" ? "Asia/Kolkata" :
          rawTz === "Asia/Katmandu" ? "Asia/Kathmandu" :
          rawTz === "Asia/Saigon" ? "Asia/Ho_Chi_Minh" :
          rawTz;
        setTimezone((prev) => (prev !== normalizedTz ? normalizedTz : prev));
        setIsCurrencyLocked((prev) => (prev !== Boolean(authUser.is_currency_locked) ? Boolean(authUser.is_currency_locked) : prev));
        setActiveEmisCount((prev) => (prev !== (authUser.active_emis_count || 0) ? (authUser.active_emis_count || 0) : prev));
      }
    } finally {
      setIsLoading(false);
    }
  }, [authUser, name, email]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Event-driven listeners for silent background sync (eliminates aggressive polling)
  useEffect(() => {
    const handleFocus = () => {
      loadProfile(true);
    };
    const handleLiveUpdate = () => {
      loadProfile(true);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("myvello:live_data_update", handleLiveUpdate);
    window.addEventListener("myvello:refresh_profile", handleLiveUpdate);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("myvello:live_data_update", handleLiveUpdate);
      window.removeEventListener("myvello:refresh_profile", handleLiveUpdate);
    };
  }, [loadProfile]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);

    try {
      await profileService.updateProfile({
        name: name.trim(),
        preferred_currency: currency,
        timezone,
      });
      await refreshUser();
      showToast("Profile and regional settings saved successfully!", "success");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      showToast(
        errorObj.response?.data?.message || "Failed to update profile. Please try again.",
        "error"
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Handle Avatar Cropped & Saved
  const handleSaveAvatar = async (croppedDataUrl: string) => {
    try {
      const newPhotoUrl = await profileService.uploadAvatar(croppedDataUrl);
      setProfilePhoto(newPhotoUrl);
      await refreshUser();
      showToast("Profile photo centered, cropped, and updated successfully!", "success");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      showToast(errorObj.response?.data?.message || "Failed to upload avatar.", "error");
    }
  };

  // Handle Remove Avatar
  const handleConfirmRemoveAvatar = async () => {
    setIsRemovingAvatar(true);
    try {
      await profileService.deleteAvatar();
      setProfilePhoto(null);
      await refreshUser();
      setIsRemoveAvatarModalOpen(false);
      setIsAvatarModalOpen(false);
      showToast("Profile photo removed.", "success");
    } catch {
      showToast("Failed to remove photo.", "error");
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match. Please re-enter.", "error");
      return;
    }

    if (newPassword.length < 8) {
      showToast("New password must be at least 8 characters long.", "error");
      return;
    }

    setIsSavingPassword(true);
    try {
      await profileService.updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      showToast("Your account password has been updated securely.", "success");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const errMessage =
        errorObj.response?.data?.errors?.current_password?.[0] ||
        errorObj.response?.data?.message ||
        "Failed to update password. Please check your current password.";
      showToast(errMessage, "error");
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Handle Data Export (Instant Download)
  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const blob = await profileService.exportData();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `myvello_vault_export_${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showToast("Confidential vault export downloaded successfully.", "success");
    } catch {
      showToast("Failed to export data. Please try again.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Account Deletion
  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await profileService.deleteAccount(deleteConfirmPassword);
      setIsDeleteModalOpen(false);
      await logout();
      router.push("/register");
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setDeleteError(errorObj.response?.data?.message || "Incorrect password. Could not delete account.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Cold-Load Shimmer Skeleton strictly on cold mount before profile data exists
  if (isLoading && !name && !email) {
    return (
      <DashboardLayout>
        <SettingsSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Living Aurora Gradient Backdrop matching /emis and /emis/[id] */}
      <div className="relative pt-3.5 sm:pt-5 pb-[max(6.5rem,calc(5.5rem+env(safe-area-inset-bottom)))] lg:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
        {/* Pure CSS Brand Gradient Backdrop */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#F0F5FF]/80 to-[#F0F5FF]" />
        </div>

        {/* Content Container (Standard 1500px Max-Width matching all core views) */}
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-3.5 sm:space-y-5">
          {/* Desktop View (hidden lg:block space-y-6) */}
          <div className="hidden lg:block space-y-6">
            {/* Header Title & Subtitle */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#0B132B]">
                Account Settings
              </h1>
            </div>

          {/* Themed Segmented Tab Control matching /emis */}
          <div className="w-full sm:w-auto overflow-x-auto no-scrollbar scroll-smooth -mx-1 px-1">
            <div className="p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs inline-flex items-center gap-1.5 min-w-max">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={cn(
                  "min-h-[42px] sm:min-h-[36px] px-4 py-2 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95 touch-manipulation select-none",
                  activeTab === "profile"
                    ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                )}
              >
                <User className="w-4 h-4" />
                <span>Profile & Regional</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={cn(
                  "min-h-[42px] sm:min-h-[36px] px-4 py-2 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 active:scale-95 touch-manipulation select-none",
                  activeTab === "security"
                    ? "btn-gradient-glow text-white font-bold shadow-xs shadow-indigo-500/25"
                    : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                )}
              >
                <Lock className="w-4 h-4" />
                <span>Security & Vault</span>
              </button>
            </div>
          </div>

          {/* Unified Two-Column Main Layout matching /emis */}
          <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-6">
            {/* Left Column: Active Tab Main Content */}
            <div className="flex-1 min-w-0 space-y-5 w-full">
              {/* TAB 1: Profile & Regional Preferences */}
              {activeTab === "profile" && (
                <form
                  onSubmit={handleSaveProfile}
                  className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-7 shadow-xs space-y-6"
                >
                  {/* User Identity Header with Avatar Cropper Trigger */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      {/* Clickable Avatar Circle with Camera Overlay & Corner Badge */}
                      <div className="relative shrink-0">
                        <div
                          onClick={() => setIsAvatarModalOpen(true)}
                          className="relative group w-20 h-20 rounded-2xl overflow-hidden ring-4 ring-indigo-500/15 bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white font-black text-2xl sm:text-3xl cursor-pointer shadow-md transition-all hover:ring-indigo-500/30 active:scale-95 touch-manipulation"
                          title="Click to crop and upload profile photo"
                        >
                          {profilePhoto ? (
                            <Image
                              src={profilePhoto}
                              alt={name || "Profile"}
                              fill
                              unoptimized
                              sizes="80px"
                              className="object-cover"
                            />
                          ) : (
                            <span>{(name || "U").charAt(0).toUpperCase()}</span>
                          )}

                          {/* Hover Camera Overlay */}
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-bold gap-1">
                            <Camera className="w-5 h-5 text-indigo-300" />
                            <span>Crop Photo</span>
                          </div>
                        </div>

                        {/* Corner Camera Badge with min 44x44px touch area */}
                        <button
                          type="button"
                          onClick={() => setIsAvatarModalOpen(true)}
                          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-indigo-600 shadow-md border border-slate-200/90 flex items-center justify-center cursor-pointer hover:scale-110 hover:bg-indigo-50 transition-all active:scale-90 touch-manipulation"
                          title="Change photo"
                          aria-label="Change photo"
                        >
                          <Camera className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <h3 className="font-black text-slate-900 text-base sm:text-lg">{name || "Myvello User"}</h3>
                        <p className="text-xs font-medium text-slate-400 break-all">{email || "user@myvello.life"}</p>
                        <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active Account
                          </span>
                          {isGoogleLinked && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200/70">
                              Google Connected
                            </span>
                          )}
                          {profilePhoto && (
                            <button
                              type="button"
                              onClick={() => setIsRemoveAvatarModalOpen(true)}
                              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200/70 hover:bg-rose-100 transition-colors inline-flex items-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                            >
                              <Trash2 className="w-2.5 h-2.5" />
                              <span>Remove Photo</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Personal Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Personal Details
                    </h4>

                    {/* Inputs: Full Name & Email Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          inputMode="text"
                          autoCapitalize="words"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter full name"
                          className="w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm font-semibold px-3.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 bg-white text-slate-800 placeholder:text-slate-400 transition-all touch-manipulation shadow-2xs"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          Email Address
                        </label>
                        <input
                          type="email"
                          disabled
                          inputMode="email"
                          value={email}
                          className="w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm font-semibold px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed shadow-2xs"
                        />
                        <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                          Primary identifier. Contact support to transfer email ownership.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Regional Preferences */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Regional Preferences
                    </h4>

                    {/* Inputs: Currency & Timezone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-slate-400" />
                            Preferred Currency
                          </label>
                          {isCurrencyLocked && (
                            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              Locked ({activeEmisCount} Loan{activeEmisCount !== 1 ? "s" : ""})
                            </span>
                          )}
                        </div>

                        {isCurrencyLocked ? (
                          <>
                            <div
                              className="w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] px-3.5 rounded-xl bg-slate-50 border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 select-none cursor-not-allowed"
                              title="Currency is locked because you have active loans in your vault."
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-sm">{selectedCurrencyInfo?.flag}</span>
                                <span>{selectedCurrencyInfo?.code} ({selectedCurrencyInfo?.symbol})</span>
                                <span className="text-[11px] sm:text-xs text-slate-400 font-normal truncate hidden sm:inline">
                                  — {selectedCurrencyInfo?.name}
                                </span>
                              </div>
                              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            </div>
                            <span className="text-[10px] font-medium text-amber-700/90 mt-1 flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                              Locked while active loans exist in vault
                            </span>
                          </>
                        ) : (
                          <CustomDropdown
                            size="md"
                            searchable={true}
                            searchPlaceholder="Search 160+ world currencies..."
                            value={currency}
                            onChange={handleCurrencyChange}
                            options={currencyOptions}
                            className="w-full"
                            triggerClassName="rounded-xl h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] border-slate-200/90 shadow-2xs font-bold text-xs sm:text-sm"
                          />
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          Timezone
                        </label>
                        <CustomDropdown
                          size="md"
                          searchable={true}
                          searchPlaceholder="Search 400+ world timezones..."
                          value={timezone}
                          onChange={setTimezone}
                          options={timezoneOptions}
                          className="w-full"
                          triggerClassName="rounded-xl h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] border-slate-200/90 shadow-2xs font-bold text-xs sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={isSavingProfile}
                      className="w-full sm:w-auto min-h-[44px] h-11 sm:h-10 px-7 rounded-xl btn-gradient-glow text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 touch-manipulation transition-all disabled:opacity-60"
                    >
                      {isSavingProfile ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Security & Vault */}
              {activeTab === "security" && (
                <div className="space-y-5">
                  {/* Password Management */}
                  <form
                    onSubmit={handleChangePassword}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-7 shadow-xs space-y-5"
                  >
                    <div className="border-b border-slate-100 pb-4">
                      <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-indigo-600" />
                        <span>Password & Security</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Update your master account password. Passwords must be at least 8 characters long.
                      </p>
                    </div>

                    {hasPassword && (
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          Current Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? "text" : "password"}
                            required
                            autoCapitalize="none"
                            autoCorrect="off"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm font-semibold px-3.5 pr-11 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 bg-white shadow-2xs touch-manipulation"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="w-11 h-11 min-w-[44px] min-h-[44px] absolute right-0 top-0 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 touch-manipulation cursor-pointer"
                            aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                          >
                            {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? "text" : "password"}
                            required
                            autoCapitalize="none"
                            autoCorrect="off"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min 8 characters"
                            className="w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm font-semibold px-3.5 pr-11 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 bg-white shadow-2xs touch-manipulation"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="w-11 h-11 min-w-[44px] min-h-[44px] absolute right-0 top-0 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 touch-manipulation cursor-pointer"
                            aria-label={showNewPassword ? "Hide password" : "Show password"}
                          >
                            {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          required
                          autoCapitalize="none"
                          autoCorrect="off"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm font-semibold px-3.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 bg-white shadow-2xs touch-manipulation"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="w-full sm:w-auto min-h-[44px] h-11 sm:h-10 px-7 rounded-xl btn-gradient-glow text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 touch-manipulation transition-all disabled:opacity-60"
                      >
                        {isSavingPassword ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : (
                          <span>Update Password</span>
                        )}
                      </button>
                    </div>
                  </form>

                  {/* Vault Data Portability Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-7 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-slate-900">
                      <Download className="w-4 h-4 text-indigo-600" />
                      <h3 className="text-base font-black text-slate-900">Vault Data Portability</h3>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div>
                        <span className="font-bold text-slate-800 block text-xs sm:text-sm">Export Vault Records</span>
                        <span className="text-[11px] sm:text-xs text-slate-500 leading-relaxed block mt-0.5 max-w-md">
                          Export an immutable, structured JSON backup of all your personal loan amortizations, schedules, and payment ledger receipts.
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isExporting}
                        onClick={handleExportData}
                        className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-5 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-slate-50 text-indigo-600 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95 touch-manipulation disabled:opacity-60 shrink-0"
                      >
                        {isExporting ? (
                          <>
                            <span className="w-3.5 h-3.5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                            <span>Exporting...</span>
                          </>
                        ) : (
                          <>
                            <Download className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Export Data (JSON)</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone: Account Deletion */}
                  <div className="bg-white rounded-2xl border border-rose-200/80 p-4 sm:p-7 shadow-xs space-y-4">
                    <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                      <Trash2 className="w-4 h-4 text-rose-600" />
                      <span>Danger Zone: Account Deletion</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      Permanently delete your personal Myvello account and records. If you are the owner of family workspaces, please transfer ownership before proceeding.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteError(null);
                        setDeleteConfirmPassword("");
                        setIsDeleteModalOpen(true);
                      }}
                      className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-5 rounded-xl border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 text-xs sm:text-sm font-bold transition-all cursor-pointer shadow-2xs active:scale-95 touch-manipulation flex items-center justify-center gap-2"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Account Status, Regional Clock & Quick Export */}
            <div className="w-full lg:w-[350px] xl:w-[380px] shrink-0 space-y-5">
              {/* Regional Clock & Currency Snapshot Card */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#0B132B]">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <h3 className="text-sm font-black tracking-tight text-[#0B132B]">
                      Regional Time & Currency
                    </h3>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    Live Clock
                  </span>
                </div>

                <div className="space-y-3 pt-1">
                  {/* Live Clock Display */}
                  <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                      Local Time ({timezone.replace(/_/g, " ")})
                    </span>
                    <div className="text-xl sm:text-2xl font-black text-[#0B132B] tracking-tight">
                      {liveTime || "Loading..."}
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 mt-0.5 block">
                      Offset: {getTimezoneOffset(timezone)}
                    </span>
                  </div>

                  {/* Currency Summary */}
                  <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/40 border border-indigo-100/70">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base shrink-0">{selectedCurrencyInfo.flag}</span>
                      <div className="min-w-0">
                        <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight truncate">
                          {selectedCurrencyInfo.code} ({selectedCurrencyInfo.symbol})
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block truncate">
                          {selectedCurrencyInfo.name}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-100 shrink-0 ml-2">
                      Primary
                    </span>
                  </div>
                </div>
              </div>

              {/* Third-Party Authentication Card */}
              <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.06)] border border-slate-100 space-y-3.5">
                <div className="flex items-center gap-2 text-[#0B132B]">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-sm font-black tracking-tight text-[#0B132B]">
                    Third-Party Authentication
                  </h3>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center shadow-2xs shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                    </div>
                    <div>
                      <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight">
                        Google Account
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium block">
                        1-Click Sign In
                      </span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                      isGoogleLinked
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    )}
                  >
                    {isGoogleLinked ? "Linked" : "Not Linked"}
                  </span>
                </div>

                <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed font-normal">
                  {isGoogleLinked
                    ? "Your Google identity is securely connected for one-click authentication."
                    : "Not currently linked. You can sign in using your email and password."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View: Dedicated Profile & Account Hub (lg:hidden) */}
        <div className="lg:hidden space-y-4">
          {/* 1. User Profile Card (Matching screenshot media_1794579448055_d55bcc07.png) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              {/* Clickable Avatar Circle with Camera Overlay */}
              <div className="relative shrink-0">
                <div
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="relative group w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-indigo-500/15 bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white font-black text-xl cursor-pointer shadow-md active:scale-95 transition-all"
                  title="Click to edit profile photo"
                >
                  {profilePhoto ? (
                    <Image
                      src={profilePhoto}
                      alt={name || "Profile"}
                      fill
                      unoptimized
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <span>{(name || "U").charAt(0).toUpperCase()}</span>
                  )}
                  <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs ring-2 ring-white active:scale-90 transition-transform cursor-pointer"
                  aria-label="Change photo"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              {/* User Identity Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-black text-slate-900 truncate">
                    {name || "User"}
                  </h2>
                </div>
                <p className="text-xs font-medium text-slate-500 truncate mt-0.5">
                  {email || authUser?.email}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100/80">
                    <Shield className="w-2.5 h-2.5 text-indigo-600" />
                    <span>Personal Vault</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Horizontal Scrollable Tabs Card (Matching screenshot media_1794579448055_d55bcc07.png) */}
          <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap">
              {/* Documents Tab */}
              <button
                type="button"
                onClick={() => setMobileTab("documents")}
                className={cn(
                  "min-h-[42px] px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation select-none",
                  mobileTab === "documents"
                    ? "bg-[#6366F1] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
                )}
              >
                Documents
              </button>

              {/* Install App Tab */}
              {/* <button
                type="button"
                onClick={() => setMobileTab("install")}
                className={cn(
                  "min-h-[42px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation select-none",
                  mobileTab === "install"
                    ? "bg-[#6366F1] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
                )}
              >
                Install App
              </button> */}

              {/* Family Members Tab */}
              {/* <button
                type="button"
                onClick={() => setMobileTab("family")}
                className={cn(
                  "min-h-[42px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation select-none",
                  mobileTab === "family"
                    ? "bg-[#6366F1] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
                )}
              >
                Family Members
              </button> */}

              {/* Settings Tab */}
              <button
                type="button"
                onClick={() => setMobileTab("settings")}
                className={cn(
                  "min-h-[42px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer shrink-0 active:scale-95 touch-manipulation select-none",
                  mobileTab === "settings"
                    ? "bg-[#6366F1] text-white shadow-xs"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/70"
                )}
              >
                Settings
              </button>

              {/* Log Out Action */}
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new CustomEvent("myvello:open_logout_modal"));
                  }
                }}
                className="min-h-[42px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-red-600 hover:bg-red-50 hover:text-red-700 active:scale-95 transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ml-auto"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* 3. Tab Contents Area */}
          {/* TAB 1: Documents (Matches media_1794579448055_d55bcc07.png) */}
          {mobileTab === "documents" && (
            <div className="min-h-[340px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-200">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Coming Soon
              </h2>
            </div>
          )}

          {/* TAB 2: Install App */}
          {mobileTab === "install" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Install Myvello App</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Fast home-screen access with offline-resilient finance tracking.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>PWA Highlights</span>
                </div>
                <ul className="space-y-1.5 text-[11px] text-slate-500 pl-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Fullscreen standalone experience without browser bars</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Biometric login and persistent local vault encryption</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Instant payment history lookup anytime, even offline</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/install"
                className="w-full min-h-[44px] h-11 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Open Installation Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* TAB 3: Family Members */}
          {mobileTab === "family" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
                  <Users className="w-6 h-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-black text-slate-900">Family Workspace</h3>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    Manage shared loans & household commitments together.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100/70 text-xs text-indigo-900 space-y-1">
                <span className="font-bold block">Collaborative Financial Tracking</span>
                <p className="text-[11px] text-indigo-700/80 leading-relaxed">
                  Invite family members to share EMI visibility, split monthly obligations, and record payment proofs.
                </p>
              </div>

              <Link
                href="/family"
                className="w-full min-h-[44px] h-11 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Go to Family Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* TAB 4: Settings */}
          {mobileTab === "settings" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Mobile Segmented Tab Controls */}
              <div className="p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={cn(
                    "min-h-[40px] px-3 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation select-none font-bold",
                    activeTab === "profile"
                      ? "btn-gradient-glow text-white shadow-xs shadow-indigo-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  )}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("security")}
                  className={cn(
                    "min-h-[40px] px-3 py-2 rounded-lg text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation select-none font-bold",
                    activeTab === "security"
                      ? "btn-gradient-glow text-white shadow-xs shadow-indigo-500/25"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  )}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Security</span>
                </button>
              </div>

              {/* Mobile Active Form Container */}
              <div className="space-y-4">
                {activeTab === "profile" ? (
                  <form
                    onSubmit={handleSaveProfile}
                    className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-5"
                  >
                    {/* Personal Details */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Personal Details
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-slate-400" />
                            Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            inputMode="text"
                            autoCapitalize="words"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter full name"
                            className="w-full h-11 min-h-[44px] text-xs font-semibold px-3.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 bg-white text-slate-800 placeholder:text-slate-400 transition-all touch-manipulation shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            Email Address
                          </label>
                          <input
                            type="email"
                            disabled
                            inputMode="email"
                            value={email}
                            className="w-full h-11 min-h-[44px] text-xs font-semibold px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed shadow-2xs"
                          />
                          <span className="text-[10px] font-medium text-slate-400 mt-1 block">
                            Primary identifier. Contact support to transfer email ownership.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Regional Preferences */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Regional Preferences
                      </h4>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Coins className="w-3.5 h-3.5 text-slate-400" />
                              Preferred Currency
                            </span>
                            {isCurrencyLocked && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                                Locked ({activeEmisCount} EMIs)
                              </span>
                            )}
                          </label>
                          {isCurrencyLocked ? (
                            <div className="h-11 min-h-[44px] px-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-600 shadow-2xs">
                              <span>{currencyOptions.find((c) => c.value === currency)?.label || currency}</span>
                              <Lock className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                          ) : (
                            <CustomDropdown
                              options={currencyOptions}
                              value={currency}
                              onChange={handleCurrencyChange}
                              placeholder="Select currency"
                              size="md"
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              System Timezone
                            </span>
                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                              {liveTime || "Live"}
                            </span>
                          </label>
                          <CustomDropdown
                            options={timezoneOptions}
                            value={timezone}
                            onChange={setTimezone}
                            placeholder="Select timezone"
                            size="md"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <div className="pt-3 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="w-full min-h-[44px] h-11 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 touch-manipulation transition-all disabled:opacity-60"
                      >
                        {isSavingProfile ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <span>Save Changes</span>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    {/* Password Change Form */}
                    <form
                      onSubmit={handleChangePassword}
                      className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-4"
                    >
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                        Change Password
                      </h4>

                      <div className="space-y-3">
                        {hasPassword && (
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                              Current Password *
                            </label>
                            <div className="relative">
                              <input
                                type={showCurrentPassword ? "text" : "password"}
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full h-11 min-h-[44px] text-xs font-semibold px-3.5 pr-10 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 bg-white text-slate-800 placeholder:text-slate-400 shadow-2xs"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                              >
                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            New Password *
                          </label>
                          <div className="relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Min. 8 characters"
                              className="w-full h-11 min-h-[44px] text-xs font-semibold px-3.5 pr-10 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 bg-white text-slate-800 placeholder:text-slate-400 shadow-2xs"
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                              {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Confirm New Password *
                          </label>
                          <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full h-11 min-h-[44px] text-xs font-semibold px-3.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-indigo-500/15 focus:border-indigo-500 bg-white text-slate-800 placeholder:text-slate-400 shadow-2xs"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSavingPassword}
                        className="w-full min-h-[44px] h-11 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all disabled:opacity-60"
                      >
                        {isSavingPassword ? "Updating..." : "Update Password"}
                      </button>
                    </form>

                    {/* Export Vault Card */}
                    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Data Export
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Export confidential JSON snapshot of your active EMIs and payments.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleExportData}
                        disabled={isExporting}
                        className="w-full min-h-[44px] h-11 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                      >
                        <Download className="w-4 h-4 text-slate-500" />
                        <span>{isExporting ? "Exporting Vault..." : "Export All My Data (JSON)"}</span>
                      </button>
                    </div>

                    {/* Delete Account Card */}
                    <div className="bg-white rounded-2xl border border-rose-200/80 p-4 shadow-xs space-y-3">
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider text-rose-600">
                          Danger Zone
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1">
                          Permanently delete your user account and all personal commitments.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setDeleteError(null);
                          setDeleteConfirmPassword("");
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full min-h-[44px] h-11 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                      >
                        <Trash2 className="w-4 h-4 text-rose-600" />
                        <span>Delete My Account</span>
                      </button>
                    </div>

                    {/* Quick Log Out Row */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (typeof window !== "undefined") {
                            window.dispatchEvent(new CustomEvent("myvello:open_logout_modal"));
                          }
                        }}
                        className="w-full min-h-[44px] h-11 rounded-xl bg-red-50/70 hover:bg-red-100 text-red-600 border border-red-200/80 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>Log Out of Myvello</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Delete Account Confirmation Dialog (Native Mobile Bottom Sheet Ready) */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 pt-3 sm:pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            {/* Mobile Pull Handle */}
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto sm:hidden" />

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Confirm Account Deletion</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                This action is permanent and will soft-delete your profile, active sessions, and personal EMI schedules.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{deleteError}</span>
              </div>
            )}

            <form onSubmit={handleDeleteAccount} className="space-y-4 pt-2">
              {hasPassword && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Enter Password to Confirm
                  </label>
                  <input
                    type="password"
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={deleteConfirmPassword}
                    onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                    placeholder="Your account password"
                    className="w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white touch-manipulation shadow-2xs"
                  />
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-4 rounded-xl sm:rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-5 rounded-xl sm:rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95 touch-manipulation disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Avatar Cropper Modal */}
      <AvatarCropModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onCropCompleteSave={handleSaveAvatar}
        onRemoveAvatar={profilePhoto ? () => setIsRemoveAvatarModalOpen(true) : undefined}
        currentAvatarUrl={profilePhoto}
        userName={name}
      />

      {/* In-App Remove Avatar Confirmation Modal */}
      <RemovePhotoConfirmModal
        isOpen={isRemoveAvatarModalOpen}
        onClose={() => setIsRemoveAvatarModalOpen(false)}
        onConfirm={handleConfirmRemoveAvatar}
        isRemoving={isRemovingAvatar}
      />

      {/* Floating Modern Toast Notification */}
      {toast && (
        <div
          className={cn(
            "fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom))] sm:bottom-6 right-4 sm:right-6 left-4 sm:left-auto z-50 flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl border transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 max-w-md",
            toast.type === "success" && "bg-[#0B132B]/95 text-white border-slate-700/60 backdrop-blur-md shadow-indigo-500/10",
            toast.type === "error" && "bg-rose-950/95 text-white border-rose-800 backdrop-blur-md shadow-rose-500/10",
            toast.type === "info" && "bg-[#0B132B]/95 text-white border-indigo-500/50 backdrop-blur-md shadow-indigo-500/10"
          )}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {toast.type === "success" && (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
            {toast.type === "error" && (
              <div className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
                <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
            {toast.type === "info" && (
              <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            )}
            <span className="text-xs sm:text-sm font-semibold text-slate-100 truncate">{toast.message}</span>
          </div>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors shrink-0 cursor-pointer active:scale-95 touch-manipulation"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function SettingsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <SettingsSkeleton />
        </DashboardLayout>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}
