
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageData } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Helper to map custom/unsupported ratios to the closest standard API ratios
// The API strictly supports: "1:1", "3:4", "4:3", "9:16", "16:9"
const mapToStandardRatio = (ratio: string): string => {
    if (ratio === 'Custom') return '1:1';
    
    const standardRatios = ['1:1', '3:4', '4:3', '9:16', '16:9'];
    if (standardRatios.includes(ratio)) return ratio;

    // Parse ratio
    const [w, h] = ratio.split(':').map(Number);
    if (!w || !h) return '1:1';
    
    const targetVal = w / h;
    
    // Find closest standard ratio
    let closest = '1:1';
    let minDiff = Number.MAX_VALUE;

    for (const r of standardRatios) {
        const [sw, sh] = r.split(':').map(Number);
        const val = sw / sh;
        const diff = Math.abs(targetVal - val);
        if (diff < minDiff) {
            minDiff = diff;
            closest = r;
        }
    }
    return closest;
};

/**
 * Generates or edits an image using a prompt and an optional input image.
 * Uses gemini-2.5-flash-image for image-aware generation.
 * @param prompt The text prompt.
 * @param image The optional input image data (base64 and mimeType).
 * @param aspectRatio The desired aspect ratio.
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const generateWithImageInput = async (prompt: string, image: ImageData, aspectRatio: string = '1:1'): Promise<string> => {
  try {
    const configRatio = mapToStandardRatio(aspectRatio);
    // Append the specific requested ratio to the prompt if it's not a standard one, 
    // to encourage the model to frame the subject accordingly within the standard container.
    const finalPrompt = aspectRatio !== configRatio 
        ? `${prompt} (Aspect Ratio: ${aspectRatio})` 
        : prompt;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: image.base64,
              mimeType: image.mimeType,
            },
          },
          {
            text: finalPrompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
          imageConfig: {
              aspectRatio: configRatio, 
          }
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && 'inlineData' in firstPart && firstPart.inlineData) {
      return firstPart.inlineData.data;
    }
    throw new Error("No image data found in the API response.");
  } catch (error) {
    console.error("Error generating with image input:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};

/**
 * Generates an image using a text prompt only.
 * Uses imagen-4.0-generate-001 for high-quality text-to-image generation.
 * @param prompt The text prompt.
 * @param aspectRatio The desired aspect ratio.
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const generateWithTextInput = async (prompt: string, aspectRatio: string = '1:1'): Promise<string> => {
  try {
    // Imagen 3/4 allows specific aspect ratios in configuration
    const configRatio = mapToStandardRatio(aspectRatio);

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: configRatio,
        outputMimeType: 'image/png',
      },
    });

    const generatedImage = response.generatedImages?.[0]?.image?.imageBytes;
    if (generatedImage) {
      return generatedImage;
    }
    throw new Error("No image data found in the API response.");
  } catch (error) {
    console.error("Error generating with text input:", error);
    throw new Error("Failed to generate image. Please check the console for details.");
  }
};
