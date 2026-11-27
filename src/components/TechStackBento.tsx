import { useMemo, useState, type FC } from 'react';
import { skillCategories, skillsData, type SkillCategoryKey } from '../data/skills';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { SectionHeader } from './SectionHeader';

const categoryAccentDot: Record<Exclude<SkillCategoryKey, 'all'>, string> = {
  iot: 'bg-[#f3e6a2]',
  linux: 'bg-[#cfe0f2]',
  dev: 'bg-[#c6e3d1]',
  security: 'bg-[#eed2df]',
};

export const TechStackBento: FC = () => {
  const [activeCategory, setActiveCategory] = useState<SkillCategoryKey>('all');
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>();

  const filteredSkills = useMemo(
    () =>
      activeCategory === 'all'
        ? skillsData
        : skillsData.filter((item) => item.category === activeCategory),
    [activeCategory],
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

        {/* Keycap Grid */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filteredSkills.map((skill) => (
            <div
              key={`${skill.category}-${skill.name}`}
              className="keycap justify-between px-3 py-2.5 text-left"
            >
              <div className="min-w-0">
                <div className="mb-0.5 flex items-center gap-1.5">
                  <span
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${categoryAccentDot[skill.category]}`}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-[10px] tracking-wider text-[#8e71a2]">
                    {skill.legend}
                  </span>
                </div>
                <div className="truncate font-sans text-xs font-semibold text-[#f3edf7] sm:text-sm">
                  {skill.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
