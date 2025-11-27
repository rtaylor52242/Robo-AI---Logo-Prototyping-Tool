
import React, { useState, useCallback, useEffect } from 'react';
import JSZip from 'jszip';
import { generateWithImageInput, generateWithTextInput } from './services/geminiService';
import type { Tab, MockupOption, ImageData, MockupCategory, HistoryItem, InspirationOption, InspirationCategory, AspectRatio } from './types';
import { ImageUpload } from './components/ImageUpload';
import { GeneratedImageDisplay } from './components/GeneratedImageDisplay';
import { ImageModal } from './components/ImageModal';
import { HelpModal } from './components/HelpModal';
import { HistoryModal } from './components/HistoryModal';

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

const BillboardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M8 14v7M16 14v7M4 6V4h16v2M4 10v4h16v-4" /></svg>;
const BusStopIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v2H4zM5 6v14h14V6M9 6v14M15 6v14M9 12h6" /></svg>;
const NeonSignIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const OfficeWallIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-10a2 2 0 110-4 2 2 0 010 4zm-2 4h4" /></svg>;
const LetterheadIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6m-6-4h10a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h4z" /></svg>;

// More New Icons
const BannerIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 3v18M7 3v18M7 3h10M7 21h10M4 6h16M4 18h16" /></svg>;
const KioskIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const WindowDecalIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4V4z" /><path d="M9 9h6v6H9V9z" /></svg>;
const AFrameIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3L4 21h16L12 3z" /><path d="M12 8v8" /></svg>;

// Inspiration Icons
const PortraitIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const MonsterIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>; // Representing a group/creature
const AnimeIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const AstronautIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const WizardIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; // Magic bolt
const CyberneticIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const AnimalIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; // Bear/Face

const CityIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-10a2 2 0 110-4 2 2 0 010 4zm-2 4h4" /></svg>;
const NatureIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const SpaceIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const RoomIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const CastleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>;
const RuinsIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const OceanIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const MountainIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;

const VehicleIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>;
const WeaponIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const FoodIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" /></svg>;
const SneakerIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>; // Bolt placeholder
const FurnitureIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m8-10a2 2 0 110-4 2 2 0 010 4zm-2 4h4" /></svg>; // Door/Cabinet
const GadgetIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>;
const ToyIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const InstrumentIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>;

const LogoIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const PatternIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const IconIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const TattooIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>;
const IsometricIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const MascotIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const SunIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const MoonIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>;
const HelpIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.546-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const HistoryIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
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
const LightBulbIcon: React.FC = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" /></svg>;


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
  { id: 'letterhead', name: 'Letterhead', promptSuffix: 'printed at the top of a professional company letterhead on a wooden desk.', icon: <LetterheadIcon />, category: 'Print' },

  // Signage & Digital
  { id: 'socialmedia', name: 'Social Profile', promptSuffix: 'placed in the center of a circular social media profile picture frame.', icon: <SocialMediaIcon />, category: 'Signage' },
  { id: 'storefront', name: 'Store Sign', promptSuffix: 'on a hanging storefront sign outside a modern boutique.', icon: <StorefrontIcon />, category: 'Signage' },
  { id: 'vehicle', name: 'Vehicle Wrap', promptSuffix: 'as a vinyl wrap on the side of a white delivery van.', icon: <VehicleWrapIcon />, category: 'Signage' },
  { id: 'booth', name: 'Trade Show', promptSuffix: 'on the back wall of a professional trade show booth.', icon: <BoothIcon />, category: 'Signage' },
  { id: 'billboard', name: 'Billboard', promptSuffix: 'displayed on a massive highway billboard against a clear sky.', icon: <BillboardIcon />, category: 'Signage' },
  { id: 'busstop', name: 'Bus Stop', promptSuffix: 'on an advertisement poster at a city bus stop shelter.', icon: <BusStopIcon />, category: 'Signage' },
  { id: 'neonsign', name: 'Neon Sign', promptSuffix: 'as a glowing bright neon sign mounted on a dark brick wall.', icon: <NeonSignIcon />, category: 'Signage' },
  { id: 'officewall', name: 'Office Wall', promptSuffix: 'as a 3D acrylic logo sign mounted on a modern corporate office reception wall.', icon: <OfficeWallIcon />, category: 'Signage' },
  { id: 'banner', name: 'Street Banner', promptSuffix: 'displayed on a vertical street pole banner in a busy city district.', icon: <BannerIcon />, category: 'Signage' },
  { id: 'kiosk', name: 'Digital Kiosk', promptSuffix: 'on the screen of a modern digital interactive kiosk in a shopping mall.', icon: <KioskIcon />, category: 'Signage' },
  { id: 'windowdecal', name: 'Window Decal', promptSuffix: 'as a vinyl window decal on the glass front of a modern cafe.', icon: <WindowDecalIcon />, category: 'Signage' },
  { id: 'aframe', name: 'Sidewalk Sign', promptSuffix: 'on a rustic chalkboard A-frame sign standing on a sidewalk.', icon: <AFrameIcon />, category: 'Signage' },
];

const INSPIRATION_OPTIONS: InspirationOption[] = [
    // Characters & Beings
    { id: 'portrait', name: 'Portrait', category: 'Characters', icon: <PortraitIcon />, prompts: ["A highly detailed portrait of an elderly fisherman with a weathered face, cinematic lighting.", "A portrait of a futuristic cyberpunk woman with neon glowing eyes.", "A close-up portrait of a fantasy warrior in intricate armor."] },
    { id: 'robot', name: 'Robot', category: 'Characters', icon: <RobotIcon />, prompts: ["A cute rusty robot holding a flower in a post-apocalyptic garden, Pixar style.", "A giant mech robot defending a futuristic city, epic scale, 8k.", "A retro 1950s style household robot making breakfast."] },
    { id: 'monster', name: 'Creature', category: 'Characters', icon: <MonsterIcon />, prompts: ["A terrifying deep sea monster with glowing bioluminescence.", "A cute fluffy monster with big eyes hiding in a closet.", "A majestic dragon resting on a pile of gold in a dark cave."] },
    { id: 'anime', name: 'Anime Char', category: 'Characters', icon: <AnimeIcon />, prompts: ["An anime style girl with pink hair fighting in a high school setting.", "A shonen protagonist charging up power, intense energy aura.", "A slice of life anime scene with a girl studying in a cozy cafe."] },
    { id: 'astronaut', name: 'Astronaut', category: 'Characters', icon: <AstronautIcon />, prompts: ["An astronaut floating in deep space with a reflection of Earth in the visor.", "An astronaut exploring a colorful alien jungle.", "A vintage style poster of an astronaut on Mars."] },
    { id: 'wizard', name: 'Wizard', category: 'Characters', icon: <WizardIcon />, prompts: ["An old wizard casting a powerful lightning spell on a mountain peak.", "A young wizard apprentice studying magical tomes in a dusty library.", "A dark sorcerer summoning spirits in a misty graveyard."] },
    { id: 'cybernetic', name: 'Cyborg', category: 'Characters', icon: <CyberneticIcon />, prompts: ["A cyborg with transparent skin showing internal gears, hyperrealistic.", "A half-human half-machine soldier in a dystopian warzone.", "A fashionable cyborg model posing in a high-tech studio."] },
    { id: 'animal', name: 'Animal', category: 'Characters', icon: <AnimalIcon />, prompts: ["A majestic lion wearing a king's crown, oil painting style.", "A macro shot of a colorful tree frog on a leaf.", "A golden retriever puppy playing in autumn leaves."] },

    // Places & Scenery
    { id: 'cybercity', name: 'Cyber City', category: 'Places', icon: <CityIcon />, prompts: ["A sprawling cyberpunk city with flying cars and neon advertisements in rain.", "A futuristic metropolis with clean white towers and green gardens.", "A dark alleyway in a cyberpunk slum, moody lighting."] },
    { id: 'nature', name: 'Nature', category: 'Places', icon: <NatureIcon />, prompts: ["A serene mountain lake reflecting the snowy peaks at sunrise.", "A dense misty forest with light beams breaking through the canopy.", "A vibrant field of sunflowers under a bright blue sky."] },
    { id: 'space', name: 'Space', category: 'Places', icon: <SpaceIcon />, prompts: ["A colorful nebula with birthing stars, realistic astrophotography.", "A view of a black hole accretion disk, cinematic.", "A fleet of spaceships engaging in a battle near Saturn."] },
    { id: 'room', name: 'Interior', category: 'Places', icon: <RoomIcon />, prompts: ["A cozy loft apartment with exposed brick and warm lighting.", "A futuristic minimalist living room with a view of a city.", "A messy artist's studio filled with paintings and supplies."] },
    { id: 'castle', name: 'Castle', category: 'Places', icon: <CastleIcon />, prompts: ["A fairytale castle perched high on a cliff above the clouds.", "A dark gothic castle surrounded by a stormy moat.", "An ancient stone fortress crumbling into the sea."] },
    { id: 'ruins', name: 'Ruins', category: 'Places', icon: <RuinsIcon />, prompts: ["Overgrown ancient ruins in a jungle, tomb raider style.", "The ruins of a modern city reclaimed by nature.", "Mysterious alien ruins glowing in the desert night."] },
    { id: 'ocean', name: 'Ocean', category: 'Places', icon: <OceanIcon />, prompts: ["A vibrant coral reef teeming with tropical fish.", "A massive wave crashing during a storm, dramatic seascape.", "A calm tropical beach with crystal clear turquoise water."] },
    { id: 'mountain', name: 'Mountain', category: 'Places', icon: <MountainIcon />, prompts: ["A jagged mountain peak covered in snow against a starry night sky.", "Rolling green hills with a lonely tree on top.", "A volcano erupting with lava flowing down the side."] },

    // Objects & Items
    { id: 'vehicle', name: 'Vehicle', category: 'Objects', icon: <VehicleIcon />, prompts: ["A sleek concept car driving on a coastal highway.", "A vintage steam train crossing a bridge.", "A futuristic hoverbike parked in a garage."] },
    { id: 'weapon', name: 'Weapon', category: 'Objects', icon: <WeaponIcon />, prompts: ["A legendary sword glowing with magical energy.", "A futuristic laser rifle with intricate details.", "An antique flintlock pistol on a velvet cloth."] },
    { id: 'food', name: 'Food', category: 'Objects', icon: <FoodIcon />, prompts: ["A delicious gourmet burger with melting cheese, food photography.", "A steaming bowl of ramen with fresh toppings.", "A colorful display of french macarons in a bakery."] },
    { id: 'sneaker', name: 'Sneaker', category: 'Objects', icon: <SneakerIcon />, prompts: ["A limited edition high-top sneaker design, vector art.", "A futuristic shoe made of glowing energy.", "A worn-out vintage sneaker lying on the pavement."] },
    { id: 'furniture', name: 'Furniture', category: 'Objects', icon: <FurnitureIcon />, prompts: ["A mid-century modern armchair in a stylish room.", "A futuristic gaming chair with neon lights.", "An antique wooden desk filled with maps and scrolls."] },
    { id: 'gadget', name: 'Gadget', category: 'Objects', icon: <GadgetIcon />, prompts: ["A retro handheld gaming console from the 90s.", "A futuristic holographic wrist computer.", "A steampunk pocket watch with exposed gears."] },
    { id: 'toy', name: 'Toy', category: 'Objects', icon: <ToyIcon />, prompts: ["A vintage tin robot toy standing on a shelf.", "A pile of colorful plastic building blocks.", "A creepy porcelain doll in an attic."] },
    { id: 'instrument', name: 'Instrument', category: 'Objects', icon: <InstrumentIcon />, prompts: ["A shiny saxophone reflecting stage lights.", "An acoustic guitar leaning against a tree.", "A futuristic synthesizer with glowing keys."] },

    // Art & Design
    { id: 'logo', name: 'Logo', category: 'Art', icon: <LogoIcon />, prompts: ["A minimalist vector logo of a fox, flat design.", "A 3D metallic logo for a tech company.", "A vintage badge style logo for a coffee shop."] },
    { id: 'pattern', name: 'Pattern', category: 'Art', icon: <PatternIcon />, prompts: ["A seamless floral pattern design, pastel colors.", "A geometric abstract pattern, black and white.", "A retro 80s memphis style pattern."] },
    { id: 'sticker', name: 'Sticker', category: 'Art', icon: <StickerIcon />, prompts: ["A cute die-cut sticker of a cat drinking boba tea.", "A holographic sticker design of a skull.", "A retro travel sticker for a fictional planet."] },
    { id: 'poster', name: 'Poster', category: 'Art', icon: <MoviePosterIcon />, prompts: ["A minimalist movie poster design for a sci-fi film.", "A vintage travel poster for the French Riviera.", "A concert poster with psychedelic typography."] },
    { id: 'icon', name: 'Icon Set', category: 'Art', icon: <IconIcon />, prompts: ["A set of flat colorful app icons for a productivity tool.", "A collection of line art icons for a website.", "3D glossy icons for a mobile game."] },
    { id: 'tattoo', name: 'Tattoo', category: 'Art', icon: <TattooIcon />, prompts: ["A traditional rose tattoo design.", "A geometric wolf tattoo design.", "A watercolor style tattoo of a hummingbird."] },
    { id: 'isometric', name: 'Isometric', category: 'Art', icon: <IsometricIcon />, prompts: ["An isometric low poly render of a cozy cottage.", "An isometric view of a futuristic factory floor.", "An isometric 3D room design."] },
    { id: 'mascot', name: 'Mascot', category: 'Art', icon: <MascotIcon />, prompts: ["A cheerful mascot character for a cereal brand.", "A fierce sports team mascot logo of a bull.", "A cute 3D mascot for a software company."] },
];

const CATEGORIES: MockupCategory[] = ['Apparel', 'Merchandise', 'Print', 'Signage'];
const INSPIRATION_CATEGORIES: InspirationCategory[] = ['Characters', 'Places', 'Objects', 'Art'];

const STYLE_PRESETS = [
    'Abstract Art', 'Anime', 'Black and White', 'Claymation', 'Cyberpunk', 
    'DC Comic', 'Futuristic Sci-Fi', 'Lego', 'Magical Fantasy', 'Marvel Comic', 
    'Minecraft', 'Picasso', 'Pixar', 'Pop Art', 'Simpsons', 'Studio Ghibli', 
    'Van Gogh', 'Vintage', 'Vintage Oil Painting', 'Watercolor'
];

const RANDOM_PROMPTS = [
  "A futuristic city with flying cars and neon lights, cyberpunk style, high detail",
  "A serene mountain landscape with a crystal clear lake at sunset, photorealistic",
  "A cute robot gardening in a greenhouse full of exotic plants, Pixar style",
  "An astronaut floating in space with Earth in the background, cinematic lighting",
  "A magical library with floating books and glowing runes, fantasy art",
  "A steampunk coffee shop with brass gears and steam pipes, warm atmosphere",
  "A portrait of a cat wearing a victorian suit, oil painting style",
  "A delicious gourmet burger with melting cheese and fresh vegetables, food photography",
  "A dragon resting on a pile of gold coins in a dark cave, epic scale",
  "A minimalist geometric logo design of a wolf, vector art style",
  "A cozy cabin in the woods covered in snow, warm light coming from windows",
  "An underwater city with bioluminescent creatures and coral reefs",
  "A cyberpunk street food vendor serving glowing noodles",
  "A vintage travel poster for Mars, retro style",
  "A close-up macro shot of a dew drop on a spider web"
];

interface ErrorDetails {
    message: string;
    stack?: string;
    details?: string;
}

const ErrorDisplay: React.FC<{ error: ErrorDetails | null }> = ({ error }) => {
    if (!error) return null;
    return (
        <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg border border-red-200 dark:border-red-800">
            <h4 className="font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Something went wrong
            </h4>
            <p className="mt-1">{error.message}</p>
            {(error.details || error.stack) && (
                <details className="mt-2 text-xs font-mono whitespace-pre-wrap">
                    <summary className="cursor-pointer hover:underline mb-1">Technical Details</summary>
                    <div className="bg-white/50 dark:bg-black/20 p-2 rounded">
                        {error.details || error.stack}
                    </div>
                </details>
            )}
        </div>
    );
};

// --- ASPECT RATIO SELECTOR ---

interface AspectRatioSelectorProps {
  selectedRatio: AspectRatio;
  onSelect: (ratio: AspectRatio | string) => void;
  customDimensions?: { w: number, h: number };
  onCustomChange?: (w: number, h: number) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selectedRatio, onSelect, customDimensions = { w: 1024, h: 1024 }, onCustomChange }) => {
  const portraitRatios: AspectRatio[] = ['1:3', '1:2', '9:16', '10:16', '2:3', '3:4', '4:5'];
  const landscapeRatios: AspectRatio[] = ['3:1', '2:1', '16:9', '16:10', '3:2', '4:3', '5:4', '1:1'];

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'w' | 'h') => {
      if (onCustomChange) {
          const val = parseInt(e.target.value) || 0;
          if (type === 'w') onCustomChange(val, customDimensions.h);
          else onCustomChange(customDimensions.w, val);
      }
  };

  const isCustomSelected = selectedRatio === 'Custom' || !portraitRatios.includes(selectedRatio as any) && !landscapeRatios.includes(selectedRatio as any) && selectedRatio !== '1:1';

  return (
    <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">Aspect Ratio</label>
        <div className="space-y-3">
             {/* Landscape & Square */}
             <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Landscape & Square</span>
                <div className="flex flex-wrap gap-2">
                    {landscapeRatios.map(ratio => (
                        <button
                            key={ratio}
                            onClick={() => onSelect(ratio)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedRatio === ratio ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white dark:bg-dark-input text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>
            
            {/* Portrait */}
            <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider mb-1 block">Portrait</span>
                <div className="flex flex-wrap gap-2">
                    {portraitRatios.map(ratio => (
                        <button
                            key={ratio}
                            onClick={() => onSelect(ratio)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${selectedRatio === ratio ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white dark:bg-dark-input text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                        >
                            {ratio}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom */}
            <div>
                 <button
                    onClick={() => onSelect('Custom')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isCustomSelected ? 'bg-brand-primary text-white border-brand-primary' : 'bg-white dark:bg-dark-input text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                    Custom
                </button>
                {isCustomSelected && (
                    <div className="flex items-center gap-2 mt-2">
                        <input 
                            type="number" 
                            value={customDimensions.w} 
                            onChange={(e) => handleCustomChange(e, 'w')} 
                            className="w-20 p-1 text-sm bg-white dark:bg-dark-input border border-gray-300 dark:border-gray-600 rounded" 
                            placeholder="W" 
                        />
                        <span className="text-gray-500">:</span>
                        <input 
                            type="number" 
                            value={customDimensions.h} 
                            onChange={(e) => handleCustomChange(e, 'h')} 
                            className="w-20 p-1 text-sm bg-white dark:bg-dark-input border border-gray-300 dark:border-gray-600 rounded" 
                            placeholder="H" 
                        />
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};


// --- FEATURE COMPONENTS ---

interface MockupGeneratorProps {
  initialImage?: ImageData;
  onTransfer: (data: ImageData, target: Tab) => void;
  onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const MockupGenerator: React.FC<MockupGeneratorProps> = ({ initialImage, onTransfer, onAddToHistory }) => {
    const [logo, setLogo] = useState<ImageData | null>(initialImage || null);
    const [logoPreview, setLogoPreview] = useState<string | null>(initialImage ? `data:${initialImage.mimeType};base64,${initialImage.base64}` : null);
    const [selectedMockups, setSelectedMockups] = useState<MockupOption[]>([MOCKUP_OPTIONS[0]]);
    const [activeCategory, setActiveCategory] = useState<MockupCategory>('Apparel');
    const [isLoading, setIsLoading] = useState(false);
    const [isZipping, setIsZipping] = useState(false);
    const [isRemovingBg, setIsRemovingBg] = useState(false);
    const [isMirroring, setIsMirroring] = useState(false);
    const [error, setError] = useState<ErrorDetails | null>(null);
    const [resultImages, setResultImages] = useState<{ id: string; src: string; name: string }[]>([]);
    const [modalStartIndex, setModalStartIndex] = useState<number | null>(null);
    
    // Aspect Ratio State
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [customDims, setCustomDims] = useState({ w: 1024, h: 1024 });

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
            const imageB64 = await generateWithImageInput(prompt, logo, aspectRatio === 'Custom' ? `${customDims.w}:${customDims.h}` : aspectRatio);
            const newImageData = { base64: imageB64, mimeType: 'image/png' };
            setLogo(newImageData);
            setLogoPreview(`data:image/png;base64,${imageB64}`);
            onAddToHistory({ imageData: newImageData, type: 'edit', prompt: 'Removed background', aspectRatio: aspectRatio === 'Custom' ? `${customDims.w}:${customDims.h}` : aspectRatio });
        } catch (err: any) {
            setError({ message: err.message || 'Failed to remove background.', stack: err.stack });
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
             onAddToHistory({ imageData: mirroredImageData, type: 'edit', prompt: 'Mirrored image' });
        } catch (err: any) {
            setError({ message: err.message || 'Failed to mirror image.', stack: err.stack });
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

        } catch (err: any) {
            console.error("Error creating zip file:", err);
            setError({ message: "Could not create a zip file for download.", details: err.message, stack: err.stack });
        } finally {
            setIsZipping(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logo) {
            setError({ message: 'Please upload a logo first.' });
            return;
        }
        if (selectedMockups.length === 0) {
            setError({ message: 'Please select at least one mockup type.' });
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultImages([]);

        const ratioString = aspectRatio === 'Custom' ? `${customDims.w}:${customDims.h}` : aspectRatio;

        const promises = selectedMockups.map(mockup =>
            generateWithImageInput(`Place this logo ${mockup.promptSuffix}`, logo, ratioString)
                .then(imageB64 => ({ status: 'fulfilled' as const, value: imageB64, id: mockup.id, name: mockup.name }))
                .catch(error => ({ status: 'rejected' as const, reason: error, id: mockup.id, name: mockup.name }))
        );

        const results = await Promise.all(promises);
        
        const successfulResults = results
            .filter((res): res is { status: 'fulfilled'; value: string; id: string; name: string } => res.status === 'fulfilled')
            .map(res => ({ id: res.id, src: res.value, name: res.name }));
        
        // Add successful mockups to history
        successfulResults.forEach(res => {
             onAddToHistory({ 
                 imageData: { base64: res.src, mimeType: 'image/png' }, 
                 type: 'mockup', 
                 prompt: `Mockup: ${res.name}`,
                 aspectRatio: ratioString
            });
        });

        const failedResults = results.filter(res => res.status === 'rejected');

        setResultImages(successfulResults);

        if (failedResults.length > 0) {
             const errorDetails = failedResults.map(r => `${r.name}: ${(r as any).reason.message}`).join('\n');
             setError({ 
                 message: `Failed to generate ${failedResults.length} mockup(s).`,
                 details: errorDetails
             });
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
                        <ImageUpload onImageUpload={handleLogoUpload} title="Your Logo (PNG, JPG)" imagePreviewUrl={logoPreview} id="mockup-upload" />
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
                         <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">2. Settings</h3>
                         <AspectRatioSelector 
                            selectedRatio={aspectRatio} 
                            onSelect={(r) => setAspectRatio(r as AspectRatio)} 
                            customDimensions={customDims}
                            onCustomChange={(w, h) => setCustomDims({w, h})}
                        />
                    </div>

                    <div>
                         <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">3. Choose Mockups</h3>
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
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">4. Results</h3>
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
            <ErrorDisplay error={error} />
            {modalStartIndex !== null && <ImageModal images={resultImages} startIndex={modalStartIndex} onClose={() => setModalStartIndex(null)} />}
        </div>
    );
};

interface ImageEditorProps {
    initialImage?: ImageData;
    onTransfer: (data: ImageData, target: Tab) => void;
    onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ initialImage, onTransfer, onAddToHistory }) => {
    const [image, setImage] = useState<ImageData | null>(initialImage || null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(initialImage ? `data:${initialImage.mimeType};base64,${initialImage.base64}` : null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorDetails | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);

    // Aspect Ratio State
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [customDims, setCustomDims] = useState({ w: 1024, h: 1024 });

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
    
    const handleAddStyle = (style: string) => {
        setPrompt(prev => {
            const trimmed = prev.trim();
            if (trimmed.length > 0 && !trimmed.endsWith('.')) {
                return `${trimmed}. Make it ${style} style.`;
            } else if (trimmed.length > 0) {
                 return `${trimmed} Make it ${style} style.`;
            }
            return `Make this image ${style} style.`;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!image || !prompt) {
            setError({ message: 'Please upload an image and enter an editing instruction.' });
            return;
        }
        setIsLoading(true);
        setError(null);
        setResultImage(null);

        const ratioString = aspectRatio === 'Custom' ? `${customDims.w}:${customDims.h}` : aspectRatio;

        try {
            const imageB64 = await generateWithImageInput(prompt, image, ratioString);
            setResultImage(imageB64);
            onAddToHistory({ 
                imageData: { base64: imageB64, mimeType: 'image/png' }, 
                type: 'edit', 
                prompt: prompt,
                aspectRatio: ratioString
            });
        } catch (err: any) {
            setError({ message: err.message || 'An unknown error occurred.', stack: err.stack });
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
                        <ImageUpload onImageUpload={handleImageUpload} title="Image to Edit (PNG, JPG)" imagePreviewUrl={imagePreviewUrl} id="editor-upload" />
                         {image && (
                            <button onClick={() => onTransfer(image, 'mockup')} className="mt-2 w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm">
                                <TransferIcon />
                                Use as Mockup Logo
                            </button>
                        )}
                    </div>
                    
                    <div>
                         <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">2. Settings</h3>
                         <AspectRatioSelector 
                            selectedRatio={aspectRatio} 
                            onSelect={(r) => setAspectRatio(r as AspectRatio)} 
                            customDimensions={customDims}
                            onCustomChange={(w, h) => setCustomDims({w, h})}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">3. Describe Your Edit</h3>
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., 'Add a retro filter' or 'Make the sky look like a sunset'"
                            className="w-full h-24 p-2 bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-dark-border rounded-lg focus:ring-brand-primary focus:border-brand-primary transition"
                        />
                         {/* Style Presets */}
                         <div className="mt-4">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Quick Styles</label>
                            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                                {STYLE_PRESETS.map(style => (
                                    <button
                                        key={style}
                                        type="button"
                                        onClick={() => handleAddStyle(style)}
                                        className="px-2 py-1 text-xs bg-gray-200 dark:bg-dark-card hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border border-transparent hover:border-gray-400 dark:hover:border-gray-500 transition-all"
                                    >
                                        {style}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleSubmit} disabled={isLoading || !image || !prompt} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? 'Editing...' : 'Apply Edit'}
                    </button>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">4. Result</h3>
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
            <ErrorDisplay error={error} />
        </div>
    );
};

const ImageGenerator: React.FC<{ onAddToHistory: (item: Omit<HistoryItem, 'id' | 'timestamp'>) => void, onTransfer: (data: ImageData, target: Tab) => void }> = ({ onAddToHistory, onTransfer }) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<ErrorDetails | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    
    // Inspiration State
    const [activeInspirationCategory, setActiveInspirationCategory] = useState<InspirationCategory>('Characters');
    const [selectedInspirations, setSelectedInspirations] = useState<string[]>([]);
    
    // Aspect Ratio State
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [customDims, setCustomDims] = useState({ w: 1024, h: 1024 });

    const handleSurpriseMe = () => {
        let pool: string[] = [];
        
        if (selectedInspirations.length === 0) {
            pool = RANDOM_PROMPTS;
        } else {
            // Filter options that are selected
            const selectedOptions = INSPIRATION_OPTIONS.filter(opt => selectedInspirations.includes(opt.id));
            // Combine all prompts from selected options
            selectedOptions.forEach(opt => {
                pool = [...pool, ...opt.prompts];
            });
            // If something went wrong and pool is empty, fallback
            if (pool.length === 0) pool = RANDOM_PROMPTS;
        }

        const randomPrompt = pool[Math.floor(Math.random() * pool.length)];
        setPrompt(randomPrompt);
    };
    
    const toggleInspiration = (id: string) => {
        setSelectedInspirations(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt) return;
        setIsLoading(true);
        setError(null);
        setResultImage(null);

        const ratioString = aspectRatio === 'Custom' ? `${customDims.w}:${customDims.h}` : aspectRatio;

        try {
            const imageB64 = await generateWithTextInput(prompt, ratioString);
            setResultImage(imageB64);
            onAddToHistory({ 
                imageData: { base64: imageB64, mimeType: 'image/png' }, 
                type: 'generation', 
                prompt: prompt,
                aspectRatio: ratioString
            });
        } catch (err: any) {
            setError({ message: err.message || 'Failed to generate image.', stack: err.stack });
        } finally {
            setIsLoading(false);
        }
    };

    const visibleInspirations = INSPIRATION_OPTIONS.filter(opt => opt.category === activeInspirationCategory);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">1. Need Inspiration? (Optional)</h3>
                        <p className="text-xs text-gray-500 mb-3">Select items below to steer the "Inspire Me" button towards specific topics.</p>
                        
                        {/* Inspiration Tabs */}
                        <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                            {INSPIRATION_CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveInspirationCategory(cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeInspirationCategory === cat ? 'bg-brand-primary text-white' : 'bg-gray-200 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        {/* Inspiration Grid */}
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {visibleInspirations.map((opt) => (
                                <button 
                                    key={opt.id} 
                                    onClick={() => toggleInspiration(opt.id)}
                                    className={`p-2 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 aspect-square ${selectedInspirations.includes(opt.id) ? 'bg-brand-primary text-white ring-2 ring-offset-1 ring-brand-primary' : 'bg-gray-100 dark:bg-dark-input hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                >
                                    {opt.icon}
                                    <span className="mt-1 text-[10px] leading-tight font-medium truncate w-full">{opt.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                         <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">2. Settings</h3>
                         <AspectRatioSelector 
                            selectedRatio={aspectRatio} 
                            onSelect={(r) => setAspectRatio(r as AspectRatio)} 
                            customDimensions={customDims}
                            onCustomChange={(w, h) => setCustomDims({w, h})}
                        />
                    </div>

                    <div>
                        <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">3. Describe Your Vision</h3>
                        <div className="relative">
                            <textarea 
                                value={prompt} 
                                onChange={(e) => setPrompt(e.target.value)} 
                                placeholder="A futuristic city with flying cars..."
                                className="w-full h-32 p-3 bg-gray-50 dark:bg-dark-input border border-gray-300 dark:border-dark-border rounded-lg focus:ring-brand-primary focus:border-brand-primary transition resize-none"
                            />
                            <button 
                                type="button" 
                                onClick={handleSurpriseMe}
                                className={`absolute bottom-2 right-2 text-xs px-3 py-1.5 rounded transition-all flex items-center font-medium ${selectedInspirations.length > 0 ? 'bg-brand-secondary text-white hover:bg-opacity-90' : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'}`}
                            >
                                <LightBulbIcon /> 
                                {selectedInspirations.length > 0 ? `Inspire Me (${selectedInspirations.length})` : 'Inspire Me'}
                            </button>
                        </div>
                    </div>
                    
                    <button onClick={handleSubmit} disabled={isLoading || !prompt} className="w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                        {isLoading ? 'Generating...' : 'Generate Image'}
                    </button>
                </div>

                <div className="space-y-2">
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">4. Result</h3>
                    <GeneratedImageDisplay imageUrl={resultImage} isLoading={isLoading} altText={prompt} />
                     {resultImage && !isLoading && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                             <button onClick={() => onTransfer({ base64: resultImage, mimeType: 'image/png' }, 'mockup')} className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                                <TransferIcon /> To Mockup
                            </button>
                             <button onClick={() => onTransfer({ base64: resultImage, mimeType: 'image/png' }, 'editor')} className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-3 rounded-lg transition-colors text-sm">
                                <TransferIcon /> To Editor
                            </button>
                         </div>
                    )}
                </div>
            </div>
            <ErrorDisplay error={error} />
        </div>
    );
};

const App: React.FC = () => {
    // Reordered default tab: 'generator' first
    const [activeTab, setActiveTab] = useState<Tab>('generator');
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isHelpOpen, setIsHelpOpen] = useState(false);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    
    // Shared State for Transfer
    const [sharedImage, setSharedImage] = useState<ImageData | undefined>(undefined);
    const [transferTarget, setTransferTarget] = useState<Tab | null>(null);

    useEffect(() => {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        }
        
        // Load History
        try {
            const savedHistory = localStorage.getItem('roboAiHistory');
            if (savedHistory) {
                setHistory(JSON.parse(savedHistory));
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const addToHistory = (item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
        const newItem: HistoryItem = {
            ...item,
            id: Date.now().toString(),
            timestamp: Date.now(),
        };
        setHistory(prev => {
            const newHistory = [...prev, newItem];
            // Limit history size to prevent LS quotas issues, though we catch errors now
            if (newHistory.length > 50) newHistory.shift(); 
            
            try {
                localStorage.setItem('roboAiHistory', JSON.stringify(newHistory));
            } catch (e) {
                console.warn("History storage limit reached, could not save to localStorage.");
            }
            return newHistory;
        });
    };

    const deleteHistoryItem = (id: string) => {
        setHistory(prev => {
            const newHistory = prev.filter(item => item.id !== id);
             try {
                localStorage.setItem('roboAiHistory', JSON.stringify(newHistory));
            } catch (e) {
                console.warn("Could not save updated history to localStorage.");
            }
            return newHistory;
        });
    };

    const handleTransfer = (data: ImageData, target: Tab) => {
        setSharedImage(data);
        setTransferTarget(target);
        setActiveTab(target);
        // Clear shared image after a brief delay so it doesn't persist if we navigate away and back manually
        // But for now, we pass it as props which will trigger useEffect in components
    };

    // Helper to determine props based on active tab and transfer target
    const getInitialImageForTab = (tab: Tab) => {
        return transferTarget === tab ? sharedImage : undefined;
    };

    return (
        <div className="min-h-screen transition-colors duration-300 dark:text-gray-100 font-sans selection:bg-brand-primary selection:text-white pb-12">
            <header className="bg-white dark:bg-dark-card shadow-sm sticky top-0 z-40 transition-colors border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                        <div className="bg-brand-primary p-2 rounded-lg">
                            <RobotIcon />
                        </div>
                        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-secondary">
                            Robo AI
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                         <button onClick={() => setIsHistoryOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300" title="History">
                            <HistoryIcon />
                        </button>
                        <button onClick={() => setIsHelpOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300" title="Help">
                            <HelpIcon />
                        </button>
                        <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300" title="Toggle Dark Mode">
                            {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs - Reordered */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mb-8 bg-gray-200 dark:bg-dark-input p-1 rounded-xl w-fit mx-auto">
                     <button
                        onClick={() => setActiveTab('generator')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex-1 sm:flex-none text-center ${activeTab === 'generator' ? 'bg-white dark:bg-dark-card text-brand-primary shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        Generative AI
                    </button>
                     <button
                        onClick={() => setActiveTab('editor')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex-1 sm:flex-none text-center ${activeTab === 'editor' ? 'bg-white dark:bg-dark-card text-brand-primary shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        Image Editor
                    </button>
                    <button
                        onClick={() => setActiveTab('mockup')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 flex-1 sm:flex-none text-center ${activeTab === 'mockup' ? 'bg-white dark:bg-dark-card text-brand-primary shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                    >
                        Mockup Studio
                    </button>
                </div>

                {/* Content Area - Using Display to persist state */}
                <div className="bg-white dark:bg-dark-card rounded-2xl shadow-xl p-6 md:p-8 transition-colors border border-gray-100 dark:border-gray-800 min-h-[600px]">
                    <div style={{ display: activeTab === 'generator' ? 'block' : 'none' }}>
                         <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Image Generator</h2>
                            <p className="text-gray-500 dark:text-gray-400">Turn text into high-quality images.</p>
                        </div>
                        <ImageGenerator onAddToHistory={addToHistory} onTransfer={handleTransfer} />
                    </div>

                    <div style={{ display: activeTab === 'editor' ? 'block' : 'none' }}>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI Image Editor</h2>
                            <p className="text-gray-500 dark:text-gray-400">Upload an image and modify it with natural language.</p>
                        </div>
                        <ImageEditor initialImage={getInitialImageForTab('editor')} onTransfer={handleTransfer} onAddToHistory={addToHistory} />
                    </div>

                    <div style={{ display: activeTab === 'mockup' ? 'block' : 'none' }}>
                         <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mockup Studio</h2>
                            <p className="text-gray-500 dark:text-gray-400">Place your logo on realistic products.</p>
                        </div>
                        <MockupGenerator initialImage={getInitialImageForTab('mockup')} onTransfer={handleTransfer} onAddToHistory={addToHistory} />
                    </div>
                </div>
            </main>

            <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
            <HistoryModal isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} onTransfer={handleTransfer} onDelete={deleteHistoryItem} />
        </div>
    );
};

export default App;
