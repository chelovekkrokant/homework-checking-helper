import { jsPDF } from "jspdf";

export async function exportSheetsToPdf(
  canvases: HTMLCanvasElement[],
  filename = "homework.pdf",
) {
  if (canvases.length === 0) return;

  const pdf = new jsPDF("p", "mm", "a4");

  canvases.forEach((canvas, index) => {
    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    if (index > 0) {
      pdf.addPage("a4", "p");
    }

    pdf.addImage(imgData, "JPEG", 0, 0, 210, 297, undefined, "FAST");
  });

  pdf.save(filename);
}
