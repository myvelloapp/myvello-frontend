"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/modules/authentication/AuthContext";
import { setAuthCookie } from "@/services/authService";
import { AlertCircle } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";
import { AppWaveBackground } from "@/components/layout/AppWaveBackground";

function CallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(decodeURIComponent(errorParam));
      setTimeout(() => {
        router.push("/login?error=" + encodeURIComponent(errorParam));
      }, 3000);
      return;
    }

    if (token) {
      localStorage.setItem("myvello_token", token);
      setAuthCookie(token);
      refreshUser()
        .then(() => {
          router.push("/emis");
        })
        .catch(() => {
          router.push("/emis");
        });
    } else {
      setError("No authentication token received. Redirecting to sign in...");
      setTimeout(() => {
        router.push("/login");
      }, 2500);
    }
  }, [searchParams, refreshUser, router]);

  return (
    <div className="min-h-screen min-h-dvh w-full relative overflow-hidden bg-[#EDF8F2] flex items-center justify-center p-6 select-none">
      {/* Soft Ambient Vector Wave Background matching the rest of the application */}
      <AppWaveBackground />

      {/* Clean, Minimalist Centered Card */}
      <div className="relative z-10 w-full max-w-[360px] bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 p-8 sm:p-9 shadow-[0_16px_36px_-6px_rgba(2,54,27,0.08),0_4px_12px_-2px_rgba(2,54,27,0.04)] text-center animate-fade-in">
        {/* Brand Logo */}
        <div className="mb-6 flex justify-center">
          <BrandLogo className="h-8 w-auto" href="" />
        </div>

        {error ? (
          /* Error State */
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-200/80 shadow-xs">
              <AlertCircle className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#02361B] tracking-tight">
                Authentication Failed
              </h2>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{error}</p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full h-10 btn-gradient-glow text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          /* Minimalist Loading State */
          <div className="space-y-4">
            {/* Elegant Emerald Ring Spinner */}
            <div className="flex items-center justify-center py-2">
              <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-600 animate-spin" />
            </div>

            {/* Clean Typography */}
            <div>
              <h2 className="text-base font-bold text-[#02361B] tracking-tight">
                Signing you in...
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Verifying session and preparing your records
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GoogleAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen min-h-dvh bg-[#EDF8F2] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
