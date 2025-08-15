import React, {
  createContext,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  useCallback,
} from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.css';

type Variant = 'info' | 'success' | 'warning' | 'error';
type ToastItem = {
  id: number;
  title?: string;
  description?: string;
  message?: string; // Add message prop
  variant: Variant;
  duration?: number; // ms; 0 = stay until closed
};

type ToastOptions = Omit<ToastItem, 'id' | 'variant'> & {
  variant?: Variant;
  message?: string; // Add to options
};

type Ctx = {
  toast: (opts: ToastOptions) => void;
  dismiss: (id: number) => void;
};

const ToastContext = createContext<Ctx | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idRef = useRef(0);
  const timers = useRef(new Map<number, number>());

  const dismiss = useCallback((id: number) => {
    const t = timers.current.get(id);
    if (t) {
      clearTimeout(t);
      timers.current.delete(id);
    }
    setToasts((list) => list.filter((x) => x.id !== id));
  }, []);

  const toast = useCallback(
    (opts: ToastOptions) => {
      const id = ++idRef.current;
      const item: ToastItem = {
        id,
        title: opts.title,
        description: opts.description,
        message: opts.message,
        variant: opts.variant ?? 'info',
        duration: opts.duration,
      };
      setToasts((list) => [...list, item]);
      const ms = item.duration === 0 ? undefined : (item.duration ?? 4000);
      if (ms) {
        const t = window.setTimeout(() => dismiss(id), ms);
        timers.current.set(id, t);
      }
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {createPortal(
        <div
          className={styles.region}
          aria-live="polite" /* announce new toasts */
          aria-atomic="false"
        >
          {toasts.map((t) => (
            <ToastCard key={t.id} item={t} onClose={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

function ToastCard({
  item,
  onClose,
}: {
  item: ToastItem;
  onClose: () => void;
}) {
  const role = item.variant === 'error' ? 'alert' : 'status';
  const labelId = useId();
  const descId = useId();
  const messageId = useId();

  return (
    <div
      className={[styles.toast, styles[item.variant]].join(' ')}
      role={role}
      aria-labelledby={item.title ? `t-${labelId}` : undefined}
      aria-describedby={buildDescribedBy(item, descId, messageId)}
      onMouseEnter={onClose /* pause by canceling timer when hovered */}
      onFocus={onClose /* also cancel timer if focused */}
    >
      <div className={styles.body}>
        {item.title && (
          <div id={`t-${labelId}`} className={styles.title}>
            {item.title}
          </div>
        )}
        {item.description && (
          <div id={`d-${descId}`} className={styles.desc}>
            {item.description}
          </div>
        )}
        {item.message && (
          <div id={`m-${messageId}`} className={styles.message}>
            {item.message}
          </div>
        )}
      </div>
      <button
        className={styles.close}
        onClick={onClose}
        aria-label="Dismiss notification"
        type="button"
      >
        ×
      </button>
    </div>
  );
}

// Helper function to build aria-describedby string
function buildDescribedBy(
  item: ToastItem,
  descId: string,
  messageId: string,
): string | undefined {
  const ids: string[] = [];
  if (item.description) ids.push(`d-${descId}`);
  if (item.message) ids.push(`m-${messageId}`);
  return ids.length ? ids.join(' ') : undefined;
}
