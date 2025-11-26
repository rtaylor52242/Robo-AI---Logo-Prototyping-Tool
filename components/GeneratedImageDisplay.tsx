
import React, { useState } from 'react';
import { ImageModal } from './ImageModal';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center h-full">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-brand-primary"></div>
  </div>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const ShareIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
  </svg>
);

const ClipboardIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
  </svg>
);

const ZoomIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const DeviceMobileIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);


interface GeneratedImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  altText?: string;
}

export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({ imageUrl, isLoading, altText = "Generated image" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const base64ToBlob = (base64: string, mimeType: string = 'image/png') => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mimeType });
  };

  const handleDownload = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageUrl}`;
    link.download = `robo-ai-generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsShareModalOpen(false);
  };

  const handleNativeShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!imageUrl) return;

    try {
        const blob = base64ToBlob(imageUrl);
        const file = new File([blob], 'robo-ai-image.png', { type: 'image/png' });

        if (navigator.share) {
            await navigator.share({
                title: 'Robo AI Generation',
                text: `Check out this ${altText} I created with Robo AI!`,
                files: [file]
            });
            setIsShareModalOpen(false);
        } else {
            alert("Native sharing is not supported on this device. Please use Download or Copy.");
        }
    } catch (error) {
        console.error('Error sharing:', error);
    }
  };

  const handleCopyToClipboard = async (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!imageUrl) return;

      try {
          const blob = base64ToBlob(imageUrl);
          await navigator.clipboard.write([
              new ClipboardItem({
                  [blob.type]: blob
              })
          ]);
          setCopyStatus('success');
          setTimeout(() => {
              setCopyStatus('idle');
              setIsShareModalOpen(false);
          }, 1500);
      } catch (error) {
          console.error('Copy failed', error);
          setCopyStatus('error');
      }
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
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 pointer-events-auto">
                <button
                    onClick={(e) => { e.stopPropagation(); setIsShareModalOpen(true); }}
                    className="flex items-center justify-center bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-3 rounded-lg transition-colors"
                    title="Advanced Share"
                >
                    <ShareIcon />
                    <span className="ml-2 text-sm">Share</span>
                </button>
                <button
                    onClick={handleDownload}
                    className="flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-3 rounded-lg transition-colors"
                    title="Quick Download"
                >
                    <DownloadIcon />
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

      {/* Zoom Modal */}
      {isModalOpen && imageUrl && <ImageModal images={[{src: imageUrl, name: altText}]} startIndex={0} onClose={() => setIsModalOpen(false)} />}

      {/* Share Modal */}
      {isShareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[60] p-4 animate-fade-in" onClick={() => setIsShareModalOpen(false)}>
           <div className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
               <div className="flex justify-between items-center mb-6">
                   <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Share Image</h3>
                   <button onClick={() => setIsShareModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                       <span className="text-2xl">&times;</span>
                   </button>
               </div>
               
               <div className="space-y-3">
                   <button onClick={handleNativeShare} className="w-full flex items-center p-3 rounded-lg bg-gray-100 dark:bg-dark-input hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                       <div className="bg-blue-500 text-white p-2 rounded-full mr-3">
                           <DeviceMobileIcon />
                       </div>
                       <div className="text-left">
                           <div className="font-semibold text-gray-900 dark:text-gray-200">Share via App</div>
                           <div className="text-xs text-gray-500">Social media, contacts, etc.</div>
                       </div>
                   </button>

                   <button onClick={handleCopyToClipboard} className="w-full flex items-center p-3 rounded-lg bg-gray-100 dark:bg-dark-input hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                       <div className={`text-white p-2 rounded-full mr-3 ${copyStatus === 'success' ? 'bg-green-500' : copyStatus === 'error' ? 'bg-red-500' : 'bg-purple-500'}`}>
                           <ClipboardIcon />
                       </div>
                       <div className="text-left">
                           <div className="font-semibold text-gray-900 dark:text-gray-200">
                               {copyStatus === 'success' ? 'Copied!' : copyStatus === 'error' ? 'Failed to Copy' : 'Copy Image'}
                           </div>
                           <div className="text-xs text-gray-500">Paste directly into apps</div>
                       </div>
                   </button>

                   <button onClick={handleDownload} className="w-full flex items-center p-3 rounded-lg bg-gray-100 dark:bg-dark-input hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                       <div className="bg-gray-700 text-white p-2 rounded-full mr-3">
                           <DownloadIcon />
                       </div>
                       <div className="text-left">
                           <div className="font-semibold text-gray-900 dark:text-gray-200">Save to Device</div>
                           <div className="text-xs text-gray-500">Download PNG file</div>
                       </div>
                   </button>
               </div>
           </div>
        </div>
      )}
    </>
  );
};
