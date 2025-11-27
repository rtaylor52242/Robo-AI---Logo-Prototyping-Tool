
import React, { useState, useRef, useEffect } from 'react';
import type { ImageData } from '../types';

interface ImageCropperProps {
  imageData: ImageData;
  onCrop: (croppedData: ImageData) => void;
  onCancel: () => void;
}

export const ImageCropper: React.FC<ImageCropperProps> = ({ imageData, onCrop, onCancel }) => {
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentPos, setCurrentPos] = useState<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getSelectionRect = () => {
    if (!startPos || !currentPos) return null;
    const x = Math.min(startPos.x, currentPos.x);
    const y = Math.min(startPos.y, currentPos.y);
    const width = Math.abs(currentPos.x - startPos.x);
    const height = Math.abs(currentPos.y - startPos.y);
    return { x, y, width, height };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartPos({ x, y });
    setCurrentPos({ x, y });
    setIsDrawing(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    setCurrentPos({ x, y });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleApplyCrop = () => {
    const selection = getSelectionRect();
    const img = imageRef.current;
    const container = containerRef.current;

    if (!selection || selection.width < 10 || selection.height < 10 || !img || !container) {
       // If no selection or too small, just return original or alert
       if(!selection) {
           onCancel();
           return;
       }
       alert("Selection too small");
       return;
    }

    // Calculate scaling factor between displayed image and actual natural dimensions
    const scaleX = img.naturalWidth / container.clientWidth;
    const scaleY = img.naturalHeight / container.clientHeight;

    const cropX = selection.x * scaleX;
    const cropY = selection.y * scaleY;
    const cropW = selection.width * scaleX;
    const cropH = selection.height * scaleY;

    const canvas = document.createElement('canvas');
    canvas.width = cropW;
    canvas.height = cropH;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      img,
      cropX, cropY, cropW, cropH, // Source
      0, 0, cropW, cropH          // Destination
    );

    const croppedBase64 = canvas.toDataURL(imageData.mimeType).split(',')[1];
    onCrop({ base64: croppedBase64, mimeType: imageData.mimeType });
  };

  const selection = getSelectionRect();

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-4">
      <div className="flex justify-between w-full max-w-4xl mb-4 text-white">
        <h3 className="text-xl font-bold">Crop Image</h3>
        <div className="flex gap-4">
            <button onClick={onCancel} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500">Cancel</button>
            <button onClick={handleApplyCrop} className="px-4 py-2 bg-brand-primary rounded hover:bg-brand-secondary font-bold">Apply Crop</button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        className="relative border-2 border-gray-500 cursor-crosshair select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ maxHeight: '80vh', maxWidth: '100%' }}
      >
        <img 
            ref={imageRef}
            src={`data:${imageData.mimeType};base64,${imageData.base64}`} 
            alt="To crop" 
            className="max-h-[80vh] max-w-full object-contain pointer-events-none"
        />
        {selection && (
            <div 
                className="absolute border-2 border-white bg-white/20"
                style={{
                    left: selection.x,
                    top: selection.y,
                    width: selection.width,
                    height: selection.height
                }}
            />
        )}
      </div>
      <p className="text-gray-400 mt-2 text-sm">Click and drag to select the area you want to keep.</p>
    </div>
  );
};
