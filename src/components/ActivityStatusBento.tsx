import { useEffect, useMemo, useRef, useState, type FC, type KeyboardEvent } from 'react';
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

interface GridCoord {
  row: number;
  col: number;
}

export const ActivityStatusBento: FC = () => {
  const [days, setDays] = useState<ContributionDay[]>(() => buildFallbackContributions());
  const [selectedDay, setSelectedDay] = useState<ContributionDay | null>(null);
  const [activeCoord, setActiveCoord] = useState<GridCoord | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
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
      })
      .catch(() => {
        // Keep fallback snapshot contributions on fetch error
      })
      .finally(() => {
        window.clearTimeout(timeoutId);
      });

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const { rows, displayedTotal, weekCount, defaultCoord } = useMemo(() => {
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
    const numCols = sliced.length;
    const matrixRows: Array<Array<ContributionDay | null>> = Array.from({ length: 7 }, (_, rowIdx) =>
      Array.from({ length: numCols }, (_, colIdx) => sliced[colIdx]?.[rowIdx] ?? null),
    );

    let total = 0;
    let lastCoord: GridCoord | null = null;
    for (let col = 0; col < numCols; col++) {
      for (let row = 0; row < 7; row++) {
        const cell = matrixRows[row][col];
        if (cell) {
          total += cell.count;
          lastCoord = { row, col };
        }
      }
    }

    return {
      rows: matrixRows,
      displayedTotal: total,
      weekCount: numCols,
      defaultCoord: lastCoord,
    };
  }, [days, isMobileViewport]);

  // Keep mobile horizontal scroller positioned at the most recent weeks initially.
  useEffect(() => {
    const scroller = scrollContainerRef.current;
    if (!scroller || !isMobileViewport) return;
    scroller.scrollLeft = scroller.scrollWidth;
  }, [isMobileViewport, weekCount]);

  const resolvedActiveCoord = useMemo(() => {
    if (
      activeCoord &&
      rows[activeCoord.row]?.[activeCoord.col] !== null &&
      rows[activeCoord.row]?.[activeCoord.col] !== undefined
    ) {
      return activeCoord;
    }
    return defaultCoord;
  }, [activeCoord, rows, defaultCoord]);

  const moveFocusTo = (row: number, col: number) => {
    const day = rows[row]?.[col];
    if (!day) return;
    setActiveCoord({ row, col });
    setSelectedDay(day);
    const btn = gridRef.current?.querySelector<HTMLButtonElement>(
      `[data-grid-row="${row}"][data-grid-col="${col}"]`,
    );
    btn?.focus();
  };

  const findNextValid = (
    startRow: number,
    startCol: number,
    dRow: number,
    dCol: number,
  ): GridCoord | null => {
    let r = startRow + dRow;
    let c = startCol + dCol;
    while (r >= 0 && r < 7 && c >= 0 && c < weekCount) {
      if (rows[r][c]) return { row: r, col: c };
      r += dRow;
      c += dCol;
    }
    return null;
  };

  const handleCellKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    row: number,
    col: number,
  ) => {
    let target: GridCoord | null = null;

    if (event.key === 'ArrowRight') {
      target = findNextValid(row, col, 0, 1);
    } else if (event.key === 'ArrowLeft') {
      target = findNextValid(row, col, 0, -1);
    } else if (event.key === 'ArrowDown') {
      target = findNextValid(row, col, 1, 0);
    } else if (event.key === 'ArrowUp') {
      target = findNextValid(row, col, -1, 0);
    } else if (event.key === 'Home') {
      if (event.ctrlKey) {
        outer: for (let c = 0; c < weekCount; c++) {
          for (let r = 0; r < 7; r++) {
            if (rows[r][c]) {
              target = { row: r, col: c };
              break outer;
            }
          }
        }
      } else {
        for (let c = 0; c < weekCount; c++) {
          if (rows[row][c]) {
            target = { row, col: c };
            break;
          }
        }
      }
    } else if (event.key === 'End') {
      if (event.ctrlKey) {
        outer: for (let c = weekCount - 1; c >= 0; c--) {
          for (let r = 6; r >= 0; r--) {
            if (rows[r][c]) {
              target = { row: r, col: c };
              break outer;
            }
          }
        }
      } else {
        for (let c = weekCount - 1; c >= 0; c--) {
          if (rows[row][c]) {
            target = { row, col: c };
            break;
          }
        }
      }
    } else {
      return;
    }

    event.preventDefault();
    if (target) {
      moveFocusTo(target.row, target.col);
    }
  };

  return (
    <section
      id="activity"
      ref={ref}
      className={`reveal-block py-8 sm:py-10 ${isVisible ? 'is-visible' : ''}`}
    >
      <SectionHeader
        eyebrow="LED MATRIX"
        title="GitHub Activity"
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
                <p className="font-mono text-xs text-[var(--theme-ink-legend)]">
                  @{GITHUB_USERNAME} · {displayedTotal} contributions ({weekCount}w)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={profileData.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="keycap hidden min-h-[36px] px-2.5 py-1 text-xs text-[var(--theme-ink-primary)] no-underline sm:inline-flex"
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
          <div
            ref={scrollContainerRef}
            className="recessed-well overflow-x-auto rounded-2xl p-3 sm:overflow-visible sm:p-4"
          >
            <div
              ref={gridRef}
              className="flex w-max flex-col gap-1.5 sm:w-full sm:gap-1"
              role="grid"
              aria-label={`GitHub contributions LED matrix for ${GITHUB_USERNAME}. Use arrow keys to move across days.`}
            >
              {rows.map((rowDays, rowIdx) => (
                <div
                  key={`r-${rowIdx}`}
                  role="row"
                  className="grid gap-1.5 sm:gap-1"
                  style={{
                    gridTemplateColumns: isMobileViewport
                      ? `repeat(${Math.max(weekCount, 1)}, 1.75rem)`
                      : `repeat(${Math.max(weekCount, 1)}, minmax(0, 1fr))`,
                  }}
                >
                  {rowDays.map((day, colIdx) => {
                    if (!day) {
                      return (
                        <span
                          key={`empty-${rowIdx}-${colIdx}`}
                          role="gridcell"
                          aria-hidden="true"
                          className="h-7 w-7 rounded-[4px] opacity-0 sm:aspect-square sm:h-auto sm:w-full"
                        />
                      );
                    }

                    const isSelected = selectedDay?.date === day.date;
                    const isRovingActive =
                      resolvedActiveCoord?.row === rowIdx &&
                      resolvedActiveCoord?.col === colIdx;

                    return (
                      <div key={day.date} role="gridcell" className="flex">
                        <button
                          type="button"
                          tabIndex={isRovingActive ? 0 : -1}
                          data-grid-row={rowIdx}
                          data-grid-col={colIdx}
                          onMouseEnter={() => setSelectedDay(day)}
                          onFocus={() => {
                            setActiveCoord({ row: rowIdx, col: colIdx });
                            setSelectedDay(day);
                          }}
                          onClick={() => {
                            setActiveCoord({ row: rowIdx, col: colIdx });
                            setSelectedDay(day);
                          }}
                          onKeyDown={(e) => handleCellKeyDown(e, rowIdx, colIdx)}
                          aria-label={`${formatContributionDate(day.date)}: ${day.count} contributions`}
                          aria-pressed={isSelected}
                          className={`h-7 w-7 cursor-pointer rounded-[4px] border transition-transform duration-100 hover:scale-125 focus-visible:scale-125 focus-visible:outline-2 focus-visible:outline-[var(--theme-ink-primary)] motion-reduce:transition-none motion-reduce:hover:scale-100 motion-reduce:focus-visible:scale-100 sm:aspect-square sm:h-auto sm:w-full ${
                            ledLevelStyles[day.level]
                          } ${isSelected ? 'ring-1 ring-[var(--theme-ink-primary)]' : ''}`}
                        />
                      </div>
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
                Hover, tap, or use arrow keys on LED cells to inspect date &amp; count
              </span>
            )}
          </div>

          <div
            className="flex shrink-0 items-center gap-1.5 text-[11px] text-[var(--theme-ink-legend)]"
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
