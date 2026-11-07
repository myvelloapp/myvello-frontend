"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users, Shield, ArrowRight, Check, Plus, Home } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";

export default function FamilySetupPage() {
  const router = useRouter();
  const [workspaceName, setWorkspaceName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      alert(`Family workspace "${workspaceName || 'My Family'}" created successfully!`);
      router.push("/family");
    }, 800);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#172554] tracking-tight">
            Set Up Your Family Workspace
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
            A family workspace allows members of your household to coordinate loan responsibilities while keeping individual financial records completely confidential.
          </p>
        </div>

        <form onSubmit={handleCreate} className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Family Workspace Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Abdullah Family or Sharma Household"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <Shield className="w-4 h-4 text-indigo-600" />
              Privacy Model Reminder
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              You will be assigned as the <strong>Workspace Owner</strong>. You can invite your spouse, parents, or children afterwards. Loans created by any member default to private.
            </p>
          </div>

          <Button
            type="submit"
            variant="secondary"
            className="w-full h-11 text-xs font-semibold gap-2"
            isLoading={isSubmitting}
          >
            Create Family Workspace
            <ArrowRight className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
}
