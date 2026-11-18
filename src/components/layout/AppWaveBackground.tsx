"use client";

import React, { memo } from "react";

/**
 * Organic Wave Ambient Background
 * Pure code vector implementation replicating the soft flowing mint/sage wave aesthetic.
 * Fixed in the background, hardware-accelerated, zero network weight, perfectly crisp on all viewports.
 */
function AppWaveBackgroundComponent() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#EDF8F2]"
    >
      {/* Ambient Radial Soft Glow in Center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_45%,#F6FCF9_0%,#EDF8F2_100%)] opacity-85" />

      {/* TOP-RIGHT FLOWING WAVES */}
      <div className="absolute top-0 right-0 w-[85vw] sm:w-[65vw] lg:w-[50vw] max-w-[950px] aspect-[650/360] transform-gpu">
        <svg
          viewBox="0 0 650 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="trWaveGrad4" x1="100%" y1="0%" x2="0%" y2="70%">
              <stop offset="0%" stopColor="#C5EAD9" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#E2F6EE" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#EDF8F2" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="trWaveGrad3" x1="100%" y1="0%" x2="10%" y2="60%">
              <stop offset="0%" stopColor="#B7E5D1" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#D4F2E5" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#EBF9F3" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="trWaveGrad2" x1="100%" y1="10%" x2="25%" y2="50%">
              <stop offset="0%" stopColor="#AEE1CB" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#C9EEDD" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E2F7EE" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="trWaveGrad1" x1="100%" y1="15%" x2="40%" y2="40%">
              <stop offset="0%" stopColor="#9DDDC2" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#BEE8D5" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Outermost soft sweep (Layer 4) */}
          <path
            d="M0 0 
               C110 70, 200 215, 330 225 
               C440 235, 530 205, 600 270 
               C625 295, 640 330, 650 360 
               L650 0 Z"
            fill="url(#trWaveGrad4)"
          />

          {/* Middle wave ribbon (Layer 3) */}
          <path
            d="M100 0 
               C190 55, 260 150, 370 158 
               C470 165, 540 135, 605 185 
               C628 205, 642 235, 650 265 
               L650 0 Z"
            fill="url(#trWaveGrad3)"
          />

          {/* Deeper crest (Layer 2) */}
          <path
            d="M210 0 
               C290 40, 360 100, 460 105 
               C540 110, 590 90, 625 125 
               C638 140, 646 155, 650 170 
               L650 0 Z"
            fill="url(#trWaveGrad2)"
          />

          {/* Deepest corner wave accent (Layer 1) */}
          <path
            d="M370 0 
               C440 25, 500 60, 570 65 
               C610 70, 635 80, 650 105 
               L650 0 Z"
            fill="url(#trWaveGrad1)"
          />
        </svg>
      </div>

      {/* BOTTOM-LEFT FLOWING WAVES */}
      <div className="absolute bottom-0 left-0 w-[85vw] sm:w-[65vw] lg:w-[50vw] max-w-[850px] aspect-[550/340] transform-gpu">
        <svg
          viewBox="0 0 550 340"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="blWaveGrad4" x1="0%" y1="100%" x2="70%" y2="0%">
              <stop offset="0%" stopColor="#C5EAD9" stopOpacity="0.6" />
              <stop offset="60%" stopColor="#E2F6EE" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#EDF8F2" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="blWaveGrad3" x1="5%" y1="100%" x2="65%" y2="20%">
              <stop offset="0%" stopColor="#B7E5D1" stopOpacity="0.7" />
              <stop offset="55%" stopColor="#D4F2E5" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#EBF9F3" stopOpacity="0.1" />
            </linearGradient>

            <linearGradient id="blWaveGrad2" x1="0%" y1="95%" x2="50%" y2="40%">
              <stop offset="0%" stopColor="#AEE1CB" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#C9EEDD" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#E2F7EE" stopOpacity="0.15" />
            </linearGradient>

            <linearGradient id="blWaveGrad1" x1="0%" y1="90%" x2="40%" y2="60%">
              <stop offset="0%" stopColor="#9DDDC2" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#BEE8D5" stopOpacity="0.45" />
            </linearGradient>
          </defs>

          {/* Outermost soft sweep (Layer 4) */}
          <path
            d="M0 0 
               C60 65, 150 170, 240 190 
               C330 210, 420 190, 500 270 
               C530 300, 545 325, 550 340 
               L0 340 Z"
            fill="url(#blWaveGrad4)"
          />

          {/* Middle wave ribbon (Layer 3) */}
          <path
            d="M0 90 
               C60 140, 140 230, 220 250 
               C295 270, 370 250, 430 310 
               C450 325, 465 335, 470 340 
               L0 340 Z"
            fill="url(#blWaveGrad3)"
          />

          {/* Deeper crest (Layer 2) */}
          <path
            d="M0 180 
               C55 220, 120 285, 180 300 
               C240 315, 295 305, 345 340 
               L0 340 Z"
            fill="url(#blWaveGrad2)"
          />

          {/* Deepest corner wave accent (Layer 1) */}
          <path
            d="M0 270 
               C50 300, 95 330, 150 340 
               L0 340 Z"
            fill="url(#blWaveGrad1)"
          />
        </svg>
      </div>
    </div>
  );
}

export const AppWaveBackground = memo(AppWaveBackgroundComponent);
