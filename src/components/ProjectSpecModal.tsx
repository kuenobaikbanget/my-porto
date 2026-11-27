import { useRef, type FC } from 'react';
import {
  LuArrowUpRight,
  LuExternalLink,
  LuGithub,
  LuLayers,
  LuX,
} from 'react-icons/lu';
import type { ProjectItem } from '../data/projects';
import { useDialogA11y } from '../hooks/useDialogA11y';
import { useHyprPresence } from '../hooks/useHyprPresence';
import {
  accentBadgeStyles,
  accentDotStyles,
  renderProjectIcon,
} from '../utils/projectThemeUtils';

interface ProjectSpecModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectSpecModal: FC<ProjectSpecModalProps> = ({
  project,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const { isMounted, isClosing, displayValue: activeProject } = useHyprPresence(project);

  useDialogA11y({
    isOpen: Boolean(project),
    onClose,
    dialogRef,
    initialFocusRef: closeButtonRef,
  });

  if (!isMounted || !activeProject) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--theme-backdrop)] p-3 backdrop-blur-sm sm:p-6 ${
        isClosing ? 'hypr-backdrop-out' : 'hypr-backdrop-in'
      }`}
      aria-hidden={isClosing || undefined}
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="spec-modal-title"
        className={`bento-card flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden ${
          isClosing ? 'hypr-modal-out' : 'hypr-modal-in'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hardware Spec-Sheet Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--theme-border)] bg-[var(--theme-terminal-bar)] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="recessed-well mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              {renderProjectIcon(activeProject.id, 'h-5 w-5')}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="font-semibold tracking-wider text-[var(--theme-ink-legend)]">
                  {activeProject.specCode}
                </span>
                <span className="text-[var(--theme-ink-legend)]">·</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-medium ${accentBadgeStyles[activeProject.accent]}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${accentDotStyles[activeProject.accent]}`}
                    aria-hidden="true"
                  />
                  {activeProject.status}
                </span>
              </div>

              <h3
                id="spec-modal-title"
                className="mt-1 font-display text-xl font-bold text-[var(--theme-ink-primary)] sm:text-2xl"
              >
                {activeProject.title}
              </h3>
              <p className="mt-0.5 font-mono text-xs text-[var(--theme-ink-muted)]">
                {activeProject.category} · {activeProject.period} · {activeProject.role}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="keycap min-h-[44px] min-w-[44px] shrink-0 px-3 py-2 text-xs text-[var(--theme-ink-primary)] sm:min-h-[36px] sm:min-w-0 sm:px-2.5 sm:py-1.5"
            aria-label="Close project spec sheet"
          >
            <span>ESC</span>
            <LuX className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable Spec Body */}
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
          {/* Overview / Problem */}
          <div>
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--theme-ink-legend)]">
              01 // Overview &amp; Problem
            </p>
            <div className="recessed-well rounded-2xl p-4">
              <p className="text-sm font-semibold text-[var(--theme-ink-primary)]">
                {activeProject.tagline}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--theme-ink-muted)] sm:text-sm">
                {activeProject.overview}
              </p>
            </div>
          </div>

          {/* Architecture & Stack */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--theme-ink-legend)]">
              <LuLayers className="h-3.5 w-3.5" aria-hidden="true" />
              <span>02 // Architecture &amp; Stack</span>
            </p>
            <ul className="space-y-2 text-xs leading-relaxed text-[var(--theme-ink-muted)] sm:text-sm">
              {activeProject.architecture.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accentDotStyles[activeProject.accent]}`}
                    aria-hidden="true"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {activeProject.stack.map((tech) => (
                <span
                  key={tech}
                  className="keycap cursor-default px-2.5 py-1 text-[11px] text-[var(--theme-accent-sky)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Key Highlights */}
          <div>
            <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--theme-ink-legend)]">
              03 // Key Highlights
            </p>
            <ul className="space-y-1.5 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-well)]/60 p-4 text-xs text-[var(--theme-ink-muted)] sm:text-sm">
              {activeProject.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span
                    className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--theme-ink-legend)]"
                    aria-hidden="true"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--theme-border)] bg-[var(--theme-terminal-bar)] px-5 py-3.5 sm:px-6">
          <span className="font-mono text-[11px] text-[var(--theme-ink-legend)]">
            {activeProject.orgBadge ? activeProject.orgBadge : 'github.com/kuenobaikbanget'}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {activeProject.repoUrl ? (
              <a
                href={activeProject.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="keycap keycap-mint min-h-[44px] px-4 py-2 text-xs no-underline sm:min-h-[36px] sm:px-3.5 sm:py-1.5"
              >
                <LuGithub className="h-3.5 w-3.5" aria-hidden="true" />
                <span>GitHub Repo</span>
                <LuArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}

            {activeProject.liveUrl ? (
              <a
                href={activeProject.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="keycap min-h-[44px] px-4 py-2 text-xs text-[var(--theme-ink-primary)] no-underline sm:min-h-[36px] sm:px-3.5 sm:py-1.5"
              >
                <LuExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Live Demo</span>
              </a>
            ) : null}

            {!activeProject.repoUrl && !activeProject.liveUrl && activeProject.orgBadge ? (
              <span className="recessed-well rounded-lg px-3 py-1.5 font-mono text-xs text-[var(--theme-accent-pink)]">
                {activeProject.orgBadge}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
