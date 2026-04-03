const GITHUB_API = 'https://api.github.com';

interface GitHubUserResponse {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  updated_at: string;
}

interface GitHubRepoResponse {
  name: string;
  language: string | null;
  updated_at: string;
  stargazers_count: number;
  open_issues_count: number;
  size: number;
  html_url: string;
  fork: boolean;
}

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

const LANGUAGE_COLORS: Record<string, string> = {
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

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'emptyinkpot-site-build',
      Accept: 'application/vnd.github+json'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'emptyinkpot-site-build',
      Accept: 'text/html'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText}`);
  }

  return await response.text();
}

function parseContributions(html: string) {
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
        level: Number(levelRaw) as 0 | 1 | 2 | 3 | 4,
        count: countMatch ? Number(countMatch[1]) : 0
      } satisfies GitHubContributionCell;
    })
    .sort((a, b) => a.date.localeCompare(b.date));

  const weeks: GitHubContributionWeek[] = [];
  const months: string[] = [];

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

  const monthlyMap = new Map<string, number>();
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

  return { totalContributions, months, weeks, monthly };
}

function buildLanguageShare(languagesByRepo: Record<string, number>[]) {
  const totals = new Map<string, number>();

  for (const repoLanguages of languagesByRepo) {
    for (const [language, bytes] of Object.entries(repoLanguages)) {
      totals.set(language, (totals.get(language) ?? 0) + bytes);
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
      color: LANGUAGE_COLORS[label] ?? '#660874'
    }));
}

export async function getGitHubOverview(username: string): Promise<GitHubOverview> {
  const profile = await fetchJson<GitHubUserResponse>(`${GITHUB_API}/users/${username}`);
  const reposResponse = await fetchJson<GitHubRepoResponse[]>(
    `${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`
  );
  const repos = reposResponse
    .filter((repo) => !repo.fork)
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at));

  const [contributionsHtml, languagesByRepo] = await Promise.all([
    fetchText(`https://github.com/users/${username}/contributions`),
    Promise.all(repos.map((repo) => fetchJson<Record<string, number>>(`${GITHUB_API}/repos/${username}/${repo.name}/languages`)))
  ]);

  const contributions = parseContributions(contributionsHtml);
  const languages = buildLanguageShare(languagesByRepo);

  return {
    profile: {
      login: profile.login,
      name: profile.name ?? profile.login,
      avatarUrl: profile.avatar_url,
      publicRepos: profile.public_repos ?? repos.length,
      followers: profile.followers ?? 0,
      following: profile.following ?? 0,
      updatedAt: profile.updated_at
    },
    totalContributions: contributions.totalContributions,
    months: contributions.months,
    weeks: contributions.weeks,
    monthly: contributions.monthly,
    languages,
    repos: repos.slice(0, 4).map((repo) => ({
      name: repo.name,
      language: repo.language ?? 'Unknown',
      updatedAt: repo.updated_at,
      stars: repo.stargazers_count ?? 0,
      issues: repo.open_issues_count ?? 0,
      size: repo.size ?? 0,
      htmlUrl: repo.html_url
    }))
  };
}
