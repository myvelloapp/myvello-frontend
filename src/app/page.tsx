"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CreditCard,
  Users,
  Bell,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Database,
  Server,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { checkBackendHealth, SystemHealthResponse } from "@/lib/api";

export default function HomePage() {
  const [healthData, setHealthData] = useState<SystemHealthResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoadingHealth(true);
    setErrorMsg(null);
    try {
      const data = await checkBackendHealth();
      setHealthData(data);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to connect to API");
    } finally {
      setLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200/60 bg-gradient-to-b from-white to-[#F8FAFC]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="teal" className="mb-4 px-3 py-1 gap-1.5 shadow-xs">
                <Zap className="w-3.5 h-3.5 text-[#14B8A6]" />
                Feature 01 – Project Foundation Initialized
              </Badge>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#172554] leading-[1.15]">
                Your Life. Your Records. <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#14B8A6]">
                  One Place.
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
                A personal and family digital management ecosystem designed to bring your
                monthly EMIs, loans, schedules, and important records into one unified, private platform.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="lg" variant="primary" className="gap-2 shadow-md hover:shadow-lg">
                    Initialize Workspace
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="gap-2">
                    Access Myvello
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Foundation & API Diagnostic Section */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Card 1: Live Full-Stack Status */}
              <Card className="border-indigo-100 bg-gradient-to-br from-white to-indigo-50/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base text-[#172554]">
                      <Server className="w-4 h-4 text-[#6366F1]" />
                      Backend API Pipeline
                    </CardTitle>
                    {loadingHealth ? (
                      <Badge variant="warning">Testing...</Badge>
                    ) : healthData?.status === "ok" ? (
                      <Badge variant="success">Operational</Badge>
                    ) : (
                      <Badge variant="danger">Disconnected</Badge>
                    )}
                  </div>
                  <CardDescription>
                    Laravel 12 API with Sanctum SPA authentication
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs font-mono bg-slate-900 text-slate-200 p-3 rounded-xl overflow-x-auto">
                    <div className="text-slate-400">{"// API Endpoint"}</div>
                    <div>GET /api/v1/health</div>
                    <div className="text-slate-400 pt-1">{"// Response"}</div>
                    <div className="text-emerald-400">
                      {loadingHealth ? "Querying backend..." : JSON.stringify(healthData ?? { error: errorMsg }, null, 2)}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchHealth}
                      disabled={loadingHealth}
                    >
                      Recheck Health
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Database Infrastructure */}
              <Card className="border-teal-100 bg-gradient-to-br from-white to-teal-50/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base text-[#172554]">
                      <Database className="w-4 h-4 text-[#14B8A6]" />
                      MySQL Architecture
                    </CardTitle>
                    <Badge variant="teal">InnoDB utf8mb4</Badge>
                  </div>
                  <CardDescription>
                    Strict relational schema with decimal financial precision
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Database Target</span>
                    <span className="font-mono text-slate-800">myvello (MySQL)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">User & Family Tables</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Migrated
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
                    <span className="text-slate-600 font-medium">Sanctum Token Engine</span>
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-1.5">
                    <span className="text-slate-600 font-medium">Timezone Reference</span>
                    <span className="font-mono text-slate-800">Asia/Kolkata</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card 3: Modular Phase 1 Highlights */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base text-[#172554]">
                      <ShieldCheck className="w-4 h-4 text-[#172554]" />
                      Privacy & Authorization
                    </CardTitle>
                    <Badge variant="outline">Strict RBAC</Badge>
                  </div>
                  <CardDescription>
                    Explicit user record ownership and family role rules
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Records default to <strong>Personal</strong> visibility.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Family membership never assumes automatic access to private finances.</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dual authorization checks in Laravel Policies and SPA middleware.</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Phase 1 Features Grid */}
        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-[#172554]">
                Phase 1 Functional Pillars
              </h2>
              <p className="mt-3 text-slate-600 text-sm sm:text-base">
                Everything required to record, monitor, and stay ahead of financial commitments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Feature 1 */}
              <Card className="hover:border-indigo-300">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base">EMI Management</CardTitle>
                  <CardDescription>
                    Home, Personal, Car, Gold, and Education loans with custom terms and lender details.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 2 */}
              <Card className="hover:border-teal-300">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-2">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base">Smart Schedules</CardTitle>
                  <CardDescription>
                    Automated calendar calculation with end-of-month and February leap year corrections.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 3 */}
              <Card className="hover:border-blue-300">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#172554] flex items-center justify-center mb-2">
                    <Bell className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base">Multi-Day Reminders</CardTitle>
                  <CardDescription>
                    Automated alerts 7, 3, 1 day prior, on due date, and overdue with duplicate prevention.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 4 */}
              <Card className="hover:border-amber-300">
                <CardHeader>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
                    <Users className="w-5 h-5" />
                  </div>
                  <CardTitle className="text-base">Family Workspaces</CardTitle>
                  <CardDescription>
                    Manage family records collaboratively while maintaining strict personal privacy.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
