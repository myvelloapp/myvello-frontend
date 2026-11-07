"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Lock, Mail, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/modules/authentication/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please re-enter.");
      return;
    }
    if (!termsAccepted || !privacyAccepted) {
      setErrorMessage("Please accept both the Terms & Conditions and Privacy Policy.");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: confirmPassword,
        terms: termsAccepted,
        privacy: privacyAccepted,
      });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        const firstKey = Object.keys(apiErrors)[0];
        setErrorMessage(apiErrors[firstKey][0]);
      } else {
        setErrorMessage(error.response?.data?.message || "Registration failed. Please check your details.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F8FAFC]">
      {/* Left Column: Visual Brand Hero */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0C1222] via-[#141C33] to-[#1E1B4B] text-white relative overflow-hidden">
        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center">
            <span className="font-extrabold text-white text-lg">M</span>
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">myvello</span>
        </div>

        <div className="space-y-6 z-10 max-w-lg">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-teal-300 border border-white/10">
            <Shield className="w-3.5 h-3.5" />
            Digital Family Vault
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
            Centralize your records in one secure vault.
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed">
            Create your account today. Track home loans, car EMIs, and personal commitments with peace of mind.
          </p>

          <div className="space-y-3 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full privacy: Your loans are invisible to others by default</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Timely multi-day payment reminders via email and notifications</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Family workspace collaboration with role permissions</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-400 z-10">
          © 2026 Myvello (www.myvello.life). All rights reserved.
        </div>
      </div>

      {/* Right Column: Registration Form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-6">
          <div className="lg:hidden flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center">
              <span className="font-extrabold text-white text-base">M</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#172554]">myvello</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Create your account
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Start managing your personal and family financial responsibilities.
            </p>
          </div>

          {/* Error Alert Display */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fade-in">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Min 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs text-slate-600">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600"
                />
                <span>
                  I agree to the{" "}
                  <Link href="#" className="font-semibold text-indigo-600 hover:underline">
                    Terms & Conditions
                  </Link>
                </span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-indigo-600"
                />
                <span>
                  I accept the{" "}
                  <Link href="#" className="font-semibold text-indigo-600 hover:underline">
                    Privacy Policy
                  </Link>{" "}
                  and understand records are private by default.
                </span>
              </label>
            </div>

            <Button
              type="submit"
              variant="secondary"
              isLoading={isLoading}
              className="w-full h-11 text-xs font-semibold gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl shadow-xs"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-800">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
