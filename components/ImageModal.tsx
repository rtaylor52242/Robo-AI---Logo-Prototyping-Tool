
import React, { useEffect, useState, useCallback, useRef } from 'react';

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

const ZoomInIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
    </svg>
);

const ZoomOutIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
    </svg>
);

const ResetIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
);


export const ImageModal: React.FC<ImageModalProps> = ({ images, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const imageRef = useRef<HTMLImageElement>(null);

  const resetZoom = () => {
      setScale(1);
      setPosition({ x: 0, y: 0 });
  };

  const handlePrevious = useCallback(() => {
    if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        resetZoom();
    }
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
        setCurrentIndex(prev => prev + 1);
        resetZoom();
    }
  }, [currentIndex, images.length]);

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

  const handleWheel = (e: React.WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(1, scale + delta), 10); // Limit zoom between 1x and 10x
      setScale(newScale);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
      if (scale > 1) {
          setIsDragging(true);
          dragStartRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
      }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
      if (isDragging && scale > 1) {
          e.preventDefault();
          setPosition({
              x: e.clientX - dragStartRef.current.x,
              y: e.clientY - dragStartRef.current.y
          });
      }
  };

  const handleMouseUp = () => {
      setIsDragging(false);
  };

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  const NavButton: React.FC<{direction: 'prev' | 'next', onClick: (e: React.MouseEvent) => void, disabled: boolean}> = ({ direction, onClick, disabled }) => (
      <button
        onClick={(e) => { e.stopPropagation(); onClick(e); }}
        disabled={disabled}
        className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-opacity disabled:opacity-20 disabled:cursor-not-allowed z-10 ${direction === 'prev' ? 'left-4' : 'right-4'}`}
        aria-label={direction === 'prev' ? 'Previous image' : 'Next image'}
    >
        {direction === 'prev' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
    </button>
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60] p-4 animate-fade-in overflow-hidden"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
      onWheel={handleWheel}
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
      
      {/* Controls Toolbar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-black/60 px-6 py-3 rounded-full z-20" onClick={e => e.stopPropagation()}>
         <button onClick={() => setScale(s => Math.max(1, s - 0.5))} className="text-white hover:text-brand-primary" title="Zoom Out"><ZoomOutIcon /></button>
         <span className="text-white font-mono min-w-[3ch] text-center">{Math.round(scale * 100)}%</span>
         <button onClick={() => setScale(s => Math.min(10, s + 0.5))} className="text-white hover:text-brand-primary" title="Zoom In"><ZoomInIcon /></button>
         <div className="w-px bg-white/30 mx-2"></div>
         <button onClick={resetZoom} className="text-white hover:text-brand-primary" title="Reset View"><ResetIcon /></button>
      </div>

      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white text-5xl leading-none font-bold hover:text-gray-300 z-[52] transition-colors"
        aria-label="Close image viewer"
      >
        &times;
      </button>

      <div className="relative w-full h-full flex items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {images.length > 1 && <NavButton direction="prev" onClick={handlePrevious} disabled={currentIndex === 0} />}
        
        <div 
            className={`relative transition-transform duration-75 ease-out ${isDragging ? 'cursor-grabbing' : scale > 1 ? 'cursor-grab' : 'cursor-default'}`}
            style={{ 
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <img
                ref={imageRef}
                src={`data:image/png;base64,${currentImage.src}`}
                alt={currentImage.name || 'Zoomed in view'}
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl select-none pointer-events-none" 
                draggable={false}
            />
        </div>
         
         {images.length > 1 && (
                <div className="absolute top-4 left-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full z-10 pointer-events-none">
                    {currentIndex + 1} / {images.length}
                </div>
         )}
         
        {images.length > 1 && <NavButton direction="next" onClick={handleNext} disabled={currentIndex === images.length - 1} />}
      </div>
    </div>
  );
};
