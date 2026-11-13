"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { familyService, FamilySummary, FamilyMemberPreview } from "@/services/familyService";
import { useAuth } from "@/modules/authentication/AuthContext";

export type WorkspaceId = "all" | "personal" | number;

export interface WorkspaceItem {
  id: WorkspaceId;
  name: string;
  type: "all" | "personal" | "family";
  subtitle: string;
  members_count?: number;
  members_preview?: FamilyMemberPreview[];
  is_owner?: boolean;
  my_role?: string;
}

interface WorkspaceContextType {
  activeWorkspace: WorkspaceItem;
  workspaces: WorkspaceItem[];
  families: FamilySummary[];
  isLoading: boolean;
  switchWorkspace: (id: WorkspaceId) => void;
  refreshWorkspaces: () => Promise<void>;
}

const STORAGE_KEY = "myvello_active_workspace_id";

const DEFAULT_PERSONAL_WORKSPACE: WorkspaceItem = {
  id: "personal",
  name: "Personal Vault",
  type: "personal",
  subtitle: "Private Vault (Only You)",
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [families, setFamilies] = useState<FamilySummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<WorkspaceId>("personal");

  const refreshWorkspaces = useCallback(async () => {
    if (!user) {
      setFamilies([]);
      setIsLoading(false);
      return;
    }

    try {
      const list = await familyService.getFamilies();
      setFamilies(list || []);
    } catch (err) {
      console.error("Failed to fetch family workspaces:", err);
      setFamilies([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Load families on mount or user change
  useEffect(() => {
    refreshWorkspaces();
  }, [refreshWorkspaces]);

  // Listen for instant workspace refresh events and window focus
  useEffect(() => {
    const handleRefresh = () => {
      refreshWorkspaces();
    };
    window.addEventListener("myvello:refresh_workspaces", handleRefresh);
    window.addEventListener("focus", handleRefresh);
    return () => {
      window.removeEventListener("myvello:refresh_workspaces", handleRefresh);
      window.removeEventListener("focus", handleRefresh);
    };
  }, [refreshWorkspaces]);

  // Load saved active workspace id from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        if (saved === "personal") {
          setActiveWorkspaceId("personal");
        } else if (saved === "all") {
          // "all" option retired, default to personal vault
          setActiveWorkspaceId("personal");
          localStorage.setItem(STORAGE_KEY, "personal");
        } else if (!isNaN(Number(saved))) {
          setActiveWorkspaceId(Number(saved));
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Compute all available workspaces (Personal Vault + any Shared Family Workspaces)
  const workspaces = useMemo<WorkspaceItem[]>(() => {
    const list: WorkspaceItem[] = [];

    // 1. Personal Vault (Private)
    list.push({
      id: "personal",
      name: user?.name
        ? `${user.name.trim().split(" ")[0]}'s Personal`
        : "Personal Vault",
      type: "personal",
      subtitle: "Private Vault (Only You)",
      members_count: 1,
    });

    // 2. Shared Family Workspaces
    if (families && families.length > 0) {
      families.forEach((f) => {
        list.push({
          id: f.id,
          name: f.name,
          type: "family",
          subtitle: `Family Vault • ${f.members_count || 1} member${(f.members_count || 1) > 1 ? "s" : ""}`,
          members_count: f.members_count,
          members_preview: f.members_preview,
          is_owner: f.is_owner,
          my_role: f.my_role,
        });
      });
    }

    return list;
  }, [user, families]);

  // Find active workspace object
  const activeWorkspace = useMemo<WorkspaceItem>(() => {
    const found = workspaces.find((w) => w.id === activeWorkspaceId);
    return found || workspaces[0] || DEFAULT_PERSONAL_WORKSPACE;
  }, [workspaces, activeWorkspaceId]);

  const switchWorkspace = useCallback((id: WorkspaceId) => {
    setActiveWorkspaceId(id);
    try {
      localStorage.setItem(STORAGE_KEY, String(id));
    } catch {
      // Ignore
    }
  }, []);

  return (
    <WorkspaceContext.Provider
      value={{
        activeWorkspace,
        workspaces,
        families,
        isLoading,
        switchWorkspace,
        refreshWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
}
