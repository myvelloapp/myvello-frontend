"use client";

import React, { useState } from "react";
import { Mail, RefreshCw, CheckCircle2, AlertCircle, Unlink, ExternalLink, ShieldCheck } from "lucide-react";
import { subscriptionService } from "@/services/subscriptionService";
import { GmailStatusResponse } from "@/types/subscription";

interface GmailConnectionCardProps {
  status: GmailStatusResponse | null;
  onRefresh: () => void;
  onScanComplete?: () => void;
}

export function GmailConnectionCard({ status, onRefresh, onScanComplete }: GmailConnectionCardProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setErrorMsg(null);
    try {
      const authUrl = await subscriptionService.getGmailConnectUrl();
      window.location.href = authUrl;
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || "Failed to initiate Gmail connection.");
      setIsConnecting(false);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    setErrorMsg(null);
    try {
      await subscriptionService.scanGmail({ max_emails: 30 });
      onRefresh();
      if (onScanComplete) {
        onScanComplete();
      }
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || "Gmail inbox scan failed.");
    } finally {
      setIsScanning(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect your Gmail integration?")) {
      return;
    }
    try {
      await subscriptionService.disconnectGmail();
      onRefresh();
    } catch (e: any) {
      setErrorMsg(e?.response?.data?.message || "Failed to disconnect Gmail.");
    }
  };

  const isConnected = Boolean(status?.connected);

  return (
    <div className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-2xs relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              isConnected
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}
          >
            <Mail className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-bold text-[#02361B]">
                {isConnected ? "Gmail Smart Discovery Active" : "Connect Gmail for Smart Discovery"}
              </h4>
              {isConnected ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100/80 text-emerald-800">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600">
                  Not Connected
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 mt-0.5 max-w-xl leading-relaxed">
              {isConnected
                ? `Connected to ${status?.email_address || "Gmail"}. Automatically detects upcoming renewals and payment receipts without sharing your Google login password.`
                : "Link your Gmail account (read-only) to automatically scan for recurring subscriptions like Netflix, Spotify, AWS, and Adobe."}
            </p>

            {status?.last_synced_at && (
              <p className="text-[11px] text-slate-400 mt-1 font-mono">
                Last scanned: {new Date(status.last_synced_at).toLocaleString()}
              </p>
            )}

            {errorMsg && (
              <p className="text-xs text-red-600 mt-2 flex items-center gap-1.5 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errorMsg}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-center shrink-0">
          {isConnected ? (
            <>
              <button
                type="button"
                onClick={handleScan}
                disabled={isScanning || status?.is_syncing}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning || status?.is_syncing ? "animate-spin" : ""}`} />
                {isScanning || status?.is_syncing ? "Scanning Inbox..." : "Scan Inbox"}
              </button>

              <button
                type="button"
                onClick={handleDisconnect}
                title="Disconnect Gmail"
                className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
              >
                <Unlink className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleConnect}
              disabled={isConnecting}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-[#02361B] hover:bg-[#034d26] text-white transition-colors shadow-2xs disabled:opacity-50 cursor-pointer"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              {isConnecting ? "Connecting..." : "Connect Gmail"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
