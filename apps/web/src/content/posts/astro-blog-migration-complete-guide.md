---
title: 从 Hexo 到 Astro：单站点博客重构完整实战指南
description: 记录 emptyinkpot 从 Hexo 历史结构收口到 Astro 单站点的完整过程，包括内容迁移、评论配置、搜索接入与 GitHub Pages 发布。
date: 2026-03-27 16:30:00
slug: astro-blog-migration-complete-guide
tags:
  - Astro
  - Hexo
  - 博客重构
  - GitHub Pages
  - giscus
categories:
  - 建站
series: 博客搭建
featured: true
---

这篇文章记录的是这次博客从 Hexo 历史结构走向 Astro 单站点的完整重构过程。

现在仓库的原则已经很明确：

- `apps/web/` 是唯一线上站点应用
- `apps/web/src/content/` 是唯一现行内容源
- 根目录保留的 Hexo 目录只作为历史归档与迁移参考

所以这篇指南不再讨论“双站并行预览”或“子路径预览站”，而是直接基于当前已经落地的单站点结构，复盘整套实现。

## 重构目标

这次重构要同时解决三个问题：

1. 让站点从传统 Hexo 主题模式升级到更灵活的 Astro 内容站结构。
2. 让内容、页面、组件和部署口径统一收口，避免新旧入口长期并存。
3. 在不丢失历史资料的前提下，把正式发布链路收敛到一个清晰入口。

最终期望的站点气质仍然是三件事并存：

- 极简高级：版式克制、阅读优先、留白清晰。
- 卡片杂志感：首页强调内容编排，而不是简单列表。
- 产品化技术博客：内容模型、页面结构和部署方式都可持续扩展。

## 技术路线选择

### 最终技术栈

- 前端框架：Astro
- 内容系统：Markdown + Astro Content Collections
- 样式方案：CSS Variables + 自定义全局样式
- 搜索：Pagefind
- 评论：giscus
- 部署：GitHub Actions + GitHub Pages

### 为什么选择 Astro

从这次重构目标看，Astro 比继续深改 Hexo 更合适，原因主要有这些：

- 首页和内容页的布局自由度更高。
- 内容集合 schema 更适合把文章、项目、Notes 分开建模。
- 静态输出模型简单，依然适合 GitHub Pages。
- 后续继续扩展标签页、系列页、项目页和独立页面都更自然。

## 当前单站点结构

重构完成后的现行结构可以理解为：

```text
MyBlog
├─ apps/web/                      # 唯一线上站点应用
│  ├─ src/content/                # 唯一现行内容源
│  │  ├─ posts/
│  │  ├─ notes/
│  │  ├─ projects/
│  │  └─ pages/
│  ├─ src/components/             # 站点组件
│  ├─ src/layouts/                # 页面布局
│  ├─ src/pages/                  # 路由页面
│  └─ src/styles/                 # 全局样式
├─ docs/                          # 规划、治理、执行日志、迁移状态表
├─ source/                        # Hexo 历史内容归档
└─ themes/                        # Hexo 历史主题归档
```

这套结构最关键的不是“目录长什么样”，而是职责边界清楚：

- 写现行内容时，只进入 `apps/web/src/content/`。
- 调整界面时，只进入 `apps/web/src/components/`、`apps/web/src/layouts/`、`apps/web/src/pages/`、`apps/web/src/styles/`。
- 查看旧文章原稿、旧主题实现或迁移上下文时，才去看 `source/` 和 `themes/`。

## 完整实施步骤

### 阶段 1：建立 Astro 站点骨架

第一步不是直接删除旧结构，而是先把新的站点壳层立起来。

核心动作包括：

1. 初始化 Astro 项目。
2. 建立基础布局、导航、首页和内容页路由。
3. 明确 `apps/web/` 将承担最终线上站点职责。

如果从零开始，初始化命令类似：

```bash
npm create astro@latest apps/web
cd apps/web
npm install
```

但在当前仓库里，更重要的是后续的职责切换：Astro 不是预览副站，而是唯一正式站点。

### 阶段 2：定义内容集合与迁移规则

内容迁移阶段的重点不是“把 Markdown 复制过去”，而是建立统一约束。

当前内容集合配置的核心字段大致如下：

```ts
const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    categories: z.array(z.string()).default([]),
    series: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
    toc: z.boolean().default(true)
  })
});
```

围绕这套 schema，迁移时我主要做了几件事：

- 将现行文章迁入 `apps/web/src/content/posts/`。
- 统一 front matter 字段命名。
- 补齐 `description` 等必要元数据。
- 保留稳定的 `slug`，尽量减少链接变化。
- 用迁移状态表登记“已迁移 / 待处理 / 归档”的边界。

这一步的价值在于：以后内容维护不再依赖“记忆”，而是依赖显式规则。

### 阶段 3：首页与文章页重做

进入 Astro 后，首页和文章页的目标不只是“能显示”，而是让阅读体验明显优于旧主题。

首页的设计原则：

- 不展示全文，只展示结构化摘要。
- 桌面端强调内容编排感。
- 移动端自然退化为单列阅读流。
- 把文章、项目、Notes 的入口关系梳理清楚。

文章页的重点能力：

- 更稳定的排版样式。
- 目录与长文阅读支持。
- 系列内容关联。
- 统一的头图、摘要、标签和元信息呈现。
- 后续接入评论、搜索和订阅能力。

## 搜索与评论系统接入

### Pagefind 搜索

Astro 静态站点接 Pagefind 很直接，核心流程是先构建，再生成索引：

```bash
npm run build
npx pagefind --site dist
```

这类能力的意义不只是“有搜索框”，而是把博客从单纯文章列表升级为可检索的内容站。

### giscus 评论系统

评论系统最终选择了 giscus，原因很简单：

- 不需要单独维护数据库。
- 直接复用 GitHub Discussions。
- 对个人博客足够轻量。
- 与仓库协作流天然兼容。

配置流程主要包括：

1. 在仓库里启用 Discussions。
2. 安装 giscus GitHub App。
3. 从 giscus 配置页拿到仓库与分类参数。
4. 通过环境变量注入 Astro 站点。

环境变量示例：

```env
PUBLIC_GISCUS_REPO=emptyinkpot/emptyinkpot.github.io
PUBLIC_GISCUS_REPO_ID=R_kgDORxZyNw
PUBLIC_GISCUS_CATEGORY=General
PUBLIC_GISCUS_CATEGORY_ID=DIC_kwDORxZyN84C5Yjs
```

组件层的关键点是：如果配置没补齐，页面应当优雅降级，而不是直接报错。

## SEO 与基础设施调整

### RSS 与站点地址

这次重构里一个非常重要的变化，是站点地址从过去的 `/site-v2/` 子路径预览口径，收口为根路径正式站点。

所以现行站点配置必须统一指向：

```ts
site: 'https://emptyinkpot.github.io/'
```

这意味着 RSS、canonical、sitemap、站内链接和分享路径都要使用根路径口径，不能再保留旧的预览子路径思维。

### Sitemap 与 robots.txt

在 Astro 中，这部分基础设施可以比较轻量地补齐：

- 通过 sitemap 集成生成站点地图。
- 通过 endpoint 输出 `robots.txt`。
- 把元信息统一挂到布局层，降低遗漏概率。

## GitHub Pages 发布链路

现在的正式发布链路已经收口为一条：

1. 在仓库中维护 Astro 站点源码。
2. 提交到 `main`。
3. GitHub Actions 执行构建。
4. 将 Astro 构建产物发布到 GitHub Pages。

与早期“Hexo 根站 + Astro 子路径合并产物”的方案相比，当前方案更简单，也更符合长期维护需求。

换句话说，发布链路的优化重点不是“命令更炫”，而是：

- 只有一个正式构建入口。
- 只有一个正式线上地址。
- 只有一个现行内容源。

## 验证清单

每次结构调整完成后，至少要验证这几类结果：

### 构建验证

```bash
npm run build
npm run preview
```

### 内容与体验验证

- 首页结构是否正常。
- 文章页排版是否稳定。
- 搜索是否可用。
- 评论区是否正确加载或降级。
- RSS 与路由链接是否指向根路径站点。
- 桌面端与移动端是否都可正常访问。

### 发布验证

- GitHub Actions 是否构建通过。
- GitHub Pages 是否更新成功。
- 核心页面与旧文章链接是否正常。

## 这次重构真正解决了什么

### 技术层

- 从 Hexo 主题驱动模式升级到 Astro 组件化站点结构。
- 建立了文章、Notes、项目、独立页面的内容集合边界。
- 让搜索、评论、RSS、sitemap 等基础能力更容易持续维护。

### 结构层

- `apps/web/` 成为唯一线上站点应用。
- `apps/web/src/content/` 成为唯一现行内容源。
- `source/` 与 `themes/` 明确降级为历史归档层。
- 文档层补齐了迁移状态表与历史边界说明。

### 维护层

- 新内容写作入口更明确。
- 站点修改入口更明确。
- 历史资料保留了下来，但不再与现行实现抢职责。
- 后续继续扩站时，不需要再背负双轨结构。

## 经验总结

这次重构里最关键的几条经验是：

1. 先收口正式入口，再谈视觉升级。
2. 先明确内容事实源，再做批量迁移。
3. 历史资料可以保留，但必须清楚标注边界。
4. 迁移完成的标准不是“新站能跑”，而是“旧入口不再承担现行职责”。

如果你也在做类似迁移，我最建议优先处理的不是样式，而是这三个事实：

- 哪个目录是唯一现行内容源。
- 哪个应用是唯一线上站点。
- 哪些旧目录只是历史归档。

这三个问题一旦答清楚，后面的页面、组件、搜索、评论和 SEO 都会顺很多。

---

相关链接：

- [Astro 官方文档](https://docs.astro.build/)
- [giscus 配置指南](https://giscus.app/zh-CN)
- [GitHub Discussions 文档](https://docs.github.com/en/discussions)
- [仓库根说明](../../../../../README.md)
- [内容迁移状态表](../../../../../docs/governance/content-migration-status.md)
- [历史资产边界说明](../../../../../docs/governance/historical-assets-boundary.md)
