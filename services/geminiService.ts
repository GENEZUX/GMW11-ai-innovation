
import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { MODELS } from "../constants";
import { AspectRatio, ImageSize } from "../types";

// Helper to get client with current key
const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// --- CHAT & GROUNDING ---

export interface ChatConfig {
  useSearch?: boolean;
  useMaps?: boolean;
  useThinking?: boolean;
  useFast?: boolean;
  userLocation?: { latitude: number; longitude: number };
  systemInstruction?: string;
}

export const sendMessage = async (message: string, history: any[], config: ChatConfig) => {
  const ai = getAiClient();
  
  let model = config.useFast ? MODELS.CHAT_FAST : MODELS.CHAT_BASIC;
  if (config.useThinking) model = MODELS.CHAT_COMPLEX;
  if (config.useSearch || config.useMaps) model = MODELS.CHAT_BASIC; // Grounding usually on Flash/Pro
  
  // Specific override for Thinking
  if (config.useThinking) {
     model = MODELS.CHAT_COMPLEX;
  }

  const toolConfig: any = {};
  const tools: any[] = [];

  if (config.useSearch) {
    tools.push({ googleSearch: {} });
  }

  if (config.useMaps) {
    tools.push({ googleMaps: {} });
    if (config.userLocation) {
      toolConfig.retrievalConfig = {
        latLng: config.userLocation
      };
    }
  }

  const generationConfig: any = {
      tools: tools.length > 0 ? tools : undefined,
      toolConfig: tools.length > 0 && config.useMaps ? toolConfig : undefined,
  };

  if (config.systemInstruction) {
    generationConfig.systemInstruction = config.systemInstruction;
  }

  if (config.useThinking) {
      generationConfig.thinkingConfig = { thinkingBudget: 32768 }; // Max for Pro
      // Explicitly do not set maxOutputTokens when thinking is enabled
  }

  const chat = ai.chats.create({
    model: model,
    history: history,
    config: generationConfig
  });

  const result = await chat.sendMessage({ message });
  return result;
};


// --- IMAGE GENERATION & EDITING ---

export const generateImage = async (prompt: string, aspectRatio: AspectRatio, size: ImageSize) => {
  // Check for key first for Pro features
  if (window.aistudio && await window.aistudio.hasSelectedApiKey() === false) {
      await window.aistudio.openSelectKey();
  }

  const ai = getAiClient();
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE_GEN,
    contents: { parts: [{ text: prompt }] },
    config: {
      imageConfig: {
        aspectRatio: aspectRatio,
        imageSize: size
      }
    }
  });
  return response;
};

export const editImage = async (imageBase64: string, prompt: string, mimeType: string = 'image/png') => {
  const ai = getAiClient();
  // Using gemini-2.5-flash-image for editing
  const response = await ai.models.generateContent({
    model: MODELS.IMAGE_EDIT, 
    contents: {
      parts: [
        {
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
  });
  return response;
};

// --- VIDEO GENERATION (VEO) ---

export const generateVideo = async (prompt: string, aspectRatio: string, image?: { data: string, mimeType: string }) => {
   // Veo requires Paid Key Selection
   if (window.aistudio) {
     const hasKey = await window.aistudio.hasSelectedApiKey();
     if (!hasKey) {
       await window.aistudio.openSelectKey();
     }
   }

   const ai = getAiClient();
   const request: any = {
     model: MODELS.VIDEO_GEN,
     config: {
       numberOfVideos: 1,
       resolution: '1080p', 
       aspectRatio: aspectRatio 
     }
   };

   // If image is provided, add it to request
   if (image) {
      request.image = {
        imageBytes: image.data,
        mimeType: image.mimeType
      };
   }

   // Prompt is technically optional if image provided in some contexts, 
   // but usually we pass it if available.
   if (prompt) {
     request.prompt = prompt;
   }

   let operation = await ai.models.generateVideos(request);

   // Poll for completion
   while (!operation.done) {
     await new Promise(resolve => setTimeout(resolve, 5000));
     operation = await ai.operations.getVideosOperation({ operation: operation });
   }
   
   // Fetch the video content
   if (operation.response?.generatedVideos?.[0]?.video?.uri) {
      const uri = operation.response.generatedVideos[0].video.uri;
      return `${uri}&key=${process.env.API_KEY}`;
   }
   throw new Error("Video generation failed or returned no URI");
};

// --- ANALYSIS & TTS ---

export const analyzeMedia = async (fileBase64: string, mimeType: string, prompt: string, isVideo: boolean = false) => {
  const ai = getAiClient();
  const model = isVideo ? MODELS.VIDEO_UNDERSTANDING : MODELS.CHAT_COMPLEX;
  
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            data: fileBase64,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
  });
  return response.text;
};

export const transcribeAudio = async (audioBase64: string) => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: MODELS.AUDIO_TRANSCRIPTION,
        contents: {
            parts: [
                { inlineData: { data: audioBase64, mimeType: 'audio/wav' } },
                { text: "Transcribe this audio." }
            ]
        }
    });
    return response.text;
}

export const generateSpeech = async (text: string) => {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
        model: MODELS.TTS,
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                },
            },
        },
    });
    
    // Extract base64
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}