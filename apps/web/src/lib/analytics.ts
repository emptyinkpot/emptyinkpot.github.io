import type { GitHubOverview, GitHubRepoSnapshot } from './github';

export type HeatmapCell = {
  date: string;
  level: 0 | 1 | 2 | 3 | 4;
  count: number;
};

export type HeatmapWeek = {
  label: string;
  days: HeatmapCell[];
};

export type MonthlyPoint = {
  label: string;
  value: number;
};

export type LanguageSlice = {
  label: string;
  percent: number;
  color: string;
};

export type RepoMatrixItem = Pick<GitHubRepoSnapshot, 'name' | 'language' | 'updatedAt' | 'stars' | 'issues' | 'htmlUrl'>;

export type GitHubAnalytics = {
  totalContributions: number;
  activeDays: number;
  topLanguage?: LanguageSlice;
  heatmapWeeks: HeatmapWeek[];
  monthly: MonthlyPoint[];
  languages: LanguageSlice[];
  repos: RepoMatrixItem[];
};

export function buildGitHubAnalytics(overview: GitHubOverview): GitHubAnalytics {
  const heatmapWeeks = overview.weeks.map((week) => ({
    label: week.label,
    days: week.days.map((day) => ({
      date: day.date,
      level: day.level,
      count: day.count
    }))
  }));

  const languages = overview.languages.map((language) => ({
    label: language.label,
    percent: language.percent,
    color: language.color
  }));

  return {
    totalContributions: overview.totalContributions,
    activeDays: heatmapWeeks.flatMap((week) => week.days).filter((day) => day.count > 0).length,
    topLanguage: languages[0],
    heatmapWeeks,
    monthly: overview.monthly.map((point) => ({ label: point.label, value: point.value })),
    languages,
    repos: overview.repos.map((repo) => ({
      name: repo.name,
      language: repo.language,
      updatedAt: repo.updatedAt,
      stars: repo.stars,
      issues: repo.issues,
      htmlUrl: repo.htmlUrl
    }))
  };
}

export function getRecentHeatmapWeeks(analytics: GitHubAnalytics, count = 12) {
  return analytics.heatmapWeeks.slice(Math.max(0, analytics.heatmapWeeks.length - count));
}

export function getLineChartPoints(points: MonthlyPoint[], width = 320, height = 120) {
  if (!points.length) return '';

  const max = Math.max(...points.map((point) => point.value), 1);
  const step = points.length > 1 ? width / (points.length - 1) : width;

  return points
    .map((point, index) => {
      const x = index * step;
      const y = height - (point.value / max) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

export function getDonutGradient(languages: LanguageSlice[]) {
  let cursor = 0;

  const stops = languages.map((language) => {
    const start = cursor;
    cursor += language.percent;
    return `${language.color} ${start}% ${cursor}%`;
  });

  return `conic-gradient(${stops.join(', ')})`;
}
