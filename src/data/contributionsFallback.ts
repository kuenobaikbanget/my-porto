export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
}

/**
 * Deterministic fallback snapshot of 365 days ending at today's local date
 * when the live GitHub contributions API is unreachable or rate-limited.
 */
export function buildFallbackContributions(): ContributionDay[] {
  const days: ContributionDay[] = [];
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  for (let offset = 364; offset >= 0; offset -= 1) {
    const d = new Date(today);
    d.setDate(today.getDate() - offset);
    const iso = d.toISOString().slice(0, 10);

    // Deterministic pseudo-random pattern weighted toward active weekday coding
    const dayOfWeek = d.getDay();
    const seed = (offset * 37 + dayOfWeek * 13 + d.getMonth() * 19) % 29;
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    let count = 0;
    if (isWeekend) {
      if (seed >= 23) count = 3;
      else if (seed >= 18) count = 1;
    } else if (seed >= 24) {
      count = 6 + (seed % 4);
    } else if (seed >= 17) {
      count = 3 + (seed % 3);
    } else if (seed >= 9) {
      count = 1 + (seed % 2);
    }

    const level: ContributionLevel =
      count === 0 ? 0 : count <= 2 ? 1 : count <= 4 ? 2 : count <= 6 ? 3 : 4;

    days.push({ date: iso, count, level });
  }

  return days;
}
