import { useState, type FC } from 'react';
import {
  LuArrowDownRight,
  LuCheck,
  LuCopy,
  LuFileText,
  LuGithub,
  LuGraduationCap,
  LuLinkedin,
  LuMapPin,
} from 'react-icons/lu';
import { profileData } from '../data/profile';
import { TuxedoCatWidget } from './TuxedoCatWidget';

export const HeroBento: FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profileData.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profileData.email}`;
    }
  };

  return (
    <section id="hero" className="pt-6 pb-8 sm:pt-10 sm:pb-10">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Primary Identity & Recruiter Scan Card */}
        <div className="bento-card flex flex-col justify-between p-5 sm:p-7 lg:col-span-8">
          <div>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="shrink-0 rounded-2xl border border-[#493364] bg-[#140c1c] p-1 shadow-[0_3px_0_#110a18]">
                  <img
                    src={profileData.avatarSrc}
                    alt={`${profileData.name} portrait`}
                    className="h-14 w-14 rounded-xl object-cover sm:h-16 sm:w-16"
                    width={64}
                    height={64}
                  />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-[#f3edf7] sm:text-4xl">
                    {profileData.name}
                  </h1>
                  <p className="mt-0.5 font-mono text-xs font-medium text-[#f3e6a2] sm:text-sm">
                    {profileData.headline}
                  </p>
                </div>
              </div>

              <div className="recessed-well inline-flex items-center gap-2 rounded-xl px-3 py-1.5 font-mono text-xs text-[#f3e6a2]">
                <span className="text-[#8e71a2]">GPA</span>
                <span className="font-semibold">{profileData.gpa}</span>
              </div>
            </div>

            {/* Focus Pills */}
            <div className="mb-4 flex flex-wrap gap-2">
              {profileData.focusPills.map((pill, idx) => {
                const pillTone =
                  idx === 0
                    ? 'border-[#f3e6a2]/35 bg-[#f3e6a2]/10 text-[#f3e6a2]'
                    : idx === 1
                      ? 'border-[#cfe0f2]/35 bg-[#cfe0f2]/10 text-[#cfe0f2]'
                      : 'border-[#c6e3d1]/35 bg-[#c6e3d1]/10 text-[#c6e3d1]';
                return (
                  <span
                    key={pill}
                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 font-mono text-xs font-medium ${pillTone}`}
                  >
                    {pill}
                  </span>
                );
              })}
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-[#b9a7c9] sm:text-base">
              {profileData.summary}
            </p>
          </div>

          <div className="mt-6 border-t border-[#3d2a54]/80 pt-5">
            {/* Compact Academic & Location Bar */}
            <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 font-mono text-xs text-[#b9a7c9]">
              <span className="inline-flex items-center gap-1.5">
                <LuGraduationCap className="h-3.5 w-3.5 text-[#eed2df]" aria-hidden="true" />
                <span>
                  {profileData.degree} · {profileData.university}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LuMapPin className="h-3.5 w-3.5 text-[#c6e3d1]" aria-hidden="true" />
                <span>{profileData.location}</span>
              </span>
            </div>

            {/* Tactile Keycap Action Row */}
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={profileData.cvUrl}
                download={profileData.cvFilename}
                className="keycap keycap-mint px-4 py-2 text-xs no-underline sm:text-sm"
              >
                <LuFileText className="h-4 w-4" aria-hidden="true" />
                <span>Resume / CV</span>
              </a>

              <a
                href="#projects"
                className="keycap px-4 py-2 text-xs text-[#f3edf7] no-underline sm:text-sm"
              >
                <span>View Projects</span>
                <LuArrowDownRight className="h-4 w-4 text-[#f3e6a2]" aria-hidden="true" />
              </a>

              <button
                type="button"
                onClick={handleCopyEmail}
                className="keycap px-3.5 py-2 text-xs text-[#cfe0f2] sm:text-sm"
                aria-label={`Copy email address ${profileData.email}`}
              >
                {copied ? (
                  <>
                    <LuCheck className="h-4 w-4 text-[#c6e3d1]" aria-hidden="true" />
                    <span className="text-[#c6e3d1]">Copied!</span>
                  </>
                ) : (
                  <>
                    <LuCopy className="h-4 w-4 text-[#8e71a2]" aria-hidden="true" />
                    <span>{profileData.email}</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={profileData.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="keycap p-2.5 text-[#f3edf7] no-underline"
                >
                  <LuGithub className="h-4 w-4" />
                </a>
                <a
                  href={profileData.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="keycap p-2.5 text-[#cfe0f2] no-underline"
                >
                  <LuLinkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Sleepy Tuxedo Cat Widget */}
        <div className="lg:col-span-4">
          <TuxedoCatWidget />
        </div>
      </div>
    </section>
  );
};
