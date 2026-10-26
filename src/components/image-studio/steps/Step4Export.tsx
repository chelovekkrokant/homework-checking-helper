import React, { useState } from 'react';
import { Download, FileDown, Copy, Check } from 'lucide-react';
import type { PlacedCanvasItem } from '../../../types';
import { exportSheetsToPdf } from '../../../utils/pdfGenerator';
import { copyCanvasToClipboard, downloadDataUrl } from '../../../utils/clipboard';

interface Step4ExportProps {
  placedItems: PlacedCanvasItem[];
  onPrev: () => void;
}

export const Step4Export: React.FC<Step4ExportProps> = ({ placedItems, onPrev }) => {
  const [copied, setCopied] = useState(false);

  const renderSingleA4Canvas = async (): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    // Высокое печатное разрешение А4 (1240 x 1754 px)
    canvas.width = 1240;
    canvas.height = 1754;
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const screenSheet = document.getElementById('a4-single-canvas');
    const scaleFactor = screenSheet && screenSheet.clientWidth > 0
      ? canvas.width / screenSheet.clientWidth
      : 1240 / 480;

    for (const item of placedItems) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(
            img,
            item.x * scaleFactor,
            item.y * scaleFactor,
            item.width * scaleFactor,
            item.height * scaleFactor
          );
          resolve();
        };
        img.onerror = () => resolve();
        img.src = item.sourceUrl;
      });
    }

    return canvas;
  };

  const handleExportJpg = async () => {
    const canvas = await renderSingleA4Canvas();
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    downloadDataUrl(dataUrl, 'homework_a4_sheet.jpg');
  };

  const handleExportPdf = async () => {
    const canvas = await renderSingleA4Canvas();
    await exportSheetsToPdf([canvas], 'homework_a4_sheet.pdf');
  };

  const handleCopyToClipboard = async () => {
    const canvas = await renderSingleA4Canvas();
    await copyCanvasToClipboard(canvas);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="step-card">
      <h3>Шаг 4: Экспорт скомпонованного листа А4</h3>
      <p className="step-description">
        Сохраните готовый холст в высоком качестве или сразу скопируйте в буфер обмена для отправки.
      </p>

      <div className="export-grid">
        <div className="export-action-card" onClick={handleExportJpg}>
          <Download size={32} className="export-icon" />
          <h4>Экспорт в JPG</h4>
          <p>Скачать сформированный лист А4 как изображение высокой четкости.</p>
          <button type="button" className="primary-btn">Скачать .jpg</button>
        </div>

        <div className="export-action-card" onClick={handleExportPdf}>
          <FileDown size={32} className="export-icon" />
          <h4>Экспорт в PDF</h4>
          <p>Создать документ формата А4, готовый к печати.</p>
          <button type="button" className="primary-btn">Скачать .pdf</button>
        </div>

        <div className="export-action-card" onClick={handleCopyToClipboard}>
          {copied ? <Check size={32} className="export-icon success-icon" /> : <Copy size={32} className="export-icon" />}
          <h4>Буфер обмена</h4>
          <p>Скопировать лист для быстрой вставки (Ctrl + V / Cmd + V).</p>
          <button type="button" className="secondary-btn">
            {copied ? 'Скопировано!' : 'Копировать в буфер'}
          </button>
        </div>
      </div>

      <div className="step-actions-row">
        <button type="button" className="secondary-btn" onClick={onPrev}>
          ← Назад к листу А4
        </button>
      </div>
    </div>
  );
};