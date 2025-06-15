import type { Preview } from '@storybook/react'

// Auto-import all component CSS files
import '@poc/button/dist/button.css';
// Add more component CSS imports here as you create new components
// import '@poc/input/dist/input.css';
// import '@poc/card/dist/card.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;