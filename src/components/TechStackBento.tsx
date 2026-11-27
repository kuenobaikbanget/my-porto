import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useAsciiReveal } from 'ascii-reveal';
import { skillCategories, skillsData, type SkillCategoryKey } from '../data/skills';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { SectionHeader } from './SectionHeader';
import { SkillKeycap } from './SkillKeycap';

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
  const [gridHeight, setGridHeight] = useState<number | null>(null);
  const hasFilteredRef = useRef(false);
  const gridInnerRef = useRef<HTMLDivElement | null>(null);
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

  const setGridNode = useCallback(
    (node: HTMLDivElement | null) => {
      gridInnerRef.current = node;
      gridRef(node);
    },
    [gridRef],
  );

  useEffect(() => {
    const el = gridInnerRef.current;
    if (!el) return;

    const updateHeight = () => {
      const nextHeight = Math.ceil(el.getBoundingClientRect().height);
      if (nextHeight > 0) {
        setGridHeight(nextHeight);
      }
    };

    updateHeight();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(updateHeight);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (activeCategory === renderedCategory) return;

    let cancelled = false;
    hasFilteredRef.current = true;

    void hideGrid({ origin: 'center', duration: 'cinematic', speed: 1.35 }).then(() => {
      if (!cancelled) {
        setRenderedCategory(activeCategory);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [activeCategory, renderedCategory, hideGrid]);

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
        {/* Filter Keycap Tabs */}
        <div
          className="recessed-well mb-5 flex flex-wrap gap-2 rounded-2xl p-2"
          role="tablist"
          aria-label="Filter toolbox by category"
        >
          {skillCategories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat.key)}
                className={`keycap px-3 py-1.5 text-xs ${
                  isActive ? 'keycap-butter' : 'text-[var(--theme-ink-muted)]'
                }`}
              >
                <span
                  className="text-[10px] opacity-85"
                  style={!isActive ? { color: categoryLegendCssColor[cat.key] } : undefined}
                >
                  [{cat.legend}]
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bento Keycap Matrix — smooth height transition when filtering/resizing */}
        <div
          className="overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={gridHeight !== null ? { height: `${gridHeight}px` } : undefined}
        >
          <div ref={setGridNode} className="flex flex-wrap gap-2.5 pb-1">
            {filteredSkills.map((skill) => (
              <SkillKeycap key={`${skill.category}-${skill.name}`} skill={skill} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
