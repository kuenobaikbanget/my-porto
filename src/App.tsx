import { useCallback, useEffect, useState } from 'react';
import { ActivityStatusBento } from './components/ActivityStatusBento';
import { CommandPalette } from './components/CommandPalette';
import { ContactFooter } from './components/ContactFooter';
import { ExperienceBento } from './components/ExperienceBento';
import { HeroBento } from './components/HeroBento';
import { HobbiesBento } from './components/HobbiesBento';
import { Navbar } from './components/Navbar';
import { ProjectSpecModal } from './components/ProjectSpecModal';
import { ProjectsBento } from './components/ProjectsBento';
import { TechStackBento } from './components/TechStackBento';
import type { ProjectItem } from './data/projects';

function App() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<{
    project: ProjectItem;
    sourceRect: DOMRect | null;
  } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenProject = useCallback((project: ProjectItem, sourceRect?: DOMRect) => {
    setActiveProject({ project, sourceRect: sourceRect ?? null });
  }, []);

  const handleCloseProject = useCallback(() => {
    setActiveProject(null);
  }, []);

  return (
    <div className="min-h-screen text-[var(--theme-ink-primary)]">
      <Navbar onOpenPalette={() => setPaletteOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 sm:px-6">
        <HeroBento />
        <ActivityStatusBento />
        <ProjectsBento onOpenProject={handleOpenProject} />
        <ExperienceBento />
        <TechStackBento />
        <HobbiesBento />
        <ContactFooter />
      </main>

      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onOpenProject={(project) => handleOpenProject(project)}
      />

      <ProjectSpecModal
        project={activeProject?.project ?? null}
        sourceRect={activeProject?.sourceRect ?? null}
        onClose={handleCloseProject}
      />
    </div>
  );
}

export default App;
