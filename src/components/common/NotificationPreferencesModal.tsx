"use client";

import React, { useState, useEffect } from "react";
import { X, Bell, Check, AlertCircle, Loader2 } from "lucide-react";
import { profileService, NotificationPreferences } from "@/services/profileService";
import { useAuth } from "@/modules/authentication/AuthContext";
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
};

export const NotificationPreferencesModal: React.FC<NotificationPreferencesModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [email, setEmail] = useState<string>(user?.email || "");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          setPreferences(data.notification_preferences);
        }
      })
      .catch((err) => {
        console.warn("Could not load latest preferences:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-t-[28px] sm:rounded-[20px] shadow-2xl border-t sm:border border-slate-200/90 max-w-lg w-full overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 flex flex-col max-h-[92dvh] sm:max-h-[85vh] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-0">
        {/* Native Mobile Drag Handle */}
        <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-slate-300" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-theme-gradient text-white flex items-center justify-center font-bold shadow-2xs shadow-indigo-500/20 shrink-0">
              <Bell className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 leading-tight">
                Automated Notification Cadence
              </h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Configure when Myvello alerts you about loan repayment deadlines.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer active:scale-95 touch-manipulation"
          >
            <X className="w-4 h-4" />
          </button>
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
              <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              <span className="text-xs font-semibold">Loading reminder preferences...</span>
            </div>
          ) : (
            <>
              {/* Master Email Toggle */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between min-h-[52px]">
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Email Reminders</span>
                  <span className="text-[11px] text-slate-600 font-medium block mt-0.5">
                    Deliver scheduled alerts to {email || "your registered email"}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email_enabled}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, email_enabled: e.target.checked }))
                  }
                  className="w-5 h-5 rounded text-indigo-600 cursor-pointer accent-indigo-600 shrink-0 ml-3"
                />
              </div>

              {/* Granular Due Date Cadence Rules */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-0.5">
                  Instalment Due Date Alerts
                </h4>

                <div className="space-y-2">
                  {alertItems.map((item) => (
                    <label
                      key={item.id}
                      className={cn(
                        "flex items-start justify-between p-3.5 sm:p-3 rounded-xl border transition-all cursor-pointer text-xs min-h-[52px] active:scale-[0.99] touch-manipulation",
                        item.checked
                          ? "bg-slate-50/60 border-indigo-200/80 hover:bg-slate-50"
                          : "bg-white border-slate-100 hover:bg-slate-50/60 text-slate-400"
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
                        <span className="text-[10px] text-slate-500 block mt-0.5 font-normal leading-relaxed">
                          {item.desc}
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => item.onChange(e.target.checked)}
                        className="w-5 h-5 rounded text-indigo-600 mt-0.5 cursor-pointer shrink-0 accent-indigo-600 ml-2"
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
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-4 rounded-xl sm:rounded-[8px] border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer disabled:opacity-50 active:scale-95 touch-manipulation inline-flex items-center justify-center"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoading}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-5 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 touch-manipulation transition-all disabled:opacity-60"
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
    </div>
  );
};
