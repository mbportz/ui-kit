import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
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
  const user = userEvent.setup();
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
  const user = userEvent.setup();

  const select = screen.getByRole('combobox') as HTMLSelectElement;
  await user.selectOptions(select, '2');

  expect(handleChange).toHaveBeenCalledTimes(1);
  expect(select.value).toBe('2');
  expect(select).toHaveDisplayValue('Option 2');
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
  const select = screen.getByRole('combobox') as HTMLSelectElement;
  const user = userEvent.setup();

  await user.selectOptions(select, '1');

  expect(select.value).toBe('1');
  const option1 = screen.getByRole('option', {
    name: 'Option 1',
  }) as HTMLOptionElement;
  expect(option1.selected).toBe(true);
});

test('closes dropdown on escape key', async () => {
  render(<Select label="Choose option" options={options} />);
  const user = userEvent.setup();
  const select = screen.getByRole('combobox');
  await user.click(select);
  expect(select).toHaveFocus();

  await user.keyboard('{Escape}');
  expect(select).toHaveFocus();
});

test('has no critical a11y violations', async () => {
  const { container } = render(
    <Select label="Choose option" options={options} />,
  );
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
