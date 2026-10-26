import { jsPDF } from 'jspdf';

/**
 * Экспортирует массив canvas-элементов листов А4 в единый PDF документ
 */
export async function exportSheetsToPdf(canvases: HTMLCanvasElement[], filename = 'homework.pdf') {
  if (canvases.length === 0) return;

  // Формат А4 в книжной ориентации: 210 x 297 мм
  const pdf = new jsPDF('p', 'mm', 'a4');

  canvases.forEach((canvas, index) => {
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    if (index > 0) {
      pdf.addPage('a4', 'p');
    }
    // Растягиваем на всю страницу А4
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
  });

  pdf.save(filename);
}