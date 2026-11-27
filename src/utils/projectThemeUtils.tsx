import type { ReactNode } from 'react';
import { LuCpu, LuSmartphone, LuTerminal } from 'react-icons/lu';
import type { ProjectAccent } from '../data/projects';

export const accentBadgeStyles: Record<ProjectAccent, string> = {
  butter:
    'border-[var(--theme-accent-butter-border)] bg-[var(--theme-accent-butter-bg)] text-[var(--theme-accent-butter)]',
  mint: 'border-[var(--theme-accent-mint-border)] bg-[var(--theme-accent-mint-bg)] text-[var(--theme-accent-mint)]',
  pink: 'border-[var(--theme-accent-pink-border)] bg-[var(--theme-accent-pink-bg)] text-[var(--theme-accent-pink)]',
};

export const accentDotStyles: Record<ProjectAccent, string> = {
  butter: 'bg-[var(--theme-accent-butter-dot)]',
  mint: 'bg-[var(--theme-accent-mint-dot)]',
  pink: 'bg-[var(--theme-accent-pink-dot)]',
};

export function renderProjectIcon(id: string, sizeClass = 'h-4 w-4'): ReactNode {
  if (id === 'opspilot') {
    return (
      <LuTerminal
        className={`${sizeClass} text-[var(--theme-accent-butter)]`}
        aria-hidden="true"
      />
    );
  }
  if (id === 'finnote') {
    return (
      <LuSmartphone
        className={`${sizeClass} text-[var(--theme-accent-mint)]`}
        aria-hidden="true"
      />
    );
  }
  return (
    <LuCpu
      className={`${sizeClass} text-[var(--theme-accent-pink)]`}
      aria-hidden="true"
    />
  );
}
