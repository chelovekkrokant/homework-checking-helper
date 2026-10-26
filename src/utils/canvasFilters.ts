import type { ImageFilterSettings } from "../types";
import type { PixelCrop } from "react-image-crop";

function applyWhiteBalance(data: Uint8ClampedArray) {
  const pixelCount = data.length / 4;
  if (pixelCount === 0) return;

  const histogram = new Int32Array(256);
  for (let i = 0; i < data.length; i += 4) {
    const luma = Math.round(
      0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2],
    );
    histogram[luma]++;
  }

  const thresholdCount = pixelCount * 0.98;
  let accumulated = 0;
  let whiteThreshold = 255;

  for (let i = 0; i < 256; i++) {
    accumulated += histogram[i];
    if (accumulated >= thresholdCount) {
      whiteThreshold = i;
      break;
    }
  }

  whiteThreshold = Math.max(whiteThreshold, 140);

  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  let sampleCount = 0;

  for (let i = 0; i < data.length; i += 4) {
    const luma = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    if (luma >= whiteThreshold) {
      sumR += data[i];
      sumG += data[i + 1];
      sumB += data[i + 2];
      sampleCount++;
    }
  }

  if (sampleCount === 0) return;

  const avgR = sumR / sampleCount;
  const avgG = sumG / sampleCount;
  const avgB = sumB / sampleCount;

  const targetWhite = 255;
  const scaleR = targetWhite / Math.max(avgR, 100);
  const scaleG = targetWhite / Math.max(avgG, 100);
  const scaleB = targetWhite / Math.max(avgB, 100);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.round(data[i] * scaleR));
    data[i + 1] = Math.min(255, Math.round(data[i + 1] * scaleG));
    data[i + 2] = Math.min(255, Math.round(data[i + 2] * scaleB));
  }
}
export async function processImageFilters(
  imageUrl: string,
  rotation: number,
  filters: ImageFilterSettings,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const isRotatedSideways = rotation % 180 !== 0;
      const targetWidth = isRotatedSideways ? img.height : img.width;
      const targetHeight = isRotatedSideways ? img.width : img.height;

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Не удалось получить CanvasRenderingContext2D"));
        return;
      }

      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const d = imgData.data;

      if (filters.whiteBalance) {
        applyWhiteBalance(d);
      }

      const contrastFactor =
        (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
      const brightnessShift = (filters.brightness / 100) * 255;

      for (let i = 0; i < d.length; i += 4) {
        let r = d[i];
        let g = d[i + 1];
        let b = d[i + 2];

        r += brightnessShift;
        g += brightnessShift;
        b += brightnessShift;

        r = contrastFactor * (r - 128) + 128;
        g = contrastFactor * (g - 128) + 128;
        b = contrastFactor * (b - 128) + 128;

        if (filters.binarization) {
          const grayscale = 0.299 * r + 0.587 * g + 0.114 * b;
          const binary = grayscale > 145 ? 255 : 0;
          r = binary;
          g = binary;
          b = binary;
        }

        d[i] = Math.min(255, Math.max(0, r));
        d[i + 1] = Math.min(255, Math.max(0, g));
        d[i + 2] = Math.min(255, Math.max(0, b));
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
}

export async function getCroppedImgDataUrl(
  imageElement: HTMLImageElement,
  crop: PixelCrop,
): Promise<string> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Не удалось получить 2D контекст для кадрирования");
  }

  const scaleX = imageElement.naturalWidth / imageElement.width;
  const scaleY = imageElement.naturalHeight / imageElement.height;

  const pixelX = crop.x * scaleX;
  const pixelY = crop.y * scaleY;
  const pixelWidth = crop.width * scaleX;
  const pixelHeight = crop.height * scaleY;

  canvas.width = Math.max(1, Math.round(pixelWidth));
  canvas.height = Math.max(1, Math.round(pixelHeight));

  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    imageElement,
    pixelX,
    pixelY,
    pixelWidth,
    pixelHeight,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return canvas.toDataURL("image/jpeg", 0.95);
}
