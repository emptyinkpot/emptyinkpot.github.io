import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createGitHubOverviewSnapshot, fetchLiveGitHubOverview } from './github-overview-core.mjs';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));
const username = 'emptyinkpot';
const outputPath = resolve(rootDir, 'apps/web/src/data/github-overview.emptyinkpot.json');

const overview = await fetchLiveGitHubOverview(username);
const snapshot = createGitHubOverviewSnapshot(username, overview);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

console.log(`GitHub overview snapshot refreshed: ${outputPath}`);
console.log(`Fetched at: ${snapshot.fetchedAt}`);
console.log(`Repos: ${snapshot.overview.repos.length}, contributions: ${snapshot.overview.totalContributions}`);
