import fs from 'node:fs';

const requiredFiles = [
  'project.frontend-runtime-contract.json',
  'FRONTEND_DESIGN_PHILOSOPHY.md',
  'AI_RULES.md',
  'contracts/frontend-runtime-contract.json',
  'contracts/runtime-authority-map.json',
  'contracts/object-projection-contract.json',
  'contracts/collection-behavior-contract.json',
  'philosophy/FRONTEND_DESIGN_PHILOSOPHY.md',
  'philosophy/RUNTIME_IDENTITY.md',
  'philosophy/KNOWLEDGE_OBJECT_MODEL.md',
  'philosophy/COLLECTION_MODEL.md',
  'philosophy/ANTI_CMS_RULES.md',
  'topology/SYSTEM_TOPOLOGY.md',
  'topology/RUNTIME_GRAPH.md',
  'topology/SYNC_ARCHITECTURE.md',
  'topology/DEPLOY_GRAPH.md',
  'adr/ADR-001-collections-are-lenses-not-pages.md',
  'adr/ADR-002-feed-tabs-must-not-navigate.md',
  'adr/ADR-003-mixed-object-masonry-is-core-identity.md',
  'apps/web/src/pages/index.astro'
];

const errors = [];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) errors.push(`Missing ${file}`);
}

const readText = (file) => (fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '');

const entryText = readText('project.frontend-runtime-contract.json');
const contractText = readText('contracts/frontend-runtime-contract.json');
const collectionContractText = readText('contracts/collection-behavior-contract.json');
const authorityText = readText('contracts/runtime-authority-map.json');
const aiRules = readText('AI_RULES.md');
const index = readText('apps/web/src/pages/index.astro');
const philosophy = readText('philosophy/FRONTEND_DESIGN_PHILOSOPHY.md');
const rootPhilosophy = readText('FRONTEND_DESIGN_PHILOSOPHY.md');

let entry = {};
let contract = {};
let collectionContract = {};
let authorityContract = {};
try {
  entry = JSON.parse(entryText || '{}');
} catch (error) {
  errors.push(`project.frontend-runtime-contract.json is invalid JSON: ${error.message}`);
}
try {
  contract = JSON.parse(contractText || '{}');
} catch (error) {
  errors.push(`contracts/frontend-runtime-contract.json is invalid JSON: ${error.message}`);
}
try {
  collectionContract = JSON.parse(collectionContractText || '{}');
} catch (error) {
  errors.push(`contracts/collection-behavior-contract.json is invalid JSON: ${error.message}`);
}
try {
  authorityContract = JSON.parse(authorityText || '{}');
} catch (error) {
  errors.push(`contracts/runtime-authority-map.json is invalid JSON: ${error.message}`);
}

if (entry?.name !== 'myblog-frontend-runtime-contract') {
  errors.push('project.frontend-runtime-contract.json must be the root frontend runtime contract');
}

if (entry?.productIdentity?.primaryModel !== 'Knowledge Runtime Surface') {
  errors.push('Root frontend contract primary model must be Knowledge Runtime Surface');
}

if (entry?.canonicalContract && entry.canonicalContract !== 'contracts/frontend-runtime-contract.json') {
  errors.push('project.frontend-runtime-contract.json canonicalContract must point to contracts/frontend-runtime-contract.json when present');
}

for (const term of [
  'Knowledge Runtime Surface',
  'Everything stays alive',
  'Collection is context',
  'Drawer is reading'
]) {
  if (!philosophy.includes(term)) {
    errors.push(`FRONTEND_DESIGN_PHILOSOPHY.md must include: ${term}`);
  }
  if (!rootPhilosophy.includes(term)) {
    errors.push(`Root FRONTEND_DESIGN_PHILOSOPHY.md must include: ${term}`);
  }
}

for (const term of [
  'Do not turn collections into standalone CMS pages',
  'Do not replace the homepage mixed-object masonry stream with collection grids',
  'Do not make topic collections prerender into static collection pages',
  'Collection is context. Drawer is reading. Homepage is discovery'
]) {
  if (!aiRules.includes(term)) {
    errors.push(`AI_RULES.md must include: ${term}`);
  }
}

if (contract?.productIdentity?.primaryModel !== 'Knowledge Runtime Surface') {
  errors.push('Frontend primary model must be Knowledge Runtime Surface');
}

if (contract?.primarySurface?.role !== 'mixed object discovery surface') {
  errors.push('Homepage primary surface role must be mixed object discovery surface');
}

const requiredPreserve = [
  'heterogeneous masonry feed',
  'feed tabs without page reload',
  'drawer peek without full navigation',
  'mixed object stream'
];

for (const item of requiredPreserve) {
  if (!contract?.primarySurface?.mustPreserve?.includes(item)) {
    errors.push(`primarySurface.mustPreserve must include: ${item}`);
  }
}

if (collectionContract?.basisRules?.topic?.staticCollectionPage !== false) {
  errors.push('Topic collections must not generate static collection pages');
}

if (collectionContract?.basisRules?.topic?.metadataSearchGraphDimension !== true) {
  errors.push('Topic collections must remain metadata/search/Graph dimensions');
}

if (!authorityContract?.forbiddenAuthorityMerges?.includes('OpenList as CMS')) {
  errors.push('runtime-authority-map must forbid OpenList as CMS');
}

for (const forbidden of [
  'collection-only homepage',
  'collection page takeover',
  'drawer card wall'
]) {
  if (index.includes(forbidden)) {
    errors.push(`Forbidden frontend pattern found: ${forbidden}`);
  }
}

if (/const\s+feedItems\s*=\s*collectionFeedItems\s*;/.test(index)) {
  errors.push('Homepage feedItems must not be collection-only');
}

for (const feedSource of [
  'collectionFeedItems',
  'postItems',
  'noteItems',
  'projectItems',
  'RuntimeBookFeed',
  'musicFeedItems',
  'githubItems',
  'visualFeedItems'
]) {
  if (!index.includes(feedSource)) {
    errors.push(`Homepage mixed feed source missing: ${feedSource}`);
  }
}

for (const filter of ['all', 'collection', 'post', 'note', 'project', 'book', 'music', 'github', 'visual']) {
  if (!index.includes(`data-feed-filter="${filter}"`)) {
    errors.push(`Homepage client-side feed tab missing: ${filter}`);
  }
}

if (/<a[^>]+data-feed-filter=/.test(index)) {
  errors.push('Feed tabs with data-feed-filter must be buttons, not route links');
}

if (!index.includes('data-home-collection-session') || !index.includes('data-home-collection-body')) {
  errors.push('Collection drawer must keep ReaderSession body hooks');
}

if (!index.includes('data-home-collection-detail-url')) {
  errors.push('Collection drawer must switch active objects inside the drawer');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Frontend runtime contract passed');
