import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { useLockBodyScroll } from '../../hooks/useLockBodyScroll';
import { useEscapeKey } from '../../hooks/useEscapeKey';
import { cn } from '../../lib/utils';

export default function Modal({ open, onClose, title, children, className, size = 'md' }) {
  const panelRef = useRef(null);
  useLockBodyScroll(open);
  useEscapeKey(open, onClose);

  useEffect(() => {
    if (open) panelRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/60 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 max-h-[90vh] w-full overflow-y-auto bg-ivory shadow-soft outline-none',
          size === 'lg' ? 'max-w-5xl' : 'max-w-xl',
          className,
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center border border-ink/10 bg-ivory/90 text-ink transition-colors hover:bg-ink hover:text-ivory"
        >
          <IoClose aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
