import { useEffect, useMemo, useRef, useState, type FC, type KeyboardEvent } from 'react';
import {
  LuArrowUpRight,
  LuCheck,
  LuCompass,
  LuCopy,
  LuFileCode2,
  LuGithub,
  LuLinkedin,
  LuPalette,
  LuTerminal,
  LuX,
} from 'react-icons/lu';
import { useTheme } from '../context/useTheme';
import { profileData } from '../data/profile';
import { projectsData, type ProjectItem } from '../data/projects';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProject: (project: ProjectItem) => void;
}

interface PaletteItem {
  id: string;
  group: 'Command' | 'Navigate' | 'Action' | 'Project Spec';
  label: string;
  hint: string;
  keywords: string;
  run: () => void;
}

const TERMINAL_COMMANDS = ['whoami', 'status', 'ping', 'cat', 'help', 'theme', 'clear'] as const;
type TerminalCommandName = (typeof TERMINAL_COMMANDS)[number];

interface TerminalOutputBlock {
  command: string;
  tone: 'info' | 'mint' | 'butter' | 'pink';
  lines: string[];
}

function getWibTimestamp(): string {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '--:--:--';
  }
}

export const CommandPalette: FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenProject,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [terminalOutput, setTerminalOutput] = useState<TerminalOutputBlock | null>(null);
  const [copiedNotice, setCopiedNotice] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const copyTimerRef = useRef<number | null>(null);
  const { theme, toggleTheme } = useTheme();

  const isAnalog = theme === 'analog-dreams';

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) {
        window.clearTimeout(copyTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setQuery('');
    setSelectedIndex(0);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    const handleWindowKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleWindowKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const executeCopyEmail = async () => {
    let copied = false;
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(profileData.email);
        copied = true;
      } catch {
        copied = false;
      }
    }
    if (!copied) {
      const textarea = document.createElement('textarea');
      textarea.value = profileData.email;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        copied = document.execCommand('copy');
      } finally {
        document.body.removeChild(textarea);
      }
    }

    setCopiedNotice(true);
    setTerminalOutput({
      command: 'pbcopy < email',
      tone: 'mint',
      lines: [
        copied
          ? `[OK] Copied ${profileData.email} to clipboard.`
          : `[INFO] Email: ${profileData.email}`,
      ],
    });
    if (copyTimerRef.current !== null) {
      window.clearTimeout(copyTimerRef.current);
    }
    copyTimerRef.current = window.setTimeout(() => setCopiedNotice(false), 2200);
  };

  const runTerminalCommand = (rawCommand: string) => {
    const cmd = rawCommand.trim().toLowerCase() as TerminalCommandName;

    if (cmd === 'clear') {
      setTerminalOutput(null);
      setQuery('');
      return;
    }

    if (cmd === 'theme') {
      const nextName = isAnalog ? 'Digital Nightmares' : 'Analog Dreams';
      toggleTheme({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
      setTerminalOutput({
        command: 'theme --toggle',
        tone: 'pink',
        lines: [`[OK] Colorway wiped -> ${nextName}`],
      });
      setQuery('');
      return;
    }

    if (cmd === 'whoami') {
      setTerminalOutput({
        command: 'whoami',
        tone: 'mint',
        lines: [
          `${profileData.name} (${profileData.handle})`,
          `role   : ${profileData.statusLabel}`,
          `school : ${profileData.degree} @ ${profileData.university}`,
          `focus  : ${profileData.focusPills.join(' · ')}`,
        ],
      });
      setQuery('');
      return;
    }

    if (cmd === 'status') {
      setTerminalOutput({
        command: 'status',
        tone: 'butter',
        lines: [
          `acad   : 3rd-Year Undergraduate · Active in KSM Robotics`,
          `work   : ${profileData.statusLabel}`,
          `time   : ${getWibTimestamp()} WIB (Asia/Jakarta)`,
          `theme  : ${isAnalog ? 'Analog Dreams (light)' : 'Digital Nightmares (dark)'}`,
        ],
      });
      setQuery('');
      return;
    }

    if (cmd === 'ping') {
      setTerminalOutput({
        command: 'ping -c 3 kueno.web.id',
        tone: 'mint',
        lines: [
          'PING kueno.web.id (kuenobaikbanget): 56 data bytes',
          '64 bytes from kueno.web.id: icmp_seq=0 ttl=64 time=11.4 ms',
          '64 bytes from kueno.web.id: icmp_seq=1 ttl=64 time=12.1 ms',
          '64 bytes from kueno.web.id: icmp_seq=2 ttl=64 time=10.8 ms',
          '--- 3 packets transmitted, 3 received, 0.0% packet loss ---',
        ],
      });
      setQuery('');
      return;
    }

    if (cmd === 'cat') {
      setTerminalOutput({
        command: 'cat ~/cat.tty',
        tone: 'pink',
        lines: [
          '   /\\_/\\    zZz   [CAT.EXE // DESKMAT]',
          '  ( -.- )  .      "tuxedo cat sleeping beside the keyboard"',
          '  />   <\\         tip: click the ~/cat.tty card in Hero to poke.',
        ],
      });
      setQuery('');
      return;
    }

    if (cmd === 'help') {
      setTerminalOutput({
        command: 'help',
        tone: 'info',
        lines: [
          'Available terminal commands:',
          '  whoami   identity, academic track & focus areas',
          '  status   live WIB clock, KSM Robotics & internship status',
          '  ping     latency check to kueno.web.id',
          '  cat      inspect the deskmat tuxedo cat process',
          '  theme    toggle Digital Nightmares <-> Analog Dreams',
          '  clear    clear terminal output',
        ],
      });
      setQuery('');
      return;
    }

    setTerminalOutput({
      command: rawCommand.trim(),
      tone: 'pink',
      lines: [`command not found: ${rawCommand.trim()}. Type "help" for available commands.`],
    });
  };

  const trimmedQuery = query.trim().toLowerCase();
  const isExactTerminalCmd = (TERMINAL_COMMANDS as readonly string[]).includes(trimmedQuery);

  const baseItems: PaletteItem[] = useMemo(() => {
    const jumpTo = (sectionId: string) => {
      onClose();
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 20);
    };

    const navItems: PaletteItem[] = [
      {
        id: 'nav-hero',
        group: 'Navigate',
        label: 'Jump to Hero & Tuxedo Cat',
        hint: '#hero',
        keywords: 'hero home top cat profile about',
        run: () => jumpTo('hero'),
      },
      {
        id: 'nav-activity',
        group: 'Navigate',
        label: 'Jump to Activity & Desk Status',
        hint: '#activity',
        keywords: 'activity github led matrix clock wib desk status',
        run: () => jumpTo('activity'),
      },
      {
        id: 'nav-projects',
        group: 'Navigate',
        label: 'Jump to Featured Projects',
        hint: '#projects',
        keywords: 'projects builds portfolio work',
        run: () => jumpTo('projects'),
      },
      {
        id: 'nav-experience',
        group: 'Navigate',
        label: 'Jump to Experience & Education',
        hint: '#experience',
        keywords: 'experience internship education upnvj kalapa datasoft',
        run: () => jumpTo('experience'),
      },
      {
        id: 'nav-stack',
        group: 'Navigate',
        label: 'Jump to Tech Toolbox',
        hint: '#stack',
        keywords: 'toolbox skills tech stack keycaps',
        run: () => jumpTo('stack'),
      },
      {
        id: 'nav-hobbies',
        group: 'Navigate',
        label: 'Jump to Hobbies & Off-Duty Bench',
        hint: '#hobbies',
        keywords: 'hobbies bench keyboards mice coffee cassettes',
        run: () => jumpTo('hobbies'),
      },
      {
        id: 'nav-contact',
        group: 'Navigate',
        label: 'Jump to Contact',
        hint: '#contact',
        keywords: 'contact email footer social reach',
        run: () => jumpTo('contact'),
      },
    ];

    const actionItems: PaletteItem[] = [
      {
        id: 'action-colorway',
        group: 'Action',
        label: isAnalog
          ? 'Switch Colorway -> Digital Nightmares'
          : 'Switch Colorway -> Analog Dreams',
        hint: 'radial wipe',
        keywords: 'theme colorway dark light digital nightmares analog dreams switch',
        run: () => {
          toggleTheme({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          onClose();
        },
      },
      {
        id: 'action-copy-email',
        group: 'Action',
        label: copiedNotice ? 'Email Copied!' : `Copy Email (${profileData.email})`,
        hint: 'clipboard',
        keywords: 'copy email mail address contact clipboard',
        run: () => {
          void executeCopyEmail();
        },
      },
      {
        id: 'action-github',
        group: 'Action',
        label: 'Open GitHub (@kuenobaikbanget)',
        hint: 'external',
        keywords: 'github repos code kuenobaikbanget',
        run: () => {
          window.open(profileData.socials.github, '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
      {
        id: 'action-linkedin',
        group: 'Action',
        label: 'Open LinkedIn (Akbar Dwi Maulana)',
        hint: 'external',
        keywords: 'linkedin profile career network',
        run: () => {
          window.open(profileData.socials.linkedin, '_blank', 'noopener,noreferrer');
          onClose();
        },
      },
    ];

    const projectItems: PaletteItem[] = projectsData.map((project) => ({
      id: `spec-${project.id}`,
      group: 'Project Spec',
      label: `Open Spec-Sheet: ${project.title}`,
      hint: project.specCode,
      keywords: `project spec modal ${project.title} ${project.category} ${project.stack.join(' ')}`,
      run: () => {
        onClose();
        onOpenProject(project);
      },
    }));

    return [...actionItems, ...projectItems, ...navItems];
  }, [copiedNotice, isAnalog, onClose, onOpenProject, toggleTheme]);

  const filteredItems = useMemo(() => {
    const items: PaletteItem[] = [];

    if (isExactTerminalCmd) {
      items.push({
        id: `cmd-${trimmedQuery}`,
        group: 'Command',
        label: `Run terminal command: ${trimmedQuery}`,
        hint: 'enter',
        keywords: trimmedQuery,
        run: () => runTerminalCommand(trimmedQuery),
      });
    }

    const matched = trimmedQuery
      ? baseItems.filter((item) => {
          const haystack = `${item.label} ${item.hint} ${item.keywords} ${item.group}`.toLowerCase();
          return haystack.includes(trimmedQuery);
        })
      : baseItems;

    return [...items, ...matched];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseItems, isExactTerminalCmd, trimmedQuery]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const container = listRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>(
      `[data-palette-idx="${selectedIndex}"]`,
    );
    activeEl?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      }
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (filteredItems.length > 0) {
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
      return;
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].run();
      } else if (trimmedQuery) {
        runTerminalCommand(trimmedQuery);
      }
    }
  };

  if (!isOpen) return null;

  const renderGroupIcon = (item: PaletteItem) => {
    if (item.group === 'Command') {
      return <LuTerminal className="h-3.5 w-3.5 text-[var(--theme-accent-mint)]" aria-hidden="true" />;
    }
    if (item.group === 'Project Spec') {
      return <LuFileCode2 className="h-3.5 w-3.5 text-[var(--theme-accent-butter)]" aria-hidden="true" />;
    }
    if (item.id === 'action-colorway') {
      return <LuPalette className="h-3.5 w-3.5 text-[var(--theme-accent-pink)]" aria-hidden="true" />;
    }
    if (item.id === 'action-copy-email') {
      return copiedNotice ? (
        <LuCheck className="h-3.5 w-3.5 text-[var(--theme-accent-mint)]" aria-hidden="true" />
      ) : (
        <LuCopy className="h-3.5 w-3.5 text-[var(--theme-accent-butter)]" aria-hidden="true" />
      );
    }
    if (item.id === 'action-github') {
      return <LuGithub className="h-3.5 w-3.5 text-[var(--theme-ink-primary)]" aria-hidden="true" />;
    }
    if (item.id === 'action-linkedin') {
      return <LuLinkedin className="h-3.5 w-3.5 text-[var(--theme-accent-sky)]" aria-hidden="true" />;
    }
    return <LuCompass className="h-3.5 w-3.5 text-[var(--theme-ink-legend)]" aria-hidden="true" />;
  };

  const outputToneClass =
    terminalOutput?.tone === 'mint'
      ? 'text-[var(--theme-accent-mint)]'
      : terminalOutput?.tone === 'butter'
        ? 'text-[var(--theme-accent-butter)]'
        : terminalOutput?.tone === 'pink'
          ? 'text-[var(--theme-accent-pink)]'
          : 'text-[var(--theme-ink-primary)]';

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[var(--theme-backdrop)] px-3 pt-16 pb-6 backdrop-blur-sm sm:px-4 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Terminal Command Palette"
      onClick={onClose}
    >
      <div
        className="bento-card flex max-h-[82vh] w-full max-w-2xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Terminal Title Bar (matches ~/cat.tty) */}
        <div className="flex items-center justify-between border-b border-[var(--theme-border)] bg-[var(--theme-terminal-bar)] px-4 py-2.5 font-mono text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-accent-pink-dot)] opacity-85" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-accent-butter-dot)] opacity-85" />
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--theme-accent-mint-dot)] opacity-85" />
            </div>
            <span className="inline-flex items-center gap-1.5 text-[var(--theme-ink-muted)]">
              <LuTerminal className="h-3.5 w-3.5 text-[var(--theme-ink-legend)]" aria-hidden="true" />
              <span>~/cmd.tty</span>
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="keycap px-2 py-0.5 text-[11px] text-[var(--theme-ink-muted)]"
            aria-label="Close command palette"
          >
            <span>ESC</span>
            <LuX className="h-3 w-3" aria-hidden="true" />
          </button>
        </div>

        {/* Prompt Input */}
        <div className="border-b border-[var(--theme-border)] bg-[var(--theme-terminal-bg)] px-4 py-3">
          <div className="flex items-center gap-2.5 font-mono text-sm">
            <span className="font-semibold text-[var(--theme-accent-mint)]" aria-hidden="true">
              &gt;
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Search sections, actions, specs — or type whoami, status, ping, cat, help"
              aria-label="Command palette input"
              className="w-full bg-transparent text-[var(--theme-ink-primary)] placeholder:text-[var(--theme-ink-legend)] focus:outline-none"
            />
          </div>

          {/* Quick Terminal Command Chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[var(--theme-ink-legend)]">
              tty:
            </span>
            {(['whoami', 'status', 'ping', 'cat', 'help'] as const).map((cmd) => (
              <button
                key={cmd}
                type="button"
                onClick={() => runTerminalCommand(cmd)}
                className="rounded-md border border-[var(--theme-border)] bg-[var(--theme-keycap)] px-2 py-0.5 font-mono text-[11px] text-[var(--theme-ink-muted)] transition-colors hover:border-[var(--theme-ink-legend)] hover:text-[var(--theme-ink-primary)]"
              >
                {cmd}
              </button>
            ))}
          </div>
        </div>

        {/* Inline Terminal Output Pane */}
        {terminalOutput ? (
          <div className="border-b border-[var(--theme-border)] bg-[var(--theme-terminal-footer)] px-4 py-3 font-mono text-xs">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] text-[var(--theme-ink-legend)]">
              <span>kueno@tty:~$ {terminalOutput.command}</span>
              <button
                type="button"
                onClick={() => setTerminalOutput(null)}
                className="cursor-pointer text-[10px] text-[var(--theme-ink-muted)] underline hover:text-[var(--theme-ink-primary)]"
              >
                clear
              </button>
            </div>
            <pre
              className={`m-0 overflow-x-auto whitespace-pre-wrap leading-relaxed ${outputToneClass}`}
            >
              {terminalOutput.lines.join('\n')}
            </pre>
          </div>
        ) : null}

        {/* Action & Navigation List */}
        <div
          ref={listRef}
          role="listbox"
          aria-label="Command palette results"
          className="flex-1 overflow-y-auto p-2.5"
        >
          {filteredItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--theme-border)] px-4 py-6 text-center font-mono text-xs text-[var(--theme-ink-muted)]">
              No matching action. Press <span className="text-[var(--theme-accent-mint)]">Enter</span> to run as a terminal command, or type <span className="text-[var(--theme-accent-butter)]">help</span>.
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    data-palette-idx={idx}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    onClick={item.run}
                    className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                      isSelected
                        ? 'border-[var(--theme-ink-legend)] bg-[var(--theme-keycap-active)] text-[var(--theme-ink-primary)]'
                        : 'border-transparent bg-transparent text-[var(--theme-ink-muted)] hover:bg-[var(--theme-keycap)]'
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="recessed-well flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                        {renderGroupIcon(item)}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-mono text-xs font-medium text-[var(--theme-ink-primary)]">
                          {item.label}
                        </div>
                        <div className="font-mono text-[10px] text-[var(--theme-ink-legend)]">
                          {item.group}
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-[var(--theme-ink-legend)]">
                      <span>{item.hint}</span>
                      {item.hint === 'external' ? (
                        <LuArrowUpRight className="h-3 w-3" aria-hidden="true" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hints */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--theme-border)] bg-[var(--theme-terminal-bar)] px-4 py-2 font-mono text-[10px] text-[var(--theme-ink-legend)]">
          <div className="flex items-center gap-3">
            <span>↑↓ navigate</span>
            <span>↵ execute</span>
            <span>esc close</span>
          </div>
          <span>kueno@tty // palette</span>
        </div>
      </div>
    </div>
  );
};
