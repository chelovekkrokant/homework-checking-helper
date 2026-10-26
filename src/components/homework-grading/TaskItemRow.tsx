import React from "react";
import { Trash2, Plus, Minus, CheckCircle } from "lucide-react";
import type { HomeworkTask } from "../../types";

interface TaskItemRowProps {
  task: HomeworkTask;
  onUpdate: (
    id: string,
    field: "name" | "earnedScore" | "maxScore",
    value: string | number,
  ) => void;
  onDelete: (id: string) => void;
}

export const TaskItemRow: React.FC<TaskItemRowProps> = ({
  task,
  onUpdate,
  onDelete,
}) => {
  const adjustEarned = (delta: number) => {
    const current = Math.round(Number(task.earnedScore) || 0);
    const max = Math.round(Number(task.maxScore) || 0);
    const nextVal = Math.max(0, Math.min(max, current + delta));
    onUpdate(task.id, "earnedScore", nextVal);
  };

  const adjustMax = (delta: number) => {
    const current = Math.round(Number(task.maxScore) || 1);
    const nextVal = Math.max(1, current + delta);
    onUpdate(task.id, "maxScore", nextVal);
  };

  const setMaxEarned = () => {
    onUpdate(task.id, "earnedScore", Math.round(Number(task.maxScore) || 0));
  };

  const handleEarnedChange = (valStr: string) => {
    if (valStr === "") {
      onUpdate(task.id, "earnedScore", 0);
      return;
    }
    const intVal = parseInt(valStr, 10);
    onUpdate(task.id, "earnedScore", isNaN(intVal) ? 0 : Math.max(0, intVal));
  };

  const handleMaxChange = (valStr: string) => {
    if (valStr === "") {
      onUpdate(task.id, "maxScore", 1);
      return;
    }
    const intVal = parseInt(valStr, 10);
    onUpdate(task.id, "maxScore", isNaN(intVal) ? 1 : Math.max(1, intVal));
  };

  return (
    <div className="task-item-card">
      {}
      <div className="task-item-header">
        <div className="task-number-pill">№{task.taskNumber}</div>
        <input
          type="text"
          className="task-name-input"
          value={task.name}
          onChange={(e) => onUpdate(task.id, "name", e.target.value)}
          placeholder={`Задание ${task.taskNumber}`}
        />
        <button
          type="button"
          className="task-delete-icon-btn"
          onClick={() => onDelete(task.id)}
          title="Удалить задание"
        >
          <Trash2 size={15} />
        </button>
      </div>

      {}
      <div className="task-item-controls-grid">
        {}
        <div className="score-sub-block">
          <div className="control-label-row">
            <span className="control-label">Балл ученика:</span>
            <button
              type="button"
              className={`full-score-btn ${task.earnedScore === task.maxScore && task.maxScore > 0 ? "active" : ""}`}
              onClick={setMaxEarned}
              title="Поставить максимум"
            >
              <CheckCircle size={12} />
              Макс
            </button>
          </div>
          <div className="score-stepper">
            <button
              type="button"
              className="stepper-btn"
              onClick={() => adjustEarned(-1)}
              title="Уменьшить"
            >
              <Minus size={13} />
            </button>
            <input
              type="number"
              step="1"
              min="0"
              className="score-stepper-input"
              value={task.earnedScore}
              onChange={(e) => handleEarnedChange(e.target.value)}
            />
            <button
              type="button"
              className="stepper-btn"
              onClick={() => adjustEarned(1)}
              title="Увеличить"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>

        {}
        <div className="score-sub-block">
          <div className="control-label-row">
            <span className="control-label">Максимум:</span>
            <div className="quick-max-chips">
              {[1, 2, 5, 10].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`chip-btn ${task.maxScore === preset ? "active" : ""}`}
                  onClick={() => onUpdate(task.id, "maxScore", preset)}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>
          <div className="score-stepper">
            <button
              type="button"
              className="stepper-btn"
              onClick={() => adjustMax(-1)}
              title="Уменьшить"
            >
              <Minus size={13} />
            </button>
            <input
              type="number"
              step="1"
              min="1"
              className="score-stepper-input max-val"
              value={task.maxScore}
              onChange={(e) => handleMaxChange(e.target.value)}
            />
            <button
              type="button"
              className="stepper-btn"
              onClick={() => adjustMax(1)}
              title="Увеличить"
            >
              <Plus size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
