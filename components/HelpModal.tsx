
import React, { useEffect } from 'react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in"
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
      <div
        className="bg-white dark:bg-dark-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-3xl leading-none font-bold z-10 transition-colors"
          aria-label="Close help"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">How to Use Robo AI</h2>

        <div className="space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold text-brand-primary dark:text-brand-secondary mb-3">1. Generate Image</h3>
             <ol className="list-decimal list-inside space-y-2">
              <li><strong>Visual Inspiration:</strong> Select categories like Characters, Places, or Objects to guide the <strong>Inspire Me</strong> button towards specific themes.</li>
              <li><strong>Describe Your Vision:</strong> Write a detailed prompt or let the AI surprise you.</li>
              <li><strong>Aspect Ratio:</strong> Choose from Portrait, Landscape, Square, or Custom dimensions for your generated image.</li>
              <li><strong>Generate:</strong> Create high-quality AI images from scratch.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-brand-primary dark:text-brand-secondary mb-3">2. Image Editor</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Upload Image:</strong> Upload or capture an image you want to modify.</li>
              <li><strong>Describe Your Edit:</strong> Type instructions like "Make it sunset" or click the <strong>Quick Style</strong> buttons (e.g., Cyberpunk, Watercolor) to apply presets.</li>
              <li><strong>Settings:</strong> You can also adjust the aspect ratio for the resulting edited image.</li>
              <li><strong>Apply Edit:</strong> The AI will regenerate your image with the requested changes.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-brand-primary dark:text-brand-secondary mb-3">3. Mockup Studio</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Upload Your Logo:</strong> Upload a file or use the <strong>Take Photo</strong> button to capture an image using your webcam.</li>
              <li><strong>Fine-Tune:</strong> Use 'Remove Background' for cleaner logos or 'Mirror Image' to flip the design horizontally.</li>
              <li><strong>Settings:</strong> Select the aspect ratio for the final mockup image.</li>
              <li><strong>Choose Mockups:</strong> Select from categories like Apparel, Merchandise, Print, and Signage. Use the tabs to filter categories.</li>
              <li><strong>Generate:</strong> Click 'Create Mockup(s)' to generate realistic product images.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-brand-primary dark:text-brand-secondary mb-3">History, Sharing & Tools</h3>
             <ul className="list-disc list-inside space-y-2">
              <li><strong>History Log:</strong> Click the clock icon to view past generations. You can <strong>Delete</strong> items, transfer them between tools, or view details.</li>
              <li><strong>Deep Zoom:</strong> Click any image to open full-screen. Use your mouse wheel to zoom in/out and drag to pan around details.</li>
              <li><strong>Advanced Share:</strong> Click the 'Share' button on any generated image to send it to social apps, copy it to your clipboard, or download it.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};
