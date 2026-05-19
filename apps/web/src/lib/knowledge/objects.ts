import type { CollectionEntry } from 'astro:content';
import type { BookItem } from '../books/types';
import type { MusicItem } from '../../data/music';
import type { VisualItem } from '../../data/visuals';
import type { GitHubOverview } from '../github';
import type { RuntimeMarkdownObject } from '../runtimeContent';
import { stableRelationTargetId, type KnowledgeRelationSource } from './relations';
import type { KnowledgeGraphNode, KnowledgeNodeType, KnowledgeSearchDoc } from './types';

export type KnowledgeObjectCluster = NonNullable<KnowledgeGraphNode['cluster']>;

export type KnowledgeObject = {
  id: string;
  type: KnowledgeNodeType;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  href?: string;
  drawerId?: string;
  sourceId: string;
  updatedAt?: string;
  series?: string;
  body?: string;
  cluster: KnowledgeObjectCluster;
  weight: number;
  meta?: string;
  relationTargets?: KnowledgeRelationSource['relationTargets'];
};

export type KnowledgeObjectInput = {
  id: string;
  type: KnowledgeNodeType;
  title: string;
  summary?: string;
  content?: string;
  tags?: string[];
  href?: string;
  drawerId?: string;
  sourceId?: string;
  updatedAt?: string;
  series?: string;
  body?: string;
  cluster?: KnowledgeObjectCluster;
  weight?: number;
  meta?: string;
  relationTargets?: KnowledgeRelationSource['relationTargets'];
};

export function defineKnowledgeObject(input: KnowledgeObjectInput): KnowledgeObject {
  const summary = input.summary ?? '';
  const tags = input.tags ?? [];
  return {
    id: input.id,
    type: input.type,
    title: input.title,
    summary,
    content: input.content ?? [summary, ...tags].filter(Boolean).join('\n'),
    tags,
    href: input.href,
    drawerId: input.drawerId,
    sourceId: input.sourceId ?? input.id,
    updatedAt: input.updatedAt,
    series: input.series,
    body: input.body,
    cluster: input.cluster ?? clusterForType(input.type),
    weight: input.weight ?? weightForType(input.type),
    meta: input.meta,
    relationTargets: input.relationTargets
  };
}

export function runtimeArticleToKnowledgeObject(
  article: RuntimeMarkdownObject,
  resolveHref: (href: string) => string = (href) => href
): KnowledgeObject {
  const tags = [...article.categories, ...article.tags, ...(article.series ? [article.series] : [])].filter(Boolean);
  const href = resolveHref(`/posts/${article.slug}/`);
  return {
    id: `runtime:${article.id}`,
    type: 'post',
    title: article.title,
    summary: article.summary || article.description,
    content: [article.description, article.summary, article.card?.subtitle, ...tags].filter(Boolean).join('\n'),
    tags,
    href,
    drawerId: `runtime:${article.id}`,
    sourceId: article.id,
    updatedAt: article.updated || article.date,
    series: article.series,
    body: [article.body, article.description, article.summary, ...(article.relations?.wikilinks ?? [])].filter(Boolean).join('\n'),
    cluster: 'writing',
    weight: 4,
    meta: [...article.categories, ...article.tags].filter(Boolean).slice(0, 4).join(' / '),
    relationTargets: article.relations
  };
}

export function noteToKnowledgeObject(
  note: CollectionEntry<'notes'>,
  excerpt: string,
  resolveHref: (href: string) => string = (href) => href
): KnowledgeObject {
  return {
    id: `note:${note.id}`,
    type: 'note',
    title: note.data.title,
    summary: note.data.description ?? '',
    content: [note.data.description, excerpt].filter(Boolean).join('\n'),
    tags: ['note'],
    href: resolveHref(`/notes/${note.id}/`),
    drawerId: `note:${note.id}`,
    sourceId: note.id,
    updatedAt: note.data.date.toISOString(),
    body: note.body,
    cluster: 'writing',
    weight: 3,
    meta: 'note'
  };
}

export function projectToKnowledgeObject(
  project: CollectionEntry<'projects'>,
  excerpt: string,
  resolveHref: (href: string) => string = (href) => href
): KnowledgeObject {
  return {
    id: `project:${project.id}`,
    type: 'project',
    title: project.data.title,
    summary: project.data.description ?? '',
    content: [project.data.description, excerpt].filter(Boolean).join('\n'),
    tags: project.data.stack,
    href: resolveHref(`/projects/${project.id}/`),
    drawerId: `project:${project.id}`,
    sourceId: project.id,
    updatedAt: project.data.date?.toISOString(),
    body: project.body,
    cluster: 'engineering',
    weight: 4,
    meta: project.data.stack.slice(0, 4).join(' / ')
  };
}

export function bookToKnowledgeObject(book: BookItem, resolveHref: (href: string) => string = (href) => href): KnowledgeObject {
  const tags = [book.category, book.statusLabel, book.sourceType.toUpperCase(), ...book.tags].filter(Boolean);
  const drawerId = `book:${book.id}`;
  const href = `/books/openlist/?path=${encodeURIComponent(book.openlistPath || '')}`;

  return {
    id: drawerId,
    type: 'book',
    title: book.title,
    summary: book.description || book.note,
    content: [book.author, book.category, book.statusLabel, book.note, book.description, book.openlistPath].filter(Boolean).join('\n'),
    tags,
    href: resolveHref(href),
    drawerId,
    sourceId: book.id,
    updatedAt: book.modified,
    body: [book.author, book.note, book.description, book.openlistPath, ...tags].filter(Boolean).join('\n'),
    cluster: 'reading',
    weight: book.status === 'reading' ? 4 : 3,
    meta: [book.author, book.category, book.sourceType.toUpperCase()].filter(Boolean).join(' / '),
    relationTargets: book.openlistPath
      ? {
          assets: [book.openlistPath]
        }
      : undefined
  };
}

export function musicToKnowledgeObject(item: MusicItem, resolveHref: (href: string) => string = (href) => href): KnowledgeObject {
  return {
    id: `music:${item.id}`,
    type: 'music',
    title: item.title,
    summary: item.note,
    content: [item.artist, item.album, item.note].filter(Boolean).join('\n'),
    tags: item.mood,
    href: item.href ?? resolveHref('/music/'),
    drawerId: `music:${item.id}`,
    sourceId: item.id,
    body: item.note,
    cluster: 'media',
    weight: 2,
    meta: [item.artist, ...item.mood].join(' / ')
  };
}

export function visualToKnowledgeObject(item: VisualItem, resolveHref: (href: string) => string = (href) => href): KnowledgeObject {
  return {
    id: `visual:${item.id}`,
    type: 'visual',
    title: item.title,
    summary: item.summary,
    content: [item.summary, item.note, item.type, ...item.tags].filter(Boolean).join('\n'),
    tags: [item.type, ...item.tags],
    href: resolveHref(`/visuals/#${item.id}`),
    drawerId: `visual:${item.id}`,
    sourceId: item.id,
    body: item.note,
    cluster: 'visual',
    weight: 3,
    meta: [item.type, ...item.tags.slice(0, 3)].join(' / ')
  };
}

export function githubRepoToKnowledgeObject(
  repo: GitHubOverview['repos'][number],
  options: { drawer?: boolean } = {}
): KnowledgeObject {
  const language = repo.language || 'code';
  return {
    id: `github:${repo.name}`,
    type: 'github',
    title: repo.name,
    summary: `${language} repo updated ${repo.updatedAt.slice(0, 10)}.`,
    content: [repo.description, language, `${repo.stars} stars`, `${repo.issues} issues`].filter(Boolean).join('\n'),
    tags: [language, 'github'],
    href: repo.htmlUrl,
    drawerId: options.drawer ? `github-repo:${repo.name}` : undefined,
    sourceId: repo.name,
    updatedAt: repo.updatedAt,
    body: [repo.description, language].filter(Boolean).join('\n'),
    cluster: 'github',
    weight: Math.max(2, Math.min(5, Math.round(repo.size / 4000))),
    meta: `${language} / ${repo.stars} stars / ${repo.issues} issues`
  };
}

export function knowledgeObjectToSearchDoc(object: KnowledgeObject): KnowledgeSearchDoc {
  return {
    id: object.id,
    type: object.type,
    title: object.title,
    content: object.content,
    tags: object.tags,
    href: object.href,
    drawerId: object.drawerId,
    sourceId: object.sourceId,
    updatedAt: object.updatedAt
  };
}

export function knowledgeObjectToRelationSource(object: KnowledgeObject): KnowledgeRelationSource {
  return {
    id: object.id,
    kind: object.type,
    title: object.title,
    summary: object.summary,
    tags: object.tags,
    series: object.series,
    href: object.href,
    body: object.body || object.content,
    sourceId: object.sourceId,
    relationTargets: object.relationTargets
  };
}

export function knowledgeObjectToGraphNode(object: KnowledgeObject): KnowledgeGraphNode {
  return {
    id: object.id,
    label: object.title,
    type: object.type,
    level: 2,
    weight: object.weight,
    cluster: object.cluster,
    href: object.href,
    summary: object.summary,
    meta: object.meta
  };
}

export function getAssetReferenceNodes(objects: KnowledgeObject[], options: { limit?: number } = {}): KnowledgeGraphNode[] {
  const limit = options.limit ?? 24;
  const assetTargets = [
    ...new Set(objects.flatMap((object) => object.relationTargets?.assets ?? []))
  ].slice(0, limit);

  return assetTargets.map((target) => ({
    id: `asset:${stableRelationTargetId(target)}`,
    label: target.split('/').pop() || target,
    type: 'asset',
    level: 3,
    weight: 1,
    cluster: 'archive',
    summary: `Markdown asset reference: ${target}`,
    meta: 'asset reference'
  }));
}

function clusterForType(type: KnowledgeNodeType): KnowledgeObjectCluster {
  if (type === 'project') return 'engineering';
  if (type === 'book' || type === 'music') return 'media';
  if (type === 'visual') return 'visual';
  if (type === 'github') return 'github';
  if (type === 'highlight' || type === 'annotation' || type === 'seal' || type === 'sticker') return 'archive';
  return 'writing';
}

function weightForType(type: KnowledgeNodeType) {
  if (type === 'project' || type === 'post') return 4;
  if (type === 'note' || type === 'visual') return 3;
  return 2;
}
