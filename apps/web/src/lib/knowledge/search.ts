import type { KnowledgeSearchDoc } from './types';

export function searchKnowledgeDocs(docs: KnowledgeSearchDoc[], query: string, type = 'all') {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];

  return docs
    .filter((doc) => type === 'all' || doc.type === type)
    .map((doc) => {
      const haystack = [doc.title, doc.content, ...doc.tags].join(' ').toLowerCase();
      const titleHit = doc.title.toLowerCase().includes(normalized) ? 5 : 0;
      const contentHit = doc.content.toLowerCase().includes(normalized) ? 2 : 0;
      const tagHit = doc.tags.some((tag) => tag.toLowerCase().includes(normalized)) ? 3 : 0;
      return { doc, score: titleHit + contentHit + tagHit + (haystack.includes(normalized) ? 1 : 0) };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((item) => item.doc);
}
