import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import ReactCrop, { type Crop, type PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Plus, Trash2, ArrowRight, Crop as CropIcon, Check, X } from 'lucide-react';
import type { StudioImageItem, PlacedCanvasItem } from '../../../types';
import { getCroppedImgDataUrl } from '../../../utils/canvasFilters';

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

  // Состояние модального окна кадрирования
  const [croppingTarget, setCroppingTarget] = useState<{ id: string; url: string; mode: 'edit_placed' | 'new_from_tray' } | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const cropImgRef = useRef<HTMLImageElement>(null);

  // Добавить фото на лист с сохранением естественного соотношения сторон
  const handleAddToCanvas = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const naturalAspect = img.naturalWidth / img.naturalHeight;
      const initialWidth = 320;
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

  // Открыть кроп для выбранного на листе элемента
  const handleStartCropPlaced = (item: PlacedCanvasItem) => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCroppingTarget({ id: item.id, url: item.sourceUrl, mode: 'edit_placed' });
  };

  // Открыть кроп для картинки из ленты
  const handleStartCropFromTray = (url: string) => {
    setCrop(undefined);
    setCompletedCrop(undefined);
    setCroppingTarget({ id: crypto.randomUUID(), url, mode: 'new_from_tray' });
  };

  // Применить кадрирование
// Применить кадрирование
  const handleApplyCrop = async () => {
    if (
      !croppingTarget ||
      !cropImgRef.current ||
      !completedCrop ||
      !completedCrop.width ||
      !completedCrop.height
    ) {
      setCroppingTarget(null);
      return;
    }

    // Передаем DOM-элемент с экрана для точного расчета scaleX / scaleY
    const croppedUrl = await getCroppedImgDataUrl(cropImgRef.current, completedCrop);
    const aspect = completedCrop.width / completedCrop.height;

    if (croppingTarget.mode === 'edit_placed') {
      onUpdatePlacedItems(
        placedItems.map((p) => {
          if (p.id === croppingTarget.id) {
            const nextHeight = Math.round(p.width / aspect);
            return {
              ...p,
              sourceUrl: croppedUrl,
              height: nextHeight,
            };
          }
          return p;
        })
      );
    } else {
      // Добавляем как новый элемент на лист
      const width = 320;
      const height = Math.round(width / aspect);
      const newItem: PlacedCanvasItem = {
        id: crypto.randomUUID(),
        sourceUrl: croppedUrl,
        x: 40,
        y: 40 + placedItems.length * 30,
        width,
        height,
        zIndex: placedItems.length + 1,
      };
      onUpdatePlacedItems([...placedItems, newItem]);
      setSelectedId(newItem.id);
    }

    setCroppingTarget(null);
  };

  return (
    <div className="step-card">
      <h3>Шаг 3: Свободное размещение и кадрирование на листе А4</h3>
      <p className="step-description">
        Один холст формата А4 (пропорции 1 : 1.414). Вы можете кадрировать фрагменты (Crop), масштабировать их за угловые маркеры и свободно перемещать.
      </p>

      {/* Верхняя лента фото */}
      <div className="canvas-insert-tray">
        <span className="tray-title">Добавить на лист:</span>
        <div className="tray-list">
          {images.map((img, idx) => (
            <div key={img.id} className="tray-item">
              <img src={img.previewUrl} alt={`#${idx + 1}`} className="tray-thumb" />
              <div className="tray-item-actions">
                <button
                  type="button"
                  className="secondary-btn small-btn"
                  onClick={() => handleAddToCanvas(img.previewUrl)}
                  title="Вставить целиком"
                >
                  <Plus size={12} /> Вся
                </button>
                <button
                  type="button"
                  className="secondary-btn small-btn"
                  onClick={() => handleStartCropFromTray(img.previewUrl)}
                  title="Обрезать нужную часть перед вставкой"
                >
                  <CropIcon size={12} /> Кроп
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Рабочая область А4 */}
      <div className="a4-workspace-bg">
        <div className="single-a4-sheet" id="a4-single-canvas">
          {placedItems.length === 0 && (
            <div className="sheet-watermark">
              Лист А4 пуст. Нажмите «Вся» или «Кроп» в ленте вверху для размещения задания.
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
                lockAspectRatio={true}
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
                  {/* Панель инструментов над активным элементом (Кроп + Удаление)[cite: 2] */}
                  {isSelected && (
                    <div className="rnd-floating-toolbar">
                      <button
                        type="button"
                        className="toolbar-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCropPlaced(item);
                        }}
                        title="Кадрировать этот фрагмент"
                      >
                        <CropIcon size={14} />
                      </button>
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

      {/* Модальное окно кадрирования с drag & drop и ручками изменения размера */}
      {croppingTarget && (
        <div className="crop-modal-overlay">
          <div className="crop-modal-content">
            <div className="crop-modal-header">
              <h4>Выделите полезную область задания</h4>
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => setCroppingTarget(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="crop-viewport">
              <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
              >
                <img
                  ref={cropImgRef}
                  src={croppingTarget.url}
                  alt="Область кадрирования"
                  style={{ maxHeight: '65vh', maxWidth: '100%' }}
                />
              </ReactCrop>
            </div>
            <div className="crop-modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => setCroppingTarget(null)}
              >
                Отмена
              </button>
              <button
                type="button"
                className="primary-btn"
                onClick={handleApplyCrop}
              >
                <Check size={16} /> Применить обрезку
              </button>
            </div>
          </div>
        </div>
      )}

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