import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { axe } from 'jest-axe';
import Input from './Input';
import styles from './Input.module.css';
import { vi } from 'vitest';

test('renders with label', () => {
  render(<Input label="Email" />);
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
});

test('renders with hint text', () => {
  render(<Input label="Password" hint="Must be at least 8 characters" />);
  const hint = screen.getByText('Must be at least 8 characters');
  expect(hint).toBeInTheDocument();
});

test('renders with error message', () => {
  render(<Input label="Username" error="This field is required" />);
  const error = screen.getByRole('alert');
  expect(error).toHaveTextContent('This field is required');
});

test('shows required indicator', () => {
  render(<Input label="Name" required />);
  const input = screen.getByLabelText(/Name/i);
  expect(input).toBeRequired();

  // Also assert the visual asterisk exists and is aria-hidden
  const label = screen.getByText('Name').closest('label')!;
  const star = label.querySelector('span');
  expect(star).toBeTruthy();
  expect(star).toHaveTextContent('*');
  expect(star).toHaveAttribute('aria-hidden', 'true');
});

test('handles disabled state', () => {
  render(<Input label="Address" disabled />);
  const input = screen.getByLabelText('Address');
  expect(input).toBeDisabled();
  expect(input).toHaveClass(styles.disabled);
});

test('handles user input', async () => {
  render(<Input label="Search" />);
  const input = screen.getByLabelText('Search');
  await user.type(input, 'test query');
  expect(input).toHaveValue('test query');
});

test('has proper aria attributes when error is present', () => {
  render(<Input label="Email" error="Invalid email" />);
  const input = screen.getByLabelText('Email');
  expect(input).toHaveAttribute('aria-invalid', 'true');
  expect(input).toHaveAttribute(
    'aria-describedby',
    expect.stringContaining('-error'),
  );
});

test('has no critical a11y violations', async () => {
  const { container } = render(<Input label="Test" />);
  const results = await axe(container);
  if (results.violations.length > 0) {
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

test('handles change events', async () => {
  const handleChange = vi.fn();
  render(<Input label="Text" onChange={handleChange} />);

  const input = screen.getByLabelText('Text');
  await user.type(input, 'a');
  expect(handleChange).toHaveBeenCalled();
});
