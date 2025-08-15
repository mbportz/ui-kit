import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tabs from './Tabs';
import { vi } from 'vitest';

const makeItems = () => [
  { id: 'one', label: 'One', content: <div>Panel One</div> },
  { id: 'two', label: 'Two', content: <div>Panel Two</div> },
  {
    id: 'three',
    label: 'Three',
    content: <div>Panel Three</div>,
    disabled: true,
  },
];

describe('Tabs', () => {
  test('renders tabs and shows first panel by default (uncontrolled)', () => {
    render(<Tabs items={makeItems()} />);

    const tablist = screen.getByRole('tablist', { name: /tabs/i });
    expect(tablist).toBeInTheDocument();

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);

    // First tab selected by default
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
    expect(tabs[0].id).toBe('tab-one');
    expect(screen.getByRole('tabpanel', { name: /one/i })).toBeVisible();
    expect(screen.getByText('Panel One')).toBeVisible();

    // Other panels hidden
    expect(screen.getByRole('tabpanel', { name: /two/i })).not.toBeVisible();
    expect(screen.getByRole('tabpanel', { name: /three/i })).not.toBeVisible();
  });

  test('click switches tabs (uncontrolled) and respects disabled', async () => {
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} />);

    const tabTwo = screen.getByRole('tab', { name: 'Two' });
    const tabThree = screen.getByRole('tab', { name: /three/i }); // disabled

    await user.click(tabTwo);
    expect(tabTwo).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel Two')).toBeVisible();
    expect(screen.getByRole('tabpanel', { name: /one/i })).not.toBeVisible();

    // Disabled tab should not activate
    await user.click(tabThree);
    expect(tabThree).toBeDisabled();
    expect(tabTwo).toHaveAttribute('aria-selected', 'true'); // still on Two
  });

  test('keyboard ArrowRight/ArrowLeft navigates between tabs', async () => {
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} />);

    const [tabOne, tabTwo] = screen.getAllByRole('tab');

    // Focus the active tab and navigate right
    tabOne.focus();
    await user.keyboard('{ArrowRight}');
    expect(tabTwo).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel Two')).toBeVisible();

    // Navigate left (wraps back)
    await user.keyboard('{ArrowLeft}');
    expect(tabOne).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel One')).toBeVisible();
  });

  test('controlled mode uses activeId and calls onChange', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn ? vi.fn() : jest.fn();
    const items = makeItems();

    const { rerender } = render(
      <Tabs items={items} activeId="two" onChange={onChange} />,
    );

    // activeId controls selection
    const tabTwo = screen.getByRole('tab', { name: 'Two' });
    expect(tabTwo).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel Two')).toBeVisible();

    // Clicking a different tab should call onChange but NOT switch until parent updates
    const tabOne = screen.getByRole('tab', { name: 'One' });
    await user.click(tabOne);
    expect(onChange).toHaveBeenCalledWith('one');
    // still on "two" because parent hasn't changed activeId yet
    expect(tabTwo).toHaveAttribute('aria-selected', 'true');

    // Simulate parent updating activeId
    rerender(<Tabs items={items} activeId="one" onChange={onChange} />);
    expect(tabOne).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel One')).toBeVisible();
  });

  test('sets correct ARIA relationships and tabIndex', () => {
    render(<Tabs items={makeItems()} />);
    const tabs = screen.getAllByRole('tab');
    const panels = screen.getAllByRole('tabpanel');

    tabs.forEach((tab) => {
      const controls = tab.getAttribute('aria-controls');
      expect(controls).toBeTruthy();
      const panel = panels.find((p) => p.id === controls);
      expect(panel).toBeTruthy();

      const labelledby = panel!.getAttribute('aria-labelledby');
      expect(labelledby).toBe(tab.id);
    });

    // Only active tab should have tabIndex=0; others -1
    const active = tabs.find(
      (t) => t.getAttribute('aria-selected') === 'true',
    )!;
    expect(active).toHaveAttribute('tabIndex', '0');
    tabs
      .filter((t) => t !== active)
      .forEach((t) => {
        expect(t).toHaveAttribute('tabIndex', '-1');
      });
  });

  test('panel has tabIndex=0 for accessibility and hidden attribute toggles', async () => {
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} />);

    const panelOne = screen.getByRole('tabpanel', { name: /one/i });
    expect(panelOne).toHaveAttribute('tabIndex', '0');
    expect(panelOne).toBeVisible();

    const tabTwo = screen.getByRole('tab', { name: 'Two' });
    await user.click(tabTwo);

    const panelTwo = screen.getByRole('tabpanel', { name: /two/i });
    // Now panel one should be hidden, two visible
    expect(panelOne).not.toBeVisible();
    expect(panelTwo).toBeVisible();
  });

  test('does not render anything with empty items (edge case)', () => {
    render(<Tabs items={[]} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });
});
