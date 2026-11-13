"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Landmark,
  Check,
  ChevronDown,
  X,
  Building2,
  Search,
  Grid2X2,
} from "lucide-react";
import {
  INDIAN_BANKS,
  BANK_CATEGORIES,
  BankCategory,
  BankInfo,
  findBank,
} from "@/lib/banks";
import { BankLogo } from "@/components/ui/BankLogo";
import { cn } from "@/lib/utils";

interface BankSelectorProps {
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  hasError?: boolean;
}

export const BankSelector: React.FC<BankSelectorProps> = ({
  value,
  onChange,
  currency = "INR",
  placeholder,
  required = false,
  className,
  hasError = false,
}) => {
  const isIndianRupee = !currency || currency.trim().toUpperCase() === "INR";
  const defaultPlaceholder = isIndianRupee
    ? placeholder || "Search 75+ Indian banks & NBFCs or enter custom..."
    : placeholder || "e.g. Chase Bank, HSBC, Emirates NBD, Barclays...";

  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [selectedCategory, setSelectedCategory] = useState<BankCategory>("All");
  const [modalSearchQuery, setModalSearchQuery] = useState("");
  const [modalCategory, setModalCategory] = useState<BankCategory>("All");

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal search query if external value changes
  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  // Handle outside click for inline dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter matching banks for dropdown
  const filteredBanks = useMemo(() => {
    let list = INDIAN_BANKS;
    if (selectedCategory !== "All") {
      list = list.filter((b) => b.category === selectedCategory);
    }
    if (!searchQuery.trim()) return list;

    const q = searchQuery.toLowerCase().trim();
    return list.filter((b) => {
      const matchName = b.name.toLowerCase().includes(q);
      const matchShort = b.shortName.toLowerCase().includes(q);
      const matchCat = b.category.toLowerCase().includes(q);
      const matchKeyword = b.keywords ? b.keywords.some((k) => k.includes(q)) : false;
      return matchName || matchShort || matchCat || matchKeyword;
    });
  }, [searchQuery, selectedCategory]);

  // Filter matching banks for full modal
  const modalFilteredBanks = useMemo(() => {
    let list = INDIAN_BANKS;
    if (modalCategory !== "All") {
      list = list.filter((b) => b.category === modalCategory);
    }
    if (!modalSearchQuery.trim()) return list;

    const q = modalSearchQuery.toLowerCase().trim();
    return list.filter((b) => {
      const matchName = b.name.toLowerCase().includes(q);
      const matchShort = b.shortName.toLowerCase().includes(q);
      const matchCat = b.category.toLowerCase().includes(q);
      const matchKeyword = b.keywords ? b.keywords.some((k) => k.includes(q)) : false;
      return matchName || matchShort || matchCat || matchKeyword;
    });
  }, [modalSearchQuery, modalCategory]);

  const matchedBank = useMemo(() => findBank(value), [value]);

  const handleSelectBank = (bank: BankInfo) => {
    onChange(bank.name);
    setSearchQuery(bank.name);
    setIsOpen(false);
    setIsModalOpen(false);
  };

  // If non-INR currency, provide a sleek direct manual input without Indian bank list
  if (!isIndianRupee) {
    return (
      <div className={cn("relative w-full", className)}>
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Building2 className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          placeholder={defaultPlaceholder}
          className={cn(
            "w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] pl-9.5 pr-8 rounded-xl border bg-white text-xs sm:text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs touch-manipulation",
            hasError
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-500/20"
              : "border-slate-200/90 hover:border-slate-300"
          )}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute inset-y-0 right-0 pr-2.5 min-h-[44px] min-w-[36px] flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer active:scale-95 touch-manipulation"
            title="Clear input"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  const handleClear = () => {
    onChange("");
    setSearchQuery("");
  };

  return (
    <div ref={containerRef} className={cn("space-y-2 relative", className)}>
      {/* Input Field with Left Bank Logo and Right Controls */}
      <div className="relative flex items-center">
        {/* Left Icon / Selected Bank Logo */}
        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 flex items-center justify-center">
          {matchedBank ? (
            <BankLogo bankName={matchedBank.name} logoUrl={matchedBank.logoUrl} size="sm" />
          ) : (
            <Building2 className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <input
          type="text"
          required={required}
          value={searchQuery}
          onFocus={() => setIsOpen(true)}
          onChange={handleInputChange}
          placeholder={defaultPlaceholder}
          className={cn(
            "w-full h-11 sm:h-10 min-h-[44px] sm:min-h-[40px] text-xs sm:text-sm pl-9 pr-16 rounded-xl border transition-all placeholder:text-slate-400 font-semibold shadow-2xs focus:outline-none touch-manipulation",
            hasError
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 bg-rose-50/20 text-rose-900"
              : "border-slate-200/90 bg-white hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-slate-900",
            matchedBank && !hasError && "font-bold text-slate-900"
          )}
        />

        {/* Right Actions: Clear, Browse All & Dropdown Caret */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-0.5 text-slate-400">
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="w-8 h-8 sm:w-7 sm:h-7 hover:text-slate-600 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
              title="Clear"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="w-8 h-8 sm:w-7 sm:h-7 hover:text-slate-600 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-all cursor-pointer active:scale-95 touch-manipulation"
            title="Toggle bank list"
          >
            <ChevronDown
              className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen && "rotate-180")}
            />
          </button>
        </div>
      </div>

      {/* Floating Autocomplete Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white rounded-2xl border border-slate-200/90 shadow-[0_12px_28px_-6px_rgba(0,0,0,0.12),0_8px_10px_-6px_rgba(0,0,0,0.06)] overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
          {/* Category Filter Pills inside Dropdown */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/80 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
              <span className="uppercase tracking-wider">
                {searchQuery ? "Search Results" : "All Indian Banks & NBFCs"}
              </span>
              <span className="text-indigo-600 font-semibold">
                {filteredBanks.length} available
              </span>
            </div>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 no-scrollbar">
              {["All", "Public Bank", "Private Bank", "NBFC", "Small Finance Bank"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat as BankCategory)}
                  className={cn(
                    "text-[10px] px-2.5 py-1 sm:py-0.5 min-h-[32px] sm:min-h-[26px] rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 touch-manipulation",
                    selectedCategory === cat
                      ? "bg-indigo-600 text-white font-bold shadow-2xs"
                      : "bg-white text-slate-600 border border-slate-200/70 hover:bg-slate-100"
                  )}
                >
                  {cat === "All"
                    ? "All (75+)"
                    : cat === "Public Bank"
                    ? "Public (12)"
                    : cat === "Private Bank"
                    ? "Private (21)"
                    : cat === "NBFC"
                    ? "NBFCs (17)"
                    : "Small Finance (11)"}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Banks List */}
          <div className="max-h-64 overflow-y-auto divide-y divide-slate-50 p-1">
            {filteredBanks.length > 0 ? (
              filteredBanks.map((bank) => {
                const isSelected = value.toLowerCase() === bank.name.toLowerCase();
                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => handleSelectBank(bank)}
                    className={cn(
                      "w-full flex items-center justify-between gap-2.5 px-3 py-2.5 sm:py-2 min-h-[44px] rounded-xl text-left transition-colors cursor-pointer text-xs active:scale-[0.99] touch-manipulation",
                      isSelected
                        ? "bg-indigo-50/80 text-indigo-900 font-bold"
                        : "hover:bg-slate-50 text-slate-700 font-medium"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BankLogo bankName={bank.name} logoUrl={bank.logoUrl} size="md" />
                      <div className="min-w-0">
                        <div className="truncate text-xs font-bold text-slate-800">
                          {bank.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal truncate">
                          {bank.shortName} • {bank.category}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 stroke-[2.5]" />
                    )}
                  </button>
                );
              })
            ) : (
              <div className="py-4 text-center text-xs text-slate-400">
                No matching financial institution found.
              </div>
            )}

            {/* Custom Lender Option when typing */}
            {searchQuery.trim() && !matchedBank && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-slate-50 rounded-[8px] transition-colors cursor-pointer text-xs text-indigo-700 font-bold"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-indigo-600" />
                </div>
                <span>
                  Use custom lender: <span className="underline">&ldquo;{searchQuery.trim()}&rdquo;</span>
                </span>
              </button>
            )}
          </div>

          {/* Footer inside Dropdown: Link to Full Directory Modal */}
          <div className="p-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-[11px]">
            <span className="text-slate-400 text-[10px]">
              Can&apos;t find your bank?
            </span>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsModalOpen(true);
              }}
              className="text-indigo-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Grid2X2 className="w-3 h-3" />
              <span>Browse All 75+ Indian Banks</span>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FULL BANK DIRECTORY MODAL DIALOG / MOBILE BOTTOM SHEET    */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-t-[24px] sm:rounded-2xl border-t sm:border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[88dvh] sm:max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 pb-[env(safe-area-inset-bottom)] sm:pb-0">
            {/* Mobile Sheet Drag Handle */}
            <div className="flex sm:hidden justify-center pt-2.5 pb-1">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>

            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0B132B]">
                    All Indian Banks & NBFCs Directory
                  </h3>
                  <p className="text-[11px] text-slate-500 font-normal">
                    Select from 75+ RBI-scheduled public, private, small finance banks & NBFCs.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 sm:w-8 sm:h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-all cursor-pointer active:scale-95 touch-manipulation"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Search Bar & Category Tabs */}
            <div className="p-3.5 sm:p-4 border-b border-slate-100 bg-slate-50/60 space-y-2.5 sm:space-y-3">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={modalSearchQuery}
                  onChange={(e) => setModalSearchQuery(e.target.value)}
                  placeholder="Type any bank name (e.g. Canara, Federal, BoB, LIC, Muthoot)..."
                  className="w-full h-11 sm:h-9 min-h-[44px] sm:min-h-[36px] pl-9.5 pr-9 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-slate-800 placeholder:text-slate-400 font-medium touch-manipulation"
                  autoFocus
                />
                {modalSearchQuery && (
                  <button
                    type="button"
                    onClick={() => setModalSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md active:scale-95 touch-manipulation"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
                {BANK_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setModalCategory(cat)}
                    className={cn(
                      "text-[10px] px-3 py-1.5 sm:py-1 min-h-[34px] sm:min-h-[28px] rounded-lg font-semibold whitespace-nowrap transition-all cursor-pointer active:scale-95 touch-manipulation",
                      modalCategory === cat
                        ? "bg-indigo-600 text-white font-bold shadow-2xs"
                        : "bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-100"
                    )}
                  >
                    {cat === "All"
                      ? "All (75+)"
                      : cat === "Public Bank"
                      ? "Public Sector (12)"
                      : cat === "Private Bank"
                      ? "Private Sector (21)"
                      : cat === "NBFC"
                      ? "NBFCs (17)"
                      : cat === "Small Finance Bank"
                      ? "Small Finance (11)"
                      : cat === "Payment Bank"
                      ? "Payments (5)"
                      : "Foreign (13)"}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Grid of All Banks */}
            <div className="p-3 sm:p-4 overflow-y-auto max-h-[50vh] divide-y divide-slate-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {modalFilteredBanks.map((bank) => {
                  const isSelected = value.toLowerCase() === bank.name.toLowerCase();
                  return (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => handleSelectBank(bank)}
                      className={cn(
                        "flex items-center justify-between p-3 sm:p-2.5 min-h-[48px] sm:min-h-[44px] rounded-xl border text-left transition-all cursor-pointer gap-2.5 active:scale-[0.99] touch-manipulation",
                        isSelected
                          ? "bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/20 font-bold"
                          : "bg-white border-slate-200/70 hover:bg-slate-50 hover:border-slate-300"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <BankLogo bankName={bank.name} logoUrl={bank.logoUrl} size="md" />
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            {bank.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block truncate">
                            {bank.shortName} • {bank.category}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <Check className="w-4 h-4 text-indigo-600 shrink-0 stroke-[2.5]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {modalFilteredBanks.length === 0 && (
                <div className="py-8 text-center space-y-2">
                  <p className="text-xs text-slate-500">
                    No listed bank matched &ldquo;<strong>{modalSearchQuery}</strong>&rdquo;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(modalSearchQuery);
                      setIsModalOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 min-h-[40px] rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all active:scale-95 touch-manipulation"
                  >
                    <span>Use &ldquo;{modalSearchQuery}&rdquo; as custom lender</span>
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                Showing <strong>{modalFilteredBanks.length}</strong> institutions
              </span>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="h-10 sm:h-8 min-h-[40px] sm:min-h-[32px] px-4 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer active:scale-95 touch-manipulation"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
