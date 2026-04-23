import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDate, getCategoryCounts, getSeriesCounts, sortPosts, toSlug } from './content';
import { getGitHubOverview, type GitHubOverview } from './github';
import { withBase } from './site';

export interface HomeAction {
  label: string;
  href: string;
  variant?: 'primary' | 'secondary';
}

export interface HomeHeroData {
  kicker: string;
  title: string;
  summary: string;
  tags: string[];
  actions: HomeAction[];
}

export interface HomeSnapshotMetric {
  value: string;
  label: string;
}

export interface HomeSnapshotData {
  kicker: string;
  metrics: HomeSnapshotMetric[];
  lines: string[];
}

export interface HomeGitHubLanguageSlice {
  label: string;
  percent: number;
  color: string;
}

export interface HomeGitHubMonthlyPoint {
  label: string;
  value: number;
}

export interface HomeGitHubRepoCard {
  name: string;
  language: string;
  updatedAt: string;
  stars: number;
  issues: number;
  htmlUrl: string;
}

export interface HomeGitHubData {
  profile: {
    login: string;
    name: string;
    avatarUrl: string;
    publicRepos: number;
    followers: number;
    following: number;
    updatedAt: string;
    profileUrl: string;
  };
  totalContributions: number;
  languages: HomeGitHubLanguageSlice[];
  monthly: HomeGitHubMonthlyPoint[];
  repos: HomeGitHubRepoCard[];
}

export interface HomeTaxonomyItem {
  label: string;
  count: number;
  href: string;
}

export interface HomeFriendlySite {
  label: string;
  href: string;
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  monogram?: string;
  shape?: 'circle' | 'square';
}

export interface HomeQuickFilter {
  label: string;
  href: string;
}

export interface HomeTeamMember {
  name: string;
  role: string;
  imageSrc?: string;
  imageAlt?: string;
  monogram?: string;
}

export interface HomeTeamProject {
  name: string;
  summary: string;
  status: string;
  badges: string[];
  href?: string;
}

export interface HomeRepoSignal {
  name: string;
  summary: string;
  status: string;
  tone: 'primary' | 'gold' | 'violet' | 'green';
  href?: string;
}

export interface HomeAutomationSignal {
  label: string;
  state: 'running' | 'queued' | 'checking';
  detail: string;
  href?: string;
}

export interface HomeDirectorySignal {
  root: string;
  subtitle: string;
  items: string[];
  href?: string;
}

export interface HomeTeamSignal {
  id: string;
  label: string;
  subtitle: string;
  imageSrc?: string;
  imageAlt?: string;
  monogram?: string;
  imageShape?: 'circle' | 'square';
  members: HomeTeamMember[];
  projects: HomeTeamProject[];
  repos: HomeRepoSignal[];
  automation: HomeAutomationSignal[];
  toolkit: HomeDirectorySignal;
  archive: HomeDirectorySignal;
}

export interface HomeRouteCard {
  kicker: string;
  title: string;
  summary: string;
  href: string;
  variant?: 'light' | 'accent';
}

export interface HomePlannedCard {
  kicker: string;
  title: string;
  summary: string;
  href?: string;
}

export interface HomeMaintenanceItem {
  label: string;
  meta: string;
  href?: string;
}

export interface HomeCheckInCell {
  level: 0 | 1 | 2 | 3 | 4;
  count?: number;
  date?: string;
}

export interface HomeCheckInWeek {
  label: string;
  days: HomeCheckInCell[];
}

export interface HomeCheckInData {
  kicker: string;
  title: string;
  summary: string;
  statLine: string;
  legend: string;
  months: string[];
  weeks: HomeCheckInWeek[];
  total: number;
  avatar: {
    imageSrc: string;
    alt: string;
    caption: string;
  };
}

export interface HomePagePayload {
  hero: HomeHeroData;
  snapshot: HomeSnapshotData;
  featuredPost?: CollectionEntry<'posts'>;
  latestPosts: CollectionEntry<'posts'>[];
  topics: HomeTaxonomyItem[];
  series: HomeTaxonomyItem[];
  activeProject?: CollectionEntry<'projects'>;
  latestNotes: CollectionEntry<'notes'>[];
  checkIn: HomeCheckInData;
  github: HomeGitHubData;
  quickFilters: HomeQuickFilter[];
  friendlySites: HomeFriendlySite[];
  teams: HomeTeamSignal[];
  routeCards: HomeRouteCard[];
  plannedCards: HomePlannedCard[];
  maintenanceItems: HomeMaintenanceItem[];
}

export async function getHomePagePayload(): Promise<HomePagePayload> {
  const allPosts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));
  const notes = [...(await getCollection('notes', ({ data }) => !data.draft))].sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime()
  );
  const projects = await getCollection('projects');

  const featuredPost = allPosts.find((post) => post.data.featured) ?? allPosts[0];
  const latestPosts = allPosts.filter((post) => post.id !== featuredPost?.id).slice(0, 4);
  const latestNotes = notes.slice(0, 3);
  const activeProject = projects[0];
  const githubOverview = await getGitHubOverview('emptyinkpot');
  const topics = getCategoryCounts(allPosts)
    .slice(0, 3)
    .map(([label, count]) => ({
      label,
      count,
      href: withBase(`/categories/${toSlug(label)}/`)
    }));
  const series = getSeriesCounts(allPosts)
    .slice(0, 3)
    .map(([label, count]) => ({
      label,
      count,
      href: withBase(`/series/${toSlug(label)}/`)
    }));

  return {
    hero: {
      kicker: 'Astro / Content System / Productized Blog',
      title: '把写作、项目与长期记录收敛成一个唯一的入口',
      summary:
        '这里以 Astro 作为唯一对外入口，把文章、专题、项目与碎片记录统一到同一套内容模型、页面体系和发布链路里。',
      tags: ['Astro', 'Tailwind', 'MDX', 'Content Collections', 'GitHub Pages'],
      actions: [
        { label: '进入文章列表', href: withBase('/posts'), variant: 'primary' },
        { label: '查看项目线', href: withBase('/projects'), variant: 'secondary' }
      ]
    },
    snapshot: {
      kicker: '站点快照',
      metrics: [
        { value: String(githubOverview.totalContributions), label: '年度 GitHub 活动' },
        { value: String(githubOverview.profile.publicRepos), label: '公开仓库数量' }
      ],
      lines: [
        `最近一次文章时间：${featuredPost ? formatDate(featuredPost.data.date) : '暂无'}`,
        `GitHub 公开资料最近更新时间：${formatDate(new Date(githubOverview.profile.updatedAt))}`,
        '内容源、页面装配与发布链路已经收拢到同一站点。'
      ]
    },
    featuredPost,
    latestPosts,
    topics,
    series,
    activeProject,
    latestNotes,
    checkIn: buildCheckInData(githubOverview),
    github: buildGitHubData(githubOverview),
    quickFilters: [
      { label: '#文章', href: withBase('/posts') },
      { label: '#专题', href: withBase('/series') },
      { label: '#项目', href: withBase('/projects') },
      { label: '#更新', href: withBase('/updates') },
      { label: '#关于', href: withBase('/about') },
      { label: '#搜索', href: withBase('/search') },
      { label: '#友链', href: '#friendly-sites' }
    ],
    friendlySites: [
      {
        label: 'emptyinkpot',
        href: 'https://emptyinkpot.github.io/',
        description: '统一站点与公开内容入口',
        imageSrc: withBase('/images/branding/vita-atramenti-logo.png'),
        imageAlt: 'emptyinkpot logo',
        shape: 'square'
      },
      {
        label: 'GitHub 仓库',
        href: 'https://github.com/emptyinkpot/emptyinkpot.github.io',
        description: '站点源码与发布链路',
        imageSrc: withBase('/images/branding/vita-atramenti-logo.png'),
        imageAlt: 'repository logo',
        shape: 'square'
      },
      {
        label: 'GitHub 主页',
        href: 'https://github.com/emptyinkpot',
        description: '公开仓库与项目矩阵',
        imageSrc: githubOverview.profile.avatarUrl,
        imageAlt: githubOverview.profile.name,
        monogram: 'GH',
        shape: 'circle'
      },
      {
        label: 'Astro 文档',
        href: 'https://docs.astro.build/',
        description: '当前站点主框架参考',
        monogram: 'A',
        shape: 'square'
      },
      {
        label: 'giscus',
        href: 'https://giscus.app/zh-CN',
        description: '评论系统与讨论接入',
        monogram: 'G',
        shape: 'circle'
      },
      {
        label: '雨云论坛',
        href: 'https://forum.rainyun.com/t/topic/13009?u=azzzw',
        description: '云端部署与专题来源',
        monogram: '雨',
        shape: 'circle'
      }
    ],
    teams: buildTeamSignals(githubOverview),
    routeCards: [
      {
        kicker: '关于 / About',
        title: '站点主旨、作者说明与写作方法',
        summary: '站点说明 / 写作方法 / 身份介绍',
        href: withBase('/about')
      },
      {
        kicker: '搜索 / Search',
        title: '按主题、关键词与系列快速查找内容',
        summary: '关键词 / 标签 / 系列检索',
        href: withBase('/search')
      },
      {
        kicker: '更新 / Updates',
        title: '站点更新、部署状态与近期变动说明',
        summary: '部署日志 / 更新记录 / 运行状态',
        href: withBase('/updates'),
        variant: 'accent'
      },
      {
        kicker: '友链 / Friendly Sites',
        title: '关联网站与外部知识入口',
        summary: '外部入口 / 关联站点 / 参考链接',
        href: '#friendly-sites'
      },
      {
        kicker: '工具 / Tools',
        title: 'Pencil、构建链与内容维护工具入口',
        summary: '设计 / 部署 / 内容维护工具',
        href: withBase('/projects')
      }
    ],
    plannedCards: [
      {
        kicker: '规划 / Archive Map',
        title: '年度归档、专题索引与标签地图',
        summary: '年度归档 / 系列索引 / 标签地图',
        href: withBase('/posts')
      },
      {
        kicker: '规划 / Reading Path',
        title: '主题路径、推荐阅读链与新读者入口',
        summary: '主题导读 / 新读者入口 / 推荐阅读路径',
        href: withBase('/series')
      },
      {
        kicker: '规划 / Lab & Tools',
        title: '实验日志、工具清单与部署状态板',
        summary: '工具笔记 / 部署状态板 / 实验归档',
        href: withBase('/projects')
      }
    ],
    maintenanceItems: [
      { label: '重构记录', meta: '2026-03-31', href: withBase('/updates') },
      { label: '发布链路清理', meta: '已更新', href: withBase('/posts/myblog-cloud-deployment-nginx-domain-and-https-guide/') },
      { label: '首页设计迭代', meta: '样式刷新', href: withBase('/notes/rebuild-notes/') }
    ]
  };
}

function buildTeamSignals(githubOverview: GitHubOverview): HomeTeamSignal[] {
  const personalRepoSignals = githubOverview.repos.map((repo, index) => ({
    name: repo.name,
    summary: `${repo.language} / ${repo.stars} stars / ${repo.issues} issues`,
    status: `最近更新 / ${formatDate(new Date(repo.updatedAt))}`,
    tone: (['violet', 'primary', 'green', 'gold'][index] ?? 'primary') as HomeRepoSignal['tone'],
    href: repo.htmlUrl
  }));

  return [
    {
      id: 'personal',
      label: 'emptyinkpot',
      subtitle: '个人主线',
      imageSrc: githubOverview.profile.avatarUrl,
      imageAlt: githubOverview.profile.name,
      monogram: 'E',
      imageShape: 'circle',
      members: [
        {
          name: 'emptyinkpot',
          role: '写作、架构、发布主线',
          imageSrc: githubOverview.profile.avatarUrl,
          imageAlt: githubOverview.profile.name,
          monogram: 'E'
        },
        {
          name: 'Atramenti',
          role: '品牌署名 / 视觉识别',
          imageSrc: withBase('/images/branding/vita-atramenti-logo.png'),
          imageAlt: 'Atramenti logo',
          monogram: 'A'
        }
      ],
      projects: [
        {
          name: 'emptyinkpot / unified site',
          summary: '统一站点、内容模型、搜索与发布链路都收口到这里。',
          status: '进行中',
          badges: ['个人主线', '当前团队'],
          href: withBase('/projects/site-v2/')
        },
        {
          name: 'Vita Atramenti / brand system',
          summary: '个人品牌与视觉识别支线，可切到其他团队时替换为团队项目。',
          status: '排队中',
          badges: ['视觉系统'],
          href: withBase('/about')
        }
      ],
      repos: personalRepoSignals,
      automation: [
        { label: 'Pages', state: 'running', detail: '线上发布', href: 'https://blog.tengokukk.com/' },
        { label: 'Actions', state: 'running', detail: '构建 / 部署', href: 'https://github.com/emptyinkpot/emptyinkpot.github.io/actions' },
        { label: 'Dependabot', state: 'checking', detail: '依赖巡检', href: 'https://github.com/emptyinkpot/emptyinkpot.github.io/security/dependabot' },
        { label: 'Status', state: 'queued', detail: '待验证项', href: withBase('/updates') }
      ],
      toolkit: {
        root: 'root/',
        subtitle: 'Roo-Kit / 本地 AI 工具链目录结构',
        items: ['extensions', 'mcps', 'skills', 'ai-tracking'],
        href: withBase('/projects')
      },
      archive: {
        root: 'lex-universalis/',
        subtitle: 'Lex-Universalis / 资料与原型目录',
        items: ['docs', 'config', 'godot', 'archive / lore'],
        href: withBase('/notes')
      }
    },
    {
      id: 'heaven',
      label: '天堂工作室',
      subtitle: '站点团队',
      imageSrc: withBase('/images/branding/vita-atramenti-logo.png'),
      imageAlt: '天堂工作室',
      monogram: '天',
      imageShape: 'square',
      members: [
        {
          name: 'emptyinkpot',
          role: '主理 / 信息架构',
          imageSrc: githubOverview.profile.avatarUrl,
          imageAlt: githubOverview.profile.name,
          monogram: 'E'
        },
        {
          name: 'Atramenti',
          role: '视觉识别 / 品牌稿',
          imageSrc: withBase('/images/branding/vita-atramenti-logo.png'),
          imageAlt: 'Atramenti logo',
          monogram: 'A'
        },
        { name: 'GitHub Actions', role: '构建发布 / Pages 守卫', monogram: 'CI' }
      ],
      projects: [
        {
          name: 'emptyinkpot.github.io',
          summary: '围绕博客主站、专题页与信息入口持续迭代的团队主项目。',
          status: '运行中',
          badges: ['站点团队', '发布中']
        },
        {
          name: 'Documentation Backbone',
          summary: '围绕 docs、plans、maintenance 建立统一事实源与治理体系。',
          status: '进行中',
          badges: ['治理', '文档']
        }
      ],
      repos: [
        {
          name: 'emptyinkpot.github.io',
          summary: '内容主站 / Astro / Pages',
          status: '运行中 / 团队主站',
          tone: 'violet'
        },
        {
          name: 'README / docs',
          summary: '治理、计划、执行记录',
          status: '进行中 / 文档',
          tone: 'primary'
        },
        {
          name: '.github/workflows',
          summary: '发布与自动化链路',
          status: '运行中 / CI',
          tone: 'green'
        },
        {
          name: 'public-data / updates',
          summary: '更新日志与公开维护信号',
          status: '排队中 / 扩展',
          tone: 'gold'
        }
      ],
      automation: [
        { label: 'Pages', state: 'running', detail: '正式入口' },
        { label: 'Actions', state: 'running', detail: '部署链路' },
        { label: 'Dependabot', state: 'checking', detail: '依赖检查' },
        { label: '状态', state: 'running', detail: '团队站点稳定' }
      ],
      toolkit: {
        root: 'apps/web/',
        subtitle: '站点团队当前主要工作目录',
        items: ['src/components', 'src/content', 'public/images', 'dist / build']
      },
      archive: {
        root: 'docs/',
        subtitle: '站点治理与实施资料目录',
        items: ['plans', 'architecture', 'maintenance', 'governance']
      }
    },
    {
      id: 'temp',
      label: '某某工作室',
      subtitle: '临时团队',
      monogram: '某',
      imageShape: 'square',
      members: [
        { name: '临时负责人', role: '阶段任务负责人', monogram: 'TL' },
        { name: '外部设计支援', role: '视觉支援 / UI 调整', monogram: 'GD' }
      ],
      projects: [
        {
          name: 'Campaign / temporary collaboration',
          summary: '用于短周期专题、合作实验或阶段性上线任务的临时项目位。',
          status: '排队中',
          badges: ['临时团队', '可替换']
        },
        {
          name: 'Workshop / prototype branch',
          summary: '当需要快速试验一个方向时，用这个槽位挂载临时原型。',
          status: '检查中',
          badges: ['原型', '短周期']
        }
      ],
      repos: [
        {
          name: 'Prototype Slot A',
          summary: '短周期实验 / 合作仓位',
          status: '排队中 / 临时',
          tone: 'gold'
        },
        {
          name: 'Prototype Slot B',
          summary: '专题分支 / 阶段任务',
          status: '检查中 / 临时',
          tone: 'primary'
        },
        {
          name: 'Shared Assets',
          summary: '协作资源 / 视觉稿',
          status: '进行中 / 共享',
          tone: 'violet'
        },
        {
          name: 'Delivery Board',
          summary: '交付清单 / 节点跟踪',
          status: '运行中 / 跟踪',
          tone: 'green'
        }
      ],
      automation: [
        { label: 'Pages', state: 'queued', detail: '待挂载' },
        { label: 'Actions', state: 'checking', detail: '临时流程' },
        { label: 'Dependabot', state: 'checking', detail: '共享依赖' },
        { label: 'Status', state: 'queued', detail: '等待分配' }
      ],
      toolkit: {
        root: 'prototype/',
        subtitle: '临时协作的工作目录模板',
        items: ['brief', 'assets', 'prototype', 'handoff']
      },
      archive: {
        root: 'shared-archive/',
        subtitle: '临时团队可复用资料目录',
        items: ['notes', 'references', 'drafts', 'handover']
      }
    }
  ];
}

function buildCheckInData(githubOverview: GitHubOverview): HomeCheckInData {
  const activeDays = githubOverview.weeks.flatMap((week) => week.days).filter((day) => day.count > 0).length;

  return {
    kicker: 'GitHub 热力图',
    title: 'GitHub 活动热力图 / emptyinkpot',
    summary: '直接读取受控 GitHub 快照，把首页热力图、节奏线与语言分布统一到同一份可重复构建的数据上。',
    statLine: `${githubOverview.totalContributions} 次活动 / ${activeDays} 个活跃日`,
    legend: '少  ·  ·  ·  ·  多',
    months: githubOverview.months,
    weeks: githubOverview.weeks.map((week) => ({
      label: week.label,
      days: week.days.map((day) => ({
        level: day.level,
        count: day.count,
        date: day.date
      }))
    })),
    total: githubOverview.totalContributions,
    avatar: {
      imageSrc: githubOverview.profile.avatarUrl,
      alt: githubOverview.profile.name,
      caption: `@${githubOverview.profile.login} / 公开活动`
    }
  };
}

function buildGitHubData(githubOverview: GitHubOverview): HomeGitHubData {
  return {
    profile: {
      login: githubOverview.profile.login,
      name: githubOverview.profile.name,
      avatarUrl: githubOverview.profile.avatarUrl,
      publicRepos: githubOverview.profile.publicRepos,
      followers: githubOverview.profile.followers,
      following: githubOverview.profile.following,
      updatedAt: githubOverview.profile.updatedAt,
      profileUrl: `https://github.com/${githubOverview.profile.login}`
    },
    totalContributions: githubOverview.totalContributions,
    languages: githubOverview.languages.map((language) => ({
      label: language.label,
      percent: language.percent,
      color: language.color
    })),
    monthly: githubOverview.monthly.map((point) => ({
      label: point.label,
      value: point.value
    })),
    repos: githubOverview.repos.map((repo) => ({
      name: repo.name,
      language: repo.language,
      updatedAt: repo.updatedAt,
      stars: repo.stars,
      issues: repo.issues,
      htmlUrl: repo.htmlUrl
    }))
  };
}
