import React from 'react';

export const HomeworkGradingScreen: React.FC = () => {
  return (
    <div className="screen-container grading-screen-layout">
      {/* Левая колонка: 60% — Просмотрщик ДЗ */}
      <section className="grading-viewer-column">
        <div className="column-header">
          <h3>Просмотр проверенного ДЗ</h3>
          <span className="badge">Колонка 1 (60%)</span>
        </div>
        <div className="viewer-placeholder">
          <p>Область независимого изображения ДЗ</p>
          <small>Здесь будет вьюер с функциями zoom и pan</small>
        </div>
      </section>

      {/* Правая колонка: 40% — Оценивание */}
      <section className="grading-panel-column">
        <div className="column-header">
          <h3>Журнал оценивания</h3>
          <span className="badge">Колонка 2 (40%)</span>
        </div>
        <div className="grading-panel-content">
          <p className="placeholder-description">
            Здесь будут расположены поля ввода названия работы, стартового номера,
            список заданий с баллами и блок автоматического подсчета итогов.
          </p>
        </div>
      </section>
    </div>
  );
};