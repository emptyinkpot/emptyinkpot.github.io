import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  viteFinal: async (config) => {
    config.esbuild = {
      ...(config.esbuild ?? {}),
      jsxInject: `import React from 'react';`
    };
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '../../lib/books/manifest': fileURLToPath(new URL('../src/stories/mocks/booksManifest.ts', import.meta.url)),
      '../../lib/runtime/reader': fileURLToPath(new URL('../src/stories/mocks/runtimeReader.ts', import.meta.url)),
      '../../lib/books/openlist': fileURLToPath(new URL('../src/stories/mocks/booksOpenList.ts', import.meta.url))
    };
    return config;
  }
};

export default config;
