
import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageData } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates or edits an image using a prompt and an optional input image.
 * Uses gemini-2.5-flash-image for image-aware generation.
 * @param prompt The text prompt.
 * @param image The optional input image data (base64 and mimeType).
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const generateWithImageInput = async (prompt: string, image: ImageData): Promise<string> => {
  try {
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
            text: prompt,
          },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
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
 * @returns A promise that resolves to the base64 string of the generated image.
 */
export const generateWithTextInput = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
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
