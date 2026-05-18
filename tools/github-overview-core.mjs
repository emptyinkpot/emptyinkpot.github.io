import { execFileSync } from 'node:child_process';

const GITHUB_API = 'https://api.github.com';
export const GITHUB_SNAPSHOT_SCHEMA_VERSION = 1;
export const GITHUB_SNAPSHOT_SOURCE = 'github-graphql-plus-public-contributions';

const LANGUAGE_COLORS = {
  Astro: '#FF5D01',
  TypeScript: '#3178C6',
  JavaScript: '#F1E05A',
  CSS: '#563D7C',
  GDScript: '#355570',
  HTML: '#E34C26',
  Shell: '#89E051',
  MDX: '#1B1F24',
  Markdown: '#083FA1'
};

function getGitHubToken() {
  const envToken = process.env.GITHUB_TOKEN ?? process.env.GH_TOKEN ?? '';
  if (envToken.trim()) {
    return envToken.trim();
  }

  try {
    const token = execFileSync('gh', ['auth', 'token'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore']
    }).trim();
    return token || '';
  } catch {
    return '';
  }
}

function buildApiHeaders() {
  const token = getGitHubToken();
  if (!token) {
    throw new Error('刷新 GitHub 首页快照需要可用的 GitHub token。请先设置 GITHUB_TOKEN/GH_TOKEN，或确保 `gh auth status` 已登录。');
  }

  return {
    'User-Agent': 'emptyinkpot-site-build',
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, init, label) {
  let lastError = null;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      return await fetch(url, init);
    } catch (error) {
      lastError = error;
      if (attempt === 3) {
        break;
      }
      await sleep(attempt * 500);
    }
  }

  throw new Error(`${label} failed after 3 attempts: ${lastError instanceof Error ? lastError.message : String(lastError)}`);
}

async function fetchGraphQL(query, variables) {
  const response = await fetchWithRetry(
    `${GITHUB_API}/graphql`,
    {
      method: 'POST',
      headers: {
        ...buildApiHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables })
    },
    'GitHub GraphQL request'
  );

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  if (Array.isArray(payload.errors) && payload.errors.length > 0) {
    throw new Error(`GitHub GraphQL error: ${payload.errors.map((item) => item.message).join('; ')}`);
  }

  return payload.data;
}

function fetchPublicContributionsHtml(username) {
  const url = `https://github.com/users/${username}/contributions`;
  const commands = process.platform === 'win32' ? ['curl.exe', 'curl'] : ['curl'];

  for (const command of commands) {
    try {
      return execFileSync(command, ['-fsSL', url], {
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
        windowsHide: true
      });
    } catch {
      // Try the next available curl binary.
    }
  }

  throw new Error(`Failed to fetch public contributions HTML for ${username}.`);
}

function parseContributionsFromHtml(html) {
  const totalMatch = html.match(/>\s*([\d,]+)\s+contributions\s+in the last year\s*</i);
  const totalContributions = totalMatch ? Number(totalMatch[1].replace(/,/g, '')) : 0;

  const dayMatches = [
    ...html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})"[^>]*data-level="([0-4])"[\s\S]*?<tool-tip[^>]*>([^<]+)<\/tool-tip>/g)
  ];

  const days = dayMatches
    .map((match) => {
      const [, date, levelRaw, tooltip] = match;
      const countMatch = tooltip.match(/(\d+)\s+contributions?/i);
      return {
        date,
        level: Number(levelRaw),
        count: countMatch ? Number(countMatch[1]) : 0
      };
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  if (days.length === 0) {
    throw new Error('Public contributions HTML did not contain any day cells.');
  }

  const months = [];
  const weeks = [];

  for (let index = 0; index < days.length; index += 7) {
    const slice = days.slice(index, index + 7);
    const firstDate = new Date(`${slice[0]?.date}T00:00:00Z`);
    const monthLabel = firstDate.toLocaleString('en-US', { month: 'short' });
    const previousMonth = weeks.length
      ? new Date(`${weeks[weeks.length - 1].days[0].date}T00:00:00Z`).toLocaleString('en-US', { month: 'short' })
      : '';

    months.push(monthLabel !== previousMonth ? monthLabel : '');
    weeks.push({
      label: monthLabel,
      days: slice
    });
  }

  const monthlyMap = new Map();
  for (const day of days) {
    const key = day.date.slice(0, 7);
    monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + day.count);
  }

  const monthly = [...monthlyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([key, value]) => ({
      label: new Date(`${key}-01T00:00:00Z`).toLocaleString('en-US', { month: 'short' }),
      value
    }));

  return {
    totalContributions,
    months,
    weeks,
    monthly
  };
}

function buildLanguageShare(repos) {
  const totals = new Map();
  const colors = new Map();

  for (const repo of repos) {
    for (const edge of repo.languages.edges) {
      const language = edge.node.name;
      const bytes = edge.size;
      totals.set(language, (totals.get(language) ?? 0) + bytes);
      if (edge.node.color && !colors.has(language)) {
        colors.set(language, edge.node.color);
      }
    }
  }

  const totalBytes = [...totals.values()].reduce((sum, value) => sum + value, 0) || 1;

  return [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label, bytes]) => ({
      label,
      bytes,
      percent: Number(((bytes / totalBytes) * 100).toFixed(1)),
      color: colors.get(label) ?? LANGUAGE_COLORS[label] ?? '#660874'
    }));
}

export async function fetchLiveGitHubOverview(username) {
  const query = `
    query GitHubOverview($login: String!) {
      user(login: $login) {
        login
        name
        avatarUrl
        updatedAt
        followers {
          totalCount
        }
        following {
          totalCount
        }
        repositories(
          first: 100
          privacy: PUBLIC
          ownerAffiliations: OWNER
          isFork: false
          orderBy: { field: UPDATED_AT, direction: DESC }
        ) {
          totalCount
          nodes {
            name
            updatedAt
            stargazerCount
            diskUsage
            url
            primaryLanguage {
              name
            }
            issues(states: OPEN) {
              totalCount
            }
            languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
              edges {
                size
                node {
                  name
                  color
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, { login: username });
  const user = data?.user;
  if (!user) {
    throw new Error(`GitHub user ${username} was not returned by GraphQL.`);
  }

  const repos = user.repositories.nodes ?? [];
  const contributionsHtml = fetchPublicContributionsHtml(username);
  const contributions = parseContributionsFromHtml(contributionsHtml);
  const languages = buildLanguageShare(repos);

  return {
    profile: {
      login: user.login,
      name: user.name ?? user.login,
      avatarUrl: user.avatarUrl,
      publicRepos: user.repositories.totalCount ?? repos.length,
      followers: user.followers?.totalCount ?? 0,
      following: user.following?.totalCount ?? 0,
      updatedAt: user.updatedAt
    },
    totalContributions: contributions.totalContributions,
    months: contributions.months,
    weeks: contributions.weeks,
    monthly: contributions.monthly,
    languages,
    repos: repos.slice(0, 4).map((repo) => ({
      name: repo.name,
      language: repo.primaryLanguage?.name ?? 'Unknown',
      updatedAt: repo.updatedAt,
      stars: repo.stargazerCount ?? 0,
      issues: repo.issues?.totalCount ?? 0,
      size: repo.diskUsage ?? 0,
      htmlUrl: repo.url
    }))
  };
}

function isRecord(value) {
  return typeof value === 'object' && value !== null;
}

export function validateGitHubOverviewSnapshot(value, expectedUsername) {
  if (!isRecord(value)) {
    throw new Error('GitHub snapshot must be an object.');
  }

  if (value.schemaVersion !== GITHUB_SNAPSHOT_SCHEMA_VERSION) {
    throw new Error(`Unsupported GitHub snapshot schema version: ${String(value.schemaVersion)}`);
  }

  if (value.username !== expectedUsername) {
    throw new Error(`GitHub snapshot username mismatch: expected ${expectedUsername}, got ${String(value.username)}`);
  }

  if (typeof value.fetchedAt !== 'string' || !value.fetchedAt) {
    throw new Error('GitHub snapshot missing fetchedAt.');
  }

  if (value.source !== GITHUB_SNAPSHOT_SOURCE) {
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

  return value;
}

export function createGitHubOverviewSnapshot(username, overview) {
  return {
    schemaVersion: GITHUB_SNAPSHOT_SCHEMA_VERSION,
    username,
    fetchedAt: new Date().toISOString(),
    source: GITHUB_SNAPSHOT_SOURCE,
    overview
  };
}
