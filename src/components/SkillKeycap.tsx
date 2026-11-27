import { useEffect, useRef, useState, type FC, type FocusEvent, type PointerEvent } from 'react';
import { type IconType } from 'react-icons';
import { FaJava } from 'react-icons/fa6';
import {
  LuActivity,
  LuCpu,
  LuDatabaseZap,
  LuFolderSearch,
  LuNetwork,
  LuRadar,
} from 'react-icons/lu';
import {
  SiAlmalinux,
  SiArduino,
  SiBun,
  SiDocker,
  SiEspressif,
  SiFedora,
  SiGit,
  SiGo,
  SiKotlin,
  SiMikrotik,
  SiPostgresql,
  SiReact,
  SiSqlite,
  SiTailwindcss,
  SiTypescript,
  SiUbiquiti,
  SiUbuntu,
  SiWireshark,
} from 'react-icons/si';
import { presets, useAsciiReveal } from 'ascii-reveal';
import { useTheme } from '../context/useTheme';
import type { SkillCategoryKey, SkillItem } from '../data/skills';

const categoryAccentDot: Record<Exclude<SkillCategoryKey, 'all'>, string> = {
  iot: 'bg-[var(--theme-accent-butter-dot)]',
  linux: 'bg-[var(--theme-accent-sky-dot)]',
  dev: 'bg-[var(--theme-accent-mint-dot)]',
  security: 'bg-[var(--theme-accent-pink-dot)]',
};

const categoryAccentCssVar: Record<Exclude<SkillCategoryKey, 'all'>, string> = {
  iot: '--theme-accent-butter',
  linux: '--theme-accent-sky',
  dev: '--theme-accent-mint',
  security: '--theme-accent-pink',
};

const logoTerminalPreset = {
  ...presets.terminal,
  color: 'source' as const,
  cells: [18, 14, 10, 8],
};

const CachyOSIcon: IconType = ({ size = '1em', color, style, ...props }) => (
  <svg
    viewBox="0 0 512 512"
    width={size}
    height={size}
    fill="none"
    role="img"
    aria-label="CachyOS"
    style={{ color, ...style }}
    {...props}
  >
    <path
      d="m109 66.1 181.4 101.7 58.2-100.7zm57.5 282.8-52.6 103.3H350l59.6-103.3z"
      fill="currentColor"
      fillOpacity="0.72"
    />
    <path
      d="m109 66.1 181.4 101.7H165.8l-51.9 89.9 52.6 91.2-52.6 103.3L0 255zm57.5 282.8 183.4 103.3 59.6-103.3zm266.6-38.6a39.2 39.2 0 1078.4 0 39.2 39.2 0 10-78.4 0M342 227.8a29.8 29.8 0 1059.6 0 29.8 29.8 0 10-59.6 0m54.7-114.9a15.3 15.3 0 1030.6 0 15.3 15.3 0 10-30.6 0"
      fill="currentColor"
    />
    <path
      d="m165.8 167.8 182.8-100.7-58.2 100.7zM0 255l165.8-87.1-51.9 89.9z"
      fill="currentColor"
      fillOpacity="0.72"
    />
    <path
      d="m165.8 167.8L109 66.1l4.9 191.6zm-51.9 90-87 43.6 86.9 150.9z"
      fill="currentColor"
      fillOpacity="0.72"
    />
    <path
      d="m26.9 301.4 139.6 47.6-52.6-91.2z"
      fill="currentColor"
      fillOpacity="0.72"
    />
  </svg>
);

const skillIconMap: Record<string, IconType> = {
  Arduino: SiArduino,
  ESP32: SiEspressif,
  'Sensor Interfacing': LuActivity,
  'PC & Laptop Assembly': LuCpu,
  Ubuntu: SiUbuntu,
  AlmaLinux: SiAlmalinux,
  Fedora: SiFedora,
  CachyOS: CachyOSIcon,
  Docker: SiDocker,
  UniFi: SiUbiquiti,
  Mikrotik: SiMikrotik,
  'DHCP & DNS': LuNetwork,
  TypeScript: SiTypescript,
  Go: SiGo,
  Kotlin: SiKotlin,
  Java: FaJava,
  React: SiReact,
  'Tailwind CSS': SiTailwindcss,
  SQLite: SiSqlite,
  PostgreSQL: SiPostgresql,
  Bun: SiBun,
  Nmap: LuRadar,
  Wireshark: SiWireshark,
  SQLMap: LuDatabaseZap,
  Gobuster: LuFolderSearch,
  Git: SiGit,
};

interface SkillKeycapProps {
  skill: SkillItem;
}

export const SkillKeycap: FC<SkillKeycapProps> = ({ skill }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isOverlayMounted, setIsOverlayMounted] = useState(false);
  const [iconDataUri, setIconDataUri] = useState<string | null>(null);
  const [accentColor, setAccentColor] = useState<string>('');

  const { theme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const svgHostRef = useRef<HTMLSpanElement | null>(null);
  const revealOriginRef = useRef<'pointer' | 'center'>('center');
  const isFirstRenderRef = useRef(true);
  const logoLoadedRef = useRef(false);
  const isOverlayMountedRef = useRef(isOverlayMounted);
  isOverlayMountedRef.current = isOverlayMounted;
  const iconDataUriRef = useRef(iconDataUri);
  iconDataUriRef.current = iconDataUri;
  const isActive = isHovered || isFocused || isPinned;
  const isActiveRef = useRef(isActive);
  isActiveRef.current = isActive;

  const Icon = skillIconMap[skill.name] ?? LuCpu;
  const cssVarName = categoryAccentCssVar[skill.category];

  const {
    ref: labelRef,
    reveal: revealLabel,
    hide: hideLabel,
  } = useAsciiReveal({
    preset: 'terminal',
    duration: 'fast',
    speed: 0.9,
    origin: 'center',
    revealOnMount: false,
  });

  const {
    ref: logoRef,
    reveal: revealLogo,
    hide: hideLogo,
  } = useAsciiReveal({
    preset: logoTerminalPreset,
    duration: 'fast',
    speed: 0.9,
    origin: 'center',
    revealOnMount: false,
  });

  // Animate text container and logo overlay with ASCII reveal/hide transitions.
  // Only re-runs when `isActive` actually changes so each animation fires once.
  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false;
      if (!isActive) return;
    }

    const origin = revealOriginRef.current;

    if (!isActive) {
      void revealLabel({ origin });
      if (isOverlayMountedRef.current) {
        void hideLogo({ origin }).then(() => {
          if (!isActiveRef.current) {
            setIsOverlayMounted(false);
            logoLoadedRef.current = false;
            setIconDataUri(null);
          }
        });
      }
      return;
    }

    setIsOverlayMounted(true);
    void hideLabel({ origin });

    if (logoLoadedRef.current && iconDataUriRef.current) {
      void revealLogo({ origin });
    }
  }, [isActive, hideLabel, revealLabel, hideLogo, revealLogo]);

  // Serialize the icon SVG lazily on demand using live CSS theme tokens.
  useEffect(() => {
    if (!isOverlayMounted || !isActive) return;

    const host = svgHostRef.current;
    const btn = buttonRef.current;
    if (!host || !btn) return;

    const svgEl = host.querySelector('svg');
    if (!svgEl) return;

    const resolvedColor =
      getComputedStyle(btn).getPropertyValue(cssVarName).trim() || '#f3edf7';
    setAccentColor(resolvedColor);

    const clone = svgEl.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    clone.setAttribute('width', '40');
    clone.setAttribute('height', '40');
    clone.style.color = resolvedColor;

    const serialized = new XMLSerializer().serializeToString(clone);
    const nextUri = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;
    if (nextUri !== iconDataUriRef.current) {
      logoLoadedRef.current = false;
      setIconDataUri(nextUri);
    }
  }, [isOverlayMounted, isActive, theme, cssVarName]);

  useEffect(() => {
    if (!isPinned) return;
    const handleOutsidePointerDown = (event: globalThis.PointerEvent) => {
      const target = event.target as Node | null;
      if (buttonRef.current && target && !buttonRef.current.contains(target)) {
        setIsPinned(false);
      }
    };
    document.addEventListener('pointerdown', handleOutsidePointerDown);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown);
  }, [isPinned]);

  const handlePointerEnter = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') {
      revealOriginRef.current = 'pointer';
      setIsHovered(true);
    }
  };

  const handlePointerLeave = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === 'mouse') {
      setIsHovered(false);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    if (event.currentTarget.matches(':focus-visible')) {
      revealOriginRef.current = 'center';
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    setIsPinned(false);
  };

  const handleClick = () => {
    revealOriginRef.current = 'pointer';
    setIsPinned((prev) => !prev);
  };

  const handleImageLoad = () => {
    logoLoadedRef.current = true;
    if (isActiveRef.current) {
      void revealLogo({ origin: revealOriginRef.current });
    }
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      data-skill-grid-item=""
      data-ascii="surface"
      aria-pressed={isPinned}
      aria-label={`${skill.name} (${skill.legend}) — ${isActive ? 'hide' : 'reveal'} logo`}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClick={handleClick}
      className="keycap group relative min-h-[44px] w-fit max-w-full overflow-hidden px-3.5 py-2 text-left"
    >
      <div ref={labelRef} className="relative min-w-0">
        <div className="mb-0.5 flex items-center gap-1.5">
          <span
            data-ascii="fade"
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${categoryAccentDot[skill.category]}`}
            aria-hidden="true"
          />
          <span className="font-mono text-[11px] tracking-wider text-[var(--theme-ink-legend)]">
            {skill.legend}
          </span>
        </div>
        <div className="font-sans text-xs font-semibold text-[var(--theme-ink-primary)] sm:text-sm">
          {skill.name}
        </div>
      </div>

      {/* On-demand icon SVG host + ASCII reveal overlay (mounted while active or hiding) */}
      {isOverlayMounted ? (
        <>
          <span ref={svgHostRef} className="hidden" aria-hidden="true">
            <Icon size={40} />
          </span>
          <div
            ref={logoRef}
            aria-hidden="true"
            style={{ color: accentColor || `var(${cssVarName})` }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[9px]"
          >
            {iconDataUri ? (
              <img
                src={iconDataUri}
                alt=""
                onLoad={handleImageLoad}
                className="relative z-[1] h-9 w-9 shrink-0 object-contain"
              />
            ) : null}
          </div>
        </>
      ) : null}
    </button>
  );
};
