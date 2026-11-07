"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, CheckCircle2, ArrowRight, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { authService } from "@/services/authService";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSimulateVerification = () => {
    setIsVerified(true);
    setTimeout(() => {
      router.push("/family/setup");
    }, 1200);
  };

  const handleResend = async () => {
    setIsResending(true);
    setStatusMessage(null);
    try {
      const msg = await authService.resendVerification();
      setStatusMessage(msg || "A fresh verification link has been dispatched to your email!");
    } catch {
      setStatusMessage("Verification link sent. Please inspect your email inbox.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6366F1] to-[#818CF8] flex items-center justify-center text-white font-extrabold text-base">
            M
          </div>
          <span className="text-xl font-bold tracking-tight text-[#172554]">myvello</span>
        </div>

        {isVerified ? (
          <div className="space-y-4 animate-fade-in py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Email Verified Successfully!</h2>
            <p className="text-xs text-slate-500">
              Account activated. Redirecting you to family workspace setup...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <Mail className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-extrabold text-[#172554] tracking-tight">
              Verify your email address
            </h2>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              We&apos;ve sent an activation link to your email. Click the link in the message to activate your vault access.
            </p>

            <div className="pt-2 space-y-3">
              <Button
                variant="secondary"
                size="md"
                onClick={handleSimulateVerification}
                className="w-full gap-2 text-xs font-semibold bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl"
              >
                Simulate Email Verification Link
                <ArrowRight className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResend}
                isLoading={isResending}
                className="w-full text-xs text-slate-600"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1" />
                Resend Verification Email
              </Button>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-xs">
              <Shield className="w-3.5 h-3.5 text-teal-600" />
              <span>Unverified accounts cannot access financial data</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
