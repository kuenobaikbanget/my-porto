import type { FC, KeyboardEvent } from 'react';
import {
  LuArrowUpRight,
  LuCpu,
  LuExpand,
  LuGithub,
  LuSmartphone,
  LuTerminal,
} from 'react-icons/lu';
import { projectsData, type ProjectAccent, type ProjectItem } from '../data/projects';
import { SectionHeader } from './SectionHeader';

const accentBadgeStyles: Record<ProjectAccent, string> = {
  butter:
    'border-[var(--theme-accent-butter-border)] bg-[var(--theme-accent-butter-bg)] text-[var(--theme-accent-butter)]',
  mint: 'border-[var(--theme-accent-mint-border)] bg-[var(--theme-accent-mint-bg)] text-[var(--theme-accent-mint)]',
  pink: 'border-[var(--theme-accent-pink-border)] bg-[var(--theme-accent-pink-bg)] text-[var(--theme-accent-pink)]',
};

const accentDotStyles: Record<ProjectAccent, string> = {
  butter: 'bg-[var(--theme-accent-butter-dot)]',
  mint: 'bg-[var(--theme-accent-mint-dot)]',
  pink: 'bg-[var(--theme-accent-pink-dot)]',
};

function renderCategoryIcon(id: string) {
  if (id === 'opspilot') {
    return (
      <LuTerminal
        className="h-4 w-4 text-[var(--theme-accent-butter)]"
        aria-hidden="true"
      />
    );
  }
  if (id === 'finnote') {
    return (
      <LuSmartphone
        className="h-4 w-4 text-[var(--theme-accent-mint)]"
        aria-hidden="true"
      />
    );
  }
  return (
    <LuCpu
      className="h-4 w-4 text-[var(--theme-accent-pink)]"
      aria-hidden="true"
    />
  );
}

interface ProjectsBentoProps {
  onOpenProject: (project: ProjectItem) => void;
}

export const ProjectsBento: FC<ProjectsBentoProps> = ({ onOpenProject }) => {
  const handleCardClick = (project: ProjectItem) => {
    onOpenProject(project);
  };

  const handleCardKeyDown = (project: ProjectItem, event: KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement | null;
    if (target && target !== event.currentTarget && target.closest('a, button')) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onOpenProject(project);
    }
  };

  return (
    <section id="projects" className="py-8 sm:py-10">
      <SectionHeader
        eyebrow="FEATURED BUILDS"
        title="Featured Projects"
        subtitle="Self-hosted Linux tooling, offline-first mobile apps, and robotics hardware — click any card for spec sheet."
        accentColor="butter"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {projectsData.map((project) => (
          <article
            key={project.id}
            data-project-card-id={project.id}
            role="button"
            tabIndex={0}
            aria-label={`Inspect ${project.title} spec sheet`}
            onClick={() => handleCardClick(project)}
            onKeyDown={(e) => handleCardKeyDown(project, e)}
            className="bento-card group flex cursor-pointer flex-col justify-between p-5 text-left focus-visible:outline-2 focus-visible:outline-[var(--theme-accent-mint)] sm:p-6"
          >
            <div>
              {/* Card Header */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="recessed-well flex h-9 w-9 items-center justify-center rounded-xl">
                    {renderCategoryIcon(project.id)}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[var(--theme-ink-primary)]">
                    {project.title}
                  </h3>
                </div>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium ${accentBadgeStyles[project.accent]}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${accentDotStyles[project.accent]}`}
                    aria-hidden="true"
                  />
                  {project.period}
                </span>
              </div>

              {/* Tagline & Summary */}
              <p className="mb-2 text-sm font-semibold text-[var(--theme-ink-primary)]">
                {project.tagline}
              </p>
              <p className="mb-4 text-xs leading-relaxed text-[var(--theme-ink-muted)] sm:text-sm">
                {project.description}
              </p>

              {/* Key Highlights */}
              <ul className="mb-5 space-y-1.5 border-t border-[var(--theme-border)]/70 pt-3.5 text-xs text-[var(--theme-ink-muted)]">
                {project.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span
                      className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[var(--theme-ink-legend)]"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer: Stack & Links */}
            <div className="space-y-3 border-t border-[var(--theme-border)]/70 pt-4">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-[var(--theme-border)] bg-[var(--theme-well)] px-2 py-0.5 font-mono text-[11px] text-[var(--theme-accent-sky)]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--theme-ink-legend)]">
                  <span>{project.category}</span>
                  <LuExpand
                    className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100"
                    aria-hidden="true"
                  />
                </span>
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="keycap px-3 py-1.5 text-xs text-[var(--theme-ink-primary)] no-underline"
                  >
                    <LuGithub className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Source</span>
                    <LuArrowUpRight
                      className="h-3.5 w-3.5 text-[var(--theme-accent-mint)]"
                      aria-hidden="true"
                    />
                  </a>
                ) : project.orgBadge ? (
                  <span className="recessed-well rounded-lg px-2.5 py-1 font-mono text-[11px] text-[var(--theme-accent-pink)]">
                    {project.orgBadge}
                  </span>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
