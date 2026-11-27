import { useEffect, useMemo, useState, type FC } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
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

const categoryAccentHexByTheme: Record<
  'dark' | 'light',
  Record<Exclude<SkillCategoryKey, 'all'>, string>
> = {
  dark: {
    iot: '#f3e6a2',
    linux: '#cfe0f2',
    dev: '#c6e3d1',
    security: '#eed2df',
  },
  light: {
    iot: '#725209',
    linux: '#2d5582',
    dev: '#166852',
    security: '#873258',
  },
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
  const [isActive, setIsActive] = useState(false);
  const { theme } = useTheme();
  const Icon = skillIconMap[skill.name] ?? LuCpu;
  const accentHex = categoryAccentHexByTheme[theme][skill.category];

  const iconDataUri = useMemo(() => {
    const markup = renderToStaticMarkup(
      <Icon
        color={accentHex}
        size={40}
        xmlns="http://www.w3.org/2000/svg"
      />,
    );
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  }, [Icon, accentHex]);

  const { ref: logoRef, reveal, hide } = useAsciiReveal({
    preset: logoTerminalPreset,
    duration: 'fast',
    speed: 0.9,
    origin: 'center',
    revealOnMount: false,
  });

  useEffect(() => {
    void hide({ instant: true });
  }, [hide]);

  const handleReveal = () => {
    setIsActive(true);
    void reveal({ origin: 'pointer' });
  };

  const handleHide = () => {
    setIsActive(false);
    void hide({ instant: true });
  };

  return (
    <div
      tabIndex={0}
      onMouseEnter={handleReveal}
      onMouseLeave={handleHide}
      onFocus={handleReveal}
      onBlur={handleHide}
      className="keycap group relative w-fit overflow-hidden px-3.5 py-2.5 text-left"
    >
      <div
        data-skill-grid-item=""
        data-ascii="surface"
        className={`min-w-0 transition-opacity duration-150 ${
          isActive ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="mb-0.5 flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${categoryAccentDot[skill.category]}`}
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] tracking-wider text-[var(--theme-ink-legend)]">
            {skill.legend}
          </span>
        </div>
        <div className="whitespace-nowrap font-sans text-xs font-semibold text-[var(--theme-ink-primary)] sm:text-sm">
          {skill.name}
        </div>
      </div>

      {/* Full-keycap ASCII reveal overlay showing the skill logo */}
      <div
        ref={logoRef}
        aria-hidden="true"
        style={{ color: accentHex }}
        className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-[9px] ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div
          data-ascii="surface"
          className="absolute inset-0 rounded-[9px] bg-[var(--theme-keycap)]"
        />
        <img
          src={iconDataUri}
          alt=""
          className="relative z-[1] h-9 w-9 shrink-0 object-contain"
        />
      </div>
    </div>
  );
};
