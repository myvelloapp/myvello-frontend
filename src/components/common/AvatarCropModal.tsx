"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper, { Point, Area } from "react-easy-crop";
import {
  X,
  Upload,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  AlertCircle,
  Camera,
  Trash2,
} from "lucide-react";
import getCroppedImg from "@/lib/cropImage";

interface AvatarCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCropCompleteSave: (croppedDataUrl: string) => Promise<void>;
  onRemoveAvatar?: () => Promise<void> | void;
  currentAvatarUrl?: string | null;
  userName?: string;
}

export function AvatarCropModal({
  isOpen,
  onClose,
  onCropCompleteSave,
  onRemoveAvatar,
  currentAvatarUrl,
  userName = "User",
}: AvatarCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalImageSrc, setOriginalImageSrc] = useState<string | null>(null);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initial state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      if (currentAvatarUrl && !imageSrc) {
        setImageSrc(currentAvatarUrl);
        setOriginalImageSrc(currentAvatarUrl);
      }
    } else {
      setImageSrc(null);
      setOriginalImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
      setErrorMessage(null);
    }
  }, [isOpen, currentAvatarUrl]);

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels);
    },
    []
  );

  if (!isOpen || !mounted) return null;

  // Handle file selection from input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      processFile(file);
    }
    // Reset file input value so re-selecting the exact same photo triggers onChange
    e.target.value = "";
  };

  const processFile = (file: File) => {
    setErrorMessage(null);

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage("Image file exceeds 8MB. Please choose a smaller file.");
      return;
    }

    // Validate type
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select a valid image file (JPEG, PNG, WEBP, GIF).");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const dataUrl = reader.result as string;
      setImageSrc(dataUrl);
      setOriginalImageSrc(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    });
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handle Remove Image / Avatar
  const handleRemove = async () => {
    if (onRemoveAvatar && currentAvatarUrl && imageSrc === currentAvatarUrl) {
      await onRemoveAvatar();
    }
    setImageSrc(null);
    setOriginalImageSrc(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setErrorMessage(null);
  };

  // Perform Crop & Save
  const handleSaveCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    setIsSaving(true);
    setErrorMessage(null);

    try {
      const croppedBase64 = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      await onCropCompleteSave(croppedBase64);
      onClose();
    } catch (err) {
      console.error("Crop error:", err);
      setErrorMessage("Failed to crop and save the image. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Quick reset to centered default
  const handleResetCenter = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 select-none"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100/90 overflow-hidden flex flex-col max-h-[92dvh] animate-in zoom-in-95 duration-200">
        {/* Hidden permanent file input - accessible by dropzone AND Change Photo button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Modal Top Header Banner with Brand Emerald Gradient & Aurora Glow */}
        <div className="p-5 sm:p-6 bg-gradient-to-br from-[#02361B] via-[#014421] to-[#012513] text-white relative overflow-hidden border-b border-emerald-800/40 shrink-0">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 bg-[#7CE617]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-300 stroke-[2.2]" />
                <span>{imageSrc ? "Crop & Adjust Profile Photo" : "Upload Profile Photo"}</span>
              </h2>
              <p className="text-xs text-emerald-100/80 font-medium">
                Centered circular avatar with precision zoom and rotation
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/90 hover:text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 active:scale-95 touch-manipulation"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3.5 flex-1">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* State 1: Dropzone (No Image Loaded) */}
          {!imageSrc ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-200/90 hover:border-emerald-500 bg-emerald-50/20 hover:bg-emerald-50/50 rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all space-y-3 group touch-manipulation"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100/80 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-105 transition-transform">
                <Upload className="w-6 h-6" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#02361B]">
                  Drag and drop your photo here
                </h4>
                <p className="text-xs text-slate-500">
                  or <span className="font-bold text-emerald-700 underline">browse files</span> from your device
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200/80 text-[10px] text-slate-500 font-semibold shadow-2xs">
                Supports JPG, PNG, WEBP up to 8MB
              </div>
            </div>
          ) : (
            /* State 2: Interactive Cropper with Centered Circular Mask */
            <div className="space-y-3">
              {/* Cropper Viewport Container */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative w-full h-64 sm:h-72 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-inner"
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  cropShape="round"
                  showGrid={true}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  classes={{
                    containerClassName: "rounded-2xl",
                  }}
                />
              </div>

              {/* Minimal Single-Row Controls Toolbar */}
              <div className="bg-slate-50/90 border border-slate-200/80 rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-3">
                {/* Left: Zoom Controls */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => setZoom(Math.max(1, Number((zoom - 0.2).toFixed(2))))}
                    className="w-7 h-7 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0"
                    title="Zoom out"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[#1C9E30] cursor-pointer h-1.5 bg-slate-200 rounded-lg touch-manipulation"
                    aria-label="Avatar zoom level"
                  />
                  <button
                    type="button"
                    onClick={() => setZoom(Math.min(3, Number((zoom + 0.2).toFixed(2))))}
                    className="w-7 h-7 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-white flex items-center justify-center transition-all cursor-pointer active:scale-90 shrink-0"
                    title="Zoom in"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-[11px] font-bold text-slate-700 bg-white border border-slate-200/80 px-2 py-0.5 rounded-md text-center shadow-2xs shrink-0 min-w-[42px]">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Vertical Divider */}
                <div className="w-px h-5 bg-slate-200 shrink-0" />

                {/* Right: Compact Rotate & Reset Icon Buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev - 90) % 360)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-[#02361B] hover:border-emerald-300 hover:bg-emerald-50/40 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-90"
                    title="Rotate left 90°"
                    aria-label="Rotate left 90°"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-emerald-700" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation((prev) => (prev + 90) % 360)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-[#02361B] hover:border-emerald-300 hover:bg-emerald-50/40 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-90"
                    title="Rotate right 90°"
                    aria-label="Rotate right 90°"
                  >
                    <RotateCw className="w-3.5 h-3.5 text-emerald-700" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCenter}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200/90 text-slate-500 hover:text-slate-800 hover:border-slate-300 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-90"
                    title="Reset position & zoom"
                    aria-label="Reset position & zoom"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Minimal Modal Footer with Safe-Area clearance */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 pb-[calc(1rem+env(safe-area-inset-bottom))] sm:pb-3.5 border-t border-slate-100 bg-slate-50/50 shrink-0 gap-2">
          {imageSrc ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-9 px-3 rounded-xl border border-slate-200/90 hover:border-emerald-500/50 bg-white hover:bg-slate-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-all cursor-pointer shadow-2xs inline-flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-700" />
                <span>Change</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="h-9 px-3 rounded-xl border border-rose-200/80 hover:border-rose-300 bg-white hover:bg-rose-50 text-xs font-bold text-rose-600 transition-all cursor-pointer shadow-2xs inline-flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                <span>Remove</span>
              </button>
            </div>
          ) : (
            <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap hidden sm:block">
              Stored securely in your private vault.
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation whitespace-nowrap flex items-center justify-center"
            >
              Cancel
            </button>
            {imageSrc && (
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveCroppedImage}
                className="h-9 px-5 rounded-xl btn-gradient-glow text-white text-xs font-bold shadow-md shadow-emerald-500/25 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60 touch-manipulation whitespace-nowrap"
              >
                {isSaving ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Save Avatar</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
