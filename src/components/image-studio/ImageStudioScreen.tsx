import React, { useState } from "react";
import type {
  StudioStep,
  StudioImageItem,
  ImageFilterSettings,
  PlacedCanvasItem,
} from "../../types";
import { processImageFilters } from "../../utils/canvasFilters";
import { Step1Upload } from "./steps/Step1Upload";
import { Step2BatchAndTune } from "./steps/Step2BatchAndTune";
import { Step3CollageA4 } from "./steps/Step3CollageA4";
import { Step4Export } from "./steps/Step4Export";

export const ImageStudioScreen: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<StudioStep>(1);

  const [images, setImages] = useState<StudioImageItem[]>([]);

  const [placedItems, setPlacedItems] = useState<PlacedCanvasItem[]>([]);

  const [batchFilters, setBatchFilters] = useState<ImageFilterSettings>({
    brightness: 0,
    contrast: 0,
    binarization: false,
    whiteBalance: false,
  });

  const stepsList: { step: StudioStep; label: string }[] = [
    { step: 1, label: "Загрузка" },
    { step: 2, label: "Обработка" },
    { step: 3, label: "Коллаж" },
    { step: 4, label: "Экспорт" },
  ];

  const handleUpload = (fileList: FileList) => {
    const defaultFilter: ImageFilterSettings = { ...batchFilters };
    const newItems: StudioImageItem[] = Array.from(fileList).map((file) => {
      const url = URL.createObjectURL(file);
      return {
        id: crypto.randomUUID(),
        file,
        originalUrl: url,
        previewUrl: url,
        rotation: 0,
        filters: { ...defaultFilter },
      };
    });
    setImages((prev) => [...prev, ...newItems]);
  };

  const handleRemoveImage = (id: string) => {
    setImages((prev) => prev.filter((i) => i.id !== id));
  };

  const handleBatchFilterChange = async (newFilters: ImageFilterSettings) => {
    setBatchFilters(newFilters);
    const updated = await Promise.all(
      images.map(async (img) => {
        const mergedFilters: ImageFilterSettings = {
          ...newFilters,
          whiteBalance: img.filters.whiteBalance || newFilters.whiteBalance,
        };
        const processedUrl = await processImageFilters(
          img.originalUrl,
          img.rotation,
          mergedFilters,
        );
        return {
          ...img,
          filters: mergedFilters,
          previewUrl: processedUrl,
        };
      }),
    );
    setImages(updated);
  };

  const handleApplyBatchWhiteBalance = async () => {
    const isAnyWbActive =
      batchFilters.whiteBalance ||
      images.some((img) => img.filters.whiteBalance);
    const nextWbState = !isAnyWbActive;

    const nextBatchFilters = { ...batchFilters, whiteBalance: nextWbState };
    setBatchFilters(nextBatchFilters);

    const updated = await Promise.all(
      images.map(async (img) => {
        const nextFilters: ImageFilterSettings = {
          ...img.filters,
          whiteBalance: nextWbState,
        };
        const processedUrl = await processImageFilters(
          img.originalUrl,
          img.rotation,
          nextFilters,
        );
        return {
          ...img,
          filters: nextFilters,
          previewUrl: processedUrl,
        };
      }),
    );
    setImages(updated);
  };

  const handleSingleRotate = async (id: string) => {
    const updated = await Promise.all(
      images.map(async (img) => {
        if (img.id === id) {
          const nextRotation = (img.rotation + 90) % 360;
          const processedUrl = await processImageFilters(
            img.originalUrl,
            nextRotation,
            img.filters,
          );
          return { ...img, rotation: nextRotation, previewUrl: processedUrl };
        }
        return img;
      }),
    );
    setImages(updated);
  };

  const handleSingleWhiteBalance = async (id: string) => {
    const updated = await Promise.all(
      images.map(async (img) => {
        if (img.id === id) {
          const nextWb = !img.filters.whiteBalance;
          const nextFilters = { ...img.filters, whiteBalance: nextWb };
          const processedUrl = await processImageFilters(
            img.originalUrl,
            img.rotation,
            nextFilters,
          );
          return { ...img, filters: nextFilters, previewUrl: processedUrl };
        }
        return img;
      }),
    );
    setImages(updated);
  };

  return (
    <div className="screen-container studio-screen">
      <div className="studio-stepper-bar">
        {stepsList.map((item) => (
          <button
            key={item.step}
            type="button"
            className={`stepper-item ${currentStep === item.step ? "active" : ""}`}
            onClick={() => setCurrentStep(item.step)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="studio-content-area">
        {currentStep === 1 && (
          <Step1Upload
            images={images}
            onUpload={handleUpload}
            onRemove={handleRemoveImage}
            onNext={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 2 && (
          <Step2BatchAndTune
            images={images}
            batchFilters={batchFilters}
            onBatchFilterChange={handleBatchFilterChange}
            onApplyBatchWhiteBalance={handleApplyBatchWhiteBalance}
            onSingleRotate={handleSingleRotate}
            onSingleWhiteBalance={handleSingleWhiteBalance}
            onRemoveImage={handleRemoveImage}
            onNext={() => setCurrentStep(3)}
            onPrev={() => setCurrentStep(1)}
          />
        )}

        {currentStep === 3 && (
          <Step3CollageA4
            images={images}
            placedItems={placedItems}
            onUpdatePlacedItems={setPlacedItems}
            onNext={() => setCurrentStep(4)}
            onPrev={() => setCurrentStep(2)}
          />
        )}

        {currentStep === 4 && (
          <Step4Export
            placedItems={placedItems}
            onPrev={() => setCurrentStep(3)}
          />
        )}
      </div>
    </div>
  );
};
