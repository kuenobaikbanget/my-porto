import { useEffect, useRef, useState } from 'react';

interface HyprPresenceResult<T> {
  isMounted: boolean;
  isClosing: boolean;
  displayValue: T | null;
}

const DEFAULT_EXIT_MS = 175;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Keeps a modal/runner mounted long enough to play its Hyprland pop-out
 * exit animation cleanly, even across rapid open/close toggles.
 */
export function useHyprPresence<T>(
  value: T | null | false | undefined,
  exitDurationMs = DEFAULT_EXIT_MS,
): HyprPresenceResult<T> {
  const isOpen = Boolean(value);
  const [cachedValue, setCachedValue] = useState<T | null>(
    value ? value : null,
  );
  const [isExiting, setIsExiting] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (value) {
      setCachedValue(value);
      setIsExiting(false);
      return;
    }

    if (!cachedValue) {
      return;
    }

    if (prefersReducedMotion()) {
      setCachedValue(null);
      setIsExiting(false);
      return;
    }

    setIsExiting(true);
    timerRef.current = window.setTimeout(() => {
      setCachedValue(null);
      setIsExiting(false);
      timerRef.current = null;
    }, exitDurationMs);

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [value, cachedValue, exitDurationMs]);

  if (isOpen && value) {
    return {
      isMounted: true,
      isClosing: false,
      displayValue: value,
    };
  }

  return {
    isMounted: Boolean(cachedValue),
    isClosing: isExiting || Boolean(cachedValue),
    displayValue: cachedValue,
  };
}
