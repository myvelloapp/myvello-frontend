"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setErrorMsg(error.response?.data?.message || "Failed to send reset link. Verify your email is registered.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm space-y-6">
        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Sign In
        </Link>

        {isSubmitted ? (
          <div className="text-center space-y-3 py-4 animate-fade-in">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Recovery Link Sent</h2>
            <p className="text-xs text-slate-500">
              We sent password reset instructions to <strong>{email}</strong>. Check your inbox and follow the secure link.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold animate-fade-in">
                {errorMsg}
              </div>
            )}
            <div>
              <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">
                Reset your password
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter your registered email address to receive password recovery instructions.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                Email Address
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

            <Button
              type="submit"
              variant="secondary"
              className="w-full h-11 text-xs font-semibold gap-2 bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl"
            >
              Send Recovery Link
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
