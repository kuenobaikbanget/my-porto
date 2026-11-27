import type { FC } from 'react';
import { LuArrowUpRight, LuCpu, LuGithub, LuSmartphone, LuTerminal } from 'react-icons/lu';
import { projectsData, type ProjectAccent } from '../data/projects';
import { SectionHeader } from './SectionHeader';

const accentBadgeStyles: Record<ProjectAccent, string> = {
  butter: 'border-[#f3e6a2]/40 bg-[#f3e6a2]/12 text-[#f3e6a2]',
  mint: 'border-[#c6e3d1]/40 bg-[#c6e3d1]/12 text-[#c6e3d1]',
  pink: 'border-[#eed2df]/40 bg-[#eed2df]/12 text-[#eed2df]',
};

const accentDotStyles: Record<ProjectAccent, string> = {
  butter: 'bg-[#f3e6a2]',
  mint: 'bg-[#c6e3d1]',
  pink: 'bg-[#eed2df]',
};

function renderCategoryIcon(id: string) {
  if (id === 'opspilot') return <LuTerminal className="h-4 w-4 text-[#f3e6a2]" aria-hidden="true" />;
  if (id === 'finnote') return <LuSmartphone className="h-4 w-4 text-[#c6e3d1]" aria-hidden="true" />;
  return <LuCpu className="h-4 w-4 text-[#eed2df]" aria-hidden="true" />;
}

export const ProjectsBento: FC = () => {
  return (
    <section id="projects" className="py-8 sm:py-10">
      <SectionHeader
        katakana="プロジェクト // FEATURED BUILDS"
        title="Featured Projects"
        subtitle="Self-hosted Linux tooling, offline-first mobile apps, and robotics hardware."
        accentColor="butter"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {projectsData.map((project) => (
          <article
            key={project.id}
            className="bento-card flex flex-col justify-between p-5 sm:p-6"
          >
            <div>
              {/* Card Header */}
              <div className="mb-3 flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="recessed-well flex h-9 w-9 items-center justify-center rounded-xl">
                    {renderCategoryIcon(project.id)}
                  </div>
                  <div>
                    <p
                      className="font-mono text-[10px] tracking-wider text-[#8e71a2]"
                      aria-hidden="true"
                    >
                      {project.katakana}
                    </p>
                    <h3 className="font-display text-lg font-bold text-[#f3edf7]">
                      {project.title}
                    </h3>
                  </div>
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
              <p className="mb-2 text-sm font-semibold text-[#f3edf7]">{project.tagline}</p>
              <p className="mb-4 text-xs leading-relaxed text-[#b9a7c9] sm:text-sm">
                {project.description}
              </p>

              {/* Key Highlights */}
              <ul className="mb-5 space-y-1.5 border-t border-[#3d2a54]/70 pt-3.5 text-xs text-[#b9a7c9]">
                {project.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#8e71a2]" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Footer: Stack & Links */}
            <div className="space-y-3 border-t border-[#3d2a54]/70 pt-4">
              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md border border-[#3d2a54] bg-[#140c1c] px-2 py-0.5 font-mono text-[11px] text-[#cfe0f2]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="font-mono text-[11px] text-[#8e71a2]">{project.category}</span>
                {project.repoUrl ? (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="keycap px-3 py-1.5 text-xs text-[#f3edf7] no-underline"
                  >
                    <LuGithub className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Source</span>
                    <LuArrowUpRight className="h-3.5 w-3.5 text-[#c6e3d1]" aria-hidden="true" />
                  </a>
                ) : project.orgBadge ? (
                  <span className="recessed-well rounded-lg px-2.5 py-1 font-mono text-[11px] text-[#eed2df]">
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
