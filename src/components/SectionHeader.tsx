import type { FC } from 'react';

interface SectionHeaderProps {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  accentColor?: 'mint' | 'butter' | 'pink' | 'sky';
}

const accentDotMap: Record<NonNullable<SectionHeaderProps['accentColor']>, string> = {
  mint: 'bg-[var(--theme-accent-mint-dot)]',
  butter: 'bg-[var(--theme-accent-butter-dot)]',
  pink: 'bg-[var(--theme-accent-pink-dot)]',
  sky: 'bg-[var(--theme-accent-sky-dot)]',
};

export const SectionHeader: FC<SectionHeaderProps> = ({
  eyebrow,
  title,
  subtitle,
  accentColor = 'mint',
}) => {
  return (
    <div className="mb-6 flex flex-col gap-1.5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-1.5 flex items-center gap-2 font-mono text-xs tracking-wider text-[var(--theme-ink-legend)]">
          <span
            className={`inline-block h-2 w-2 rounded-full ${accentDotMap[accentColor]}`}
            aria-hidden="true"
          />
          <span>{eyebrow}</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[var(--theme-ink-primary)] sm:text-3xl">
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="max-w-md text-sm text-[var(--theme-ink-muted)] sm:text-right">{subtitle}</p>
      ) : null}
    </div>
  );
};
