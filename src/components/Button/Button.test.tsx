import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import Button from './Button';
import styles from './Button.module.css';
import { test, expect, vi } from 'vitest';

test('renders with accessible name', async () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
});

test('shows focus ring on keyboard focus (smoke)', async () => {
  render(<Button>Focus</Button>);
  const btn = screen.getByRole('button', { name: 'Focus' });
  btn.focus();
  expect(btn).toHaveFocus();
});

test('has no critical a11y violations', async () => {
  const { container } = render(<Button>Click</Button>);
  const results = await axe(container);
  // Assert manually to avoid matcher incompatibilities in Vitest
  if (results.violations.length > 0) {
    // Helpful debug output
    console.error(
      'A11y violations:',
      results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        nodes: v.nodes.slice(0, 1).map((n) => n.target),
      })),
    );
  }
  expect(results.violations).toEqual([]);
});

test('renders with different variants', () => {
  render(<Button variant="secondary">Secondary</Button>);
  const button = screen.getByRole('button', { name: 'Secondary' });
  expect(button).toHaveClass(styles.secondary);
});

test('renders with different sizes', () => {
  render(<Button size="sm">Small</Button>);
  const button = screen.getByRole('button', { name: 'Small' });
  expect(button).toHaveClass(styles.sm);
});

test('handles disabled state', () => {
  render(<Button disabled>Disabled</Button>);
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
});

test('handles click events', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  const user = userEvent.setup();

  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
