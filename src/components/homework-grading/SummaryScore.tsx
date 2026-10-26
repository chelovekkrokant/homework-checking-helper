import React from 'react';
import type { HomeworkSummary } from '../../types';

interface SummaryScoreProps {
  summary: HomeworkSummary;
}

export const SummaryScore: React.FC<SummaryScoreProps> = ({ summary }) => {
  const getGradeColor = (grade: string | number) => {
    switch (grade) {
      case 5:
        return '#16a34a'; // зеленый
      case 4:
        return '#2563eb'; // синий
      case 3:
        return '#d97706'; // оранжевый
      case 2:
        return '#dc2626'; // красный
      default:
        return '#64748b';
    }
  };

  return (
    <div className="summary-score-card">
      <div className="summary-row">
        <span className="summary-label">Набрано баллов:</span>
        <span className="summary-value">
          <strong>{summary.totalEarned}</strong> из <strong>{summary.totalMax}</strong>
        </span>
      </div>

      <div className="summary-row">
        <span className="summary-label">Процент выполнения:</span>
        <span className="summary-value percentage-value">
          {summary.percentage}%
        </span>
      </div>

      {/* Прогресс-бар выполнения */}
      <div className="summary-progress-bar-bg">
        <div
          className="summary-progress-bar-fill"
          style={{
            width: `${Math.min(100, Math.max(0, summary.percentage))}%`,
            backgroundColor: getGradeColor(summary.grade),
          }}
        />
      </div>

      <div className="summary-grade-row">
        <span>Рекомендуемая оценка:</span>
        <span
          className="summary-grade-badge"
          style={{ backgroundColor: getGradeColor(summary.grade) }}
        >
          {summary.grade}
        </span>
      </div>
    </div>
  );
};