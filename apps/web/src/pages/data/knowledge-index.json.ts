import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { books } from '../../data/books';
import { musicItems } from '../../data/music';
import { getExcerptFromBody, getPrimaryCategory, sortPosts } from '../../lib/content';
import { getGitHubOverview } from '../../lib/github';
import { withBase } from '../../lib/site';
import type { KnowledgeSearchDoc } from '../../lib/knowledge/types';

export const GET: APIRoute = async () => {
  const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));
  const notes = [...(await getCollection('notes', ({ data }) => !data.draft))].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
  const projects = [...(await getCollection('projects'))].sort(
    (a, b) => (b.data.date?.getTime() ?? 0) - (a.data.date?.getTime() ?? 0)
  );
  const github = await getGitHubOverview('emptyinkpot');

  const docs: KnowledgeSearchDoc[] = [
    ...posts.map((post) => ({
      id: `post:${post.id}`,
      type: 'post' as const,
      title: post.data.title,
      content: [post.data.description, post.data.summary, getExcerptFromBody(post.body, 1200)].filter(Boolean).join('\n'),
      tags: [getPrimaryCategory(post), ...post.data.tags],
      href: withBase(`/posts/${post.id}/`),
      drawerId: `post:${post.id}`,
      sourceId: post.id,
      updatedAt: post.data.date.toISOString()
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
    ...books.map((book) => ({
      id: `book:${book.id}`,
      type: 'book' as const,
      title: book.title,
      content: [book.author, book.category, book.statusLabel, book.note, book.description, book.openlistPath].filter(Boolean).join('\n'),
      tags: [book.category, book.statusLabel, book.sourceType.toUpperCase(), ...book.tags],
      href: withBase(`/books/${book.id}/`),
      drawerId: `book:${book.id}`,
      sourceId: book.id
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
