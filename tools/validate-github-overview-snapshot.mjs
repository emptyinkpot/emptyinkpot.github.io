import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateGitHubOverviewSnapshot } from './github-overview-core.mjs';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const snapshotPath = resolve(rootDir, 'apps/web/src/data/github-overview.emptyinkpot.json');
const raw = await readFile(snapshotPath, 'utf8');
const parsed = JSON.parse(raw);
const snapshot = validateGitHubOverviewSnapshot(parsed, 'emptyinkpot');

console.log(`Validated GitHub overview snapshot: ${snapshotPath}`);
console.log(`Fetched at: ${snapshot.fetchedAt}`);
console.log(`Total contributions: ${snapshot.overview.totalContributions}`);
