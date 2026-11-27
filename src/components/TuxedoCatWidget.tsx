import { useState, type FC } from 'react';
import { LuCoffee, LuCpu, LuSparkles } from 'react-icons/lu';

type CatMood = 'sleepy' | 'purr' | 'awake';

const moodOrder: CatMood[] = ['sleepy', 'purr', 'awake'];

const moodMeta: Record<
  CatMood,
  { code: string; bubble: string; hint: string; badgeClass: string }
> = {
  sleepy: {
    code: 'CAT.EXE // SLEEPY',
    bubble: 'zZz...',
    hint: 'Click to wake or pet',
    badgeClass: 'text-[#b9a7c9]',
  },
  purr: {
    code: 'CAT.EXE // PURR',
    bubble: 'prrr~',
    hint: 'Happy desk supervisor',
    badgeClass: 'text-[#eed2df]',
  },
  awake: {
    code: 'CAT.EXE // ALERT',
    bubble: 'esp32 + v60!',
    hint: 'Ready to debug Linux',
    badgeClass: 'text-[#c6e3d1]',
  },
};

export const TuxedoCatWidget: FC = () => {
  const [moodIndex, setMoodIndex] = useState(0);
  const [pets, setPets] = useState(0);

  const mood = moodOrder[moodIndex];
  const meta = moodMeta[mood];

  const handleInteract = () => {
    setMoodIndex((prev) => (prev + 1) % moodOrder.length);
    setPets((prev) => prev + 1);
  };

  return (
    <div className="bento-card flex h-full flex-col justify-between p-5">
      {/* Top Bar */}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[11px] font-medium text-[#8e71a2]">
          <span aria-hidden="true">ネコ // </span>
          <span className={meta.badgeClass}>{meta.code}</span>
        </span>
        <span className="recessed-well rounded-md px-2 py-0.5 font-mono text-[11px] text-[#f3e6a2]">
          PET ×{pets}
        </span>
      </div>

      {/* Interactive Cat Deskmat Well */}
      <button
        type="button"
        onClick={handleInteract}
        aria-label={`Sleepy tuxedo cat widget, currently ${mood}. Click to pet and cycle mood.`}
        className="recessed-well group my-4 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl p-4 text-center transition-colors hover:border-[#8e71a2] focus-visible:outline-2 focus-visible:outline-[#c6e3d1]"
      >
        {/* Thought Bubble */}
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-[#493364] bg-[#2b1d3a] px-3 py-1 font-mono text-xs text-[#f3edf7] shadow-[0_2px_0_#110a18] transition-transform group-hover:-translate-y-0.5 group-active:translate-y-0.5">
          {mood === 'sleepy' ? (
            <LuSparkles className="h-3.5 w-3.5 text-[#cfe0f2]" aria-hidden="true" />
          ) : mood === 'purr' ? (
            <LuCoffee className="h-3.5 w-3.5 text-[#eed2df]" aria-hidden="true" />
          ) : (
            <LuCpu className="h-3.5 w-3.5 text-[#c6e3d1]" aria-hidden="true" />
          )}
          <span>{meta.bubble}</span>
        </div>

        {/* Custom Tuxedo Cat SVG */}
        <svg
          viewBox="0 0 180 120"
          className="h-32 w-44 transition-transform duration-150 group-hover:scale-[1.02] group-active:translate-y-0.5"
          role="img"
          aria-hidden="true"
        >
          {/* Keycap Mat Base */}
          <rect
            x="16"
            y="88"
            width="148"
            height="22"
            rx="8"
            fill="#2b1d3a"
            stroke="#493364"
            strokeWidth="2"
          />
          <rect x="24" y="94" width="24" height="8" rx="3" fill="#22162e" />
          <rect x="132" y="94" width="24" height="8" rx="3" fill="#22162e" />

          {/* Tail */}
          <path
            d={
              mood === 'awake'
                ? 'M126 84 C150 78, 156 52, 144 44'
                : 'M126 86 C148 88, 156 76, 148 68'
            }
            fill="none"
            stroke="#100b14"
            strokeWidth="10"
            strokeLinecap="round"
          />
          <circle
            cx={mood === 'awake' ? 144 : 148}
            cy={mood === 'awake' ? 44 : 68}
            r="4.5"
            fill="#f3edf7"
          />

          {/* Black Body */}
          <ellipse cx="94" cy="76" rx="40" ry="20" fill="#100b14" stroke="#3d2a54" strokeWidth="1.5" />

          {/* White Tuxedo Chest Bib */}
          <path d="M62 66 Q76 92 92 78 Q80 62 62 66 Z" fill="#f3edf7" />

          {/* White Paws */}
          <ellipse cx="56" cy="89" rx="10" ry="5.5" fill="#f3edf7" />
          <ellipse cx="82" cy="90" rx="10" ry="5.5" fill="#f3edf7" />

          {/* Ears */}
          <polygon points="44,44 50,20 66,36" fill="#100b14" stroke="#3d2a54" strokeWidth="1.5" />
          <polygon points="48,40 52,25 62,36" fill="#eed2df" opacity="0.85" />
          <polygon points="78,36 92,19 98,43" fill="#100b14" stroke="#3d2a54" strokeWidth="1.5" />
          <polygon points="81,35 91,24 94,40" fill="#eed2df" opacity="0.85" />

          {/* Head */}
          <ellipse cx="71" cy="52" rx="28" ry="23" fill="#100b14" stroke="#3d2a54" strokeWidth="1.5" />

          {/* White Tuxedo Muzzle Mask */}
          <path
            d="M47 57 Q71 48 95 57 Q92 74 71 74 Q50 74 47 57 Z"
            fill="#f3edf7"
          />

          {/* Eyes based on mood */}
          {mood === 'sleepy' ? (
            <>
              <path
                d="M55 50 Q60 54 65 50"
                fill="none"
                stroke="#b9a7c9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M77 50 Q82 54 87 50"
                fill="none"
                stroke="#b9a7c9"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          ) : mood === 'purr' ? (
            <>
              <path
                d="M55 52 Q60 46 65 52"
                fill="none"
                stroke="#eed2df"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M77 52 Q82 46 87 52"
                fill="none"
                stroke="#eed2df"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <circle cx="60" cy="49" r="4.5" fill="#c6e3d1" />
              <circle cx="60" cy="49" r="2" fill="#100b14" />
              <circle cx="82" cy="49" r="4.5" fill="#c6e3d1" />
              <circle cx="82" cy="49" r="2" fill="#100b14" />
            </>
          )}

          {/* Pink Nose & Mouth */}
          <polygon points="68,57 74,57 71,61" fill="#e598b5" />
          <path
            d="M66 63 Q71 67 71 61 Q71 67 76 63"
            fill="none"
            stroke="#5b4078"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Whiskers */}
          <line x1="36" y1="56" x2="50" y2="59" stroke="#8e71a2" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="35" y1="63" x2="49" y2="63" stroke="#8e71a2" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="92" y1="59" x2="106" y2="56" stroke="#8e71a2" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="93" y1="63" x2="107" y2="63" stroke="#8e71a2" strokeWidth="1.3" strokeLinecap="round" />
        </svg>

        <span className="mt-1 font-mono text-[11px] text-[#8e71a2]">{meta.hint}</span>
      </button>

      {/* Bottom Deskmat Tag */}
      <div className="flex items-center justify-between font-mono text-[11px] text-[#b9a7c9]">
        <span>Tuxedo Desk Companion</span>
        <span className="text-[#8e71a2]">click keycap ↑</span>
      </div>
    </div>
  );
};
