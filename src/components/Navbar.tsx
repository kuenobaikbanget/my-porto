import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type MouseEvent,
} from 'react';
import { LuCommand, LuMenu, LuMoon, LuSun, LuX } from 'react-icons/lu';
import { useTheme } from '../context/useTheme';
import { profileData } from '../data/profile';
import { LogoMark } from './LogoMark';

const navLinks = [
  { id: 'activity', label: 'Activity' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Toolbox' },
  { id: 'hobbies', label: 'Bench' },
  { id: 'contact', label: 'Contact' },
] as const;

interface NavbarProps {
  onOpenPalette: () => void;
}

interface PillRect {
  x: number;
  width: number;
}

interface SpringState {
  x: number;
  vx: number;
  width: number;
  vw: number;
  targetX: number;
  targetWidth: number;
  initialized: boolean;
}

export const Navbar: FC<NavbarProps> = ({ onOpenPalette }) => {
  const [activeId, setActiveId] = useState<string>('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoverRect, setHoverRect] = useState<PillRect | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const railRef = useRef<HTMLElement | null>(null);
  const stabilizerRef = useRef<HTMLDivElement | null>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const rafRef = useRef<number | null>(null);
  const scrollLockRef = useRef<string | null>(null);
  const scrollLockTimerRef = useRef<number | null>(null);
  const springRef = useRef<SpringState>({
    x: 0,
    vx: 0,
    width: 0,
    vw: 0,
    targetX: 0,
    targetWidth: 0,
    initialized: false,
  });

  const isLight = theme === 'light';
  const hasActiveNav = navLinks.some((link) => link.id === activeId);

  const measureLink = useCallback((id: string): PillRect | null => {
    const rail = railRef.current;
    const el = linkRefs.current[id];
    if (!rail || !el) return null;
    const railRect = rail.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    if (elRect.width === 0) return null;
    return {
      x: elRect.left - railRect.left,
      width: elRect.width,
    };
  }, []);

  const applyStabilizerTransform = useCallback(
    (x: number, width: number, velocityX: number) => {
      const node = stabilizerRef.current;
      if (!node) return;
      const stretch = Math.min(Math.abs(velocityX) * 0.00014, 0.05);
      node.style.width = `${width}px`;
      node.style.transform = `translate3d(${x}px, 0, 0) scaleX(${1 + stretch})`;
    },
    [],
  );

  const animateStabilizerTo = useCallback(
    (target: PillRect, immediate = false) => {
      const state = springRef.current;
      const reduceMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      state.targetX = target.x;
      state.targetWidth = target.width;

      if (!state.initialized || immediate || reduceMotion) {
        state.x = target.x;
        state.width = target.width;
        state.vx = 0;
        state.vw = 0;
        state.initialized = true;
        applyStabilizerTransform(state.x, state.width, 0);
        return;
      }

      if (rafRef.current !== null) return;

      let lastTime = performance.now();
      const stiffness = 380;
      const damping = 36;

      const tick = (now: number) => {
        const dt = Math.min((now - lastTime) / 1000, 0.032);
        lastTime = now;

        const dx = state.targetX - state.x;
        const dw = state.targetWidth - state.width;

        const ax = stiffness * dx - damping * state.vx;
        const aw = stiffness * dw - damping * state.vw;

        state.vx += ax * dt;
        state.vw += aw * dt;
        state.x += state.vx * dt;
        state.width += state.vw * dt;

        const settled =
          Math.abs(dx) < 0.2 &&
          Math.abs(dw) < 0.2 &&
          Math.abs(state.vx) < 0.5 &&
          Math.abs(state.vw) < 0.5;

        if (settled) {
          state.x = state.targetX;
          state.width = state.targetWidth;
          state.vx = 0;
          state.vw = 0;
          applyStabilizerTransform(state.x, state.width, 0);
          rafRef.current = null;
          return;
        }

        applyStabilizerTransform(state.x, state.width, state.vx);
        rafRef.current = window.requestAnimationFrame(tick);
      };

      rafRef.current = window.requestAnimationFrame(tick);
    },
    [applyStabilizerTransform],
  );

  const lockActiveTo = useCallback((id: string) => {
    scrollLockRef.current = id;
    setActiveId(id);

    if (scrollLockTimerRef.current !== null) {
      window.clearTimeout(scrollLockTimerRef.current);
    }

    const releaseLock = () => {
      scrollLockRef.current = null;
      if (scrollLockTimerRef.current !== null) {
        window.clearTimeout(scrollLockTimerRef.current);
        scrollLockTimerRef.current = null;
      }
      window.removeEventListener('scrollend', releaseLock);
    };

    window.addEventListener('scrollend', releaseLock, { once: true });
    scrollLockTimerRef.current = window.setTimeout(releaseLock, 850);
  }, []);

  useEffect(() => {
    if (!hasActiveNav) return;
    const rect = measureLink(activeId);
    if (rect) {
      animateStabilizerTo(rect);
    }
  }, [activeId, hasActiveNav, measureLink, animateStabilizerTo]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (!navLinks.some((link) => link.id === activeId)) return;
      const rect = measureLink(activeId);
      if (rect) {
        animateStabilizerTo(rect, true);
      }
    });

    observer.observe(rail);
    return () => observer.disconnect();
  }, [activeId, measureLink, animateStabilizerTo]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) window.cancelAnimationFrame(rafRef.current);
      if (scrollLockTimerRef.current !== null) {
        window.clearTimeout(scrollLockTimerRef.current);
      }
    };
  }, []);

  // Deterministic scroll-spy that respects click-lock and reliably reaches Contact at page bottom
  useEffect(() => {
    const sectionIds = ['hero', ...navLinks.map((l) => l.id)];
    const supportsScrollTimeline =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline: scroll()');

    let frameId: number | null = null;

    const syncFromScroll = () => {
      frameId = null;

      const docEl = document.documentElement;
      const maxScroll = Math.max(docEl.scrollHeight - window.innerHeight, 0);

      if (!supportsScrollTimeline) {
        setScrollProgress(maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0);
      }

      if (scrollLockRef.current !== null) {
        return;
      }

      if (window.scrollY <= 40) {
        setActiveId('hero');
        return;
      }

      if (maxScroll > 0 && window.scrollY >= maxScroll - 24) {
        setActiveId(navLinks[navLinks.length - 1].id);
        return;
      }

      const activationLine = Math.max(120, window.innerHeight * 0.32);
      let current = 'hero';

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= activationLine) {
          current = id;
        }
      }

      setActiveId(current);
    };

    const onScroll = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(syncFromScroll);
      }
    };

    // Release click-lock early if user manually interrupts scroll with wheel/touch
    const releaseLockOnManualInput = () => {
      if (scrollLockRef.current !== null) {
        scrollLockRef.current = null;
        if (scrollLockTimerRef.current !== null) {
          window.clearTimeout(scrollLockTimerRef.current);
          scrollLockTimerRef.current = null;
        }
      }
    };

    syncFromScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('wheel', releaseLockOnManualInput, { passive: true });
    window.addEventListener('touchstart', releaseLockOnManualInput, { passive: true });

    return () => {
      if (frameId !== null) window.cancelAnimationFrame(frameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('wheel', releaseLockOnManualInput);
      window.removeEventListener('touchstart', releaseLockOnManualInput);
    };
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleToggleTheme = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hasPointerCoords = event.clientX !== 0 || event.clientY !== 0;
    toggleTheme({
      x: hasPointerCoords ? event.clientX : rect.left + rect.width / 2,
      y: hasPointerCoords ? event.clientY : rect.top + rect.height / 2,
    });
  };

  const handleLinkMouseMove = (event: MouseEvent<HTMLAnchorElement>) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--mag-x', `${(relX * 3.5).toFixed(2)}px`);
    el.style.setProperty('--mag-y', `${(relY * 2).toFixed(2)}px`);
  };

  const handleLinkMouseLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--mag-x', '0px');
    event.currentTarget.style.setProperty('--mag-y', '0px');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--theme-border)] bg-[var(--theme-header-bg)] backdrop-blur-md">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between gap-2 px-4 py-2 sm:gap-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <a
            href="#hero"
            onClick={() => lockActiveTo('hero')}
            className="keycap flex min-h-[44px] min-w-[44px] shrink-0 items-center gap-2 px-3 py-2 text-xs tracking-wide text-[var(--theme-ink-primary)] no-underline sm:min-h-[38px] sm:py-1.5"
          >
            <LogoMark className="h-4 w-4 shrink-0 text-[var(--theme-ink-primary)]" />
            <span className="font-semibold text-[var(--theme-accent-pink)]">
              {profileData.handle}
            </span>
          </a>

          {/* Windowed LED status badge */}
          <div
            className="recessed-well hidden min-w-0 items-center gap-2 rounded-full px-3 py-1 xl:inline-flex xl:max-w-[240px] 2xl:max-w-[300px]"
            title={profileData.statusLabel}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-[var(--theme-accent-mint-dot)] ring-2 ring-[var(--theme-accent-mint-border)]"
              aria-hidden="true"
            />
            <span className="truncate font-mono text-[11px] font-medium text-[var(--theme-accent-mint)]">
              {profileData.statusLabel}
            </span>
          </div>
        </div>

        {/* Recessed Mechanical Switch Rail with Spring Stabilizer & Scroll LED */}
        <nav
          ref={railRef}
          className="switch-rail hidden shrink-0 md:inline-flex"
          aria-label="Primary navigation"
          onMouseLeave={() => setHoverRect(null)}
        >
          {/* Hover preview plate */}
          <div
            aria-hidden="true"
            className="switch-hover-pill"
            style={{
              opacity: hoverRect ? 1 : 0,
              width: hoverRect ? `${hoverRect.width}px` : '0px',
              transform: hoverRect
                ? `translate3d(${hoverRect.x}px, 0, 0)`
                : 'translate3d(0, 0, 0)',
            }}
          />

          {/* Spring-physics active stabilizer */}
          <div
            ref={stabilizerRef}
            aria-hidden="true"
            className="switch-stabilizer"
            style={{
              opacity: hasActiveNav ? 1 : 0,
            }}
          />

          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                ref={(node) => {
                  linkRefs.current[link.id] = node;
                }}
                href={`#${link.id}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={() => lockActiveTo(link.id)}
                onMouseEnter={() => {
                  const rect = measureLink(link.id);
                  if (rect) setHoverRect(rect);
                }}
                onMouseMove={handleLinkMouseMove}
                onMouseLeave={handleLinkMouseLeave}
                className={`switch-key lg:px-3 ${
                  isActive
                    ? 'text-[var(--theme-accent-butter)]'
                    : 'text-[var(--theme-ink-muted)] hover:text-[var(--theme-ink-primary)]'
                }`}
              >
                <span>{link.label}</span>
              </a>
            );
          })}

          {/* Scroll-driven LED progress filament */}
          <div className="switch-rail-led-track" aria-hidden="true">
            <div
              className="switch-rail-led-fill"
              style={{ '--scroll-progress': scrollProgress } as React.CSSProperties}
            />
          </div>
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleToggleTheme}
            aria-label={isLight ? 'Switch theme to Dark' : 'Switch theme to Light'}
            title={
              isLight ? 'Theme: Light — Click for Dark' : 'Theme: Dark — Click for Light'
            }
            className="keycap min-h-[44px] min-w-[44px] px-3 py-2 text-xs text-[var(--theme-ink-primary)] sm:min-h-[38px] sm:px-2.5 sm:py-1.5"
          >
            {isLight ? (
              <LuSun
                className="h-3.5 w-3.5 text-[var(--theme-accent-butter)]"
                aria-hidden="true"
              />
            ) : (
              <LuMoon
                className="h-3.5 w-3.5 text-[var(--theme-accent-pink)]"
                aria-hidden="true"
              />
            )}
            <span>{isLight ? 'Light' : 'Dark'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open terminal command palette (Ctrl+K or Cmd+K)"
            title="Command Palette (⌘K / Ctrl+K)"
            className="keycap min-h-[44px] min-w-[44px] px-3 py-2 text-xs text-[var(--theme-accent-mint)] sm:min-h-[38px] sm:px-2.5 sm:py-1.5"
          >
            <LuCommand className="h-3.5 w-3.5" aria-hidden="true" />
            <span>K</span>
          </button>

          <button
            type="button"
            className="keycap min-h-[44px] min-w-[44px] p-2.5 text-[var(--theme-ink-primary)] md:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <LuX className="h-4 w-4" aria-hidden="true" /> : <LuMenu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          className="border-t border-[var(--theme-border)] bg-[var(--theme-housing)] px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="recessed-well mb-3 flex items-center gap-2 rounded-lg px-3 py-2 font-mono text-[11px] text-[var(--theme-accent-mint)]">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-[var(--theme-accent-mint-dot)]"
              aria-hidden="true"
            />
            <span>{profileData.statusLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const isActive = activeId === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  aria-current={isActive ? 'location' : undefined}
                  onClick={() => {
                    lockActiveTo(link.id);
                    setMenuOpen(false);
                  }}
                  className={`keycap min-h-[44px] px-3 py-2.5 text-xs no-underline ${
                    isActive
                      ? 'border-[var(--theme-ink-legend)] bg-[var(--theme-keycap-active)] text-[var(--theme-accent-butter)]'
                      : 'text-[var(--theme-ink-primary)]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </nav>
      ) : null}
    </header>
  );
};
