import fs from 'node:fs';
import path from 'node:path';

const UPDATE_LOG_PATH = path.resolve(process.cwd(), '../../public-data/updates/index.md');
const UPDATE_LOG_MARKER = '<!-- UPDATE_LOG_ENTRIES -->';

export interface UpdateLogSection {
  heading: string;
  items: string[];
}

export interface UpdateLogEntry {
  slug: string;
  date: string;
  title: string;
  sections: UpdateLogSection[];
}

function toSlug(input: string) {
  return input
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseSections(source: string) {
  const matches = [...source.matchAll(/^###\s+(.+)\n([\s\S]*?)(?=^###\s+|\Z)/gm)];

  return matches.map((match) => {
    const [, heading, content] = match;
    const items = content
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('- '))
      .map((line) => line.slice(2).trim())
      .filter(Boolean);

    return {
      heading: heading.trim(),
      items
    };
  });
}

export function getUpdateLogEntries() {
  if (!fs.existsSync(UPDATE_LOG_PATH)) {
    return [];
  }

  const source = fs.readFileSync(UPDATE_LOG_PATH, 'utf8');
  const sectionSource = source.split(UPDATE_LOG_MARKER)[1] ?? '';
  const rawEntries = sectionSource
    .split(/\n---\s*\n(?=##\s)/)
    .map((entry) => entry.trim())
    .filter(Boolean);

  return rawEntries
    .map((entry) => {
      const headingMatch = entry.match(/^##\s+(\d{4}-\d{2}-\d{2})\s*\/\s*(.+)$/m);

      if (!headingMatch) {
        return null;
      }

      const [, date, title] = headingMatch;
      const sections = parseSections(entry);

      return {
        slug: toSlug(`${date}-${title}`),
        date,
        title: title.trim(),
        sections
      } satisfies UpdateLogEntry;
    })
    .filter((entry): entry is UpdateLogEntry => Boolean(entry));
}
