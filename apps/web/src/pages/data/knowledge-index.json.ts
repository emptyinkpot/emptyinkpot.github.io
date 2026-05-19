import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { musicItems } from '../../data/music';
import { getStaticBooksIndex } from '../../lib/books/staticManifest';
import { getExcerptFromBody } from '../../lib/content';
import { getGitHubOverview } from '../../lib/github';
import {
  bookToKnowledgeObject,
  githubRepoToKnowledgeObject,
  knowledgeObjectToSearchDoc,
  musicToKnowledgeObject,
  noteToKnowledgeObject,
  projectToKnowledgeObject,
  runtimeArticleToKnowledgeObject
} from '../../lib/knowledge/objects';
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
  const books = getStaticBooksIndex().books;

  const knowledgeObjects = [
    ...runtimeArticles.map((article) => runtimeArticleToKnowledgeObject(article, withBase)),
    ...notes.map((note) => noteToKnowledgeObject(note, getExcerptFromBody(note.body, 1000), withBase)),
    ...projects.map((project) => projectToKnowledgeObject(project, getExcerptFromBody(project.body, 1000), withBase)),
    ...books.map((book) => bookToKnowledgeObject(book, withBase)),
    ...musicItems.map((item) => musicToKnowledgeObject(item, withBase)),
    ...github.repos.slice(0, 24).map((repo) => githubRepoToKnowledgeObject(repo, { drawer: true }))
  ];
  const docs = knowledgeObjects.map(knowledgeObjectToSearchDoc);

  return new Response(JSON.stringify({ generatedAt: new Date().toISOString(), docs }, null, 2), {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=300'
    }
  });
};
