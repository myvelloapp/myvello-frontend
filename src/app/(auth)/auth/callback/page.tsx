"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/modules/authentication/AuthContext";
import { ShieldCheck, AlertCircle, Lock } from "lucide-react";
import { BrandLogo } from "@/components/common/BrandLogo";

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
    <div className="min-h-screen w-full relative overflow-hidden bg-theme-gradient flex items-center justify-center p-6 select-none">

      {/* Floating Centered Card */}
      <div className="relative z-10 w-full max-w-[380px] bg-white/95 backdrop-blur-2xl rounded-3xl border border-white/60 p-8 sm:p-10 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.4),0_0_0_1px_rgba(255,255,255,0.4)] text-center animate-fade-in">
        {/* Brand Logo */}
        <div className="mb-8 flex justify-center">
          <BrandLogo className="h-8 w-auto" />
        </div>

        {error ? (
          /* Error State */
          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto border border-rose-200 shadow-xs">
              <AlertCircle className="w-7 h-7 stroke-[2.2]" />
            </div>

            <div>
              <h2 className="text-lg font-extrabold text-[#0B132B] tracking-tight">
                Authentication Failed
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{error}</p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full h-10.5 btn-gradient-glow text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          /* Unlocking Vault State */
          <div className="space-y-5">
            {/* Animated Glowing Dual-Ring Spinner */}
            <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
              {/* Outer revolving gradient ring */}
              <div
                className="absolute inset-0 rounded-full animate-spin-infinite blur-[1px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, #7c3aed 0%, #2563eb 45%, #06b6d4 85%, #7c3aed 100%)",
                }}
              />
              {/* Inner white mask with center lock icon */}
              <div className="relative w-13 h-13 rounded-full bg-white flex items-center justify-center shadow-xs">
                <Lock className="w-5 h-5 text-indigo-600 animate-pulse" />
              </div>
            </div>

            {/* Title & Status */}
            <div>
              <h2 className="text-lg font-extrabold text-[#0B132B] tracking-tight">
                Unlocking your vault...
              </h2>
              <p className="text-xs text-slate-500 mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                Securing your session and synchronizing your digital records.
              </p>
            </div>

            {/* Flowing Gradient Progress Beam */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-[#7c3aed] via-[#2563eb] to-[#06b6d4] rounded-full w-full animate-pulse"
                style={{
                  animationDuration: "1.2s",
                }}
              />
            </div>

            {/* Security Badge */}
            <div className="pt-2 flex items-center justify-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>256-Bit Vault Encryption Active</span>
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
        <div className="min-h-screen bg-[#1e1b4b] flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}
