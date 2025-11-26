
import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { generateWithImageInput, generateWithTextInput } from './services/geminiService';
import type { Tab, MockupOption, ImageData, MockupCategory } from './types';
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
const CalendarIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const TankTopIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 4l-2 4h-8l-2-4h-2v16h16V4h-2z" /></svg>;
const BookBagIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7a2 2 0 00-2-2h-1V4a1 1 0 00-1-1H9a1 1 0 00-1 1v1H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11H8m8 4H8" /></svg>;
const WalletIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>;
const UmbrellaIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v20m0 0a2 2 0 002 2m-2-2a2 2 0 01-2-2m0-16a9 9 0 1118 0H3a9 9 0 019 0z" /></svg>;
const NotebookIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;

// New Icons
const SocialMediaIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const BusinessCardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" /></svg>;
const StorefrontIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const VehicleWrapIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /><path d="M5 13a2 2 0 002 2h10a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4z" /></svg>; // Simplified Van/Transfer
const MenuIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const BoothIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18v18H3V3zm4 9h10v6H7v-6z" /></svg>;
const MoviePosterIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>;
const MagazineIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>;
const PostcardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;

const SunIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const HelpIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const DownloadIcon: React.FC<{className?: string}> = ({className = "h-5 w-5 mr-2"}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);
const MagicWandIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v1.073a1 1 0 01.37.788l.22 1.104a1 1 0 01-1.738.924l-.55-1.104a1 1 0 00-1.738.924l.55 1.104a1 1 0 01-1.738.924l-.55-1.104a1 1 0 00-1.568 1.127l1.104 2.208a1 1 0 01-.462 1.298l-1.104.55a1 1 0 00-.462 1.298l2.208 4.416a1 1 0 01-1.298 1.298l-4.416-2.208a1 1 0 00-1.298.462l-.55 1.104a1 1 0 01-1.298.462l-2.208-1.104a1 1 0 00-1.127 1.568l1.104.55a1 1 0 01.924 1.738l-1.104.55a1 1 0 00-.924 1.738l1.104.55a1 1 0 01.924 1.738l-1.104.55a1 1 0 00-.788.37A1 1 0 012 12h-.073a1 1 0 01-.788-.37l-1.104-.22a1 1 0 01-.924-1.738l1.104-.55a1 1 0 00.924-1.738l-1.104-.55a1 1 0 01-.924-1.738l1.104-.55a1 1 0 00.924-1.738l-1.104-.55a1 1 0 01-1.298-1.298l2.208-4.416a1 1 0 00.462-1.298l-.55-1.104a1 1 0 01.462-1.298l1.104-.55a1 1 0 001.298-.462l1.104-2.208a1 1 0 011.568-1.127l.55 1.104a1 1 0 001.738-.924l-.55-1.104a1 1 0 011.738-.924l.55 1.104a1 1 0 001.738-.924l-.55-1.104a1 1 0 01.924-1.738l1.104.22a1 1 0 00.37-.788V2a1 1 0 01.954-.954z" clipRule="evenodd" /></svg>;
const MirrorIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.5 2a.5.5 0 01.5.5v15a.5.5 0 01-1 0V2.5a.5.5 0 01.5-.5z" clipRule="evenodd" />
        <path d="M7 10l-4-4v8l4-4z" />
        <path d="M13 10l4-4v8l-4-4z" />
    </svg>
);
const TransferIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
  </svg>
);


// --- CONSTANTS ---
const MOCKUP_OPTIONS: MockupOption[] = [
  // Apparel
  { id: 'tshirt', name: 'T-Shirt', promptSuffix: 'on the chest of a high-quality plain t-shirt, studio lighting, on a mannequin.', icon: <TShirtIcon />, category: 'Apparel' },
  { id: 'hoodie', name: 'Hoodie', promptSuffix: 'on the chest of a black hoodie, realistic photo.', icon: <HoodieIcon />, category: 'Apparel' },
  { id: 'socks', name: 'Socks', promptSuffix: 'as a repeating pattern on a pair of crew socks.', icon: <SocksIcon />, category: 'Apparel' },
  { id: 'gloves', name: 'Gloves', promptSuffix: 'on the back of a pair of black winter gloves.', icon: <GlovesIcon />, category: 'Apparel' },
  { id: 'hat', name: 'Hat', promptSuffix: 'embroidered on the front of a baseball cap.', icon: <HatIcon />, category: 'Apparel' },
  { id: 'flipflops', name: 'Flip Flops', promptSuffix: 'on the strap of a pair of flip flops on a sandy beach.', icon: <FlipFlopsIcon />, category: 'Apparel' },
  { id: 'tanktop', name: 'Tank Top', promptSuffix: 'on the chest of a plain tank top worn by a model.', icon: <TankTopIcon />, category: 'Apparel' },
  { id: 'bookbag', name: 'Book Bag', promptSuffix: 'embroidered on the front pocket of a sturdy canvas backpack.', icon: <BookBagIcon />, category: 'Apparel' },
  
  // Merchandise
  { id: 'mug', name: 'Mug', promptSuffix: 'on the side of a glossy ceramic coffee mug, on a clean kitchen counter background.', icon: <MugIcon />, category: 'Merchandise' },
  { id: 'totebag', name: 'Tote Bag', promptSuffix: 'on the front of a canvas tote bag, held by a person in a casual setting.', icon: <ToteBagIcon />, category: 'Merchandise' },
  { id: 'sticker', name: 'Sticker', promptSuffix: 'as a die-cut vinyl sticker on a clean white background.', icon: <StickerIcon />, category: 'Merchandise' },
  { id: 'thermos', name: 'Thermos', promptSuffix: 'wrapped around a stainless steel thermos, on an outdoor table.', icon: <ThermosIcon />, category: 'Merchandise' },
  { id: 'shotglass', name: 'Shot Glass', promptSuffix: 'printed on the side of a clear shot glass.', icon: <ShotGlassIcon />, category: 'Merchandise' },
  { id: 'phonecase', name: 'Phone Case', promptSuffix: 'on the back of a black smartphone case.', icon: <PhoneCaseIcon />, category: 'Merchandise' },
  { id: 'wallet', name: 'Wallet', promptSuffix: 'embossed on the corner of a leather wallet.', icon: <WalletIcon />, category: 'Merchandise' },
  { id: 'umbrella', name: 'Open Umbrella', promptSuffix: 'printed on a panel of a large open umbrella in the rain.', icon: <UmbrellaIcon />, category: 'Merchandise' },

  // Print
  { id: 'notebook', name: 'Notebook', promptSuffix: 'stamped on the hard cover of a closed Moleskine-style notebook.', icon: <NotebookIcon />, category: 'Print' },
  { id: 'calendar', name: 'Calendar', promptSuffix: 'printed on the cover of a spiral-bound wall calendar.', icon: <CalendarIcon />, category: 'Print' },
  { id: 'businesscard', name: 'Business Cards', promptSuffix: 'on a stack of premium minimalist business cards.', icon: <BusinessCardIcon />, category: 'Print' },
  { id: 'menu', name: 'Menu', promptSuffix: 'at the top of a restaurant menu on a wooden table.', icon: <MenuIcon />, category: 'Print' },
  { id: 'movieposter', name: 'Movie Poster', promptSuffix: 'as the main title art on a cinematic movie poster.', icon: <MoviePosterIcon />, category: 'Print' },
  { id: 'magazine', name: 'Magazine Cover', promptSuffix: 'as the main feature on the cover of a glossy magazine.', icon: <MagazineIcon />, category: 'Print' },
  { id: 'postcard', name: 'Postcard', promptSuffix: 'on the front of a postcard lying on a desk.', icon: <PostcardIcon />, category: 'Print' },

  // Signage & Digital
  { id: 'socialmedia', name: 'Social Profile', promptSuffix: 'placed in the center of a circular social media profile picture frame.', icon: <SocialMediaIcon />, category: 'Signage' },
  { id: 'storefront', name: 'Store Sign', promptSuffix: 'on a hanging storefront sign outside a modern boutique.', icon: <StorefrontIcon />, category: 'Signage' },
  { id: 'vehicle', name: 'Vehicle Wrap', promptSuffix: 'as a vinyl wrap on the side of a white delivery van.', icon: <VehicleWrapIcon />, category: 'Signage' },
  { id: 'booth', name: 'Trade Show', promptSuffix: 'on the back wall of a professional trade show booth.', icon: <BoothIcon />, category: 'Signage' },
];

const CATEGORIES: MockupCategory[] = ['Apparel', 'Merchandise', 'Print', 'Signage'];


// --- FEATURE COMPONENTS ---

interface MockupGeneratorProps {
  initialImage?: ImageData;
  onTransfer: (data: ImageData, target: Tab) => void;
}

const MockupGenerator: React.FC<MockupGeneratorProps> = ({ initialImage, onTransfer }) => {
    const [logo, setLogo] = useState<ImageData | null>(initialImage || null);
    const [logoPreview, setLogoPreview] = useState<string | null>(initialImage ? `data:${initialImage.mimeType};base64,${initialImage.base64}` : null);
    const [selectedMockups, setSelectedMockups] = useState<MockupOption[]>([MOCKUP_OPTIONS[0]]);
    const [activeCategory, setActiveCategory] = useState<MockupCategory>('Apparel');
    const [isLoading, setIsLoading] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
    const [isRemovingBg, setIsRemovingBg] = useState(false);
    const [isMirroring, setIsMirroring] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultImages, setResultImages] = useState<{ id: string; src: string; name: string }[]>([]);
    const [modalStartIndex, setModalStartIndex] = useState<number | null>(null);

    // Update state if initialImage changes (e.g. transferred from another tab)
    useEffect(() => {
        if (initialImage) {
            setLogo(initialImage);
            setLogoPreview(`data:${initialImage.mimeType};base64,${initialImage.base64}`);
        }
    }, [initialImage]);

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

    const handleSelectAllInCategory = () => {
        const categoryOptions = MOCKUP_OPTIONS.filter(m => m.category === activeCategory);
        const allSelected = categoryOptions.every(opt => selectedMockups.some(s => s.id === opt.id));
        
        if (allSelected) {
            // Deselect all in category
            setSelectedMockups(prev => prev.filter(item => item.category !== activeCategory));
        } else {
            // Select all in category
            const newSelections = categoryOptions.filter(opt => !selectedMockups.some(s => s.id === opt.id));
            setSelectedMockups(prev => [...prev, ...newSelections]);
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

    const visibleMockups = MOCKUP_OPTIONS.filter(opt => opt.category === activeCategory);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">1. Upload Your Logo</h3>
                        <ImageUpload onImageUpload={handleLogoUpload} title="Your Logo (PNG, JPG)" imagePreviewUrl={logoPreview} />
                        {logo && (
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                <button onClick={handleRemoveBackground} disabled={isRemovingBg || isMirroring || isLoading} className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 text-sm rounded-lg transition-colors disabled:opacity-50">
                                    <MagicWandIcon />
                                    {isRemovingBg ? 'Removing...' : 'Remove BG'}
                                </button>
                                <button onClick={handleMirrorImage} disabled={isMirroring || isRemovingBg || isLoading} className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 text-sm rounded-lg transition-colors disabled:opacity-50">
                                    <MirrorIcon />
                                    {isMirroring ? 'Mirroring...' : 'Mirror'}
                                </button>
                                <button onClick={() => onTransfer(logo, 'editor')} disabled={isLoading} className="flex items-center justify-center bg-brand-primary hover:bg-brand-secondary text-white font-medium py-2 px-3 text-sm rounded-lg transition-colors disabled:opacity-50">
                                    <TransferIcon />
                                    Edit in Editor
                                </button>
                            </div>
                        )}
                    </div>
                    <div>
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">2. Choose Mockups</h3>
                            <button
                                onClick={handleSelectAllInCategory}
                                className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors"
                            >
                                {visibleMockups.every(opt => selectedMockups.some(s => s.id === opt.id)) ? 'Deselect All in Category' : 'Select All in Category'}
                            </button>
                        </div>
                        
                        {/* Category Tabs */}
                        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 md:gap-4">
                            {visibleMockups.map((opt) => (
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

interface ImageEditorProps {
    initialImage?: ImageData;
    onTransfer: (data: ImageData, target: Tab) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ initialImage, onTransfer }) => {
    const [image, setImage] = useState<ImageData | null>(initialImage || null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(initialImage ? `data:${initialImage.mimeType};base64,${initialImage.base64}` : null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);

    useEffect(() => {
        if (initialImage) {
            setImage(initialImage);
            setImagePreviewUrl(`data:${initialImage.mimeType};base64,${initialImage.base64}`);
        }
    }, [initialImage]);

    const handleImageUpload = (imageData: ImageData) => {
        setImage(imageData);
        setImagePreviewUrl(`data:${imageData.mimeType};base64,${imageData.base64}`);
    };

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
                        <ImageUpload onImageUpload={handleImageUpload} title="Image to Edit (PNG, JPG)" imagePreviewUrl={imagePreviewUrl} />
                         {image && (
                            <button onClick={() => onTransfer(image, 'mockup')} className="mt-2 w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                                <TransferIcon />
                                Use as Mockup Logo
                            </button>
                        )}
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
                     {resultImage && !isLoading && (
                         <div className="mt-2 flex gap-2">
                             <button onClick={() => onTransfer({ base64: resultImage, mimeType: 'image/png' }, 'mockup')} className="flex-1 flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                                <TransferIcon /> Use as Logo
                            </button>
                         </div>
                    )}
                </div>
            </div>
            {error && <div className="text-red-700 dark:text-red-400 text-center mt-4 p-2 bg-red-100 dark:bg-red-900/50 rounded-md">{error}</div>}
        </div>
    );
};

interface ImageGeneratorProps {
    onTransfer: (data: ImageData, target: Tab) => void;
}

const ImageGenerator: React.FC<ImageGeneratorProps> = ({ onTransfer }) => {
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
                {resultImage && !isLoading && (
                    <div className="flex justify-center gap-4 mt-4">
                        <button onClick={() => onTransfer({ base64: resultImage, mimeType: 'image/png' }, 'mockup')} className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            <TransferIcon /> Use as Logo
                        </button>
                        <button onClick={() => onTransfer({ base64: resultImage, mimeType: 'image/png' }, 'editor')} className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            <TransferIcon /> Edit Image
                        </button>
                    </div>
                )}
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
  
  // Shared state for image transfer between tabs
  const [sharedImage, setSharedImage] = useState<{data: ImageData, target: Tab} | null>(null);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleTransfer = (data: ImageData, target: Tab) => {
    setSharedImage({ data, target });
    setActiveTab(target);
    // Scroll to top to ensure the user sees the input area
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'mockup': 
        return <MockupGenerator 
            initialImage={sharedImage?.target === 'mockup' ? sharedImage.data : undefined} 
            onTransfer={handleTransfer} 
        />;
      case 'editor': 
        return <ImageEditor 
            initialImage={sharedImage?.target === 'editor' ? sharedImage.data : undefined} 
            onTransfer={handleTransfer} 
        />;
      case 'generator': 
        return <ImageGenerator 
            onTransfer={handleTransfer} 
        />;
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
