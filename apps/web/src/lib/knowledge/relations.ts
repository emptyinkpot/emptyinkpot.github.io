export type KnowledgeRelationSource = {
  id: string;
  kind: string;
  title: string;
  summary?: string;
  tags?: string[];
  series?: string;
  href?: string;
  body?: string;
};

export type KnowledgeRelation = {
  source: string;
  target: string;
  type: 'related' | 'linked' | 'tagged';
  score: number;
  reasons: string[];
};

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
  options: { minScore?: number; limitPerSource?: number } = {}
) {
  const minScore = options.minScore ?? 4;
  const limitPerSource = options.limitPerSource ?? 8;

  return entries.flatMap((entry) =>
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
