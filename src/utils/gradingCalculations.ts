import type { HomeworkTask, HomeworkSummary } from "../types";

function getGradeFromPercentage(percentage: number): number {
  if (percentage >= 85) return 5;
  if (percentage >= 70) return 4;
  if (percentage >= 50) return 3;
  return 2;
}

export function calculateHomeworkSummary(
  tasks: HomeworkTask[],
): HomeworkSummary {
  if (tasks.length === 0) {
    return {
      totalEarned: 0,
      totalMax: 0,
      percentage: 0,
      grade: "—",
    };
  }

  const totalEarned = tasks.reduce(
    (sum, task) => sum + (Number(task.earnedScore) || 0),
    0,
  );
  const totalMax = tasks.reduce(
    (sum, task) => sum + (Number(task.maxScore) || 0),
    0,
  );

  const percentage = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0;
  const grade = getGradeFromPercentage(percentage);

  return {
    totalEarned: Math.round(totalEarned * 100) / 100,
    totalMax: Math.round(totalMax * 100) / 100,
    percentage: Math.round(percentage * 10) / 10,
    grade,
  };
}