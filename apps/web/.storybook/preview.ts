import type { Preview } from '@storybook/react-vite';
import '../src/styles/global.css';
import './storybook.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
};

export default preview;
