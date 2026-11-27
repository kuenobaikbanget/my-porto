import { useEffect, useState, type FC } from 'react';
import { LuExpand, LuX } from 'react-icons/lu';
import { hobbiesData, type HobbyCategory } from '../data/hobbies';
import { useHyprPresence } from '../hooks/useHyprPresence';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { SectionHeader } from './SectionHeader';

export const HobbiesBento: FC = () => {
  const [activeTab, setActiveTab] = useState<HobbyCategory['key']>('keyboards');
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const { isMounted, isClosing, displayValue: activeImage } = useHyprPresence(lightboxImage);
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>();

  const currentCategory =
    hobbiesData.find((cat) => cat.key === activeTab) ?? hobbiesData[0];

  useEffect(() => {
    if (!lightboxImage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxImage(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxImage]);

  return (
    <section
      id="hobbies"
      ref={ref}
      className={`reveal-block py-8 sm:py-10 ${isVisible ? 'is-visible' : ''}`}
    >
      <SectionHeader
        eyebrow="OFF-DUTY BENCH"
        title="Off-Duty Craft"
        subtitle="Mechanical keyboards, lightweight mice, Hario Switch coffee, and cassettes."
        accentColor="pink"
      />

      <div className="bento-card p-5 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div
            className="recessed-well inline-flex flex-wrap gap-2 rounded-2xl p-2"
            role="tablist"
            aria-label="Off-duty craft categories"
          >
            {hobbiesData.map((cat) => {
              const isActive = cat.key === activeTab;
              return (
                <button
                  key={cat.key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(cat.key)}
                  className={`keycap px-3 py-1.5 text-xs ${
                    isActive ? 'keycap-mint' : 'text-[var(--theme-ink-muted)]'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className="opacity-70">({cat.images.length})</span>
                </button>
              );
            })}
          </div>

          <p className="font-mono text-xs text-[var(--theme-ink-muted)]">{currentCategory.note}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {currentCategory.images.map((img) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setLightboxImage(img)}
              className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-well)] text-left shadow-[0_3px_0_var(--theme-bevel)] transition-colors hover:border-[var(--theme-accent-pink-border)] focus-visible:outline-2 focus-visible:outline-[var(--theme-accent-mint)]"
              aria-label={`View larger photo: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                className="absolute right-2 bottom-2 inline-flex items-center justify-center rounded-lg border border-[var(--theme-border-strong)] bg-[var(--theme-housing)]/90 p-1.5 text-[var(--theme-ink-primary)] opacity-0 transition-opacity group-hover:opacity-100"
                aria-hidden="true"
              >
                <LuExpand className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {isMounted && activeImage ? (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--theme-backdrop)] p-4 backdrop-blur-sm ${
            isClosing ? 'hypr-backdrop-out' : 'hypr-backdrop-in'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label={activeImage.alt}
          onClick={() => setLightboxImage(null)}
        >
          <div
            className={`bento-card relative max-h-[90vh] max-w-3xl overflow-hidden p-3 ${
              isClosing ? 'hypr-modal-out' : 'hypr-modal-in'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between gap-4 px-1">
              <span className="font-mono text-xs text-[var(--theme-ink-muted)]">
                {activeImage.alt}
              </span>
              <button
                type="button"
                onClick={() => setLightboxImage(null)}
                className="keycap p-1.5 text-xs text-[var(--theme-ink-primary)]"
                aria-label="Close photo preview"
              >
                <LuX className="h-4 w-4" />
              </button>
            </div>
            <img
              src={activeImage.src}
              alt={activeImage.alt}
              className="max-h-[76vh] w-full rounded-xl object-contain"
            />
          </div>
        </div>
      ) : null}
    </section>
  );
};
