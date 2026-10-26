export interface HomeworkTask {
  id: string;
  name: string;
  taskNumber: number;
  maxScore: number;
  earnedScore: number;
}

export interface HomeworkMeta {
  title: string;
  startNumber: number;
}

export interface HomeworkSummary {
  totalEarned: number;
  totalMax: number;
  percentage: number;
  grade: string | number;
}

export interface ZoomPanState {
  scale: number;
  positionX: number;
  positionY: number;
}
