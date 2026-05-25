// @ts-check
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { markdownRehypePlugins } from './src/lib/markdown/pipeline';

const site = process.env.SITE_URL ?? 'https://blog.tengokukk.com';
const base = process.env.SITE_BASE ?? '/';

// https://astro.build/config
export default defineConfig({
  site,
  base,
  build: {
    concurrency: 1
  },
  markdown: {
    rehypePlugins: markdownRehypePlugins
  },
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  },

  integrations: [mdx(), react(), sitemap()]
});
