import type { Meta, StoryObj } from '@storybook/react-vite';
import ToastProvider, { useToast } from './Toast';

const meta: Meta = {
  title: 'Components/Toast',
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};
export default meta;

type Story = StoryObj;

function Demo() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'grid', gap: 8, minWidth: 260 }}>
      <button
        onClick={() =>
          toast({
            title: 'Saved',
            description: 'Your changes were saved.',
            variant: 'success',
          })
        }
      >
        Success
      </button>
      <button
        onClick={() =>
          toast({
            title: 'Heads up',
            description: 'Draft autosaved.',
            variant: 'info',
          })
        }
      >
        Info
      </button>
      <button
        onClick={() =>
          toast({
            title: 'Low space',
            description: 'Storage is almost full.',
            variant: 'warning',
          })
        }
      >
        Warning
      </button>
      <button
        onClick={() =>
          toast({
            title: 'Failed to save',
            description: 'Try again.',
            variant: 'error',
          })
        }
      >
        Error
      </button>
      <button
        onClick={() =>
          toast({
            title: 'Sticky note',
            description: 'This stays until closed.',
            duration: 0,
          })
        }
      >
        Sticky (no auto-dismiss)
      </button>
    </div>
  );
}

export const Playground: Story = { render: () => <Demo /> };
