import React from "react";
import {
  Home,
  Car,
  User,
  GraduationCap,
  Smartphone,
  Coins,
  Briefcase,
  CreditCard,
  RefreshCw,
  Zap,
  Globe,
  Layers,
  Bike,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DropdownOption } from "@/components/ui/CustomDropdown";

export interface CategoryMetadata {
  value: string;
  label: string;
  icon: React.ReactNode;
  bgClass: string;
  badgeClass: string;
}

export const LOAN_CATEGORY_OPTIONS: DropdownOption[] = [
  {
    value: "Home Loan",
    label: "Home Loan",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
        <Home className="w-3 h-3 text-indigo-600" />
      </div>
    ),
  },
  {
    value: "Vehicle Loan",
    label: "Vehicle Loan (Car / Bike)",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
        <Car className="w-3 h-3 text-blue-600" />
      </div>
    ),
  },
  {
    value: "Personal Loan",
    label: "Personal Loan",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0">
        <User className="w-3 h-3 text-pink-600" />
      </div>
    ),
  },
  {
    value: "Education Loan",
    label: "Education Loan",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
        <GraduationCap className="w-3 h-3 text-amber-600" />
      </div>
    ),
  },
  {
    value: "Consumer Durable",
    label: "Consumer Durable / Gadget",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
        <Smartphone className="w-3 h-3 text-purple-600" />
      </div>
    ),
  },
  {
    value: "Gold Loan",
    label: "Gold Loan",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
        <Coins className="w-3 h-3 text-amber-600" />
      </div>
    ),
  },
  {
    value: "Business Loan",
    label: "Business Loan",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
        <Briefcase className="w-3 h-3 text-emerald-600" />
      </div>
    ),
  },
  {
    value: "Other",
    label: "Other Loan",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
        <CreditCard className="w-3 h-3 text-slate-600" />
      </div>
    ),
  },
];

export const PAYMENT_METHOD_OPTIONS: DropdownOption[] = [
  {
    value: "Auto Debit",
    label: "Auto Debit (Bank Mandate / NACH)",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
        <RefreshCw className="w-3 h-3 text-emerald-600" />
      </div>
    ),
  },
  {
    value: "UPI",
    label: "UPI (GPay / PhonePe / Paytm)",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
        <Zap className="w-3 h-3 text-indigo-600" />
      </div>
    ),
  },
  {
    value: "NetBanking",
    label: "NetBanking / NEFT",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
        <Globe className="w-3 h-3 text-blue-600" />
      </div>
    ),
  },
  {
    value: "Credit Card",
    label: "Credit Card",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0">
        <CreditCard className="w-3 h-3 text-purple-600" />
      </div>
    ),
  },
  {
    value: "Cash / Cheque",
    label: "Cash / Cheque",
    icon: (
      <div className="w-5 h-5 rounded-[6px] bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
        <Coins className="w-3 h-3 text-amber-600" />
      </div>
    ),
  },
];

export const CURRENCY_OPTIONS: DropdownOption[] = [
  {
    value: "INR",
    label: "INR (₹) - Indian Rupee",
    icon: (
      <span className="w-5 h-5 rounded-[6px] bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-black text-[11px] flex items-center justify-center shrink-0">
        ₹
      </span>
    ),
  },
  {
    value: "USD",
    label: "USD ($) - US Dollar",
    icon: (
      <span className="w-5 h-5 rounded-[6px] bg-blue-50 text-blue-700 border border-blue-200/70 font-black text-[11px] flex items-center justify-center shrink-0">
        $
      </span>
    ),
  },
  {
    value: "AED",
    label: "AED (د.إ) - UAE Dirham",
    icon: (
      <span className="w-5 h-5 rounded-[6px] bg-amber-50 text-amber-700 border border-amber-200/70 font-black text-[9px] flex items-center justify-center shrink-0">
        د.إ
      </span>
    ),
  },
];

export const CATEGORY_FILTER_OPTIONS: DropdownOption[] = [
  {
    value: "All",
    label: "All Categories",
    icon: (
      <div className="w-4 h-4 rounded-[5px] bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
        <Layers className="w-2.5 h-2.5" />
      </div>
    ),
  },
  ...LOAN_CATEGORY_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.value,
    icon: opt.icon,
  })),
];

/**
 * Centralized category icon resolver
 */
export function getCategoryIcon(categoryName: string, iconClassName = "w-5 h-5"): React.ReactNode {
  const lower = (categoryName || "").toLowerCase();

  if (lower.includes("bike") || lower.includes("two wheeler")) {
    return <Bike className={cn(iconClassName, "text-emerald-600")} />;
  }
  if (
    lower.includes("vehicle") ||
    lower.includes("car") ||
    lower.includes("auto") ||
    lower.includes("motor")
  ) {
    return <Car className={cn(iconClassName, "text-blue-600")} />;
  }
  if (lower.includes("home") || lower.includes("hous") || lower.includes("mortgage")) {
    return <Home className={cn(iconClassName, "text-indigo-600")} />;
  }
  if (
    lower.includes("phone") ||
    lower.includes("consumer") ||
    lower.includes("durable") ||
    lower.includes("gadget") ||
    lower.includes("laptop") ||
    lower.includes("mobile") ||
    lower.includes("electronics")
  ) {
    return <Smartphone className={cn(iconClassName, "text-purple-600")} />;
  }
  if (lower.includes("edu") || lower.includes("grad") || lower.includes("student") || lower.includes("school")) {
    return <GraduationCap className={cn(iconClassName, "text-amber-600")} />;
  }
  if (lower.includes("person")) {
    return <User className={cn(iconClassName, "text-pink-600")} />;
  }
  if (lower.includes("gold") || lower.includes("jewel")) {
    return <Coins className={cn(iconClassName, "text-amber-600")} />;
  }
  if (lower.includes("business") || lower.includes("commercial") || lower.includes("msme") || lower.includes("enterprise")) {
    return <Briefcase className={cn(iconClassName, "text-emerald-600")} />;
  }
  // Default / Other
  return <CreditCard className={cn(iconClassName, "text-slate-600")} />;
}

/**
 * Centralized category background class resolver
 */
export function getCategoryBgClass(categoryName: string): string {
  const lower = (categoryName || "").toLowerCase();

  if (lower.includes("bike") || lower.includes("two wheeler")) {
    return "bg-emerald-50 border-emerald-100 text-emerald-600";
  }
  if (
    lower.includes("vehicle") ||
    lower.includes("car") ||
    lower.includes("auto") ||
    lower.includes("motor")
  ) {
    return "bg-blue-50 border-blue-100 text-blue-600";
  }
  if (lower.includes("home") || lower.includes("hous") || lower.includes("mortgage")) {
    return "bg-indigo-50 border-indigo-100 text-indigo-600";
  }
  if (
    lower.includes("phone") ||
    lower.includes("consumer") ||
    lower.includes("durable") ||
    lower.includes("gadget") ||
    lower.includes("laptop") ||
    lower.includes("mobile") ||
    lower.includes("electronics")
  ) {
    return "bg-purple-50 border-purple-100 text-purple-600";
  }
  if (lower.includes("edu") || lower.includes("grad") || lower.includes("student") || lower.includes("school")) {
    return "bg-amber-50 border-amber-100 text-amber-600";
  }
  if (lower.includes("person")) {
    return "bg-pink-50 border-pink-100 text-pink-600";
  }
  if (lower.includes("gold") || lower.includes("jewel")) {
    return "bg-amber-50 border-amber-200 text-amber-600";
  }
  if (lower.includes("business") || lower.includes("commercial") || lower.includes("msme") || lower.includes("enterprise")) {
    return "bg-emerald-50 border-emerald-100 text-emerald-600";
  }
  // Default / Other
  return "bg-slate-100 border-slate-200 text-slate-600";
}
