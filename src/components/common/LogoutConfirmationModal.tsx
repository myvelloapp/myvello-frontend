"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { LogOut, X } from "lucide-react";
import { useAuth } from "@/modules/authentication/AuthContext";

interface LogoutConfirmationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  onConfirm?: () => Promise<void> | void;
}

export function LogoutConfirmationModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  onConfirm,
}: LogoutConfirmationModalProps = {}) {
  const router = useRouter();
  const { logout } = useAuth();
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const handleClose = useCallback(() => {
    if (isLoggingOut) return;
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setUncontrolledIsOpen(false);
    }
  }, [isControlled, controlledOnClose, isLoggingOut]);

  // Listen to global "myvello:open_logout_modal" event when mounted uncontrolled
  useEffect(() => {
    if (isControlled) return;

    const handleOpen = () => setUncontrolledIsOpen(true);
    window.addEventListener("myvello:open_logout_modal", handleOpen);
    return () => {
      window.removeEventListener("myvello:open_logout_modal", handleOpen);
    };
  }, [isControlled]);

  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoggingOut) {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isLoggingOut, handleClose]);

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      if (onConfirm) {
        await onConfirm();
      } else {
        await logout();
        router.push("/login");
      }
    } catch {
      // In case logout throws, still redirect to login
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isLoggingOut) {
          handleClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-modal-title"
    >
      <div className="relative w-full max-w-sm bg-white rounded-[24px] shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150 p-6 space-y-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          disabled={isLoggingOut}
          className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-50 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Visual Icon */}
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-2xs">
          <LogOut className="w-6 h-6" />
        </div>

        {/* Header Text */}
        <div className="text-center space-y-1.5 pb-1">
          <h3
            id="logout-modal-title"
            className="text-base sm:text-lg font-black text-[#0B132B]"
          >
            Sign Out of Myvello?
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
            Are you sure you want to log out? Your active session will be ended securely.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleClose}
            className="h-9 px-5 rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleConfirmLogout}
            className="h-9 px-5 rounded-[8px] bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60"
          >
            {isLoggingOut ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing Out...</span>
              </>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
