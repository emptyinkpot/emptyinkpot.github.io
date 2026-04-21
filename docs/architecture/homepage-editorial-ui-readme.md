# 首页 Workbench 架构说明

本文档只描述当前仍在生效的首页实现。

自 `2026-04-21` 起，`blog.tengokukk.com/` 的唯一首页口径是紫色 `workbench` 首页：

- GitHub 活动热力图
- 语言占比环图
- 近 6 个月活跃折线
- `GITHUB SIGNALS / 团队信号`
- 以工作台而不是传统博客 Hero 为核心的首页编排

旧的编辑化首页组件（`Hero.astro`、`HomeHero.astro`、`HomeFeatureSection.astro`、`HomeLatestPostsSection.astro`、`HomeTopicsSeriesSection.astro`、`HomeProjectNotesSection.astro`、`HomeCheckInMapSection.astro`）已经废除，不再作为兼容路径、备用首页或并行真源保留。

---

## 1. 当前首页定位

当前首页不是“普通博客列表页”，而是站点唯一对外工作台入口，用来同时承载：

- 内容入口：文章、专题、项目、更新、搜索、关于
- 维护信号：GitHub 热力图、语言结构、近 6 个月活跃折线
- 当前站点快照：站点规模、最近更新时间、公开仓库状态
- 团队 / 仓库矩阵：`GITHUB SIGNALS / 团队信号`
- 维护工作流入口：Routes、Planned、Maintenance、Utility 等面板

换句话说，首页现在承担的是“内容站 + 项目工作台 + 维护面板”的组合职责，而不是旧版那种 `Hero + Featured + Latest Posts + Topics/Series + Project/Notes + Check-in Map` 的线性内容编排。

---

## 2. 当前真源文件

### 2.1 页面装配真源

- 首页路由：`apps/web/src/pages/index.astro`
- 全局布局：`apps/web/src/layouts/BaseLayout.astro`
- 首页数据聚合：`apps/web/src/lib/home.ts`
- GitHub 数据聚合：`apps/web/src/lib/github.ts`

### 2.2 首页组件真源

当前 `index.astro` 只装配下面这一组 `HomeWorkbench*` 组件：

- `apps/web/src/components/home/HomeWorkbenchHero.astro`
- `apps/web/src/components/home/HomeWorkbenchFeatureBand.astro`
- `apps/web/src/components/home/HomeWorkbenchLatestPosts.astro`
- `apps/web/src/components/home/HomeWorkbenchTaxonomy.astro`
- `apps/web/src/components/home/HomeWorkbenchProjectNotes.astro`
- `apps/web/src/components/home/HomeWorkbenchMaintenance.astro`
- `apps/web/src/components/home/HomeWorkbenchSignals.astro`
- `apps/web/src/components/home/HomeWorkbenchRoutes.astro`
- `apps/web/src/components/home/HomeWorkbenchPlanned.astro`
- `apps/web/src/components/home/HomeWorkbenchSearch.astro`
- `apps/web/src/components/home/HomeWorkbenchUtility.astro`
- `apps/web/src/components/home/HomeWorkbenchSidebar.astro`
- `apps/web/src/components/home/HomeWorkbenchScripts.astro`
- `apps/web/src/components/home/HomeWorkbenchDeck.astro`
- `apps/web/src/components/home/HomeWorkbenchPanel.astro`
- `apps/web/src/components/home/HomeWorkbenchSectionLine.astro`

如果以后首页继续改版，应直接在这套 `HomeWorkbench*` 真源上演进，而不是重新拉起一套旧 `HomeHero` 体系。

---

## 3. 当前页面结构顺序

`apps/web/src/pages/index.astro` 当前顺序如下：

1. `HomeWorkbenchSidebar`
2. `HomeWorkbenchSearch`
3. `HomeWorkbenchUtility`
4. `HomeWorkbenchHero`
5. `HomeWorkbenchFeatureBand`
6. `HomeWorkbenchLatestPosts`
7. `HomeWorkbenchTaxonomy`
8. `HomeWorkbenchProjectNotes`
9. `HomeWorkbenchMaintenance`
10. `HomeWorkbenchSignals`
11. `HomeWorkbenchRoutes`
12. `HomeWorkbenchPlanned`
13. `HomeWorkbenchScripts`

这就是当前 live 首页的真实编排顺序；文档、设计说明和后续实现都应以这里为准。

---

## 4. 关键模块说明

### 4.1 `HomeWorkbenchHero`

这是当前首页的核心首屏，不再只是传统 Hero。

它同时承载：

- 首页主标题与摘要
- 主按钮 / 次按钮
- 站点标签
- GitHub 活动热力图
- 语言占比环图
- 近 6 个月折线图
- 站点快照与 GitHub 公开资料摘要

如果用户提到“紫色首页”“热力图”“饼图”“折线图”，默认指的就是这个组件。

### 4.2 `HomeWorkbenchSignals`

这是当前首页中最能区分新旧前端的模块之一。

它负责输出：

- `GITHUB SIGNALS / 团队信号`
- 仓库矩阵
- 自动化状态面板
- 工具目录树
- 资料档案树

这个模块属于当前首页真源，不能再被旧的内容型分区替代。

### 4.3 `HomeWorkbenchLatestPosts` / `HomeWorkbenchTaxonomy` / `HomeWorkbenchProjectNotes`

这三个模块仍然承担内容入口职责，但现在都作为 workbench 面板中的子块存在，不再是旧首页那种独立大段落式结构。

### 4.4 `HomeWorkbenchRoutes` / `HomeWorkbenchPlanned` / `HomeWorkbenchMaintenance`

这几个模块把首页从“博客首页”推进成“站点工作台首页”。

它们是当前首页的一等结构，而不是可有可无的附加区块。

---

## 5. 数据来源

首页数据由 `apps/web/src/lib/home.ts` 统一聚合，当前主要来源包括：

- `astro:content` 中的 `posts`、`notes`、`projects`
- GitHub 公开资料与仓库概览（通过 `getGitHubOverview('emptyinkpot')`）
- 站内分类、系列、最新内容与维护信息

`HomePagePayload` 仍使用 `hero`、`snapshot`、`checkIn`、`github` 等字段名，但这些字段现在服务的是 workbench 首页，而不是旧组件体系。

字段名本身不是并行前端口径；真正的页面真源以 `index.astro` 的组件装配和 `HomeWorkbench*` 组件树为准。

---

## 6. 缓存与部署口径

当前线上域名：`https://blog.tengokukk.com/`

当前部署口径：

- nginx 站点配置：`124:/etc/nginx/sites-available/myblog.conf`
- 静态部署目录：`124:/srv/myblog/site`
- 可编辑源码真源：`E:\My Project\Atramenti-Console\codex\apps\myblog-source`
- GitHub 源仓：`https://github.com/emptyinkpot/emptyinkpot.github.io`

为避免用户仍看到旧首页，`blog.tengokukk.com` 当前已经对首页 HTML 响应显式下发：

- `Cache-Control: no-store, no-cache, must-revalidate, max-age=0`
- `Pragma: no-cache`
- `Expires: 0`

如果后续再出现“明明已部署新首页但浏览器还在显示旧页”的情况，先排查本机浏览器缓存，而不是重新怀疑首页真源是否切回旧组件。

---

## 7. 旧前端废除边界

以下内容视为已废除，不再接受“顺手保留一下兼容”的做法：

- 旧首页组件文件重新放回 `apps/web/src/components/home/`
- 在 `index.astro` 里恢复 `HomeHero` / `HomeFeatureSection` 等旧装配
- 把旧首页当作备用首页、回滚首页或 A/B 首页并行保留
- 在文档里继续把旧线性首页描述成当前 live 结构

如果未来要再改首页，也应直接替换当前 `HomeWorkbench*` 体系，而不是 resurrect 旧首页。

---

## 8. 验证标准

当有人再次质疑首页是不是还是旧版时，按下面标准判断：

- 打开 `https://blog.tengokukk.com/`
- 看到 GitHub 活动热力图
- 看到“语言占比”
- 看到“近 6 个月”
- 看到 `GITHUB SIGNALS / 团队信号`

只要这四项存在，就说明当前 live 首页仍然是 workbench 真源，而不是旧首页。
