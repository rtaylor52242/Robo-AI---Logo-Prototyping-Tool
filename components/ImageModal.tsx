
import React, { useEffect, useState, useCallback } from 'react';

interface ImageModalProps {
  images: { src: string; name?: string }[];
  startIndex: number;
  onClose: () => void;
}

const ChevronLeftIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ChevronRightIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export const ImageModal: React.FC<ImageModalProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  const handlePrevious = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : prev));
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') handlePrevious();
      if (event.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, handlePrevious, handleNext]);

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  const NavButton: React.FC<{direction: 'prev' | 'next', onClick: (e: React.MouseEvent) => void, disabled: boolean}> = ({ direction, onClick, disabled }) => (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-opacity disabled:opacity-20 disabled:cursor-not-allowed ${direction === 'prev' ? 'left-4' : 'right-4'}`}
        aria-label={direction === 'prev' ? 'Previous image' : 'Next image'}
    >
        {direction === 'prev' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-5xl leading-none font-bold hover:text-gray-300 z-[52] transition-colors"
        aria-label="Close image viewer"
      >
        &times;
      </button>
      <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && <NavButton direction="prev" onClick={handlePrevious} disabled={currentIndex === 0} />}
        
        <div className="relative max-w-4xl max-h-[90vh]">
            <img
            src={`data:image/png;base64,${currentImage.src}`}
            alt={currentImage.name || 'Zoomed in view'}
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
                    {currentIndex + 1} / {images.length}
                </div>
            )}
        </div>

        {images.length > 1 && <NavButton direction="next" onClick={handleNext} disabled={currentIndex === images.length - 1} />}
      </div>
    </div>
  );
};
