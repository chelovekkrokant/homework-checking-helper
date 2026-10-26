import React, { useRef } from 'react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Upload, ZoomIn, ZoomOut, RotateCcw, Image as ImageIcon } from 'lucide-react';

interface ImageViewerColumnProps {
  imageSrc: string | null;
  onImageUpload: (file: File) => void;
  onImageClear: () => void;
}

export const ImageViewerColumn: React.FC<ImageViewerColumnProps> = ({
  imageSrc,
  onImageUpload,
  onImageClear,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  return (
    <section className="grading-viewer-column">
      <div className="viewer-top-bar">
        <div className="viewer-title">
          <ImageIcon size={18} />
          <span>Просмотр работы (Колонка 1 — 60%)</span>
        </div>
        <div className="viewer-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.pdf"
            style={{ display: 'none' }}
          />
          <button
            type="button"
            className="secondary-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} />
            {imageSrc ? 'Заменить файл' : 'Выбрать файл'}
          </button>
          {imageSrc && (
            <button
              type="button"
              className="text-btn danger-text"
              onClick={onImageClear}
            >
              Сбросить
            </button>
          )}
        </div>
      </div>

      <div className="viewer-viewport-container">
        {!imageSrc ? (
          <div
            className="viewer-empty-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={40} className="empty-icon" />
            <p className="empty-text">Нажмите, чтобы загрузить изображение проверенного ДЗ</p>
            <span className="empty-subtext">JPG, PNG, WebP (полностью независимый файл)</span>
          </div>
        ) : (
          <TransformWrapper
            initialScale={1}
            minScale={0.2}
            maxScale={6}
            centerOnInit
            wheel={{ step: 0.1 }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <div className="viewer-canvas-wrapper">
                <div className="viewer-floating-controls">
                  <button type="button" onClick={() => zoomIn()} title="Приблизить">
                    <ZoomIn size={16} />
                  </button>
                  <button type="button" onClick={() => zoomOut()} title="Отдалить">
                    <ZoomOut size={16} />
                  </button>
                  <button type="button" onClick={() => resetTransform()} title="Сбросить масштаб">
                    <RotateCcw size={16} />
                  </button>
                </div>
                <TransformComponent
                  wrapperStyle={{ width: '100%', height: '100%' }}
                  contentStyle={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <img
                    src={imageSrc}
                    alt="Проверенное задание"
                    className="viewer-image"
                  />
                </TransformComponent>
              </div>
            )}
          </TransformWrapper>
        )}
      </div>
    </section>
  );
};