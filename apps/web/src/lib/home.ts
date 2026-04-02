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
    checkIn: buildCheckInData({ posts: allPosts, notes, projects })
  };
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
