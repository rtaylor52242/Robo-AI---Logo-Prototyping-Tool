// Fix: Resolve 'Cannot find namespace JSX' error by importing React types.
import type React from 'react';

export type Tab = 'mockup' | 'editor' | 'generator';

export interface MockupOption {
  id: string;
  name: string;
  promptSuffix: string;
  icon: React.JSX.Element;
}

export interface ImageData {
  base64: string;
  mimeType: string;
}
