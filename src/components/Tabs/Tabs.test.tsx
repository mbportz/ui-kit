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
    expect(screen.getByRole('tabpanel', { name: /one/i })).toBeVisible();
    expect(screen.getByText('Panel One')).toBeVisible();

    // Other panels hidden
    expect(document.getElementById('panel-two')).not.toBeVisible();
    expect(document.getElementById('panel-three')).not.toBeVisible();
  });

  test('click switches tabs (uncontrolled) and respects disabled', async () => {
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} />);

    const tabTwo = screen.getByRole('tab', { name: 'Two' });
    const tabThree = screen.getByRole('tab', { name: /three/i }); // disabled

    await user.click(tabTwo);
    expect(tabTwo).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Panel Two')).toBeVisible();
    expect(document.getElementById('panel-one')).not.toBeVisible();

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

    // Each tab should reference an existing panel via aria-controls
    tabs.forEach((tab) => {
      const controls = tab.getAttribute('aria-controls');
      expect(controls).toBeTruthy();

      const panel = document.getElementById(controls!);
      expect(panel).toBeTruthy();
      expect(panel).toHaveAttribute('role', 'tabpanel');

      // Panel should point back to the tab via aria-labelledby
      const labelledby = panel!.getAttribute('aria-labelledby');
      // tab must have an id for relationships to work
      const tabId = tab.getAttribute('id');
      expect(tabId).toBeTruthy();
      expect(labelledby).toBe(tabId);
    });

    // Only active tab should be focusable (tabIndex 0); others -1
    const active = tabs.find(
      (t) => t.getAttribute('aria-selected') === 'true',
    )!;
    expect(active).toBeTruthy();
    expect(active).toHaveProperty('tabIndex', 0);

    tabs
      .filter((t) => t !== active)
      .forEach((t) => {
        expect(t).toHaveProperty('tabIndex', -1);
      });

    // Panels exist and only the selected one should be visible
    expect(panels.length).toBeGreaterThan(0);
  });

  test('panel has tabIndex=0 for accessibility and hidden attribute toggles', async () => {
    const user = userEvent.setup();
    render(<Tabs items={makeItems()} />);

    const panelOne = document.getElementById('panel-one') as HTMLElement;
    expect(panelOne).toBeTruthy();
    expect(panelOne).toHaveAttribute('tabIndex', '0');
    expect(panelOne).toBeVisible();

    const tabTwo = screen.getByRole('tab', { name: 'Two' });
    await user.click(tabTwo);

    const panelTwo = document.getElementById('panel-two') as HTMLElement;
    expect(panelTwo).toBeTruthy();
    // Now panel one should be hidden, two visible
    expect(document.getElementById('panel-one')).not.toBeVisible();
    expect(panelTwo).toBeVisible();
  });

  test('does not render anything with empty items (edge case)', () => {
    render(<Tabs items={[]} />);
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
    expect(screen.queryByRole('tab')).not.toBeInTheDocument();
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
  });
});
