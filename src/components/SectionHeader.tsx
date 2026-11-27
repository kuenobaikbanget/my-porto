import type { FC } from 'react';

interface SectionHeaderProps {
  id?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  accentColor?: 'mint' | 'butter' | 'pink' | 'sky';
}

const accentDotMap: Record<NonNullable<SectionHeaderProps['accentColor']>, string> = {
  mint: 'bg-[#c6e3d1]',
  butter: 'bg-[#f3e6a2]',
  pink: 'bg-[#eed2df]',
  sky: 'bg-[#cfe0f2]',
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
        <div className="mb-1.5 flex items-center gap-2 font-mono text-xs tracking-wider text-[#8e71a2]">
          <span
            className={`inline-block h-2 w-2 rounded-full ${accentDotMap[accentColor]}`}
            aria-hidden="true"
          />
          <span>{eyebrow}</span>
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-[#f3edf7] sm:text-3xl">
          {title}
        </h2>
      </div>
      {subtitle ? (
        <p className="max-w-md text-sm text-[#b9a7c9] sm:text-right">{subtitle}</p>
      ) : null}
    </div>
  );
};
