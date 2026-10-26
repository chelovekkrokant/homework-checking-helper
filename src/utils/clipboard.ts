export async function copyCanvasToClipboard(canvasElement: HTMLCanvasElement): Promise<void> {
  return new Promise((resolve, reject) => {
    canvasElement.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Ошибка создания Blob из Canvas'));
        return;
      }
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        resolve();
      } catch (err) {
        reject(err);
      }
    }, 'image/png');
  });
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}