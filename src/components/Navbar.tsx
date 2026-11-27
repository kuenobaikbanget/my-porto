import { useEffect, useState, type FC, type MouseEvent } from 'react';
import { LuCommand, LuMenu, LuMoon, LuSun, LuX } from 'react-icons/lu';
import { useTheme } from '../context/useTheme';
import { profileData } from '../data/profile';

const navLinks = [
  { id: 'activity', label: 'Activity' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Toolbox' },
  { id: 'hobbies', label: 'Bench' },
  { id: 'contact', label: 'Contact' },
];

interface NavbarProps {
  onOpenPalette: () => void;
}

export const Navbar: FC<NavbarProps> = ({ onOpenPalette }) => {
  const [activeId, setActiveId] = useState<string>('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const isAnalog = theme === 'analog-dreams';

  useEffect(() => {
    const sections = ['hero', ...navLinks.map((l) => l.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleToggleColorway = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const hasPointerCoords = event.clientX !== 0 || event.clientY !== 0;
    toggleTheme({
      x: hasPointerCoords ? event.clientX : rect.left + rect.width / 2,
      y: hasPointerCoords ? event.clientY : rect.top + rect.height / 2,
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--theme-border)] bg-[var(--theme-header-bg)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <a
            href="#hero"
            className="keycap px-3 py-1.5 text-xs tracking-wide text-[var(--theme-ink-primary)] no-underline"
          >
            <span className="font-semibold text-[var(--theme-accent-pink)]">
              {profileData.handle}
            </span>
          </a>

          {/* Windowed LED status badge */}
          <div
            className="recessed-well hidden max-w-[250px] shrink-0 items-center gap-2 rounded-full px-3 py-1 xl:inline-flex 2xl:max-w-none"
            title={profileData.statusLabel}
          >
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-[var(--theme-accent-mint-dot)] ring-2 ring-[var(--theme-accent-mint-border)]"
              aria-hidden="true"
            />
            <span className="truncate whitespace-nowrap font-mono text-[11px] font-medium text-[var(--theme-accent-mint)]">
              {profileData.statusLabel}
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-1.5 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`keycap px-2.5 py-1.5 text-xs no-underline lg:px-3 ${
                  isActive
                    ? 'border-[var(--theme-ink-legend)] bg-[var(--theme-keycap-active)] text-[var(--theme-accent-butter)]'
                    : 'text-[var(--theme-ink-muted)]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleColorway}
            aria-label={
              isAnalog
                ? 'Switch colorway to Digital Nightmares (dark)'
                : 'Switch colorway to Analog Dreams (light)'
            }
            title={
              isAnalog
                ? 'Colorway: Analog Dreams — Click for Digital Nightmares'
                : 'Colorway: Digital Nightmares — Click for Analog Dreams'
            }
            className="keycap px-2.5 py-1.5 text-xs text-[var(--theme-ink-primary)]"
          >
            {isAnalog ? (
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
            <span className="hidden sm:inline">
              {isAnalog ? 'Dreams' : 'Nightmares'}
            </span>
            <span className="sm:hidden">{isAnalog ? 'AD' : 'DN'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPalette}
            aria-label="Open terminal command palette (Ctrl+K or Cmd+K)"
            title="Command Palette (⌘K / Ctrl+K)"
            className="keycap px-2.5 py-1.5 text-xs text-[var(--theme-accent-mint)]"
          >
            <LuCommand className="h-3.5 w-3.5" aria-hidden="true" />
            <span>K</span>
          </button>

          <button
            type="button"
            className="keycap p-2 text-[var(--theme-ink-primary)] md:hidden"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? <LuX className="h-4 w-4" /> : <LuMenu className="h-4 w-4" />}
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
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className="keycap px-3 py-2 text-xs text-[var(--theme-ink-primary)] no-underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
};
