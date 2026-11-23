"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Bell, Check, AlertCircle, Loader2, Mail, Receipt, Users } from "lucide-react";
import { profileService, NotificationPreferences } from "@/services/profileService";
import { useAuth } from "@/modules/authentication/AuthContext";
import { PushNotificationCard } from "@/components/notifications/PushNotificationCard";
import { cn } from "@/lib/utils";

interface NotificationPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (message: string) => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email_enabled: true,
  rem_7_days: true,
  rem_3_days: true,
  rem_1_day: true,
  rem_due_date: true,
  rem_overdue: true,
  email_receipts: true,
  group_payment_push: true,
};

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [email, setEmail] = useState<string>(user?.email || "");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage(null);

    profileService
      .getProfile()
      .then((data) => {
        if (!isMounted) return;
        if (data.email) setEmail(data.email);
        if (data.notification_preferences) {
          const np = data.notification_preferences as Partial<NotificationPreferences>;
          // Default all cadences to true initially if missing or undefined
          setPreferences({
            email_enabled: np.email_enabled !== undefined ? Boolean(np.email_enabled) : true,
            rem_7_days: np.rem_7_days !== undefined ? Boolean(np.rem_7_days) : true,
            rem_3_days: np.rem_3_days !== undefined ? Boolean(np.rem_3_days) : true,
            rem_1_day: np.rem_1_day !== undefined ? Boolean(np.rem_1_day) : true,
            rem_due_date: np.rem_due_date !== undefined ? Boolean(np.rem_due_date) : true,
            rem_overdue: np.rem_overdue !== undefined ? Boolean(np.rem_overdue) : true,
            email_receipts: np.email_receipts !== undefined ? Boolean(np.email_receipts) : true,
            group_payment_push: np.group_payment_push !== undefined ? Boolean(np.group_payment_push) : true,
          });
        } else {
          // If no preferences record exists, ensure all are filled true initially
          setPreferences(DEFAULT_PREFERENCES);
        }
      })
      .catch((err) => {
        console.warn("Could not load latest preferences:", err);
        // Fallback to default filled state on network error
        setPreferences(DEFAULT_PREFERENCES);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    try {
      await profileService.updateNotifications(preferences);
      onSaved?.("Automated reminder schedule updated successfully!");
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errorObj.response?.data?.message || "Failed to save reminder preferences. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const alertItems = [
    {
      id: "rem_7_days",
      title: "7 days before due date",
      desc: "Early head-up to verify account balance and auto-debit readiness.",
      checked: preferences.rem_7_days,
      onChange: (checked: boolean) => setPreferences((p) => ({ ...p, rem_7_days: checked })),
    },
    {
      id: "rem_3_days",
      title: "3 days before due date",
      desc: "Timely alert before bank clearing cut-off.",
      checked: preferences.rem_3_days,
      onChange: (checked: boolean) => setPreferences((p) => ({ ...p, rem_3_days: checked })),
    },
    {
      id: "rem_1_day",
      title: "1 day before due date",
      desc: "Urgent reminder to ensure funds are available for debit tomorrow.",
      checked: preferences.rem_1_day,
      onChange: (checked: boolean) => setPreferences((p) => ({ ...p, rem_1_day: checked })),
    },
    {
      id: "rem_due_date",
      title: "On the due date (morning alert)",
      desc: "Notification that today is the payment execution date.",
      checked: preferences.rem_due_date,
      onChange: (checked: boolean) => setPreferences((p) => ({ ...p, rem_due_date: checked })),
    },
    {
      id: "rem_overdue",
      title: "1 day after due date if unpaid",
      desc: "Grace period warning to prevent bounce fees and credit score penalties.",
      checked: preferences.rem_overdue,
      onChange: (checked: boolean) => setPreferences((p) => ({ ...p, rem_overdue: checked })),
    },
  ];

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reminder-cadence-title"
    >
      <div className="bg-white rounded-t-[28px] sm:rounded-[20px] shadow-2xl border-t sm:border border-slate-200/90 max-w-lg w-full overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 flex flex-col max-h-[92dvh] sm:max-h-[85vh] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-0">
        {/* Native Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Themed Header Banner matching Signature Modals */}
        <div className="p-4.5 sm:p-5 bg-gradient-to-br from-[#02361B] via-[#014421] to-[#012513] text-white relative overflow-hidden border-b border-emerald-800/40 shrink-0">
          <div className="absolute top-0 right-0 w-44 h-44 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-[#7CE617]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h3
                id="reminder-cadence-title"
                className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2"
              >
                <Bell className="w-4.5 h-4.5 text-emerald-300 stroke-[2.2]" />
                <span>Automated Reminder Cadence</span>
              </h3>
              <p className="text-xs text-emerald-100/80 font-medium">
                Configure when Myvello alerts you about loan repayment deadlines.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95 touch-manipulation"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-700" />
              <span className="text-xs font-semibold">Loading reminder preferences...</span>
            </div>
          ) : (
            <>
              {/* Notification Channels Group */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-0.5">
                  Notification Channels
                </h4>

                <div className="space-y-2">
                  {/* Device Lock-Screen Push Notifications Activation */}
                  <PushNotificationCard compact />

                  {/* Master Email Toggle with Emerald Brand Accents */}
                  <label
                    className={cn(
                      "p-3 sm:p-3.5 rounded-[14px] border transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[52px] select-none active:scale-[0.99] touch-manipulation shadow-2xs",
                      preferences.email_enabled
                        ? "bg-white border-slate-200/90 hover:border-slate-300/80"
                        : "bg-slate-50/60 border-slate-200/70 text-slate-400"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 border transition-colors",
                          preferences.email_enabled
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200/70"
                            : "bg-slate-100 text-slate-400 border-slate-200/80"
                        )}
                      >
                        <Mail className="w-4.5 h-4.5 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                            Email Notifications
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200/80">
                            Inbox
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium block mt-0.5 truncate">
                          Deliver scheduled alerts to {email || "your registered email"}
                        </span>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={preferences.email_enabled}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, email_enabled: e.target.checked }))
                      }
                      className="w-5 h-5 rounded-md text-emerald-700 cursor-pointer accent-[#1C9E30] shrink-0 ml-2"
                    />
                  </label>
                </div>
              </div>

              {/* Payment Receipts & Group Activity */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-0.5">
                  Payment Receipts & Group Activity
                </h4>

                <div className="space-y-2">
                  {/* Email Payment Receipts */}
                  <label
                    className={cn(
                      "p-3 sm:p-3.5 rounded-[14px] border transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[52px] select-none active:scale-[0.99] touch-manipulation shadow-2xs",
                      preferences.email_receipts
                        ? "bg-white border-slate-200/90 hover:border-slate-300/80"
                        : "bg-slate-50/60 border-slate-200/70 text-slate-400"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 border transition-colors",
                          preferences.email_receipts
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200/70"
                            : "bg-slate-100 text-slate-400 border-slate-200/80"
                        )}
                      >
                        <Receipt className="w-4.5 h-4.5 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                            Email Payment Receipts
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                            Records
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium block mt-0.5 truncate">
                          Automated confirmation receipt with transaction reference for tax & bookkeeping
                        </span>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={preferences.email_receipts}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, email_receipts: e.target.checked }))
                      }
                      className="w-5 h-5 rounded-md text-emerald-700 cursor-pointer accent-[#1C9E30] shrink-0 ml-2"
                    />
                  </label>

                  {/* Group Member Payment Alerts */}
                  <label
                    className={cn(
                      "p-3 sm:p-3.5 rounded-[14px] border transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[52px] select-none active:scale-[0.99] touch-manipulation shadow-2xs",
                      preferences.group_payment_push
                        ? "bg-white border-slate-200/90 hover:border-slate-300/80"
                        : "bg-slate-50/60 border-slate-200/70 text-slate-400"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0 border transition-colors",
                          preferences.group_payment_push
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200/70"
                            : "bg-slate-100 text-slate-400 border-slate-200/80"
                        )}
                      >
                        <Users className="w-4.5 h-4.5 stroke-[2.2]" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs sm:text-sm font-bold text-slate-900 block leading-tight">
                            Group Member Payment Alerts
                          </span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200/80">
                            Household
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 font-medium block mt-0.5 truncate">
                          Lock-screen push alerts when other members record payments on shared loans
                        </span>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={preferences.group_payment_push}
                      onChange={(e) =>
                        setPreferences((prev) => ({ ...prev, group_payment_push: e.target.checked }))
                      }
                      className="w-5 h-5 rounded-md text-emerald-700 cursor-pointer accent-[#1C9E30] shrink-0 ml-2"
                    />
                  </label>
                </div>
              </div>

              {/* Granular Due Date Cadence Rules */}
              <div className="space-y-2 pt-1">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-0.5">
                  Instalment Due Date Alerts
                </h4>

                <div className="space-y-2">
                  {alertItems.map((item) => (
                    <label
                      key={item.id}
                      className={cn(
                        "flex items-start justify-between p-3 sm:p-3 rounded-[12px] border transition-all cursor-pointer text-xs min-h-[50px] active:scale-[0.99] touch-manipulation select-none shadow-2xs",
                        item.checked
                          ? "bg-emerald-50/25 border-emerald-300/80 hover:bg-emerald-50/40"
                          : "bg-white border-slate-200/80 hover:bg-slate-50/60 text-slate-400"
                      )}
                    >
                      <div className="pr-3 min-w-0">
                        <span
                          className={cn(
                            "font-bold block text-xs",
                            item.checked ? "text-slate-900" : "text-slate-600"
                          )}
                        >
                          {item.title}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-500 block mt-0.5 font-normal leading-relaxed">
                          {item.desc}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => item.onChange(e.target.checked)}
                        className="w-5 h-5 rounded-md text-emerald-700 mt-0.5 cursor-pointer shrink-0 accent-[#1C9E30] ml-2"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-4 rounded-[10px] border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 touch-manipulation inline-flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-5 rounded-[12px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation transition-all disabled:opacity-60"
            >
              {isSaving ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Update Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
