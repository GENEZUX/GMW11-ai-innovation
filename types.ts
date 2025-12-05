

export enum AppMode {
  CHAT = 'CHAT',
  LIVE = 'LIVE',
  GENERATE_IMAGE = 'GENERATE_IMAGE',
  GENERATE_VIDEO = 'GENERATE_VIDEO',
  ANALYZE = 'ANALYZE',
  TTS = 'TTS',
  SINGULARITY = 'SINGULARITY',
  AI_FORGE = 'AI_FORGE',
  CAMPAIGN_MANAGER = 'CAMPAIGN_MANAGER'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  groundingUrls?: Array<{ title: string; uri: string; source: 'search' | 'maps' }>;
}

export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  WIDE = '21:9',
  STANDARD = '4:3',
  ALT_STANDARD = '3:4'
}

export enum ImageSize {
  ONE_K = '1K',
  TWO_K = '2K',
  FOUR_K = '4K'
}

// Augment window for AudioContext and AIStudio
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
    // aistudio is defined in the environment with type AIStudio.
    // We define/augment the AIStudio interface below to ensure it has the required methods.
  }

  interface AIStudio {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
  }
}