"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BrandLogoProps {
  className?: string;
  href?: string;
  onClick?: () => void;
  priority?: boolean;
  iconOnly?: boolean;
}

export function BrandLogo({
  className = "h-8 w-auto",
  href = "/",
  onClick,
  priority = true,
  iconOnly = false,
}: BrandLogoProps) {
  const logoImage = (
    <Image
      src={iconOnly ? "/icons/icon.svg" : "/images/logo.svg"}
      alt="myvello"
      width={iconOnly ? 48 : 324}
      height={iconOnly ? 48 : 73}
      priority={priority}
      unoptimized
      className={cn(
        iconOnly ? "h-8 w-8 object-contain block select-none" : "h-8 w-auto object-contain block select-none",
        className
      )}
    />
  );

  if (!href) return logoImage;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-flex items-center justify-center transition-transform hover:opacity-90 active:scale-95 shrink-0"
      aria-label="myvello"
    >
      {logoImage}
    </Link>
  );
}
