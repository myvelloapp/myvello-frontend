"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Users,
  Shield,
  UserPlus,
  Lock,
  Eye,
  CheckCircle2,
  Mail,
  AlertCircle,
  X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { mockFamilyMembers, MockFamilyMember, currentUser } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function FamilyMembersPage() {
  const [members, setMembers] = useState<MockFamilyMember[]>(mockFamilyMembers);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Member">("Member");

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Invitation sent to ${inviteEmail} as ${inviteRole}!`);
    setIsInviteModalOpen(false);
    setInviteEmail("");
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link href="/dashboard" className="hover:text-slate-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-slate-700 font-semibold">Family Workspace</span>
        </div>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
              Sharma Family Workspace
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Collaborative family vault with strict individual financial privacy.
            </p>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsInviteModalOpen(true)}
            className="bg-[#4F46E5] hover:bg-[#4338CA] text-white rounded-xl shadow-xs gap-2 text-xs font-semibold px-4 py-2.5"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </Button>
        </div>

        {/* Critical Privacy Banner (PRD Section 3.4) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/80 border border-indigo-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Core Privacy Guarantee: Family Isolation
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed max-w-2xl">
                Being a member of the same family does <strong>not</strong> grant automatic access to another member&apos;s financial records. Personal loans remain strictly private to their owner unless explicitly flagged as <strong>Family Shared</strong>.
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white text-indigo-700 border border-indigo-200 shadow-2xs">
              <Shield className="w-3.5 h-3.5" />
              Role-Based Access
            </span>
          </div>
        </div>

        {/* Member Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4 hover:shadow-sm transition-all text-center flex flex-col justify-between"
            >
              <div>
                <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden ring-2 ring-indigo-500/20 mb-3">
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{member.name}</h3>
                <p className="text-[11px] text-slate-400 truncate">{member.email}</p>

                <div className="mt-2.5">
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                      member.role === "Owner"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                        : member.role === "Admin"
                        ? "bg-purple-50 text-purple-700 border-purple-200"
                        : "bg-slate-100 text-slate-700 border-slate-200"
                    )}
                  >
                    {member.role}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Joined:</span>
                  <span className="font-semibold text-slate-700">{member.joinedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shared Loans Access:</span>
                  <span className="font-bold text-indigo-600">2 loans</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Family Role Permissions Matrix */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Workspace Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="font-bold text-indigo-700 block">Owner (Rahul Sharma)</span>
              <p className="text-slate-500 text-[11px]">
                Full authority. Can manage workspace settings, invite/remove members, and assign roles. Transferable via secure verification.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="font-bold text-purple-700 block">Admin (Sunita Sharma)</span>
              <p className="text-slate-500 text-[11px]">
                Can invite authorized family members and view all records explicitly designated as Family Shared. Cannot delete workspace.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-2">
              <span className="font-bold text-slate-700 block">Members (Rohan & Pooja)</span>
              <p className="text-slate-500 text-[11px]">
                Access their own private EMI dashboard and view only those family commitments explicitly shared with them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Invite Family Member</h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. spouse@example.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Assigned Family Role
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as "Admin" | "Member")}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                >
                  <option value="Member">Member (View Personal + Shared Records)</option>
                  <option value="Admin">Admin (Can Manage Shared Vault)</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-[11px] text-slate-500">
                An invitation token will be emailed. They will create their own password or sign in with Google.
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsInviteModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="secondary" size="sm">
                  Send Invitation
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
