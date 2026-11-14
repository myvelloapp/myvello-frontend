"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  KeyRound,
  Lock,
} from "lucide-react";
import { useAuth } from "@/modules/authentication/AuthContext";
import { authService } from "@/services/authService";
import { BrandLogo } from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";

function ForgotPasswordSkeleton() {
  return (
    <div
      className="w-full max-w-[340px] sm:max-w-[360px] mx-auto my-auto py-4 space-y-6 animate-pulse select-none"
      aria-busy="true"
      aria-label="Loading password recovery form"
    >
      {/* Logo skeleton */}
      <div className="h-9 w-32 rounded-xl bg-slate-200/70" />

      {/* Heading skeleton */}
      <div className="space-y-2 mb-2">
        <div className="h-7 w-48 rounded-lg bg-slate-200/80" />
        <div className="h-7 w-36 rounded-lg bg-slate-200/80" />
      </div>

      {/* Subtitle skeleton */}
      <div className="space-y-1.5">
        <div className="h-3.5 w-full rounded bg-slate-200/60" />
        <div className="h-3.5 w-4/5 rounded bg-slate-200/60" />
      </div>

      {/* Form Fields skeletons */}
      <div className="space-y-4 pt-2">
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 rounded bg-slate-200/80" />
          <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
        </div>

        {/* Submit button skeleton */}
        <div className="pt-2">
          <div className="h-12 w-full rounded-xl bg-slate-200" />
        </div>
      </div>

      {/* Sign in footer skeleton */}
      <div className="h-4 w-48 rounded bg-slate-200 mx-auto" />
    </div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Field interaction tracking
  const [emailTouched, setEmailTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Smooth redirection if already logged in
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user) {
      router.replace("/dashboard");
    }
  }, [isAuthLoading, isAuthenticated, user, router]);

  // Memoized Email Error Computation
  const emailError = useMemo(() => {
    if (!emailTouched && !submitted) return null;
    const trimmed = email.trim();
    if (!trimmed) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
    return null;
  }, [email, emailTouched, submitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setErrorMessage(null);

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailErr = !emailTrimmed
      ? "Email address is required."
      : !emailRegex.test(emailTrimmed)
      ? "Please enter a valid email address."
      : null;

    if (emailErr) {
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(emailTrimmed.toLowerCase());
      setIsSubmitted(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        error.response?.data?.message || "Failed to send reset link. Verify your email is registered."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-dvh w-full flex flex-col lg:flex-row bg-white relative overflow-x-hidden select-none">
      {/* Mobile top accent gradient bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#8830f6] via-[#4054d1] to-[#0cc9e7] z-50 pointer-events-none" />

      {/* Left Column: Fixed Pure CSS Gradient Background with Security Spotlight (Desktop Only) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-dvh bg-theme-gradient flex-col justify-between p-10 xl:p-14 2xl:p-16 text-white select-none">
 
    
      </div>

      {/* Right Column: Password Recovery Form Section (Native Wrap & Thumb-Friendly Layout) */}
      <div className="w-full lg:w-[460px] xl:w-[500px] 2xl:w-[560px] shrink-0 min-h-dvh bg-white relative flex flex-col justify-between px-4 sm:px-8 lg:px-8 xl:px-10 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,calc(1rem+env(safe-area-inset-bottom)))] overflow-y-auto">
        {/* Top Header: Safe-Area Compliant 44px Back Button */}
        <div className="pt-2 sm:pt-0">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-slate-200/90 bg-white shadow-2xs hover:bg-slate-50 flex items-center justify-center transition-all text-slate-500 hover:text-slate-800 cursor-pointer hover:border-slate-300 active:scale-95 touch-manipulation"
            aria-label="Back to Sign In"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" strokeWidth={2.2} />
          </button>
        </div>

        {/* Main Content: High-Fidelity Skeleton OR Form Body */}
        {isAuthLoading ? (
          <ForgotPasswordSkeleton />
        ) : (
          <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto my-auto py-4">
            {/* Logo */}
            <div className="mb-6">
              <BrandLogo className="h-8 sm:h-9 w-auto" />
            </div>

            {isSubmitted ? (
              /* Success State (Touch-Optimized for Mobile) */
              <div className="space-y-5 animate-in fade-in duration-200">
                <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-[#7C3AED] via-[#6366F1] to-[#06B6D4] text-white flex items-center justify-center shadow-md shadow-indigo-500/25">
                  <CheckCircle2 className="w-7 h-7 text-white stroke-[2.5]" />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-[28px] font-black text-[#0B132B] tracking-tight leading-[1.2] mb-2">
                    Recovery link
                    <br />
                    sent
                  </h1>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We sent password reset instructions to{" "}
                    <strong className="text-slate-800 font-bold">{email.toLowerCase()}</strong>. Please check your inbox and click the secure link to set your new password.
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <Link
                    href="/login"
                    className="w-full min-h-[48px] h-12 btn-gradient-glow text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all touch-manipulation"
                  >
                    Return to Sign In
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setSubmitted(false);
                      setEmailTouched(false);
                    }}
                    className="w-full min-h-[44px] flex items-center justify-center text-center text-xs font-bold text-slate-500 hover:text-slate-800 active:opacity-75 transition-colors py-2 cursor-pointer touch-manipulation"
                  >
                    Didn&apos;t receive the email? Try another address
                  </button>
                </div>
              </div>
            ) : (
              /* Reset Request Form */
              <div>
                <h1 className="text-2xl sm:text-[28px] font-black text-[#0B132B] tracking-tight leading-[1.2] mb-2">
                  Reset your
                  <br />
                  password
                </h1>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Enter your registered email address and we&apos;ll send you instructions to recover your account.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                      Email Address <span className="text-rose-500 font-bold ml-0.5">*</span>
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      placeholder="Eg. rahulsharma@gmail.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (!emailTouched) setEmailTouched(true);
                      }}
                      onBlur={() => setEmailTouched(true)}
                      autoComplete="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      className={cn(
                        "w-full min-h-[44px] h-11 px-3.5 rounded-xl border font-semibold transition-all shadow-2xs focus:outline-none touch-manipulation",
                        "text-[16px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 placeholder:font-normal",
                        emailError
                          ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20 text-rose-900"
                          : "border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                      )}
                    />
                    {emailError && (
                      <div className="flex items-center gap-1.5 text-[#F43F5E] text-xs font-semibold mt-1.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{emailError}</span>
                      </div>
                    )}
                  </div>

                  {/* Server Error Message */}
                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-[#F43F5E] text-xs font-semibold animate-in fade-in duration-150">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button (48px Touch Target, Native Gradient Glow) */}
                  <div className="pt-0.5">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full min-h-[48px] h-12 btn-gradient-glow text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] transition-all touch-manipulation shadow-md shadow-indigo-500/20"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        "Send Recovery Link"
                      )}
                    </button>
                  </div>
                </form>

                {/* Back to Sign In Link */}
                <p className="text-center text-xs text-slate-600 pt-3.5">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-[#01c6e4] hover:text-[#0092a8] active:opacity-75 transition-colors py-2 inline-block touch-manipulation"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            )}
          </div>
        )}

        {/* Empty bottom space to balance vertical alignment */}
        <div className="h-4 sm:h-6" />
      </div>
    </div>
  );
}
