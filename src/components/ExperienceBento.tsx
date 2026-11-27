import type { FC } from 'react';
import { LuBriefcase, LuGraduationCap, LuMapPin } from 'react-icons/lu';
import { educationData, experienceData } from '../data/experience';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { SectionHeader } from './SectionHeader';

export const ExperienceBento: FC = () => {
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>();

  return (
    <section
      id="experience"
      ref={ref}
      className={`reveal-block py-8 sm:py-10 ${isVisible ? 'is-visible' : ''}`}
    >
      <SectionHeader
        eyebrow="TRACK RECORD"
        title="Experience & Education"
        subtitle="Hands-on IT infrastructure, Linux systems, and hardware engineering."
        accentColor="sky"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Experience Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:col-span-8">
          {experienceData.map((item) => (
            <article key={item.id} className="bento-card flex flex-col justify-between p-5 sm:p-6">
              <div>
                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="recessed-well flex h-9 w-9 items-center justify-center rounded-xl">
                    <LuBriefcase
                      className={`h-4 w-4 ${
                        item.current
                          ? 'text-[var(--theme-accent-mint)]'
                          : 'text-[var(--theme-accent-sky)]'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-medium ${
                      item.current
                        ? 'border-[var(--theme-accent-mint-border)] bg-[var(--theme-accent-mint-bg)] text-[var(--theme-accent-mint)]'
                        : 'border-[var(--theme-border)] bg-[var(--theme-well)] text-[var(--theme-ink-muted)]'
                    }`}
                  >
                    {item.current ? (
                      <span
                        className="h-1.5 w-1.5 rounded-full bg-[var(--theme-accent-mint-dot)]"
                        aria-hidden="true"
                      />
                    ) : null}
                    {item.period}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-[var(--theme-ink-primary)]">
                  {item.role}
                </h3>
                <p className="mt-0.5 text-sm font-semibold text-[var(--theme-accent-butter)]">
                  {item.organization}
                </p>
                <p className="mt-1 inline-flex items-center gap-1 font-mono text-xs text-[var(--theme-ink-legend)]">
                  <LuMapPin className="h-3 w-3" aria-hidden="true" />
                  <span>{item.location}</span>
                </p>

                <ul className="mt-4 space-y-2 border-t border-[var(--theme-border)]/70 pt-3.5 text-xs leading-relaxed text-[var(--theme-ink-muted)] sm:text-sm">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2">
                      <span
                        className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--theme-accent-sky-dot)]"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[var(--theme-border)]/70 pt-3.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-[var(--theme-border)] bg-[var(--theme-well)] px-2 py-0.5 font-mono text-[11px] text-[var(--theme-ink-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Education Card */}
        <article className="bento-card flex flex-col justify-between p-5 sm:p-6 lg:col-span-4">
          <div>
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="recessed-well flex h-9 w-9 items-center justify-center rounded-xl">
                <LuGraduationCap
                  className="h-4 w-4 text-[var(--theme-accent-butter)]"
                  aria-hidden="true"
                />
              </div>
              <span className="inline-flex items-center rounded-lg border border-[var(--theme-accent-butter-border)] bg-[var(--theme-accent-butter-bg)] px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--theme-accent-butter)]">
                GPA {educationData.gpa}
              </span>
            </div>

            <p className="font-mono text-xs uppercase tracking-wider text-[var(--theme-ink-legend)]">
              Education
            </p>
            <h3 className="mt-1 font-display text-lg font-bold text-[var(--theme-ink-primary)]">
              {educationData.degree}
            </h3>
            <p className="mt-1 text-sm font-semibold text-[var(--theme-accent-pink)]">
              {educationData.institution}
            </p>
            <p className="mt-1 font-mono text-xs text-[var(--theme-ink-legend)]">
              {educationData.period}
            </p>

            <ul className="mt-4 space-y-2 border-t border-[var(--theme-border)]/70 pt-3.5 text-xs leading-relaxed text-[var(--theme-ink-muted)] sm:text-sm">
              {educationData.notes.map((note) => (
                <li key={note} className="flex items-start gap-2">
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--theme-accent-butter-dot)]"
                    aria-hidden="true"
                  />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="recessed-well mt-5 rounded-xl px-3 py-2.5 font-mono text-[11px] text-[var(--theme-accent-mint)]">
            Status: 3rd-Year Undergraduate · Active in KSM Robotics
          </div>
        </article>
      </div>
    </section>
  );
};
