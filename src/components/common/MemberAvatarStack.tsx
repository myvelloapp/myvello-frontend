"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FamilyMemberPreview } from "@/services/familyService";
import { Wallet, Home } from "lucide-react";

interface MemberAvatarStackProps {
  members?: FamilyMemberPreview[];
  count?: number;
  type?: "personal" | "family" | "all";
  size?: "xs" | "sm" | "md";
  className?: string;
  ringClass?: string;
}

const GRADIENT_PALETTE = [
  "from-indigo-500 to-indigo-700",
  "from-teal-500 to-emerald-600",
  "from-violet-500 to-purple-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
];

function SingleAvatarItem({
  member,
  index,
  sizeClass,
  textSizeClass,
  ringClass,
}: {
  member: FamilyMemberPreview;
  index: number;
  sizeClass: string;
  textSizeClass: string;
  ringClass?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const initial = (member.name || "M").trim().charAt(0).toUpperCase();
  const gradient = GRADIENT_PALETTE[index % GRADIENT_PALETTE.length];
  const hasPhoto = Boolean(member.profile_photo && !imageError);

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden shrink-0 shadow-2xs border border-white/60 transition-transform",
        sizeClass,
        ringClass || "ring-[1.5px] ring-white"
      )}
      title={member.name}
    >
      {hasPhoto ? (
        <Image
          src={member.profile_photo!}
          alt={member.name}
          fill
          unoptimized
          sizes="28px"
          className="object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={cn(
            "w-full h-full flex items-center justify-center font-black text-white select-none bg-gradient-to-tr leading-none",
            gradient,
            textSizeClass
          )}
        >
          {initial}
        </div>
      )}
    </div>
  );
}

export function MemberAvatarStack({
  members = [],
  count,
  type = "family",
  size = "md",
  className,
  ringClass,
}: MemberAvatarStackProps) {
  const config = {
    xs: {
      avatar: "w-4.5 h-4.5",
      overlap: "-space-x-1",
      text: "text-[8px]",
      ring: "ring-[1.5px] ring-white",
      iconBox: "w-5 h-5 rounded-full",
      iconSize: "w-2.5 h-2.5",
    },
    sm: {
      avatar: "w-5 h-5",
      overlap: "-space-x-1.5",
      text: "text-[9px]",
      ring: "ring-[1.5px] ring-white",
      iconBox: "w-6 h-6 rounded-full",
      iconSize: "w-3 h-3",
    },
    md: {
      avatar: "w-6 h-6",
      overlap: "-space-x-1.5",
      text: "text-[10px]",
      ring: "ring-[1.5px] ring-white",
      iconBox: "w-7 h-7 rounded-full",
      iconSize: "w-3.5 h-3.5",
    },
  }[size];

  // Personal Vault always renders a dedicated Vault icon badge (avoiding duplicate personal profile photo)
  if (type === "personal" || !members || members.length === 0) {
    return (
      <div
        className={cn(
          "text-white flex items-center justify-center shrink-0 shadow-2xs transition-transform",
          config.iconBox,
          ringClass ||
            (type === "personal"
              ? "ring-[1.5px] ring-indigo-200/50"
              : "ring-[1.5px] ring-teal-200/50"),
          type === "personal"
            ? "bg-gradient-to-tr from-indigo-500 to-indigo-700"
            : "bg-gradient-to-tr from-teal-500 to-indigo-600",
          className
        )}
        title={type === "personal" ? "Personal Vault" : "Family Workspace"}
      >
        {type === "personal" ? (
          <Wallet className={config.iconSize} strokeWidth={2.4} />
        ) : (
          <Home className={config.iconSize} strokeWidth={2.4} />
        )}
      </div>
    );
  }

  const displayed = members.slice(0, 3);
  const totalCount = count || members.length;
  const remaining = totalCount - displayed.length;

  return (
    <div className={cn("flex items-center shrink-0", config.overlap, className)}>
      {displayed.map((m, idx) => (
        <SingleAvatarItem
          key={m.id || idx}
          member={m}
          index={idx}
          sizeClass={config.avatar}
          textSizeClass={config.text}
          ringClass={ringClass || config.ring}
        />
      ))}

      {remaining > 0 && (
        <div
          className={cn(
            "relative rounded-full overflow-hidden shrink-0 shadow-2xs border border-white/60 bg-slate-100 text-slate-700 font-black flex items-center justify-center select-none",
            config.avatar,
            config.text,
            ringClass || config.ring
          )}
          title={`${remaining} more member${remaining > 1 ? "s" : ""}`}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}
