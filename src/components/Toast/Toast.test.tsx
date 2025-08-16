import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import ToastProvider, { useToast } from './Toast';
import styles from './Toast.module.css';
import { vi } from 'vitest';

// Define the possible variant values as a type
type ToastVariant = 'success' | 'error' | 'info' | 'warning';

type ToastOptions = {
  message: string;
  title?: string;
  duration?: number;
  variant?: ToastVariant;
};

function TestToast({
  options = { message: 'Test toast' } as ToastOptions,
}: {
  options?: ToastOptions;
}) {
  const { toast } = useToast();
  React.useEffect(() => {
    toast(options);
  }, [options, toast]);
  return null;
}

// Helper to render with Toast provider
function renderWithToast(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>);
}

describe('Toast', () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('renders toast with message', () => {
    renderWithToast(<TestToast options={{ message: 'Test notification' }} />);
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  test('renders toast with title and message', () => {
    renderWithToast(
      <TestToast
        options={{
          title: 'Hello',
          message: 'Test message',
        }}
      />,
    );
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  test('auto dismisses after duration', () => {
    vi.useFakeTimers();
    renderWithToast(
      <TestToast
        options={{
          message: 'Will dismiss',
          duration: 3000,
        }}
      />,
    );

    expect(screen.getByText('Will dismiss')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Will dismiss')).not.toBeInTheDocument();
    vi.useRealTimers();
  });

  test('can be manually dismissed', async () => {
    renderWithToast(<TestToast options={{ message: 'Dismiss me' }} />);
    const user = userEvent.setup();

    const closeButton = screen.getByRole('button', {
      name: 'Dismiss notification',
    });
    await user.click(closeButton);

    expect(screen.queryByText('Dismiss me')).not.toBeInTheDocument();
  });

  test('renders with different variants', () => {
    renderWithToast(
      <TestToast
        options={{
          message: 'Error message',
          variant: 'error',
        }}
      />,
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass(styles.error);
  });

  test('uses correct ARIA roles', () => {
    renderWithToast(
      <TestToast
        options={{
          title: 'Success',
          message: 'Operation completed',
          variant: 'success',
        }}
      />,
    );

    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-labelledby');
    expect(toast).toHaveAttribute('aria-describedby');
  });

  test('has no accessibility violations', async () => {
    const { container } = renderWithToast(
      <TestToast options={{ message: 'Test message' }} />,
    );
    const results = await axe(container);
    // Assert manually to avoid matcher incompatibilities between jest-axe and Vitest
    if (results.violations.length > 0) {
      // Print helpful details for debugging on failure
      // (rule id, description, and the first node’s target)
      // This makes the failure actionable without relying on custom matchers
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
