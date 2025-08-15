import type { Meta, StoryObj } from '@storybook/react-vite';
import Select from './Select';

const countries = [
  { value: 'ph', label: 'Philippines' },
  { value: 'us', label: 'United States' },
  { value: 'jp', label: 'Japan' },
  { value: 'de', label: 'Germany' },
];

const meta: Meta<typeof Select> = {
  title: 'Components/Select',
  component: Select,
  args: {
    label: 'Country',
    options: countries,
    hint: 'Use Arrow keys or type the first letters.',
    required: false,
    disabled: false,
  },
  parameters: { layout: 'centered' },
};
export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: { defaultValue: 'ph' },
};

export const WithPlaceholder: Story = {
  args: { placeholder: 'Select a country', defaultValue: '' },
};

export const WithError: Story = {
  args: { error: 'Please choose your country.' },
};

export const Disabled: Story = {
  args: { disabled: true },
};
