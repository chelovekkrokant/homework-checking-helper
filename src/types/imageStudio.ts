export interface ImageFilterSettings {
  brightness: number; // от -100 до 100 (по умолчанию 0)
  contrast: number;   // от -100 до 100 (по умолчанию 0)
  binarization: boolean; // ч/б бинаризация для рукописного текста
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  unit: 'px' | '%';
}

export interface StudioImageItem {
  id: string;
  file: File;
  previewUrl: string;
  rotation: number; // 0, 90, 180, 270
  customFilters?: Partial<ImageFilterSettings>; // индивидуальные фильтры (если переопределены)
}

export interface CanvasPlacedImage {
  id: string;
  sourceImageId: string;
  crop?: CropArea;
  scale: number; // масштаб от 0.1 до 3.0
  x: number;     // позиция на листе
  y: number;
  width: number;
  height: number;
}

export interface A4Sheet {
  id: string;
  pageNumber: number;
  images: CanvasPlacedImage[];
}

export type StudioStep = 1 | 2 | 3 | 4 | 5;

export type ExportFormat = 'jpg' | 'pdf' | 'clipboard';