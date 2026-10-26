import React from 'react';
import { Plus } from 'lucide-react';
import type { HomeworkMeta, HomeworkTask, HomeworkSummary } from '../../types';
import { TaskItemRow } from './TaskItemRow';
import { SummaryScore } from './SummaryScore';

interface GradingPanelColumnProps {
  meta: HomeworkMeta;
  onMetaChange: (field: keyof HomeworkMeta, value: string | number) => void;
  tasks: HomeworkTask[];
  onAddTask: () => void;
  onUpdateTask: (id: string, field: 'name' | 'earnedScore' | 'maxScore', value: string | number) => void;
  onDeleteTask: (id: string) => void;
  summary: HomeworkSummary;
}

export const GradingPanelColumn: React.FC<GradingPanelColumnProps> = ({
  meta,
  onMetaChange,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  summary,
}) => {
  return (
    <section className="grading-panel-column">
      <div className="grading-meta-box">
        <div className="input-group">
          <label className="input-label" htmlFor="hw-title">
            Имя домашнего задания
          </label>
          <input
            id="hw-title"
            type="text"
            className="base-input"
            value={meta.title}
            onChange={(e) => onMetaChange('title', e.target.value)}
            placeholder="Например: ДЗ Алгебра 26.10.2026"
          />
        </div>

        <div className="input-group-row">
          <label className="input-label" htmlFor="start-num">
            Начало нумерации:
          </label>
          <input
            id="start-num"
            type="number"
            min="1"
            className="base-input small-input"
            value={meta.startNumber}
            onChange={(e) => onMetaChange('startNumber', parseInt(e.target.value, 10) || 1)}
          />
        </div>
      </div>

      <div className="tasks-list-header">
        <span className="tasks-list-title">Задания ({tasks.length})</span>
        <button type="button" className="primary-btn add-btn" onClick={onAddTask}>
          <Plus size={16} />
          Добавить задание
        </button>
      </div>

      <div className="tasks-scroll-container">
        {tasks.length === 0 ? (
          <div className="tasks-empty-state">
            Список пуст. Нажмите «Добавить задание», чтобы начать выставление баллов.
          </div>
        ) : (
          <div className="tasks-list">
            {tasks.map((task) => (
              <TaskItemRow
                key={task.id}
                task={task}
                onUpdate={onUpdateTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        )}
      </div>

      <div className="grading-footer">
        <SummaryScore summary={summary} />
      </div>
    </section>
  );
};