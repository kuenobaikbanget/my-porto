import type { FC } from 'react';
import {
  LuArrowUpRight,
  LuExpand,
  LuGithub,
} from 'react-icons/lu';
import { projectsData, type ProjectItem } from '../data/projects';
import {
  accentBadgeStyles,
  accentDotStyles,
  renderProjectIcon,
} from '../utils/projectThemeUtils';
import { SectionHeader } from './SectionHeader';

interface ProjectsBentoProps {
  onOpenProject: (project: ProjectItem) => void;
}

export const ProjectsBento: FC<ProjectsBentoProps> = ({ onOpenProject }) => {
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
            className="bento-card group relative flex flex-col justify-between p-5 text-left sm:p-6"
          >
            <div>
              {/* Card Header */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2.5">
                  <div className="recessed-well flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                    {renderProjectIcon(project.id, 'h-4 w-4')}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[var(--theme-ink-primary)]">
                    <button
                      type="button"
                      onClick={() => onOpenProject(project)}
                      aria-label={`Inspect ${project.title} spec sheet`}
                      className="inline-flex min-h-[44px] cursor-pointer items-center text-left after:absolute after:inset-0 after:z-0 after:rounded-[18px] after:content-[''] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--theme-accent-mint)]"
                    >
                      {project.title}
                    </button>
                  </h3>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium ${accentBadgeStyles[project.accent]}`}
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
                    className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </span>
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="keycap relative z-10 min-h-[44px] px-3.5 py-2 text-xs text-[var(--theme-ink-primary)] no-underline sm:min-h-[36px] sm:px-3 sm:py-1.5"
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
