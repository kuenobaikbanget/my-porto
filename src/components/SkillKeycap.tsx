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
  SiArchlinux,
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
import type { SkillCategoryKey, SkillItem } from '../data/skills';

const categoryAccentDot: Record<Exclude<SkillCategoryKey, 'all'>, string> = {
  iot: 'bg-[#f3e6a2]',
  linux: 'bg-[#cfe0f2]',
  dev: 'bg-[#c6e3d1]',
  security: 'bg-[#eed2df]',
};

const categoryAccentHex: Record<Exclude<SkillCategoryKey, 'all'>, string> = {
  iot: '#f3e6a2',
  linux: '#cfe0f2',
  dev: '#c6e3d1',
  security: '#eed2df',
};

const logoTerminalPreset = {
  ...presets.terminal,
  color: 'source' as const,
  cells: [10, 7, 5, 4],
};

const skillIconMap: Record<string, IconType> = {
  Arduino: SiArduino,
  ESP32: SiEspressif,
  'Sensor Interfacing': LuActivity,
  'PC & Laptop Assembly': LuCpu,
  Ubuntu: SiUbuntu,
  AlmaLinux: SiAlmalinux,
  Fedora: SiFedora,
  CachyOS: SiArchlinux,
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
  const Icon = skillIconMap[skill.name] ?? LuCpu;

  const iconDataUri = useMemo(() => {
    const color = categoryAccentHex[skill.category];
    const markup = renderToStaticMarkup(
      <Icon
        color={color}
        size={40}
        xmlns="http://www.w3.org/2000/svg"
      />,
    );
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  }, [Icon, skill.category]);

  const { ref: logoRef, reveal, hide } = useAsciiReveal({
    preset: logoTerminalPreset,
    duration: 'cinematic',
    speed: 1.4,
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
      data-ascii="surface"
      className="keycap group relative w-fit overflow-hidden px-3.5 py-2.5 text-left"
    >
      <div
        className={`min-w-0 transition-opacity duration-150 ${
          isActive ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div className="mb-0.5 flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 shrink-0 rounded-full ${categoryAccentDot[skill.category]}`}
            aria-hidden="true"
          />
          <span className="font-mono text-[10px] tracking-wider text-[#8e71a2]">
            {skill.legend}
          </span>
        </div>
        <div className="whitespace-nowrap font-sans text-xs font-semibold text-[#f3edf7] sm:text-sm">
          {skill.name}
        </div>
      </div>

      {/* Full-keycap ASCII reveal overlay showing the skill logo */}
      <div
        ref={logoRef}
        data-ascii="skip"
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-[9px] bg-[#211530] ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <img
          src={iconDataUri}
          alt=""
          className="h-9 w-9 shrink-0 object-contain"
        />
      </div>
    </div>
  );
};
