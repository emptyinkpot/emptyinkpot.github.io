import { getCollection, type CollectionEntry } from 'astro:content';
import { formatDate, getCategoryCounts, getSeriesCounts, sortPosts, toSlug } from './content';
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

export interface HomeTaxonomyItem {
  label: string;
  count: number;
  href: string;
}

export interface HomeFriendlySite {
  label: string;
  href: string;
  description: string;
}

export interface HomeQuickFilter {
  label: string;
  href: string;
}

export interface HomeTeamMember {
  name: string;
  role: string;
}

export interface HomeTeamProject {
  name: string;
  summary: string;
  status: string;
  badges: string[];
}

export interface HomeRepoSignal {
  name: string;
  summary: string;
  status: string;
  tone: 'primary' | 'gold' | 'violet' | 'green';
}

export interface HomeAutomationSignal {
  label: string;
  state: 'running' | 'queued' | 'checking';
  detail: string;
}

export interface HomeDirectorySignal {
  root: string;
  subtitle: string;
  items: string[];
}

export interface HomeTeamSignal {
  id: string;
  label: string;
  subtitle: string;
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
}

export interface HomeMaintenanceItem {
  label: string;
  meta: string;
}

export interface HomeCheckInCell {
  level: 0 | 1 | 2 | 3 | 4;
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
      kicker: 'Site Snapshot',
      metrics: [
        { value: String(allPosts.length), label: 'Published posts' },
        { value: String(topics.length), label: 'Active categories' }
      ],
      lines: [
        `最近一次文章时间：${featuredPost ? formatDate(featuredPost.data.date) : '暂无'}`,
        '内容源、页面装配与发布链路已经收拢到同一站点。',
        '搜索、评论与持续录入能力后续会继续在这套唯一站点内迭代。'
      ]
    },
    featuredPost,
    latestPosts,
    topics,
    series,
    activeProject,
    latestNotes,
    checkIn: buildCheckInData({ posts: allPosts, notes, projects }),
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
        description: '统一站点与公开内容入口'
      },
      {
        label: 'GitHub Repo',
        href: 'https://github.com/emptyinkpot/emptyinkpot.github.io',
        description: '站点源码与发布链路'
      },
      {
        label: 'GitHub Profile',
        href: 'https://github.com/emptyinkpot',
        description: '公开仓库与项目矩阵'
      },
      {
        label: 'Astro Docs',
        href: 'https://docs.astro.build/',
        description: '当前站点主框架参考'
      },
      {
        label: 'giscus',
        href: 'https://giscus.app/zh-CN',
        description: '评论系统与讨论接入'
      },
      {
        label: '雨云论坛',
        href: 'https://forum.rainyun.com/t/topic/13009?u=azzzw',
        description: '云端部署与专题来源'
      }
    ],
    teams: buildTeamSignals(),
    routeCards: [
      {
        kicker: 'ABOUT',
        title: '站点主旨、作者说明与写作方法',
        summary: 'identity / editorial note / approach',
        href: withBase('/about')
      },
      {
        kicker: 'SEARCH',
        title: '按主题、关键词与系列快速查找内容',
        summary: 'keyword / tag / series lookup',
        href: withBase('/search')
      },
      {
        kicker: 'UPDATES',
        title: '站点更新、部署状态与近期变动说明',
        summary: 'deploy log / changelog / state',
        href: withBase('/updates'),
        variant: 'accent'
      },
      {
        kicker: 'FRIENDLY SITES',
        title: '关联网站与外部知识入口',
        summary: 'external references / partner links',
        href: '#friendly-sites'
      },
      {
        kicker: 'TOOLS',
        title: 'Pencil、构建链与内容维护工具入口',
        summary: 'design / deploy / content ops',
        href: withBase('/projects')
      }
    ],
    plannedCards: [
      {
        kicker: 'PLANNED / ARCHIVE MAP',
        title: '年度归档、专题索引与标签地图',
        summary: 'year view / series index / tag routes'
      },
      {
        kicker: 'PLANNED / READING PATH',
        title: '主题路径、推荐阅读链与新读者入口',
        summary: 'topic onboarding / guided reading / entry funnels'
      },
      {
        kicker: 'PLANNED / LAB & TOOLS',
        title: '实验日志、工具清单与部署状态板',
        summary: 'tool notes / deployment board / lab archive'
      }
    ],
    maintenanceItems: [
      { label: 'rebuild notes', meta: '2026-03-31' },
      { label: 'publish flow cleanup', meta: 'updated' },
      { label: 'homepage pen iteration', meta: 'design refresh' }
    ]
  };
}

function buildTeamSignals(): HomeTeamSignal[] {
  return [
    {
      id: 'personal',
      label: 'emptyinkpot',
      subtitle: '个人主线',
      members: [
        { name: 'emptyinkpot', role: '写作、架构、发布主线' },
        { name: 'Atramenti', role: '品牌署名 / 视觉识别' }
      ],
      projects: [
        {
          name: 'emptyinkpot / unified site',
          summary: '统一站点、内容模型、搜索与发布链路都收口到这里。',
          status: 'ACTIVE',
          badges: ['个人主线', '当前团队']
        },
        {
          name: 'Vita Atramenti / brand system',
          summary: '个人品牌与视觉识别支线，可切到其他团队时替换为团队项目。',
          status: 'QUEUE',
          badges: ['视觉系统']
        }
      ],
      repos: [
        {
          name: 'Atramenti-Console',
          summary: '控制台实验 / 交互界面',
          status: 'ACTIVE / 个人主线',
          tone: 'primary'
        },
        {
          name: 'Lex-Universalis',
          summary: '世界观 / Godot',
          status: 'WORLD / ARCHIVE',
          tone: 'gold'
        },
        {
          name: 'emptyinkpot.github.io',
          summary: '内容主站 / Astro',
          status: 'RUNNING / 线上主站',
          tone: 'violet'
        },
        {
          name: 'Roo-Kit',
          summary: 'MCP / skills / AI',
          status: 'LAB / TOOLCHAIN',
          tone: 'green'
        }
      ],
      automation: [
        { label: 'Pages', state: 'running', detail: '线上发布' },
        { label: 'Actions', state: 'running', detail: '构建 / 部署' },
        { label: 'Dependabot', state: 'checking', detail: '依赖巡检' },
        { label: 'Status', state: 'queued', detail: '待验证项' }
      ],
      toolkit: {
        root: 'root/',
        subtitle: 'Roo-Kit / 本地 AI 工具链目录结构',
        items: ['extensions', 'mcps', 'skills', 'ai-tracking']
      },
      archive: {
        root: 'lex-universalis/',
        subtitle: 'Lex-Universalis / 资料与原型目录',
        items: ['docs', 'config', 'godot', 'archive / lore']
      }
    },
    {
      id: 'heaven',
      label: '天堂工作室',
      subtitle: '站点团队',
      members: [
        { name: 'emptyinkpot', role: '主理 / 信息架构' },
        { name: 'Atramenti', role: '视觉识别 / 品牌稿' },
        { name: 'GitHub Actions', role: '构建发布 / Pages 守卫' }
      ],
      projects: [
        {
          name: 'emptyinkpot.github.io',
          summary: '围绕博客主站、专题页与信息入口持续迭代的团队主项目。',
          status: 'RUNNING',
          badges: ['站点团队', '发布中']
        },
        {
          name: 'Documentation Backbone',
          summary: '围绕 docs、plans、maintenance 建立统一事实源与治理体系。',
          status: 'ACTIVE',
          badges: ['治理', '文档']
        }
      ],
      repos: [
        {
          name: 'emptyinkpot.github.io',
          summary: '内容主站 / Astro / Pages',
          status: 'RUNNING / TEAM SITE',
          tone: 'violet'
        },
        {
          name: 'README / docs',
          summary: '治理、计划、执行记录',
          status: 'ACTIVE / DOCS',
          tone: 'primary'
        },
        {
          name: '.github/workflows',
          summary: '发布与自动化链路',
          status: 'RUNNING / CI',
          tone: 'green'
        },
        {
          name: 'public-data / updates',
          summary: '更新日志与公开维护信号',
          status: 'QUEUED / EXPAND',
          tone: 'gold'
        }
      ],
      automation: [
        { label: 'Pages', state: 'running', detail: '正式入口' },
        { label: 'Actions', state: 'running', detail: '部署链路' },
        { label: 'Dependabot', state: 'checking', detail: '依赖检查' },
        { label: 'Status', state: 'running', detail: '团队站点稳定' }
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
      members: [
        { name: 'temporary lead', role: '阶段任务负责人' },
        { name: 'guest design', role: '视觉支援 / UI 调整' }
      ],
      projects: [
        {
          name: 'Campaign / temporary collaboration',
          summary: '用于短周期专题、合作实验或阶段性上线任务的临时项目位。',
          status: 'QUEUED',
          badges: ['临时团队', '可替换']
        },
        {
          name: 'Workshop / prototype branch',
          summary: '当需要快速试验一个方向时，用这个槽位挂载临时原型。',
          status: 'CHECKING',
          badges: ['原型', '短周期']
        }
      ],
      repos: [
        {
          name: 'Prototype Slot A',
          summary: '短周期实验 / 合作仓位',
          status: 'QUEUED / TEMP',
          tone: 'gold'
        },
        {
          name: 'Prototype Slot B',
          summary: '专题分支 / 阶段任务',
          status: 'CHECKING / TEMP',
          tone: 'primary'
        },
        {
          name: 'Shared Assets',
          summary: '协作资源 / 视觉稿',
          status: 'ACTIVE / SHARED',
          tone: 'violet'
        },
        {
          name: 'Delivery Board',
          summary: '交付清单 / 节点跟踪',
          status: 'RUNNING / TRACK',
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

function buildCheckInData({
  posts,
  notes,
  projects
}: {
  posts: CollectionEntry<'posts'>[];
  notes: CollectionEntry<'notes'>[];
  projects: CollectionEntry<'projects'>[];
}): HomeCheckInData {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - 48);

  const activityByDate = new Map<string, number>();

  const mark = (date: Date | undefined, weight: number) => {
    if (!date) return;
    const normalized = new Date(date);
    normalized.setHours(0, 0, 0, 0);
    if (normalized < start || normalized > today) return;
    const key = normalized.toISOString().slice(0, 10);
    activityByDate.set(key, (activityByDate.get(key) ?? 0) + weight);
  };

  for (const post of posts) {
    mark(post.data.date, 2);
    mark(post.data.updated, 1);
  }

  for (const note of notes) {
    mark(note.data.date, 1);
  }

  for (const project of projects) {
    mark(project.data.date, 1);
  }

  const totalDays = 49;
  const days = Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    const key = date.toISOString().slice(0, 10);
    const count = activityByDate.get(key) ?? 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count >= 5) level = 4;
    else if (count >= 3) level = 3;
    else if (count >= 2) level = 2;
    else if (count >= 1) level = 1;

    return { date, level };
  });

  const weeks: HomeCheckInWeek[] = [];
  for (let weekIndex = 0; weekIndex < days.length; weekIndex += 7) {
    const slice = days.slice(weekIndex, weekIndex + 7);
    const first = slice[0]?.date;
    weeks.push({
      label: first
        ? first.toLocaleString('en-US', { month: 'short' }).toUpperCase()
        : '',
      days: slice.map((item) => ({ level: item.level }))
    });
  }

  const monthLabels = [...new Set(weeks.map((week) => week.label).filter(Boolean))];
  const activeDays = days.filter((day) => day.level > 0).length;
  const updatedPosts = posts.filter((post) => post.data.updated).length;

  return {
    kicker: 'Check-in Map',
    title: '像 GitHub 贡献图一样展示持续写作与维护节奏。',
    summary: '把写作发布、项目维护、页面更新和阶段笔记统一折算成持续活跃信号，而不是只看最后生成了多少页面。',
    statLine: `${activeDays} days active / ${updatedPosts} updated posts`,
    legend: 'Less  ·  ·  ·  ·  More',
    months: monthLabels,
    weeks,
    avatar: {
      imageSrc: withBase('/images/branding/vita-atramenti-logo.png'),
      alt: 'Vita Atramenti',
      caption: 'Daily writing / build / fix'
    }
  };
}
