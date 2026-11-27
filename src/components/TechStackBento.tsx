import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { useAsciiReveal } from 'ascii-reveal';
import { skillCategories, skillsData, type SkillCategoryKey } from '../data/skills';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { SectionHeader } from './SectionHeader';
import { SkillKeycap } from './SkillKeycap';

export const TechStackBento: FC = () => {
  const [activeCategory, setActiveCategory] = useState<SkillCategoryKey>('all');
  const [renderedCategory, setRenderedCategory] = useState<SkillCategoryKey>('all');
  const hasFilteredRef = useRef(false);
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
    revealOnMount: false,
  });

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
                  isActive ? 'keycap-butter' : 'text-[#b9a7c9]'
                }`}
              >
                <span
                  className="text-[10px] opacity-75"
                  style={!isActive ? { color: cat.accentHex } : undefined}
                >
                  [{cat.legend}]
                </span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bento Keycap Matrix — each keycap sizes to its own label */}
        <div ref={gridRef} className="flex flex-wrap gap-2.5">
          {filteredSkills.map((skill) => (
            <SkillKeycap key={`${skill.category}-${skill.name}`} skill={skill} />
          ))}
        </div>
      </div>
    </section>
  );
};
