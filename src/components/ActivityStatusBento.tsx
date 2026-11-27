import { useEffect, useMemo, useState, type FC } from 'react';
import { LuArrowUpRight, LuGithub } from 'react-icons/lu';
import {
  buildFallbackContributions,
  type ContributionDay,
  type ContributionLevel,
} from '../data/contributionsFallback';
import { profileData } from '../data/profile';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { SectionHeader } from './SectionHeader';

const GITHUB_USERNAME = 'kuenobaikbanget';
const CONTRIBUTIONS_API = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

interface ApiContributionResponse {
  contributions?: Array<{
    date?: unknown;
    count?: unknown;
    level?: unknown;
  }>;
}

const ledLevelStyles: Record<ContributionLevel, string> = {
  0: 'bg-[var(--theme-led-0)] border-[var(--theme-border)]/45',
  1: 'bg-[var(--theme-led-1)] border-transparent',
  2: 'bg-[var(--theme-led-2)] border-transparent',
  3: 'bg-[var(--theme-led-3)] border-transparent',
  4: 'bg-[var(--theme-led-4)] border-transparent shadow-[var(--theme-led-4-glow)]',
};

function formatContributionDate(isoDate: string): string {
  const parsed = new Date(`${isoDate}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function normalizeLevel(rawLevel: unknown, count: number): ContributionLevel {
  if (
    rawLevel === 0 ||
    rawLevel === 1 ||
    rawLevel === 2 ||
    rawLevel === 3 ||
    rawLevel === 4
  ) {
    return rawLevel;
  }
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
}

export const ActivityStatusBento: FC = () => {
  const [days, setDays] = useState<ContributionDay[]>(() => buildFallbackContributions());
  const [dataSource, setDataSource] = useState<'loading' | 'live' | 'snapshot'>('loading');
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const { ref, isVisible } = useRevealOnScroll<HTMLElement>();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(max-width: 639px)');
    const sync = () => setIsMobileViewport(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 5000);

    fetch(CONTRIBUTIONS_API, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<ApiContributionResponse>;
      })
      .then((payload) => {
        const list = payload.contributions;
        if (!Array.isArray(list) || list.length === 0) {
          throw new Error('Empty contributions payload');
        }

        const parsed: ContributionDay[] = [];
        for (const entry of list) {
          if (typeof entry.date !== 'string') continue;
          const count =
            typeof entry.count === 'number' && Number.isFinite(entry.count) && entry.count >= 0
              ? entry.count
              : 0;
          parsed.push({
            date: entry.date,
            count,
            level: normalizeLevel(entry.level, count),
          });
        }

        if (parsed.length === 0) {
          throw new Error('No valid entries');
        }

        parsed.sort((a, b) => a.date.localeCompare(b.date));
        setDays(parsed);
        setDataSource('live');
      })
      .catch(() => {
        setDataSource('snapshot');
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const { visibleWeeks, displayedTotal, weekCount } = useMemo(() => {
    const targetWeekCount = isMobileViewport ? 22 : 52;
    const weeks: Array<Array<ContributionDay | null>> = [];

    if (days.length > 0) {
      const firstDate = new Date(`${days[0].date}T12:00:00Z`);
      const startDayOfWeek = Number.isNaN(firstDate.getTime()) ? 0 : firstDate.getUTCDay();

      let currentWeek: Array<ContributionDay | null> = Array.from(
        { length: startDayOfWeek },
        () => null,
      );

      for (const day of days) {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
          weeks.push(currentWeek);
          currentWeek = [];
        }
      }

      if (currentWeek.length > 0) {
        while (currentWeek.length < 7) currentWeek.push(null);
        weeks.push(currentWeek);
      }
    }

    const sliced = weeks.slice(-targetWeekCount);
    let total = 0;
    for (const week of sliced) {
      for (const cell of week) {
        if (cell) total += cell.count;
      }
    }

    return {
      visibleWeeks: sliced,
      displayedTotal: total,
      weekCount: sliced.length,
    };
  }, [days, isMobileViewport]);

  const statusLabel =
    dataSource === 'live'
      ? 'live'
      : dataSource === 'loading'
        ? 'syncing'
        : 'offline snapshot';

  return (
    <section
      id="activity"
      ref={ref}
      className={`reveal-block py-8 sm:py-10 ${isVisible ? 'is-visible' : ''}`}
    >
      <SectionHeader
        eyebrow="LED MATRIX"
        title="GitHub Activity"
        subtitle={`Live GitHub LED contribution matrix for @${GITHUB_USERNAME}.`}
        accentColor="mint"
      />

      {/* Full-Width LED Matrix GitHub Activity Card */}
      <article className="bento-card flex flex-col justify-between p-5 sm:p-6">
        <div>
          {/* Matrix Header */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="recessed-well flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                <LuGithub
                  className="h-4 w-4 text-[var(--theme-accent-mint)]"
                  aria-hidden="true"
                />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-[var(--theme-ink-primary)] sm:text-lg">
                  GitHub LED Matrix
                </h3>
                <p className="font-mono text-[11px] text-[var(--theme-ink-legend)]">
                  @{GITHUB_USERNAME} · {displayedTotal} contributions ({weekCount}w)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`recessed-well inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-[11px] ${
                  dataSource === 'live'
                    ? 'text-[var(--theme-accent-mint)]'
                    : 'text-[var(--theme-ink-muted)]'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    dataSource === 'live'
                      ? 'bg-[var(--theme-accent-mint-dot)]'
                      : 'bg-[var(--theme-accent-butter-dot)]'
                  }`}
                  aria-hidden="true"
                />
                <span>{statusLabel}</span>
              </span>

              <a
                href={profileData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="keycap hidden px-2.5 py-1 text-[11px] text-[var(--theme-ink-primary)] no-underline sm:inline-flex"
              >
                <span>Profile</span>
                <LuArrowUpRight
                  className="h-3 w-3 text-[var(--theme-accent-mint)]"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>

          {/* LED Grid Housing */}
          <div className="recessed-well rounded-2xl p-3 sm:p-4">
            <div
              className="grid gap-[3px] sm:gap-1"
              style={{
                gridTemplateColumns: `repeat(${Math.max(visibleWeeks.length, 1)}, minmax(0, 1fr))`,
              }}
              role="grid"
              aria-label={`GitHub contributions LED matrix for ${GITHUB_USERNAME}`}
            >
              {visibleWeeks.map((week, weekIdx) => (
                <div key={`w-${weekIdx}`} className="grid grid-rows-7 gap-[3px] sm:gap-1">
                  {week.map((day, dayIdx) => {
                    if (!day) {
                      return (
                        <span
                          key={`empty-${weekIdx}-${dayIdx}`}
                          className="aspect-square w-full rounded-[3px] opacity-0 sm:rounded-[4px]"
                          aria-hidden="true"
                        />
                      );
                    }

                    const isSelected = selectedDay?.date === day.date;
                    return (
                      <button
                        key={day.date}
                        type="button"
                        onMouseEnter={() => setSelectedDay(day)}
                        onFocus={() => setSelectedDay(day)}
                        onClick={() => setSelectedDay(day)}
                        aria-label={`${formatContributionDate(day.date)}: ${day.count} contributions`}
                        className={`aspect-square w-full cursor-pointer rounded-[3px] border transition-transform duration-100 hover:scale-125 focus-visible:scale-125 focus-visible:outline-1 focus-visible:outline-[var(--theme-ink-primary)] sm:rounded-[4px] ${
                          ledLevelStyles[day.level]
                        } ${isSelected ? 'ring-1 ring-[var(--theme-ink-primary)]' : ''}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Interactive Readout & Intensity Scale */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
          <div className="recessed-well min-w-0 flex-1 rounded-xl px-3 py-1.5 text-[var(--theme-ink-muted)]">
            {selectedDay ? (
              <span className="block truncate">
                <span className="font-semibold text-[var(--theme-accent-mint)]">
                  {selectedDay.count === 0
                    ? 'No contributions'
                    : `${selectedDay.count} contribution${selectedDay.count === 1 ? '' : 's'}`}
                </span>
                <span className="text-[var(--theme-ink-legend)]"> · </span>
                <span>{formatContributionDate(selectedDay.date)}</span>
              </span>
            ) : (
              <span className="block truncate text-[var(--theme-ink-legend)]">
                Hover or tap any LED cell to inspect date &amp; count
              </span>
            )}
          </div>

          <div
            className="flex shrink-0 items-center gap-1.5 text-[10px] text-[var(--theme-ink-legend)]"
            aria-label="Contribution intensity scale"
          >
            <span>Less</span>
            {([0, 1, 2, 3, 4] as const).map((lvl) => (
              <span
                key={lvl}
                className={`inline-block h-2.5 w-2.5 rounded-[2px] border ${ledLevelStyles[lvl]}`}
                aria-hidden="true"
              />
            ))}
            <span>More</span>
          </div>
        </div>
      </article>
    </section>
  );
};
