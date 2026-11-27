import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type FC,
} from 'react';
import {
  LuArrowUpRight,
  LuCpu,
  LuExternalLink,
  LuGithub,
  LuLayers,
  LuSmartphone,
  LuTerminal,
  LuX,
} from 'react-icons/lu';
import type { ProjectAccent, ProjectItem } from '../data/projects';

interface ProjectSpecModalProps {
  project: ProjectItem | null;
  sourceRect: DOMRect | null;
  onClose: () => void;
}

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

function renderProjectIcon(id: string) {
  if (id === 'opspilot') {
    return (
      <LuTerminal
        className="h-5 w-5 text-[var(--theme-accent-butter)]"
        aria-hidden="true"
      />
    );
  }
  if (id === 'finnote') {
    return (
      <LuSmartphone
        className="h-5 w-5 text-[var(--theme-accent-mint)]"
        aria-hidden="true"
      />
    );
  }
  return (
    <LuCpu
      className="h-5 w-5 text-[var(--theme-accent-pink)]"
      aria-hidden="true"
    />
  );
}

function resolveOriginRect(projectId: string, fallbackRect: DOMRect | null): DOMRect | null {
  if (typeof document !== 'undefined') {
    const cardEl = document.querySelector<HTMLElement>(
      `[data-project-card-id="${projectId}"]`,
    );
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        return rect;
      }
    }
  }
  return fallbackRect;
}

export const ProjectSpecModal: FC<ProjectSpecModalProps> = ({
  project,
  sourceRect,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const isClosingRef = useRef(false);
  const activeAnimRef = useRef<Animation | null>(null);

  const requestClose = useCallback(() => {
    if (!project || isClosingRef.current) return;
    isClosingRef.current = true;

    const modalEl = modalRef.current;
    const backdropEl = backdropRef.current;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!modalEl || prefersReducedMotion) {
      onClose();
      return;
    }

    activeAnimRef.current?.cancel();

    const targetRect = modalEl.getBoundingClientRect();
    const originRect = resolveOriginRect(project.id, sourceRect);

    let keyframeTo: Keyframe;
    if (originRect && targetRect.width > 0 && targetRect.height > 0) {
      const dx =
        originRect.left + originRect.width / 2 - (targetRect.left + targetRect.width / 2);
      const dy =
        originRect.top + originRect.height / 2 - (targetRect.top + targetRect.height / 2);
      const sx = Math.max(0.15, originRect.width / targetRect.width);
      const sy = Math.max(0.15, originRect.height / targetRect.height);
      keyframeTo = {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`,
        opacity: 0,
      };
    } else {
      keyframeTo = {
        transform: 'translate3d(0, 8px, 0) scale(0.93)',
        opacity: 0,
      };
    }

    backdropEl?.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 240,
      easing: 'ease-out',
      fill: 'forwards',
    });

    const anim = modalEl.animate(
      [
        {
          transform: 'translate3d(0, 0, 0) scale(1, 1)',
          opacity: 1,
        },
        keyframeTo,
      ],
      {
        duration: 280,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      },
    );

    activeAnimRef.current = anim;

    let finished = false;
    const finalize = () => {
      if (finished) return;
      finished = true;
      onClose();
    };

    anim.onfinish = finalize;
    window.setTimeout(finalize, 340);
  }, [onClose, project, sourceRect]);

  useLayoutEffect(() => {
    if (!project) return;
    isClosingRef.current = false;

    const modalEl = modalRef.current;
    const backdropEl = backdropRef.current;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!modalEl || prefersReducedMotion) return;

    const targetRect = modalEl.getBoundingClientRect();
    const originRect = resolveOriginRect(project.id, sourceRect);

    let keyframeFrom: Keyframe;
    if (originRect && targetRect.width > 0 && targetRect.height > 0) {
      const dx =
        originRect.left + originRect.width / 2 - (targetRect.left + targetRect.width / 2);
      const dy =
        originRect.top + originRect.height / 2 - (targetRect.top + targetRect.height / 2);
      const sx = Math.max(0.15, originRect.width / targetRect.width);
      const sy = Math.max(0.15, originRect.height / targetRect.height);
      keyframeFrom = {
        transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`,
        opacity: 0.38,
      };
    } else {
      keyframeFrom = {
        transform: 'translate3d(0, 10px, 0) scale(0.92)',
        opacity: 0,
      };
    }

    backdropEl?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 280,
      easing: 'ease-out',
      fill: 'both',
    });

    const anim = modalEl.animate(
      [
        keyframeFrom,
        {
          transform: 'translate3d(0, 0, 0) scale(1, 1)',
          opacity: 1,
        },
      ],
      {
        duration: 340,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'both',
      },
    );

    activeAnimRef.current = anim;

    return () => {
      anim.cancel();
    };
  }, [project, sourceRect]);

  useEffect(() => {
    if (!project) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 30);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        requestClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
  }, [project, requestClose]);

  if (!project) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--theme-backdrop)] p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="spec-modal-title"
      onClick={requestClose}
    >
      <div
        ref={modalRef}
        style={{ transformOrigin: 'center center', willChange: 'transform, opacity' }}
        className="bento-card flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hardware Spec-Sheet Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--theme-border)] bg-[var(--theme-terminal-bar)] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="recessed-well mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
              {renderProjectIcon(project.id)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
                <span className="font-semibold tracking-wider text-[var(--theme-ink-legend)]">
                  {project.specCode}
                </span>
                <span className="text-[var(--theme-ink-legend)]">·</span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-medium ${accentBadgeStyles[project.accent]}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${accentDotStyles[project.accent]}`}
                    aria-hidden="true"
                  />
                  {project.status}
                </span>
              </div>

              <h3
                id="spec-modal-title"
                className="mt-1 font-display text-xl font-bold text-[var(--theme-ink-primary)] sm:text-2xl"
              >
                {project.title}
              </h3>
              <p className="mt-0.5 font-mono text-xs text-[var(--theme-ink-muted)]">
                {project.category} · {project.period} · {project.role}
              </p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={requestClose}
            className="keycap shrink-0 px-2.5 py-1.5 text-xs text-[var(--theme-ink-primary)]"
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
            <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-ink-legend)]">
              01 // Overview &amp; Problem
            </p>
            <div className="recessed-well rounded-2xl p-4">
              <p className="text-sm font-semibold text-[var(--theme-ink-primary)]">
                {project.tagline}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-[var(--theme-ink-muted)] sm:text-sm">
                {project.overview}
              </p>
            </div>
          </div>

          {/* Architecture & Stack */}
          <div>
            <p className="mb-2 flex items-center gap-1.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-ink-legend)]">
              <LuLayers className="h-3.5 w-3.5" aria-hidden="true" />
              <span>02 // Architecture &amp; Stack</span>
            </p>
            <ul className="space-y-2 text-xs leading-relaxed text-[var(--theme-ink-muted)] sm:text-sm">
              {project.architecture.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <span
                    className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${accentDotStyles[project.accent]}`}
                    aria-hidden="true"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.stack.map((tech) => (
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
            <p className="mb-2 font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--theme-ink-legend)]">
              03 // Key Highlights
            </p>
            <ul className="space-y-1.5 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-well)]/60 p-4 text-xs text-[var(--theme-ink-muted)] sm:text-sm">
              {project.highlights.map((item) => (
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
            {project.orgBadge ? project.orgBadge : 'github.com/kuenobaikbanget'}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="keycap keycap-mint px-3.5 py-1.5 text-xs no-underline"
              >
                <LuGithub className="h-3.5 w-3.5" aria-hidden="true" />
                <span>GitHub Repo</span>
                <LuArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : null}

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="keycap px-3.5 py-1.5 text-xs text-[var(--theme-ink-primary)] no-underline"
              >
                <LuExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Live Demo</span>
              </a>
            ) : null}

            {!project.repoUrl && !project.liveUrl && project.orgBadge ? (
              <span className="recessed-well rounded-lg px-3 py-1.5 font-mono text-xs text-[var(--theme-accent-pink)]">
                {project.orgBadge}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
