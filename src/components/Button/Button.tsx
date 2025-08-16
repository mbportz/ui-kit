import React from 'react';
import styles from './Button.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
};

export default function Button({
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled,
  children,
  ...rest
}: ButtonProps) {
  const className = [
    styles.btn,
    styles[variant],
    styles[size],
    disabled ? styles.disabled : '',
    rest.className ?? '',
  ].join(' ');

  return (
    <button type={type} className={className} disabled={disabled} {...rest}>
      {children}
    </button>
  );
}
