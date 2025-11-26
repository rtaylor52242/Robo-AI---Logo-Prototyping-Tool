
import React, { useState, useCallback, useRef } from 'react';
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

const CameraIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUpload, title, imagePreviewUrl }) => {
  const [internalImagePreview, setInternalImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
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

  const startCamera = async () => {
    try {
      setIsCameraOpen(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please check permissions.");
      setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const dataUrl = canvas.toDataURL('image/png');
        setInternalImagePreview(dataUrl);
        const base64 = dataUrl.split(',')[1];
        onImageUpload({ base64, mimeType: 'image/png' });
        stopCamera();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  return (
    <div className="space-y-2">
      {!isCameraOpen ? (
        <>
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
              <div className="text-center p-4">
                <UploadIcon />
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-brand-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">{title}</p>
              </div>
            )}
            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
          </label>
          <div className="flex justify-center">
            <button 
              type="button"
              onClick={startCamera}
              className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors text-sm font-medium"
            >
              <CameraIcon />
              Take Photo
            </button>
          </div>
        </>
      ) : (
        <div className="relative w-full h-80 bg-black rounded-lg overflow-hidden flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
          <div className="absolute bottom-4 flex gap-4">
            <button 
              onClick={capturePhoto} 
              className="w-14 h-14 rounded-full border-4 border-white bg-red-500 hover:bg-red-600 transition-colors focus:outline-none"
              aria-label="Capture photo"
            ></button>
            <button 
              onClick={stopCamera} 
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-colors text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
