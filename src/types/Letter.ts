export interface Letter {
  id: string;
  title: string;
  label: string;
  content: string;
  emoji: string;
  timestamp: Date;
  isSealed: boolean;
  scheduledFor?: Date;
  isLocked?: boolean;
  isFavorite?: boolean;
  canUndo?: boolean;
  undoExpiresAt?: Date;
}

export type EmojiSeal = '❤️' | '✨' | '🌸' | '🌀' | '🫧';

export const EMOJI_SEALS: EmojiSeal[] = ['❤️', '✨', '🌸', '🌀', '🫧'];

export type ThemeMode = 'light' | 'dark' | 'sync';

export interface UserSettings {
  themeMode: ThemeMode;
  timeFormat: '12h' | '24h';
  soundscapeVolume: number;
  onboardingCompleted: boolean;
}