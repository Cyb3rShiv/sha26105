import { useEffect } from 'react';

/**
 * Modal overlay with Escape-to-close and backdrop click.
 * Pages render their own header/close affordance inside.
 */
export default function Modal({ open, onClose, children, maxWidth = 'max-w-4xl', label }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className="fixed inset-0 bg-ink-1000/85 backdrop-blur-[3px] animate-[reveal-up_0.2s_ease]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={`panel ledger-marks relative w-full ${maxWidth} my-auto shadow-2xl shadow-black/60`}>
        {children}
      </div>
    </div>
  );
}
