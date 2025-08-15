import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
import Button from './Button';
import { vi } from 'vitest';

test('renders with accessible name', async () => {
  render(<Button>Click me</Button>);
  expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
});

test('shows focus ring on keyboard focus (smoke)', async () => {
  render(<Button>Focus</Button>);
  await user.tab();
  expect(screen.getByRole('button', { name: 'Focus' })).toHaveFocus();
});

test('has no critical a11y violations', async () => {
  const { container } = render(<Button>Click</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('renders with different variants', () => {
  render(<Button variant="secondary">Secondary</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('secondary');
});

test('renders with different sizes', () => {
  render(<Button size="sm">Small</Button>);
  const button = screen.getByRole('button');
  expect(button).toHaveClass('sm');
});

test('handles disabled state', () => {
  render(<Button disabled>Disabled</Button>);
  const button = screen.getByRole('button');
  expect(button).toBeDisabled();
  expect(button).toHaveClass('disabled');
});

test('handles click events', async () => {
  const handleClick = vi.fn();
  render(<Button onClick={handleClick}>Click me</Button>);

  await user.click(screen.getByRole('button'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
