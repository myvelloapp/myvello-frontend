"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl sm:max-w-[620px] bg-white rounded-t-[28px] sm:rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[90vh] animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200">
        {/* Mobile Pull Handle */}
        <div className="w-10 h-1.5 rounded-full bg-slate-300 mx-auto mt-2.5 -mb-1 sm:hidden shrink-0" />

        {/* Hidden permanent file input - accessible by dropzone AND Change Photo footer button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-theme-gradient text-white flex items-center justify-center shrink-0 shadow-2xs shadow-indigo-500/20">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-[#0B132B]">
                {imageSrc ? "Crop & Adjust Profile Photo" : "Upload Profile Photo"}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Centered circular avatar with precision zoom and rotation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer active:scale-95 touch-manipulation"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
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
              className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/25 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all space-y-3 group touch-manipulation"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-105 transition-transform">
                <Upload className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-black text-[#0B132B]">
                  Drag and drop your photo here
                </h4>
                <p className="text-xs text-slate-500">
                  or <span className="font-bold text-indigo-600 underline">browse files</span> from your device
                </p>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[10px] text-slate-500 font-semibold">
                Supports JPG, PNG, WEBP up to 8MB • Auto-centered 1:1 circular crop
              </div>
            </div>
          ) : (
            /* State 2: Interactive Cropper with Centered Circular Mask */
            <div className="space-y-3.5">
              {/* Cropper Viewport Container (also supports dropping a replacement image) */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="relative w-full h-64 sm:h-80 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-inner"
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
                    containerClassName: "rounded-xl",
                  }}
                />
              </div>

              {/* Spacious & Modern Controls Toolbar */}
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-3.5 sm:p-4 space-y-3">
                {/* 1. Zoom Slider Row */}
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={() => setZoom(Math.max(1, zoom - 0.2))}
                    className="w-10 h-10 sm:w-8 sm:h-8 min-w-[40px] sm:min-w-[32px] rounded-xl sm:rounded-[8px] border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation shrink-0"
                    title="Zoom out"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <div className="flex-1 relative flex items-center">
                    <input
                      type="range"
                      min={1}
                      max={3}
                      step={0.05}
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full accent-indigo-600 cursor-pointer h-2 sm:h-1.5 bg-slate-200 rounded-lg touch-manipulation"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setZoom(Math.min(3, zoom + 0.2))}
                    className="w-10 h-10 sm:w-8 sm:h-8 min-w-[40px] sm:min-w-[32px] rounded-xl sm:rounded-[8px] border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-500 hover:text-slate-800 flex items-center justify-center shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation shrink-0"
                    title="Zoom in"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-white border border-slate-200/80 px-2 py-1 sm:py-0.5 rounded-lg sm:rounded-[6px] min-w-[48px] text-center shadow-2xs shrink-0">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* 2. Orientation & Reset Row */}
                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-slate-200/70">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev - 90) % 360)}
                      className="min-h-[40px] sm:min-h-[32px] px-3 sm:px-2.5 rounded-xl sm:rounded-[8px] bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Rotate -90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRotation((prev) => (prev + 90) % 360)}
                      className="min-h-[40px] sm:min-h-[32px] px-3 sm:px-2.5 rounded-xl sm:rounded-[8px] bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation whitespace-nowrap"
                    >
                      <RotateCw className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Rotate +90°</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetCenter}
                    className="min-h-[40px] sm:min-h-[32px] px-3.5 sm:px-3 rounded-xl sm:rounded-[8px] bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs inline-flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 touch-manipulation whitespace-nowrap"
                  >
                    <Maximize2 className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Clean, Non-Congested Modal Footer with Safe-Area clearance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 py-3.5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:pb-3.5 border-t border-slate-100 bg-slate-50/50 shrink-0 gap-3">
          {imageSrc ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] px-3.5 rounded-xl sm:rounded-[8px] border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer shadow-2xs inline-flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
              >
                <Upload className="w-3.5 h-3.5 text-indigo-600" />
                <span>Change</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] px-3.5 rounded-xl sm:rounded-[8px] border border-rose-200 hover:border-rose-300 bg-white hover:bg-rose-50 text-xs font-bold text-rose-600 transition-all cursor-pointer shadow-2xs inline-flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation whitespace-nowrap"
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

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] px-4 rounded-xl sm:rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all cursor-pointer active:scale-95 touch-manipulation whitespace-nowrap flex items-center justify-center"
            >
              Cancel
            </button>
            {imageSrc && (
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveCroppedImage}
                className="flex-1 sm:flex-none min-h-[44px] sm:min-h-[36px] px-5 rounded-xl sm:rounded-[8px] btn-gradient-glow text-white text-xs font-bold shadow-md shadow-indigo-500/20 active:scale-95 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 disabled:opacity-60 touch-manipulation whitespace-nowrap"
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
    </div>
  );
}
