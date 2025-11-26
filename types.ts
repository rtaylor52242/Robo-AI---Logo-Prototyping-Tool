
// Fix: Resolve 'Cannot find namespace JSX' error by importing React types.
import type React from 'react';

export type Tab = 'mockup' | 'editor' | 'generator';

export type MockupCategory = 'Apparel' | 'Merchandise' | 'Print' | 'Signage';

export interface MockupOption {
  id: string;
  name: string;
  promptSuffix: string;
  icon: React.JSX.Element;
  category: MockupCategory;
}

export interface ImageData {
  base64: string;
  mimeType: string;
}
