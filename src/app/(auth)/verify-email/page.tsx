"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  ShieldCheck,
  LogOut,
  KeyRound,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/modules/authentication/AuthContext";
import { authService } from "@/services/authService";
import { BrandLogo } from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, logout, refreshUser } = useAuth();

  // 6-digit OTP input states
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);

  const displayEmail = user?.email || "your registered email";

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const verifyOtpCode = useCallback(async (code: string) => {
    if (code.length !== 6) {
      setErrorMessage("Please enter all 6 digits of your verification code.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      await authService.verifyOtp(code, user?.email);
      await refreshUser();
      setIsVerified(true);
      setTimeout(() => {
        router.push("/emis");
      }, 1200);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errorObj.response?.data?.message ||
          "Invalid or expired verification code. Please check your email or request a new code."
      );
      // Focus first input on error
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    } finally {
      setIsVerifying(false);
    }
  }, [user?.email, refreshUser, router]);

  const handleOtpChange = (index: number, value: string) => {
    // Only accept numeric digits
    const cleanVal = value.replace(/\D/g, "");

    // Handle multi-character paste or input
    if (cleanVal.length > 1) {
      const newOtp = [...otp];
      const digits = cleanVal.slice(0, 6).split("");
      digits.forEach((d, i) => {
        if (index + i < 6) {
          newOtp[index + i] = d;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();

      // If full 6 digits filled, trigger auto-submit
      const fullCode = newOtp.join("");
      if (fullCode.length === 6) {
        verifyOtpCode(fullCode);
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanVal;
    setOtp(newOtp);

    // Auto-advance to next box if digit entered
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when 6th box is filled
    const fullCode = newOtp.join("");
    if (fullCode.length === 6) {
      verifyOtpCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Move to previous box if current is empty
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const newOtp = [...otp];
    pasted.split("").forEach((char, idx) => {
      newOtp[idx] = char;
    });
    setOtp(newOtp);

    const targetIndex = Math.min(pasted.length, 5);
    inputRefs.current[targetIndex]?.focus();

    if (pasted.length === 6) {
      verifyOtpCode(pasted);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    verifyOtpCode(code);
  };

  const handleResend = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setStatusMessage(null);
    setErrorMessage(null);
    try {
      const msg = await authService.resendVerification(user?.email);
      setStatusMessage(msg || "A fresh 6-digit code has been sent to your email!");
      setCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errorObj.response?.data?.message ||
          "Unable to resend code right now. Please wait a minute before trying again."
      );
    } finally {
      setIsResending(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const isOtpComplete = otp.every((digit) => digit.length === 1);

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#F8FAFC] relative overflow-hidden select-none">
      {/* Subtle Aurora Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 inset-x-0 h-40 bg-gradient-to-t from-white via-white/60 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] mx-auto space-y-6">
        {/* Official Brand Logo */}
        <div className="flex justify-center">
          <BrandLogo className="h-8.5 sm:h-9 w-auto" />
        </div>

        {/* Minimal Main Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-7 sm:p-9 shadow-[0_10px_35px_-10px_rgba(15,23,42,0.06)] text-center relative overflow-hidden space-y-6 backdrop-blur-sm">
          {isVerified ? (
            /* Verified Success State */
            <div className="space-y-4 py-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
              </div>
              <div className="space-y-1.5">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Email Verified!
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  Your account is activated. Redirecting you to your EMI dashboard...
                </p>
              </div>
              <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mt-2" />
            </div>
          ) : (
            /* Unverified OTP Form State */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Minimal Key / Mail Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto shadow-2xs">
                <KeyRound className="w-7 h-7 stroke-[1.8]" />
              </div>

              {/* Headings */}
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-[#0B132B] tracking-tight">
                  Enter Verification Code
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                  We&apos;ve sent a 6-digit verification code to:
                </p>
                <div className="pt-0.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/80 border border-indigo-100 text-indigo-900 text-xs font-bold max-w-full truncate shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse shrink-0" />
                    <span className="truncate">{displayEmail}</span>
                  </span>
                </div>
              </div>

              {/* Status or Error Banner */}
              {statusMessage && (
                <div className="p-3 rounded-xl bg-indigo-50/90 border border-indigo-200/80 text-indigo-700 text-xs font-medium flex items-center gap-2 text-left animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2 text-left animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 6-Box OTP Input Grid */}
              <div className="pt-2">
                <div className="flex items-center justify-center gap-2 sm:gap-2.5">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        inputRefs.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      onPaste={handlePaste}
                      className={cn(
                        "w-11 sm:w-12 h-13 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border transition-all shadow-2xs focus:outline-none touch-manipulation",
                        digit
                          ? "border-indigo-500 bg-indigo-50/30 text-indigo-950 font-mono shadow-xs"
                          : "border-slate-200 bg-white text-slate-800 hover:border-slate-300",
                        "focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/15"
                      )}
                      aria-label={`Digit ${idx + 1}`}
                    />
                  ))}
                </div>
                <p className="text-[11px] text-slate-400 mt-2.5">
                  Type or paste the 6-digit code from your email
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  disabled={!isOtpComplete || isVerifying}
                  className="w-full h-11 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verifying Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify Account</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                    </>
                  )}
                </button>

                <button
                  type="button"
                  disabled={cooldown > 0 || isResending}
                  onClick={handleResend}
                  className="w-full h-9.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw
                    className={cn(
                      "w-3.5 h-3.5 text-slate-500",
                      isResending && "animate-spin text-indigo-600"
                    )}
                  />
                  <span>
                    {isResending
                      ? "Sending fresh code..."
                      : cooldown > 0
                      ? `Resend code in ${cooldown}s`
                      : "Resend Verification Code"}
                  </span>
                </button>
              </div>

              {/* Minimal Trust Badge */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px] font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Protected with 256-bit bank-grade encryption</span>
              </div>
            </form>
          )}
        </div>

        {/* Footer Sub-links */}
        <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleLogout}
            className="text-slate-500 hover:text-slate-800 font-semibold transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Wrong email? Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
