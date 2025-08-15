import type { Meta, StoryObj } from '@storybook/react-vite';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  args: {
    label: 'Email',
    placeholder: 'you@example.com',
    hint: 'We’ll never share your email.',
    required: false,
    disabled: false,
  },
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    type: { control: 'inline-radio', options: ['text', 'email', 'password'] },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};
export const WithError: Story = {
  args: { error: 'Please enter a valid email address.' },
};
export const Disabled: Story = {
  args: { disabled: true },
};
