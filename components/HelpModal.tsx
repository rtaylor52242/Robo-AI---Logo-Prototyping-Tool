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
            <h3 className="text-xl font-semibold text-brand-primary dark:text-brand-secondary mb-3">Logo on Mockup</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Upload Your Logo:</strong> Click or drag-and-drop your logo file into the upload area. PNG files with transparent backgrounds work best.</li>
              <li><strong>Fine-Tune (Optional):</strong> Use the 'Remove Background' button for logos with solid backgrounds, or 'Mirror Image' if your logo needs to be flipped for certain applications.</li>
              <li><strong>Choose Mockups:</strong> Select one or more product mockups from the grid. You can use 'Select All' for convenience.</li>
              <li><strong>Generate:</strong> Click the 'Create Mockup(s)' button. The AI will generate realistic images of your logo on the selected products.</li>
              <li><strong>View & Download:</strong> Results appear on the right. Click any image to view it larger, or use the 'Download All' button to get a zip file.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-brand-primary dark:text-brand-secondary mb-3">Image Editor</h3>
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Upload Image:</strong> Provide the base image you want to modify in the upload area.</li>
              <li><strong>Describe Your Edit:</strong> In the text box, clearly explain the changes you want. Be descriptive! For example, "Change the color of the car to bright red" or "Add a majestic castle in the background."</li>
              <li><strong>Apply Edit:</strong> Hit the 'Apply Edit' button. The AI will process your request and generate the edited image.</li>
              <li><strong>Download:</strong> Once the result appears, hover over it to find the download button.</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-brand-primary dark:text-brand-secondary mb-3">Generate Image</h3>
             <ol className="list-decimal list-inside space-y-2">
              <li><strong>Describe Your Vision:</strong> In the text area, write a detailed prompt for the image you want to create. The more detail, the better the result. Think about style, colors, composition, and subject matter.</li>
              <li><strong>Generate:</strong> Click the 'Generate Image' button. Our most powerful image model will create a high-quality image based on your text.</li>
              <li><strong>Download:</strong> The final image will appear below. Hover over it to download.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};
