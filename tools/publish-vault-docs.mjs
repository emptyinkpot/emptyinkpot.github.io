import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const defaultVaultRoot = process.env.MYBLOG_VAULT_ROOT || 'E:/My Project/content-vault';
const postsRoot = path.resolve(rootDir, 'apps/web/src/content/posts');
const args = new Set(process.argv.slice(2));
const write = args.has('--write');
const strict = args.has('--strict');
const vaultRootArg = readArgValue('--vault');
const vaultRoot = path.resolve(vaultRootArg || defaultVaultRoot);
const issues = [];
const publishableDocs = [];

if (!fs.existsSync(vaultRoot)) {
  console.log(`Vault root not found: ${vaultRoot}`);
  console.log('Set MYBLOG_VAULT_ROOT or pass --vault <path>. No files were written.');
  process.exit(strict ? 1 : 0);
}

scanVault();

if (issues.length) {
  console.error(['Vault publish validation found issues:', ...issues.map((issue) => `- ${issue}`)].join('\n'));
  if (strict) {
    process.exit(1);
  }
}

if (!publishableDocs.length) {
  console.log(`No publishable docs found in ${vaultRoot}`);
  process.exit(0);
}

for (const doc of publishableDocs) {
  const outputPath = path.join(postsRoot, `${doc.slug}.md`);
  if (write) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, doc.output, 'utf8');
  }
}

console.log(`${write ? 'Published' : 'Dry run'} ${publishableDocs.length} vault doc(s):`);
for (const doc of publishableDocs) {
  console.log(`- ${doc.relativePath} -> apps/web/src/content/posts/${doc.slug}.md`);
}

if (!write) {
  console.log('Dry run only. Re-run with --write to update Astro posts.');
}

function scanVault() {
  const files = listMarkdownFiles(vaultRoot);
  const docsBySlug = new Map();

  for (const absolutePath of files) {
    const relativePath = toSlash(path.relative(vaultRoot, absolutePath));
    if (isPrivatePath(relativePath)) {
      continue;
    }

    const source = fs.readFileSync(absolutePath, 'utf8');
    const parsed = parseFrontmatter(source);
    if (!parsed) {
      continue;
    }

    const data = parseYamlish(parsed.frontmatter);
    const published = readBoolean(data.published);
    const draft = readBoolean(data.draft);

    if (!published || draft) {
      continue;
    }

    const title = readString(data.title) || path.basename(relativePath, path.extname(relativePath));
    const slug = slugify(readString(data.slug) || relativePath.replace(/\.[^.]+$/, ''));
    const date = readString(data.date) || currentDate();
    const summary = readString(data.summary) || readString(data.description);
    const description = readString(data.description) || summary;
    const folderTags = getFolderTags(relativePath);
    const explicitTags = readStringList(data.tags);
    const finalTags = unique([...folderTags, ...explicitTags]);
    const categories = unique(readStringList(data.categories).length ? readStringList(data.categories) : folderTags.slice(0, 1));
    const series = readString(data.series);

    validateRequired({ relativePath, title, slug, date, summary, description });

    if (docsBySlug.has(slug)) {
      issues.push(`Duplicate published slug "${slug}": ${docsBySlug.get(slug)} and ${relativePath}`);
      continue;
    }

    docsBySlug.set(slug, relativePath);

    const body = normalizeBody(parsed.body, relativePath);
    const output = renderPost({
      title,
      description,
      date,
      slug,
      summary,
      tags: finalTags,
      categories,
      series,
      body
    });

    publishableDocs.push({ relativePath, slug, output });
  }
}

function validateRequired({ relativePath, title, slug, date, summary, description }) {
  if (!title) {
    issues.push(`Published doc is missing title: ${relativePath}`);
  }
  if (!slug) {
    issues.push(`Published doc is missing slug: ${relativePath}`);
  }
  if (!date) {
    issues.push(`Published doc is missing date: ${relativePath}`);
  }
  if (!summary && !description) {
    issues.push(`Published doc must provide summary or description: ${relativePath}`);
  }
}

function renderPost({ title, description, date, slug, summary, tags, categories, series, body }) {
  const frontmatter = [
    '---',
    `title: ${quoteYaml(title)}`,
    `description: ${quoteYaml(description)}`,
    `date: ${quoteYaml(date)}`,
    `slug: ${quoteYaml(slug)}`,
    `summary: ${quoteYaml(summary)}`,
    renderList('tags', tags),
    renderList('categories', categories),
    series ? `series: ${quoteYaml(series)}` : '',
    'featured: false',
    'draft: false',
    'toc: true',
    '---'
  ].filter(Boolean).join('\n');

  return `${frontmatter}\n\n${body.trim()}\n`;
}

function normalizeBody(body, relativePath) {
  return body
    .replace(/!\[\[([^\]]+)\]\]/g, (_match, target) => {
      issues.push(`Obsidian embed requires asset migration before publish: ${relativePath} -> ${target}`);
      return `<!-- TODO: migrate Obsidian embed ${target} -->`;
    })
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_match, target, label) => `[${label}](#${slugify(target)})`)
    .replace(/\[\[([^\]]+)\]\]/g, (_match, target) => `[${target}](#${slugify(target)})`);
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) {
    return null;
  }

  return {
    frontmatter: match[1],
    body: source.slice(match[0].length)
  };
}

function parseYamlish(frontmatter) {
  const lines = frontmatter.split(/\r?\n/);
  const data = {};
  let currentKey = '';

  for (const line of lines) {
    if (/^\s*-\s+/.test(line) && currentKey) {
      data[currentKey] ||= [];
      data[currentKey].push(stripQuotes(line.replace(/^\s*-\s+/, '').trim()));
      continue;
    }

    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      continue;
    }

    currentKey = match[1];
    const value = match[2].trim();
    data[currentKey] = value ? stripQuotes(value) : [];
  }

  return data;
}

function listMarkdownFiles(directory) {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        return listMarkdownFiles(absolutePath);
      }

      return /\.mdx?$/i.test(entry.name) ? [absolutePath] : [];
    });
}

function isPrivatePath(relativePath) {
  return relativePath
    .split('/')
    .some((segment) => segment.startsWith('.') || segment === 'assets' || segment === 'private' || segment === 'drafts');
}

function getFolderTags(relativePath) {
  const segments = relativePath.split('/').slice(0, -1);
  return segments.map((segment) => slugify(segment)).filter(Boolean);
}

function readArgValue(name) {
  const argv = process.argv.slice(2);
  const index = argv.indexOf(name);
  return index >= 0 ? argv[index + 1] : '';
}

function readString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function readBoolean(value) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value !== 'string') {
    return false;
  }
  return value.toLowerCase() === 'true';
}

function readStringList(value) {
  if (Array.isArray(value)) {
    return value.map(readString).filter(Boolean);
  }
  if (typeof value === 'string' && value.startsWith('[') && value.endsWith(']')) {
    return value
      .slice(1, -1)
      .split(',')
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean);
  }
  return [];
}

function renderList(name, values) {
  if (!values.length) {
    return `${name}: []`;
  }

  return [`${name}:`, ...values.map((value) => `  - ${quoteYaml(value)}`)].join('\n');
}

function quoteYaml(value) {
  return JSON.stringify(String(value ?? ''));
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, '');
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function currentDate() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\\/g, '/')
    .replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function toSlash(value) {
  return value.replace(/\\/g, '/');
}
