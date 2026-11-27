import type { FC } from 'react';
import {
  LuArrowDownRight,
  LuGithub,
  LuGraduationCap,
  LuLinkedin,
  LuMapPin,
} from 'react-icons/lu';
import { profileData } from '../data/profile';
import { EmailActionPopover } from './EmailActionPopover';
import { TuxedoCatWidget } from './TuxedoCatWidget';

export const HeroBento: FC = () => {
  return (
    <section id="hero" className="pt-6 pb-8 sm:pt-10 sm:pb-10">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Primary Identity & Recruiter Scan Card */}
        <div className="bento-card flex flex-col justify-between p-5 sm:p-7 lg:col-span-8">
          <div>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="shrink-0 rounded-2xl border border-[var(--theme-border-strong)] bg-[var(--theme-well)] p-1 shadow-[0_3px_0_var(--theme-bevel)]">
                  <img
                    src={profileData.avatarSrc}
                    alt={`${profileData.name} portrait`}
                    className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16"
                    width={64}
                    height={64}
                  />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--theme-ink-primary)] sm:text-4xl">
                    {profileData.name}
                  </h1>
                  <p className="mt-0.5 font-mono text-xs font-medium text-[var(--theme-accent-butter)] sm:text-sm">
                    {profileData.headline}
                  </p>
                </div>
              </div>

              <div className="group/gpa relative shrink-0 self-start">
                <button
                  type="button"
                  aria-describedby="gpa-still-going-tooltip"
                  className="recessed-well inline-flex cursor-default items-center gap-2 rounded-xl px-3.5 py-2 font-mono text-xs tabular-nums text-[var(--theme-accent-butter)] transition-colors duration-150 hover:border-[var(--theme-accent-butter-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--theme-accent-butter)]"
                >
                  <span
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--theme-accent-butter-dot)]"
                    aria-hidden="true"
                  />
                  <span className="text-[11px] font-medium tracking-wider text-[var(--theme-ink-legend)]">
                    GPA
                  </span>
                  <span className="font-semibold tracking-tight">{profileData.gpa}</span>
                </button>

                <div
                  id="gpa-still-going-tooltip"
                  role="tooltip"
                  className="gpa-popup pointer-events-none absolute right-0 top-[calc(100%+10px)] z-30 whitespace-nowrap rounded-xl border border-[var(--theme-accent-butter-border)] bg-[var(--theme-keycap)] px-3 py-1.5 font-mono text-[11px] font-medium text-[var(--theme-accent-butter)] shadow-[0_3px_0_var(--theme-bevel),0_10px_24px_var(--theme-popover-shadow)]"
                >
                  <span className="gpa-popup-caret" aria-hidden="true" />
                  and still going, insyallah wallahi
                </div>
              </div>
            </div>

            {/* Focus Pills */}
            <div className="mb-4 flex flex-wrap gap-2">
              {profileData.focusPills.map((pill, idx) => {
                const pillTone =
                  idx === 0
                    ? 'border-[var(--theme-accent-butter-border)] bg-[var(--theme-accent-butter-bg)] text-[var(--theme-accent-butter)]'
                    : idx === 1
                      ? 'border-[var(--theme-accent-sky-border)] bg-[var(--theme-accent-sky-bg)] text-[var(--theme-accent-sky)]'
                      : 'border-[var(--theme-accent-mint-border)] bg-[var(--theme-accent-mint-bg)] text-[var(--theme-accent-mint)]';
                return (
                  <span
                    key={pill}
                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 font-mono text-xs font-medium ${pillTone}`}
                  >
                    {pill}
                  </span>
                );
              })}
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-[var(--theme-ink-muted)] sm:text-base">
              {profileData.summary}
            </p>
          </div>

          <div className="mt-6 border-t border-[var(--theme-border)]/80 pt-5">
            {/* Compact Academic & Location Bar */}
            <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-[var(--theme-ink-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <LuGraduationCap
                  className="h-3.5 w-3.5 text-[var(--theme-accent-pink)]"
                  aria-hidden="true"
                />
                <span>
                  {profileData.degree} · {profileData.university}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LuMapPin
                  className="h-3.5 w-3.5 text-[var(--theme-accent-mint)]"
                  aria-hidden="true"
                />
                <span>{profileData.location}</span>
              </span>
            </div>

            {/* Tactile Keycap Action Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href="#projects"
                className="keycap keycap-mint min-h-[44px] px-4 py-2.5 text-xs no-underline sm:min-h-[40px] sm:py-2 sm:text-sm"
              >
                <span>View Projects</span>
                <LuArrowDownRight className="h-4 w-4" aria-hidden="true" />
              </a>

              <EmailActionPopover
                email={profileData.email}
                variant="plum"
                align="right-mobile"
                placement="bottom"
              />

              <div className="flex items-center gap-2">
                <a
                  href={profileData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="keycap min-h-[44px] min-w-[44px] p-3 text-[var(--theme-ink-primary)] no-underline sm:min-h-[40px] sm:min-w-[40px] sm:p-2.5"
                >
                  <LuGithub className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={profileData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="keycap min-h-[44px] min-w-[44px] p-3 text-[var(--theme-accent-sky)] no-underline sm:min-h-[40px] sm:min-w-[40px] sm:p-2.5"
                >
                  <LuLinkedin className="h-4 w-4" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Sleepy Tuxedo Cat Widget */}
        <div className="lg:col-span-4">
          <TuxedoCatWidget />
        </div>
      </div>
    </section>
  );
};
