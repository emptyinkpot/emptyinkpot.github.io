# 首页编辑化 UI 抽象说明 README

这份文档的目标不是复述当前页面长什么样，而是把它抽象成一套可以复用的“首页系统规格”。

适用场景：

- 你想把当前首页当成演示稿，后续换一套数据源继续复刻
- 你想把前端和后端职责拆开，让团队分工更清楚
- 你想做一个风格接近、结构相近、但内容可替换的博客 / 项目 / 笔记聚合首页
- 你想把 Pencil 里的设计稿，转成可维护的页面架构

---

## 1. 一句话定义这个页面

这是一个“编辑化首页”，不是普通博客列表页。

它的核心职责不是把所有内容平铺出来，而是：

1. 给用户一个明确的主入口
2. 告诉用户当前站点主要有哪些内容类型
3. 给每种内容类型留一个稳定入口
4. 用“主推内容 + 最新内容 + 主题入口 + 系列入口 + 项目入口 + 笔记入口 + 持续活跃可视化”来建立站点秩序

可以把它理解为：

- 内容导航页
- 站点总览页
- 编辑部首页
- 内容系统总入口

---

## 2. 页面抽象分层

为了让这个页面以后能继续扩展，建议把它拆成 4 层。

### 第 1 层：内容真源层

负责存放真正的内容。

当前仓库对应位置：

- 文章：`apps/web/src/content/posts/`
- 笔记：`apps/web/src/content/notes/`
- 项目：`apps/web/src/content/projects/`
- 独立页面：`apps/web/src/content/pages/`

这一层只关心内容本身，不关心首页排版。

### 第 2 层：内容聚合层

负责把零散内容整理成首页可消费的数据。

当前仓库对应位置：

- 聚合函数：`apps/web/src/lib/content.ts`
- 首页路由：`apps/web/src/pages/index.astro`

这一层做的事情包括：

- 按日期排序文章
- 找 featured post
- 计算分类数量
- 计算系列数量
- 选取最新 notes
- 选取首页项目快照
- 生成 slug

### 第 3 层：页面编排层

负责决定首页每个模块放什么，不负责存内容，也不负责视觉细节。

当前仓库对应位置：

- 首页页面装配：`apps/web/src/pages/index.astro`

这一层决定：

- Hero 区放什么
- 主推区放什么
- 最新文章区放什么
- Topics / Series / Projects / Notes 怎么排
- 底部活跃度模块放什么

### 第 4 层：视觉表现层

负责颜色、间距、网格、字体、边框、卡片、热力图、头像、背景图、模块节奏。

当前仓库对应位置：

- 组件目录：`apps/web/src/components/`
- 样式目录：`apps/web/src/styles/`
- Pencil 设计稿：`designs/homepage.pen`

这一层负责“看起来像不像”，但不应该决定“数据从哪里来”。

---

## 3. 当前首页对应的业务入口图

建议把首页理解为 8 个入口模块。

| 模块 | 页面位置 | 作用 | 对应入口 |
|---|---|---|---|
| Header / Nav | 最上方 | 全站一级导航 | `/`, `/posts`, `/series`, `/projects`, `/updates`, `/search`, `/about` |
| Hero | 首屏左上 | 给出站点主张和当前定位 | 站点说明，不直接承载长列表 |
| Site Snapshot | 首屏右上 | 显示全站规模和运行状态 | 首页聚合数据 |
| Feature Story | 首屏下方主带 | 主推内容 | 某篇 featured post |
| Latest Posts | 中部双列 | 最新文章入口 | `/posts` 与文章详情页 |
| Topics | 下半区左侧 | 按主题 / 分类导航 | `/categories` 与分类详情页 |
| Series | 下半区右上 | 按系列导航 | `/series` 与系列详情页 |
| Projects / Notes | 下半区右下 | 提供项目和笔记入口 | `/projects`, `/notes` |

新增建议模块：

| 模块 | 页面位置 | 作用 | 对应入口 |
|---|---|---|---|
| Check-in Map | 底部横向大模块 | 展示持续维护节奏 | 由内容更新时间、提交记录、更新日志生成 |
| Avatar / Editor Identity | Check-in Map 右侧 | 显示维护者身份、人格化入口 | About 或作者页 |

---

## 4. 页面每个位置应该放什么入口

这一节用“位置”来描述，不依赖具体样式。

### 4.1 顶部导航

建议固定放：

- 首页
- 文章
- 专题 / 系列
- 项目
- 更新
- 搜索
- 关于

如果导航项继续增加，建议不要超过 7 个一级入口。

理由：

- 首页是总入口
- 文章是主内容池
- 专题 / 系列是内容重组层
- 项目是第二内容线
- 更新是站点运维和版本感
- 搜索是效率入口
- 关于是身份入口

### 4.2 首屏左侧 Hero

这里不应该堆内容列表，只应该放：

1. 站点定位短句
2. 大标题
3. 一段 1 到 2 行说明
4. 一个主按钮
5. 一个次按钮
6. 一组关键词标签

推荐入口组合：

- 主按钮：进入文章列表 `/posts`
- 次按钮：查看项目线 `/projects`
- 标签：Astro / Content System / MDX / Notes / Projects

### 4.3 首屏右侧 Snapshot

这里适合放“站点状态摘要”，不适合放营销文案。

推荐内容：

- 已发布文章数量
- 活跃分类数量
- 最近更新时间
- 当前部署状态
- 当前主维护方向

它是“状态面板”，不是“说明书”。

### 4.4 主推内容区

这里必须只有一个核心入口。

推荐放：

- featured post
- 当前最重要文章
- 当前阶段公告

不要同时放 2 到 3 篇，否则这个区域会失去“主推”意义。

### 4.5 最新文章区

这里的职责不是全文展示，而是“高密度入口网格”。

建议：

- 2 列网格
- 每卡只放 meta + title
- 可选加一行 summary
- 保持卡高一致

推荐入口：

- 4 篇到 6 篇最新文章
- 右上角固定一个“查看全部文章”

### 4.6 Topics 区

这里是主题结构导航，不是单篇内容展示区。

建议每个 topic item 只放：

- 分类名
- 文章数量
- 可点击进入分类页

推荐入口：

- `/categories`
- `/categories/[slug]`

### 4.7 Series 区

这里放“连续阅读入口”，不是分类替代品。

建议每个 series item 放：

- 系列标题
- 篇数
- 进入系列页

推荐入口：

- `/series`
- `/series/[slug]`

### 4.8 Project / Notes 区

这两个区建议放在同一视觉组里，但职责不同。

Project：

- 放一个当前项目快照
- 展示项目标题、描述、状态、技术栈
- 引向 `/projects`

Notes：

- 放最近笔记
- 展示日期和标题
- 引向 `/notes`

### 4.9 Check-in Map 区

这是首页底部非常适合做的“编辑化人格模块”。

建议左边放：

- GitHub contribution graph 风格热力图
- 月份标签
- Less / More 图例
- 一行统计

建议右边放：

- 圆形头像
- 维护者短签名
- 维护说明

这个模块对应的真实入口可以是：

- `/about`
- `/updates`
- 最近 90 天更新页

---

## 5. 后端怎么抽象

虽然当前项目是 Astro 静态站，但从系统设计角度，仍然可以抽象出“后端职责”。

建议把首页后端抽象成一个 `home aggregate service`。

### 5.1 后端职责

它负责输出一份首页所需的聚合数据对象，例如：

```ts
type HomePagePayload = {
  site: {
    title: string;
    description: string;
    issueLabel?: string;
  };
  nav: Array<{ label: string; href: string }>;
  hero: {
    kicker: string;
    title: string;
    summary: string;
    primaryAction: { label: string; href: string };
    secondaryAction?: { label: string; href: string };
    tags: string[];
  };
  snapshot: {
    postCount: number;
    categoryCount: number;
    lastUpdatedAt?: string;
    summaryLines: string[];
  };
  featured?: PostSummary;
  latestPosts: PostSummary[];
  topics: TaxonomySummary[];
  series: TaxonomySummary[];
  activeProject?: ProjectSummary;
  latestNotes: NoteSummary[];
  checkIn: {
    weeks: number[][];
    summary: string;
    statLine: string;
    avatarUrl?: string;
  };
};
```

这份对象可以来自：

- Markdown 内容集合
- 本地 JSON
- CMS
- 数据库
- Git 提交记录
- 更新日志

也就是说，UI 不应该直接依赖 Markdown 文件结构，而应该依赖聚合后的页面数据。

### 5.2 在当前项目里，对应的“后端”位置

虽然没有传统 API 服务，但逻辑对应如下：

- 内容 schema：`apps/web/src/content.config.ts`
- 内容聚合：`apps/web/src/lib/content.ts`
- 首页装配：`apps/web/src/pages/index.astro`

如果以后要抽离成真正 API，可以演化为：

- `GET /api/home`
- `GET /api/posts`
- `GET /api/categories`
- `GET /api/series`
- `GET /api/projects`
- `GET /api/notes`

---

## 6. 推荐的数据模型

### 6.1 Post

当前仓库已经有：

- title
- description
- summary
- date
- updated
- tags
- categories
- series
- featured
- draft
- cover

建议保留。

额外建议增加：

- `homepagePriority?: number`
- `homepageLabel?: string`
- `author?: string`
- `readingTime?: number`

### 6.2 Note

当前字段较少，适合轻量。

建议增加：

- `kind?: 'log' | 'decision' | 'snippet' | 'retrospective'`

这样首页可以按不同 note 类型做不同展示。

### 6.3 Project

当前项目模型已经足够做首页快照。

建议额外增加：

- `featured?: boolean`
- `updated?: Date`
- `cover?: string`
- `homepageSummary?: string`

### 6.4 Category / Series

当前是运行时从文章中聚合出来的，这个做法是对的。

如果以后规模变大，可以额外做：

- 分类说明文
- 系列摘要文
- 分类封面
- 系列封面

---

## 7. UI 复刻时的布局规则

这一节是最关键的部分。

不要只看“像不像”，要先看结构规则。

### 7.1 先建立大网格

推荐桌面端画布：

- 总内容宽度：`1320px` 到 `1360px`
- 左右边距：`48px` 到 `64px`
- 基础列间距：`24px` 到 `32px`
- 模块垂直间距：`24px` 到 `40px`

推荐首页网格：

- 首屏：`2 列`
  - 左 `~68%`
  - 右 `~32%`
- 中段文章：`2 列等宽`
- 下半区：
  - 第一行 `Topics | Series`
  - 第二行 `Project | Notes`
- 底部：`横向整块模块`

### 7.2 信息密度规则

首页不是海报，不要每块都抢主视觉。

优先级建议：

1. Hero 标题
2. Feature Story
3. Latest Posts / Topics / Series
4. Project / Notes
5. Check-in Map

同一时刻只能有一个最大视觉中心。

### 7.3 颜色限制

为了避免“脏”，颜色建议严格控制在 4 类以内：

1. 主深色：深墨黑
2. 主强调色：清华紫
3. 主卡片底色：纯白或偏冷白
4. 辅助浅色：淡紫灰

不建议再加入：

- 绿色块
- 橙色块
- 高饱和粉色块
- 多套浅色并列竞争

背景插画如果要保留，只能作为低透明度氛围层。

### 7.4 卡片规则

卡片必须统一这些属性：

- 高度体系
- padding
- 边框粗细
- 文本基线
- meta 与标题距离

如果 Latest Posts 是 4 张卡片，那么：

- 四张卡片宽度必须一致
- 高度必须一致
- meta 行起点一致
- title 行起点一致

### 7.5 标题区规则

每个模块标题区建议统一为：

- kicker：小号大写 / 高字距
- title：较大字号 / 粗体
- optional link：靠右对齐

建议所有模块标题区对齐同一条上边线。

---

## 8. 复刻这个 UI 的实施步骤

建议按下面顺序复刻，而不是一开始就纠结配色。

### 第一步：先做信息结构

先只确认这些模块是否存在：

- Header
- Hero
- Snapshot
- Feature
- Latest Posts
- Topics
- Series
- Project
- Notes
- Check-in Map

先把位置摆对，再谈质感。

### 第二步：补齐数据契约

先明确每个模块吃什么数据。

例如：

- Hero：站点主张对象
- Snapshot：统计对象
- Feature：单个 featured post
- Latest Posts：文章数组
- Topics：分类统计数组
- Series：系列统计数组
- Project：单个 project
- Notes：笔记数组
- Check-in Map：周矩阵 + 说明 + 头像

### 第三步：搭静态骨架

先把页面全部用占位数据搭出来。

建议顺序：

1. 首屏
2. 主推
3. 文章网格
4. 下半区双栏
5. 底部热力图

### 第四步：统一间距与边界

先统一：

- 外边距
- 卡片高度
- 文本对齐
- 模块边框
- 列间距

这一步往往比配色更重要。

### 第五步：最后才处理质感

质感优先来自：

- 留白
- 层级
- 节奏
- 对比
- 图文关系

不是来自堆渐变、阴影、花边、杂色。

---

## 9. 复刻时的组件建议

建议拆成下面这些组件。

### 页面级组件

- `HomePage`
- `HomeHero`
- `HomeSnapshot`
- `HomeFeature`
- `HomeLatestPosts`
- `HomeTopics`
- `HomeSeries`
- `HomeProject`
- `HomeNotes`
- `HomeCheckInMap`

### 通用组件

- `SectionHeader`
- `InfoCard`
- `MetaLine`
- `ActionLink`
- `Pill`
- `ContributionGrid`
- `AvatarBadge`

### 推荐目录

```text
apps/web/src/components/home/
  Hero.astro
  Snapshot.astro
  Feature.astro
  LatestPosts.astro
  Topics.astro
  Series.astro
  ProjectSnapshot.astro
  NotesPanel.astro
  CheckInMap.astro
```

---

## 10. 开发实施手册

这一节开始，不再只讲概念，而是讲“怎么真的做出来”。

### 10.1 推荐组件拆分

如果要做成一个长期可维护的首页，建议拆成：

#### 页面装配层

- `HomePage`
- `index.astro`

职责：

- 调用聚合函数
- 拿到首页 payload
- 把不同数据分发给不同模块

#### 首页模块层

- `HomeHero`
- `HomeFeatureSection`
- `HomeLatestPostsSection`
- `HomeTopicsSeriesSection`
- `HomeProjectNotesSection`
- `HomeCheckInMapSection`

职责：

- 每个组件只处理自己的结构和展示
- 不在组件里再重新查全站内容
- 不让某个组件偷偷依赖另一个组件的内部实现

#### 共享展示层

- `ArticleCard`
- `FeaturedCard`
- `Pill`
- `SectionHeader`
- `MetaLine`

职责：

- 提供复用样式和统一排版

#### 聚合数据层

- `getHomePagePayload()`
- `getCheckInMap()`
- `getFeaturedPost()`
- `getLatestPosts()`

职责：

- 从内容真源中取数
- 转成首页专用结构

### 10.2 推荐字段定义

下面这套字段定义，是复刻这个首页时最实用的一套最小契约。

#### Hero

```ts
type HomeHeroData = {
  kicker: string;
  title: string;
  summary: string;
  tags: string[];
  actions: Array<{
    label: string;
    href: string;
    variant?: 'primary' | 'secondary';
  }>;
};
```

#### Snapshot

```ts
type HomeSnapshotData = {
  kicker: string;
  metrics: Array<{
    value: string;
    label: string;
  }>;
  lines: string[];
};
```

#### 分类 / 系列导航项

```ts
type HomeTaxonomyItem = {
  label: string;
  count: number;
  href: string;
};
```

#### 打卡热力图

```ts
type HomeCheckInData = {
  kicker: string;
  title: string;
  summary: string;
  statLine: string;
  legend: string;
  months: string[];
  weeks: Array<{
    label: string;
    days: Array<{ level: 0 | 1 | 2 | 3 | 4 }>;
  }>;
  avatar: {
    imageSrc: string;
    alt: string;
    caption: string;
  };
};
```

#### 首页总 payload

```ts
type HomePagePayload = {
  hero: HomeHeroData;
  snapshot: HomeSnapshotData;
  featuredPost?: PostSummary;
  latestPosts: PostSummary[];
  topics: HomeTaxonomyItem[];
  series: HomeTaxonomyItem[];
  activeProject?: ProjectSummary;
  latestNotes: NoteSummary[];
  checkIn: HomeCheckInData;
};
```

### 10.3 推荐伪代码

#### 伪代码 1：首页聚合函数

```ts
function getHomePagePayload() {
  posts = loadPublishedPosts();
  notes = loadPublishedNotes();
  projects = loadProjects();

  sortedPosts = sortByDateDesc(posts);
  featuredPost = findFeatured(sortedPosts) ?? sortedPosts[0];
  latestPosts = remove(sortedPosts, featuredPost).slice(0, 4);
  topics = aggregateCategories(sortedPosts).slice(0, 3);
  series = aggregateSeries(sortedPosts).slice(0, 3);
  activeProject = pickProject(projects);
  latestNotes = sortNotesDesc(notes).slice(0, 3);
  checkIn = buildCheckInMap(posts, notes, projects);

  return {
    hero: buildHeroData(),
    snapshot: buildSnapshotData(posts, topics),
    featuredPost,
    latestPosts,
    topics,
    series,
    activeProject,
    latestNotes,
    checkIn
  };
}
```

#### 伪代码 2：首页装配层

```tsx
payload = getHomePagePayload();

render(
  <Layout>
    <HomeHero hero={payload.hero} snapshot={payload.snapshot} />
    <HomeFeatureSection featuredPost={payload.featuredPost} />
    <HomeLatestPostsSection posts={payload.latestPosts} />
    <HomeTopicsSeriesSection topics={payload.topics} series={payload.series} />
    <HomeProjectNotesSection
      activeProject={payload.activeProject}
      latestNotes={payload.latestNotes}
    />
    <HomeCheckInMapSection checkIn={payload.checkIn} />
  </Layout>
);
```

#### 伪代码 3：贡献热力图生成

```ts
function buildCheckInMap(posts, notes, projects) {
  days = createLastNDays(49);
  activity = new Map();

  for (post of posts) {
    addWeight(activity, post.date, 2);
    addWeight(activity, post.updated, 1);
  }

  for (note of notes) {
    addWeight(activity, note.date, 1);
  }

  for (project of projects) {
    addWeight(activity, project.date, 1);
  }

  weeks = groupIntoWeeks(days).map(week =>
    week.map(day => ({
      level: scoreToLevel(activity[day] ?? 0)
    }))
  );

  return { weeks, statLine, summary, avatar };
}
```

### 10.4 推荐接口样例

如果以后要把它从 Astro 静态聚合升级成“前后端分离”或“API 驱动”，建议接口这样设计。

#### `GET /api/home`

响应样例：

```json
{
  "hero": {
    "kicker": "Astro / Content System / Productized Blog",
    "title": "把写作、项目与长期记录收敛成一个唯一的入口",
    "summary": "这里以 Astro 作为唯一对外入口，把文章、专题、项目与碎片记录统一到同一套内容模型、页面体系和发布链路里。",
    "tags": ["Astro", "Tailwind", "MDX", "Content Collections", "GitHub Pages"],
    "actions": [
      { "label": "进入文章列表", "href": "/posts", "variant": "primary" },
      { "label": "查看项目线", "href": "/projects", "variant": "secondary" }
    ]
  },
  "snapshot": {
    "kicker": "Site Snapshot",
    "metrics": [
      { "value": "23", "label": "Published posts" },
      { "value": "6", "label": "Active categories" }
    ],
    "lines": [
      "最近一次文章时间：2026-04-02",
      "内容源、页面装配与发布链路已经收拢到同一站点。",
      "搜索、评论与持续录入能力后续会继续在这套唯一站点内迭代。"
    ]
  },
  "latestPosts": [],
  "topics": [],
  "series": [],
  "latestNotes": [],
  "checkIn": {
    "kicker": "Check-in Map",
    "title": "像 GitHub 贡献图一样展示持续写作与维护节奏。",
    "summary": "把写作发布、项目维护、页面更新和阶段笔记统一折算成持续活跃信号，而不是只看最后生成了多少页面。",
    "statLine": "31 days active / 12 updated posts",
    "legend": "Less · · · · More",
    "months": ["MAR", "APR", "MAY"],
    "weeks": [],
    "avatar": {
      "imageSrc": "/images/branding/vita-atramenti-logo.png",
      "alt": "Vita Atramenti",
      "caption": "Daily writing / build / fix"
    }
  }
}
```

#### `GET /api/checkin-map`

响应样例：

```json
{
  "days": 49,
  "weeks": [
    {
      "label": "MAR",
      "days": [{ "level": 0 }, { "level": 1 }, { "level": 4 }]
    }
  ],
  "statLine": "31 days active / 12 updated posts"
}
```

#### `GET /api/topics`

响应样例：

```json
[
  {
    "label": "工程治理",
    "count": 4,
    "href": "/categories/gong-cheng-zhi-li/"
  }
]
```

### 10.5 当前仓库已落地的模块化方向

当前代码层已经可以按下面的结构理解：

- 首页聚合：`apps/web/src/lib/home.ts`
- 首页装配：`apps/web/src/pages/index.astro`
- Hero 模块：`apps/web/src/components/home/HomeHero.astro`
- 主推模块：`apps/web/src/components/home/HomeFeatureSection.astro`
- 最新文章模块：`apps/web/src/components/home/HomeLatestPostsSection.astro`
- Topics / Series 模块：`apps/web/src/components/home/HomeTopicsSeriesSection.astro`
- Project / Notes 模块：`apps/web/src/components/home/HomeProjectNotesSection.astro`
- Check-in Map 模块：`apps/web/src/components/home/HomeCheckInMapSection.astro`

也就是说，这份文档已经不只是建议，而是已经和当前代码结构对齐。

---

## 11. Check-in Map 如何实现

如果你要把底部做成 GitHub 风格热力图，建议不要直接写死。

可以抽象成：

```ts
type ContributionCell = 0 | 1 | 2 | 3 | 4;
type ContributionWeek = ContributionCell[];

type CheckInMap = {
  weeks: ContributionWeek[];
  totalActiveDays: number;
  summary: string;
  statLine: string;
  avatarUrl?: string;
};
```

生成方式可选：

### 方案 A：基于内容更新时间

统计最近 90 天是否有：

- 新文章
- 新笔记
- 项目更新

优点：

- 跟站点内容强相关

### 方案 B：基于 Git 提交记录

统计最近 90 天每日 commit 次数。

优点：

- 更像 GitHub contribution graph

### 方案 C：混合模式

把内容发布和代码维护一起折算成活跃等级。

建议规则：

- 0：无更新
- 1：少量维护
- 2：有内容更新
- 3：内容 + 结构更新
- 4：高强度维护日

---

## 12. 未来如果做真正后端，建议的接口边界

### 首页接口

`GET /api/home`

返回首页所需全部聚合数据。

### 内容列表接口

- `GET /api/posts`
- `GET /api/notes`
- `GET /api/projects`

### 聚合导航接口

- `GET /api/categories`
- `GET /api/series`
- `GET /api/tags`

### 站点状态接口

- `GET /api/site-stats`
- `GET /api/checkin-map`

如果以后迁移到 CMS 或数据库，首页前端层只替换请求源，不需要重写布局。

---

## 13. 在当前仓库里怎么落地

最小落地方式如下。

### 内容层

继续使用：

- `apps/web/src/content/`

### 聚合层

继续扩展：

- `apps/web/src/lib/content.ts`

建议新增函数：

- `getHomePagePayload()`
- `getFeaturedPost()`
- `getLatestPosts(limit)`
- `getLatestNotes(limit)`
- `getCheckInMap(days)`

### 页面层

继续使用：

- `apps/web/src/pages/index.astro`

但建议把首页页面从“直接写逻辑”改成：

1. 页面只拿 `payload`
2. 每个模块只消费自己那段数据
3. 样式和数据不要混写

---

## 14. 复刻时最容易犯的错误

### 错误 1：把首页做成纯博客流

问题：

- 没有入口层级
- 缺少主推内容
- 首页失去“编辑感”

### 错误 2：每个模块都想当主视觉

问题：

- 视觉中心混乱
- 用户不知道先看哪里

### 错误 3：颜色太多

问题：

- 页面发脏
- 模块之间互相抢色

### 错误 4：背景太强

问题：

- 文字可读性下降
- 主内容和氛围图打架

### 错误 5：卡片基线不统一

问题：

- 页面看起来廉价
- 信息密度一高就乱

---

## 15. 一份最简复刻清单

如果以后要快速重做一个“基本类似”的首页，按这个清单就行。

1. 定义内容 schema
2. 做首页聚合 payload
3. 确定 8 到 10 个首页模块
4. 搭 2 列 + 下半区双栏 + 底部横向模块的大网格
5. Hero 只放主张，不放长列表
6. Feature 只放一个主推入口
7. Latest Posts 做等宽等高卡片
8. Topics / Series 做导航块，不做全文块
9. Project / Notes 做轻量快照
10. Check-in Map 做持续活跃可视化
11. 把颜色压到 4 类以内
12. 最后再加低透明度背景氛围

---

## 16. 当前仓库里的关键文件索引

核心入口：

- [apps/web/src/pages/index.astro](/E:/My%20Project/MyBlog/apps/web/src/pages/index.astro)
- [apps/web/src/content.config.ts](/E:/My%20Project/MyBlog/apps/web/src/content.config.ts)
- [apps/web/src/lib/content.ts](/E:/My%20Project/MyBlog/apps/web/src/lib/content.ts)

设计参考：

- [designs/homepage.pen](/E:/My%20Project/MyBlog/designs/homepage.pen)

本文档：

- [docs/architecture/homepage-editorial-ui-readme.md](/E:/My%20Project/MyBlog/docs/architecture/homepage-editorial-ui-readme.md)

---

## 17. 最终结论

要复刻这个首页，不要从“颜色”和“装饰”开始。

应该从下面这个顺序开始：

1. 抽象内容类型
2. 确定首页入口职责
3. 建首页聚合数据模型
4. 搭建稳定网格
5. 统一卡片和文字基线
6. 最后再压缩颜色和处理质感

只要这 6 步是稳的，就算换掉：

- 数据源
- 技术栈
- 视觉风格
- 配图

也仍然能做出“结构基本类似、气质接近、可持续维护”的首页。
