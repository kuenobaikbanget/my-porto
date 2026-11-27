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
  liveDotClass: string;
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
    badgeClass: 'text-[#b9a7c9]',
    liveDotClass: 'bg-[#c6e3d1]',
    bubbleClass: 'border-[#493364] bg-[#2b1d3a] text-[#cfe0f2]',
    artClass: 'text-[#b9a7c9]',
    logClass: 'text-[#8e71a2]',
    terminalBorderClass: 'border-[#3d2a54]',
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
    badgeClass: 'text-[#c6e3d1]',
    liveDotClass: 'bg-[#c6e3d1]',
    bubbleClass: 'border-[#c6e3d1]/45 bg-[#2b1d3a] text-[#c6e3d1]',
    artClass: 'text-[#f3edf7]',
    logClass: 'text-[#c6e3d1]',
    terminalBorderClass: 'border-[#493364]',
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
    badgeClass: 'text-[#f3e6a2]',
    liveDotClass: 'bg-[#f3e6a2]',
    bubbleClass: 'border-[#f3e6a2]/45 bg-[#2b1d3a] text-[#f3e6a2]',
    artClass: 'text-[#f3edf7]',
    logClass: 'text-[#f3e6a2]',
    terminalBorderClass: 'border-[#f3e6a2]/35',
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
    badgeClass: 'text-[#eed2df]',
    liveDotClass: 'bg-[#f3e6a2]',
    bubbleClass: 'border-[#eed2df]/50 bg-[#2b1d3a] text-[#eed2df]',
    artClass: 'text-[#eed2df]',
    logClass: 'text-[#f3e6a2]',
    terminalBorderClass: 'border-[#eed2df]/45',
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
    badgeClass: 'text-[#eed2df]',
    liveDotClass: 'bg-[#eed2df]',
    bubbleClass: 'border-[#eed2df]/75 bg-[#362039] text-[#f3e6a2]',
    artClass: 'text-[#f3e6a2]',
    logClass: 'text-[#eed2df]',
    terminalBorderClass: 'border-[#eed2df]/65',
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

  return (
    <div className="bento-card flex h-full flex-col justify-between p-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <span className={`font-mono text-[11px] font-medium ${current.badgeClass}`}>
          {current.code}
        </span>
        <span className="recessed-well rounded-md px-2 py-0.5 font-mono text-[11px] text-[#f3e6a2]">
          POKE ×{pokes}
        </span>
      </div>

      {/* Interactive Terminal Screen */}
      <button
        type="button"
        onClick={handleInteract}
        aria-label={`Interactive terminal cat, currently ${current.mood}: ${current.bubble}. Click to interact.`}
        className={`group my-4 flex flex-1 cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border bg-[#170e1f] text-left shadow-[inset_0_2px_6px_rgba(0,0,0,0.5)] transition-colors hover:border-[#8e71a2] focus-visible:outline-2 focus-visible:outline-[#c6e3d1] ${current.terminalBorderClass}`}
      >
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between border-b border-[#302043] bg-[#1d1228] px-3 py-2 font-mono text-[10px] text-[#8e71a2]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-[#eed2df]/75" />
              <span className="h-2 w-2 rounded-full bg-[#f3e6a2]/75" />
              <span className="h-2 w-2 rounded-full bg-[#c6e3d1]/75" />
            </div>
            <span className="inline-flex items-center gap-1 rounded bg-[#140c1c] px-1.5 py-0.5 text-[9px] font-semibold tracking-wider text-[#b9a7c9]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${current.liveDotClass}`}
                aria-hidden="true"
              />
              LIVE
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-[#b9a7c9]">
            <LuTerminal className="h-3 w-3 text-[#8e71a2]" aria-hidden="true" />
            <span>~/cat.tty</span>
          </span>
        </div>

        {/* Terminal Stage */}
        <div className="flex flex-1 flex-col items-center justify-center px-3 py-4">
          <div
            key={`bubble-${stageIndex}-${pokes}`}
            className={`mb-2.5 inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-medium shadow-[0_2px_0_#110a18] ${
              pokes > 0 ? 'bubble-pop' : ''
            } ${current.bubbleClass}`}
          >
            <span className="text-[#8e71a2]" aria-hidden="true">
              $
            </span>
            <span className="truncate">{current.bubble}</span>
          </div>

          <div key={`cat-${stageIndex}-${pokes}`} className={reactionClass}>
            <pre
              className={`m-0 select-none whitespace-pre font-mono text-xs leading-tight sm:text-[13px] ${current.artClass}`}
              aria-hidden="true"
            >
              {activeAscii}
            </pre>
          </div>
        </div>

        {/* Live Terminal Log & Prompt Footer */}
        <div className="border-t border-[#302043]/80 bg-[#140c1c] px-3 py-2 font-mono text-[11px] leading-snug">
          <div className={`truncate ${current.logClass}`}>
            <span className="text-[#8e71a2]" aria-hidden="true">
              &gt;{' '}
            </span>
            <span>{current.formatLog(pokes)}</span>
          </div>
          <div className="mt-0.5 flex items-center text-[#8e71a2]">
            <span>kueno@tty:~$&nbsp;</span>
            <span className="tty-cursor text-[#c6e3d1]" aria-hidden="true">
              █
            </span>
          </div>
        </div>
      </button>

      {/* Bottom Deskmat Tag */}
      <div className="flex items-center justify-between font-mono text-[11px] text-[#b9a7c9]">
        <span>Tuxedo Desk Companion</span>
        <span className="text-[#8e71a2]">click</span>
      </div>
    </div>
  );
};
