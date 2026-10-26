import React, { useRef } from "react";
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  ArrowRight,
} from "lucide-react";
import type { StudioImageItem } from "../../../types";

interface Step1UploadProps {
  images: StudioImageItem[];
  onUpload: (files: FileList) => void;
  onRemove: (id: string) => void;
  onNext: () => void;
}

export const Step1Upload: React.FC<Step1UploadProps> = ({
  images,
  onUpload,
  onRemove,
  onNext,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(e.dataTransfer.files);
    }
  };

  return (
    <div className="step-card">
      <h3>Шаг 1: Загрузка исходных фотографий</h3>
      <p className="step-description">
        Загрузите фотографии страниц тетради. Вы можете сразу просмотреть их и
        удалить ненужные кадры.
      </p>

      <div
        className="upload-dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          multiple
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => e.target.files && onUpload(e.target.files)}
        />
        <UploadCloud size={44} className="dropzone-icon" />
        <span className="dropzone-text">
          Перетащите файлы сюда или нажмите для выбора
        </span>
        <span className="dropzone-hint">
          Поддерживаются форматы JPG, PNG, WEBP
        </span>
      </div>

      {}
      {images.length > 0 && (
        <div className="upload-preview-section">
          <div className="upload-preview-header">
            <div className="summary-left">
              <ImageIcon size={18} />
              <span>
                Загружено фотографий: <strong>{images.length}</strong>
              </span>
            </div>
            <button type="button" className="primary-btn" onClick={onNext}>
              Перейти к обработке <ArrowRight size={16} />
            </button>
          </div>

          <div className="upload-preview-grid">
            {images.map((img, idx) => (
              <div key={img.id} className="upload-preview-card">
                <span className="upload-preview-num">#{idx + 1}</span>
                <img
                  src={img.previewUrl}
                  alt={`Превью ${idx + 1}`}
                  className="upload-preview-img"
                />
                <button
                  type="button"
                  className="upload-delete-btn"
                  onClick={() => onRemove(img.id)}
                  title="Удалить это фото"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
