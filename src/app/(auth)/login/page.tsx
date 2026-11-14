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
  TrendingUp,
  Building2,
} from "lucide-react";
import { useAuth } from "@/modules/authentication/AuthContext";
import { authService } from "@/services/authService";
import { BrandLogo } from "@/components/common/BrandLogo";
import { cn } from "@/lib/utils";

function LoginFormSkeleton() {
  return (
    <div
      className="w-full max-w-[340px] sm:max-w-[360px] mx-auto my-auto py-4 space-y-6 animate-pulse select-none"
      aria-busy="true"
      aria-label="Loading login form"
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
      <div className="space-y-4">
        <div className="space-y-1.5">
          <div className="h-3.5 w-24 rounded bg-slate-200/80" />
          <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-16 rounded bg-slate-200/80" />
            <div className="h-3 w-24 rounded bg-slate-200/60" />
          </div>
          <div className="h-11 w-full rounded-xl bg-slate-100 border border-slate-200/60" />
        </div>

        {/* Remember me skeleton */}
        <div className="flex items-center gap-2.5 py-1">
          <div className="w-4 h-4 rounded-[5px] bg-slate-200" />
          <div className="h-3 w-36 rounded bg-slate-200" />
        </div>

        {/* Submit button skeleton */}
        <div className="pt-2">
          <div className="h-12 w-full rounded-xl bg-slate-200" />
        </div>
      </div>

      {/* Sign up footer skeleton */}
      <div className="h-4 w-48 rounded bg-slate-200 mx-auto" />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Field interaction tracking
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check URL parameters for verification status or errors
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified") === "1") {
        setSuccessMessage("Your email has been verified successfully! You can now sign in.");
      } else if (params.get("error") === "invalid_link") {
        setErrorMessage("The verification link is invalid or has expired. Please sign in and request a fresh link.");
      }
    }
  }, []);

  // Smooth redirection if already logged in (zero flashing)
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated && user) {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const redirectParam = params.get("redirect");
        if (
          redirectParam &&
          redirectParam.startsWith("/") &&
          !redirectParam.startsWith("//") &&
          !redirectParam.includes("\\")
        ) {
          router.replace(redirectParam);
          return;
        }
      }
      router.replace("/dashboard");
    }
  }, [isAuthLoading, isAuthenticated, user, router]);

  // Memoized Validation Error Computations
  const emailError = useMemo(() => {
    if (!emailTouched && !submitted) return null;
    const trimmed = email.trim();
    if (!trimmed) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) return "Please enter a valid email address.";
    return null;
  }, [email, emailTouched, submitted]);

  const passwordError = useMemo(() => {
    if (!passwordTouched && !submitted) return null;
    if (!password) return "Password is required.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    return null;
  }, [password, passwordTouched, submitted]);

  const handleLogin = async (e: React.FormEvent) => {
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

    const pwdErr = !password
      ? "Password is required."
      : password.length < 6
      ? "Password must be at least 6 characters."
      : null;

    if (emailErr || pwdErr) {
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: emailTrimmed.toLowerCase(), password, remember: rememberMe });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        error.response?.data?.message || "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setErrorMessage(null);
      const url = await authService.getGoogleLoginUrl();
      if (url) {
        window.location.href = url;
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(
        errorObj.response?.data?.message || "Google Sign-In is currently initializing."
      );
    }
  };

  return (
    <div className="min-h-dvh w-full flex flex-col lg:flex-row bg-white relative overflow-x-hidden select-none">
      {/* Mobile top accent gradient bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#8830f6] via-[#4054d1] to-[#0cc9e7] z-50 pointer-events-none" />

      {/* Left Column: Fixed Pure CSS Gradient Background with Executive Brand Architecture (Desktop Only) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden min-h-dvh bg-theme-gradient flex-col justify-between p-10 xl:p-14 2xl:p-16 text-white select-none">


 

      
      </div>

      {/* Right Column: Login Form Section (Native Wrap & Thumb-Friendly Mobile Layout) */}
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
          <LoginFormSkeleton />
        ) : (
          <div className="w-full max-w-[340px] sm:max-w-[360px] mx-auto my-auto py-4">
            {/* Logo */}
            <div className="mb-6">
              <BrandLogo className="h-8 sm:h-9 w-auto" />
            </div>

            {/* Heading */}
            <h1 className="text-2xl sm:text-[28px] font-black text-[#0B132B] tracking-tight leading-[1.2] mb-6">
              Welcome back to
              <br />
              your account
            </h1>

            {/* Google Sign-in Option (44px Minimum Touch Target) */}
            <button
              type="button"
              onClick={handleGoogleLogin}
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
              <span className="font-extrabold">Sign in with Google</span>
            </button>

            {/* Centered OR Divider */}
            <div className="my-4.5 flex items-center gap-3 select-none">
              <div className="h-px bg-slate-200/80 flex-1" />
              <span className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase shrink-0">
                OR
              </span>
              <div className="h-px bg-slate-200/80 flex-1" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} noValidate className="space-y-3.5">
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-slate-800">
                    Password <span className="text-rose-500 font-bold ml-0.5">*</span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-bold text-[#01c6e4] hover:text-[#0092a8] active:opacity-75 transition-colors py-1 px-1 -mr-1 touch-manipulation"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (!passwordTouched) setPasswordTouched(true);
                    }}
                    onBlur={() => setPasswordTouched(true)}
                    autoComplete="current-password"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    className={cn(
                      "w-full min-h-[44px] h-11 pl-3.5 pr-11 rounded-xl border font-semibold transition-all shadow-2xs focus:outline-none touch-manipulation",
                      "text-[16px] sm:text-[13px] text-slate-900 placeholder:text-slate-400 placeholder:font-normal",
                      passwordError
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
                {passwordError && (
                  <div className="flex items-center gap-1.5 text-[#F43F5E] text-xs font-semibold mt-1.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}
              </div>

              {/* Remember this device with Theme Gradient Checkmark */}
              <div className="flex items-center justify-between py-0.5">
                <label className="inline-flex items-center gap-2.5 text-xs text-slate-600 cursor-pointer select-none group touch-manipulation">
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        "w-4 h-4 rounded-[5px] flex items-center justify-center transition-all duration-200",
                        rememberMe
                          ? "bg-gradient-to-tr from-[#7C3AED] via-[#6366F1] to-[#06B6D4] shadow-xs shadow-indigo-500/30"
                          : "border border-slate-300 bg-white group-hover:border-slate-400 group-hover:bg-slate-50/50"
                      )}
                    >
                      {rememberMe && <Check className="w-3 h-3 text-white stroke-[3.5]" />}
                    </div>
                  </div>
                  <span className="font-semibold text-slate-700">Remember this device</span>
                </label>
              </div>

              {/* Email Verified Success Message */}
              {successMessage && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-2.5 text-emerald-700 text-xs font-semibold animate-in fade-in duration-150">
                  <Check className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <span className="leading-relaxed">{successMessage}</span>
                </div>
              )}

              {/* Server / Authentication Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-[#F43F5E] text-xs font-semibold animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              {/* Submit Button (48px Touch Target, Native Gradient Glow) */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full min-h-[48px] h-12 btn-gradient-glow text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98] transition-all touch-manipulation shadow-md shadow-indigo-500/20"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Sign In to your account"
                  )}
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-xs text-slate-600 pt-4">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#01c6e4] hover:text-[#0092a8] active:opacity-75 transition-colors py-2 inline-block touch-manipulation"
              >
                Sign Up
              </Link>
            </p>
          </div>
        )}

        {/* Empty bottom space to balance vertical alignment */}
        <div className="h-4 sm:h-6" />
      </div>
    </div>
  );
}
