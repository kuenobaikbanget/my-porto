import { useState, type FC } from 'react';
import { LuTerminal } from 'react-icons/lu';

type CatMood = 'sleepy' | 'meow' | 'perked' | 'annoyed' | 'angry';

interface CatStage {
  mood: CatMood;
  code: string;
  bubble: string;
  caption: string;
  badgeClass: string;
  bubbleClass: string;
  artClass: string;
  terminalBorderClass: string;
  ascii: string;
}

const stages: CatStage[] = [
  {
    mood: 'sleepy',
    code: 'CAT.EXE // SLEEPY',
    bubble: 'zzz...',
    caption: 'napping on the deskmat',
    badgeClass: 'text-[#b9a7c9]',
    bubbleClass: 'border-[#493364] bg-[#2b1d3a] text-[#cfe0f2]',
    artClass: 'text-[#b9a7c9]',
    terminalBorderClass: 'border-[#3d2a54]',
    ascii: [
      '    /\\_/\\     zZz',
      '   ( -.- )  .',
      '   />   <\\',
      '  (_|___|_)/~',
    ].join('\n'),
  },
  {
    mood: 'meow',
    code: 'CAT.EXE // MEOW',
    bubble: 'meow',
    caption: 'heard a switch click',
    badgeClass: 'text-[#c6e3d1]',
    bubbleClass: 'border-[#c6e3d1]/45 bg-[#2b1d3a] text-[#c6e3d1]',
    artClass: 'text-[#f3edf7]',
    terminalBorderClass: 'border-[#493364]',
    ascii: [
      '    /\\_/\\      ?',
      '   ( o.o )',
      '   />   <\\',
      '  (_|___|_)/~',
    ].join('\n'),
  },
  {
    mood: 'perked',
    code: 'CAT.EXE // ALERT',
    bubble: 'meow meow',
    caption: 'demanding attention',
    badgeClass: 'text-[#f3e6a2]',
    bubbleClass: 'border-[#f3e6a2]/45 bg-[#2b1d3a] text-[#f3e6a2]',
    artClass: 'text-[#f3edf7]',
    terminalBorderClass: 'border-[#f3e6a2]/35',
    ascii: [
      '    /\\_/\\      !',
      '   ( ^.^ )  ~',
      '   />   <\\',
      '  (_|___|_) /',
    ].join('\n'),
  },
  {
    mood: 'annoyed',
    code: 'CAT.EXE // ANNOYED',
    bubble: 'meow?! stop poking',
    caption: 'tail flicking warning',
    badgeClass: 'text-[#eed2df]',
    bubbleClass: 'border-[#eed2df]/50 bg-[#2b1d3a] text-[#eed2df]',
    artClass: 'text-[#eed2df]',
    terminalBorderClass: 'border-[#eed2df]/40',
    ascii: [
      '    /\\_/\\     ...',
      '   ( -_- )',
      '   />   <\\',
      '  (_|___|_)-',
    ].join('\n'),
  },
  {
    mood: 'angry',
    code: 'CAT.EXE // ANGRY',
    bubble: 'HISSS!! >:(',
    caption: 'one more click to reset',
    badgeClass: 'text-[#eed2df]',
    bubbleClass: 'border-[#eed2df]/75 bg-[#362039] text-[#f3e6a2]',
    artClass: 'text-[#f3e6a2]',
    terminalBorderClass: 'border-[#eed2df]/65',
    ascii: [
      '   /\\___/\\    !!',
      '  ( >_< )   *',
      '  /|   |\\  ~',
      ' (_|___|_)/!',
    ].join('\n'),
  },
];

export const TuxedoCatWidget: FC = () => {
  const [stageIndex, setStageIndex] = useState(0);
  const [pokes, setPokes] = useState(0);

  const current = stages[stageIndex];

  const handleInteract = () => {
    setStageIndex((prev) => (prev + 1) % stages.length);
    setPokes((prev) => prev + 1);
  };

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
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2 w-2 rounded-full bg-[#eed2df]/75" />
            <span className="h-2 w-2 rounded-full bg-[#f3e6a2]/75" />
            <span className="h-2 w-2 rounded-full bg-[#c6e3d1]/75" />
          </div>
          <span className="inline-flex items-center gap-1 text-[#b9a7c9]">
            <LuTerminal className="h-3 w-3 text-[#8e71a2]" aria-hidden="true" />
            <span>~/cat.tty</span>
          </span>
        </div>

        {/* Terminal Body */}
        <div className="flex flex-1 flex-col items-center justify-center px-3 py-4">
          <div
            className={`mb-3 inline-flex max-w-full items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-medium shadow-[0_2px_0_#110a18] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0.5 ${current.bubbleClass}`}
          >
            <span className="text-[#8e71a2]" aria-hidden="true">
              $
            </span>
            <span className="truncate">{current.bubble}</span>
          </div>

          <pre
            className={`m-0 select-none whitespace-pre font-mono text-xs leading-tight transition-transform duration-150 group-hover:scale-[1.03] group-active:translate-y-0.5 sm:text-[13px] ${current.artClass}`}
            aria-hidden="true"
          >
            {current.ascii}
          </pre>
        </div>

        {/* Terminal Prompt Footer */}
        <div className="border-t border-[#302043]/80 bg-[#140c1c] px-3 py-1.5 text-center font-mono text-[11px] text-[#8e71a2]">
          {current.caption}
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
