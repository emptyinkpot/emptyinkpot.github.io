import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { musicItems } from '../../data/music';
import { getExcerptFromBody } from '../../lib/content';
import { getGitHubOverview } from '../../lib/github';
import type { KnowledgeSearchDoc } from '../../lib/knowledge/types';
import { getRuntimeArticles } from '../../lib/runtimeContent';
import { withBase } from '../../lib/site';

export const GET: APIRoute = async () => {
  const runtimeArticles = getRuntimeArticles();
  const notes = [...(await getCollection('notes', ({ data }) => !data.draft))].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
  const projects = [...(await getCollection('projects'))].sort(
    (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0)
  );
  const github = await getGitHubOverview('emptyinkpot');

  const docs: KnowledgeSearchDoc[] = [
    ...runtimeArticles.map((article) => ({
      id: `runtime:${article.id}`,
      type: 'post' as const,
      title: article.title,
      content: [article.description, article.summary, article.card?.subtitle, ...article.categories, ...article.tags].filter(Boolean).join('\n'),
      tags: [...article.categories, ...article.tags],
      href: withBase(`/posts/${article.slug}/`),
      drawerId: `runtime:${article.id}`,
      sourceId: article.id,
      updatedAt: article.updated || article.date
    })),
    ...notes.map((note) => ({
      id: `note:${note.id}`,
      type: 'note' as const,
      title: note.data.title,
      content: [note.data.description, getExcerptFromBody(note.body, 1000)].filter(Boolean).join('\n'),
      tags: ['note'],
      href: withBase(`/notes/${note.id}/`),
      drawerId: `note:${note.id}`,
      sourceId: note.id,
      updatedAt: note.data.date.toISOString()
    })),
    ...projects.map((project) => ({
      id: `project:${project.id}`,
      type: 'project' as const,
      title: project.data.title,
      content: [project.data.description, getExcerptFromBody(project.body, 1000)].filter(Boolean).join('\n'),
      tags: project.data.stack,
      href: withBase(`/projects/${project.id}/`),
      drawerId: `project:${project.id}`,
      sourceId: project.id,
      updatedAt: project.data.date?.toISOString()
    })),
    ...musicItems.map((item) => ({
      id: `music:${item.id}`,
      type: 'music' as const,
      title: item.title,
      content: [item.artist, item.album, item.note].filter(Boolean).join('\n'),
      tags: item.mood,
      href: withBase('/music/'),
      drawerId: `music:${item.id}`,
      sourceId: item.id
    })),
    ...github.repos.slice(0, 24).map((repo) => ({
      id: `github:${repo.name}`,
      type: 'github' as const,
      title: repo.name,
      content: [repo.description, repo.language, `${repo.stars} stars`, `${repo.issues} issues`].filter(Boolean).join('\n'),
      tags: [repo.language, 'github'],
      href: repo.htmlUrl,
      drawerId: `github-repo:${repo.name}`,
      sourceId: repo.name,
      updatedAt: repo.updatedAt
    }))
  ];

  return new Response(JSON.stringify({ generatedAt: new Date().toISOString(), docs }, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300'
    }
  });
};
