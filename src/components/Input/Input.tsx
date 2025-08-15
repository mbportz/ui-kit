import React, { useId } from 'react';
import styles from './Input.module.css';

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string;
  hint?: string;
  error?: string;
};

export default function Input({
  id,
  label,
  hint,
  error,
  required,
  disabled,
  type = 'text',
  ...rest
}: InputProps) {
  const auto = useId();
  const inputId = id ?? `input-${auto}`;
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;

  const describedByIds: string[] = [];
  if (hint) describedByIds.push(hintId);
  if (error) describedByIds.push(errorId);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={inputId}>
        {label}
        {required && (
          <span className={styles.req} aria-hidden="true">
            *
          </span>
        )}
      </label>

      <input
        id={inputId}
        type={type}
        className={[
          styles.input,
          error ? styles.inputError : '',
          disabled ? styles.disabled : '',
          rest.className ?? '',
        ].join(' ')}
        required={required}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={
          describedByIds.length ? describedByIds.join(' ') : undefined
        }
        {...rest}
      />

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
