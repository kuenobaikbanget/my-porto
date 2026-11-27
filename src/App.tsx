import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { ActivityStatusBento } from './components/ActivityStatusBento';
import { ContactFooter } from './components/ContactFooter';
import { ExperienceBento } from './components/ExperienceBento';
import { HeroBento } from './components/HeroBento';
import { HobbiesBento } from './components/HobbiesBento';
import { Navbar } from './components/Navbar';
import { ProjectsBento } from './components/ProjectsBento';
import { TechStackBento } from './components/TechStackBento';
import type { ProjectItem } from './data/projects';

const CommandPalette = lazy(() =>
  import('./components/CommandPalette').then((m) => ({ default: m.CommandPalette })),
);

const ProjectSpecModal = lazy(() =>
  import('./components/ProjectSpecModal').then((m) => ({ default: m.ProjectSpecModal })),
);

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [hasMountedPalette, setHasMountedPalette] = useState(false);
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);
  const [hasMountedSpecModal, setHasMountedSpecModal] = useState(false);

  const openPalette = useCallback(() => {
    setHasMountedPalette(true);
    setPaletteOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setHasMountedPalette(true);
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenProject = useCallback((project: ProjectItem) => {
    setHasMountedSpecModal(true);
    setActiveProject(project);
  }, []);

  const handleCloseProject = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <div className="min-h-screen text-[var(--theme-ink-primary)]">
      <a
        href="#main-content"
        className="keycap keycap-mint sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:min-h-[44px] focus:px-4 focus:py-2 focus:text-xs focus:no-underline"
      >
        Skip to content
      </a>

      <Navbar onOpenPalette={openPalette} />
      <main id="main-content" className="mx-auto max-w-6xl px-4 sm:px-6">
        <HeroBento />
        <ActivityStatusBento />
        <ProjectsBento onOpenProject={handleOpenProject} />
        <ExperienceBento />
        <TechStackBento />
        <HobbiesBento />
        <ContactFooter />
      </main>

      {hasMountedPalette ? (
        <Suspense fallback={null}>
          <CommandPalette
            isOpen={paletteOpen}
            onClose={closePalette}
            onOpenProject={handleOpenProject}
          />
        </Suspense>
      ) : null}

      {hasMountedSpecModal ? (
        <Suspense fallback={null}>
          <ProjectSpecModal
            project={activeProject}
            onClose={handleCloseProject}
          />
        </Suspense>
      ) : null}
    </div>
  );
}

export default App;
