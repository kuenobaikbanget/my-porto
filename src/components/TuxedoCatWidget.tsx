import { useEffect, useState, type FC } from 'react';
import { LuTerminal } from 'react-icons/lu';

type CatMood = 'sleepy' | 'meow' | 'alert' | 'annoyed' | 'angry';

interface CatStage {
  mood: CatMood;
  code: string;
  bubble: string;
  intervalMs: number;
  reactionType: 'hop' | 'shake';
  badgeClass: string;
  bubbleClass: string;
  artClass: string;
  logClass: string;
  terminalBorderClass: string;
  frames: string[];
  formatLog: (pokes: number) => string;
}

// Every line in every frame is padded to exact 18 characters (4 lines each)
// so the <pre> terminal container never shifts width or height.
const stages: CatStage[] = [
  {
    mood: 'sleepy',
    code: 'CAT.EXE // SLEEPY',
    bubble: 'zzz...',
    intervalMs: 680,
    reactionType: 'hop',
    badgeClass: 'text-[var(--theme-ink-muted)]',
    bubbleClass:
      'border-[var(--theme-border-strong)] bg-[var(--theme-cat-bubble-bg)] text-[var(--theme-accent-sky)]',
    artClass: 'text-[var(--theme-ink-muted)]',
    logClass: 'text-[var(--theme-ink-legend)]',
    terminalBorderClass: 'border-[var(--theme-terminal-border)]',
    formatLog: (pokes) =>
      pokes === 0 ? 'idle: cat sleeping on deskmat' : `poke #${pokes}: reset -> sleeping`,
    frames: [
      [
        '    /\\_/\\    z    ',
        '   ( -.- )  .     ',
        '   />   <\\        ',
        '  (_|___|_)/~     ',
      ].join('\n'),
      [
        '    /\\_/\\    zZ   ',
        '   ( -.- )  .     ',
        "   />   <\\   '    ",
        '  (_|___|_)~      ',
      ].join('\n'),
      [
        '    /\\_/\\    zZz  ',
        '   ( -.- ) .      ',
        "   />   <\\  '     ",
        '  (_|___|_)/~     ',
      ].join('\n'),
    ],
  },
  {
    mood: 'meow',
    code: 'CAT.EXE // MEOW',
    bubble: 'meow',
    intervalMs: 540,
    reactionType: 'hop',
    badgeClass: 'text-[var(--theme-accent-mint)]',
    bubbleClass:
      'border-[var(--theme-accent-mint-border)] bg-[var(--theme-cat-bubble-bg)] text-[var(--theme-accent-mint)]',
    artClass: 'text-[var(--theme-ink-primary)]',
    logClass: 'text-[var(--theme-accent-mint)]',
    terminalBorderClass: 'border-[var(--theme-border-strong)]',
    formatLog: (pokes) => `poke #${pokes}: "meow"`,
    frames: [
      [
        '    /\\_/\\     ?   ',
        '   ( o.o )        ',
        '   />   <\\        ',
        '  (_|___|_)/~     ',
      ].join('\n'),
      [
        '    /\\_/\\     ?   ',
        '   ( o.o )        ',
        '   />   <\\   ~    ',
        '  (_|___|_) \\~    ',
      ].join('\n'),
      [
        '    /\\_/\\         ',
        '   ( -.- )        ',
        '   />   <\\        ',
        '  (_|___|_)/      ',
      ].join('\n'),
    ],
  },
  {
    mood: 'alert',
    code: 'CAT.EXE // ALERT',
    bubble: 'meow meow',
    intervalMs: 480,
    reactionType: 'hop',
    badgeClass: 'text-[var(--theme-accent-butter)]',
    bubbleClass:
      'border-[var(--theme-accent-butter-border)] bg-[var(--theme-cat-bubble-bg)] text-[var(--theme-accent-butter)]',
    artClass: 'text-[var(--theme-ink-primary)]',
    logClass: 'text-[var(--theme-accent-butter)]',
    terminalBorderClass: 'border-[var(--theme-accent-butter-border)]',
    formatLog: (pokes) => `poke #${pokes}: "meow meow"`,
    frames: [
      [
        '    /\\_/\\     !   ',
        '   ( ^.^ )  ~     ',
        '   />   <\\        ',
        '  (_|___|_) /     ',
      ].join('\n'),
      [
        '    /\\_/\\     !   ',
        '   ( ^.^ )        ',
        '   />   <\\  ~     ',
        '  (_|___|_)(      ',
      ].join('\n'),
      [
        '    /\\_/\\     ~   ',
        '   ( -.- )        ',
        '   />   <\\        ',
        '  (_|___|_) )     ',
      ].join('\n'),
    ],
  },
  {
    mood: 'annoyed',
    code: 'CAT.EXE // ANNOYED',
    bubble: 'meow?! stop poking',
    intervalMs: 420,
    reactionType: 'shake',
    badgeClass: 'text-[var(--theme-accent-pink)]',
    bubbleClass:
      'border-[var(--theme-accent-pink-border)] bg-[var(--theme-cat-bubble-bg)] text-[var(--theme-accent-pink)]',
    artClass: 'text-[var(--theme-accent-pink)]',
    logClass: 'text-[var(--theme-accent-butter)]',
    terminalBorderClass: 'border-[var(--theme-accent-pink-border)]',
    formatLog: (pokes) => `poke #${pokes}: WARN: stop poking`,
    frames: [
      [
        '    /\\_/\\    ...  ',
        '   ( -_- )        ',
        '   />   <\\        ',
        '  (_|___|_)-      ',
      ].join('\n'),
      [
        '    /\\_/\\    ..   ',
        '   ( -_- )        ',
        '   />   <\\   _    ',
        '  (_|___|_)/      ',
      ].join('\n'),
      [
        '    /\\_/\\    ...  ',
        '   ( >_- )        ',
        '   />   <\\        ',
        '  (_|___|_)`-     ',
      ].join('\n'),
    ],
  },
  {
    mood: 'angry',
    code: 'CAT.EXE // ANGRY',
    bubble: 'HISSS!! >:(',
    intervalMs: 280,
    reactionType: 'shake',
    badgeClass: 'text-[var(--theme-accent-pink)]',
    bubbleClass:
      'border-[var(--theme-accent-pink-border)] bg-[var(--theme-cat-angry-bubble-bg)] text-[var(--theme-accent-butter)]',
    artClass: 'text-[var(--theme-accent-butter)]',
    logClass: 'text-[var(--theme-accent-pink)]',
    terminalBorderClass: 'border-[var(--theme-accent-pink-border)]',
    formatLog: (pokes) => `poke #${pokes}: ERR: HISSS!! >:(`,
    frames: [
      [
        '   /\\___/\\   !!   ',
        '  ( >_< )   *     ',
        '  /|   |\\  ~      ',
        ' (_|___|_)/!      ',
      ].join('\n'),
      [
        '   /\\___/\\    !   ',
        '  ( >_< )  *      ',
        '  /|   |\\   ~     ',
        ' (_|___|_)\\!      ',
      ].join('\n'),
      [
        '  ^/\\___/\\^  !!   ',
        '  ( >_< )   #     ',
        '  /|   |\\  !      ',
        ' (_|___|_)/~      ',
      ].join('\n'),
    ],
  },
];

export const TuxedoCatWidget: FC = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [frameIndex, setFrameIndex] = useState(0);
  const [pokes, setPokes] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const current = stages[stageIndex];

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setFrameIndex(0);
      return;
    }

    const timer = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % current.frames.length);
    }, current.intervalMs);

    return () => window.clearInterval(timer);
  }, [current.frames.length, current.intervalMs, reducedMotion]);

  const handleInteract = () => {
    setStageIndex((prev) => (prev + 1) % stages.length);
    setFrameIndex(0);
    setPokes((prev) => prev + 1);
  };

  const activeAscii = current.frames[frameIndex % current.frames.length];
  const reactionClass =
    pokes === 0 ? '' : current.reactionType === 'shake' ? 'cat-shake' : 'cat-hop';
  const showPokeCursor = pokes > 0 && current.mood !== 'sleepy';

  return (
    <div className="bento-card flex h-full flex-col justify-between p-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <span className={`font-mono text-[11px] font-medium ${current.badgeClass}`}>
          {current.code}
        </span>
        <span className="recessed-well rounded-md px-2 py-0.5 font-mono text-[11px] text-[var(--theme-accent-butter)]">
          POKE ×{pokes}
        </span>
      </div>

      {/* Interactive Terminal Screen */}
      <button
        type="button"
        onClick={handleInteract}
        aria-label={`Interactive terminal cat, currently ${current.mood}: ${current.bubble}. Click to interact.`}
        className={`group my-4 flex flex-1 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border bg-[var(--theme-terminal-bg)] text-left shadow-[inset_0_2px_6px_var(--theme-terminal-shadow)] transition-colors hover:border-[var(--theme-ink-legend)] focus-visible:outline-2 focus-visible:outline-[var(--theme-accent-mint)] motion-reduce:transition-none ${current.terminalBorderClass}`}
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border-well)] bg-[var(--theme-terminal-bar)] px-3 py-2 font-mono text-[11px] text-[var(--theme-ink-legend)]">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[var(--theme-accent-pink-dot)] opacity-80" />
            <span className="h-2 w-2 rounded-full bg-[var(--theme-accent-butter-dot)] opacity-80" />
            <span className="h-2 w-2 rounded-full bg-[var(--theme-accent-mint-dot)] opacity-80" />
          </div>
          <span className="inline-flex items-center gap-1 text-[var(--theme-ink-muted)]">
            <LuTerminal className="h-3 w-3 text-[var(--theme-ink-legend)]" aria-hidden="true" />
            <span>~/cat.tty</span>
          </span>
        </div>

        {/* Terminal Stage */}
        <div className="flex flex-1 flex-col items-center justify-center px-3 py-4">
          <div
            key={`bubble-${stageIndex}-${pokes}`}
            className={`mb-2.5 inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-medium shadow-[0_2px_0_var(--theme-bevel)] ${
              pokes > 0 ? 'bubble-pop' : ''
            } ${current.bubbleClass}`}
          >
            <span className="text-[var(--theme-ink-legend)]" aria-hidden="true">
              $
            </span>
            <span className="truncate">{current.bubble}</span>
          </div>

          <div key={`cat-${stageIndex}-${pokes}`} className={`max-w-full overflow-x-auto ${reactionClass}`}>
            <pre
              className={`m-0 select-none whitespace-pre font-mono text-xs leading-snug sm:text-[13px] ${current.artClass}`}
              aria-hidden="true"
            >
              {activeAscii}
            </pre>
          </div>
        </div>

        {/* Live Terminal Log & Prompt Footer */}
        <div className="border-t border-[var(--theme-border-well)]/80 bg-[var(--theme-terminal-footer)] px-3 py-2 font-mono text-[11px] leading-snug">
          <div className={`truncate ${current.logClass}`}>
            <span className="text-[var(--theme-ink-legend)]" aria-hidden="true">
              &gt;{' '}
            </span>
            <span>{current.formatLog(pokes)}</span>
          </div>
          <div className="mt-0.5 flex items-center text-[var(--theme-ink-legend)]">
            <span>kueno@tty:~$&nbsp;</span>
            <span
              key={`cursor-${pokes}`}
              className={`${
                showPokeCursor ? 'tty-cursor ' : 'opacity-75 '
              }text-[var(--theme-accent-mint)]`}
              aria-hidden="true"
            >
              █
            </span>
          </div>
        </div>
      </button>

      {/* Bottom Deskmat Tag */}
      <div className="flex items-center justify-end font-mono text-[11px]">
        <span className="text-[var(--theme-ink-legend)]">click</span>
      </div>
    </div>
  );
};
