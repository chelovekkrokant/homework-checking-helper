import type { HomeworkTask, HomeworkSummary } from '../types';

export function calculateHomeworkSummary(tasks: HomeworkTask[]): HomeworkSummary {
  if (tasks.length === 0) {
    return {
      totalEarned: 0,
      totalMax: 0,
      percentage: 0,
      grade: '—',
    };
  }

  const totalEarned = tasks.reduce((sum, task) => sum + (Number(task.earnedScore) || 0), 0);
  const totalMax = tasks.reduce((sum, task) => sum + (Number(task.maxScore) || 0), 0);

  const percentage = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;

  // Традиционная шкала оценивания:
  // >= 85% — 5 (Отлично), >= 70% — 4 (Хорошо), >= 50% — 3 (Удовл.), < 50% — 2 (Неуд.)
  let grade: string | number = 2;
  if (percentage >= 85) {
    grade = 5;
  } else if (percentage >= 70) {
    grade = 4;
  } else if (percentage >= 50) {
    grade = 3;
  } else {
    grade = 2;
  }

  return {
    totalEarned: Math.round(totalEarned * 100) / 100,
    totalMax: Math.round(totalMax * 100) / 100,
    percentage: Math.round(percentage * 10) / 10,
    grade,
  };
}