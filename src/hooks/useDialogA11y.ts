import { useEffect, useRef, type RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const nodes = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
  return nodes.filter((el) => {
    if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') {
      return false;
    }
    if (el.closest('[hidden], [inert]')) {
      return false;
    }
    return el.getClientRects().length > 0;
  });
}

let scrollLockCount = 0;
let savedOverflow = '';
let savedPaddingRight = '';

function acquireScrollLock(): void {
  if (scrollLockCount === 0) {
    savedOverflow = document.body.style.overflow;
    savedPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  scrollLockCount += 1;
}

function releaseScrollLock(): void {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = savedOverflow;
    document.body.style.paddingRight = savedPaddingRight;
  }
}

interface UseDialogA11yOptions {
  isOpen: boolean;
  isPresent?: boolean;
  onClose: () => void;
  dialogRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * Provides unified modal dialog accessibility:
 * - Captures the trigger element before opening and restores focus on close
 * - Moves focus inside the dialog when opened
 * - Traps Tab / Shift+Tab cycling within the dialog
 * - Closes on Escape
 * - Ref-count locks body scroll with scrollbar-width compensation while present
 */
export function useDialogA11y({
  isOpen,
  isPresent,
  onClose,
  dialogRef,
  initialFocusRef,
}: UseDialogA11yOptions): void {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  const shouldLockScroll = isPresent ?? isOpen;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!shouldLockScroll) return;
    acquireScrollLock();
    return () => {
      releaseScrollLock();
    };
  }, [shouldLockScroll]);

  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const focusIntoDialog = () => {
      const dialogEl = dialogRef.current;
      if (!dialogEl) return;

      const preferred = initialFocusRef?.current;
      if (preferred && dialogEl.contains(preferred)) {
        preferred.focus({ preventScroll: true });
        return;
      }

      const focusables = getFocusableElements(dialogEl);
      if (focusables.length > 0) {
        focusables[0].focus({ preventScroll: true });
        return;
      }

      if (!dialogEl.hasAttribute('tabindex')) {
        dialogEl.setAttribute('tabindex', '-1');
      }
      dialogEl.focus({ preventScroll: true });
    };

    // Focus immediately if mounted, and fallback once via rAF if child ref attached late.
    if (dialogRef.current) {
      focusIntoDialog();
    }
    const rafId = window.requestAnimationFrame(() => {
      const dialogEl = dialogRef.current;
      if (dialogEl && !dialogEl.contains(document.activeElement)) {
        focusIntoDialog();
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const dialogEl = dialogRef.current;
      if (!dialogEl) return;

      const focusables = getFocusableElements(dialogEl);
      if (focusables.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey) {
        if (active === first || !dialogEl.contains(active)) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last || !dialogEl.contains(active)) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('keydown', handleKeyDown);

      const previous = previousFocusRef.current;
      if (previous && previous.isConnected) {
        previous.focus({ preventScroll: true });
      }
      previousFocusRef.current = null;
    };
  }, [isOpen, dialogRef, initialFocusRef]);
}
