
import React, { useState } from 'react';
import JSZip from 'jszip';
import type { HistoryItem, Tab, ImageData } from '../types';
import { ImageModal } from './ImageModal';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onTransfer: (data: ImageData, target: Tab) => void;
  onDelete: (id: string) => void;
}

const TransferIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
  </svg>
);

const ZoomInIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
  </svg>
);

const TrashIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const DownloadIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onTransfer, onDelete }) => {
  const [zoomImage, setZoomImage] = useState<{ src: string, name: string } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isZipping, setIsZipping] = useState(false);

  const toggleSelection = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(history.map(item => item.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleDownloadSelected = async () => {
    if (selectedIds.size === 0) return;
    setIsZipping(true);

    try {
      const zip = new JSZip();
      const selectedItems = history.filter(item => selectedIds.has(item.id));
      
      selectedItems.forEach((item, index) => {
          // Clean up prompt to be a valid filename
          const promptSlug = (item.prompt || 'image').slice(0, 30).replace(/[^a-z0-9]/gi, '_').toLowerCase();
          const filename = `robo-ai-${promptSlug}-${item.id}.png`;
          zip.file(filename, item.imageData.base64, { base64: true });
      });

      const blob = await zip.generateAsync({ type: 'blob' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `robo-ai-history-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      
      deselectAll();

    } catch (err) {
      console.error("Error creating zip file:", err);
      alert("Failed to create zip file.");
    } finally {
      setIsZipping(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in"
        onClick={onClose}
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
        <div
          className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">History Log</h2>
                  {history.length > 0 && (
                      <div className="flex items-center gap-2">
                        {selectedIds.size > 0 ? (
                            <button onClick={deselectAll} className="text-xs text-brand-primary hover:underline font-medium">
                                Deselect All
                            </button>
                        ) : (
                            <button onClick={selectAll} className="text-xs text-brand-primary hover:underline font-medium">
                                Select All
                            </button>
                        )}
                        <span className="text-xs text-gray-400">|</span>
                        <button 
                            onClick={handleDownloadSelected} 
                            disabled={selectedIds.size === 0 || isZipping}
                            className={`flex items-center px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${selectedIds.size > 0 ? 'bg-brand-primary text-white hover:bg-brand-secondary' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'}`}
                        >
                            <DownloadIcon />
                            {isZipping ? 'Zipping...' : `Download Selected (${selectedIds.size})`}
                        </button>
                      </div>
                  )}
              </div>
              <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none font-bold"
              >
              &times;
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
              {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                      <p className="text-lg">No history yet.</p>
                      <p className="text-sm mt-2">Generate or edit images to see them here.</p>
                  </div>
              ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {history.slice().reverse().map((item) => (
                          <div 
                            key={item.id} 
                            className={`bg-gray-50 dark:bg-dark-input rounded-lg overflow-hidden flex flex-col border transition-all hover:shadow-lg relative group ${selectedIds.has(item.id) ? 'border-brand-primary ring-2 ring-brand-primary ring-opacity-50' : 'border-gray-200 dark:border-gray-700'}`}
                            onClick={() => toggleSelection(item.id)}
                          >
                                <div className="absolute top-2 left-2 z-20">
                                    <input 
                                        type="checkbox" 
                                        checked={selectedIds.has(item.id)}
                                        onChange={() => {}} // handled by parent click
                                        className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                                    />
                                </div>

                               <button 
                                    onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                                    className="absolute top-2 right-2 z-20 p-2 bg-white/80 dark:bg-black/50 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete from history"
                                >
                                    <TrashIcon />
                                </button>
                              <div 
                                className="relative aspect-square cursor-zoom-in group-hover:opacity-90 transition-opacity"
                                onClick={(e) => { e.stopPropagation(); setZoomImage({ src: item.imageData.base64, name: item.prompt || 'History Item' }); }}
                              >
                                  <img 
                                      src={`data:${item.imageData.mimeType};base64,${item.imageData.base64}`} 
                                      alt={item.prompt || 'History Item'} 
                                      className="w-full h-full object-cover"
                                  />
                                  <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded capitalize">
                                      {item.type}
                                  </div>
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                      <div className="bg-black/50 p-2 rounded-full">
                                          <ZoomInIcon />
                                      </div>
                                  </div>
                              </div>
                              <div className="p-3 flex flex-col gap-2 flex-1" onClick={e => e.stopPropagation()}>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-medium" title={item.prompt}>
                                      {item.prompt || 'No prompt'}
                                  </p>
                                  {item.aspectRatio && (
                                      <span className="text-[10px] text-gray-400 bg-gray-100 dark:bg-gray-700 px-1 rounded w-fit">
                                          {item.aspectRatio}
                                      </span>
                                  )}
                                  <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide">
                                      {new Date(item.timestamp).toLocaleString()}
                                  </div>
                                  <div className="flex flex-col gap-2 mt-auto">
                                      <button 
                                          onClick={() => { onTransfer(item.imageData, 'mockup'); onClose(); }}
                                          className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs py-2 px-2 rounded transition-colors"
                                      >
                                          <TransferIcon /> Use as Mockup
                                      </button>
                                      <button 
                                          onClick={() => { onTransfer(item.imageData, 'editor'); onClose(); }}
                                          className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-xs py-2 px-2 rounded transition-colors"
                                      >
                                          <TransferIcon /> Use in Editor
                                      </button>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              )}
          </div>
        </div>
      </div>
      
      {zoomImage && (
        <div className="z-[70] relative">
            <ImageModal 
                images={[{ src: zoomImage.src, name: zoomImage.name }]} 
                startIndex={0} 
                onClose={() => setZoomImage(null)} 
            />
        </div>
      )}
    </>
  );
};