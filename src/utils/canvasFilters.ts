import type { ImageFilterSettings } from '../types';

/**
 * Алгоритм простого баланса белого методом "серого мира" / выравнивания максимумов (White Patch Retinex)
 */
function applyWhiteBalance(data: Uint8ClampedArray) {
  let maxR = 0;
  let maxG = 0;
  let maxB = 0;

  // Поиск максимальных значений каналов
  for (let i = 0; i < data.length; i += 4) {
    if (data[i] > maxR) maxR = data[i];
    if (data[i + 1] > maxG) maxG = data[i + 1];
    if (data[i + 2] > maxB) maxB = data[i + 2];
  }

  // Предотвращение деления на ноль или слишком малых значений
  maxR = Math.max(maxR, 128);
  maxG = Math.max(maxG, 128);
  maxB = Math.max(maxB, 128);

  const scaleR = 255 / maxR;
  const scaleG = 255 / maxG;
  const scaleB = 255 / maxB;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] * scaleR);
    data[i + 1] = Math.min(255, data[i + 1] * scaleG);
    data[i + 2] = Math.min(255, data[i + 2] * scaleB);
  }
}

/**
 * Рендерит изображение с учетом поворота, яркости, контраста, баланса белого и бинаризации
 */
export async function processImageFilters(
  imageUrl: string,
  rotation: number,
  filters: ImageFilterSettings
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const isRotatedSideways = rotation % 180 !== 0;
      const targetWidth = isRotatedSideways ? img.height : img.width;
      const targetHeight = isRotatedSideways ? img.width : img.height;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Не удалось получить CanvasRenderingContext2D'));
        return;
      }

      // 1. Поворот вокруг центра
      ctx.translate(targetWidth / 2, targetHeight / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      // 2. Получение пикселей для фильтрации
      const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const d = imgData.data;

      // Баланс белого (до контраста и бинаризации)
      if (filters.whiteBalance) {
        applyWhiteBalance(d);
      }

      // Яркость и Контраст
      const contrastFactor = (259 * (filters.contrast + 255)) / (255 * (259 - filters.contrast));
      const brightnessShift = (filters.brightness / 100) * 255;

      for (let i = 0; i < d.length; i += 4) {
        let r = d[i];
        let g = d[i + 1];
        let b = d[i + 2];

        // Яркость
        r += brightnessShift;
        g += brightnessShift;
        b += brightnessShift;

        // Контраст
        r = contrastFactor * (r - 128) + 128;
        g = contrastFactor * (g - 128) + 128;
        b = contrastFactor * (b - 128) + 128;

        // Ч/Б Бинаризация (режим сканера)
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
      resolve(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.onerror = (err) => reject(err);
    img.src = imageUrl;
  });
}