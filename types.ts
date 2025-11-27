
// Fix: Resolve 'Cannot find namespace JSX' error by importing React types.
import type React from 'react';

export type Tab = 'mockup' | 'editor' | 'generator';

export type MockupCategory = 'Apparel' | 'Merchandise' | 'Print' | 'Signage';

export type InspirationCategory = 'Characters' | 'Places' | 'Objects' | 'Art';

export type AspectRatio = 
  | '1:1' | '1:3' | '1:2' | '9:16' | '10:16' | '2:3' | '3:4' | '4:5' 
  | '3:1' | '2:1' | '16:9' | '16:10' | '3:2' | '4:3' | '5:4' | 'Custom';

export interface MockupOption {
  id: string;
  name: string;
  promptSuffix: string;
  icon: React.JSX.Element;
  category: MockupCategory;
}

export interface InspirationOption {
    id: string;
    name: string;
    category: InspirationCategory;
    icon: React.JSX.Element;
    prompts: string[];
}

export interface ImageData {
  base64: string;
  mimeType: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageData: ImageData;
  type: 'mockup' | 'edit' | 'generation';
  prompt?: string;
  aspectRatio?: string;
}
