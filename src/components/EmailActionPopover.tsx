import { useEffect, useId, useRef, useState, type FC, type FocusEvent } from 'react';
import {
  LuCheck,
  LuChevronDown,
  LuCopy,
  LuExternalLink,
  LuMail,
} from 'react-icons/lu';

interface EmailActionPopoverProps {
  email: string;
  variant?: 'mint' | 'plum';
  align?: 'left' | 'right-md' | 'right-mobile';
  placement?: 'bottom' | 'top';
}

export const EmailActionPopover: FC<EmailActionPopoverProps> = ({
  email,
  variant = 'mint',
  align = 'left',
  placement = 'bottom',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const popoverId = useId();

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutsidePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (containerRef.current && target && !containerRef.current.contains(target)) {
        setIsOpen(false);
        setIsPinned(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setIsPinned(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handleOutsidePointerDown);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handleOutsidePointerDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyEmail = async () => {
    let didCopy = false;

    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(email);
        didCopy = true;
      } catch {
        didCopy = false;
      }
    }

    if (!didCopy) {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        didCopy = document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    }

    if (didCopy) {
      setCopied(true);
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
      copyTimerRef.current = window.setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const nextFocus = event.relatedTarget as Node | null;
    if (containerRef.current && (!nextFocus || !containerRef.current.contains(nextFocus))) {
      setIsOpen(false);
      setIsPinned(false);
    }
  };

  const handleTriggerClick = () => {
    if (isPinned) {
      setIsPinned(false);
      setIsOpen(false);
    } else {
      setIsPinned(true);
      setIsOpen(true);
    }
  };

  const alignmentClasses =
    align === 'right-md'
      ? 'left-0 md:left-auto md:right-0'
      : align === 'right-mobile'
        ? 'right-0 sm:left-0 sm:right-auto'
        : 'left-0';
  const placementClasses =
    placement === 'top' ? 'bottom-full pb-2' : 'top-full pt-2';

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onPointerEnter={(e) => {
        if (e.pointerType === 'mouse') setIsOpen(true);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType === 'mouse' && !isPinned) setIsOpen(false);
      }}
      onFocus={() => setIsOpen(true)}
      onBlur={handleBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        aria-expanded={isOpen}
        aria-controls={popoverId}
        className={`keycap min-h-[44px] px-4 py-2.5 text-xs sm:min-h-[40px] sm:py-2 sm:text-sm ${
          variant === 'mint' ? 'keycap-mint' : 'text-[var(--theme-ink-primary)]'
        }`}
      >
        <LuMail
          className={`h-4 w-4 ${variant === 'mint' ? '' : 'text-[var(--theme-accent-mint)]'}`}
          aria-hidden="true"
        />
        <span>Email Me</span>
        <LuChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-150 motion-reduce:transition-none ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div
          id={popoverId}
          aria-label="Email options"
          className={`absolute z-50 w-64 max-w-[calc(100vw-3rem)] ${alignmentClasses} ${placementClasses}`}
        >
          <div className="rounded-2xl border border-[var(--theme-border-hover)] bg-[var(--theme-housing)] p-2 shadow-[0_8px_0_var(--theme-bevel),0_14px_28px_var(--theme-popover-shadow)]">
            <div className="mb-1.5 px-2.5 pt-1 font-mono text-[11px] tracking-wider text-[var(--theme-ink-legend)]">
              {email}
            </div>

            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="keycap min-h-[44px] w-full justify-between px-3 py-2 text-left text-xs text-[var(--theme-ink-primary)] sm:min-h-[38px]"
              >
                <span className="inline-flex items-center gap-2">
                  {copied ? (
                    <LuCheck
                      className="h-3.5 w-3.5 text-[var(--theme-accent-mint)]"
                      aria-hidden="true"
                    />
                  ) : (
                    <LuCopy
                      className="h-3.5 w-3.5 text-[var(--theme-accent-butter)]"
                      aria-hidden="true"
                    />
                  )}
                  <span className={copied ? 'text-[var(--theme-accent-mint)]' : ''}>
                    {copied ? 'Copied!' : 'Copy email'}
                  </span>
                </span>
                <span className="font-mono text-[11px] text-[var(--theme-ink-legend)]">
                  {copied ? 'OK' : 'CLIP'}
                </span>
              </button>

              <a
                href={`mailto:${email}`}
                onClick={() => {
                  setIsOpen(false);
                  setIsPinned(false);
                }}
                className="keycap min-h-[44px] w-full justify-between px-3 py-2 text-left text-xs text-[var(--theme-accent-mint)] no-underline sm:min-h-[38px]"
              >
                <span className="inline-flex items-center gap-2">
                  <LuMail className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Open mail app</span>
                </span>
                <LuExternalLink
                  className="h-3 w-3 text-[var(--theme-ink-legend)]"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
