import fs from 'node:fs';
import path from 'node:path';

const targetPath = path.resolve('public-data/updates/index.md');
const marker = '<!-- UPDATE_LOG_ENTRIES -->';
const requiredSections = ['更新内容', '涉及技术', '关联记录', '验证记录', '实现效果', '下一步'];

if (!fs.existsSync(targetPath)) {
  fail(`Update log source not found: ${targetPath}`);
}

const source = fs.readFileSync(targetPath, 'utf8');
const markerIndex = source.indexOf(marker);

if (markerIndex === -1) {
  fail(`Missing marker in ${targetPath}: ${marker}`);
}

const entriesSource = source.slice(markerIndex + marker.length).trim();
const entries = entriesSource
  .split(/\n---\n/g)
  .map((entry) => entry.trim())
  .filter(Boolean);

if (!entries.length) {
  fail(`No update entries found in ${targetPath}`);
}

const issues = [];

entries.forEach((entry, index) => {
  const firstLine = entry.split('\n')[0]?.trim() ?? `Entry ${index + 1}`;

  if (!/^## \d{4}-\d{2}-\d{2} \/ .+/.test(firstLine)) {
    issues.push(`${firstLine}: missing valid entry heading`);
  }

  requiredSections.forEach((section) => {
    const blockMatch = entry.match(new RegExp(`### ${escapeRegExp(section)}\\n\\n([\\s\\S]*?)(?=\\n### |$)`));

    if (!blockMatch) {
      issues.push(`${firstLine}: missing section "${section}"`);
      return;
    }

    if (!/\n?- /.test(blockMatch[1])) {
      issues.push(`${firstLine}: section "${section}" does not contain a list item`);
    }
  });

  // Guard against reintroducing old subpath deployment wording without context.
  // If an entry mentions "/site-v2/", it must be explicitly marked as a historical/stage record.
  if (entry.includes('/site-v2/') && !/(历史|阶段)/.test(entry)) {
    issues.push(`${firstLine}: contains "/site-v2/" but is missing historical/stage context`);
  }
});

if (issues.length) {
  fail(['Update log validation failed:', ...issues.map((issue) => `- ${issue}`)].join('\n'));
}

console.log(`Validated ${entries.length} update entries in ${targetPath}`);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
