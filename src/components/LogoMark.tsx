import type { FC } from 'react';

/**
 * kueno tuxedo cat mark (logo B) — inline SVG, inherits `currentColor`
 * so it follows the active theme automatically.
 * Master file: public/logo/kueno-symbol.svg
 */
export const LogoMark: FC<{ className?: string; title?: string }> = ({
  className,
  title = 'kueno — tuxedo cat',
}) => (
  <svg
    viewBox="0 0 256 256"
    className={className}
    role="img"
    aria-label={title}
    fill="currentColor"
    aria-hidden={title ? undefined : true}
  >
    {title ? <title>{title}</title> : null}
    <path
      fillRule="evenodd"
      d="M 62 92 L 80 42 L 114 88 Q 128 100 142 88 L 176 42 L 194 92
         Q 212 92 212 112 L 212 176 Q 212 212 176 212 L 80 212
         Q 44 212 44 176 L 44 112 Q 44 92 62 92 Z
         M 84 128 h 26 v 26 h -26 Z
         M 146 128 h 26 v 26 h -26 Z
         M 120 168 L 136 168 L 128 180 Z
         M 78 76 L 85 58 L 93 74 Z
         M 163 74 L 171 58 L 178 76 Z"
    />
  </svg>
);
