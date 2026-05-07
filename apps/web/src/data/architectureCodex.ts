export type ArchitectureCodexEntry = {
  id: string;
  title: string;
  summary: string;
  inspiration: string[];
  runtime: string[];
  tradeoff: string[];
  futureDirection: string[];
  relatedSystems: string[];
};

export const architectureCodexEntries: ArchitectureCodexEntry[] = [
  {
    id: 'single-file-truth',
    title: 'Single File Truth',
    summary:
      'MyBlog treats Markdown, images, PDFs, EPUBs and attachments as files first. Obsidian edits the vault, Remotely Save syncs the vault, OpenList exposes the same file truth, and MyBlog renders a projection of it.',
    inspiration: ['Obsidian vault', 'Remotely Save', 'OpenList WebDAV', 'Quartz', 'SilverBullet'],
    runtime: [
      'Obsidian owns local authoring.',
      'Remotely Save syncs the full vault over WebDAV/S3.',
      'OpenList exposes the cloud vault and raw file URLs.',
      'MyBlog reads and renders; it does not hand-upload data/image or keep a second vault mirror.'
    ],
    tradeoff: [
      'File truth keeps Obsidian portable and debuggable.',
      'The blog gives up direct ownership of attachments, but avoids rebuild/snapshot/mirror drift.',
      'Online editing must write back through the same file boundary rather than inventing a CMS truth.'
    ],
    futureDirection: ['Prefer OpenList WebDAV as the shared file plane.', 'Add SilverBullet-style online editing only if it writes to the same vault.', 'Keep secrets out of static frontend code.'],
    relatedSystems: ['OpenList', 'Obsidian', 'Remotely Save', 'COS/S3', 'MyBlog admin-next']
  },
  {
    id: 'object-layer',
    title: 'Object Layer',
    summary:
      'Files are carriers, not the product model. BookObject, VisualObject, KnowledgeObject and ProjectObject provide stable ids, relations and projections across reader, graph, search and visual surfaces.',
    inspiration: ['Anytype object model', 'AFFiNE', 'Paperless-ngx', 'Obsidian Graph'],
    runtime: [
      'Blob authority stays in OpenList/COS.',
      'Object metadata stays in repo data modules or future server-side DB.',
      'Routes and graph nodes use stable object ids rather than titles or file paths.',
      'Search and reader memory should index objects first, then resolve files.'
    ],
    tradeoff: [
      'Object ids add one layer above files.',
      'That layer prevents file paths, display titles and route ids from becoming competing truths.',
      'Projection pages can change layout without changing the underlying object identity.'
    ],
    futureDirection: ['Define KnowledgeObject, BookObject, VisualObject and ProjectObject schemas.', 'Move relationship search toward object-first indexing.', 'Connect highlights, annotations and visual references to object ids.'],
    relatedSystems: ['Knowledge Graph', 'Book Reader', 'Visual Collections', 'Project Studio']
  },
  {
    id: 'projection-shell',
    title: 'Projection Shell',
    summary:
      'MyBlog is the presentation and operation shell. It projects files, objects and runtime state into reading spaces, project workbenches, visual boards and graph views without becoming the single backend for everything.',
    inspiration: ['Readwise Reader', 'Are.na', 'Arc spaces', 'Apple Books'],
    runtime: [
      'Astro renders static public projections.',
      'React islands handle drawers, reader controls, command palette and local memory.',
      'admin-next handles authenticated write boundaries when needed.',
      'Server runtime directories are deploy targets, not source truth.'
    ],
    tradeoff: [
      'A projection shell keeps frontend delivery fast.',
      'Writable features must be explicit about their backend authority.',
      'Static pages cannot pretend localStorage demos are server truth.'
    ],
    futureDirection: ['Expose object-aware /codex/ entries for future AI maintenance.', 'Keep README and this data file fresh whenever frontend architecture changes.', 'Promote mature runtime boundaries instead of adding local mirrors.'],
    relatedSystems: ['Architecture Codex', 'Reader Runtime', 'admin-next', 'Pagefind']
  },
  {
    id: 'reader-runtime',
    title: 'Reader Runtime',
    summary:
      'The reader is a runtime for knowledge objects, not a file downloader. EPUB and PDF enter the same reading universe as articles: table of contents, body, memory, highlights, annotations and graph relations.',
    inspiration: ['Readest', 'Apple Books', 'WeChat Reading', 'Readwise Reader', 'Kobo Web Reader'],
    runtime: [
      'Book metadata is object metadata.',
      'EPUB rendering uses react-reader over epub.js.',
      'PDF rendering uses react-pdf over PDF.js.',
      'Reader memory remains local today and must later attach to stable object ids.'
    ],
    tradeoff: [
      'PDF is less semantic than EPUB, so EPUB remains the preferred reader asset.',
      'The current PDF renderer still uses paged rendering; continuous runtime and warm pools are future work.',
      'OpenList raw_url resolution must stay behind a secret-safe boundary.'
    ],
    futureDirection: ['Make the reader layer persistent rather than born on click.', 'Split PDF and EPUB runtime warmup.', 'Unify article and book highlights into the same Knowledge Runtime.'],
    relatedSystems: ['BookObject', 'OpenList', 'Knowledge Runtime', 'Reader Memory']
  }
];
