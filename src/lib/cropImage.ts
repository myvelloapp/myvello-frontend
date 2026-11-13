export interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Creates an HTML Image element from a source URL
 */
export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Converts degrees to radians
 */
export function getRadianAngle(degreeValue: number): number {
  return (degreeValue * Math.PI) / 180;
}

/**
 * Returns the new bounding area of a rotated rectangle
 */
export function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
    height: Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
  };
}

/**
 * Crops and transforms the image on an HTML5 canvas with optional privacy/censor filter
 */
export default async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0,
  flip = { horizontal: false, vertical: false },
  filter: "none" | "blur" | "grayscale" | "censor" = "none"
): Promise<string> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d canvas context available");
  }

  const rotRad = getRadianAngle(rotation);

  // Calculate bounding box of the rotated image
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  // Set canvas size to match the bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Translate canvas context to a central point to allow rotating and flipping around the center
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Apply privacy filter if selected
  if (filter === "blur") {
    ctx.filter = "blur(6px)";
  } else if (filter === "grayscale") {
    ctx.filter = "grayscale(100%)";
  } else if (filter === "censor") {
    ctx.filter = "blur(12px) contrast(120%)";
  } else {
    ctx.filter = "none";
  }

  // Draw rotated image
  ctx.drawImage(image, 0, 0);

  // Now create the output cropped canvas
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) {
    throw new Error("No 2d cropped context available");
  }

  // Set final avatar dimensions (e.g. 400x400 high resolution for crisp display)
  const targetSize = Math.min(400, Math.max(pixelCrop.width, pixelCrop.height));
  croppedCanvas.width = targetSize;
  croppedCanvas.height = targetSize;

  // Draw the cropped image onto the final canvas
  croppedCtx.drawImage(
    canvas,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetSize,
    targetSize
  );

  // Return base64 webp (or jpeg fallback)
  return croppedCanvas.toDataURL("image/webp", 0.92);
}
