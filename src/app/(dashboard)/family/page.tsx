"use client";

import React, { useEffect, useState, useCallback, Suspense, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UserPlus,
  Mail,
  AlertCircle,
  X,
  Trash2,
  CheckCircle2,
  Check,
  Copy,
  Users,
  CreditCard,
  Edit2,
  Plus,
  LogOut,
  UserMinus,
  Sparkles,
  Link as LinkIcon,
  MessageCircle,
  MoreHorizontal,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  familyService,
  FamilyDetail,
  FamilySummary,
  IncomingInvitationItem,
} from "@/services/familyService";
import { useAuth } from "@/modules/authentication/AuthContext";
import { useWorkspace } from "@/context/WorkspaceContext";
import { formatCurrency } from "@/lib/formatters";
import { getCategoryIcon, getCategoryBgClass } from "@/lib/categoryConfig";
import { cn } from "@/lib/utils";

// Deep-equality comparison to avoid unnecessary React re-renders on silent updates
function areFamiliesEqual(a: FamilySummary[], b: FamilySummary[]): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (
      a[i].id !== b[i].id ||
      a[i].name !== b[i].name ||
      a[i].members_count !== b[i].members_count ||
      a[i].my_role !== b[i].my_role ||
      a[i].is_owner !== b[i].is_owner
    ) {
      return false;
    }
  }

  return true;
}

function areFamilyDetailsEqual(a: FamilyDetail | null, b: FamilyDetail | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;

  if (
    a.id !== b.id ||
    a.name !== b.name ||
    a.invite_code !== b.invite_code ||
    a.my_role !== b.my_role ||
    a.is_owner !== b.is_owner ||
    a.is_admin !== b.is_admin
  ) {
    return false;
  }

  // Members comparison
  const aMembers = a.members || [];
  const bMembers = b.members || [];
  if (aMembers.length !== bMembers.length) return false;
  for (let i = 0; i < aMembers.length; i++) {
    if (
      aMembers[i].id !== bMembers[i].id ||
      aMembers[i].role !== bMembers[i].role ||
      aMembers[i].name !== bMembers[i].name ||
      aMembers[i].email !== bMembers[i].email
    ) {
      return false;
    }
  }

  // Shared EMIs comparison
  const aEmis = a.shared_emis || [];
  const bEmis = b.shared_emis || [];
  if (aEmis.length !== bEmis.length) return false;
  for (let i = 0; i < aEmis.length; i++) {
    if (
      aEmis[i].id !== bEmis[i].id ||
      aEmis[i].emi_amount !== bEmis[i].emi_amount ||
      aEmis[i].outstanding_principal !== bEmis[i].outstanding_principal ||
      aEmis[i].status !== bEmis[i].status
    ) {
      return false;
    }
  }

  return true;
}

// High-fidelity shimmer skeleton matching exact 2-column page geometry to guarantee zero layout shift (CLS = 0)
export function FamilyWorkspaceSkeleton() {
  return (
    <div className="space-y-2.5 sm:space-y-5 animate-pulse">
      {/* 1. Page Header Skeleton */}
      {/* Mobile Skeleton: Single compact row */}
      <div className="sm:hidden flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <div className="h-7 w-40 bg-slate-200/80 rounded-xl" />
          <div className="h-5 w-14 bg-slate-200/60 rounded-full" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-slate-200/70 shrink-0" />
          <div className="h-9 w-20 rounded-[12px] bg-slate-200/70 shrink-0" />
        </div>
      </div>

      {/* Desktop Skeleton: Spacious layout */}
      <div className="hidden sm:flex sm:items-start justify-between gap-4">
        <div className="space-y-2.5 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="h-8 w-56 bg-slate-200/80 rounded-xl" />
            <div className="h-6 w-16 bg-slate-200/60 rounded-full" />
          </div>
          <div className="p-1 rounded-[8px] bg-slate-100 flex items-center gap-1 w-auto">
            <div className="h-8.5 w-32 bg-white rounded-[6px] shadow-2xs shrink-0" />
            <div className="h-8.5 w-28 bg-slate-200/60 rounded-[6px] shrink-0" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-9.5 w-28 bg-slate-200/70 rounded-[8px]" />
          <div className="h-9.5 w-28 bg-slate-200/70 rounded-[8px]" />
          <div className="h-9.5 w-9.5 bg-slate-200/70 rounded-[8px] shrink-0" />
        </div>
      </div>

      {/* 2-Column Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
        {/* Left Column (8 cols): Financial Metrics & Shared Loans */}
        <div className="lg:col-span-8 space-y-4">
          {/* 2-Stat Row */}
          <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
            <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="h-3 w-28 sm:w-32 bg-slate-200/60 rounded" />
              <div className="h-7 w-28 sm:w-36 bg-slate-200/80 rounded" />
              <div className="h-3 w-20 sm:w-28 bg-slate-200/50 rounded" />
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="h-3 w-24 sm:w-28 bg-slate-200/60 rounded" />
              <div className="h-7 w-28 sm:w-36 bg-slate-200/80 rounded" />
              <div className="h-3 w-20 sm:w-28 bg-slate-200/50 rounded" />
            </div>
          </div>

          {/* Shared Loans Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-5 w-32 bg-slate-200/80 rounded" />
              <div className="h-4 w-20 bg-slate-200/60 rounded" />
            </div>

            <div className="space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-3.5 sm:p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-200/80 shrink-0" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-32 sm:w-40 bg-slate-200/80 rounded" />
                      <div className="h-3 w-20 sm:w-24 bg-slate-200/50 rounded" />
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <div className="h-4 w-16 sm:w-20 bg-slate-200/80 rounded ml-auto" />
                    <div className="h-3 w-12 sm:w-16 bg-slate-200/50 rounded ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Invite Code & Members */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="h-3 w-28 bg-slate-200/60 rounded" />
              <div className="h-4 w-16 bg-slate-200/60 rounded-full" />
            </div>
            <div className="h-11 sm:h-10 w-full bg-slate-100 rounded-xl" />
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200/80 rounded" />
              <div className="h-4 w-12 bg-slate-200/60 rounded" />
            </div>

            <div className="divide-y divide-slate-100">
              {[1, 2, 3].map((i) => (
                <div key={i} className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-slate-200/80 shrink-0" />
                    <div className="space-y-1">
                      <div className="h-3.5 w-24 bg-slate-200/80 rounded" />
                      <div className="h-3 w-32 bg-slate-200/50 rounded" />
                    </div>
                  </div>
                  <div className="h-5 w-14 bg-slate-200/60 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FamilyPageContent({ embedded = false }: { embedded?: boolean } = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { activeWorkspace, switchWorkspace, refreshWorkspaces } = useWorkspace();

  const [families, setFamilies] = useState<FamilySummary[]>([]);
  const [activeFamilyId, setActiveFamilyId] = useState<number | null>(null);
  const [activeFamily, setActiveFamily] = useState<FamilyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Dropdown options menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMenuOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Incoming invitations
  const [myInvitations, setMyInvitations] = useState<IncomingInvitationItem[]>([]);
  const [selectedInviteId, setSelectedInviteId] = useState<number | null>(null);
  const [isAcceptingInviteId, setIsAcceptingInviteId] = useState<number | null>(null);
  const [isDecliningInviteId, setIsDecliningInviteId] = useState<number | null>(null);

  // Computed: currently selected pending invitation tab (if user clicked an invited group)
  const selectedInvite = useMemo(
    () => (selectedInviteId ? myInvitations.find((i) => i.id === selectedInviteId) || null : null),
    [selectedInviteId, myInvitations]
  );

  // Scoped: invitations to display ONLY under the currently selected group tab
  const visibleInvitations = useMemo(() => {
    if (selectedInvite) return [selectedInvite];
    if (activeFamily) return myInvitations.filter((inv) => inv.family_id === activeFamily.id);
    return [];
  }, [selectedInvite, activeFamily, myInvitations]);

  // Client mounting for Portal modals
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Modal states
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"admin" | "member">("member");
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [inviteSuccessMessage, setInviteSuccessMessage] = useState<string | null>(null);
  const [lastGeneratedToken, setLastGeneratedToken] = useState<string | null>(null);
  const [lastInvitedEmail, setLastInvitedEmail] = useState<string | null>(null);

  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinToken, setJoinToken] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newFamilyName, setNewFamilyName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletingFamily, setIsDeletingFamily] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLeavingFamily, setIsLeavingFamily] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);

  const [memberToRemove, setMemberToRemove] = useState<{ id: number; name: string } | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [removeMemberError, setRemoveMemberError] = useState<string | null>(null);

  // Close modals on Escape key
  useEffect(() => {
    if (!isJoinModalOpen && !isInviteModalOpen && !isRenameModalOpen && !isDeleteModalOpen && !isLeaveModalOpen && !memberToRemove) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isJoinModalOpen && !isJoining) setIsJoinModalOpen(false);
        if (isInviteModalOpen && !isSendingInvite) setIsInviteModalOpen(false);
        if (isRenameModalOpen && !isRenaming) setIsRenameModalOpen(false);
        if (isDeleteModalOpen && !isDeletingFamily) setIsDeleteModalOpen(false);
        if (isLeaveModalOpen && !isLeavingFamily) setIsLeaveModalOpen(false);
        if (memberToRemove && !isRemovingMember) setMemberToRemove(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isJoinModalOpen, isJoining, isInviteModalOpen, isSendingInvite, isRenameModalOpen, isRenaming, isDeleteModalOpen, isDeletingFamily, isLeaveModalOpen, isLeavingFamily, memberToRemove, isRemovingMember]);

  const showToast = (_msg?: string) => {};


  // Check URL query parameters for invitation token, workspace code, or direct invitation ID
  useEffect(() => {
    const tokenParam =
      searchParams.get("token") ||
      searchParams.get("accept_token") ||
      searchParams.get("code");
    if (tokenParam) {
      setJoinToken(tokenParam);
      setIsJoinModalOpen(true);
    }

    const inviteIdParam = searchParams.get("invitation_id");
    if (inviteIdParam) {
      setSelectedInviteId(Number(inviteIdParam));
    }
  }, [searchParams]);

  const activeFamilyRef = useRef<FamilyDetail | null>(null);
  activeFamilyRef.current = activeFamily;
  const activeFamilyIdRef = useRef<number | null>(null);
  activeFamilyIdRef.current = activeFamilyId;
  const isRequestInProgressRef = useRef(false);

  // Load families and incoming invitations
  const loadFamilies = useCallback(
    async (preferredFamilyId?: number, isSilent = false) => {
      if (isRequestInProgressRef.current) return;
      isRequestInProgressRef.current = true;

      if (!isSilent && !activeFamilyRef.current) setIsLoading(true);

      try {
        const [familyList, incomingInvites] = await Promise.all([
          familyService.getFamilies(),
          familyService.getMyInvitations().catch(() => [] as IncomingInvitationItem[]),
        ]);

        setFamilies((prev) => (areFamiliesEqual(prev, familyList) ? prev : familyList));
        setMyInvitations(incomingInvites);

        if (familyList.length > 0) {
          const workspaceFamilyId =
            typeof activeWorkspace.id === "number" && familyList.some((f) => f.id === activeWorkspace.id)
              ? activeWorkspace.id
              : undefined;

          const targetId =
            (preferredFamilyId && familyList.some((f) => f.id === preferredFamilyId) ? preferredFamilyId : undefined) ||
            workspaceFamilyId ||
            (activeFamilyIdRef.current && familyList.some((f) => f.id === activeFamilyIdRef.current)
              ? activeFamilyIdRef.current
              : familyList[0].id);

          setActiveFamilyId(targetId);
          const details = await familyService.getFamily(targetId);
          setActiveFamily((prev) => (areFamilyDetailsEqual(prev, details) ? prev : details));
          setNewFamilyName(details.name);
          setError(null);
        } else {
          setActiveFamilyId(null);
          setActiveFamily(null);
          setError(null);
          if (incomingInvites.length > 0) {
            setSelectedInviteId((prev) => prev ?? incomingInvites[0].id);
          }
        }
      } catch (err) {
        console.warn("Failed to load family workspace:", err);
        // Only show fatal error banner if we don't have an active family already loaded
        if (!isSilent && !activeFamilyRef.current) {
          setError("Unable to load household workspace. Please verify your connection.");
        }
      } finally {
        isRequestInProgressRef.current = false;
        if (!isSilent) setIsLoading(false);
      }
    },
    [activeWorkspace.id]
  );

  useEffect(() => {
    loadFamilies();
  }, [loadFamilies]);

  // Silent revalidation on events and focus (no rapid 4s polling)
  useEffect(() => {
    const handleRefresh = () => loadFamilies(undefined, true);
    window.addEventListener("myvello:refresh_family", handleRefresh);
    window.addEventListener("myvello:live_data_update", handleRefresh);
    window.addEventListener("focus", handleRefresh);

    return () => {
      window.removeEventListener("myvello:refresh_family", handleRefresh);
      window.removeEventListener("myvello:live_data_update", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
    };
  }, [loadFamilies]);

  // Switch active family workspace
  const handleSelectFamily = async (id: number) => {
    setSelectedInviteId(null);
    if (id === activeFamilyId && activeFamily) return;
    setError(null);
    setActiveFamilyId(id);
    switchWorkspace(id);
    try {
      const details = await familyService.getFamily(id);
      setActiveFamily((prev) => (areFamilyDetailsEqual(prev, details) ? prev : details));
      setNewFamilyName(details.name);
      setError(null);
    } catch {
      showToast("Failed to switch workspace.");
    }
  };

  // Accept incoming invitation
  const handleAcceptIncomingInvite = async (invitationId: number) => {
    setIsAcceptingInviteId(invitationId);
    try {
      const res = await familyService.acceptInvitationById(invitationId);
      showToast(res.family_name ? `Joined '${res.family_name}'!` : "Invitation accepted!");
      setMyInvitations((prev) => prev.filter((i) => i.id !== invitationId));
      setSelectedInviteId(null);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("myvello:refresh_notifications"));
      }
      await refreshWorkspaces();
      if (res.family_id) {
        switchWorkspace(res.family_id);
      }
      await loadFamilies(res.family_id);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      showToast(errorObj.response?.data?.message || "Failed to accept invitation.");
    } finally {
      setIsAcceptingInviteId(null);
    }
  };

  // Decline incoming invitation
  const handleDeclineIncomingInvite = async (invitationId: number) => {
    setIsDecliningInviteId(invitationId);
    try {
      await familyService.declineInvitationById(invitationId);
      showToast("Invitation declined.");
      setMyInvitations((prev) => prev.filter((i) => i.id !== invitationId));
      setSelectedInviteId(null);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("myvello:refresh_notifications"));
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      showToast(errorObj.response?.data?.message || "Failed to decline invitation.");
    } finally {
      setIsDecliningInviteId(null);
    }
  };

  // Send member invitation
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFamily) return;

    setIsSendingInvite(true);
    setInviteSuccessMessage(null);
    setLastGeneratedToken(null);
    try {
      const result = await familyService.inviteMember(
        activeFamily.id,
        inviteEmail.trim(),
        inviteRole
      );
      setInviteSuccessMessage(`Invitation created for ${result.email}!`);
      setLastGeneratedToken(result.invitation_token);
      setLastInvitedEmail(result.email);
      setInviteEmail("");

      const refreshed = await familyService.getFamily(activeFamily.id);
      setActiveFamily(refreshed);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      showToast(errorObj.response?.data?.message || "Failed to send invitation.");
    } finally {
      setIsSendingInvite(false);
    }
  };

  // Cancel pending invitation
  const handleCancelInvite = async (invitationId: number) => {
    if (!activeFamily) return;
    try {
      await familyService.cancelInvitation(activeFamily.id, invitationId);
      showToast("Invitation cancelled.");
      const refreshed = await familyService.getFamily(activeFamily.id);
      setActiveFamily(refreshed);
    } catch {
      showToast("Failed to cancel invitation.");
    }
  };

  // Join family with code
  const handleJoinFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinToken.trim()) return;

    setIsJoining(true);
    setJoinError(null);
    try {
      const res = await familyService.acceptInvitation(joinToken.trim());
      showToast(`Joined '${res.family_name}'!`);
      setIsJoinModalOpen(false);
      setJoinToken("");
      await refreshWorkspaces();
      await loadFamilies(res.family_id);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      setJoinError(
        errorObj.response?.data?.message ||
          "Invalid or expired invitation token. Ensure you are signed in with the invited email."
      );
    } finally {
      setIsJoining(false);
    }
  };

  // Rename family
  const handleRenameFamily = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFamily || !newFamilyName.trim()) return;

    setIsRenaming(true);
    try {
      await familyService.updateFamily(activeFamily.id, newFamilyName.trim());
      await refreshWorkspaces();
      showToast("Workspace renamed successfully.");
      setIsRenameModalOpen(false);
      await loadFamilies(activeFamily.id);
    } catch {
      showToast("Failed to rename workspace.");
    } finally {
      setIsRenaming(false);
    }
  };

  // Leave family
  const handleConfirmLeaveFamily = async () => {
    if (!activeFamily) return;

    setIsLeavingFamily(true);
    setLeaveError(null);
    try {
      await familyService.leaveFamily(activeFamily.id);
      await refreshWorkspaces();
      showToast(`Left '${activeFamily.name}'`);
      setIsLeaveModalOpen(false);
      switchWorkspace("personal");
      await loadFamilies();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const message = errorObj.response?.data?.message || "Failed to leave workspace.";
      setLeaveError(message);
      showToast(message);
    } finally {
      setIsLeavingFamily(false);
    }
  };

  // Delete family workspace (owner only)
  const handleDeleteFamily = async () => {
    if (!activeFamily) return;

    setIsDeletingFamily(true);
    setDeleteError(null);
    try {
      await familyService.deleteFamily(activeFamily.id);
      showToast(`Workspace '${activeFamily.name}' deleted.`);
      setIsDeleteModalOpen(false);

      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("myvello:refresh_family"));
        window.dispatchEvent(new CustomEvent("myvello:refresh_workspaces"));
      }

      switchWorkspace("personal");
      await refreshWorkspaces();
      await loadFamilies();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const message = errorObj.response?.data?.message || "Failed to delete workspace.";
      setDeleteError(message);
      showToast(message);
    } finally {
      setIsDeletingFamily(false);
    }
  };

  // Remove member
  const handleConfirmRemoveMember = async () => {
    if (!activeFamily || !memberToRemove) return;

    setIsRemovingMember(true);
    setRemoveMemberError(null);
    try {
      await familyService.removeMember(activeFamily.id, memberToRemove.id);
      showToast(`${memberToRemove.name} removed.`);
      setMemberToRemove(null);
      const refreshed = await familyService.getFamily(activeFamily.id);
      setActiveFamily(refreshed);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const message = errorObj.response?.data?.message || "Failed to remove member.";
      setRemoveMemberError(message);
      showToast(message);
    } finally {
      setIsRemovingMember(false);
    }
  };

  // Calculated Metrics
  const stats = useMemo(() => {
    if (!activeFamily) return { totalEmi: 0, totalPrincipal: 0, loanCount: 0, memberCount: 0 };
    const totalEmi = (activeFamily.shared_emis || []).reduce((acc, curr) => acc + (curr.emi_amount || 0), 0);
    const totalPrincipal = (activeFamily.shared_emis || []).reduce(
      (acc, curr) => acc + (curr.outstanding_principal || 0),
      0
    );
    return {
      totalEmi,
      totalPrincipal,
      loanCount: activeFamily.shared_emis?.length || 0,
      memberCount: activeFamily.members.length,
    };
  }, [activeFamily]);

  const copyInviteUrl = (token: string) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/family?token=${token}`;
    navigator.clipboard.writeText(url);
    showToast("Invite link copied to clipboard!");
  };

  const getWhatsAppInviteMessage = (params: {
    familyName: string;
    inviteCode?: string | null;
    token?: string | null;
  }) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://myvello.life";
    const joinUrl = params.token
      ? `${origin}/family?token=${params.token}`
      : params.inviteCode
      ? `${origin}/family?code=${params.inviteCode}`
      : `${origin}/family`;

    const codeSnippet = params.inviteCode
      ? `\n🔑 *Or enter Code in-app:*\n*${params.inviteCode}*\n`
      : "";

    return (
`👋 *You've been invited to join '${params.familyName}' on Myvello!*

Collaborate on our shared household loans and pooled monthly repayment schedules together.

Tap here to join:
${joinUrl}
${codeSnippet}
_Myvello — Your Life. Your Records. One Place._`
    );
  };

  if (isLoading && !activeFamily && !error) {
    if (embedded) {
      return (
        <div className="space-y-2.5 sm:space-y-5">
          <FamilyWorkspaceSkeleton />
        </div>
      );
    }
    return (
      <DashboardLayout>
        <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
          <div className="relative z-10 max-w-[1500px] mx-auto space-y-2.5 sm:space-y-5">
            <FamilyWorkspaceSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const pageBody = (
    <>
      <div
        className={cn(
          "space-y-2.5 sm:space-y-5 select-none",
          !embedded &&
            "relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden min-h-dvh"
        )}
      >
      <div
        className={cn(
          "max-w-[1500px] mx-auto space-y-2.5 sm:space-y-5",
          !embedded && "relative z-10"
        )}
      >
        {/* 1. Page Header (shown when active group or pending invite exists) */}
        {(activeFamily || selectedInvite) && (
          <>
            {/* Mobile Header (sm:hidden): Sleek single compact row with 3-dot dropdown popover & primary action */}
            <div className="sm:hidden flex items-center justify-between gap-2.5 min-h-[36px]">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#02361B] truncate">
                  {selectedInvite ? selectedInvite.family_name : activeFamily?.name}
                </h1>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-black capitalize shrink-0 border",
                  selectedInvite
                    ? "bg-amber-50 text-amber-800 border-amber-200"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                )}>
                  {selectedInvite ? "Pending Invite" : activeFamily?.my_role}
                </span>
              </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* 3-Dot Options & Groups Menu Trigger */}
            <div ref={mobileMenuRef} className="relative shrink-0">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Group options"
                aria-expanded={isMobileMenuOpen}
                className={cn(
                  "w-9 h-9 rounded-full border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation",
                  isMobileMenuOpen && "bg-slate-100 border-emerald-300 ring-2 ring-emerald-500/20"
                )}
              >
                <MoreHorizontal className="w-5 h-5 text-slate-700" />
              </button>

              {/* Mobile Dropdown Menu Popover matching other screens */}
              {isMobileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 z-40 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                  {/* Top Pointer Tip Arrow */}
                  <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-slate-200/90 rotate-45 z-10" />

                  <div className="relative z-20 space-y-0.5">
                    {/* Groups Switcher (if user belongs to multiple groups or has pending invites) */}
                    {(families.length > 1 || myInvitations.length > 0) && (
                      <>
                        <div className="px-3 pt-1.5 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Switch Group
                        </div>
                        {families.map((f) => {
                          const isSelected = selectedInviteId === null && f.id === activeFamilyId;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setSelectedInviteId(null);
                                handleSelectFamily(f.id);
                              }}
                              className={cn(
                                "w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center justify-between gap-2.5 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation",
                                isSelected
                                  ? "bg-emerald-50 text-emerald-800 font-bold"
                                  : "text-slate-700 hover:text-emerald-700 hover:bg-slate-50"
                              )}
                            >
                              <div className="flex items-center gap-2 min-w-0 truncate">
                                <Users className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-emerald-700" : "text-slate-400")} />
                                <span className="truncate">{f.name}</span>
                              </div>
                              <span
                                className={cn(
                                  "px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0",
                                  isSelected ? "bg-emerald-700 text-white" : "bg-slate-100 text-slate-500"
                                )}
                              >
                                {f.members_count}
                              </span>
                            </button>
                          );
                        })}

                        {myInvitations.map((inv) => {
                          const isSelected = selectedInviteId === inv.id;
                          return (
                            <button
                              key={`mob-invite-${inv.id}`}
                              type="button"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setSelectedInviteId(inv.id);
                              }}
                              className={cn(
                                "w-full px-3 py-2 text-left text-xs font-semibold rounded-xl flex items-center justify-between gap-2.5 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation",
                                isSelected
                                  ? "bg-amber-100 text-amber-900 font-bold"
                                  : "text-amber-800 hover:text-amber-900 hover:bg-amber-50"
                              )}
                            >
                              <div className="flex items-center gap-2 min-w-0 truncate">
                                <Sparkles className={cn("w-3.5 h-3.5 shrink-0", isSelected ? "text-amber-700" : "text-amber-500")} />
                                <span className="truncate">{inv.family_name}</span>
                              </div>
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 bg-amber-200 text-amber-900">
                                Invite
                              </span>
                            </button>
                          );
                        })}
                        <div className="h-px bg-slate-100 my-1" />
                      </>
                    )}

                    {/* Active Group Actions */}
                    {activeFamily && !selectedInvite && (
                      <>
                        <Link
                          href="/emis/new"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                        >
                          <Plus className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Share a Loan</span>
                        </Link>

                        {activeFamily.is_owner && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setIsRenameModalOpen(true);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                          >
                            <Edit2 className="w-4 h-4 text-slate-500 shrink-0" />
                            <span>Rename Group</span>
                          </button>
                        )}
                      </>
                    )}

                    {/* Create New Group */}
                    <Link
                      href="/family/setup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                    >
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Create New Group</span>
                    </Link>

                    {/* Join with Code */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsJoinModalOpen(true);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                    >
                      <LinkIcon className="w-4 h-4 text-slate-500 shrink-0" />
                      <span>Join with Code</span>
                    </button>

                    {/* Danger: Leave / Delete (Only for active groups) */}
                    {activeFamily && !selectedInvite && (
                      <>
                        <div className="h-px bg-slate-100 my-1" />
                        {!activeFamily.is_owner ? (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setLeaveError(null);
                              setIsLeaveModalOpen(true);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                          >
                            <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>Leave Group</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsMobileMenuOpen(false);
                              setDeleteError(null);
                              setIsDeleteModalOpen(true);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors cursor-pointer active:scale-[0.98] touch-manipulation"
                          >
                            <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
                            <span>Delete Group</span>
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Primary Action Button: Accept invite on mobile, or Invite Member */}
            {selectedInvite ? (
              <button
                type="button"
                disabled={isAcceptingInviteId === selectedInvite.id}
                onClick={() => handleAcceptIncomingInvite(selectedInvite.id)}
                className="h-9 px-3.5 rounded-[12px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0 disabled:opacity-60"
              >
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>{isAcceptingInviteId === selectedInvite.id ? "Joining..." : "Accept"}</span>
              </button>
            ) : activeFamily && (activeFamily.is_owner || activeFamily.is_admin) ? (
              <button
                type="button"
                onClick={() => {
                  setInviteSuccessMessage(null);
                  setLastGeneratedToken(null);
                  setIsInviteModalOpen(true);
                }}
                className="h-9 px-3.5 rounded-[12px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Invite</span>
              </button>
            ) : activeFamily ? (
              <Link href="/emis/new" className="inline-block shrink-0">
                <button
                  type="button"
                  className="h-9 px-3.5 rounded-[12px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Share Loan</span>
                </button>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Desktop Header (hidden sm:flex): Spacious title, segmented workspace tabs, and full action row */}
        <div className="hidden sm:flex sm:items-start justify-between gap-4">
          <div className="space-y-2.5 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-[#02361B] truncate">
                {selectedInvite ? selectedInvite.family_name : activeFamily?.name}
              </h1>

              {/* Role Badge */}
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold capitalize shrink-0 border",
                selectedInvite
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
              )}>
                {selectedInvite ? "Pending Invitation" : activeFamily?.my_role}
              </span>
            </div>

            {/* Segmented Workspace Tabs on Desktop */}
            {(families.length > 1 || myInvitations.length > 0) && (
              <div className="p-1 rounded-[8px] bg-white border border-slate-200/80 shadow-2xs flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
                {families.map((f) => {
                  const isSelected = selectedInviteId === null && f.id === activeFamilyId;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setSelectedInviteId(null);
                        handleSelectFamily(f.id);
                      }}
                      className={cn(
                        "min-h-[34px] px-3.5 py-1.5 rounded-[6px] text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap active:scale-95 touch-manipulation",
                        isSelected
                          ? "btn-gradient-glow text-white font-bold shadow-xs shadow-emerald-500/25"
                          : "text-slate-600 hover:text-slate-900 font-semibold hover:bg-slate-100/70"
                      )}
                    >
                      <Users className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-slate-400")} />
                      <span>{f.name}</span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                          isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                        )}
                      >
                        {f.members_count}
                      </span>
                    </button>
                  );
                })}

                {/* Pending Invited Group Tabs */}
                {myInvitations.map((inv) => {
                  const isSelected = selectedInviteId === inv.id;
                  return (
                    <button
                      key={`invite-${inv.id}`}
                      type="button"
                      onClick={() => setSelectedInviteId(inv.id)}
                      className={cn(
                        "min-h-[34px] px-3.5 py-1.5 rounded-[6px] text-xs transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap active:scale-95 touch-manipulation",
                        isSelected
                          ? "btn-gradient-glow text-white font-bold shadow-xs shadow-emerald-500/25"
                          : "text-amber-800 bg-amber-50/70 border border-amber-200/60 hover:bg-amber-100/70 font-semibold"
                      )}
                    >
                      <Sparkles className={cn("w-3.5 h-3.5", isSelected ? "text-white" : "text-amber-600")} />
                      <span>{inv.family_name}</span>
                      <span
                        className={cn(
                          "px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none",
                          isSelected ? "bg-white/20 text-white" : "bg-amber-200/80 text-amber-900"
                        )}
                      >
                        Invite
                      </span>
                    </button>
                  );
                })}

                <Link
                  href="/family/setup"
                  className="min-h-[34px] px-3 py-1.5 rounded-[6px] text-xs font-semibold text-emerald-700 hover:bg-emerald-50/80 transition-all flex items-center gap-1 whitespace-nowrap ml-0.5 cursor-pointer active:scale-95 touch-manipulation shrink-0"
                  title="Create a new group"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </Link>
              </div>
            )}
          </div>

          {/* Quick Header Actions on Desktop */}
          <div className="flex items-center gap-2">
            {!selectedInvite && (
              <>
                {activeFamily && (activeFamily.is_owner || activeFamily.is_admin) && (
                  <button
                    type="button"
                    onClick={() => {
                      setInviteSuccessMessage(null);
                      setLastGeneratedToken(null);
                      setIsInviteModalOpen(true);
                    }}
                    className="min-h-[38px] h-9.5 px-4 rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Invite Member</span>
                  </button>
                )}

                {activeFamily && (
                  <Link href="/emis/new">
                    <button
                      type="button"
                      className="min-h-[38px] h-9.5 px-4 rounded-[8px] border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Share a Loan</span>
                    </button>
                  </Link>
                )}
              </>
            )}

            {/* Discreet Options Menu */}
            {activeFamily && !selectedInvite && (
              <div ref={menuRef} className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="min-h-[38px] min-w-[38px] h-9.5 w-9.5 rounded-[8px] border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
                  title="Group settings & options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>

                {isMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-40 animate-in fade-in zoom-in-95">
                    {activeFamily.is_owner && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsRenameModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer active:bg-slate-100 touch-manipulation"
                      >
                        <Edit2 className="w-4 h-4 text-slate-400" />
                        <span>Rename Group</span>
                      </button>
                    )}

                    <Link
                      href="/family/setup"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors active:bg-slate-100 touch-manipulation"
                    >
                      <Plus className="w-4 h-4 text-slate-400" />
                      <span>Create New Group</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsJoinModalOpen(true);
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer active:bg-slate-100 touch-manipulation"
                    >
                      <LinkIcon className="w-4 h-4 text-slate-400" />
                      <span>Join with Code</span>
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    {!activeFamily.is_owner ? (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setLeaveError(null);
                          setIsLeaveModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer active:bg-rose-100 touch-manipulation"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Leave Group</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setDeleteError(null);
                          setIsDeleteModalOpen(true);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer active:bg-rose-100 touch-manipulation"
                      >
                        <Trash2 className="w-4 h-4 text-rose-500 shrink-0" />
                        <span>Delete Group</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
          </>
        )}

        {/* 2. Pending Incoming Invitations Banner (Displayed ONLY under the currently selected group) */}
        {visibleInvitations.length > 0 && (
          <div className="bg-white rounded-2xl border border-emerald-200/80 p-4 sm:p-5 shadow-xs space-y-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-700" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Pending Invitations ({visibleInvitations.length})
              </h3>
            </div>

            <div className="space-y-2.5">
              {visibleInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 sm:p-4 rounded-xl bg-emerald-50/40 border border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs font-bold text-slate-800">
                      <strong>{inv.invited_by_name}</strong> invited you to join{" "}
                      <strong className="text-emerald-700">&apos;{inv.family_name}&apos;</strong> group
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">Role: {inv.role}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={isAcceptingInviteId === inv.id || isDecliningInviteId === inv.id}
                      onClick={() => handleAcceptIncomingInvite(inv.id)}
                      className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] h-11 sm:h-9 px-4 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-xs active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1 disabled:opacity-60"
                    >
                      {isAcceptingInviteId === inv.id ? "Joining..." : "Accept"}
                    </button>
                    <button
                      type="button"
                      disabled={isAcceptingInviteId === inv.id || isDecliningInviteId === inv.id}
                      onClick={() => handleDeclineIncomingInvite(inv.id)}
                      className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] h-11 sm:h-9 px-3.5 rounded-xl sm:rounded-[8px] border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-all cursor-pointer active:scale-95 touch-manipulation justify-center inline-flex items-center disabled:opacity-60"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Alert (only show when there is no active group loaded) */}
        {!isLoading && error && !activeFamily && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 3. Empty State: No Group Created Yet and No Pending Invites */}
        {!isLoading && !activeFamily && !selectedInvite && !error && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-12 text-center max-w-xl mx-auto shadow-2xs space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto text-emerald-700 shadow-2xs">
              <Users className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg sm:text-xl font-black text-[#02361B]">
                Start a Shared Group
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                Coordinate joint car loans, shared family EMIs, partner commitments, and joint documents. Your personal records remain completely confidential in your Private Vault.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full">
              <Link href="/family/setup" className="w-full sm:w-auto">
                <button
                  type="button"
                  className="w-full sm:w-auto min-h-[44px] h-11 sm:h-10 px-5 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 touch-manipulation transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Create Group</span>
                </button>
              </Link>
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(true)}
                className="w-full sm:w-auto min-h-[44px] h-11 sm:h-10 px-5 rounded-xl sm:rounded-[8px] border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation inline-flex items-center justify-center gap-1.5"
              >
                <LinkIcon className="w-3.5 h-3.5 text-slate-400" />
                <span>Join with Code</span>
              </button>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Zero Personal Exposure: Only loans and documents you explicitly share become visible.</span>
            </div>
          </div>
        )}

        {/* 4. Active Workspace Content: Clean 2-Column Architecture (Hidden when viewing pending invitation) */}
        {!isLoading && !selectedInvite && activeFamily && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Left Column (8 cols): Shared Loans & Financial Metrics */}
            <div className="lg:col-span-8 space-y-4">
              {/* Minimal 2-Stat Row */}
              <div className="grid grid-cols-2 gap-3 sm:gap-3.5">
                <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Combined Monthly EMI
                  </span>
                  <div className="text-lg sm:text-2xl font-black text-[#02361B] truncate tracking-tight">
                    {formatCurrency(stats.totalEmi)}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block truncate">
                    Across {stats.loanCount} shared {stats.loanCount === 1 ? "loan" : "loans"}
                  </span>
                </div>

                <div className="p-3.5 sm:p-4 rounded-2xl sm:rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Total Shared Debt
                  </span>
                  <div className="text-lg sm:text-2xl font-black text-[#02361B] truncate tracking-tight">
                    {formatCurrency(stats.totalPrincipal)}
                  </div>
                  <span className="text-[10px] sm:text-[11px] text-slate-500 font-medium block truncate">
                    Remaining joint principal
                  </span>
                </div>
              </div>

              {/* Shared Loans Section */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-black text-[#02361B]">
                      Shared Loans ({stats.loanCount})
                    </h3>
                  </div>

                  <Link
                    href="/emis/new"
                    className="min-h-[44px] px-2.5 py-1.5 -mr-2.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 transition-colors active:scale-95 touch-manipulation cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Loan</span>
                  </Link>
                </div>

                {activeFamily.shared_emis && activeFamily.shared_emis.length > 0 ? (
                  <div className="space-y-2.5">
                    {activeFamily.shared_emis.map((loan) => (
                      <Link
                        key={loan.id}
                        href={`/emis/${loan.id}`}
                        className="p-3.5 sm:p-4 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-emerald-50/20 bg-slate-50/50 transition-all flex items-center justify-between gap-3 group cursor-pointer active:scale-[0.98] touch-manipulation"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border border-slate-200/80 shadow-2xs",
                              getCategoryBgClass(loan.loan_category)
                            )}
                          >
                            {getCategoryIcon(loan.loan_category, "w-5 h-5")}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                              <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-emerald-700 transition-colors truncate">
                                {loan.loan_name}
                              </h4>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200/60 shrink-0">
                                {loan.lender_name}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                              Shared by <span className="font-semibold text-slate-600">{loan.created_by}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <div className="text-xs sm:text-sm font-black text-[#02361B]">
                              {formatCurrency(loan.emi_amount)}
                              <span className="text-[10px] font-normal text-slate-400">/mo</span>
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                              Bal: {formatCurrency(loan.outstanding_principal)}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300 sm:hidden shrink-0 group-hover:text-emerald-700 transition-colors" />
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-10 text-center space-y-2.5">
                    <CreditCard className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No shared loans yet</p>
                    <p className="text-[11px] text-slate-400 max-w-xs mx-auto leading-relaxed">
                      Loans you mark as &quot;Group Shared&quot; will appear here for all group members to monitor together.
                    </p>
                    <div className="pt-1">
                      <Link href="/emis/new">
                        <button
                          type="button"
                          className="min-h-[44px] h-11 sm:h-9 px-4 rounded-xl sm:rounded-lg btn-gradient-glow text-white text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5 active:scale-95 touch-manipulation"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Share a Loan</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column (4 cols): Members & Direct Group Code */}
            <div className="lg:col-span-4 space-y-4">
              {/* Direct Group Code Card */}
              {activeFamily.invite_code && (
                <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Group Invite Code
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                      Instant Join
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 sm:p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                    <code className="font-mono font-black text-base sm:text-sm text-emerald-800 tracking-wider select-all text-center sm:text-left py-0.5">
                      {activeFamily.invite_code}
                    </code>
                    <div className="flex items-center gap-2 sm:gap-1.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(activeFamily.invite_code || "");
                          showToast("Code copied to clipboard!");
                        }}
                        className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[32px] h-10 sm:h-8 px-3 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 touch-manipulation"
                        title="Copy code"
                      >
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy</span>
                      </button>

                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(
                          getWhatsAppInviteMessage({
                            familyName: activeFamily.name,
                            inviteCode: activeFamily.invite_code,
                          })
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[32px] h-10 sm:h-8 px-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer transition-all active:scale-95 touch-manipulation"
                        title="Share on WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-snug">
                    Share this code with co-borrowers, partners, or family to join this group instantly.
                  </p>
                </div>
              )}

              {/* Group Members Card */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-2xs space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <h3 className="text-sm font-black text-[#02361B]">
                      Group Members ({activeFamily.members.length})
                    </h3>
                  </div>

                  {(activeFamily.is_owner || activeFamily.is_admin) && (
                    <button
                      type="button"
                      onClick={() => {
                        setInviteSuccessMessage(null);
                        setLastGeneratedToken(null);
                        setIsInviteModalOpen(true);
                      }}
                      className="min-h-[44px] px-2 py-1.5 -mr-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 cursor-pointer active:scale-95 touch-manipulation"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Invite</span>
                    </button>
                  )}
                </div>

                {/* Member Rows */}
                <div className="divide-y divide-slate-100">
                  {activeFamily.members.map((member) => (
                    <div
                      key={member.id}
                      className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-[#1C9E30] to-[#005E35] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                          {member.profile_photo ? (
                            <Image
                              src={member.profile_photo}
                              alt={member.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <span>{member.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-800 truncate">
                              {member.name}
                            </span>
                            {member.user_id === user?.id && (
                              <span className="text-[9px] text-slate-400 font-medium shrink-0">
                                (You)
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 truncate block">
                            {member.email}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full capitalize",
                            member.role === "owner"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200/80"
                              : member.role === "admin"
                              ? "bg-teal-50 text-teal-800 border border-teal-200/80"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          )}
                        >
                          {member.role}
                        </span>

                        {activeFamily.is_owner && member.user_id !== user?.id && (
                          <button
                            type="button"
                            onClick={() => {
                              setRemoveMemberError(null);
                              setMemberToRemove({ id: member.id, name: member.name });
                            }}
                            className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer active:scale-95 touch-manipulation"
                            title="Remove member"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pending Invitations list inside Members Card */}
                {activeFamily.pending_invitations && activeFamily.pending_invitations.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Pending Invitations ({activeFamily.pending_invitations.length})
                    </span>
                    <div className="space-y-1.5">
                      {activeFamily.pending_invitations.map((inv) => (
                        <div
                          key={inv.id}
                          className="p-2.5 sm:p-2 rounded-xl sm:rounded-lg bg-amber-50/60 border border-amber-100 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-800 truncate block">
                              {inv.email}
                            </span>
                            <span className="text-[10px] text-amber-700 font-medium">
                              Invited as {inv.role}
                            </span>
                          </div>
                          {(activeFamily.is_owner || activeFamily.is_admin) && (
                            <button
                              type="button"
                              onClick={() => handleCancelInvite(inv.id)}
                              className="min-h-[44px] px-2.5 inline-flex items-center justify-center text-xs text-rose-600 hover:underline font-bold shrink-0 cursor-pointer active:scale-95 touch-manipulation"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Invite Member Modal - Native Mobile Bottom Sheet & Desktop Dialog */}
      {mounted && isInviteModalOpen && activeFamily && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isSendingInvite) {
              setIsInviteModalOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200/90 overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[92dvh] sm:max-h-[85vh] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-0">
            {/* Native Mobile Drag Handle */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>

            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-emerald-100/70 bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl btn-gradient-glow text-white flex items-center justify-center shrink-0 shadow-xs">
                  <UserPlus className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#02361B] tracking-tight">Invite Group Member</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Collaborate in <span className="font-bold text-emerald-800">{activeFamily.name}</span></p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 flex items-center justify-center transition-colors cursor-pointer active:scale-95 touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              {inviteSuccessMessage && lastGeneratedToken ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{inviteSuccessMessage}</span>
                  </div>
                  <p className="text-[11px] text-emerald-700">
                    Share the direct invite link with <strong>{lastInvitedEmail}</strong>:
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => copyInviteUrl(lastGeneratedToken)}
                      className="flex-1 min-h-[44px] sm:min-h-[36px] h-11 sm:h-9 px-3 rounded-xl sm:rounded-lg bg-white border border-emerald-300 text-emerald-800 font-bold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs active:scale-95 touch-manipulation"
                    >
                      <Copy className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Copy Link</span>
                    </button>
                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(
                        getWhatsAppInviteMessage({
                          familyName: activeFamily.name,
                          inviteCode: activeFamily.invite_code,
                          token: lastGeneratedToken,
                        })
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] sm:min-h-[36px] h-11 sm:h-9 px-3.5 rounded-xl sm:rounded-lg bg-[#25D366] text-white font-bold text-xs inline-flex items-center justify-center gap-1 shadow-2xs cursor-pointer active:scale-95 touch-manipulation"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        inputMode="email"
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder="spouse@gmail.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        className="w-full text-[16px] sm:text-xs min-h-[48px] sm:min-h-[42px] pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-300 bg-white font-semibold text-slate-800 shadow-2xs transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1.5">Role</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setInviteRole("member")}
                        className={cn(
                          "min-h-[52px] p-3 rounded-xl border text-left transition-all cursor-pointer active:scale-[0.98] touch-manipulation",
                          inviteRole === "member"
                            ? "bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20"
                            : "bg-white border-slate-200/90 hover:border-slate-300"
                        )}
                      >
                        <span className="font-bold text-xs text-[#02361B] block">Member</span>
                        <span className="text-[10px] text-slate-500 block">Can view &amp; share loans</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setInviteRole("admin")}
                        className={cn(
                          "min-h-[52px] p-3 rounded-xl border text-left transition-all cursor-pointer active:scale-[0.98] touch-manipulation",
                          inviteRole === "admin"
                            ? "bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-500/20"
                            : "bg-white border-slate-200/90 hover:border-slate-300"
                        )}
                      >
                        <span className="font-bold text-xs text-[#02361B] block">Admin</span>
                        <span className="text-[10px] text-slate-500 block">Can also invite others</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isSendingInvite}
                  onClick={() => setIsInviteModalOpen(false)}
                  className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-4 rounded-xl sm:rounded-lg border border-slate-200/90 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
                >
                  {inviteSuccessMessage ? "Done" : "Cancel"}
                </button>
                {!inviteSuccessMessage && (
                  <button
                    type="submit"
                    disabled={isSendingInvite}
                    className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-5 rounded-xl sm:rounded-lg btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60 active:scale-95 touch-manipulation"
                  >
                    {isSendingInvite ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5 stroke-[2.4]" />
                        <span>Send Invite</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Join Group Modal - Native Mobile Bottom Sheet & Desktop Dialog */}
      {mounted && isJoinModalOpen && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isJoining) {
              setIsJoinModalOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200/90 overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[92dvh] sm:max-h-[85vh] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-0">
            {/* Native Mobile Drag Handle */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>

            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-emerald-100/70 bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl btn-gradient-glow text-white flex items-center justify-center shrink-0 shadow-xs">
                  <LinkIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#02361B] tracking-tight">Join Group</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Enter 6-character code or paste invite link</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsJoinModalOpen(false)}
                className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 flex items-center justify-center transition-colors cursor-pointer active:scale-95 touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleJoinFamily} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              {joinError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{joinError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Group Code or Link *</span>
                </label>
                <input
                  type="text"
                  required
                  inputMode="text"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  spellCheck={false}
                  placeholder="e.g. FAM-TI6FSK"
                  value={joinToken}
                  onChange={(e) => setJoinToken(e.target.value)}
                  className="w-full text-[16px] sm:text-xs font-mono uppercase font-bold tracking-wider h-11 px-3.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-300 bg-white text-slate-900 shadow-2xs transition-all placeholder:normal-case placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
                />
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/70 flex items-start gap-2.5 text-[11px] font-medium text-emerald-900">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Your personal loans and vault records remain private. Connecting a group only pools commitments you explicitly choose to share.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isJoining}
                  onClick={() => setIsJoinModalOpen(false)}
                  className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-4 rounded-xl sm:rounded-lg border border-slate-200/90 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-2xs active:scale-95 transition-all touch-manipulation cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isJoining}
                  className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-5 rounded-xl sm:rounded-lg btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all cursor-pointer active:scale-95 disabled:opacity-50 inline-flex items-center justify-center gap-1.5 touch-manipulation"
                >
                  {isJoining ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.4]" />
                      <span>Join Group</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Rename Group Modal - Native Mobile Bottom Sheet & Desktop Dialog */}
      {mounted && isRenameModalOpen && activeFamily && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isRenaming) {
              setIsRenameModalOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-md bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200/90 overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[92dvh] sm:max-h-[85vh] pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:pb-0">
            {/* Native Mobile Drag Handle */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>

            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-emerald-100/70 bg-gradient-to-r from-emerald-50/50 via-teal-50/20 to-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl btn-gradient-glow text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#02361B] tracking-tight">Rename Group</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Update group display name</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRenameModalOpen(false)}
                className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 flex items-center justify-center transition-colors cursor-pointer active:scale-95 touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRenameFamily} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">Group Name *</label>
                <input
                  type="text"
                  required
                  autoCapitalize="words"
                  value={newFamilyName}
                  onChange={(e) => setNewFamilyName(e.target.value)}
                  className="w-full text-[16px] sm:text-xs min-h-[48px] sm:min-h-[42px] px-3.5 py-2.5 rounded-xl border border-slate-200/90 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:border-emerald-300 bg-white font-semibold text-slate-800 shadow-2xs transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isRenaming}
                  onClick={() => setIsRenameModalOpen(false)}
                  className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-4 rounded-xl sm:rounded-lg border border-slate-200/90 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 hover:border-slate-300 shadow-2xs active:scale-95 transition-all touch-manipulation cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isRenaming}
                  className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[38px] h-11 sm:h-9.5 px-5 rounded-xl sm:rounded-lg btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60 active:scale-95 touch-manipulation"
                >
                  {isRenaming ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* Delete Group Confirmation Modal - Native Mobile Bottom Sheet & Desktop Dialog */}
      {mounted && isDeleteModalOpen && activeFamily && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isDeletingFamily) {
              setIsDeleteModalOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200/90 overflow-hidden flex flex-col items-center text-center p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[92dvh] sm:max-h-[85vh] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6">
            {/* Native Mobile Drag Handle */}
            <div className="sm:hidden -mt-2 pb-2 flex justify-center w-full">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs shrink-0">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-[#02361B]">Delete Group?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Permanently delete <strong>&apos;{activeFamily.name}&apos;</strong>? Shared loans will safely revert to each owner&apos;s personal vault.
              </p>
            </div>

            {deleteError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 text-left w-full">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{deleteError}</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2.5 pt-2 w-full">
              <button
                type="button"
                disabled={isDeletingFamily}
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 min-h-[44px] h-11 sm:h-9.5 rounded-xl sm:rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeletingFamily}
                onClick={handleDeleteFamily}
                className="flex-1 min-h-[44px] h-11 sm:h-9.5 rounded-xl sm:rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60 active:scale-95 touch-manipulation"
              >
                {isDeletingFamily ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Leave Group Confirmation Modal - Native Mobile Bottom Sheet & Desktop Dialog */}
      {mounted && isLeaveModalOpen && activeFamily && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isLeavingFamily) {
              setIsLeaveModalOpen(false);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200/90 overflow-hidden flex flex-col items-center text-center p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[92dvh] sm:max-h-[85vh] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6">
            {/* Native Mobile Drag Handle */}
            <div className="sm:hidden -mt-2 pb-2 flex justify-center w-full">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs shrink-0">
              <LogOut className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-[#02361B]">Leave Group?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to leave <strong>&apos;{activeFamily.name}&apos;</strong>? You will lose access to shared loans and activities within this group.
              </p>
            </div>

            {leaveError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 text-left w-full">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{leaveError}</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2.5 pt-2 w-full">
              <button
                type="button"
                disabled={isLeavingFamily}
                onClick={() => setIsLeaveModalOpen(false)}
                className="flex-1 min-h-[44px] h-11 sm:h-9.5 rounded-xl sm:rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLeavingFamily}
                onClick={handleConfirmLeaveFamily}
                className="flex-1 min-h-[44px] h-11 sm:h-9.5 rounded-xl sm:rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60 active:scale-95 touch-manipulation"
              >
                {isLeavingFamily ? "Leaving..." : "Leave Group"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Remove Member Confirmation Modal - Native Mobile Bottom Sheet & Desktop Dialog */}
      {mounted && memberToRemove && activeFamily && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isRemovingMember) {
              setMemberToRemove(null);
            }
          }}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-sm bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border-t sm:border border-slate-200/90 overflow-hidden flex flex-col items-center text-center p-5 sm:p-6 space-y-4 animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[92dvh] sm:max-h-[85vh] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-6">
            {/* Native Mobile Drag Handle */}
            <div className="sm:hidden -mt-2 pb-2 flex justify-center w-full">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>

            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-2xs shrink-0">
              <UserMinus className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-black text-[#02361B]">Remove Member?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Remove <strong>{memberToRemove.name}</strong> from <strong>&apos;{activeFamily.name}&apos;</strong>? They will lose access to shared group loans and records.
              </p>
            </div>

            {removeMemberError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2 text-left w-full">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{removeMemberError}</span>
              </div>
            )}

            <div className="flex items-center justify-center gap-2.5 pt-2 w-full">
              <button
                type="button"
                disabled={isRemovingMember}
                onClick={() => setMemberToRemove(null)}
                className="flex-1 min-h-[44px] h-11 sm:h-9.5 rounded-xl sm:rounded-lg border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isRemovingMember}
                onClick={handleConfirmRemoveMember}
                className="flex-1 min-h-[44px] h-11 sm:h-9.5 rounded-xl sm:rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60 active:scale-95 touch-manipulation"
              >
                {isRemovingMember ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );

  if (embedded) {
    return pageBody;
  }

  return <DashboardLayout>{pageBody}</DashboardLayout>;
}

export default function FamilyPage({
  embedded = false,
}: {
  embedded?: boolean;
} = {}) {
  if (embedded) {
    return <FamilyPageContent embedded />;
  }

  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="relative pt-3.5 sm:pt-5 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8 xl:px-10 overflow-x-hidden select-none min-h-dvh">
            <div className="relative z-10 max-w-[1500px] mx-auto space-y-2.5 sm:space-y-5">
              <FamilyWorkspaceSkeleton />
            </div>
          </div>
        </DashboardLayout>
      }
    >
      <FamilyPageContent embedded={false} />
    </Suspense>
  );
}
