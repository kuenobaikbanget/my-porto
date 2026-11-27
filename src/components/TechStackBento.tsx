import { useEffect, useLayoutEffect, useMemo, useRef, useState, type FC } from 'react';
import { useAsciiReveal } from 'ascii-reveal';
import { skillCategories, skillsData, type SkillCategoryKey } from '../data/skills';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { SectionHeader } from './SectionHeader';
import { SkillKeycap } from './SkillKeycap';

const GRID_RESIZE_DURATION_MS = 340;
const GRID_RESIZE_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

const categoryLegendCssColor: Record<SkillCategoryKey, string> = {
  all: 'var(--theme-ink-primary)',
  iot: 'var(--theme-accent-butter)',
  linux: 'var(--theme-accent-sky)',
  dev: 'var(--theme-accent-mint)',
  security: 'var(--theme-accent-pink)',
};

export const TechStackBento: FC = () => {
  const [activeCategory, setActiveCategory] = useState<SkillCategoryKey>('all');
  const [renderedCategory, setRenderedCategory] = useState<SkillCategoryKey>('all');
  const hasFilteredRef = useRef(false);
  const gridViewportRef = useRef<HTMLDivElement | null>(null);
  const prevHeightRef = useRef<number | null>(null);
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>();

  const {
    ref: gridRef,
    reveal: revealGrid,
    hide: hideGrid,
  } = useAsciiReveal({
    preset: 'terminal',
    duration: 'cinematic',
    speed: 1.25,
    origin: 'top-left',
    selector: '[data-skill-grid-item]',
    revealOnMount: false,
  });

  useEffect(() => {
    if (activeCategory === renderedCategory) return;

    let cancelled = false;
    hasFilteredRef.current = true;

    void hideGrid({ origin: 'center', duration: 'cinematic', speed: 1.35 }).then(() => {
      if (!cancelled) {
        if (gridViewportRef.current) {
          prevHeightRef.current = gridViewportRef.current.getBoundingClientRect().height;
        }
        setRenderedCategory(activeCategory);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeCategory, renderedCategory, hideGrid]);

  useLayoutEffect(() => {
    const viewport = gridViewportRef.current;
    const prevHeight = prevHeightRef.current;
    prevHeightRef.current = null;

    if (!viewport || prevHeight === null) return;

    const resetStyles = () => {
      viewport.style.height = '';
      viewport.style.overflow = '';
      viewport.style.transition = '';
      viewport.style.willChange = '';
    };

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const content = viewport.firstElementChild as HTMLElement | null;
    if (prefersReducedMotion || !content) {
      resetStyles();
      return;
    }

    const nextHeight = content.getBoundingClientRect().height;
    if (Math.abs(nextHeight - prevHeight) < 1) {
      resetStyles();
      return;
    }

    viewport.style.transition = 'none';
    viewport.style.overflow = 'hidden';
    viewport.style.willChange = 'height';
    viewport.style.height = `${prevHeight}px`;

    // Commit starting height before transitioning to the new height.
    void viewport.offsetHeight;

    viewport.style.transition = `height ${GRID_RESIZE_DURATION_MS}ms ${GRID_RESIZE_EASING}`;
    viewport.style.height = `${nextHeight}px`;

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      viewport.removeEventListener('transitionend', handleTransitionEnd);
      window.clearTimeout(fallbackTimer);
      resetStyles();
    };

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target === viewport && event.propertyName === 'height') {
        finish();
      }
    };

    viewport.addEventListener('transitionend', handleTransitionEnd);
    const fallbackTimer = window.setTimeout(finish, GRID_RESIZE_DURATION_MS + 80);

    return () => {
      viewport.removeEventListener('transitionend', handleTransitionEnd);
      window.clearTimeout(fallbackTimer);
    };
  }, [renderedCategory]);

  useEffect(() => {
    if (!hasFilteredRef.current) return;
    void revealGrid({ origin: 'top-left', duration: 'cinematic', speed: 1.25 });
  }, [renderedCategory, revealGrid]);

  const filteredSkills = useMemo(
    () =>
      renderedCategory === 'all'
        ? skillsData
        : skillsData.filter((item) => item.category === renderedCategory),
    [renderedCategory],
  );

  return (
    <section
      id="stack"
      ref={ref}
      className={`reveal-block py-8 sm:py-10 ${isVisible ? 'is-visible' : ''}`}
    >
      <SectionHeader
        eyebrow="KEYCAP MATRIX"
        title="Tech Toolbox"
        subtitle="Tools I ship and maintain systems with — organized as tactile keycaps."
        accentColor="mint"
      />

      <div className="bento-card p-5 sm:p-6">
        {/* Filter Keycap Controls */}
        <div
          className="recessed-well mb-5 flex flex-wrap gap-2 rounded-2xl p-2"
          role="group"
          aria-label="Filter toolbox by category"
        >
          {skillCategories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(cat.key)}
                className={`keycap min-h-[44px] px-3 py-2 text-xs sm:min-h-[36px] sm:py-1.5 ${
                  isActive ? 'keycap-butter' : 'text-[var(--theme-ink-muted)]'
                }`}
              >
                <span
                  className="text-[11px] opacity-90"
                  style={!isActive ? { color: categoryLegendCssColor[cat.key] } : undefined}
                >
                  [{cat.legend}]
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bento Keycap Matrix */}
        <div ref={gridViewportRef}>
          <div ref={gridRef} className="flex flex-wrap gap-2.5 pb-1">
            {filteredSkills.map((skill) => (
              <SkillKeycap key={`${skill.category}-${skill.name}`} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
