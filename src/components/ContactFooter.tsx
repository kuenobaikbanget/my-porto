import { useState, type FC } from 'react';
import {
  LuCheck,
  LuCopy,
  LuFileText,
  LuGithub,
  LuInstagram,
  LuLinkedin,
  LuMail,
} from 'react-icons/lu';
import { profileData } from '../data/profile';

export const ContactFooter: FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(profileData.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${profileData.email}`;
    }
  };

  return (
    <footer id="contact" className="pt-8 pb-12 sm:pt-10 sm:pb-16">
      <div className="bento-card p-6 sm:p-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="font-mono text-xs tracking-wider text-[#8e71a2]" aria-hidden="true">
              コンタクト // GET IN TOUCH
            </p>
            <h2 className="mt-1 font-display text-2xl font-bold text-[#f3edf7] sm:text-3xl">
              Let&apos;s build dependable systems.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-[#b9a7c9]">
              Open to internships, Linux/networking ops, IoT prototyping, and practical software
              engineering roles. Reach me directly via email or LinkedIn.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href={`mailto:${profileData.email}`}
              className="keycap keycap-mint px-4 py-2 text-xs no-underline sm:text-sm"
            >
              <LuMail className="h-4 w-4" aria-hidden="true" />
              <span>Email Me</span>
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="keycap px-3.5 py-2 text-xs text-[#f3edf7] sm:text-sm"
            >
              {copied ? (
                <>
                  <LuCheck className="h-4 w-4 text-[#c6e3d1]" aria-hidden="true" />
                  <span className="text-[#c6e3d1]">Copied!</span>
                </>
              ) : (
                <>
                  <LuCopy className="h-4 w-4 text-[#f3e6a2]" aria-hidden="true" />
                  <span>{profileData.email}</span>
                </>
              )}
            </button>

            <a
              href={profileData.cvUrl}
              download={profileData.cvFilename}
              className="keycap px-3.5 py-2 text-xs text-[#f3e6a2] no-underline sm:text-sm"
            >
              <LuFileText className="h-4 w-4" aria-hidden="true" />
              <span>CV PDF</span>
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col items-start justify-between gap-4 border-t border-[#3d2a54]/80 pt-5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={profileData.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="keycap px-3 py-1.5 text-xs text-[#f3edf7] no-underline"
            >
              <LuGithub className="h-3.5 w-3.5" aria-hidden="true" />
              <span>GitHub</span>
            </a>
            <a
              href={profileData.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="keycap px-3 py-1.5 text-xs text-[#cfe0f2] no-underline"
            >
              <LuLinkedin className="h-3.5 w-3.5" aria-hidden="true" />
              <span>LinkedIn</span>
            </a>
            <a
              href={profileData.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="keycap px-3 py-1.5 text-xs text-[#eed2df] no-underline"
            >
              <LuInstagram className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Instagram</span>
            </a>
          </div>

          <p className="font-mono text-[11px] text-[#8e71a2]">
            © 2026 {profileData.name} ·{' '}
            <span className="text-[#b9a7c9]">kueno.web.id</span> · Digital Nightmares Bento
          </p>
        </div>
      </div>
    </footer>
  );
};
