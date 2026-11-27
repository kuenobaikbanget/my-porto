import type { FC } from 'react';
import { LuGithub, LuInstagram, LuLinkedin } from 'react-icons/lu';
import { profileData } from '../data/profile';
import { EmailActionPopover } from './EmailActionPopover';

export const ContactFooter: FC = () => {
  return (
    <footer id="contact" className="pt-8 pb-12 sm:pt-10 sm:pb-16">
      <div className="bento-card p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs tracking-wider text-[var(--theme-ink-legend)]">
              GET IN TOUCH
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[var(--theme-ink-primary)] sm:text-3xl">
              Let&apos;s build dependable systems.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[var(--theme-ink-muted)]">
              Open to internships, Linux/networking ops, IoT prototyping, and practical software
              engineering roles. Reach me directly via email or LinkedIn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <EmailActionPopover
              email={profileData.email}
              variant="mint"
              align="right-md"
              placement="top"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-[var(--theme-border)]/80 pt-5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={profileData.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="keycap min-h-[44px] px-3.5 py-2 text-xs text-[var(--theme-ink-primary)] no-underline sm:min-h-[36px] sm:px-3 sm:py-1.5"
            >
              <LuGithub className="h-3.5 w-3.5" aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <a
              href={profileData.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="keycap min-h-[44px] px-3.5 py-2 text-xs text-[var(--theme-accent-sky)] no-underline sm:min-h-[36px] sm:px-3 sm:py-1.5"
            >
              <LuLinkedin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <a
              href={profileData.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="keycap min-h-[44px] px-3.5 py-2 text-xs text-[var(--theme-accent-pink)] no-underline sm:min-h-[36px] sm:px-3 sm:py-1.5"
            >
              <LuInstagram className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Instagram</span>
            </a>
          </div>

          <p className="font-mono text-xs text-[var(--theme-ink-legend)]">
            © 2026 {profileData.name} ·{' '}
            <span className="text-[var(--theme-ink-muted)]">kueno.web.id</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
