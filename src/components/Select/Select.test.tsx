import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';
import { axe } from 'jest-axe';
import '@testing-library/jest-dom';
import Select from './Select';
import { vi } from 'vitest';

const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' },
];

test('renders select with label', () => {
  render(<Select label="Choose option" options={options} />);
  expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
});

test('shows options when clicked', async () => {
  render(<Select label="Choose option" options={options} />);
  const select = screen.getByRole('combobox');
  await user.click(select);

  options.forEach((option) => {
    expect(screen.getByText(option.label)).toBeInTheDocument();
  });
});

test('selects option on click', async () => {
  const handleChange = vi.fn();
  render(
    <Select label="Choose option" options={options} onChange={handleChange} />,
  );

  await user.click(screen.getByRole('combobox'));
  await user.click(screen.getByText('Option 2'));

  expect(handleChange).toHaveBeenCalledWith('2');
  expect(screen.getByRole('combobox')).toHaveTextContent('Option 2');
});

test('handles disabled state', () => {
  render(<Select label="Choose option" options={options} disabled />);
  expect(screen.getByRole('combobox')).toBeDisabled();
});

test('shows placeholder when no value selected', () => {
  render(
    <Select
      label="Choose option"
      options={options}
      placeholder="Select an option"
    />,
  );
  expect(screen.getByRole('combobox')).toHaveTextContent('Select an option');
});

test('supports keyboard navigation', async () => {
  render(<Select label="Choose option" options={options} />);
  const select = screen.getByRole('combobox');

  await user.tab();
  expect(select).toHaveFocus();

  await user.keyboard('{Enter}');
  await user.keyboard('{ArrowDown}');
  expect(screen.getByText('Option 1')).toHaveAttribute('aria-selected', 'true');
});

test('closes dropdown on escape key', async () => {
  render(<Select label="Choose option" options={options} />);
  await user.click(screen.getByRole('combobox'));

  // Options should be visible
  expect(screen.getByText('Option 1')).toBeVisible();

  await user.keyboard('{Escape}');
  expect(screen.queryByText('Option 1')).not.toBeVisible();
});

test('has no critical a11y violations', async () => {
  const { container } = render(
    <Select label="Choose option" options={options} />,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('renders with error state', () => {
  render(
    <Select
      label="Choose option"
      options={options}
      error="Please select an option"
    />,
  );
  expect(screen.getByText('Please select an option')).toBeInTheDocument();
  expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
});
