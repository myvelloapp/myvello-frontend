"use client";

import React, { useState } from "react";
import { Landmark } from "lucide-react";
import { findBank, BankInfo } from "@/lib/banks";
import { cn } from "@/lib/utils";

interface BankLogoProps {
  bankName?: string;
  logoUrl?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showFallbackIcon?: boolean;
}

const sizeClasses = {
  xs: "w-3.5 h-3.5 text-[8px]",
  sm: "w-4 h-4 text-[9px]",
  md: "w-5 h-5 text-[10px]",
  lg: "w-7 h-7 text-xs",
};

export const BankLogo: React.FC<BankLogoProps> = ({
  bankName,
  logoUrl,
  size = "sm",
  className,
  showFallbackIcon = true,
}) => {
  const [imgError, setImgError] = useState(false);

  // Look up bank metadata if not provided directly
  const bankInfo: BankInfo | undefined = bankName ? findBank(bankName) : undefined;
  const resolvedUrl = logoUrl || bankInfo?.logoUrl;
  const displayName = bankName || bankInfo?.name || "";

  // Helper for 2-letter initials
  const initials = displayName
    ? displayName
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  if (resolvedUrl && !imgError) {
    return (
      <div
        className={cn(
          "relative shrink-0 rounded-full bg-white flex items-center justify-center overflow-hidden border border-slate-200/60 shadow-2xs",
          sizeClasses[size],
          className
        )}
      >
        <img
          src={resolvedUrl}
          alt={displayName || "Bank logo"}
          className="w-full h-full object-contain p-0.5"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Graceful fallback: Initial badge or Landmark icon
  if (initials && initials.length > 0) {
    return (
      <div
        className={cn(
          "shrink-0 rounded-full font-black flex items-center justify-center bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-2xs",
          sizeClasses[size],
          className
        )}
      >
        {initials}
      </div>
    );
  }

  if (showFallbackIcon) {
    return (
      <div
        className={cn(
          "shrink-0 rounded-full flex items-center justify-center bg-slate-100 text-slate-400 border border-slate-200/60",
          sizeClasses[size],
          className
        )}
      >
        <Landmark className="w-2/3 h-2/3" />
      </div>
    );
  }

  return null;
};
