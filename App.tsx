
import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { generateWithImageInput, generateWithTextInput } from './services/geminiService';
import type { Tab, MockupOption, ImageData } from './types';
import { ImageUpload } from './components/ImageUpload';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import { ImageModal } from './components/ImageModal';
import { HelpModal } from './components/HelpModal';

// --- ICONS (as components) ---
const TShirtIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-5h-5v5zM3 20h5v-5H3v5zm5-10H3l3-7h5l3 7H8zm13-7l3 7h-5l3-7h2zM8 10h8v10H8V10z" /></svg>;
const MugIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v-1a1 1 0 011-1h2a1 1 0 011 1v12z" /></svg>;
const ToteBagIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>;
const RobotIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-brand-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.5 8a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM11 8a.5.5 0 01.5-.5h2a.5.5 0 010 1h-2a.5.5 0 01-.5-.5zM6.5 12a.5.5 0 01.5-.5h6a.5.5 0 010 1h-6a.5.5 0 01-.5-.5z" clipRule="evenodd" /></svg>;
const StickerIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5l-2.5 2.5M9 17l2.5-2.5" /></svg>;
const HoodieIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4zm4 4v8m8-8v8M4 12h16" /></svg>;
const SocksIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>;
const ThermosIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3h8v18H8V3zm2 2v2m4-2v2" /></svg>;
const GlovesIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 00-9.9 9.5A10 10 0 0012 22a10 10 0 0010-10.5A10 10 0 0012 2zm0 4a2 2 0 110 4 2 2 0 010-4zm0 6a2 2 0 100 4 2 2 0 000-4z" /></svg>;
const HatIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>;
const FlipFlopsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
const ShotGlassIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 2h8v2H8V2zM6 6h12v14H6V6zm4 2v10m4-10v10" /></svg>;
const PhoneCaseIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h6v6H4V4zm8 0h6v6h-6V4zm-8 8h6v6H4v-6zm8 8h6v6h-6v-6z" /></svg>;
const SunIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const HelpIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DownloadIcon: React.FC<{className?: string}> = ({className = "h-5 w-5 mr-2"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);
const MagicWandIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.073a1 1 0 01.37.788l.22 1.104a1 1 0 01-1.738.924l-.55-1.104a1 1 0 00-1.738.924l.55 1.104a1 1 0 01-1.738.924l-.55-1.104a1 1 0 00-1.738.924l.55 1.104a1 1 0 01-1.738.924l-.55-1.104a1 1 0 00-1.568 1.127l1.104 2.208a1 1 0 01-.462 1.298l-1.104.55a1 1 0 00-.462 1.298l2.208 4.416a1 1 0 01-1.298 1.298l-4.416-2.208a1 1 0 00-1.298.462l-.55 1.104a1 1 0 01-1.298.462l-2.208-1.104a1 1 0 00-1.127 1.568l1.104.55a1 1 0 01.924 1.738l-1.104.55a1 1 0 00-.924 1.738l1.104.55a1 1 0 01.924 1.738l-1.104.55a1 1 0 00-.788.37A1 1 0 012 12h-.073a1 1 0 01-.788-.37l-1.104-.22a1 1 0 01-.924-1.738l1.104-.55a1 1 0 00.924-1.738l-1.104-.55a1 1 0 01-.924-1.738l1.104-.55a1 1 0 00.924-1.738l-1.104-.55a1 1 0 01-1.298-1.298l2.208-4.416a1 1 0 00.462-1.298l-.55-1.104a1 1 0 01.462-1.298l1.104-.55a1 1 0 001.298-.462l1.104-2.208a1 1 0 011.568-1.127l.55 1.104a1 1 0 001.738-.924l-.55-1.104a1 1 0 011.738-.924l.55 1.104a1 1 0 001.738-.924l-.55-1.104a1 1 0 01.924-1.738l1.104.22a1 1 0 00.37-.788V2a1 1 0 01.954-.954z" clipRule="evenodd" /></svg>;
const MirrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.5 2a.5.5 0 01.5.5v15a.5.5 0 01-1 0V2.5a.5.5 0 01.5-.5z" clipRule="evenodd" />
        <path d="M7 10l-4-4v8l4-4z" />
        <path d="M13 10l4-4v8l-4-4z" />
    </svg>
);


// --- CONSTANTS ---
const MOCKUP_OPTIONS: MockupOption[] = [
  { id: 'tshirt', name: 'T-Shirt', promptSuffix: 'on the chest of a high-quality plain t-shirt, studio lighting, on a mannequin.', icon: <TShirtIcon /> },
  { id: 'mug', name: 'Mug', promptSuffix: 'on the side of a glossy ceramic coffee mug, on a clean kitchen counter background.', icon: <MugIcon /> },
  { id: 'totebag', name: 'Tote Bag', promptSuffix: 'on the front of a canvas tote bag, held by a person in a casual setting.', icon: <ToteBagIcon /> },
  { id: 'sticker', name: 'Sticker', promptSuffix: 'as a die-cut vinyl sticker on a clean white background.', icon: <StickerIcon /> },
  { id: 'hoodie', name: 'Hoodie', promptSuffix: 'on the chest of a black hoodie, realistic photo.', icon: <HoodieIcon /> },
  { id: 'socks', name: 'Socks', promptSuffix: 'as a repeating pattern on a pair of crew socks.', icon: <SocksIcon /> },
  { id: 'thermos', name: 'Thermos', promptSuffix: 'wrapped around a stainless steel thermos, on an outdoor table.', icon: <ThermosIcon /> },
  { id: 'gloves', name: 'Gloves', promptSuffix: 'on the back of a pair of black winter gloves.', icon: <GlovesIcon /> },
  { id: 'hat', name: 'Hat', promptSuffix: 'embroidered on the front of a baseball cap.', icon: <HatIcon /> },
  { id: 'flipflops', name: 'Flip Flops', promptSuffix: 'on the strap of a pair of flip flops on a sandy beach.', icon: <FlipFlopsIcon /> },
  { id: 'shotglass', name: 'Shot Glass', promptSuffix: 'printed on the side of a clear shot glass.', icon: <ShotGlassIcon /> },
  { id: 'phonecase', name: 'Phone Case', promptSuffix: 'on the back of a black smartphone case.', icon: <PhoneCaseIcon /> },
];

// --- FEATURE COMPONENTS (defined outside App to prevent re-renders) ---

const MockupGenerator: React.FC = () => {
    const [logo, setLogo] = useState<ImageData | null>(null);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [selectedMockups, setSelectedMockups] = useState<MockupOption[]>([MOCKUP_OPTIONS[0]]);
    const [isLoading, setIsLoading] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
    const [isRemovingBg, setIsRemovingBg] = useState(false);
    const [isMirroring, setIsMirroring] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultImages, setResultImages] = useState<{ id: string; src: string; name: string }[]>([]);
    const [modalStartIndex, setModalStartIndex] = useState<number | null>(null);

    const handleLogoUpload = useCallback((imageData: ImageData) => {
        setLogo(imageData);
        setLogoPreview(`data:${imageData.mimeType};base64,${imageData.base64}`);
    }, []);

    const handleMockupSelect = (option: MockupOption) => {
      setSelectedMockups(prev => 
        prev.some(item => item.id === option.id)
          ? prev.filter(item => item.id !== option.id)
          : [...prev, option]
      );
    };

    const handleSelectAll = () => {
        if (selectedMockups.length === MOCKUP_OPTIONS.length) {
            setSelectedMockups([]);
        } else {
            setSelectedMockups(MOCKUP_OPTIONS);
        }
    };
    
    const handleRemoveBackground = async () => {
        if (!logo) return;
        setIsRemovingBg(true);
        setError(null);
        try {
            const prompt = "Remove the background from this image. The output should be the main subject with a transparent background. Make sure the output is a PNG with transparency.";
            const imageB64 = await generateWithImageInput(prompt, logo);
            const newImageData = { base64: imageB64, mimeType: 'image/png' };
            setLogo(newImageData);
            setLogoPreview(`data:image/png;base64,${imageB64}`);
        } catch (err: any) {
            setError(err.message || 'Failed to remove background.');
        } finally {
            setIsRemovingBg(false);
        }
    };

    const handleMirrorImage = async () => {
        if (!logo) return;
        setIsMirroring(true);
        setError(null);
        try {
            const image = new Image();
            const promise = new Promise<ImageData>((resolve, reject) => {
                image.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = image.width;
                    canvas.height = image.height;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) {
                        reject(new Error("Could not get canvas context"));
                        return;
                    }
                    ctx.scale(-1, 1);
                    ctx.translate(-canvas.width, 0);
                    ctx.drawImage(image, 0, 0);

                    const mirroredDataUrl = canvas.toDataURL(logo.mimeType);
                    const newBase64 = mirroredDataUrl.split(',')[1];
                    resolve({ base64: newBase64, mimeType: logo.mimeType });
                };
                image.onerror = () => {
                    reject(new Error("Failed to load image for mirroring."));
                };
                image.src = `data:${logo.mimeType};base64,${logo.base64}`;
            });
            
            const mirroredImageData = await promise;
            setLogo(mirroredImageData);
            setLogoPreview(`data:${mirroredImageData.mimeType};base64,${mirroredImageData.base64}`);

        } catch (err: any) {
            setError(err.message || 'Failed to mirror image.');
        } finally {
            setIsMirroring(false);
        }
    };
    
    const handleDownloadAll = async () => {
        if (resultImages.length < 2) return;
        setIsZipping(true);

        try {
            const zip = new JSZip();
            resultImages.forEach(image => {
                const filename = `robo-ai-${image.id}.png`;
                zip.file(filename, image.src, { base64: true });
            });

            const blob = await zip.generateAsync({ type: 'blob' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'robo-ai-mockups.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);

        } catch (err) {
            console.error("Error creating zip file:", err);
            setError("Could not create a zip file for download. Please try downloading images individually.");
        } finally {
            setIsZipping(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logo) {
            setError('Please upload a logo first.');
            return;
        }
        if (selectedMockups.length === 0) {
            setError('Please select at least one mockup type.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultImages([]);

        const promises = selectedMockups.map(mockup =>
            generateWithImageInput(`Place this logo ${mockup.promptSuffix}`, logo)
                .then(imageB64 => ({ status: 'fulfilled' as const, value: imageB64, id: mockup.id, name: mockup.name }))
                .catch(error => ({ status: 'rejected' as const, reason: error, id: mockup.id, name: mockup.name }))
        );

        const results = await Promise.all(promises);
        
        const successfulResults = results
            .filter((res): res is { status: 'fulfilled'; value: string; id: string; name: string } => res.status === 'fulfilled')
            .map(res => ({ id: res.id, src: res.value, name: res.name }));
        
        const failedResults = results.filter(res => res.status === 'rejected');

        setResultImages(successfulResults);

        if (failedResults.length > 0) {
             setError(`Failed to generate ${failedResults.length} mockup(s): ${failedResults.map(r => r.name).join(', ')}. Please try again.`);
        }

        setIsLoading(false);
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">1. Upload Your Logo</h3>
                        <ImageUpload onImageUpload={handleLogoUpload} title="Your Logo (PNG, JPG)" imagePreviewUrl={logoPreview} />
                        {logo && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button onClick={handleRemoveBackground} disabled={isRemovingBg || isMirroring || isLoading} className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <MagicWandIcon />
                                    {isRemovingBg ? 'Removing...' : 'Remove Background'}
                                </button>
                                <button onClick={handleMirrorImage} disabled={isMirroring || isRemovingBg || isLoading} className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                    <MirrorIcon />
                                    {isMirroring ? 'Mirroring...' : 'Mirror Image'}
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">2. Choose Mockups</h3>
                            <button
                                onClick={handleSelectAll}
                                className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                            >
                                {selectedMockups.length === MOCKUP_OPTIONS.length ? 'Deselect All' : 'Select All'}
                            </button>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4">
                            {MOCKUP_OPTIONS.map((opt) => (
                                <button key={opt.id} onClick={() => handleMockupSelect(opt)}
                                    className={`p-2 md:p-4 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 ${selectedMockups.some(m => m.id === opt.id) ? 'bg-brand-primary text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-dark-card ring-brand-primary' : 'bg-gray-100 dark:bg-dark-input hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                                    {opt.icon}
                                    <span className="mt-2 text-xs md:text-sm font-medium">{opt.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    <button onClick={handleSubmit} disabled={isLoading || !logo || selectedMockups.length === 0} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? 'Generating...' : `Create ${selectedMockups.length} Mockup(s)`}
                    </button>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">3. Results</h3>
                        {resultImages.length > 1 && (
                             <button
                                onClick={handleDownloadAll}
                                disabled={isZipping || isLoading}
                                className="flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm disabled:opacity-50"
                            >
                                <DownloadIcon className="h-4 w-4 mr-2" />
                                {isZipping ? 'Zipping...' : 'Download All'}
                            </button>
                        )}
                    </div>
                     <div className="w-full min-h-96 max-h-[40rem] overflow-y-auto bg-gray-50 dark:bg-dark-input rounded-lg p-4 transition-colors">
                        {isLoading && (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {Array.from({ length: selectedMockups.length }).map((_, i) => (
                                    <div key={i} className="aspect-square bg-gray-200 dark:bg-dark-card rounded-lg flex items-center justify-center">
                                       <div className="w-10 h-10 border-2 border-dashed rounded-full animate-spin border-brand-primary"></div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!isLoading && resultImages.length > 0 && (
                             <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {resultImages.map((image, index) => (
                                    <div key={image.id} className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer" onClick={() => setModalStartIndex(index)}>
                                         <img src={`data:image/png;base64,${image.src}`} alt={`Generated mockup for ${image.name}`} className="w-full h-full object-cover" />
                                          <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity p-2">
                                            <span className="text-white font-bold text-center mb-2">{image.name}</span>
                                            <a href={`data:image/png;base64,${image.src}`} download={`robo-ai-${image.id}.png`} onClick={e => e.stopPropagation()}
                                              className="flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm">
                                                 <DownloadIcon className="h-4 w-4 mr-1" />
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {!isLoading && resultImages.length === 0 && (
                             <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p className="mt-2">Your generated mockups will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {error && <div className="text-red-700 dark:text-red-400 text-center mt-4 p-2 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}
            {modalStartIndex !== null && <ImageModal images={resultImages} startIndex={modalStartIndex} onClose={() => setModalStartIndex(null)} />}
        </div>
    );
};

const ImageEditor: React.FC = () => {
    const [image, setImage] = useState<ImageData | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !prompt) {
            setError('Please upload an image and enter an editing instruction.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultImage(null);

        try {
            const imageB64 = await generateWithImageInput(prompt, image);
            setResultImage(imageB64);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
         <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">1. Upload Image to Edit</h3>
                        <ImageUpload onImageUpload={setImage} title="Image to Edit (PNG, JPG)" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">2. Describe Your Edit</h3>
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., 'Add a retro filter' or 'Make the sky look like a sunset'"
                            className="w-full h-24 p-2 bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-dark-border rounded-lg focus:ring-brand-primary focus:border-brand-primary transition"
                        />
                    </div>
                    <button onClick={handleSubmit} disabled={isLoading || !image || !prompt} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? 'Editing...' : 'Apply Edit'}
                    </button>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">3. Result</h3>
                    <GeneratedImageDisplay imageUrl={resultImage} isLoading={isLoading} altText="Edited image" />
                </div>
            </div>
            {error && <div className="text-red-700 dark:text-red-400 text-center mt-4 p-2 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}
        </div>
    );
};

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) {
            setError('Please enter a prompt to generate an image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultImage(null);

        try {
            const imageB64 = await generateWithTextInput(prompt);
            setResultImage(imageB64);
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">1. Describe the Image to Generate</h3>
                    <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., 'A photorealistic image of a cat wearing a spacesuit, on the moon'"
                        className="w-full h-24 p-2 bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-dark-border rounded-lg focus:ring-brand-primary focus:border-brand-primary transition"
                    />
                </div>
                <button type="submit" disabled={isLoading || !prompt} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                    {isLoading ? 'Generating...' : 'Generate Image'}
                </button>
            </form>

            <div className="space-y-2">
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 text-center">2. Result</h3>
                <GeneratedImageDisplay imageUrl={resultImage} isLoading={isLoading} altText="Generated image" />
            </div>
            {error && <div className="text-red-700 dark:text-red-400 text-center mt-4 p-2 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('mockup');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'mockup': return <MockupGenerator />;
      case 'editor': return <ImageEditor />;
      case 'generator': return <ImageGenerator />;
      default: return null;
    }
  };

  const TabButton = ({ tab, label }: { tab: Tab, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tab 
          ? 'bg-brand-primary text-white' 
          : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-input'
      }`}
    >
      {label}
    </button>
  );

  return (
    <>
      <div className="min-h-screen text-gray-900 dark:text-gray-100 font-sans p-4 sm:p-6 lg:p-8 transition-colors">
        <main className="max-w-7xl mx-auto">
          <header className="text-center mb-10 relative">
            <div className="flex items-center justify-center gap-3">
               <RobotIcon />
               <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-500 to-indigo-500 dark:from-purple-400 dark:to-indigo-400 text-transparent bg-clip-text">
                  Robo AI - Logo Prototyping Tool
               </h1>
            </div>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Your one-stop shop for AI-powered image creation and branding.</p>
             <div className="absolute top-0 right-0 flex items-center gap-2">
                <button onClick={() => setIsHelpModalOpen(true)} className="p-2 rounded-full bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors" aria-label="Open help guide">
                    <HelpIcon />
                </button>
                <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors" aria-label="Toggle theme">
                    {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
                </button>
            </div>
          </header>

          <div className="flex justify-center mb-8">
            <div className="flex space-x-2 bg-white dark:bg-dark-card p-1 rounded-lg shadow-md dark:shadow-none transition-colors">
              <TabButton tab="mockup" label="Logo on Mockup" />
              <TabButton tab="editor" label="Image Editor" />
              <TabButton tab="generator" label="Generate Image" />
            </div>
          </div>

          <div className="bg-white dark:bg-dark-card p-6 sm:p-8 rounded-xl shadow-2xl transition-colors">
            {renderContent()}
          </div>
        </main>
        <footer className="text-center text-gray-500 dark:text-gray-500 mt-12 text-sm">
          <p>Powered by Google Gemini. Built for creativity.</p>
        </footer>
      </div>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </>
  );
};

export default App;
