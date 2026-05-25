import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import fs from 'node:fs';
import path from 'node:path';

const dirname = import.meta.dirname;
const localEdgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const launchOptions = fs.existsSync(localEdgePath) ? { executablePath: localEdgePath } : undefined;

export default defineConfig({
  test: {
    projects: [
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({
              launchOptions
            }),
            instances: [{ browser: 'chromium' }]
          }
        }
      }
    ]
  }
});
