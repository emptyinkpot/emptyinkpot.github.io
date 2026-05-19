import fs from 'node:fs';

const requiredFiles = [
  'README.md',
  'project.frontend-runtime-contract.json',
  'contracts/frontend-runtime-contract.json',
  'contracts/runtime-authority-map.json',
  'contracts/object-projection-contract.json',
  'public-data/books/books.metadata.json',
  'public-data/books/books-index.json',
  'apps/web/public/public-data/books/books-index.json',
  'contracts/collection-behavior-contract.json',
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
const readme = readText('README.md');
const index = readText('apps/web/src/pages/index.astro');
const runtimeBookFeed = readText('apps/web/src/components/books/RuntimeBookFeed.tsx');
const bookshelfGrid = readText('apps/web/src/components/books/BookshelfGrid.tsx');
const booksManifest = readText('apps/web/src/lib/books/manifest.ts');
const buildBooksIndex = readText('tools/build-books-index.mjs');
const booksMetadataText = readText('public-data/books/books.metadata.json');
const booksIndexText = readText('public-data/books/books-index.json');
const collectionDetail = readText('apps/web/src/pages/collections/[slug].astro');
const runtimeStorage = readText('packages/runtime-kernel/src/storage-keys.mjs');

let entry = {};
let contract = {};
let collectionContract = {};
let authorityContract = {};
let booksMetadata = {};
let booksIndex = {};
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
try {
  booksMetadata = JSON.parse(booksMetadataText || '{}');
} catch (error) {
  errors.push(`public-data/books/books.metadata.json is invalid JSON: ${error.message}`);
}
try {
  booksIndex = JSON.parse(booksIndexText || '{}');
} catch (error) {
  errors.push(`public-data/books/books-index.json is invalid JSON: ${error.message}`);
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
  if (!readme.includes(term)) {
    errors.push(`README.md must include: ${term}`);
  }
}

for (const term of [
  'Do not turn collections into standalone CMS pages',
  'Do not replace the homepage mixed-object masonry stream with collection grids',
  'Do not make topic collections prerender into static collection pages',
  'Collection is context. Drawer is reading. Homepage is discovery'
]) {
  if (!readme.includes(term)) {
    errors.push(`README.md must include: ${term}`);
  }
}

if (contract?.productIdentity?.primaryModel !== 'Knowledge Runtime Surface') {
  errors.push('Frontend primary model must be Knowledge Runtime Surface');
}

if (contract?.objectModel?.typeSpecificGrammar?.BookObject?.home !== 'cover-first book projection') {
  errors.push('BookObject home projection must remain cover-first');
}

if (!contract?.objectModel?.typeSpecificGrammar?.BookObject?.stableIdentity?.includes('metadataId')) {
  errors.push('BookObject stable identity must be metadataId, not openlistPath');
}

if (contract?.metadataGovernance?.rule !== 'Index and metadata are separate. Manifests are projections and caches, not editable truth.') {
  errors.push('Frontend contract must define index/metadata/manifest governance');
}

for (const forbiddenMetadataPattern of [
  'const overlays in build scripts',
  'semantic tags/categories hard-coded inside index builders',
  'localStorage becoming a metadata database',
  'OpenList deciding tags, collections, descriptions or status'
]) {
  if (!contract?.metadataGovernance?.forbidden?.includes(forbiddenMetadataPattern)) {
    errors.push(`Frontend contract metadataGovernance must forbid: ${forbiddenMetadataPattern}`);
  }
}

if (contract?.objectModel?.typeSpecificGrammar?.BookObject?.collection !== 'Shelf Surface') {
  errors.push('BookObject collection projection must remain Shelf Surface');
}

if (!contract?.objectModel?.typeSpecificGrammar?.BookObject?.identity?.includes('ReadingObject')) {
  errors.push('BookObject must preserve ReadingObject identity, not only KnowledgeObject identity');
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

for (const forbiddenMerge of [
  'OpenList as metadata authority',
  'books-index as metadata database',
  'build script overlays as metadata database',
  'manifest as runtime truth',
  'localStorage as metadata database'
]) {
  if (!authorityContract?.forbiddenAuthorityMerges?.includes(forbiddenMerge)) {
    errors.push(`runtime-authority-map must forbid: ${forbiddenMerge}`);
  }
}

if (authorityContract?.authorities?.bookFileIndex?.path !== 'public-data/books/books-index.json') {
  errors.push('runtime-authority-map must define bookFileIndex as public-data/books/books-index.json');
}

if (authorityContract?.authorities?.bookMetadataLayer?.path !== 'public-data/books/books.metadata.json') {
  errors.push('runtime-authority-map must define bookMetadataLayer as public-data/books/books.metadata.json');
}

if (!String(authorityContract?.authorities?.browserLocalCache?.role ?? '').includes('never runtime truth')) {
  errors.push('runtime-authority-map must downgrade browser localStorage to cache/preference/legacy migration only');
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

if (!runtimeBookFeed.includes('home-feed-card--book')) {
  errors.push('RuntimeBookFeed must preserve home-feed-card--book projection grammar');
}

if (!runtimeBookFeed.includes('buildCachedBookCoverUrl')) {
  errors.push('RuntimeBookFeed must preserve real cover projection URL fallback');
}

if (runtimeBookFeed.includes('listOpenListFiles(')) {
  errors.push('RuntimeBookFeed must not live-list OpenList; it must read books-index.json');
}

if (bookshelfGrid.includes('listOpenListFiles(')) {
  errors.push('BookshelfGrid must not live-list OpenList; it must read books-index.json');
}

if (!runtimeBookFeed.includes('loadBooksIndex()')) {
  errors.push('RuntimeBookFeed must load public books-index manifest');
}

if (!bookshelfGrid.includes('loadBooksIndex()')) {
  errors.push('BookshelfGrid must load public books-index manifest');
}

if (!booksManifest.includes('/public-data/books/books-index.json')) {
  errors.push('Book manifest loader must read /public-data/books/books-index.json');
}

if (!buildBooksIndex.includes('liveListForbidden: true') || !buildBooksIndex.includes('/Obsidian/docs/books/original')) {
  errors.push('Book index builder must encode canonical path and forbid live-list runtime semantics');
}

if (!buildBooksIndex.includes('books.metadata.json') || buildBooksIndex.includes('const overlays =')) {
  errors.push('Book metadata must live in public-data/books/books.metadata.json, not script-level overlays');
}

for (const forbiddenMetadataLiteral of ["category: '历史'", "category: '设计'", "category: '文学'", "category: '思想'"]) {
  if (buildBooksIndex.includes(forbiddenMetadataLiteral)) {
    errors.push(`Book index builder must not hard-code semantic metadata: ${forbiddenMetadataLiteral}`);
  }
}

if (booksMetadata?.authority !== 'metadata-layer') {
  errors.push('books.metadata.json must declare metadata-layer authority');
}

if (!Array.isArray(booksMetadata?.entries) || booksMetadata.entries.length < 1) {
  errors.push('books.metadata.json must contain editable metadata entries');
}

if (booksIndex?.source?.metadataAuthority !== 'sidecar-json') {
  errors.push('books-index.json must declare sidecar-json metadata authority');
}

if (booksIndex?.source?.liveListForbidden !== true) {
  errors.push('books-index.json must forbid live-list runtime semantics');
}

const storageLiteralPattern = /['"`](emptyinkpot-[A-Za-z0-9:-]+)['"`]/g;
const allowedNonStorageLiterals = new Set([
  'emptyinkpot-openlist-embed-style',
  'emptyinkpot:book-drawer-open',
  'emptyinkpot:book-drawer-close',
  'emptyinkpot:runtime-books-ready',
  'emptyinkpot:runtime-home-feed-ready'
]);
const registryLiterals = new Set([...runtimeStorage.matchAll(storageLiteralPattern)].map((match) => match[1]));
for (const [file, text] of [
  ['apps/web/src/pages/index.astro', index],
  ['apps/web/src/pages/knowledge/index.astro', readText('apps/web/src/pages/knowledge/index.astro')],
  ['apps/web/src/pages/visuals/index.astro', readText('apps/web/src/pages/visuals/index.astro')],
  ['apps/web/src/pages/settings.astro', readText('apps/web/src/pages/settings.astro')],
  ['apps/web/src/layouts/BaseLayout.astro', readText('apps/web/src/layouts/BaseLayout.astro')],
  ['apps/web/src/components/react/HoverPreviewSystem.tsx', readText('apps/web/src/components/react/HoverPreviewSystem.tsx')],
  ['apps/web/src/components/books/BookReader.tsx', readText('apps/web/src/components/books/BookReader.tsx')],
  ['apps/web/src/lib/myblog/plugins.mjs', readText('apps/web/src/lib/myblog/plugins.mjs')]
]) {
  for (const match of text.matchAll(storageLiteralPattern)) {
    const literal = match[1];
    if (allowedNonStorageLiterals.has(literal) || registryLiterals.has(literal)) continue;
    errors.push(`${file} uses unregistered emptyinkpot storage/event literal: ${literal}`);
  }
}

if (!Array.isArray(booksIndex?.books) || booksIndex.books.length < 15) {
  errors.push('books-index.json must preserve a stable public book manifest');
}

if (/allowGeneratedCover=\{false\}/.test(runtimeBookFeed)) {
  errors.push('RuntimeBookFeed must not disable generated cover projection on homepage book cards');
}

if (runtimeBookFeed.includes('loadBookSettings')) {
  errors.push('RuntimeBookFeed must not read browser-local book settings for public bookshelf projection');
}

for (const term of ['data-bookshelf-surface', 'data-book-projection="shelf"', 'bookshelf-mode-switch', 'bookshelf-reading-lane']) {
  if (!bookshelfGrid.includes(term)) {
    errors.push(`BookshelfGrid must preserve Shelf Surface grammar: ${term}`);
  }
}

if (bookshelfGrid.includes('loadBookSettings')) {
  errors.push('BookshelfGrid must not read browser-local book settings for public bookshelf projection');
}

if (!collectionDetail.includes('data-collection-bookshelf-projection') || !collectionDetail.includes('<BookshelfGrid client:load />')) {
  errors.push('Books collection route must project to BookshelfGrid Shelf Surface');
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('Frontend runtime contract passed');
