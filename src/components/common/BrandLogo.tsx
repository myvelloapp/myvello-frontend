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
}

export function BrandLogo({
  className = "h-8 w-auto",
  href = "/",
  onClick,
  priority = true,
}: BrandLogoProps) {
  const logoImage = (
    <Image
      src="/images/logo.svg"
      alt="myvello"
      width={324}
      height={73}
      priority={priority}
      unoptimized
      className={cn("h-8 w-auto object-contain block select-none", className)}
    />
  );

  if (!href) return logoImage;

  return (
    <Link
      href={href}
      onClick={onClick}
      className="inline-block transition-opacity hover:opacity-90"
      aria-label="myvello"
    >
      {logoImage}
    </Link>
  );
}
