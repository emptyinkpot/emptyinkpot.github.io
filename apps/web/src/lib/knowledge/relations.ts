export type KnowledgeRelationSource = {
  id: string;
  kind: string;
  title: string;
  summary?: string;
  tags?: string[];
  series?: string;
  href?: string;
  body?: string;
  sourceId?: string;
  relationTargets?: {
    wikilinks?: string[];
    backlinks?: string[];
    assets?: string[];
  };
};

export type KnowledgeRelation = {
  source: string;
  target: string;
  type: 'related' | 'linked' | 'tagged' | 'references';
  score: number;
  reasons: string[];
};

export function buildExplicitKnowledgeRelations(entries: KnowledgeRelationSource[]): KnowledgeRelation[] {
  const lookup = buildRelationTargetLookup(entries);
  const relations: KnowledgeRelation[] = [];

  for (const entry of entries) {
    for (const target of entry.relationTargets?.wikilinks ?? []) {
      const targetEntry = resolveRelationTarget(target, lookup);
      if (!targetEntry || targetEntry.id === entry.id) continue;
      relations.push({
        source: entry.id,
        target: targetEntry.id,
        type: 'linked',
        score: 16,
        reasons: [`wikilink: ${target}`]
      });
    }

    for (const target of entry.relationTargets?.backlinks ?? []) {
      const targetEntry = resolveRelationTarget(target, lookup);
      if (!targetEntry || targetEntry.id === entry.id) continue;
      relations.push({
        source: targetEntry.id,
        target: entry.id,
        type: 'linked',
        score: 16,
        reasons: [`backlink: ${target}`]
      });
    }

    for (const target of entry.relationTargets?.assets ?? []) {
      relations.push({
        source: entry.id,
        target: `asset:${stableRelationTargetId(target)}`,
        type: 'references',
        score: 4,
        reasons: [`asset: ${target}`]
      });
    }
  }

  return uniqueRelations(relations);
}

export function scoreKnowledgeRelation(a: KnowledgeRelationSource, b: KnowledgeRelationSource) {
  const reasons: string[] = [];
  let score = 0;

  const sharedTags = intersect(normalizeList(a.tags), normalizeList(b.tags));
  if (sharedTags.length) {
    score += sharedTags.length * 3;
    reasons.push(`shared tags: ${sharedTags.slice(0, 3).join(', ')}`);
  }

  if (a.series && b.series && a.series === b.series) {
    score += 8;
    reasons.push(`same series: ${a.series}`);
  }

  if (a.kind === b.kind) {
    score += 2;
    reasons.push(`same kind: ${a.kind}`);
  }

  if (hasMarkdownLink(a, b)) {
    score += 10;
    reasons.push('markdown link');
  }

  const keywordOverlap = intersect(extractKeywords(a), extractKeywords(b)).length;
  if (keywordOverlap) {
    score += keywordOverlap * 1.2;
    reasons.push(`keyword overlap: ${keywordOverlap}`);
  }

  return { score: Number(score.toFixed(2)), reasons };
}

export function buildKnowledgeRelations(
  entries: KnowledgeRelationSource[],
  options: { minScore?: number; limitPerSource?: number; includeExplicit?: boolean } = {}
) {
  const minScore = options.minScore ?? 4;
  const limitPerSource = options.limitPerSource ?? 8;

  const inferred = entries.flatMap((entry) =>
    getRelatedKnowledgeEntries(entry, entries, limitPerSource)
      .filter((item) => item.score >= minScore)
      .map(({ entry: related, score, reasons }) => ({
        source: entry.id,
        target: related.id,
        type: reasons.includes('markdown link') ? 'linked' : 'related',
        score,
        reasons
      }))
  );

  if (options.includeExplicit === false) return inferred;
  return uniqueRelations([...buildExplicitKnowledgeRelations(entries), ...inferred]);
}

export function getRelatedKnowledgeEntries<T extends KnowledgeRelationSource>(
  current: T,
  entries: T[],
  limit = 3,
  minScore = 4
) {
  return entries
    .filter((entry) => entry.id !== current.id)
    .map((entry) => {
      const result = scoreKnowledgeRelation(current, entry);
      return { entry, score: result.score, reasons: result.reasons };
    })
    .filter((item) => item.score >= minScore)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title, 'zh-CN'))
    .slice(0, limit);
}

function normalizeList(values: string[] = []) {
  return values.map((value) => value.trim().toLowerCase()).filter(Boolean);
}

function intersect(a: string[], b: string[]) {
  const bSet = new Set(b);
  return [...new Set(a)].filter((item) => bSet.has(item));
}

function hasMarkdownLink(a: KnowledgeRelationSource, b: KnowledgeRelationSource) {
  const body = a.body || '';
  if (!body) return false;
  return Boolean((b.href && body.includes(b.href)) || body.includes(`](${b.id})`) || body.includes(b.title));
}

function extractKeywords(entry: KnowledgeRelationSource) {
  const text = [entry.title, entry.summary, ...(entry.tags ?? [])].join(' ');
  const asciiTerms = text
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9-]{2,}/g) ?? [];
  const cjkTerms = text.match(/[\p{Script=Han}]{2,}/gu) ?? [];
  return [...new Set([...asciiTerms, ...cjkTerms])].filter((term) => !stopWords.has(term)).slice(0, 40);
}

const stopWords = new Set([
  'the',
  'and',
  'for',
  'with',
  'from',
  'this',
  'that',
  '一个',
  '这个',
  '不是',
  '如何',
  '记录'
]);

function buildRelationTargetLookup(entries: KnowledgeRelationSource[]) {
  const lookup = new Map<string, KnowledgeRelationSource>();

  for (const entry of entries) {
    [
      entry.id,
      entry.sourceId,
      entry.title,
      entry.href,
      entry.href?.split('/').filter(Boolean).at(-1)
    ]
      .filter(Boolean)
      .forEach((value) => {
        lookup.set(normalizeRelationKey(value), entry);
      });
  }

  return lookup;
}

function resolveRelationTarget(target: string, lookup: Map<string, KnowledgeRelationSource>) {
  const key = normalizeRelationKey(target);
  return lookup.get(key) ?? lookup.get(key.replace(/\.[a-z0-9]+$/i, ''));
}

function normalizeRelationKey(value: string) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\\/g, '/')
    .split('/')
    .pop()
    ?.replace(/\.[a-z0-9]+$/i, '')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-') ?? '';
}

export function stableRelationTargetId(value: string) {
  const normalized = normalizeRelationKey(value);
  if (normalized) return normalized;
  let hash = 0;
  for (const char of value) {
    hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  }
  return hash.toString(16);
}

function uniqueRelations(relations: KnowledgeRelation[]) {
  const seen = new Set<string>();
  return relations.filter((relation) => {
    const key = `${relation.source}->${relation.target}:${relation.type}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
