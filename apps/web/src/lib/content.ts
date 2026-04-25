import type { CollectionEntry } from 'astro:content';

export function sortPosts(posts: CollectionEntry<'posts'>[]) {
  return [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getPrimaryCategory(post: CollectionEntry<'posts'>) {
  return post.data.categories[0] ?? '未分类';
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

export function getReadingTime(text: string) {
  const clean = stripMarkdown(text);
  return Math.max(1, Math.round(clean.length / 320));
}

export function getExcerptFromBody(text: string, maxLength = 140) {
  const clean = stripMarkdown(text).replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) {
    return clean;
  }

  return `${clean.slice(0, maxLength).trim()}...`;
}

export function getRelatedPosts(
  current: CollectionEntry<'posts'>,
  posts: CollectionEntry<'posts'>[],
  limit = 3
) {
  const currentTerms = new Set([
    ...current.data.tags,
    ...current.data.categories,
    ...(current.data.series ? [current.data.series] : [])
  ]);

  const related = posts
    .filter((post) => post.id !== current.id)
    .map((post) => ({
      post,
      score: [...post.data.tags, ...post.data.categories, ...(post.data.series ? [post.data.series] : [])].filter(
        (term) => currentTerms.has(term)
      ).length
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.getTime() - a.post.data.date.getTime())
    .slice(0, limit)
    .map(({ post }) => post);

  if (related.length >= limit) {
    return related;
  }

  const seen = new Set(related.map((post) => post.id));
  const fallback = posts.filter((post) => post.id !== current.id && !seen.has(post.id)).slice(0, limit - related.length);

  return [...related, ...fallback];
}

export function toSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s/]+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getGroupedCounts(items: string[]) {
  const counts = new Map<string, number>();

  for (const item of items) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }

  return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}

export function getCategoryCounts(posts: CollectionEntry<'posts'>[]) {
  return getGroupedCounts(posts.flatMap((post) => post.data.categories));
}

export function getTagCounts(posts: CollectionEntry<'posts'>[]) {
  const slugged = new Map<string, { count: number; labels: Map<string, number> }>();

  for (const tag of posts.flatMap((post) => post.data.tags)) {
    const slug = toSlug(tag);
    const current = slugged.get(slug) ?? { count: 0, labels: new Map<string, number>() };
    current.count += 1;
    current.labels.set(tag, (current.labels.get(tag) ?? 0) + 1);
    slugged.set(slug, current);
  }

  return [...slugged.values()]
    .map(({ count, labels }) => {
      const label = [...labels.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))[0]?.[0] ?? '';
      return [label, count] as const;
    })
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'));
}

export function getSeriesCounts(posts: CollectionEntry<'posts'>[]) {
  return getGroupedCounts(posts.map((post) => post.data.series).filter(Boolean) as string[]);
}

function stripMarkdown(text: string) {
  return text
    .replace(/^---[\s\S]*?---/, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#+\s+/gm, '')
    .replace(/[*_~>-]/g, ' ')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
