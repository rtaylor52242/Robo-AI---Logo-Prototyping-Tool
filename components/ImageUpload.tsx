
import React, { useState, useCallback } from 'react';
import type { ImageData } from '../types';

interface ImageUploadProps {
  onImageUpload: (imageData: ImageData) => void;
  title: string;
  imagePreviewUrl?: string | null;
}

const fileToBase64 = (file: File): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = error => reject(error);
  });
};

const UploadIcon: React.FC = () => (
    <svg className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);


export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, title, imagePreviewUrl }) => {
  const [internalImagePreview, setInternalImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const displayPreview = imagePreviewUrl || internalImagePreview;

  const handleFile = useCallback(async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setInternalImagePreview(URL.createObjectURL(file));
      const imageData = await fileToBase64(file);
      onImageUpload(imageData);
    }
  }, [onImageUpload]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
        setIsDragging(true);
    } else if (e.type === 'dragleave') {
        setIsDragging(false);
    }
  };

  return (
    <div>
      <label
        htmlFor="file-upload"
        className={`relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-dark-border border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-dark-input hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isDragging ? 'border-brand-primary' : ''}`}
        onDrop={handleDrop}
        onDragEnter={handleDragEvents}
        onDragOver={handleDragEvents}
        onDragLeave={handleDragEvents}
      >
        {displayPreview ? (
          <img src={displayPreview} alt="Preview" className="object-contain w-full h-full rounded-lg" />
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">{title}</p>
          </div>
        )}
        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
      </label>
    </div>
  );
};
