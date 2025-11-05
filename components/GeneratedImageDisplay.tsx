
import React, { useState } from 'react';
import { ImageModal } from './ImageModal';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
  </div>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ZoomIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);


interface GeneratedImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  altText?: string;
}

export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ imageUrl, isLoading, altText = "Generated image" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageUrl}`;
    link.download = `robo-ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <>
      <div className="w-full h-96 bg-gray-50 dark:bg-dark-input rounded-lg flex items-center justify-center overflow-hidden transition-colors">
        {isLoading ? (
          <LoadingSpinner />
        ) : imageUrl ? (
          <div className="relative group w-full h-full" onClick={() => setIsModalOpen(true)}>
            <img src={`data:image/png;base64,${imageUrl}`} alt={altText} className="w-full h-full object-contain cursor-pointer" />
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <ZoomIcon />
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                onClick={handleDownload}
                className="flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                <DownloadIcon />
                Download
                </button>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-400 dark:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-2">Your generated image will appear here</p>
          </div>
        )}
      </div>
      {isModalOpen && imageUrl && <ImageModal images={[{src: imageUrl, name: altText}]} startIndex={0} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};
