import type { Preview } from '@storybook/react-vite';
import MockDate from 'mockdate';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/styles/global.css';
import '../../admin-next/app/globals.css';
import './storybook.css';
import { mswHandlers } from './msw-handlers';

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    layout: 'fullscreen',
    msw: {
      handlers: mswHandlers
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  async beforeEach() {
    localStorage.setItem(
      'emptyinkpot-book-settings',
      JSON.stringify({
        sourceBaseUrl: '/openlist',
        readerTheme: 'sepia',
        coverMode: 'cached'
      })
    );
    localStorage.setItem('emptyinkpot-reader-theme', 'sepia');
    localStorage.setItem(
      'emptyinkpot-visual-settings',
      JSON.stringify({
        interactions: {
          hoverPreview: true
        }
      })
    );
    MockDate.set('2026-05-25T12:00:00.000Z');
  }
};

export default preview;
