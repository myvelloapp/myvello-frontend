"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Activity, Users, CreditCard, ChevronRight } from "lucide-react";
import { checkBackendHealth, SystemHealthResponse } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [health, setHealth] = useState<SystemHealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    checkBackendHealth()
      .then((data) => {
        if (mounted) {
          setHealth(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#172554] to-[#6366F1] shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-xl tracking-tight">M</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-[#172554]">
                Myvello<span className="text-[#14B8A6]">.in</span>
              </span>
              <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                Personal & Family Life Hub
              </span>
            </div>
          </Link>

          {/* Module Pill */}
          <div className="hidden md:flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <Badge variant="teal" className="gap-1 py-1">
              <CreditCard className="w-3 h-3 text-[#14B8A6]" />
              Phase 1: EMI Hub
            </Badge>
          </div>
        </div>

        {/* Right Action / System Status */}
        <div className="flex items-center gap-3">
          {/* Live API Health Check indicator */}
          <div className="hidden sm:flex items-center">
            {isLoading ? (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
                Checking API...
              </span>
            ) : health?.status === "ok" ? (
              <Badge variant="success" className="gap-1.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                API v1 Active ({health.database.status})
              </Badge>
            ) : (
              <Badge variant="danger" className="gap-1.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                API Connecting
              </Badge>
            )}
          </div>

          <Link href="/login">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary" size="sm" className="gap-1">
              Get Started
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
