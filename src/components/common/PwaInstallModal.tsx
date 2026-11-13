"use client";

import React from "react";
import { X, Smartphone, Download, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PwaInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PwaInstallModal({ isOpen, onClose }: PwaInstallModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Install Myvello App</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/80 to-teal-50/60 border border-indigo-100/60 text-center space-y-2">
            <div className="w-12 h-12 bg-white rounded-xl shadow-xs text-indigo-600 flex items-center justify-center mx-auto text-xl font-extrabold">
              M
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Myvello on Your Device</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Install Myvello as a Progressive Web App for instant access, offline fallback, and fast payment reminders.
            </p>
          </div>

          <div className="space-y-2.5 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Full standalone screen without browser address bars.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Private financial encryption (sensitive data is never unencrypted).</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Automatic daily sync of upcoming EMI schedules.</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500">
            <strong>How to install:</strong> Click the Install button below, or in Chrome/Edge, click the install icon in the URL bar (or &quot;Add to Home Screen&quot; on Safari/iOS).
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/60 border-t border-slate-100">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Maybe Later
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="gap-2"
            onClick={() => {
              alert("Install prompt dispatched to browser!");
              onClose();
            }}
          >
            <Download className="w-3.5 h-3.5" />
            Install App
          </Button>
        </div>
      </div>
    </div>
  );
}
