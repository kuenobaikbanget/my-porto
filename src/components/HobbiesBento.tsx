import { useCallback, useId, useRef, useState, type FC, type KeyboardEvent } from 'react';
import { createPortal } from 'react-dom';
import { LuExpand, LuX } from 'react-icons/lu';
import { hobbiesData, type HobbyCategory } from '../data/hobbies';
import { useDialogA11y } from '../hooks/useDialogA11y';
import { useHyprPresence } from '../hooks/useHyprPresence';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { SectionHeader } from './SectionHeader';

export const HobbiesBento: FC = () => {
  const [activeTab, setActiveTab] = useState<HobbyCategory['key']>('keyboards');
  const [visitedTabs, setVisitedTabs] = useState<Set<HobbyCategory['key']>>(
    () => new Set(['keyboards']),
  );
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);
  const { isMounted, isClosing, displayValue: activeImage } = useHyprPresence(lightboxImage);
  const { ref, isVisible } = useRevealOnScroll<HTMLElement>();

  const selectTab = useCallback((key: HobbyCategory['key']) => {
    setActiveTab(key);
    setVisitedTabs((prev) => {
      if (prev.has(key)) return prev;
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const tabsIdPrefix = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lightboxRef = useRef<HTMLDivElement | null>(null);
  const lightboxCloseRef = useRef<HTMLButtonElement | null>(null);

  const closeLightbox = useCallback(() => {
    setLightboxImage(null);
  }, []);

  useDialogA11y({
    isOpen: Boolean(lightboxImage),
    isPresent: isMounted,
    onClose: closeLightbox,
    dialogRef: lightboxRef,
    initialFocusRef: lightboxCloseRef,
  });

  const currentCategory =
    hobbiesData.find((cat) => cat.key === activeTab) ?? hobbiesData[0];

  const getTabId = (key: HobbyCategory['key']) => `${tabsIdPrefix}-tab-${key}`;
  const getPanelId = (key: HobbyCategory['key']) => `${tabsIdPrefix}-panel-${key}`;

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number | null = null;
    if (event.key === 'ArrowRight') {
      nextIndex = (index + 1) % hobbiesData.length;
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (index - 1 + hobbiesData.length) % hobbiesData.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = hobbiesData.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    const nextCategory = hobbiesData[nextIndex];
    selectTab(nextCategory.key);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section
      id="hobbies"
      ref={ref}
      className={`reveal-block py-8 sm:py-10 ${isVisible ? 'is-visible' : ''}`}
    >
      <SectionHeader
        eyebrow="OFF-DUTY BENCH"
        title="Off-Duty Craft"
        subtitle="Mechanical keyboards, lightweight mice, coffee, and cassettes."
        accentColor="pink"
      />

      <div className="bento-card p-5 sm:p-6">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div
            className="recessed-well inline-flex flex-wrap gap-2 rounded-2xl p-2"
            role="tablist"
            aria-label="Off-duty craft categories"
          >
            {hobbiesData.map((cat, idx) => {
              const isActive = cat.key === activeTab;
              return (
                <button
                  key={cat.key}
                  ref={(el) => {
                    tabRefs.current[idx] = el;
                  }}
                  id={getTabId(cat.key)}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={getPanelId(cat.key)}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(cat.key)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`keycap min-h-[44px] px-3 py-2 text-xs sm:min-h-[36px] sm:py-1.5 ${
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

        {hobbiesData.map((cat) => {
          const isPanelActive = cat.key === activeTab;
          const shouldRenderImages = visitedTabs.has(cat.key);
          return (
            <div
              key={cat.key}
              id={getPanelId(cat.key)}
              role="tabpanel"
              aria-labelledby={getTabId(cat.key)}
              hidden={!isPanelActive}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              {shouldRenderImages
                ? cat.images.map((img) => (
                    <button
                      key={img.src}
                      type="button"
                      onClick={() => setLightboxImage(img)}
                      className="group relative aspect-[4/3] min-h-[44px] cursor-pointer overflow-hidden rounded-xl border border-[var(--theme-border)] bg-[var(--theme-well)] text-left shadow-[0_3px_0_var(--theme-bevel)] transition-colors hover:border-[var(--theme-accent-pink-border)] focus-visible:outline-2 focus-visible:outline-[var(--theme-accent-mint)] motion-reduce:transition-none"
                      aria-label={`View larger photo: ${img.alt}`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                      />
                      <span
                        className="absolute right-2 bottom-2 inline-flex items-center justify-center rounded-lg border border-[var(--theme-border-strong)] bg-[var(--theme-housing)]/90 p-1.5 text-[var(--theme-ink-primary)] opacity-0 transition-opacity group-hover:opacity-100 motion-reduce:transition-none"
                        aria-hidden="true"
                      >
                        <LuExpand className="h-3.5 w-3.5" />
                      </span>
                    </button>
                  ))
                : null}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal (portaled to body so section reveal transform never traps it under Navbar) */}
      {isMounted && activeImage && typeof document !== 'undefined'
        ? createPortal(
            <div
              className={`fixed inset-0 z-[100] flex items-center justify-center bg-[var(--theme-backdrop)] p-4 backdrop-blur-[3px] ${
                isClosing ? 'hypr-backdrop-out' : 'hypr-backdrop-in'
              }`}
              aria-hidden={isClosing || undefined}
              onClick={closeLightbox}
            >
              <div
                ref={lightboxRef}
                role="dialog"
                aria-modal="true"
                aria-label={activeImage.alt}
                className={`bento-card modal-surface relative max-h-[90vh] max-w-3xl overflow-hidden p-3 ${
                  isClosing ? 'hypr-modal-out' : 'hypr-modal-in'
                }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-2 flex items-center justify-between gap-4 px-1">
                  <span className="font-mono text-xs text-[var(--theme-ink-muted)]">
                    {activeImage.alt}
                  </span>
                  <button
                    ref={lightboxCloseRef}
                    type="button"
                    onClick={closeLightbox}
                    className="keycap min-h-[44px] min-w-[44px] p-2 text-xs text-[var(--theme-ink-primary)] sm:min-h-[36px] sm:min-w-[36px] sm:p-1.5"
                    aria-label="Close photo preview"
                  >
                    <LuX className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  decoding="async"
                  className="max-h-[76vh] w-full rounded-xl object-contain"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
};
