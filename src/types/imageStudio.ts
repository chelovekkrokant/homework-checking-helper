export interface ImageFilterSettings {
  brightness: number;
  contrast: number;
  binarization: boolean;
  whiteBalance: boolean;
}

export interface StudioImageItem {
  id: string;
  file: File;
  originalUrl: string;
  previewUrl: string;
  rotation: number;
  filters: ImageFilterSettings;
}

export interface PlacedCanvasItem {
  id: string;
  sourceUrl: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

export type StudioStep = 1 | 2 | 3 | 4;
