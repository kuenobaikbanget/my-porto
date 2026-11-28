import { useCallback, useEffect, useRef } from 'react';
import type { AsciiRevealController, AsciiRevealOptions, RunOptions } from 'ascii-reveal';

type AsciiRevealModule = typeof import('ascii-reveal');

let modulePromise: Promise<AsciiRevealModule> | null = null;

export function loadAsciiReveal(): Promise<AsciiRevealModule> {
  if (!modulePromise) {
    modulePromise = import('ascii-reveal');
  }
  return modulePromise;
}

export function prefetchAsciiReveal(): void {
  void loadAsciiReveal();
}

export interface LazyAsciiRevealOptions extends Omit<AsciiRevealOptions, 'preset'> {
  preset?: AsciiRevealOptions['preset'] | 'logo-terminal';
}

export function useLazyAsciiReveal<T extends HTMLElement = HTMLDivElement>(
  options: LazyAsciiRevealOptions,
) {
  const elementRef = useRef<T | null>(null);
  const controllerRef = useRef<AsciiRevealController | null>(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const destroyController = useCallback(() => {
    controllerRef.current?.destroy();
    controllerRef.current = null;
  }, []);

  const ref = useCallback(
    (node: T | null) => {
      if (elementRef.current !== node) {
        destroyController();
        elementRef.current = node;
      }
    },
    [destroyController],
  );

  useEffect(() => destroyController, [destroyController]);

  const ensureController = useCallback(async (): Promise<AsciiRevealController | null> => {
    const el = elementRef.current;
    if (!el || !el.isConnected) return null;

    if (controllerRef.current) {
      return controllerRef.current;
    }

    const mod = await loadAsciiReveal();
    // Re-check after async import in case the element unmounted
    if (elementRef.current !== el || !el.isConnected) return null;

    if (controllerRef.current) {
      return controllerRef.current;
    }

    const { preset, ...rest } = optionsRef.current;
    const resolvedPreset =
      preset === 'logo-terminal'
        ? {
            ...mod.presets.terminal,
            color: 'source' as const,
            cells: [18, 14, 10, 8],
          }
        : preset;

    const ctrl = mod.createAsciiReveal(el, {
      ...rest,
      preset: resolvedPreset,
    });
    controllerRef.current = ctrl;
    return ctrl;
  }, []);

  const reveal = useCallback(
    async (runOpts?: RunOptions) => {
      const ctrl = await ensureController();
      if (!ctrl) return;
      return ctrl.reveal(runOpts);
    },
    [ensureController],
  );

  const hide = useCallback(
    async (runOpts?: RunOptions) => {
      const ctrl = await ensureController();
      if (!ctrl) return;
      return ctrl.hide(runOpts);
    },
    [ensureController],
  );

  return { ref, reveal, hide };
}
