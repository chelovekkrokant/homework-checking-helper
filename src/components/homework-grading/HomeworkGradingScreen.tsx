import React, { useState, useMemo } from "react";
import type { HomeworkMeta, HomeworkTask } from "../../types";
import { calculateHomeworkSummary } from "../../utils/gradingCalculations";
import { ImageViewerColumn } from "./ImageViewerColumn";
import { GradingPanelColumn } from "./GradingPanelColumn";

export const HomeworkGradingScreen: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const [meta, setMeta] = useState<HomeworkMeta>({
    title: "ДЗ Занятие 1",
    startNumber: 1,
  });

  const [tasks, setTasks] = useState<HomeworkTask[]>([
    { id: "1", name: "Задание 1", taskNumber: 1, earnedScore: 9, maxScore: 10 },
    { id: "2", name: "Задание 2", taskNumber: 2, earnedScore: 7, maxScore: 10 },
  ]);

  const handleImageUpload = (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    setImageSrc(objectUrl);
  };

  const handleImageClear = () => {
    setImageSrc(null);
  };

  const handleMetaChange = (
    field: keyof HomeworkMeta,
    value: string | number,
  ) => {
    setMeta((prev) => {
      const nextMeta = { ...prev, [field]: value };
      if (field === "startNumber") {
        const start =
          typeof value === "number"
            ? Math.round(value)
            : parseInt(String(value), 10) || 0;
        setTasks((prevTasks) =>
          prevTasks.map((t, idx) => {
            const nextNum = start + idx;
            return {
              ...t,
              taskNumber: nextNum,
              name: t.name.startsWith("Задание ")
                ? `Задание ${nextNum}`
                : t.name,
            };
          }),
        );
      }
      return nextMeta;
    });
  };

  const handleAddTask = () => {
    setTasks((prev) => {
      const start = Number(meta.startNumber) || 1;
      const nextNumber = start + prev.length;
      const newTask: HomeworkTask = {
        id: crypto.randomUUID(),
        name: `Задание ${nextNumber}`,
        taskNumber: nextNumber,
        maxScore: 10,
        earnedScore: 0,
      };
      return [...prev, newTask];
    });
  };

  const handleUpdateTask = (
    id: string,
    field: "name" | "earnedScore" | "maxScore",
    value: string | number,
  ) => {
    setTasks((prev) =>
      prev.map((t): HomeworkTask => {
        if (t.id === id) {
          if (field === "name") {
            return { ...t, name: String(value) };
          }
          if (field === "earnedScore" || field === "maxScore") {
            const intVal = Math.round(Number(value)) || 0;
            return { ...t, [field]: intVal };
          }
        }
        return t;
      }),
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      const start = Number(meta.startNumber) || 1;
      return filtered.map((t, idx) => {
        const nextNum = start + idx;
        return {
          ...t,
          taskNumber: nextNum,
        };
      });
    });
  };

  const summary = useMemo(() => calculateHomeworkSummary(tasks), [tasks]);

  return (
    <div className="screen-container grading-screen-layout">
      <ImageViewerColumn
        imageSrc={imageSrc}
        onImageUpload={handleImageUpload}
        onImageClear={handleImageClear}
      />
      <GradingPanelColumn
        meta={meta}
        onMetaChange={handleMetaChange}
        tasks={tasks}
        onAddTask={handleAddTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        summary={summary}
      />
    </div>
  );
};
