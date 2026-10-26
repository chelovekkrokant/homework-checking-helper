import React from 'react';
import { Sliders, Sun, Contrast, FileText, Wand2, RotateCw, Trash2, ArrowRight } from 'lucide-react';
import type { StudioImageItem, ImageFilterSettings } from '../../../types';

interface Step2BatchAndTuneProps {
  images: StudioImageItem[];
  batchFilters: ImageFilterSettings;
  onBatchFilterChange: (filters: ImageFilterSettings) => void;
  onApplyBatchWhiteBalance: () => void;
  onSingleRotate: (id: string) => void;
  onSingleWhiteBalance: (id: string) => void;
  onRemoveImage: (id: string) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step2BatchAndTune: React.FC<Step2BatchAndTuneProps> = ({
  images,
  batchFilters,
  onBatchFilterChange,
  onApplyBatchWhiteBalance,
  onSingleRotate,
  onSingleWhiteBalance,
  onRemoveImage,
  onNext,
  onPrev,
}) => {
  // Проверяем, активен ли баланс белого для всех изображений
  const isAllWbActive = images.length > 0 && images.every((img) => img.filters.whiteBalance);

  return (
    <div className="step-card">
      <div className="step-header-row">
        <div>
          <h3>Шаг 2: Цветокоррекция, баланс белого и поворот</h3>
          <p className="step-description">
            Результаты отображаются мгновенно. Баланс белого и поворот можно применять как ко всем фото, так и к каждому отдельно.
          </p>
        </div>
        <Sliders size={22} className="text-muted" />
      </div>

      {/* Верхняя панель: Общие настройки пакета */}
      <div className="batch-controls-box">
        <div className="filter-slider-group">
          <div className="slider-label">
            <Sun size={16} />
            <span>Яркость: {batchFilters.brightness > 0 ? `+${batchFilters.brightness}` : batchFilters.brightness}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={batchFilters.brightness}
            onChange={(e) =>
              onBatchFilterChange({ ...batchFilters, brightness: Number(e.target.value) })
            }
          />
        </div>

        <div className="filter-slider-group">
          <div className="slider-label">
            <Contrast size={16} />
            <span>Контраст: {batchFilters.contrast > 0 ? `+${batchFilters.contrast}` : batchFilters.contrast}%</span>
          </div>
          <input
            type="range"
            min="-100"
            max="100"
            value={batchFilters.contrast}
            onChange={(e) =>
              onBatchFilterChange({ ...batchFilters, contrast: Number(e.target.value) })
            }
          />
        </div>

        <div className="batch-toggles-row">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={batchFilters.binarization}
              onChange={(e) =>
                onBatchFilterChange({ ...batchFilters, binarization: e.target.checked })
              }
            />
            <FileText size={16} />
            <span>Ч/Б бинаризация для всех</span>
          </label>

          {/* Кнопка с переключением применения/отмены баланса белого для всех */}
          <button
            type="button"
            className={`secondary-btn ${isAllWbActive ? 'active-filter-btn' : ''}`}
            onClick={onApplyBatchWhiteBalance}
            title={isAllWbActive ? 'Отменить баланс белого для всех фото' : 'Применить баланс белого для всех фото'}
          >
            <Wand2 size={16} /> {isAllWbActive ? 'ББ включен (для всех)' : 'Баланс белого (для всех)'}
          </button>
        </div>
      </div>

      {/* Сетка фото с мгновенным результатом и индивидуальным управлением */}
      <div className="thumbnails-grid">
        {images.map((img, idx) => (
          <div key={img.id} className="thumbnail-card">
            <div className="thumbnail-index">#{idx + 1}</div>
            <div className="thumbnail-image-box">
              <img
                src={img.previewUrl}
                alt={`Фото ${idx + 1}`}
                className="thumbnail-img"
              />
            </div>
            <div className="thumbnail-actions-bar">
              <button
                type="button"
                className="secondary-btn small-btn"
                onClick={() => onSingleRotate(img.id)}
                title="Повернуть на 90 градусов"
              >
                <RotateCw size={13} /> 90°
              </button>
              <button
                type="button"
                className={`secondary-btn small-btn ${img.filters.whiteBalance ? 'active-filter-btn' : ''}`}
                onClick={() => onSingleWhiteBalance(img.id)}
                title={img.filters.whiteBalance ? 'Отменить баланс белого для этого фото' : 'Применить баланс белого выборочно'}
              >
                <Wand2 size={13} /> ББ
              </button>
              <button
                type="button"
                className="icon-danger-btn"
                onClick={() => onRemoveImage(img.id)}
                title="Удалить фото"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="step-actions-row">
        <button type="button" className="secondary-btn" onClick={onPrev}>
          ← Назад к загрузке
        </button>
        <button type="button" className="primary-btn" onClick={onNext}>
          К сборке листа А4 <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};