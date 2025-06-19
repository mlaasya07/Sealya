export interface Letter {
  id: string;
  title: string;
  label: string;
  content: string;
  emoji: string;
  timestamp: Date;
  isSealed: boolean;
}

export type EmojiSeal = '❤️' | '✨' | '🌸' | '🌀' | '🫧';

export const EMOJI_SEALS: EmojiSeal[] = ['❤️', '✨', '🌸', '🌀', '🫧'];