import type { CollectionEntry } from 'astro:content';
import type { GitHubOverview, GitHubRepoSnapshot } from './github';

export interface ProjectModuleView {
  id: string;
  name: string;
  status: string;
  progress: number;
}

export interface ProjectWikiView {
  title: string;
  path: string;
  type: string;
  summary: string;
  editUrl?: string;
}

export interface ProjectTimelineView {
  title: string;
  date?: Date;
  summary: string;
  href?: string;
}

export interface ProjectContributorView {
  login: string;
  name: string;
  avatarUrl: string;
  href: string;
}

export interface ProjectStudioView {
  entry: CollectionEntry<'projects'>;
  owner?: string;
  repoName?: string;
  repo?: GitHubRepoSnapshot;
  type: string;
  status: string;
  progress: number;
  modules: ProjectModuleView[];
  wiki: ProjectWikiView[];
  timeline: ProjectTimelineView[];
  contributors: ProjectContributorView[];
  githubEditBase?: string;
}

const TYPE_LABELS: Record<string, string> = {
  game: 'GAME',
  tool: 'TOOL',
  open: 'OPEN',
  site: 'SITE',
  archive: 'ARCHIVE'
};

export function getProjectTypeLabel(type: string) {
  return TYPE_LABELS[type] ?? type.toUpperCase();
}

function parseGitHubRepo(url?: string) {
  if (!url) return {};
  const match = url.match(/^https:\/\/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!match) return {};
  return { owner: match[1], repoName: match[2] };
}

function findRepoSnapshot(project: CollectionEntry<'projects'>, github: GitHubOverview) {
  const { repoName } = parseGitHubRepo(project.data.repo);
  if (!repoName) return undefined;
  return github.repos.find((repo) => repo.name.toLowerCase() === repoName.toLowerCase());
}

function buildDefaultModules(project: CollectionEntry<'projects'>): ProjectModuleView[] {
  return project.data.stack.slice(0, 4).map((name, index) => ({
    id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `module-${index + 1}`,
    name,
    status: index === 0 ? 'in-progress' : 'planned',
    progress: Math.max(10, project.data.progress - index * 12)
  }));
}

function buildWiki(project: CollectionEntry<'projects'>, owner?: string, repoName?: string): ProjectWikiView[] {
  const editBase = owner && repoName ? `https://github.com/${owner}/${repoName}/edit/main/` : undefined;
  const source = project.data.wiki.length
    ? project.data.wiki
    : [
        {
          title: 'Overview',
          path: 'README.md',
          type: 'overview' as const,
          summary: project.data.description
        }
      ];

  return source.map((item) => ({
    title: item.title,
    path: item.path,
    type: item.type,
    summary: item.summary ?? `${item.title} / ${item.path}`,
    editUrl: editBase ? `${editBase}${item.path}` : undefined
  }));
}

function buildTimeline(project: CollectionEntry<'projects'>, repo?: GitHubRepoSnapshot): ProjectTimelineView[] {
  const manual = project.data.milestones.map((item) => ({
    title: item.title,
    date: item.date,
    summary: item.summary ?? ''
  }));

  const repoItem = repo
    ? [
        {
          title: `${repo.name} repository updated`,
          date: new Date(repo.updatedAt),
          summary: `${repo.language || 'Unknown'} / ${repo.stars} stars / ${repo.issues} open issues`,
          href: repo.htmlUrl
        }
      ]
    : [];

  return [...repoItem, ...manual].sort((a, b) => {
    const left = a.date ? a.date.getTime() : 0;
    const right = b.date ? b.date.getTime() : 0;
    return right - left;
  });
}

export function buildProjectStudioView(project: CollectionEntry<'projects'>, github: GitHubOverview): ProjectStudioView {
  const { owner, repoName } = parseGitHubRepo(project.data.repo);
  const repo = findRepoSnapshot(project, github);
  const modules = project.data.modules.length
    ? project.data.modules.map((module, index) => ({
        id: module.id ?? `module-${index + 1}`,
        name: module.name,
        status: module.status,
        progress: module.progress
      }))
    : buildDefaultModules(project);

  return {
    entry: project,
    owner,
    repoName,
    repo,
    type: project.data.type,
    status: project.data.status,
    progress: project.data.progress,
    modules,
    wiki: buildWiki(project, owner, repoName),
    timeline: buildTimeline(project, repo),
    contributors: [
      {
        login: github.profile.login,
        name: github.profile.name,
        avatarUrl: github.profile.avatarUrl,
        href: `https://github.com/${github.profile.login}`
      }
    ],
    githubEditBase: owner && repoName ? `https://github.com/${owner}/${repoName}/edit/main/` : undefined
  };
}
