import { createContext } from 'react';

export type ThemeId = 'digital-nightmares' | 'analog-dreams';

export interface WipeOrigin {
  x: number;
  y: number;
}

export interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (nextTheme: ThemeId, origin?: WipeOrigin) => void;
  toggleTheme: (origin?: WipeOrigin) => void;
}

export const THEME_STORAGE_KEY = 'kueno-theme';

export const ThemeContext = createContext<ThemeContextValue | null>(null);
