import React, { useRef, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Image as ImageIcon,
  Clipboard,
} from "lucide-react";

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

  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard?.read) {
        alert(
          "Чтение буфера не поддерживается в данном браузере. Воспользуйтесь сочетанием Ctrl+V / Cmd+V.",
        );
        return;
      }
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((type) => type.startsWith("image/"));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], "clipboard_image.png", {
            type: imageType,
          });
          onImageUpload(file);
          return;
        }
      }
      alert(
        "В буфере обмена нет изображения. Скопируйте картинку или скриншот и повторите.",
      );
    } catch (err) {
      console.error("Ошибка доступа к буферу обмена:", err);
      alert(
        "Не удалось получить доступ к буферу обмена. Разрешите доступ к буферу в браузере или используйте Ctrl+V / Cmd+V.",
      );
    }
  };

  useEffect(() => {
    const handlePasteEvent = (e: ClipboardEvent) => {
      const activeElement = document.activeElement;
      if (
        activeElement instanceof HTMLInputElement ||
        activeElement instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith("image/")) {
          e.preventDefault();
          onImageUpload(file);
        }
      }
    };

    window.addEventListener("paste", handlePasteEvent);
    return () => {
      window.removeEventListener("paste", handlePasteEvent);
    };
  }, [onImageUpload]);

  return (
    <section className="grading-viewer-column">
      <div className="viewer-top-bar">
        <div className="viewer-title">
          <ImageIcon size={18} />
          <span>Просмотр работы</span>
        </div>
        <div className="viewer-actions">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <button
            type="button"
            className="secondary-btn"
            onClick={handlePasteFromClipboard}
            title="Вставить скопированное изображение из буфера обмена (или нажмите Ctrl+V)"
          >
            <Clipboard size={14} />
            Вставить из буфера
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} />
            {imageSrc ? "Заменить файл" : "Выбрать файл"}
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
          <div className="viewer-empty-dropzone">
            <Upload size={40} className="empty-icon" />
            <p className="empty-text">Загрузите изображение проверенного ДЗ</p>
            <div className="empty-actions-row">
              <button
                type="button"
                className="primary-btn"
                onClick={handlePasteFromClipboard}
              >
                <Clipboard size={15} /> Вставить из буфера (Ctrl + V)
              </button>
              <button
                type="button"
                className="secondary-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={15} /> Выбрать файл с диска
              </button>
            </div>
            <span className="empty-subtext">
              Поддерживаются форматы JPG, PNG, WebP
            </span>
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
                  <button
                    type="button"
                    onClick={() => zoomIn()}
                    title="Приблизить"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => zoomOut()}
                    title="Отдалить"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => resetTransform()}
                    title="Сбросить масштаб"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%" }}
                  contentStyle={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
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
