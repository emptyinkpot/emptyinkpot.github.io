import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const appDir = 'apps/web';
const postsDir = resolvePath(`${appDir}/src/content/posts`);
const contentRootDir = resolvePath(`${appDir}/src/content`);
const rssPagePath = resolvePath(`${appDir}/src/pages/rss.xml.ts`);
const searchPagePath = resolvePath(`${appDir}/src/pages/search.astro`);
const issues = [];
const canonicalOwners = new Map();
const slugOwners = new Map();
const redirectOwners = new Map();

validatePosts();
validateSiteSupportPages();

if (issues.length) {
  console.error(['Content governance validation failed:', ...issues.map((issue) => `- ${issue}`)].join('\n'));
  process.exit(1);
}

console.log('Content governance validation passed');

function validatePosts() {
  const postFiles = listMarkdownFiles(postsDir);

  if (!postFiles.length) {
    issues.push(`No post files were found in ${appDir}/src/content/posts`);
    return;
  }

  postFiles.forEach((absolutePath) => {
    const relativePath = toRelativePath(absolutePath);
    const source = readText(absolutePath);
    const frontmatter = extractFrontmatter(source, relativePath);

    if (!frontmatter) {
      return;
    }

    const slug = readScalarField(frontmatter, 'slug');
    const description = readScalarField(frontmatter, 'description');
    const summary = readScalarField(frontmatter, 'summary');
    const canonical = readScalarField(frontmatter, 'canonical');
    const redirectFrom = readListField(frontmatter, 'redirectFrom');
    const markdownLinks = extractMarkdownLinks(source);

    if (!slug) {
      issues.push(`Post is missing slug: ${relativePath}`);
    } else {
      recordUnique(slugOwners, slug, `Duplicate canonical slug: ${slug}`);
    }

    if (!description && !summary) {
      issues.push(`Post must provide description or summary: ${relativePath}`);
    }

    if (summary && summary.length < 24) {
      issues.push(`Post summary is too short to be useful: ${relativePath}`);
    }

    if (canonical) {
      if (!/^https?:\/\//.test(canonical)) {
        issues.push(`Canonical URL must be absolute: ${relativePath}`);
      }

      recordUnique(canonicalOwners, canonical, `Duplicate canonical URL: ${canonical}`);
    }

    redirectFrom.forEach((alias) => {
      if (!alias) {
        issues.push(`redirectFrom contains an empty alias: ${relativePath}`);
        return;
      }

      if (/^https?:\/\//.test(alias)) {
        issues.push(`redirectFrom must use slug aliases, not full URLs: ${relativePath}`);
      }

      if (alias.includes('/')) {
        issues.push(`redirectFrom alias must be a single slug segment: ${relativePath} -> ${alias}`);
      }

      if (slug && alias === slug) {
        issues.push(`redirectFrom alias duplicates the canonical slug: ${relativePath} -> ${alias}`);
      }

      recordUnique(redirectOwners, alias, `Duplicate redirectFrom alias: ${alias}`);
    });

    markdownLinks.forEach((link) => {
      if (!isLocalMarkdownLink(link.target)) {
        return;
      }

      const resolvedTarget = path.resolve(path.dirname(absolutePath), link.target);
      const normalizedTarget = toRelativePath(resolvedTarget);

      if (!isInsideDirectory(resolvedTarget, rootDir)) {
        issues.push(`Markdown link escapes repository root: ${relativePath} -> ${link.target}`);
        return;
      }

      if (!fs.existsSync(resolvedTarget)) {
        issues.push(`Markdown link target is missing: ${relativePath} -> ${normalizedTarget}`);
      }
    });
  });

  for (const alias of redirectOwners.keys()) {
    if (slugOwners.has(alias)) {
      issues.push(`redirectFrom alias collides with an existing canonical slug: ${alias}`);
    }
  }
}

function validateSiteSupportPages() {
  if (!fs.existsSync(rssPagePath)) {
    issues.push(`RSS page is missing: ${appDir}/src/pages/rss.xml.ts`);
  } else {
    const rssSource = readText(rssPagePath);

    if (rssSource.includes('Site v2')) {
      issues.push('RSS metadata still uses the old Site v2 wording');
    }

    if (!rssSource.includes('description: post.data.description ?? post.data.summary ??')) {
      issues.push('RSS feed is not yet reusing summary as the fallback description field');
    }
  }

  if (!fs.existsSync(searchPagePath)) {
    issues.push(`Search page is missing: ${appDir}/src/pages/search.astro`);
  } else {
    const searchSource = readText(searchPagePath);

    if (searchSource.includes('site-v2 的全文搜索页')) {
      issues.push('Search page description still uses the old site-v2 wording');
    }

    if (!searchSource.includes("withBase('/pagefind/pagefind-ui.css')") || !searchSource.includes("withBase('/pagefind/pagefind-ui.js')")) {
      issues.push('Search page is missing the expected Pagefind asset wiring');
    }
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function resolvePath(relativePath) {
  return path.resolve(rootDir, relativePath);
}

function toRelativePath(absolutePath) {
  return path.relative(rootDir, absolutePath).replace(/\\/g, '/');
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

function extractFrontmatter(source, relativePath) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    issues.push(`Post is missing frontmatter block: ${relativePath}`);
    return null;
  }

  return match[1];
}

function readScalarField(frontmatter, fieldName) {
  const pattern = new RegExp(`^${escapeRegExp(fieldName)}:\\s+(.+)$`, 'm');
  const match = frontmatter.match(pattern);
  return match ? match[1].trim() : '';
}

function readListField(frontmatter, fieldName) {
  const lines = frontmatter.split(/\r?\n/);
  const values = [];
  let inField = false;

  for (const line of lines) {
    if (!inField) {
      if (line.trim() === `${fieldName}:`) {
        inField = true;
      }
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      values.push(line.replace(/^\s*-\s+/, '').trim());
      continue;
    }

    if (/^\s*$/.test(line)) {
      continue;
    }

    if (/^[A-Za-z0-9_-]+:\s*/.test(line)) {
      break;
    }

    break;
  }

  return values;
}

function recordUnique(ownerMap, value, message) {
  if (ownerMap.has(value)) {
    issues.push(message);
    return;
  }

  ownerMap.set(value, true);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractMarkdownLinks(source) {
  return Array.from(source.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g), ([, text, target]) => ({
    text,
    target: target.trim()
  }));
}

function isLocalMarkdownLink(target) {
  return !/^(https?:|mailto:|#|\/)/.test(target) && /\.md(#.*)?$/i.test(target);
}

function isInsideDirectory(targetPath, directoryPath) {
  const relativePath = path.relative(directoryPath, targetPath);
  return relativePath !== '' && !relativePath.startsWith('..') && !path.isAbsolute(relativePath);
}
