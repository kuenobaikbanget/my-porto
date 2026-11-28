import { useContext } from 'react';
import { IntroContext, type IntroContextValue } from './introContextDef';

export function useIntro(): IntroContextValue {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    throw new Error('useIntro must be used within an IntroProvider');
  }
  return ctx;
}
