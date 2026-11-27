import { useEffect, useState, type FC } from 'react';
import { LuFileText, LuMenu, LuX } from 'react-icons/lu';
import { profileData } from '../data/profile';

const navLinks = [
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Toolbox' },
  { id: 'hobbies', label: 'Bench' },
  { id: 'contact', label: 'Contact' },
];

export const Navbar: FC = () => {
  const [activeId, setActiveId] = useState<string>('hero');
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-40 border-b border-[#3d2a54] bg-[#170e1f]/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <a
            href="#hero"
            className="keycap px-3 py-1.5 text-xs tracking-wide text-[#f3edf7] no-underline"
          >
            <span className="font-semibold text-[#eed2df]">{profileData.handle}</span>
            <span className="hidden text-[#8e71a2] sm:inline" aria-hidden="true">
              // ナイト・デスク
            </span>
          </a>

          {/* Windowed LED status badge */}
          <div
            className="recessed-well hidden items-center gap-2 rounded-full px-3 py-1 lg:inline-flex"
            title={profileData.statusLabel}
          >
            <span
              className="h-2 w-2 rounded-full bg-[#c6e3d1] ring-2 ring-[#c6e3d1]/25"
              aria-hidden="true"
            />
            <span className="font-mono text-[11px] font-medium text-[#c6e3d1]">
              {profileData.statusLabel}
            </span>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`keycap px-2.5 py-1.5 text-xs no-underline ${
                  isActive
                    ? 'border-[#8e71a2] bg-[#36254a] text-[#f3e6a2]'
                    : 'text-[#b9a7c9]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={profileData.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="keycap keycap-mint ml-1 px-3 py-1.5 text-xs no-underline"
          >
            <LuFileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>CV</span>
          </a>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <a
            href={profileData.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="keycap keycap-mint px-2.5 py-1.5 text-xs no-underline"
          >
            <LuFileText className="h-3.5 w-3.5" aria-hidden="true" />
            <span>CV</span>
          </a>
          <button
            type="button"
            className="keycap p-2 text-[#f3edf7]"
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
          className="border-t border-[#3d2a54] bg-[#22162e] px-4 py-3 md:hidden"
          aria-label="Mobile navigation"
        >
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-[#140c1c] px-3 py-2 font-mono text-[11px] text-[#c6e3d1]">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#c6e3d1]" aria-hidden="true" />
            <span>{profileData.statusLabel}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => setMenuOpen(false)}
                className="keycap px-3 py-2 text-xs text-[#f3edf7] no-underline"
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
