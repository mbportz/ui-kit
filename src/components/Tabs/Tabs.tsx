import React, { useEffect, useId, useRef, useState } from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId?: string;
  onChange?: (id: string) => void;
  className?: string;
}

export default function Tabs({
  items,
  activeId,
  onChange,
  className,
}: TabsProps) {
  const base = useId();
  const [selectedId, setSelectedId] = useState<string | undefined>(
    activeId ?? items[0]?.id,
  );
  const tabListRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (id: string) => {
    if (onChange) {
      onChange(id);
    } else {
      setSelectedId(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const tabCount = items.length;
    let newIndex = index;

    switch (e.key) {
      case 'ArrowRight':
        newIndex = (index + 1) % tabCount;
        break;
      case 'ArrowLeft':
        newIndex = (index - 1 + tabCount) % tabCount;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = tabCount - 1;
        break;
      default:
        return;
    }

    e.preventDefault();
    const newId = items[newIndex].id;
    handleTabClick(newId);

    const btn = tabListRef.current?.querySelector<HTMLButtonElement>(
      `#tab-${newId}`,
    );
    btn?.focus();
  };

  // Sync internal state with controlled prop — hooks must run before any early return
  useEffect(() => {
    if (activeId !== undefined) {
      setSelectedId(activeId);
    }
  }, [activeId]);

  // Guard AFTER hooks so hook order is stable
  if (!items || items.length === 0) {
    return null;
  }

  const currentId = activeId ?? selectedId!;

  return (
    <div className={[styles.container, className].filter(Boolean).join(' ')}>
      <div
        ref={tabListRef}
        role="tablist"
        className={styles.tabList}
        aria-label="Tabs"
        aria-describedby={`hint-${base}`}
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            role="tab"
            id={`tab-${item.id}`}
            aria-selected={currentId === item.id}
            aria-controls={`panel-${item.id}`}
            className={[
              styles.tab,
              currentId === item.id ? styles.active : '',
              item.disabled ? styles.disabled : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => !item.disabled && handleTabClick(item.id)}
            onKeyDown={(e) => !item.disabled && handleKeyDown(e, index)}
            disabled={item.disabled}
            tabIndex={currentId === item.id ? 0 : -1}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>

      <span id={`hint-${base}`} className={styles.srOnly}>
        Use Left/Right arrows to switch tabs.
      </span>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`panel-${item.id}`}
          aria-labelledby={`tab-${item.id}`}
          hidden={currentId !== item.id}
          className={styles.panel}
          tabIndex={0}
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
