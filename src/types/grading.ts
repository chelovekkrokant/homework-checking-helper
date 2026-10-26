export interface HomeworkTask {
  id: string;
  name: string;        // по умолчанию "Задание N"
  taskNumber: number;  // порядковый номер задания
  maxScore: number;    // максимальный балл (например, 10)
  earnedScore: number; // полученный балл ученика (например, 8)
}

export interface HomeworkMeta {
  title: string;       // имя работы (дата или идентификатор)
  startNumber: number; // стартовый номер для сквозной нумерации (по умолчанию 1)
}

export interface HomeworkSummary {
  totalEarned: number;
  totalMax: number;
  percentage: number;
  grade: string | number; // 5/4/3/2 или зачет
}

export interface ZoomPanState {
  scale: number;
  positionX: number;
  positionY: number;
}