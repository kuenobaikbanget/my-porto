import { useEffect, useMemo, useState, type FC, type ReactNode } from 'react';
import { prefetchAsciiReveal } from '../utils/lazyAsciiReveal';
import { IntroContext, type IntroPhase } from './introContextDef';

const INTRO_DURATION_MS = 1050;

function getInitialIntroPhase(): IntroPhase {
  if (typeof document !== 'undefined' && document.documentElement.dataset.intro === 'play') {
    return 'play';
  }
  return 'done';
}

export const IntroProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [introPhase, setIntroPhase] = useState<IntroPhase>(getInitialIntroPhase);

  useEffect(() => {
    if (introPhase !== 'play') return;

    prefetchAsciiReveal();

    const timer = window.setTimeout(() => {
      document.documentElement.dataset.intro = 'done';
      setIntroPhase('done');
    }, INTRO_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [introPhase]);

  const contextValue = useMemo(
    () => ({
      introPhase,
      isIntroActive: introPhase === 'play',
    }),
    [introPhase],
  );

  return <IntroContext.Provider value={contextValue}>{children}</IntroContext.Provider>;
};
