import { createContext } from 'react';

export type IntroPhase = 'play' | 'done';

export interface IntroContextValue {
  introPhase: IntroPhase;
  isIntroActive: boolean;
}

export const IntroContext = createContext<IntroContextValue | null>(null);
