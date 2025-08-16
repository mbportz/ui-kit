import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import Modal from './Modal';
import { vi } from 'vitest';

describe('Modal Component', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: 'Test Modal',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders when isOpen is true', () => {
    render(
      <Modal {...defaultProps}>
        <div>Modal content</div>
      </Modal>,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  test("doesn't render when isOpen is false", () => {
    render(
      <Modal {...defaultProps} isOpen={false}>
        <div>Modal content</div>
      </Modal>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('calls onClose when clicking overlay', async () => {
    render(
      <Modal {...defaultProps}>
        <div>Modal content</div>
      </Modal>,
    );

    const user = userEvent.setup();
    const overlay = screen.getByTestId('modal-overlay');
    await user.click(overlay);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onClose when pressing Escape', async () => {
    render(
      <Modal {...defaultProps}>
        <div>Modal content</div>
      </Modal>,
    );

    const user = userEvent.setup();
    await user.keyboard('{Escape}');

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  test('traps focus within modal', async () => {
    render(
      <Modal {...defaultProps}>
        <button>First</button>
        <button>Last</button>
      </Modal>,
    );

    const user = userEvent.setup();

    const first = screen.getByText('First');
    first.focus();
    expect(first).toHaveFocus();

    await user.tab();
    const last = screen.getByText('Last');
    expect(last).toHaveFocus();

    await user.tab({ shift: true });
    expect(first).toHaveFocus();

    await user.tab();
    expect(last).toHaveFocus();
  });

  test('renders with custom width', () => {
    render(
      <Modal {...defaultProps} width="500px">
        <div>Modal content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ width: '500px' });
  });

  test('has proper aria attributes', () => {
    render(
      <Modal {...defaultProps}>
        <div>Modal content</div>
      </Modal>,
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  test('has no accessibility violations', async () => {
    const { container } = render(
      <Modal {...defaultProps}>
        <div>Modal content</div>
      </Modal>,
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
});
