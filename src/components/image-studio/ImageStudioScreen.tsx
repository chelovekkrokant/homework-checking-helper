import React, { useState } from 'react';
import type { StudioStep } from '../../types';

export const ImageStudioScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StudioStep>(1);

  const stepsList: { step: StudioStep; label: string }[] = [
    { step: 1, label: '1. Загрузка' },
    { step: 2, label: '2. Пакетная коррекция' },
    { step: 3, label: '3. Точечная доводка' },
    { step: 4, label: '4. Коллаж А4' },
    { step: 5, label: '5. Экспорт' },
  ];

  return (
    <div className="screen-container studio-screen">
      <div className="studio-stepper-bar">
        {stepsList.map((item) => (
          <button
            key={item.step}
            type="button"
            className={`stepper-item ${currentStep === item.step ? 'active' : ''}`}
            onClick={() => setCurrentStep(item.step)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="studio-content-area">
        <div className="placeholder-card">
          <h3>Экран 1: Подготовка и коллаж изображений</h3>
          <p>Текущий шаг: <strong>Шаг {currentStep}</strong></p>
          <p className="placeholder-description">
            Здесь будут размещены элементы шагов: пакетные фильтры, миниатюры с поворотом 90°,
            холсты формата А4 с кадрированием (drag & drop / handles) и панель экспорта.
          </p>
        </div>
      </div>
    </div>
  );
};