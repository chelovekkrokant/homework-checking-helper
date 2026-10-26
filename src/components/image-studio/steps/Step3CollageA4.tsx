import React, { useState } from 'react';
import { Rnd } from 'react-rnd';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import type { StudioImageItem, PlacedCanvasItem } from '../../../types';

interface Step3CollageA4Props {
  images: StudioImageItem[];
  placedItems: PlacedCanvasItem[];
  onUpdatePlacedItems: (items: PlacedCanvasItem[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3CollageA4: React.FC<Step3CollageA4Props> = ({
  images,
  placedItems,
  onUpdatePlacedItems,
  onNext,
  onPrev,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Добавить фото на лист с вычислением исходного соотношения сторон
  const handleAddToCanvas = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const naturalAspect = img.naturalWidth / img.naturalHeight;
      const initialWidth = 320; // Базовая ширина на листе А4
      const calculatedHeight = Math.round(initialWidth / naturalAspect);

      const newItem: PlacedCanvasItem = {
        id: crypto.randomUUID(),
        sourceUrl: imageUrl,
        x: 30,
        y: 30 + placedItems.length * 30,
        width: initialWidth,
        height: calculatedHeight,
        zIndex: placedItems.length + 1,
      };

      onUpdatePlacedItems([...placedItems, newItem]);
      setSelectedId(newItem.id);
    };
    img.src = imageUrl;
  };

  const handleRemovePlaced = (id: string) => {
    onUpdatePlacedItems(placedItems.filter((i) => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <div className="step-card">
      <h3>Шаг 3: Свободное размещение на листе А4</h3>
      <p className="step-description">
        Один холст формата А4 (пропорции 1 : 1.414). Соотношение сторон изображений зафиксировано — масштабирование происходит без растяжения и искажений.
      </p>

      {/* Верхняя лента доступных фото */}
      <div className="canvas-insert-tray">
        <span className="tray-title">Кликните по фото, чтобы вставить на лист А4:</span>
        <div className="tray-list">
          {images.map((img, idx) => (
            <div
              key={img.id}
              className="tray-item"
              onClick={() => handleAddToCanvas(img.previewUrl)}
              title="Добавить на лист А4"
            >
              <img src={img.previewUrl} alt={`#${idx + 1}`} className="tray-thumb" />
              <span className="tray-badge">
                <Plus size={12} /> Вставить
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Рабочая область: Единственный лист А4 */}
      <div className="a4-workspace-bg">
        <div className="single-a4-sheet" id="a4-single-canvas">
          {placedItems.length === 0 && (
            <div className="sheet-watermark">
              Лист А4 пуст. Нажмите на любое фото из ленты вверху, чтобы разместить его.
            </div>
          )}

          {placedItems.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <Rnd
                key={item.id}
                size={{ width: item.width, height: item.height }}
                position={{ x: item.x, y: item.y }}
                bounds="parent"
                lockAspectRatio={true} // Фиксация соотношения сторон при изменении размера
                onDragStart={() => setSelectedId(item.id)}
                onDragStop={(_e, d) => {
                  onUpdatePlacedItems(
                    placedItems.map((p) => (p.id === item.id ? { ...p, x: d.x, y: d.y } : p))
                  );
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  onUpdatePlacedItems(
                    placedItems.map((p) =>
                      p.id === item.id
                        ? {
                            ...p,
                            width: parseFloat(ref.style.width),
                            height: parseFloat(ref.style.height),
                            ...position,
                          }
                        : p
                    )
                  );
                }}
                className={`rnd-canvas-item ${isSelected ? 'rnd-selected' : ''}`}
                // Ручки ресайза только по углам, чтобы обеспечивать пропорциональное масштабирование
                enableResizing={{
                  top: false,
                  right: false,
                  bottom: false,
                  left: false,
                  topRight: true,
                  bottomRight: true,
                  bottomLeft: true,
                  topLeft: true,
                }}
                resizeHandleClasses={{
                  topLeft: 'custom-rnd-handle handle-corner',
                  topRight: 'custom-rnd-handle handle-corner',
                  bottomLeft: 'custom-rnd-handle handle-corner',
                  bottomRight: 'custom-rnd-handle handle-corner',
                }}
              >
                <div
                  className="rnd-inner-content"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(item.id);
                  }}
                >
                  {/* Панель удаления над активным элементом */}
                  {isSelected && (
                    <div className="rnd-floating-toolbar">
                      <button
                        type="button"
                        className="toolbar-btn danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemovePlaced(item.id);
                        }}
                        title="Удалить с листа"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}

                  <img src={item.sourceUrl} alt="Элемент холста" className="rnd-image" />
                </div>
              </Rnd>
            );
          })}
        </div>
      </div>

      <div className="step-actions-row">
        <button type="button" className="secondary-btn" onClick={onPrev}>
          ← Назад к фильтрам
        </button>
        <button type="button" className="primary-btn" onClick={onNext}>
          К сохранению и экспорту <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};