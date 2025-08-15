import React, { useId } from 'react';
import styles from './Select.module.css';

type Option = { value: string; label: string; disabled?: boolean };

type SelectProps = Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> & {
  label: string;
  options: Option[];
  hint?: string;
  error?: string;
  placeholder?: string; // shows as first disabled option
};

export default function Select({
  id,
  label,
  options,
  hint,
  error,
  required,
  disabled,
  placeholder,
  ...rest
}: SelectProps) {
  const auto = useId();
  const selectId = id ?? `select-${auto}`;
  const hintId = `${selectId}-hint`;
  const errorId = `${selectId}-error`;

  const describedBy: string[] = [];
  if (hint) describedBy.push(hintId);
  if (error) describedBy.push(errorId);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={selectId}>
        {label}
        {required && (
          <span className={styles.req} aria-hidden="true">
            *
          </span>
        )}
      </label>

      <select
        id={selectId}
        className={[
          styles.select,
          error ? styles.selectError : '',
          disabled ? styles.disabled : '',
          rest.className ?? '',
        ].join(' ')}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={
          describedBy.length ? describedBy.join(' ') : undefined
        }
        {...rest}
      >
        {placeholder && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>

      {hint && (
        <div id={hintId} className={styles.hint}>
          {hint}
        </div>
      )}
      {error && (
        <div id={errorId} role="alert" className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
}
