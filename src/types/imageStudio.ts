export interface ImageFilterSettings {
  brightness: number;     // от -100 до 100
  contrast: number;       // от -100 до 100
  binarization: boolean;  // ч/б бинаризация
  whiteBalance: boolean;  // авто баланс белого
}

export interface StudioImageItem {
  id: string;
  file: File;
  originalUrl: string;    // исходный URL без фильтров
  previewUrl: string;     // URL с примененными фильтрами и поворотом
  rotation: number;       // 0, 90, 180, 270
  filters: ImageFilterSettings; // индивидуальные текущие фильтры
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

// Теперь шагов 4 вместо 5 (объединены шаги 2 и 3)
export type StudioStep = 1 | 2 | 3 | 4;