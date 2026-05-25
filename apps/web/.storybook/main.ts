import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)', '../../admin-next/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-docs', '@storybook/addon-vitest'],
  framework: '@storybook/react-vite',
  staticDirs: ['../public'],
  viteFinal: async (config) => {
    config.optimizeDeps = {
      ...(config.optimizeDeps ?? {}),
      include: [
        ...((config.optimizeDeps?.include as string[] | undefined) ?? []),
        'hast-util-to-string',
        'mockdate',
        'msw-storybook-addon',
        'lucide-react',
        '@blocknote/mantine',
        '@blocknote/react',
        '@floating-ui/react',
        '@radix-ui/react-slot',
        '@radix-ui/react-tooltip',
        'class-variance-authority',
        'clsx',
        'cmdk',
        'motion/react',
        'radix-ui',
        'rehype-pretty-code',
        'rehype-slug',
        'rehype-stringify',
        'remark-gfm',
        'remark-parse',
        'remark-rehype',
        'react',
        'react-dom',
        'react/jsx-dev-runtime',
        'react-pdf',
        'react-reader',
        'storybook/test',
        'tailwind-merge',
        'unified',
        'unist-util-visit'
      ]
    };
    config.esbuild = {
      ...(config.esbuild ?? {}),
      jsx: 'automatic'
    };
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      '~': fileURLToPath(new URL('../src', import.meta.url)),
      '@': fileURLToPath(new URL('../../admin-next', import.meta.url)),
      react: fileURLToPath(new URL('../node_modules/react', import.meta.url)),
      'react-dom': fileURLToPath(new URL('../node_modules/react-dom', import.meta.url)),
      'react/jsx-dev-runtime': fileURLToPath(new URL('../node_modules/react/jsx-dev-runtime.js', import.meta.url)),
      'storybook/test': fileURLToPath(new URL('../node_modules/storybook/dist/test/index.js', import.meta.url)),
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
