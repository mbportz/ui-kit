import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
    },

    layout: 'centered',

    a11y: {
      element: '#storybook-root',
      options: {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] },
      },
    },
  },
};

export default preview;
