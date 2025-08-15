import { useEffect, useCallback, useRef } from 'react';
import styles from './Modal.module.css';

type ModalProps = {
  /** Controls modal visibility */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal content */
  children: React.ReactNode;
  /** Optional custom width (default: '600px') */
  width?: string;
  /** Optional CSS class name */
  className?: string;
  /** Optional test ID */
  'data-testid'?: string;
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  width = '600px',
  className,
  'data-testid': testId = 'modal-overlay',
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  useEffect(() => {
    if (!isOpen) return;

    // Store previous focus and handle keyboard
    previousFocusRef.current = document.activeElement as HTMLElement;
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    // Focus first interactive element
    const focusable = modalRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    focusable?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className={styles.overlay}
      data-testid={testId}
      onClick={handleOverlayClick}
      role="presentation"
    >
      <div
        ref={modalRef}
        className={[styles.modal, className].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        style={{ width }}
      >
        <header className={styles.header}>
          <h2 id="modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close modal"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
