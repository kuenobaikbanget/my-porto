import { useCallback, useEffect, useState, type FC, type ReactNode } from 'react';
import { flushSync } from 'react-dom';
import {
  THEME_STORAGE_KEY,
  ThemeContext,
  type ThemeId,
  type WipeOrigin,
} from './themeContextDef';

function normalizeStoredTheme(value: unknown): ThemeId | null {
  if (value === 'dark' || value === 'light') return value;
  if (typeof value === 'string' && value.startsWith('analog')) return 'light';
  if (typeof value === 'string' && value.startsWith('digital')) return 'dark';
  return null;
}

function getInitialTheme(): ThemeId {
  if (typeof document !== 'undefined') {
    const fromAttr = normalizeStoredTheme(document.documentElement.dataset.theme);
    if (fromAttr) return fromAttr;
  }
  if (typeof window !== 'undefined') {
    try {
      const stored = normalizeStoredTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
      if (stored) return stored;
    } catch {
      // Ignore storage access errors
    }
  }
  return 'dark';
}

function applyThemeToDocument(theme: ThemeId): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;

  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'light' ? '#f3efe7' : '#170e1f');
  }
}

export const ThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeId>(getInitialTheme);

  useEffect(() => {
    applyThemeToDocument(theme);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore storage write errors
    }
  }, [theme]);

  const setTheme = useCallback(
    (nextTheme: ThemeId, origin?: WipeOrigin) => {
      if (nextTheme === theme) return;

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const supportsViewTransition =
        typeof document !== 'undefined' &&
        typeof (document as Document & { startViewTransition?: unknown }).startViewTransition ===
          'function';

      if (!supportsViewTransition || prefersReducedMotion) {
        applyThemeToDocument(nextTheme);
        setThemeState(nextTheme);
        return;
      }

      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      const maxRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      const docWithTransition = document as Document & {
        startViewTransition: (update: () => void) => {
          ready: Promise<void>;
        };
      };

      const transition = docWithTransition.startViewTransition(() => {
        flushSync(() => {
          setThemeState(nextTheme);
        });
        applyThemeToDocument(nextTheme);
      });

      transition.ready
        .then(() => {
          document.documentElement.animate(
            {
              clipPath: [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${maxRadius}px at ${x}px ${y}px)`,
              ],
            },
            {
              duration: 480,
              easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
              pseudoElement: '::view-transition-new(root)',
            },
          );
        })
        .catch(() => {
          // Graceful no-op if transition is aborted
        });
    },
    [theme],
  );

  const toggleTheme = useCallback(
    (origin?: WipeOrigin) => {
      setTheme(theme === 'dark' ? 'light' : 'dark', origin);
    },
    [setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
