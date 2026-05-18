import emptyinkpotSnapshot from '../data/github-overview.emptyinkpot.json';

export interface GitHubLanguageSlice {
  label: string;
  bytes: number;
  percent: number;
  color: string;
}

export interface GitHubContributionCell {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
}

export interface GitHubContributionWeek {
  label: string;
  days: GitHubContributionCell[];
}

export interface GitHubMonthlyContribution {
  label: string;
  value: number;
}

export interface GitHubRepoSnapshot {
  name: string;
  language: string;
  updatedAt: string;
  stars: number;
  issues: number;
  size: number;
  htmlUrl: string;
}

export interface GitHubOverview {
  profile: {
    login: string;
    name: string;
    avatarUrl: string;
    publicRepos: number;
    followers: number;
    following: number;
    updatedAt: string;
  };
  totalContributions: number;
  months: string[];
  weeks: GitHubContributionWeek[];
  monthly: GitHubMonthlyContribution[];
  languages: GitHubLanguageSlice[];
  repos: GitHubRepoSnapshot[];
}

interface GitHubOverviewSnapshot {
  schemaVersion: 1;
  username: string;
  fetchedAt: string;
  source: 'github-graphql-plus-public-contributions';
  overview: GitHubOverview;
}

const SNAPSHOT_FILES: Record<string, GitHubOverviewSnapshot> = {
  emptyinkpot: emptyinkpotSnapshot as GitHubOverviewSnapshot
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function assertGitHubOverviewSnapshot(value: unknown, username: string): asserts value is GitHubOverviewSnapshot {
  if (!isRecord(value)) {
    throw new Error('GitHub snapshot must be an object.');
  }

  if (value.schemaVersion !== 1) {
    throw new Error(`Unsupported GitHub snapshot schema version: ${String(value.schemaVersion)}`);
  }

  if (value.username !== username) {
    throw new Error(`GitHub snapshot username mismatch: expected ${username}, got ${String(value.username)}`);
  }

  if (typeof value.fetchedAt !== 'string' || !value.fetchedAt) {
    throw new Error('GitHub snapshot missing fetchedAt.');
  }

  if (value.source !== 'github-graphql-plus-public-contributions') {
    throw new Error(`Unexpected GitHub snapshot source: ${String(value.source)}`);
  }

  if (!isRecord(value.overview)) {
    throw new Error('GitHub snapshot missing overview payload.');
  }

  const { overview } = value;

  if (!isRecord(overview.profile) || typeof overview.profile.login !== 'string') {
    throw new Error('GitHub snapshot profile is invalid.');
  }

  if (!Array.isArray(overview.weeks) || overview.weeks.length === 0) {
    throw new Error('GitHub snapshot weeks payload is empty.');
  }

  if (!Array.isArray(overview.languages) || overview.languages.length === 0) {
    throw new Error('GitHub snapshot languages payload is empty.');
  }

  if (!Array.isArray(overview.monthly) || overview.monthly.length === 0) {
    throw new Error('GitHub snapshot monthly payload is empty.');
  }

  if (!Array.isArray(overview.repos) || overview.repos.length === 0) {
    throw new Error('GitHub snapshot repos payload is empty.');
  }
}

export async function getGitHubOverview(username: string): Promise<GitHubOverview> {
  const snapshot = SNAPSHOT_FILES[username];
  if (!snapshot) {
    throw new Error(`No GitHub snapshot file is configured for ${username}.`);
  }

  assertGitHubOverviewSnapshot(snapshot, username);
  return snapshot.overview;
}
