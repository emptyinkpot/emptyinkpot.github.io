import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../../admin-next/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.esbuild = {
      ...(config.esbuild ?? {}),
      jsxInject: `import React from 'react';`
    };
    config.optimizeDeps = {
      ...(config.optimizeDeps ?? {}),
      include: [
        ...((config.optimizeDeps?.include as string[] | undefined) ?? []),
        'hast-util-to-string',
        'rehype-pretty-code',
        'rehype-slug',
        'rehype-stringify',
        'remark-gfm',
        'remark-parse',
        'remark-rehype',
        'unified',
        'unist-util-visit'
      ]
    };
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '@': fileURLToPath(new URL('../../admin-next', import.meta.url)),
      '../../lib/books/manifest': fileURLToPath(new URL('../src/stories/mocks/booksManifest.ts', import.meta.url)),
      '../../lib/runtime/reader': fileURLToPath(new URL('../src/stories/mocks/runtimeReader.ts', import.meta.url)),
      '../../lib/books/openlist': fileURLToPath(new URL('../src/stories/mocks/booksOpenList.ts', import.meta.url)),
      './readerRuntime': fileURLToPath(new URL('../src/stories/mocks/readerRuntime.tsx', import.meta.url))
    };
    config.server = {
      ...(config.server ?? {}),
      fs: {
        ...(config.server?.fs ?? {}),
        allow: [
          ...((config.server?.fs?.allow as string[] | undefined) ?? []),
          fileURLToPath(new URL('../..', import.meta.url))
        ]
      }
    };
    return config;
  }
};

export default config;
