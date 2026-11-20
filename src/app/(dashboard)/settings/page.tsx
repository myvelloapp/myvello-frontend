"use client";

import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Download,
  Trash2,
  AlertCircle,
  KeyRound,
  Mail,
  Clock,
  Coins,
  Check,
  Eye,
  EyeOff,
  Camera,
  LogOut,
  ShieldCheck,
  Calendar,
  Upload,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import dynamic from "next/dynamic";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/modules/authentication/AuthContext";
import { profileService, NotificationPreferences } from "@/services/profileService";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import { cn } from "@/lib/utils";
import {
  getAllWorldCurrencies,
  getAllWorldTimezones,
  getDefaultTimezoneForCurrency,
} from "@/lib/currencyTimezoneData";

const AvatarCropModal = dynamic(
  () => import("@/components/common/AvatarCropModal").then((mod) => mod.AvatarCropModal),
  { ssr: false }
);

/* -------------------------------------------------------------------------
   Minimal Themed Skeleton Loader
------------------------------------------------------------------------- */
function SettingsSkeleton() {
  return (
    <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
      <div className="relative z-10 max-w-[1500px] mx-auto space-y-4 sm:space-y-6">
        <div className="space-y-1">
          <div className="h-8 w-48 rounded-xl bg-slate-200/80 animate-pulse" />
          <div className="h-4 w-72 rounded-lg bg-slate-200/60 animate-pulse mt-1" />
        </div>

        <div className="p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs inline-flex items-center gap-1.5">
          <div className="h-9 w-28 rounded-lg bg-slate-200/70 animate-pulse" />
          <div className="h-9 w-28 rounded-lg bg-slate-200/50 animate-pulse" />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 lg:p-8 shadow-xs space-y-7">
          <div className="flex items-center gap-4 sm:gap-5 pb-6 border-b border-slate-100">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200/80 animate-pulse shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-5 w-40 bg-slate-200/80 rounded animate-pulse" />
              <div className="h-3.5 w-56 bg-slate-200/60 rounded animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            <div className="h-11 rounded-xl bg-slate-200/50 animate-pulse" />
            <div className="h-11 rounded-xl bg-slate-200/50 animate-pulse" />
            <div className="h-11 rounded-xl bg-slate-200/50 animate-pulse" />
            <div className="h-11 rounded-xl bg-slate-200/50 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------
   Confirmation Modal for Photo Removal
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
      <div className="bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full overflow-hidden p-6 pt-4 sm:pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 space-y-4">
        <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto sm:hidden" />

        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#02361B]">Remove Profile Photo?</h3>
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
            className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-4 rounded-xl sm:rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 touch-manipulation"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isRemoving}
            className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-5 rounded-xl sm:rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation disabled:opacity-60"
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
  const [activeTab, setActiveTab] = useState<"profile" | "security">("profile");

  // Read tab parameter if provided
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      if (tab === "security") {
        setActiveTab("security");
      } else if (tab === "profile") {
        setActiveTab("profile");
      } else if (tab === "notifications") {
        router.replace("/notifications?preferences=true");
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
  const [hasPassword, setHasPassword] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  // Avatar Crop & Remove Modals State
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isRemoveAvatarModalOpen, setIsRemoveAvatarModalOpen] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [photoLoadError, setPhotoLoadError] = useState(false);

  useEffect(() => {
    setPhotoLoadError(false);
  }, [profilePhoto]);

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

  // Feedback State
  const [feedbackMessage, setFeedbackMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // UI States
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

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

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    const suggestedTz = getDefaultTimezoneForCurrency(newCurrency);
    if (suggestedTz) {
      setTimezone(suggestedTz);
    }
  };

  // Load Profile from Backend API
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
      const newHasPass = Boolean(data.has_password);
      const newPhoto = data.profile_photo || null;
      const newLocked = Boolean(data.is_currency_locked);
      const newCount = data.active_emis_count || 0;

      setName((prev) => (prev !== newName ? newName : prev));
      setEmail((prev) => (prev !== newEmail ? newEmail : prev));
      setCurrency((prev) => (prev !== cur ? cur : prev));
      setTimezone((prev) => (prev !== normalizedTz ? normalizedTz : prev));
      setHasPassword((prev) => (prev !== newHasPass ? newHasPass : prev));
      setProfilePhoto((prev) => (prev !== newPhoto ? newPhoto : prev));
      setIsCurrencyLocked((prev) => (prev !== newLocked ? newLocked : prev));
      setActiveEmisCount((prev) => (prev !== newCount ? newCount : prev));
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

  // Event-driven listeners for background sync
  useEffect(() => {
    const handleSync = () => loadProfile(true);
    window.addEventListener("focus", handleSync);
    window.addEventListener("myvello:live_data_update", handleSync);
    window.addEventListener("myvello:refresh_profile", handleSync);

    return () => {
      window.removeEventListener("focus", handleSync);
      window.removeEventListener("myvello:live_data_update", handleSync);
      window.removeEventListener("myvello:refresh_profile", handleSync);
    };
  }, [loadProfile]);

  // Auto-hide feedback message
  useEffect(() => {
    if (feedbackMessage) {
      const timer = setTimeout(() => setFeedbackMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedbackMessage]);

  // Handle Save Profile
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setFeedbackMessage(null);

    try {
      await profileService.updateProfile({
        name: name.trim(),
        preferred_currency: currency,
        timezone,
      });
      await refreshUser();
      setFeedbackMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setFeedbackMessage({
        text: errorObj.response?.data?.message || "Failed to update profile. Please try again.",
        type: "error",
      });
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
      setFeedbackMessage({ text: "Profile photo updated successfully!", type: "success" });
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setFeedbackMessage({
        text: errorObj.response?.data?.message || "Failed to upload avatar.",
        type: "error",
      });
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
      setFeedbackMessage({ text: "Profile photo removed.", type: "success" });
    } catch {
      setFeedbackMessage({ text: "Failed to remove photo.", type: "error" });
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    if (newPassword !== confirmPassword) {
      setFeedbackMessage({ text: "New passwords do not match.", type: "error" });
      return;
    }

    if (newPassword.length < 8) {
      setFeedbackMessage({ text: "New password must be at least 8 characters long.", type: "error" });
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
      setFeedbackMessage({ text: "Password updated successfully!", type: "success" });
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const errMessage =
        errorObj.response?.data?.errors?.current_password?.[0] ||
        errorObj.response?.data?.message ||
        "Failed to update password. Please check your current password.";
      setFeedbackMessage({ text: errMessage, type: "error" });
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Handle Data Export (Instant Download)
  const handleExportData = async () => {
    setIsExporting(true);
    setFeedbackMessage(null);
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
      setFeedbackMessage({ text: "Vault export downloaded successfully.", type: "success" });
    } catch {
      setFeedbackMessage({ text: "Failed to export data. Please try again.", type: "error" });
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

  if (isLoading && !name && !email) {
    return (
      <DashboardLayout>
        <SettingsSkeleton />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
        <div className="relative z-10 max-w-[1500px] mx-auto space-y-4 sm:space-y-6">
          {/* Page Header */}
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#02361B]">
              Settings
            </h1>
          
          </div>

          {/* Themed Segmented Tab Control */}
          <div className="p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs inline-flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={cn(
                "flex-1 sm:flex-initial min-h-[38px] px-5 py-2 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 touch-manipulation select-none",
                activeTab === "profile"
                  ? "btn-gradient-glow text-white font-bold shadow-xs shadow-emerald-500/25"
                  : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
              )}
            >
              <User className="w-4 h-4" />
              <span>Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={cn(
                "flex-1 sm:flex-initial min-h-[38px] px-5 py-2 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 touch-manipulation select-none",
                activeTab === "security"
                  ? "btn-gradient-glow text-white font-bold shadow-xs shadow-emerald-500/25"
                  : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
              )}
            >
              <Lock className="w-4 h-4" />
              <span>Security</span>
            </button>
          </div>

          {/* Global Feedback Alert Banner */}
          {feedbackMessage && (
            <div
              className={cn(
                "p-3.5 rounded-xl border text-xs font-bold flex items-center gap-2.5 animate-in fade-in duration-200 shadow-2xs",
                feedbackMessage.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                  : "bg-rose-50 text-rose-700 border-rose-200/80"
              )}
            >
              {feedbackMessage.type === "success" ? (
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
          )}

          {/* Tab 1: Profile & Preferences */}
          {activeTab === "profile" && (
            <form
              onSubmit={handleSaveProfile}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 lg:p-8 shadow-xs space-y-7"
            >
              {/* Profile Identity Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4 sm:gap-5">
                  {/* Round Avatar */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0">
                    <div
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="relative group w-full h-full rounded-full overflow-hidden ring-4 ring-emerald-500/20 bg-gradient-to-tr from-[#02361B] to-[#1C9E30] flex items-center justify-center text-white font-black text-2xl sm:text-3xl cursor-pointer shadow-md transition-all hover:ring-emerald-500/40 active:scale-95 touch-manipulation select-none"
                      title="Click to crop and upload profile photo"
                    >
                      {profilePhoto && !photoLoadError ? (
                        <Image
                          src={profilePhoto}
                          alt={name || "Profile"}
                          fill
                          unoptimized
                          sizes="96px"
                          className="object-cover rounded-full"
                          onError={() => setPhotoLoadError(true)}
                        />
                      ) : (
                        <span>{(name || "U").charAt(0).toUpperCase()}</span>
                      )}

                      {/* Hover Camera Overlay */}
                      <div className="absolute inset-0 bg-[#02361B]/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity text-[10px] font-bold gap-1 rounded-full">
                        <Camera className="w-5 h-5 text-emerald-300" />
                        <span>Change</span>
                      </div>
                    </div>

                    {/* Corner Camera Button */}
                    <button
                      type="button"
                      onClick={() => setIsAvatarModalOpen(true)}
                      style={{ position: "absolute", right: -2, bottom: -2, left: "auto" }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full btn-gradient-glow text-white shadow-xs border-2 border-white flex items-center justify-center cursor-pointer hover:scale-110 active:scale-90 transition-all touch-manipulation z-10"
                      title="Change photo"
                      aria-label="Change photo"
                    >
                      <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Identity Info */}
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-[#02361B] text-lg sm:text-xl truncate">
                        {name || "User"}
                      </h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified Account</span>
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-500 truncate flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{email || "user@myvello.life"}</span>
                    </p>
                    {authUser?.created_at && (
                      <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>
                          Member since{" "}
                          {new Date(authUser.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Photo Action Buttons */}

              </div>

              {/* Section 1: Personal Information */}
              <div className="space-y-4">
    

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-emerald-700" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      inputMode="text"
                      autoCapitalize="words"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full h-11 text-xs sm:text-sm font-semibold px-3.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#1C9E30] bg-slate-50/40 hover:bg-white focus:bg-white text-slate-800 placeholder:text-slate-400 transition-all touch-manipulation shadow-2xs"
                    />
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      Your name appears on workspace statements and member lists.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-emerald-700" />
                        Email Address
                      </label>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5" />
                        Primary Identity
                      </span>
                    </div>
                    <input
                      type="email"
                      disabled
                      inputMode="email"
                      value={email}
                      className="w-full h-11 text-xs sm:text-sm font-semibold px-3.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed shadow-2xs"
                    />
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      Email is tied to your account login credentials and cannot be edited.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Regional & Vault Baseline */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
       

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {/* Currency Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Coins className="w-3.5 h-3.5 text-emerald-700" />
                        Preferred Currency
                      </label>
                      {isCurrencyLocked && (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          Locked ({activeEmisCount} Loan{activeEmisCount !== 1 ? "s" : ""})
                        </span>
                      )}
                    </div>

                    {isCurrencyLocked ? (
                      <div className="space-y-2.5">
                        <div
                          className="w-full h-11 px-3.5 rounded-xl bg-slate-50/90 border border-slate-200/90 shadow-2xs flex items-center justify-between text-xs sm:text-sm font-bold text-slate-800 select-none cursor-not-allowed"
                          title="Currency is locked while active loans exist."
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <span className="text-base">{selectedCurrencyInfo?.flag}</span>
                            <span>
                              {selectedCurrencyInfo?.name} — {selectedCurrencyInfo?.code} ({selectedCurrencyInfo?.symbol})
                            </span>
                          </div>
                          <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        </div>

                      </div>
                    ) : (
                      <div>
                        <CustomDropdown
                          size="md"
                          searchable={true}
                          searchPlaceholder="Search 160+ world currencies..."
                          value={currency}
                          onChange={handleCurrencyChange}
                          options={currencyOptions}
                          className="w-full"
                          triggerClassName="rounded-xl h-11 border-slate-200/90 shadow-2xs font-bold text-xs sm:text-sm focus:ring-emerald-500/20 focus:border-[#1C9E30] bg-slate-50/40 hover:bg-white"
                        />
                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                          Select standard ISO baseline currency for all loans.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Timezone Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-emerald-700" />
                        Regional Timezone
                      </label>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                        Auto-Aligned
                      </span>
                    </div>

                    <CustomDropdown
                      size="md"
                      searchable={true}
                      searchPlaceholder="Search 400+ world timezones..."
                      value={timezone}
                      onChange={setTimezone}
                      options={timezoneOptions}
                      className="w-full"
                      triggerClassName="rounded-xl h-11 border-slate-200/90 shadow-2xs font-bold text-xs sm:text-sm focus:ring-emerald-500/20 focus:border-[#1C9E30] bg-slate-50/40 hover:bg-white"
                    />
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      Used to calculate alert times and monthly payment due dates accurately.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Profile updates and baseline preferences sync immediately across your vault.</span>
                </div>

                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full sm:w-auto min-h-[44px] h-11 px-8 rounded-xl btn-gradient-glow text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 touch-manipulation transition-all disabled:opacity-60"
                >
                  {isSavingProfile ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving changes...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Tab 2: Security & Account Actions */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Password Management */}
              <form
                onSubmit={handleChangePassword}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 lg:p-8 shadow-xs space-y-6"
              >
                <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                    <KeyRound className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#02361B]">Password & Authentication</h3>
                    <p className="text-xs text-slate-500">
                      Update your account password. Passwords must be at least 8 characters.
                    </p>
                  </div>
                </div>

                {hasPassword && (
                  <div className="max-w">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-700" />
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
                        className="w-full h-11 text-xs sm:text-sm font-semibold px-3.5 pr-11 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#1C9E30] bg-slate-50/40 hover:bg-white focus:bg-white shadow-2xs touch-manipulation"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="w-11 h-11 absolute right-0 top-0 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 touch-manipulation cursor-pointer"
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
                      >
                        {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-700" />
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
                        placeholder="Minimum 8 characters"
                        className="w-full h-11 text-xs sm:text-sm font-semibold px-3.5 pr-11 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#1C9E30] bg-slate-50/40 hover:bg-white focus:bg-white shadow-2xs touch-manipulation"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="w-11 h-11 absolute right-0 top-0 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 touch-manipulation cursor-pointer"
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      Use letters, numbers, and symbols for high strength.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-emerald-700" />
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
                      className="w-full h-11 text-xs sm:text-sm font-semibold px-3.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#1C9E30] bg-slate-50/40 hover:bg-white focus:bg-white shadow-2xs touch-manipulation"
                    />
                    <p className="text-[11px] text-slate-400 font-medium mt-1">
                      Must match the new password entered on the left.
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="submit"
                    disabled={isSavingPassword}
                    className="w-full sm:w-auto min-h-[44px] h-11 px-8 rounded-xl btn-gradient-glow text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer active:scale-95 touch-manipulation transition-all disabled:opacity-60"
                  >
                    {isSavingPassword ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Updating password...</span>
                      </>
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>

              {/* Vault Portability & Danger Zone in a 2-Column Responsive Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Data Export Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
                      <Download className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-[#02361B] text-sm">Export Vault Data</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Download a complete JSON snapshot containing all your loans, repayment logs, and schedules.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={isExporting}
                    onClick={handleExportData}
                    className="w-full min-h-[42px] h-10 px-4 rounded-xl border border-slate-200/90 hover:border-emerald-500 hover:bg-emerald-50/30 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-95 touch-manipulation disabled:opacity-60"
                  >
                    {isExporting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        <span>Exporting JSON...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 text-emerald-700" />
                        <span>Export Vault Data (JSON)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Danger Zone Card */}
                <div className="bg-white rounded-2xl border border-rose-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-rose-700 text-sm">Delete Account</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Permanently delete your account, personal data, and remove yourself from all shared groups.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDeleteError(null);
                      setDeleteConfirmPassword("");
                      setIsDeleteModalOpen(true);
                    }}
                    className="w-full min-h-[42px] h-10 px-4 rounded-xl border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 text-xs font-bold transition-all cursor-pointer shadow-2xs active:scale-95 touch-manipulation flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4 text-rose-600" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>

              {/* Log Out Bar */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("myvello:open_logout_modal"));
                    }
                  }}
                  className="w-full min-h-[44px] h-11 rounded-xl bg-white hover:bg-rose-50/40 text-rose-600 border border-slate-200/90 hover:border-rose-200 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
                >
                  <LogOut className="w-4 h-4 text-rose-600" />
                  <span>Log Out from All Devices</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden p-6 pt-4 sm:pt-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
            <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto sm:hidden" />

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900">Confirm Account Deletion</h3>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                This action is permanent and will delete your profile and personal commitments.
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
                    className="w-full h-11 sm:h-10 text-xs sm:text-sm px-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white touch-manipulation shadow-2xs"
                  />
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-4 rounded-xl sm:rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDeleting}
                  className="w-full sm:w-auto min-h-[44px] h-11 sm:h-9 px-5 rounded-xl sm:rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-95 touch-manipulation disabled:opacity-60 flex items-center justify-center gap-2"
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
