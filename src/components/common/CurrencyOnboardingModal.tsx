"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useAuth } from "@/modules/authentication/AuthContext";
import { profileService } from "@/services/profileService";
import { CustomDropdown } from "@/components/ui/CustomDropdown";
import {
  getAllWorldCurrencies,
  getAllWorldTimezones,
  getDefaultTimezoneForCurrency,
  formatLocalTime,
  getCurrencyInfo,
  getCurrencySymbol,
  detectGeoPreferences,
  fetchGeoIpPreferences,
  DetectedGeoInfo,
} from "@/lib/currencyTimezoneData";
import { Coins, Clock, ArrowRight, ShieldCheck, MapPin } from "lucide-react";

export function CurrencyOnboardingModal() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();

  const [selectedCurrency, setSelectedCurrency] = useState<string>("INR");
  const [selectedTimezone, setSelectedTimezone] = useState<string>("Asia/Kolkata");
  const [detectedGeo, setDetectedGeo] = useState<DetectedGeoInfo | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-detect geo currency and timezone on mount
  useEffect(() => {
    // If user already had preferences saved, prioritize them
    if (user?.preferred_currency && user.preferred_currency !== "INR") {
      setSelectedCurrency(user.preferred_currency);
      if (user.timezone) setSelectedTimezone(user.timezone);
      return;
    }

    // 1. Instant synchronous browser locale & timezone detection
    const geo = detectGeoPreferences();
    setDetectedGeo(geo);
    setSelectedCurrency(geo.currency);
    setSelectedTimezone(geo.timezone);

    // 2. Asynchronously refine with IP geo-location if available
    fetchGeoIpPreferences().then((ipGeo) => {
      if (ipGeo && ipGeo.currency) {
        setDetectedGeo(ipGeo);
        setSelectedCurrency(ipGeo.currency);
        setSelectedTimezone(ipGeo.timezone);
      }
    });
  }, [user]);

  // Keep live preview clock updated
  useEffect(() => {
    setCurrentTime(formatLocalTime(selectedTimezone));
    const interval = setInterval(() => {
      setCurrentTime(formatLocalTime(selectedTimezone));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedTimezone]);

  // Load all world ISO currencies
  const allCurrencies = useMemo(() => getAllWorldCurrencies(), []);

  const currencyOptions = useMemo(() => {
    return allCurrencies.map((c) => ({
      value: c.code,
      label: `${c.flag} ${c.code} (${c.symbol}) - ${c.name}`,
    }));
  }, [allCurrencies]);

  const currencyInfo = useMemo(() => {
    return getCurrencyInfo(selectedCurrency) || allCurrencies[0];
  }, [allCurrencies, selectedCurrency]);

  // Load world timezones linked to selected currency
  const timezoneOptions = useMemo(() => {
    const tzs = getAllWorldTimezones(selectedCurrency);
    return tzs.map((t) => ({
      value: t.value,
      label: t.label,
      badge: t.badge,
    }));
  }, [selectedCurrency]);

  // Handle currency selection with automatic timezone suggestion
  const handleCurrencyChange = (newCurrency: string) => {
    setSelectedCurrency(newCurrency);
    const suggestedTz = getDefaultTimezoneForCurrency(newCurrency);
    if (suggestedTz) {
      setSelectedTimezone(suggestedTz);
      const friendlyTz = suggestedTz.replace(/_/g, " ");
      setToastMessage(`Timezone auto-aligned to ${friendlyTz} for ${newCurrency}`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await profileService.completeOnboarding({
        preferred_currency: selectedCurrency,
        timezone: selectedTimezone,
      });
      await refreshUser();
      router.push("/emis");
    } catch (err) {
      console.error("Failed to complete onboarding:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only render if user is logged in, email is verified, mounted on client, and has NOT completed onboarding yet
  if (!mounted || !user || user.has_completed_onboarding) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100/90 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Top Header Banner with Brand Emerald Gradient & Aurora Glow */}
        <div className="p-6 bg-gradient-to-br from-[#02361B] via-[#014421] to-[#012513] text-white relative overflow-hidden border-b border-emerald-800/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#7CE617]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-1">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-white">
              Set Up Your Vault Currency
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/85 font-medium leading-relaxed">
              Choose your primary currency and time zone. This baseline powers all loan amortizations,
              monthly summaries, and calendar alerts.
            </p>
          </div>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Toast Notification for Auto-alignment */}
          {toastMessage && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200/80 animate-in fade-in slide-in-from-top-1">
              <Clock className="w-4 h-4 shrink-0 text-emerald-700" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Geo Auto-detection Region Notification */}
          {detectedGeo && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 text-emerald-950 text-xs">
              <MapPin className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div className="leading-snug space-y-0.5">
                <div>
                  <span className="font-extrabold text-[#02361B]">Auto-detected for your location:</span>{" "}
                  <span className="font-bold text-emerald-900">
                    {detectedGeo.country ? `${detectedGeo.country} — ` : ""}{detectedGeo.currency} ({getCurrencySymbol(detectedGeo.currency)}) & {detectedGeo.timezone.replace(/_/g, " ")}.
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Confirm below or freely customize to another standard.
                </p>
              </div>
            </div>
          )}

          {/* Currency Dropdown */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-emerald-700" />
                Preferred Currency (World ISO Currencies)
              </span>
              <span className="text-[10px] text-slate-400 font-semibold">160+ Currencies</span>
            </label>
            <CustomDropdown
              size="md"
              searchable={true}
              searchPlaceholder="Search 160+ world currencies..."
              value={selectedCurrency}
              onChange={handleCurrencyChange}
              options={currencyOptions}
              className="w-full"
              triggerClassName="h-11 rounded-xl border-slate-200/90 hover:border-emerald-300 focus:border-emerald-600 shadow-2xs font-semibold text-xs"
            />
          </div>

          {/* Timezone Dropdown */}
          <div>
            <label className="block text-xs font-extrabold text-slate-800 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-700" />
                Regional Time Zone (Auto-Aligned)
              </span>
              <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                Suggested
              </span>
            </label>
            <CustomDropdown
              size="md"
              searchable={true}
              searchPlaceholder="Search world timezones..."
              value={selectedTimezone}
              onChange={(val) => setSelectedTimezone(val)}
              options={timezoneOptions}
              className="w-full"
              triggerClassName="h-11 rounded-xl border-slate-200/90 hover:border-emerald-300 focus:border-emerald-600 shadow-2xs font-semibold text-xs"
            />
          </div>

          {/* Real-time Preview Pill */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/90 shadow-2xs">
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-2xl select-none">{currencyInfo?.flag}</span>
              <div className="min-w-0">
                <div className="text-xs font-black text-[#02361B] leading-tight">
                  {currencyInfo?.code} ({currencyInfo?.symbol})
                </div>
                <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                  {currencyInfo?.name}
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Local Time
              </div>
              <div className="text-xs font-black text-emerald-700 font-mono mt-0.5">
                {currentTime || "—"}
              </div>
            </div>
          </div>


          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11.5 sm:h-12 px-5 rounded-xl btn-gradient-glow font-extrabold text-xs sm:text-sm text-white shadow-md shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed touch-manipulation"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Configuring Vault Standard...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Vault Preferences</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CurrencyOnboardingModal;
