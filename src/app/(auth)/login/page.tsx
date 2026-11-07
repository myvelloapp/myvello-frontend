"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/modules/authentication/AuthContext";
import { authService } from "@/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await login({ email, password, remember: rememberMe });
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
      const url = await authService.getGoogleLoginUrl();
      if (url) {
        window.location.href = url;
      }
    } catch {
      alert("Google OAuth redirect is initializing. You may also register or login directly using email.");
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F8FAFC]">
      {/* Left Column: Visual Brand Hero */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0C1222] via-[#141C33] to-[#1E1B4B] text-white relative overflow-hidden">
        {/* Top Logo */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-lg shadow-indigo-900/40">
            <span className="font-extrabold text-white text-lg">M</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">myvello</span>
        </div>

        {/* Brand Tagline & Message */}
        <div className="space-y-6 z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-teal-300 border border-white/10 backdrop-blur-xs">
            <Shield className="w-3.5 h-3.5" />
            End-to-End Vault Architecture
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Your Life. Your Records. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818CF8] to-[#14B8A6]">
              One Place.
            </span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Welcome back to Myvello. Manage your monthly EMI schedules, track family loan commitments, and never miss a payment deadline.
          </p>

          <div className="pt-4 space-y-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multi-stage payment reminders (7d, 3d, 1d, Due Date)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Strict personal privacy within shared family workspaces</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Accurate calendar date logic for month-end due dates</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-400 z-10">
          © 2026 Myvello (www.myvello.life). All rights reserved.
        </div>

        {/* Decorative blur circle */}
        <div className="absolute right-0 bottom-0 translate-x-20 translate-y-20 w-80 h-80 rounded-full bg-gradient-to-tr from-indigo-500/20 to-teal-400/20 blur-3xl pointer-events-none" />
      </div>

      {/* Right Column: Clean Login Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center">
              <span className="font-extrabold text-white text-base">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#172554]">myvello</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Sign in to your account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              Enter your credentials or continue with your Google account.
            </p>
          </div>

          {/* Error Alert Display */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fade-in">
              {errorMessage}
            </div>
          )}

          {/* Google OAuth Option matching PRD Section 4.2 */}
          <div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-all cursor-pointer"
            >
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
              Continue with Google
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-[#F8FAFC] px-3 text-[11px] font-semibold text-slate-400 uppercase">
              Or sign in with email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="secondary"
              isLoading={isLoading}
              className="w-full h-11 text-xs font-semibold gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl shadow-xs"
            >
              Sign In to Myvello
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-bold text-indigo-600 hover:text-indigo-800">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
