import React from 'react';
import { Trash2 } from 'lucide-react';
import type { HomeworkTask } from '../../types';

interface TaskItemRowProps {
  task: HomeworkTask;
  onUpdate: (id: string, field: 'name' | 'earnedScore' | 'maxScore', value: string | number) => void;
  onDelete: (id: string) => void;
}

export const TaskItemRow: React.FC<TaskItemRowProps> = ({ task, onUpdate, onDelete }) => {
  return (
    <div className="task-item-row">
      <div className="task-number-badge">№{task.taskNumber}</div>
      <div className="task-name-input-wrap">
        <input
          type="text"
          className="task-input name-input"
          value={task.name}
          onChange={(e) => onUpdate(task.id, 'name', e.target.value)}
          placeholder={`Задание ${task.taskNumber}`}
        />
      </div>
      <div className="task-scores-wrap">
        <input
          type="number"
          min="0"
          step="0.5"
          className="task-input score-input"
          value={task.earnedScore === 0 && isNaN(task.earnedScore) ? '' : task.earnedScore}
          onChange={(e) => onUpdate(task.id, 'earnedScore', parseFloat(e.target.value) || 0)}
          title="Полученный балл"
        />
        <span className="scores-divider">/</span>
        <input
          type="number"
          min="0.5"
          step="0.5"
          className="task-input score-input max-score"
          value={task.maxScore === 0 && isNaN(task.maxScore) ? '' : task.maxScore}
          onChange={(e) => onUpdate(task.id, 'maxScore', parseFloat(e.target.value) || 0)}
          title="Максимальный балл"
        />
      </div>
      <button
        type="button"
        className="task-delete-btn"
        onClick={() => onDelete(task.id)}
        title="Удалить задание"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};