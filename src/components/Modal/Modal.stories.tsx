import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Modal from './Modal';
import Button from '../Button/Button';

const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Modal>;

export const Playground: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ minHeight: 240 }}>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Terms and conditions"
        >
          <p>
            This is focus-trapped. Use Tab/Shift+Tab. Press ESC or click the
            backdrop to close.
          </p>
          <input placeholder="Focusable input" />
        </Modal>
      </div>
    );
  },
};

export const LongContent: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div style={{ minHeight: 240 }}>
        <Button onClick={() => setOpen(true)}>Open</Button>
        <Modal
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Long content"
        >
          <p>Scroll the page is locked while open.</p>
          <p>Lorem ipsum dolor sit amet…</p>
          <Button onClick={() => alert('Action!')}>Primary action</Button>
        </Modal>
      </div>
    );
  },
};
