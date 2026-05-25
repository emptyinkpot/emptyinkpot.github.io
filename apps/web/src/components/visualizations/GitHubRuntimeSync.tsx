import { useEffect } from 'react';

type GitHubDay = {
  date: string;
  level?: number;
  count: number;
};

type GitHubWeek = {
  label?: string;
  days?: GitHubDay[];
};

type GitHubLanguage = {
  label: string;
  percent: number;
  color: string;
};

type GitHubMonthlyPoint = {
  label: string;
  value: number;
};

type GitHubRepo = {
  name: string;
  description?: string;
  language?: string;
  stars?: number;
  issues?: number;
  updatedAt: string;
  htmlUrl: string;
};

type GitHubOverview = {
  profile?: {
    avatarUrl?: string;
    name?: string;
    login?: string;
    publicRepos?: number;
    followers?: number;
    following?: number;
  };
  weeks?: GitHubWeek[];
  languages?: GitHubLanguage[];
  monthly?: GitHubMonthlyPoint[];
  repos?: GitHubRepo[];
  totalContributions?: number;
};

type GitHubAnalytics = {
  totalContributions: number;
  activeDays: number;
  topLanguage?: GitHubLanguage;
  heatmapWeeks: Array<{ label?: string; days: Required<GitHubDay>[] }>;
  monthly: GitHubMonthlyPoint[];
  languages: GitHubLanguage[];
  repos: GitHubRepo[];
};

type GitHubPayload = {
  ok?: boolean;
  error?: string;
  fetchedAt?: string;
  overview?: GitHubOverview;
  analytics?: GitHubAnalytics;
};

const runtimeKey = '__emptyinkpotGitHubRuntimeSyncLoaded';

function formatDate(value?: string) {
  const date = new Date(value || '');
  if (Number.isNaN(date.getTime())) return '未知时间';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
}

function buildAnalytics(overview: GitHubOverview): GitHubAnalytics {
  const heatmapWeeks = (overview.weeks || []).map((week) => ({
    label: week.label,
    days: (week.days || []).map((day) => ({
      date: day.date,
      level: day.level || 0,
      count: day.count
    }))
  }));
  const languages = (overview.languages || []).map((language) => ({
    label: language.label,
    percent: language.percent,
    color: language.color
  }));

  return {
    totalContributions: overview.totalContributions || 0,
    activeDays: heatmapWeeks.flatMap((week) => week.days).filter((day) => day.count > 0).length,
    topLanguage: languages[0],
    heatmapWeeks,
    monthly: overview.monthly || [],
    languages,
    repos: overview.repos || []
  };
}

function getLineChartPoints(points: GitHubMonthlyPoint[], width = 320, height = 120) {
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

function getDonutGradient(languages: GitHubLanguage[]) {
  let cursor = 0;
  const stops = languages.map((language) => {
    const start = cursor;
    cursor += language.percent;
    return `${language.color} ${start}% ${cursor}%`;
  });
  return `conic-gradient(${stops.join(', ')})`;
}

function renderTagRow(container: Element | null, tags: string[]) {
  if (!container) return;
  container.replaceChildren(
    ...tags.filter(Boolean).map((tag) => {
      const item = document.createElement('span');
      item.textContent = tag;
      return item;
    })
  );
}

function formatRepoSummary(repo: GitHubRepo) {
  return `${repo.language || 'Unknown'} / ${repo.stars || 0} stars / ${repo.issues || 0} issues`;
}

function renderRepoDetails(container: Element | null, repo: GitHubRepo) {
  if (!container) return;
  const rows = [
    ['Stars', String(repo.stars || 0)],
    ['Issues', String(repo.issues || 0)],
    ['Updated', formatDate(repo.updatedAt)]
  ];
  container.replaceChildren(
    ...rows.map(([label, value]) => {
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = value;
      row.append(term, detail);
      return row;
    })
  );
}

function syncGithubRuntime() {
  if (Reflect.get(window, runtimeKey)) return;
  Reflect.set(window, runtimeKey, true);

  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-github-live-root]'));
  if (!roots.length) return;

  const apiReady = roots.some((root) => root.dataset.githubApiReady === 'true');
  const username = roots[0]?.dataset.githubUsername || 'emptyinkpot';
  const endpoint = `/api/github/overview?username=${encodeURIComponent(username)}`;

  const setStatus = (message: string, state = 'loading') => {
    document.querySelectorAll<HTMLElement>('[data-github-live-status]').forEach((node) => {
      node.textContent = message;
      node.dataset.githubLiveState = state;
    });
  };

  if (!apiReady) {
    setStatus('GitHub 快照', 'snapshot');
    return;
  }

  const updateProfile = (overview: GitHubOverview) => {
    const profile = overview.profile || {};
    document.querySelectorAll('[data-github-profile="avatar"]').forEach((node) => {
      if (node instanceof HTMLImageElement && profile.avatarUrl) {
        node.src = profile.avatarUrl;
        node.alt = profile.name || profile.login || 'GitHub profile';
      }
    });
    document.querySelectorAll('[data-github-profile="name"]').forEach((node) => {
      node.textContent = profile.name || profile.login || 'emptyinkpot';
    });
    document.querySelectorAll('[data-github-profile="login"]').forEach((node) => {
      node.textContent = profile.login ? `@${profile.login}` : '@emptyinkpot';
    });
  };

  const updateMetrics = (overview: GitHubOverview, analytics: GitHubAnalytics) => {
    const values = {
      totalContributions: analytics.totalContributions,
      activeDays: analytics.activeDays,
      publicRepos: overview.profile?.publicRepos,
      followers: overview.profile?.followers,
      following: overview.profile?.following
    };

    for (const [key, value] of Object.entries(values)) {
      document.querySelectorAll(`[data-github-metric="${key}"]`).forEach((node) => {
        if (value !== undefined && value !== null) node.textContent = String(value);
      });
    }
  };

  const updateRepoCards = (analytics: GitHubAnalytics) => {
    const liveRepos = analytics.repos || [];

    document.querySelectorAll<HTMLElement>('[data-github-repo-card]').forEach((card, index) => {
      const oldName = card.dataset.githubRepoCard;
      const repo = liveRepos[index] || liveRepos.find((item) => item.name === oldName);
      if (!repo) return;

      card.dataset.githubRepoCard = repo.name;
      card.dataset.drawerId = `github-repo:${repo.name}`;
      card.dataset.sealTarget = `github-repo:${repo.name}`;
      card.dataset.sealTitle = repo.name;
      card.dataset.hoverId = `github-repo:${repo.name}`;
      card.dataset.hoverTitle = repo.name;
      card.dataset.hoverSummary = repo.description || formatRepoSummary(repo);
      card.dataset.hoverMeta = `更新 ${formatDate(repo.updatedAt)}`;
      card.dataset.hoverTags = JSON.stringify([repo.language || 'Unknown']);

      const title = card.querySelector('.home-feed-card__body h2');
      const summary = card.querySelector('.home-feed-card__body p');
      const meta = card.querySelector('.home-feed-card__meta small');
      const tags = card.querySelector('.home-feed-card__tags');
      if (title) title.textContent = repo.name;
      if (summary) summary.textContent = formatRepoSummary(repo);
      if (meta) meta.textContent = `更新 ${formatDate(repo.updatedAt)}`;
      renderTagRow(tags, [repo.language || 'Unknown']);
    });
  };

  const updateRepoDrawerTemplates = (analytics: GitHubAnalytics) => {
    const liveRepos = analytics.repos || [];

    document.querySelectorAll<HTMLElement>('[data-github-repo-template]').forEach((template, index) => {
      const oldName = template.dataset.githubRepoTemplate;
      const repo = liveRepos[index] || liveRepos.find((item) => item.name === oldName);
      if (!repo) return;

      const drawerId = `github-repo:${repo.name}`;
      template.dataset.githubRepoTemplate = repo.name;
      template.dataset.drawerTemplate = drawerId;
      template.dataset.articleId = drawerId;
      template.dataset.fullHref = repo.htmlUrl;
      template.dataset.title = repo.name;

      const introTitle = template.querySelector('.home-article-intro h1');
      const introSummary = template.querySelector('.home-article-intro p');
      const details = template.querySelector('[data-github-repo-details]');
      const tags = template.querySelector('.home-drawer-summary__main .home-feed-card__tags');
      if (introTitle) introTitle.textContent = repo.name;
      if (introSummary) introSummary.textContent = repo.description || `${repo.language || 'Unknown'} repository`;
      renderRepoDetails(details, repo);
      renderTagRow(tags, [repo.language || 'Unknown']);

      if (oldName && window.CSS?.escape) {
        document.querySelectorAll<HTMLElement>(`[data-memory-drawer="github-repo:${CSS.escape(oldName)}"]`).forEach((node) => {
          node.dataset.memoryDrawer = drawerId;
        });
      }
    });
  };

  const renderHeatmap = (node: Element, analytics: GitHubAnalytics) => {
    const element = node as HTMLElement;
    const compact = element.dataset.githubCompact === 'true';
    const weeks = compact ? analytics.heatmapWeeks.slice(-12) : analytics.heatmapWeeks;
    const visibleDays = weeks.flatMap((week) => week.days);
    const visibleContributions = visibleDays.reduce((sum, day) => sum + day.count, 0);
    const visibleActiveDays = visibleDays.filter((day) => day.count > 0).length;
    const weekNodes = weeks.map((week) => {
      const weekNode = document.createElement('div');
      weekNode.className = 'github-heatmap__week';
      weekNode.title = week.label || '';
      week.days.forEach((day) => {
        const cell = document.createElement('span');
        cell.className = `github-heatmap__cell github-heatmap__cell--${day.level || 0}`;
        cell.title = `${day.date}: ${day.count}`;
        cell.setAttribute('aria-label', `${day.date}: ${day.count}`);
        weekNode.append(cell);
      });
      return weekNode;
    });
    node.replaceChildren(...weekNodes);
    const chartCard = node.closest('.chart-card');
    const metric = chartCard?.querySelector('.chart-card__header > strong');
    const summary = chartCard?.querySelector(':scope > p');
    if (metric && !compact) metric.textContent = `${analytics.totalContributions} total`;
    if (summary) {
      summary.textContent = compact
        ? `最近 12 周 ${visibleContributions} 次活动 / ${visibleActiveDays} 个活跃日，实时同步自 GitHub。`
        : `${analytics.totalContributions} 次年度活动 / ${analytics.activeDays} 个活跃日，实时同步自 GitHub。`;
    }
  };

  const renderLine = (node: Element, analytics: GitHubAnalytics) => {
    const element = node as HTMLElement;
    const compact = element.dataset.githubCompact === 'true';
    const width = 320;
    const height = compact ? 92 : 128;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'GitHub monthly contribution line chart');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M0 ${height} H${width}`);
    const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', getLineChartPoints(analytics.monthly, width, height));
    svg.append(path, polyline);

    const labels = document.createElement('div');
    labels.className = 'github-line-chart__labels';
    analytics.monthly.forEach((point) => {
      const label = document.createElement('span');
      const value = document.createElement('strong');
      const month = document.createElement('small');
      value.textContent = String(point.value);
      month.textContent = point.label;
      label.append(value, month);
      labels.append(label);
    });
    node.replaceChildren(svg, labels);
    const summary = node.closest('.chart-card')?.querySelector(':scope > p');
    if (summary) summary.textContent = '最近 12 个月贡献趋势，实时同步自 GitHub contribution calendar。';
  };

  const renderLanguages = (node: Element, analytics: GitHubAnalytics) => {
    const topLanguage = analytics.languages[0];
    const ring = document.createElement('div');
    ring.className = 'github-language-donut__ring';
    ring.style.setProperty('--donut-gradient', getDonutGradient(analytics.languages));
    const center = document.createElement('div');
    const percent = document.createElement('strong');
    const label = document.createElement('span');
    percent.textContent = `${topLanguage?.percent || 0}%`;
    label.textContent = topLanguage?.label || 'N/A';
    center.append(percent, label);
    ring.append(center);

    const legend = document.createElement('div');
    legend.className = 'github-language-donut__legend';
    analytics.languages.forEach((language) => {
      const item = document.createElement('span');
      const swatch = document.createElement('i');
      const name = document.createElement('strong');
      const value = document.createElement('small');
      swatch.style.background = language.color;
      name.textContent = language.label;
      value.textContent = `${language.percent}%`;
      item.append(swatch, name, value);
      legend.append(item);
    });
    node.replaceChildren(ring, legend);

    const metric = node.closest('.chart-card')?.querySelector('.chart-card__header > strong');
    if (metric && topLanguage) metric.textContent = topLanguage.label;
    const summary = node.closest('.chart-card')?.querySelector(':scope > p');
    if (summary && topLanguage) {
      summary.textContent = `${topLanguage.label} 当前占比 ${topLanguage.percent}%，语言分布实时聚合自公开仓库。`;
    }
  };

  const renderRepoMatrix = (node: Element, analytics: GitHubAnalytics) => {
    const element = node as HTMLElement;
    const compact = element.dataset.githubCompact === 'true';
    const repos = compact ? analytics.repos.slice(0, 6) : analytics.repos;
    const repoNodes = repos.map((repo) => {
      const anchor = document.createElement('a');
      anchor.className = 'github-repo-matrix__item';
      anchor.href = repo.htmlUrl;
      const title = document.createElement('strong');
      const meta = document.createElement('span');
      const updated = document.createElement('small');
      title.textContent = repo.name;
      meta.textContent = `${repo.language || 'Unknown'} / ${repo.stars || 0} stars / ${repo.issues || 0} issues`;
      updated.textContent = formatDate(repo.updatedAt);
      anchor.append(title, meta, updated);
      return anchor;
    });
    node.replaceChildren(...repoNodes);
  };

  const renderTeam = (node: Element, overview: GitHubOverview, analytics: GitHubAnalytics) => {
    const branches = node.querySelector('.team-signal-graph__branches');
    if (!branches) return;
    const repoNodes = analytics.repos.slice(0, 4).map((repo) => {
      const anchor = document.createElement('a');
      anchor.href = repo.htmlUrl;
      const title = document.createElement('strong');
      const meta = document.createElement('span');
      title.textContent = repo.name;
      meta.textContent = repo.language || 'repo';
      anchor.append(title, meta);
      return anchor;
    });
    const automation = document.createElement('a');
    automation.href = `https://github.com/${overview.profile?.login || username}/blog/actions`;
    const title = document.createElement('strong');
    const meta = document.createElement('span');
    title.textContent = 'Automation';
    meta.textContent = 'Actions / VPS';
    automation.append(title, meta);
    branches.replaceChildren(...repoNodes, automation);
  };

  const renderVisualizations = (overview: GitHubOverview, analytics: GitHubAnalytics) => {
    document.querySelectorAll('[data-github-viz="heatmap"]').forEach((node) => renderHeatmap(node, analytics));
    document.querySelectorAll('[data-github-viz="monthly-line"]').forEach((node) => renderLine(node, analytics));
    document.querySelectorAll('[data-github-viz="language-donut"]').forEach((node) => renderLanguages(node, analytics));
    document.querySelectorAll('[data-github-viz="repo-matrix"]').forEach((node) => renderRepoMatrix(node, analytics));
    document.querySelectorAll('[data-github-viz="team-signal"]').forEach((node) => renderTeam(node, overview, analytics));
  };

  const sync = async () => {
    setStatus('连接 GitHub 中...', 'loading');
    try {
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      });
      if (!response.ok) throw new Error(`GitHub API ${response.status}`);
      const payload = (await response.json()) as GitHubPayload;
      if (!payload.ok || !payload.overview) throw new Error(payload.error || 'GitHub API payload invalid');

      const overview = payload.overview;
      const analytics = payload.analytics || buildAnalytics(overview);
      updateProfile(overview);
      updateMetrics(overview, analytics);
      updateRepoCards(analytics);
      updateRepoDrawerTemplates(analytics);
      renderVisualizations(overview, analytics);
      setStatus(`实时同步 · ${formatDate(payload.fetchedAt)}`, 'live');
    } catch (error) {
      console.warn('[github-runtime-sync]', error);
      setStatus('GitHub 实时同步失败，保留快照', 'error');
    }
  };

  void sync();
}

export default function GitHubRuntimeSync() {
  useEffect(() => {
    syncGithubRuntime();
  }, []);

  return null;
}
