import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import Tabs, { type TabItem } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

const baseItems: TabItem[] = [
  { id: 'one', label: 'One', content: <div>Panel One</div> },
  { id: 'two', label: 'Two', content: <div>Panel Two</div> },
  {
    id: 'three',
    label: 'Three (disabled)',
    content: <div>Panel Three</div>,
    disabled: true,
  },
];

export const Uncontrolled: Story = {
  args: {
    items: baseItems,
  },
};

export const WithDisabled: Story = {
  args: {
    items: baseItems,
  },
  name: 'With a disabled tab',
};

export const Controlled: Story = {
  render: (args) => {
    const [active, setActive] = React.useState('two');
    return (
      <div style={{ width: 420 }}>
        <Tabs
          {...args}
          items={baseItems}
          activeId={active}
          onChange={(id) => setActive(id)}
        />
        <div style={{ marginTop: 12, fontSize: 12 }}>
          Active: <b>{active}</b>
        </div>
      </div>
    );
  },
};
