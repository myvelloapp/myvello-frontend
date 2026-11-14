"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Check,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
  Lock,
} from "lucide-react";
import { useAuth } from "@/modules/authentication/AuthContext";
import { authService } from "@/services/authService";
import { BrandLogo } from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";

function RegisterFormSkeleton() {
  return (
    <div
      className="w-full max-w-[340px] sm:max-w-[360px] mx-auto my-auto py-4 space-y-5 animate-pulse select-none"
      aria-busy="true"
      aria-label="Loading registration form"
    >
      {/* Logo skeleton */}
      <div className="h-9 w-32 rounded-xl bg-slate-200/70" />

      {/* Heading skeleton */}
      <div className="space-y-2 mb-2">
        <div className="h-7 w-48 rounded-lg bg-slate-200/80" />
        <div className="h-7 w-36 rounded-lg bg-slate-200/80" />
      </div>

      {/* Google button skeleton */}
      <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />

      {/* Divider skeleton */}
      <div className="flex items-center gap-3 py-1">
        <div className="h-px bg-slate-200/80 flex-1" />
        <div className="h-2.5 w-6 rounded bg-slate-200" />
        <div className="h-px bg-slate-200/80 flex-1" />
      </div>

      {/* Form Fields skeletons */}
      <div className="space-y-3.5">
        <div className="space-y-1.5">
          <div className="h-3.5 w-20 rounded bg-slate-200/80" />
          <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
        </div>

        <div className="space-y-1.5">
          <div className="h-3.5 w-24 rounded bg-slate-200/80" />
          <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
        </div>

        <div className="space-y-1.5">
          <div className="h-3.5 w-20 rounded bg-slate-200/80" />
          <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
        </div>

        {/* Checkbox skeletons */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-[5px] bg-slate-200" />
            <div className="h-3 w-40 rounded bg-slate-200" />
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-[5px] bg-slate-200" />
            <div className="h-3 w-52 rounded bg-slate-200" />
          </div>
        </div>

        {/* Submit button skeleton */}
        <div className="pt-2">
          <div className="h-12 w-full rounded-xl bg-slate-200" />
        </div>
      </div>

      {/* Sign in footer skeleton */}
      <div className="h-4 w-44 rounded bg-slate-200 mx-auto" />
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Field interaction tracking for non-intrusive validation
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Smooth redirection if already logged in (zero flashing)
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user) {
      router.replace("/dashboard");
    }
  }, [isAuthLoading, isAuthenticated, user, router]);

  // Real-time password validation & 3-stage strength scoring (Memoized for performance)
  const pwdAnalysis = useMemo(() => {
    if (!password) {
      return {
        score: 0,
        label: "Weak",
        barColor: "bg-slate-200",
        labelColor: "text-slate-400",
        alert: null,
        isValid: false,
      };
    }

    const hasMinLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialOrUpper = /[!@#$%^&*(),.?":{}|<>A-Z]/.test(password);

    let alert: string | null = null;
    if (!hasMinLength) {
      alert = "Password must be at least 8 characters.";
    } else if (!hasLetter) {
      alert = "Password must contain at least one letter.";
    } else if (!hasNumber) {
      alert = "Password must contain at least one number.";
    }

    const isValid = hasMinLength && hasLetter && hasNumber;

    let score = 1;
    if (isValid) {
      score = 2; // Medium
      if (password.length >= 10 && hasSpecialOrUpper) {
        score = 3; // Strong
      }
    }

    if (score === 1) {
      return {
        score: 1,
        label: "Weak",
        barColor: "bg-[#F43F5E]",
        labelColor: "text-[#F43F5E]",
        alert,
        isValid: false,
      };
    } else if (score === 2) {
      return {
        score: 2,
        label: "Medium",
        barColor: "bg-amber-400",
        labelColor: "text-amber-500",
        alert,
        isValid: true,
      };
    } else {
      return {
        score: 3,
        label: "Strong",
        barColor: "bg-emerald-500",
        labelColor: "text-emerald-600",
        alert: null,
        isValid: true,
      };
    }
  }, [password]);

  // Validation rules (Memoized)
  const nameError = useMemo(() => {
    if (!nameTouched && !submitted) return null;
    const trimmed = name.trim();
    if (!trimmed) return "Full name is required.";
    if (trimmed.length < 2) return "Full name must be at least 2 characters.";
    return null;
  }, [name, nameTouched, submitted]);

  const emailError = useMemo(() => {
    if (!emailTouched && !submitted) return null;
    const trimmed = email.trim();
    if (!trimmed) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
    return null;
  }, [email, emailTouched, submitted]);

  const isPasswordInvalid = (passwordTouched || submitted) && (!pwdAnalysis.isValid || pwdAnalysis.alert !== null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError(null);

    const nameTrimmed = name.trim();
    const nameErr = !nameTrimmed
      ? "Full name is required."
      : nameTrimmed.length < 2
      ? "Full name must be at least 2 characters."
      : null;

    const emailTrimmed = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailErr = !emailTrimmed
      ? "Email address is required."
      : !emailRegex.test(emailTrimmed)
      ? "Please enter a valid email address."
      : null;

    if (nameErr || emailErr || !pwdAnalysis.isValid || !termsAccepted || !privacyAccepted) {
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name: nameTrimmed,
        email: emailTrimmed.toLowerCase(),
        password,
        password_confirmation: password,
        terms: termsAccepted,
        privacy: privacyAccepted,
      });
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> } };
      };
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        const firstKey = Object.keys(apiErrors)[0];
        setServerError(apiErrors[firstKey][0]);
      } else {
        setServerError(
          error.response?.data?.message || "Registration failed. Please check your details."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setServerError(null);
      const url = await authService.getGoogleLoginUrl();
      if (url) {
        window.location.href = url;
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setServerError(
        errorObj.response?.data?.message || "Google registration is currently initializing."
      );
    }
  };

  return (
    <div className="min-h-dvh w-full flex flex-col lg:flex-row bg-white relative overflow-x-hidden select-none">
      {/* Mobile top accent gradient bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#8830f6] via-[#4054d1] to-[#0cc9e7] z-50 pointer-events-none" />

      {/* Left Column: Form Section (Native Wrap & Thumb-Friendly Mobile Layout) */}
      <div className="w-full lg:w-[460px] xl:w-[500px] 2xl:w-[560px] shrink-0 min-h-dvh bg-white relative flex flex-col justify-between px-4 sm:px-8 lg:px-8 xl:px-10 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1.5rem,calc(1rem+env(safe-area-inset-bottom)))] overflow-y-auto">
        {/* Top Header: Safe-Area Compliant 44px Back Button */}
        <div className="pt-2 sm:pt-0">
          <button
            type="button"
            onClick={() => router.back()}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full border border-slate-200/90 bg-white shadow-2xs hover:bg-slate-50 flex items-center justify-center transition-all text-slate-500 hover:text-slate-800 cursor-pointer hover:border-slate-300 active:scale-95 touch-manipulation"
            aria-label="Go back"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" strokeWidth={2.2} />
          </button>
        </div>

        {/* Main Content: High-Fidelity Skeleton OR Live Form */}
        {isAuthLoading ? (
          <RegisterFormSkeleton />
        ) : (
          <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto my-auto py-4">
            {/* Logo */}
            <div className="mb-6">
              <BrandLogo className="h-8 sm:h-9 w-auto" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-[28px] font-black text-[#0B132B] tracking-tight leading-[1.2] mb-6">
              Create your free
              <br />
              account
            </h1>

            {/* Google Sign-in Option (44px Minimum Touch Target) */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="w-full min-h-[44px] h-11 flex items-center justify-center gap-2.5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-extrabold shadow-2xs transition-all cursor-pointer hover:border-slate-300 active:scale-[0.98] touch-manipulation"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
              <span className="font-extrabold">Sign up with Google</span>
            </button>

            {/* Divider */}
            <div className="my-4.5 flex items-center gap-3 select-none">
              <div className="h-px bg-slate-200/80 flex-1" />
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase shrink-0">
                OR
              </span>
              <div className="h-px bg-slate-200/80 flex-1" />
            </div>

            {/* Registration Form */}
            <form onSubmit={handleRegister} noValidate className="space-y-3.5">
              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Full Name <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Eg. Rahul Sharma"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!nameTouched) setNameTouched(true);
                  }}
                  onBlur={() => setNameTouched(true)}
                  autoComplete="name"
                  autoCapitalize="words"
                  autoCorrect="off"
                  spellCheck={false}
                  className={cn(
                    "w-full min-h-[44px] h-11 px-3.5 rounded-xl border font-semibold transition-all shadow-2xs focus:outline-none touch-manipulation",
                    "text-[16px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 placeholder:font-normal",
                    nameError
                      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20 text-rose-900"
                      : "border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                  )}
                />
                {nameError && (
                  <div className="flex items-center gap-1.5 text-[#F43F5E] text-xs font-semibold mt-1.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{nameError}</span>
                  </div>
                )}
              </div>

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

              <div>
                <label className="block text-xs font-extrabold text-slate-800 mb-1.5">
                  Password <span className="text-rose-500 font-bold ml-0.5">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Eg. Rahul123##"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!passwordTouched) setPasswordTouched(true);
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    autoComplete="off"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className={cn(
                      "w-full min-h-[44px] h-11 pl-3.5 pr-11 rounded-xl border font-semibold transition-all shadow-2xs focus:outline-none touch-manipulation",
                      "text-[16px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 placeholder:font-normal",
                      isPasswordInvalid
                        ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20 text-rose-900"
                        : "border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer active:scale-95 touch-manipulation"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* 3-Segment Strength Meter matching design */}
                {password.length > 0 && (
                  <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
                    <div className="grid grid-cols-3 gap-1.5">
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          pwdAnalysis.score >= 1 ? pwdAnalysis.barColor : "bg-slate-200"
                        )}
                      />
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          pwdAnalysis.score >= 2 ? pwdAnalysis.barColor : "bg-slate-200"
                        )}
                      />
                      <div
                        className={cn(
                          "h-1.5 rounded-full transition-all duration-300",
                          pwdAnalysis.score >= 3 ? pwdAnalysis.barColor : "bg-slate-200"
                        )}
                      />
                    </div>

                    {/* Criteria and Strength Label */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Min 8 chars, letters &amp; numbers</span>
                      <span className={cn("font-bold transition-colors", pwdAnalysis.labelColor)}>
                        {pwdAnalysis.label}
                      </span>
                    </div>

                    {/* Alert notification */}
                    {pwdAnalysis.alert && (
                      <div className="flex items-center gap-1.5 text-[#F43F5E] text-xs font-semibold pt-0.5 animate-in fade-in duration-150">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{pwdAnalysis.alert}</span>
                      </div>
                    )}
                  </div>
                )}

                {submitted && !password && (
                  <div className="flex items-center gap-1.5 text-[#F43F5E] text-xs font-semibold mt-1.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Password is required.</span>
                  </div>
                )}
              </div>

              {/* Checkbox agreements with Theme Gradient Checkmarks */}
              <div className="space-y-1.5 pt-1 text-xs text-slate-600 leading-normal">
                <label className="flex items-center gap-2.5 cursor-pointer select-none group touch-manipulation py-0.5">
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-4 h-4 rounded-[5px] flex items-center justify-center transition-all duration-200",
                        termsAccepted
                          ? "bg-gradient-to-tr from-[#7C3AED] via-[#6366F1] to-[#06B6D4] shadow-xs shadow-indigo-500/30"
                          : "border border-slate-300 bg-white group-hover:border-slate-400 group-hover:bg-slate-50/50"
                      )}
                    >
                      {termsAccepted && (
                        <Check className="w-3 h-3 text-white stroke-[3.5]" />
                      )}
                    </div>
                  </div>
                  <span className="text-slate-600 font-medium">
                    I agree to the{" "}
                    <Link
                      href="#"
                      className="font-bold text-slate-900 hover:text-indigo-600 transition-colors underline-offset-2"
                    >
                      Terms &amp; Conditions
                    </Link>
                  </span>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none group touch-manipulation py-0.5">
                  <div className="relative mt-0.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={privacyAccepted}
                      onChange={(e) => setPrivacyAccepted(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-4 h-4 rounded-[5px] flex items-center justify-center transition-all duration-200",
                        privacyAccepted
                          ? "bg-gradient-to-tr from-[#7C3AED] via-[#6366F1] to-[#06B6D4] shadow-xs shadow-indigo-500/30"
                          : "border border-slate-300 bg-white group-hover:border-slate-400 group-hover:bg-slate-50/50"
                      )}
                    >
                      {privacyAccepted && (
                        <Check className="w-3 h-3 text-white stroke-[3.5]" />
                      )}
                    </div>
                  </div>
                  <span className="text-slate-600 font-medium leading-snug">
                    I accept the{" "}
                    <Link
                      href="#"
                      className="font-bold text-slate-900 hover:text-indigo-600 transition-colors underline-offset-2"
                    >
                      Privacy Policy
                    </Link>{" "}
                    and understand records are private by default.
                  </span>
                </label>

                {submitted && (!termsAccepted || !privacyAccepted) && (
                  <div className="flex items-center gap-1.5 text-[#F43F5E] text-xs font-semibold pt-1 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Please accept both the Terms &amp; Conditions and Privacy Policy.</span>
                  </div>
                )}

                {serverError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-[#F43F5E] text-xs font-semibold animate-in fade-in duration-150">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{serverError}</span>
                  </div>
                )}
              </div>

              {/* Submit Button (48px Touch Target, Native Gradient Glow) */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full min-h-[48px] h-12 btn-gradient-glow text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] transition-all touch-manipulation shadow-md shadow-indigo-500/20"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Create your free account"
                  )}
                </button>
              </div>
            </form>

            {/* Sign In link directly below button */}
            <p className="text-center text-xs text-slate-600 pt-4">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#01c6e4] hover:text-[#0092a8] active:opacity-75 transition-colors py-2 inline-block touch-manipulation"
              >
                Sign In
              </Link>
            </p>
          </div>
        )}

        {/* Empty bottom space to balance vertical alignment */}
        <div className="h-4 sm:h-6" />
      </div>

      {/* Right Column: Fixed Pure CSS Gradient Background with Onboarding Showcase (Desktop Only) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-dvh bg-theme-gradient flex-col justify-between p-10 xl:p-14 2xl:p-16 text-white select-none">

   


      </div>
    </div>
  );
}
