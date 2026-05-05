---
title: MyBlog
status: canonical
---

# MyBlog
## 总体设计与实施手册

> 版本定位：本文件是 MyBlog 的唯一真源、项目说明入口与工程手册主文档。
> 文档策略：正文先给出项目说明、结构与边界，再展开运行、开发、发布与维护规则。
> 冲突处理：若本文件与任何派生文档冲突，以本文件为准；派生文档只允许补充，不允许重定义项目边界。

## 0. 项目说明入口

```yaml
projectName: MyBlog
canonicalDoc: README.md
machineReadableEntry: project.json
localSourceRoot: E:\My Project\MyBlog
siteAppRoot: E:\My Project\MyBlog\apps\web
sourcePostsRoot: E:\My Project\MyBlog\apps\web\src\content\posts
contentRoots:
  - E:\My Project\MyBlog\apps\web\src\content\posts
  - E:\My Project\MyBlog\apps\web\src\content\notes
  - E:\My Project\MyBlog\apps\web\src\content\projects
  - E:\My Project\MyBlog\apps\web\src\content\pages
buildOutputRoot: E:\My Project\MyBlog\apps\web\dist
publicBaseUrl: https://blog.tengokukk.com/
siteEntrypoints:
  home: https://blog.tengokukk.com/
  posts: https://blog.tengokukk.com/posts/
  tags: https://blog.tengokukk.com/tags/
  projects: https://blog.tengokukk.com/projects/
  github: https://blog.tengokukk.com/github/
  books: https://blog.tengokukk.com/books/
  music: https://blog.tengokukk.com/music/
  knowledge: https://blog.tengokukk.com/knowledge/
  knowledgeIndex: https://blog.tengokukk.com/data/knowledge-index.json
  evidenceLibrary: https://blog.tengokukk.com/evidence-library/
  search: https://blog.tengokukk.com/search/
  settings: https://blog.tengokukk.com/settings/
githubRepo: https://github.com/emptyinkpot/emptyinkpot.github.io
defaultBranch: main
serverHost: 124.220.233.126
serverRuntimeRoot: /srv/myblog/site
nginxSiteConfig: /etc/nginx/sites-available/myblog.conf
publishMode: local-build-then-upload-dist
verificationCommands:
  - npm run lint
  - npm run check
  - npm run build
```

- 这是本仓唯一的项目说明入口，供人和机器快速定位项目名、源码、GitHub、部署位置和对外入口。
- 机器优先读取 `project.json`；人类优先读取本节和后续正文。
- 如果需要完整结构、约束与操作流程，继续阅读后续章节。

### 0.1 对外简介

MyBlog 是 `emptyinkpot.github.io` 对应的单站点 Astro 博客仓。它当前承担公开文章、专题、笔记、项目索引与首页工作台的统一前台职责。对外读者最关心的是：项目是什么、怎么构建、源码在哪、部署到哪里，这些信息都集中在本节与 `project.json`。

### 0.2 快速开始

- 项目名：`MyBlog`
- GitHub：`https://github.com/emptyinkpot/emptyinkpot.github.io`
- 本机源码：`E:\My Project\MyBlog`
- 站点应用：`E:\My Project\MyBlog\apps\web`
- 内容真源：`E:\My Project\MyBlog\apps\web\src\content\posts`
- 本地构建产物：`E:\My Project\MyBlog\apps\web\dist`
- 对外入口：`https://blog.tengokukk.com/`
- 史料库入口：`https://blog.tengokukk.com/evidence-library/`
- 项目工坊入口：`https://blog.tengokukk.com/projects/`
- 显示设置入口：`https://blog.tengokukk.com/settings/`
- 云端站点目录：`/srv/myblog/site`
- Nginx 配置：`/etc/nginx/sites-available/myblog.conf`
- 机器优先读取：`project.json`
- 人类优先读取：`README.md`

### 0.3 仓库信息卡

| 项目 | 值 |
| --- | --- |
| GitHub 仓库 | `https://github.com/emptyinkpot/emptyinkpot.github.io` |
| 默认分支 | `main` |
| 当前工作分支 | `fix/homepage-desktop-overlap` |
| 长期源码真源 | GitHub 仓库 |
| 本机目录 | `E:\My Project\MyBlog` |
| 服务器目录 | `/srv/myblog/site` |
| 分支策略 | 默认 `feature branch + Pull Request`；非紧急情况不直接改 `main` |
| 版本控制职责 | GitHub 负责历史与协作；本机负责开发与构建；服务器负责静态运行 |

### 0.4 仓库卫生与运行入口

- Canonical 人类入口：`README.md`
- Canonical 机器入口：`project.json`
- 前端主入口：`apps/web/`
- 内容真源：`apps/web/src/content/`
- 构建产物目录：`apps/web/dist/`
- 质量门：`npm run lint` -> `npm run check` -> `npm run build`
- 发布边界：本地构建后上传 `apps/web/dist/` 到 `/srv/myblog/site`
- 运行边界：`project.json` 负责机器入口，`README.md` 负责人类入口

`emptyinkpot.github.io` 当前已经收拢为单站点仓库：对外站点由 `apps/web/` 生成，工程文档统一收纳在 `docs/`。

## 0.5 Truth Layer

本层只写当前真实运行状态；不写理想态，不把策略写成事实。

### 0.5.1 Real Runtime Topology

```text
内容作者 / 开发者
  ↓
E:\My Project\MyBlog
  ↓
apps/web
  ↓
Astro build
  ↓
apps/web/dist
  ↓
/srv/myblog/site
  ↓
https://blog.tengokukk.com/
```

- `E:\My Project\MyBlog` 是当前机器上的 canonical 本地源码仓。
- `apps/web/` 是唯一正式站点入口。
- `apps/admin-next/` 是当前本地已落地的 admin 控制台原型根目录，但还不是公开站点入口，也未接入真实发布链。
- `apps/web/dist/` 是当前正式静态构建产物目录。
- `/srv/myblog/site` 是当前云端静态运行目录。
- `https://blog.tengokukk.com/` 是当前唯一公开站点入口。

### 0.5.2 Content And Build Truth

- 正式内容真源是 `apps/web/src/content/`。
- 架构规范类公开文章真源是 `apps/web/src/content/posts/`。
- `docs/` 承担工程文档、规划、架构与维护记录，不作为公开文章真源的并列写作面。
- 当前发布模式是“本地构建 -> 上传 `apps/web/dist/` -> Nginx 托管”，不是服务器内 Git 构建。
- 当前 `apps/admin-next/` 只承载本地控制台原型；现阶段验证命令是 `npm run admin:build`，不参与当前公开站点发布链。
- 当前 `public-data/evidence-library/` 是史料素材库的数据真源；`apps/admin-next/app/admin/evidence-library/` 已具备 OpenList 扫描入队和 Remotion manifest 导出原型。

### 0.5.3 Observability Truth

- 当前公开站点入口：`https://blog.tengokukk.com/`
- 当前云端站点目录：`/srv/myblog/site`
- 当前 Nginx 配置：`/etc/nginx/sites-available/myblog.conf`
- 当前 README 不把未验证的额外公开 health/debug 路径写成既成事实。

### 0.5.4 Runtime Observability Truth

- 当前访问日志入口：`/var/log/nginx/access.log`
- 当前错误日志入口：`/var/log/nginx/error.log`
- 当前构建观测入口：本地 `npm run build` 输出与 CI / PR 检查日志
- 当前已确认质量门：`npm run lint`、`npm run check`、`npm run build`
- 当前 README 不把未接入的 Sentry、analytics、trace pipeline 写成已存在能力。

### 0.5.5 Content System Truth

- 当前内容系统是文件型 content collections，而不是数据库型 CMS。
- 正式集合边界是 `posts`、`notes`、`projects`、`pages`。
- `posts` 是结构最严格的公开内容类型，默认需要标题、日期、标签、分类、摘要与 slug。
- `notes` 承担轻量记录；`projects` 承担项目索引；`pages` 承担独立页面内容。
- `evidence-library` 承担史料素材、待标注队列、OpenList 路径、Remotion 导出 manifest 的结构化数据。
- 当前标签页、分类页、系列页都建立在文件内容元数据之上，而不是独立索引服务。

## 0.6 Constraint Layer

本层只写硬约束、禁止行为和系统不变量。

### 0.6.1 Forbidden Actions

- 不要把旧临时 working copy、静态快照目录或归档目录重新当作活跃源码仓。
- 不要把 `docs/`、根目录零散 Markdown、或服务器运行目录写成公开文章真源。
- 不要把本地预览地址、临时端口或未验证子域名写成当前正式公开入口。
- 不要在未完成 `npm run lint`、`npm run check`、`npm run build` 前把改动当作可发布版本。
- 不要把服务器运行目录当作长期 source of truth，GitHub 仓库仍是长期真源。

### 0.6.2 System Invariants

- `apps/web/` 是唯一正式站点应用入口。
- `apps/admin-next/` 不是当前公开站点入口，也不是当前生产发布物来源。
- `apps/web/src/content/` 是内容真源。
- `https://blog.tengokukk.com/` 是唯一公开站点入口。
- `/srv/myblog/site` 是当前正式云端运行目录。
- 同一时刻只允许一个活跃本地源码仓边界。

### 0.6.3 Source-Of-Truth Map

- 长期源码真源：GitHub 仓库 `emptyinkpot/emptyinkpot.github.io`
- 当前本机活源码仓：`E:\My Project\MyBlog`
- 当前公开文章真源：`apps/web/src/content/posts/`
- 当前构建产物真源：`apps/web/dist/`
- 当前服务器运行真源：`/srv/myblog/site`
- 历史快照、旧 working copy、服务器临时文件、根目录零散文档都不得与上述真源并列。

## 0.7 Strategy Layer

本层只写开发、验证、发布与排障顺序；不得冒充当前事实。

### 0.7.1 Local Verification Order

1. 先确认改动是否落在正确真源边界。
2. 再执行 `npm run lint`。
3. 然后执行 `npm run check`。
4. 最后执行 `npm run build`。
5. 只有三道质量门都通过后，才进入提交、推送或发布判断。

### 0.7.2 Deployment Strategy

1. 在本地源码仓 `E:\My Project\MyBlog` 完成编辑与构建。
2. 确认 `apps/web/dist/` 是本轮有效构建产物。
3. 再把构建产物发布到 `/srv/myblog/site`。
4. 不要先改服务器再回补本地源码仓。

### 0.7.3 Publish Checklist

1. 确认改动落在正确真源边界。
2. 执行 `npm run lint`。
3. 执行 `npm run check`。
4. 执行 `npm run build`。
5. 若改动涉及公开内容路由或首页交互，补一轮本地可见结果验证。
6. 完成提交、推送与 PR 更新后，再判断是否需要发布到 `/srv/myblog/site`。

### 0.7.4 AI Execution Protocol

1. 先读取 `0. 项目说明入口`，确认源码仓、公开入口与运行目录。
2. 再读取 `Truth Layer`，确认真实入口、内容真源与构建产物边界。
3. 再读取 `Constraint Layer`，确认禁止动作与系统不变量。
4. 最后按 `Strategy Layer` 顺序执行验证、提交与发布。

### 0.7.5 Platform Evolution Notes

以下内容是已识别的升级方向，不属于当前已落地事实：

- 未来可加 `Observability Layer` 的增强能力，例如 Sentry、访问分析、构建耗时统计与请求追踪。
- 未来可把内容系统继续升级为更强的 `Content Model Layer`，包括 schema、关系、引用图与统一索引。
- 未来可增加 `admin` 或 `api` 边界，把 MyBlog 从单前台站点推进到内容平台。
- 未来可增加 AI 写作、摘要、标签建议与发布流水线，但这些当前都不是既成运行事实。

#### 0.7.5.1 Target Platform Positioning

目标形态不再是“单纯博客站点优化”，而是：

`MyBlog Content Platform`

它是一个以前台内容站为展示面、以后台内容生产系统为控制面、以 AI 写作和发布系统为能力层的个人内容平台。

#### 0.7.5.2 Target High-Level Architecture

```text
MyBlog/
├── apps/
│   ├── web-astro/        # Astro 前台（只读展示）
│   ├── admin-next/       # Next.js 后台 + API（核心控制）
│   └── gateway/          # 网关（后期可选）
│
├── modules/
│   ├── content/          # 内容模型与 schema
│   ├── ai-writer/        # AI 写作系统
│   ├── publish/          # 构建、发布、回滚
│   ├── token-pool/       # 模型调度
│   ├── analytics/        # 数据分析
│   └── media/            # 素材与封面管理
│
├── kernel/
│   ├── config/
│   ├── logger/
│   ├── http/
│   ├── queue/
│   └── runtime/
│
├── .runtime/
│   ├── logs/
│   ├── cache/
│   └── builds/
│
└── docs/
```

架构原则保持为：

- `Astro` 只负责展示，不承担写入、AI 调度或发布控制。
- `Next.js` 负责 admin、API、AI 控制与发布控制。
- `modules/` 只承载业务能力，不直接承担 UI。
- `kernel/` 只承载底座能力，如 config、logger、queue、runtime。
- 目标后台建议采用 `App Router + Route Handlers`；接口路径优先放在 `app/api/**/route.ts`。

#### 0.7.5.2.1 First Executable Target

第一批建议直接落地为：

```text
apps/
  web-astro/                 # 现有博客前台（目标名称；当前真实路径仍为 apps/web）
  admin-next/                # 新增后台 + API + Dashboard

modules/
  content/
  ai-writer/
  token-pool/
  publish/
  analytics/

kernel/
  config/
  logger/
  runtime/
```

执行红线保持为：

- `Astro` 前台只读 content。
- `Astro` 不允许写文件、不允许调 AI、不允许执行发布。
- `API` 不允许绕过 `modules/token-pool` 直连 provider。
- `publish` 不允许直接覆盖 `current`；必须走 `releases + current + rollback`。

#### 0.7.5.3 Target Admin Surface

后台优先做成“内容生产驾驶舱”，而不是一开始就做成完整 CMS。

```text
/admin
├── dashboard
├── content
│   ├── list
│   ├── editor
│   └── review
├── ai
│   ├── topic
│   ├── generate
│   ├── rewrite
│   └── seo
├── publish
│   ├── build
│   ├── release
│   └── rollback
├── analytics
└── settings
```

目标 API 面建议为：

```text
/api
├── content/
│   ├── create
│   ├── update
│   ├── list
│   └── publish
├── ai/
│   ├── topic
│   ├── generate
│   ├── rewrite
│   └── seo
├── publish/
│   ├── build
│   ├── release
│   ├── rollback
│   └── logs
```

最小布局壳可按：

```tsx
// apps/admin-next/app/admin/layout.tsx
export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r p-4 space-y-3">
        <div className="font-bold text-xl">Content OS</div>
        <nav className="space-y-2">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/content">Content</a>
          <a href="/admin/ai">AI Writer</a>
          <a href="/admin/publish">Publish</a>
          <a href="/admin/token-pool">Token Pool</a>
          <a href="/admin/logs">Logs</a>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}
```

#### 0.7.5.4 Target AI Writing Pipeline

AI 写作目标链路不是“AI 直接写入 posts”，而是显式 pipeline：

```text
topic
 ↓
outline
 ↓
draft
 ↓
rewrite
 ↓
seo
 ↓
human check
 ↓
publish
```

建议的模块边界：

```text
modules/ai-writer/
├── topic.ts
├── outline.ts
├── draft.ts
├── rewrite.ts
├── seo.ts
└── pipeline.ts
```

内容状态机建议为：

```text
idea
 → draft
 → ai_generated
 → human_reviewed
 → ready_to_publish
 → published
 → archived
```

#### 0.7.5.5 Target Token Pool Boundary

`token-pool` 应作为统一模型调度边界，不能让各模块直连模型。

目标调用关系应为：

```text
ai-writer
  ↓
kernel/token-pool
  ↓
provider-router
  ↓
OpenAI / Claude / Gemini / local / web-to-api
```

调度策略建议按任务分层：

- `topic`：便宜模型
- `outline`：便宜或中等模型
- `draft`：中等模型
- `rewrite`：强模型
- `seo`：便宜模型
- `fact-check`：强模型 + 搜索

评分调度目标不应是随机选模型，而应走 provider scoring + fallback：

```text
task -> route -> provider -> fallback
```

连续失败、延迟惩罚、cooldown、successRate 都应进入调度得分，而不是只看静态优先级。

#### 0.7.5.6 Target Publish System

当前事实仍是“本地 build -> 上传 dist -> Nginx 托管”；未来目标是可回滚发布。

建议的目标目录：

```text
/srv/myblog/
├── releases/
│   ├── 2026-04-25-001/
│   ├── 2026-04-25-002/
├── current -> releases/2026-04-25-002
├── logs/
└── scripts/
```

建议的目标链路：

```text
git push / admin 点击发布
  ↓
CI 检查
  ↓
npm run lint
  ↓
npm run check
  ↓
npm run build
  ↓
上传到 releases/<timestamp>
  ↓
切换 current 软链接
  ↓
nginx reload
  ↓
健康检查
  ↓
失败自动回滚
```

目标发布接口建议至少包括：

```text
/api/publish/build
/api/publish/release
/api/publish/rollback
/api/publish/logs
```

#### 0.7.5.7 Hard Rules For Future AI Work

以下规则属于未来平台化阶段也必须持续成立的硬约束：

- AI 不允许直接写入 `posts/` 作为最终发布结果。
- 所有内容必须先经过 pipeline，再进入人工审核或发布判断。
- publish 必须经过 `build + check`，不能跳过质量门。
- 禁止直接覆盖 `current` 运行目录；应优先新增 `release` 再切换指针。
- token pool 必须作为统一模型调度层，禁止模块直连单一模型提供方。

#### 0.7.5.8 Recommended Upgrade Order

建议按以下顺序推进，而不是同时开太多面：

1. 先补 `content schema` 与校验层。
2. 再做最小 `admin`，优先管理 Markdown 与发布状态。
3. 然后加 `AI Studio`，但先只生成草稿，不直接发布。
4. 再加 `releases + rollback` 的发布中心。
5. 然后接 `token-pool` 做模型调度与成本控制。
6. 最后再加 `analytics / search / recommendation`。

#### 0.7.5.9 P0 To P3 Delivery Order

推荐把后续执行切成以下阶段：

- `P0`
  - 跑起 `admin-next`
  - 落地 `dashboard`
  - 落地 `build / release / rollback` API
  - 落地 `releases + current` 回滚发布
- `P1`
  - 落地 `token-pool` provider scoring
  - 落地 `/api/token-pool/status`
  - 让 AI generate 接入 token-pool
- `P2`
  - 落地 `content editor`
  - 落地 `AI pipeline`
  - 落地 `save draft`
- `P3`
  - 落地 `analytics`
  - 落地 `logs viewer`
  - 落地自动发布 agent

#### 0.7.5.10 Target Frontend Interaction Model

当前前台已经不是“简单博客页面集合”，而更接近“工作台型首页 + 内容系统”。后续前端升级的重点不应只是“更好看”，而应优先补齐：

- 交互分层
- 信息节奏
- 操作反馈
- 状态可见性

目标前台方向应从 `Blog UI` 升级为 `Content OS UI`，默认按以下三层理解页面：

- `L1 Content Layer`
  - 文章、笔记、项目、系列与详情正文
- `L2 Action Layer`
  - 搜索、筛选、分类、标签、快速跳转、复制/分享等操作
- `L3 System Layer`
  - 状态、统计、入口、系统信号、最近更新、运行健康度

现有问题不是“组件不够多”，而是这些层混在一起，导致页面更像“信息堆叠”，而不是“可操作系统”。

#### 0.7.5.11 Target Homepage Console Pattern

后续首页 Workbench 不建议继续按“组件一块块向下堆”；应按功能分层，重组为控制台式首页：

```text
Hero / System Entry
-> Quick Actions
-> Content Feed
-> Signals
-> System Panels
```

推荐把首页主结构默认理解为：

- `Hero`
  - 说明当前站点是谁、在做什么、最近发生了什么
- `Quick Actions`
  - 搜索
  - 标签或分类入口
  - 项目入口
  - 快速跳转
- `Content Feed`
  - 最新文章
  - 推荐内容
  - 按类型混排的内容流
- `Signals`
  - 更新频率
  - 活跃度
  - 近期变更
- `System Panels`
  - 分类统计
  - 项目状态
  - 运行状态

首页改造的重点是“功能分块”，不是“展示分块”。现有 `HomeWorkbench*` 组件默认视为可重组资产，而不是待删除资产。

#### 0.7.5.12 Target Frontend State And Feedback Contract

后续前台页面需要明确“行为反馈体系”，避免停留在纯浏览页。建议至少补齐以下交互状态：

- `loading`
  - 用 skeleton、占位块或延迟反馈表示加载中
- `empty`
  - 明确显示“当前没有结果/没有内容”，而不是空白页
- `error`
  - 对搜索失败、内容缺失、客户端异常给出可见反馈
- `success / action feedback`
  - 复制、筛选、切换、加载完成等行为应有反馈，可用 toast、状态文本或内联提示

后续状态标签建议逐步进入前台内容体系，例如：

- `draft`
- `published`
- `archived`
- `ai-generated`

如果当前真实内容尚未全面具备这些字段，README 里将其视为目标前端 contract，而不是当前事实。

#### 0.7.5.13 Target Content Surface Upgrade

后续内容页不应只呈现“静态正文”，而应升级为“数据 + 状态 + 关系”的内容面板。建议目标内容页至少包含：

- 元信息栏
  - 发布时间
  - 标签
  - 阅读时间
  - 状态
  - 来源（如人工 / AI-assisted）
- 关系系统
  - 上一篇
  - 下一篇
  - 系列入口
  - 相关文章
- 操作入口
  - 复制链接
  - 分享
  - 返回列表
  - 查看源码或原始内容入口（若有）

内容页目标不是加更多装饰，而是把“状态、上下文、关系、操作”从隐含信息变成显式信息。

#### 0.7.5.14 Target Search And Taxonomy Interaction

当前搜索、标签、分类、系列页面都已存在，但后续应从“列表页”升级为“交互入口”：

- 搜索目标
  - 输入即过滤
  - 显示标题、类型、标签摘要
  - 至少支持 `all / posts / notes / projects` 的类型过滤
- 标签 / 分类 / 系列目标
  - 不只显示名称
  - 尽量显示数量、最近更新、入口说明
  - 应更像筛选视图入口，而不是静态字典页

这一层的目标是把 taxonomy 从“归档结构”提升为“导航与发现系统”。

#### 0.7.5.15 Target Frontend Design Language

后续前台与 `admin-next` 建议共用一套基础设计语言，使控制面与展示面属于同一系统，而不是两套割裂 UI。

默认可复用的基础规则：

- 卡片基线
  - `border + rounded-xl + padding + hover state`
- 状态颜色
  - `draft -> yellow`
  - `published -> green`
  - `error -> red`
  - `ai -> accent`
- 字体层级
  - `title`
  - `section`
  - `body`
  - `meta`
- 间距规则
  - 页面级 `space-y-8`
  - 组件级 `space-y-4`
- 动效规则
  - hover / fade / slide 等只服务结构反馈，不做无意义装饰

如果后续进入真正的可复用设计系统阶段，应把这些规则继续下沉到 tokens / contracts / patterns，而不是只留在 prose 文档里。

#### 0.7.5.15a Current Frontend Pixel Contract

本节记录当前 `apps/web` 前台真实 UI contract，按 `apps/web/src/styles/global.css` 的现行实现换算为 px。默认换算基线为 `1rem = 16px`。默认视觉风格已经从 Glass / Workbench 切到 `Heritage / Cultural OS`；旧 Glass 只作为 `/settings/` 可切换的兼容风格保留。

当前首页真源：

- 页面：`apps/web/src/pages/index.astro`
- 交互：`apps/web/src/pages/index.astro` 内的原生 drawer/filter 脚本
- 样式：`apps/web/src/styles/global.css`
- 数据：`apps/web/src/content/*`、`apps/web/src/data/books.ts`、`apps/web/src/lib/profile.ts`、`apps/web/src/data/github-overview.emptyinkpot.json`

复刻阅读顺序：

1. 先按“桌面首页外壳”复刻结构和滚动模型。
2. 再按“Heritage 默认视觉语言”和“Heritage 实际覆盖值”复刻当前默认画面。
3. 只在需要兼容 `/settings/` 的 `theme: "glass"` 时参考“Glass legacy 基础值”。
4. 最后按“Motion Contract”“Color Hygiene Contract”“重叠与卡顿禁止规则”验收。

桌面首页外壳：

| 层级 / class | 当前值 |
| --- | --- |
| `body.home-mode` | 桌面锁定视口滚动，首页内部主 Feed 自己滚动 |
| `.page-wrap--home` | `width: 100%` |
| `.home-feed-shell` | `display:grid`；列宽 `280px minmax(0,1fr)`；gap `20px`；最大宽度 `min(1480px, 100% - 40px)`；上下 padding `20px`；高度 `100%` |
| `.home-feed-rail` | 左侧个人展示栏；`position: sticky; top: 20px`；最大高度 `calc(100vh - 40px)`；内部可滚动；gap `14px` |
| `.home-feed-main` | 首页主 Feed 唯一主滚动容器；`overflow-y:auto`；右 padding `2px`；底部 padding `26px`；`min-width:0` |
| `.home-feed-toolbar` | sticky 筛选条；`top:0`；z-index `20`；gap `16px`；margin-bottom `16px`；padding `12px 0` |
| `.home-feed-grid` | CSS columns 瀑布流；桌面 `column-count:3`；column gap `16px` |
| `.home-article-drawer` | 右侧阅读抽屉；fixed；宽 `min(760px,100vw)`；高 `100vh`；z-index `90` |

首页 Feed / Drawer 精确尺寸（Glass legacy 基础值）：

以下表格记录的是 `global.css` 中仍然保留的 Glass / Workbench 基础 class 值。由于 `<html data-theme="heritage">` 是当前默认输出，这些值会被后面的 Heritage override 覆盖。复刻当前默认画面时，不得只按本表还原渐变、毛玻璃和大阴影。

| class | 当前值 |
| --- | --- |
| `.home-feed-profile` / `.home-feed-rail-card` | padding `16px`；边框 `1px rgba(255,255,255,0.68)`；背景 `linear-gradient(180deg, rgb(255 255 255 / var(--home-rail-glass-top-alpha)), rgb(255 255 255 / var(--home-rail-glass-bottom-alpha)))`；默认 alpha `0.9 -> 0.76`；毛玻璃 `blur(var(--home-glass-blur)) saturate(var(--home-glass-saturate))` |
| `.home-feed-brand` | min-height `34px`；padding `6px 12px`；gap `8px`；logo `18px × 18px` |
| `.home-feed-avatar` | `82px × 82px`；圆形 |
| `.home-feed-tabs` | 顶部唯一导航；`display:flex`；gap `6px`；允许 wrap |
| `.home-feed-tab` | min-height `31px`；padding `6px 10px`；字号 `13px`；底边 `2px solid transparent`；active 只改底边和文字色 |
| `.home-feed-toolbar` | 背景 `linear-gradient(180deg, rgb(244 238 231 / var(--home-toolbar-glass-top-alpha)), rgb(244 238 231 / var(--home-toolbar-glass-bottom-alpha)))`；默认 alpha `0.94 -> 0.84`；毛玻璃变量同卡片 |
| `.home-feed-card` | `display:inline-block`；宽 `100%`；底部 margin `16px`；`break-inside: avoid`；边框 `1px rgba(255,255,255,0.7)`；背景 `linear-gradient(180deg, rgb(255 255 255 / var(--home-card-glass-top-alpha)), rgb(255 255 255 / var(--home-card-glass-bottom-alpha)))`；默认 alpha `0.92 -> 0.78`；hover `translateY(-2px)` |
| `.home-feed-card__cover` | 标准 min-height `160px`；tall `238px`；compact `118px` |
| `.home-feed-card__mark` | min-height `122px`；padding `14px` |
| `.home-feed-card__body` | padding `15px`；gap `10px` |
| `.home-feed-card h2` | 标准字号 `21px`；compact `18px`；行高 `1.12`；必须 `overflow-wrap:anywhere` |
| `.home-feed-card p` | 字号 `13px`；行高 `1.68`；必须 `overflow-wrap:anywhere` |
| `.home-feed-card__tags span` | min-height `24px`；padding `5px 8px`；字号 `11px` |
| `.home-article-backdrop` | fixed `inset:0`；z-index 跟随 layer；背景 `rgba(15,15,20,0.36)`；blur `4px` |
| `.home-article-drawer__header` | padding `18px 22px`；gap `16px`；底边框 `1px #ddd5d0` |
| `.home-article-drawer__body` | padding `24px`；`overflow-y:auto` |
| `.home-article-reader__grid` | 两列 `180px minmax(0,1fr)`；gap `24px` |
| `.home-article-toc` | sticky；top `20px`；max-height `calc(100vh - 120px)`；右边框 `1px`；右 padding `14px` |
| `.home-article-intro h1` | 字号 `clamp(32px,5vw,54px)`；行高 `0.98` |

首页显示设置：

| 项目 | 当前实现 |
| --- | --- |
| 路由 | `apps/web/src/pages/settings.astro` -> `/settings/` |
| 应用入口 | `apps/web/src/layouts/BaseLayout.astro` 内联脚本，页面加载时先读 `localStorage` 再写 CSS 变量 |
| 存储键 | `emptyinkpot-visual-settings` |
| 作用范围 | 浏览器本地显示偏好；不是服务端 CMS 设置，不会改仓库默认值 |
| 默认主题 | `theme: "heritage"`；`BaseLayout.astro` 初始输出 `<html data-theme="heritage">`，避免首屏闪回旧玻璃风格 |
| 可调变量 | 首页主题 / glass legacy、阅读排版 token、Knowledge UI 显示偏好；全部由 `BaseLayout.astro` 的 `window.emptyinkpotVisualSettings` 统一 normalize/apply/save |
| 背景图规则 | 设置页允许根路径 `/...` 或 `http(s)://...`；空值恢复 `/images/home/homepage-floral-bg.png` |

Typography Token System：

| Token | 默认值 | 用途 |
| --- | --- | --- |
| `--grid-max-width` | `1320px` | 全站最大网格参考宽度 |
| `--baseline` | `8px` | 阅读页间距节奏的最小单位 |
| `--type-body-size` | `18px` | Reader 正文字号 |
| `--type-body-line` | `1.9` | Reader 正文行高 |
| `--type-title-scale` | `1` | Reader 标题层级倍率 |
| `--reader-column-width` | `680px` | Reader 唯一内容版心 |
| `--reader-paragraph-gap` | `16px` | 正文段落与块元素之间的默认距离 |
| `--reader-section-gap` | `48px` | 正文 h2 / section 的上方节奏 |

`emptyinkpot-visual-settings` 当前 schema：

```ts
type VisualSettings = {
  theme: "heritage" | "glass";
  cardTopAlpha: number;
  cardBottomAlpha: number;
  railTopAlpha: number;
  railBottomAlpha: number;
  toolbarTopAlpha: number;
  toolbarBottomAlpha: number;
  backgroundOverlayAlpha: number;
  glassBlurPx: number;
  glassSaturate: number;
  backgroundImage: string;
  typography: {
    bodySize: number;       // 16-20
    lineHeight: number;     // 1.65-2.05
    columnWidth: number;    // 600-760
    titleScale: number;     // 0.9-1.2
    paragraphGap: number;   // 12-24
    fontMode: "serif" | "sans" | "mixed" | "system";
  };
  knowledge: {
    graphDensity: "low" | "medium" | "high";
    graphLabels: "important" | "all" | "none";
    graphMotion: boolean;
    highlightVisibility: "subtle" | "normal" | "strong";
    readerMemoryPanel: "collapsed" | "expanded" | "hidden";
  };
  content: {
    banner: {
      kicker: string;
      title: string;
      subtitle: string;
      springLabel: string;
      summerLabel: string;
      autumnLabel: string;
      winterLabel: string;
      bgImage: string;
      midImage: string;
      frontImage: string;
    };
    copy: Record<string, string>;
    images: Record<string, string>;
  };
};
```

设置页 contract：

- `/settings/` 是“个人阅读与知识系统控制台”，不是只换颜色的主题页。
- 分组固定为：外观主题、阅读排版、知识系统、Banner 内容、全站内容端口。
- 阅读排版设置必须即时更新 `--type-body-size`、`--type-body-line`、`--reader-column-width`、`--type-title-scale`、`--reader-paragraph-gap`。
- 字体模式通过 `data-font-mode` 切换 `--font-body / --font-display / --font-ui`。
- Knowledge UI 设置通过 `data-graph-density`、`data-graph-labels`、`data-graph-motion`、`data-highlight-visibility`、`data-reader-memory-panel` 控制显示偏好。
- Banner 内容设置必须暴露：kicker、title、subtitle、四季 label、bg/mid/front 图片 URL。空值表示沿用源码默认。
- 全站内容端口使用 `content.copy` 和 `content.images` 两个 JSON map：普通 key 对应 `data-copy-key` / `data-image-key`；`selector:<css selector>` key 可覆盖任意前端元素文字或图片。selector 无效时必须静默忽略，不能中断页面。
- `window.emptyinkpotVisualSettings.exportContentPorts()` 必须能导出当前页面已声明的 `data-copy-key` / `data-image-key` 端口，便于在 `/settings/` 里生成可编辑 JSON。
- 设置页 preview 必须包含至少一个 Feed 预览、一个 Reader 预览和一个 Knowledge UI 预览。

内容端口示例：

```json
{
  "content": {
    "banner": {
      "kicker": "Seasonal Field",
      "title": "EMPTYINKPOT",
      "subtitle": "Content OS · Tangible Knowledge UI",
      "springLabel": "Spring Field",
      "summerLabel": "Summer Field",
      "autumnLabel": "Autumn Field",
      "winterLabel": "Winter Field",
      "bgImage": "/images/home/homepage-floral-bg.png",
      "midImage": "",
      "frontImage": ""
    },
    "copy": {
      "home.feed.title": "连续浏览",
      "home.banner.title": "EMPTYINKPOT",
      "selector:.home-feed-tab[data-feed-filter=\"post\"]": "文章"
    },
    "images": {
      "home.brand.logo": "/images/branding/vita-atramenti-logo.png",
      "selector:.home-hero-banner__layer--bg": "/images/home/homepage-floral-bg.png"
    }
  }
}
```

复刻步骤：

1. 在 `BaseLayout.astro` 初始化 `window.emptyinkpotVisualSettings`，并保证 `load / save / reset / apply / exportContentPorts` 都存在。
2. 在需要开放的文字元素上标 `data-copy-key="..."`，图片或背景元素上标 `data-image-key="..."`。
3. Banner 必须同时保留专用端口 `data-hero-kicker / data-hero-title / data-hero-subtitle / data-hero-layer`。
4. `/settings/` 必须能编辑 `content.banner`，并提供 `content.copy` / `content.images` JSON textarea。
5. 保存时只写 `emptyinkpot-visual-settings`，不改文章 markdown、不改仓库默认内容。
6. reset 必须当场恢复原 DOM 文案和图片，不要求用户刷新。

Heritage 默认视觉语言：

| 语义 | Token / 色值 | 用途 |
| --- | --- | --- |
| 宣纸底色 | `--heritage-bg: #f5f1e8` | 首页背景、drawer 背景 |
| 白色卡片 | `--heritage-card: #ffffff` | Feed 卡片、ChartCard、ShowcaseCard、Graph panel |
| 和纸面板 | `--heritage-paper: #efe8da` | 左栏、设置页面板、控制面板 |
| 强边界 | `--heritage-line-strong: #cbbda9` | 卡片边框、drawer 边界、搜索面板 |
| 清华紫 | `--heritage-purple: #6b2d5c` | 主色、文章边条、active filter |
| 朱红 | `--heritage-red: #9e2a2b` | 札记 / 书架边条 |
| 松绿 | `--heritage-green: #2f5d50` | 项目 / GitHub / 热力图高强度 |
| 王室黄 | `--heritage-gold: #c9a227` | 音乐边条、选中文本和点缀 |
| 书页线 | `--heritage-line: #d8cfc2` | 分隔线、按钮边框、drawer 边界 |

Heritage 硬规则：

- 默认不使用大面积渐变、发光、半透明玻璃和 blur；`body.home-mode` 下 Heritage 会强制取消 `backdrop-filter`。
- 卡片层级靠纯色面板、左侧语义边条和清晰分隔线表达，不靠阴影堆叠。
- 后续首页视觉改动默认修改 Heritage 主题；Glass 只作为兼容项，不再作为主设计方向。

Heritage 实际覆盖值（当前默认画面）：

| selector / token | 当前值 | 复刻要求 |
| --- | --- | --- |
| `html[data-theme="heritage"]` | `BaseLayout.astro` 默认输出；localStorage 只允许切换到 `glass` 或 `heritage` | 首屏不得闪回 Glass |
| `body.home-mode` | 宣纸底 `#f5f1e8` + 44px 网格；网格线为紫色低透明度 | 只能作为纸面肌理，不能变成明显装饰图案 |
| `--heritage-card` | `#ffffff` | Feed 卡片、ChartCard、ShowcaseCard、Knowledge panel 的默认面 |
| `--heritage-paper` | `#efe8da` | 左栏、设置面板、控制面板的默认面 |
| `--heritage-paper-deep` | `#e0d6c3` | 封面占位、正文 mark 背景、hover 面 |
| `--heritage-line-strong` | `#cbbda9` | 卡片边框、toolbar 底线、drawer 左线、搜索面板边界 |
| `.home-feed-shell` | `width:min(1520px,100% - 40px)`；gap `20px`；padding `20px 0 32px` | 比 legacy 宽 40px，给书签露出和三列 Feed 留空间 |
| `.home-feed-profile` / `.home-feed-rail-card` | border `1px solid #cbbda9`；radius `4px`；background `#efe8da`；shadow `0 1px 0 rgba(0,0,0,.04)` | 左栏是米色状态面，不承载主导航 |
| `.home-feed-card` / `.chart-card` / `.showcase-card` | border `1px solid #cbbda9`；radius `4px`；background `#ffffff`；shadow `0 1px 0 rgba(0,0,0,.04)` | 当前主内容卡片必须白，不允许恢复 `linear-gradient`、blur 和厚阴影 |
| `.home-feed-profile` | 顶边 `4px solid #6b2d5c` | 左栏只做身份、状态和记忆，不承载完整内容 |
| `.home-feed-toolbar` | background `#f5f1e8`；底边 `2px solid #d8cfc2`；sticky | 筛选时只隐藏已有卡片，不重建 DOM |
| `.home-feed-card` | `position:relative`；`overflow:visible`；`border-left-width:4px`；transition `transform var(--motion-base) var(--ease-standard)` | 允许书签露出；正文、图片、图表不得溢出卡片内容区 |
| `.home-feed-card:hover` | `translateY(-1px)`；无阴影增强 | hover 只给结构反馈，不制造漂浮感 |
| `.home-feed-card h2` | `color: var(--bookmark-color, #1e1b18)` | 标题颜色跟随书签语义色 |
| `.home-feed-card__tags span` | border `1px solid #cbbda9`；radius `3px`；background transparent | 不使用 pill 胶囊，不做 SaaS 标签风 |
| `.home-article-backdrop` | `rgba(30,27,24,.28)` | 背景弱化，不加 blur |
| `.home-article-drawer` | width `min(860px,100vw)`；background `var(--reader-bg,#f5f1e8)`；border-left `2px solid #cbbda9`；shadow none；`180ms` transform slide | 抽屉是“临时展开的书页”，不是玻璃侧栏 |
| `.home-article-drawer__body` | padding `24px`；内部纵向滚动 | 关闭后必须回到原 Feed 滚动位置 |
| `.reading-progress` | height `3px`；background `#6b2d5c`；`transform:scaleX(...)` | 只反映阅读进度，不改变布局 |
| `.knowledge-search-layer` | fixed；z-index `120` | 高于 drawer layer |
| `.knowledge-search-panel` | width `min(720px,calc(100vw - 28px))`；max-height `82vh`；border `2px solid #cbbda9`；radius `6px`；`120ms` fade/drop | 搜索是 command palette，不是新页面跳转 |
| `.knowledge-canvas` / `.knowledge-graph-svg` | canvas min-height `680px`；白色周边 panel；44px 纸面网格背景 | 图谱必须分层/扇区，不做随机毛线团 |

Bookmark Object 精确合同：

| selector | 当前值 | 复刻要求 |
| --- | --- | --- |
| `.bookmark` | `position:absolute; top:-8px; left:16px; z-index:3` | 书签必须从卡片顶部露出，模拟插进纸页 |
| `.bookmark` | padding `6px 11px 9px`；font-size `10px`；letter-spacing `0.12em` | 书签是物件，不是信息 tag |
| `.bookmark` | `clip-path: polygon(0 0,100% 0,100% 100%,50% 86%,0 100%)` | 底部缺口必须保留 |
| `.bookmark` | `rotate(-1.4deg)`；shadow `0 2px 4px rgba(30,27,24,.12)` | 轻微手工感，不允许随机到影响对齐 |
| `.bookmark::before` | 顶部 2px 暗线 | 表达纸张压痕 |
| `.home-feed-card:hover .bookmark` | `rotate(-0.2deg) translateY(-1px)` | hover 拉直书签，不大幅移动卡片 |
| `post` | `#6b2d5c` | 文章 / 思想 / 学术 |
| `note` / `book` | `#9e2a2b` | 札记 / 书架 / 创作表达 |
| `project` / `github` | `#2f5d50` | 技术 / 项目 / 工程信号 |
| `music` | `#c9a227`，文字 `#1e1b18` | 音乐 / 点缀 / 收藏感 |

Motion Contract：

| 交互 | 当前实现 | 目标边界 |
| --- | --- | --- |
| Feed card hover | card `translateY(-1px)`，`180ms` standard ease | 不改变尺寸，不加厚阴影，不造成瀑布流重排 |
| Bookmark hover | `rotate(-1.4deg)` -> `rotate(-0.2deg) translateY(-1px)` | 只让书签像被轻轻扶正 |
| Active feed card | `.feed-card--active` outline `2px #6b2d5c`，offset `3px` | 键盘 J/K 浏览必须可见，不能靠发光 |
| Drawer open/close | `is-open` class + `180ms` slide/fade，关闭后延迟 hidden，保留 scrollTop | 不得回退成瞬间跳变 |
| Search overlay | `is-open` class + `120ms` fade/drop；panel fixed z-index `120` | 不能拦截 drawer 内 Esc 关闭逻辑 |
| Reader progress | scroll 时更新 `scaleX` | 不参与 transition，避免进度滞后 |
| Filter | 隐藏 / 显示已有卡片 | 不重建 DOM，不触发 scroll reset |

Color Hygiene Contract：

- Heritage 不是“米色主题”。每个面必须靠明度差、边框权重或语义色形成层级。
- `#f5f1e8` 背景、`#efe8da` 面板和 `#e4dac7` 深面如果同时大面积出现，必须用 `#d8cfc2` 或更明确的结构线分隔；否则画面会显脏。
- 紫、红、绿、金只能表达内容语义，不作为随机装饰色。
- 禁止把大面积渐变、neon、高饱和蓝紫、玻璃 blur、发光 hover 重新带回默认主题。
- 边界不清时，优先调整 surface ladder 和 border contrast；不要先加阴影。
- 文字颜色默认 `#1e1b18`，次级 `#6b645c`；不得用浅灰在宣纸背景上承载正文。

当前视觉债 / 判断：

- 当前方向是对的：默认已经从 AI SaaS / Dribbble 风切到 Heritage / Cultural OS，书签隐喻也成立。
- 之前画面“脏”和“边界不清”的主要原因是 `#f5f1e8`、`#efe8da`、`#e4dac7` 三个纸色太接近，且边线太轻。
- 当前 Final UI Contract v1 已把主 Feed 卡片改为白色 `#ffffff`，并把关键边界提升到 `#cbbda9`；后续不得回退到全米色卡片。
- 动效已经收敛到 `--motion-fast / --motion-base / --motion-slow` 和 `--ease-standard`，drawer/search 不再使用瞬间跳变作为目标状态。
- 下一轮视觉修正应继续检查截图基线和真实对比度，而不是继续增加功能。

非首页 workbench 页：

| class | 当前值 |
| --- | --- |
| `.page-wrap` | 最大宽度 `min(1180px, 100% - 24px)` |
| `.workbench-page` | 纵向 gap `20px`；padding `32px 0 44.8px` |
| `.workbench-page__intro h1` | 字号 `clamp(33.6px, 4vw, 64px)`；行高 `0.94` |
| `.workbench-page__grid--posts` / `.workbench-page__grid--projects` | 两列等分；gap `16px` |
| `.workbench-page__post-card` | 两列：`176px minmax(0,1fr)`；gap `16px` |
| `.workbench-page__post-cover` | 最小高 `176px` |
| `.evidence-library__hero` | 两列：`minmax(0,1.5fr) minmax(256px,0.75fr)`；gap `24px`；margin-top `24px`；padding `24px` |
| `.evidence-library__grid` | 三列等分；gap `16px`；margin-top `16px` |
| `.evidence-library__card` / `.evidence-library__section` | padding `21.6px` |

复刻覆盖矩阵：

| 页面族 | 源文件 | 复用布局 | 复刻要求 |
| --- | --- | --- | --- |
| 首页 | `apps/web/src/pages/index.astro` | `.home-feed-shell` + `.home-feed-grid` + `.home-article-drawer` | 必须保留左栏 `280px`、Feed columns、右侧 `760px` 抽屉；点击卡片不得跳走和重置 Feed 滚动 |
| 文章 / 笔记列表 | `posts/index.astro`、`notes/index.astro` | `.page-wrap` + `.workbench-page__grid--posts` | 两列卡片在 `1100px` 以下变单列；卡片内容列必须 `minmax(0,1fr)` |
| 项目工坊 / Project OS | `projects/index.astro`、`projects/[slug].astro` | `.project-studio-grid` + `.project-os` | `/projects/` 是 list/dashboard；`/projects/[slug]/` 是 app workspace；项目详情使用左侧导航 + 主工作区，不再套全站顶部导航 |
| 文章详情 / 页面详情 | `[slug].astro`、`about.astro` | `.page-wrap` + `.prose-shell` | 正文容器最大宽度由 `.page-wrap` 控制；代码块只能横向滚动，不得撑宽正文 |
| 搜索 / taxonomy | `search.astro`、`tags/*`、`categories/*`、`series/*` | `.page-wrap` + `pagefind-ui` / workbench 列表 | Pagefind 输入框和结果抽屉宽度 `100%`，不得新增固定宽侧栏 |
| 史料素材库公开页 | `evidence-library/index.astro` | `.evidence-library__hero/grid/source-grid` | hero 右列最小 `256px`；source key 列 `160px`；`860px` 以下全部单列 |
| 后台原型 | `apps/admin-next/app/admin/**` | `.console-shell` + `.console-main` | 左栏 `240px`、主内容滚动；`1100px` 以下单列 |

公开史料素材库精确尺寸：

| class | 当前值 |
| --- | --- |
| `.evidence-library__hero` | grid；列 `minmax(0,1.5fr) minmax(256px,0.75fr)`；gap `24px`；margin-top `24px`；padding `24px` |
| `.evidence-library__hero h2` / section h2 | margin-top `7.2px`；字号 `clamp(21.6px,2.2vw,32px)`；行高 `1.16` |
| `.evidence-library__hero p` / section p | margin-top `12.8px`；行高 `1.8` |
| `.evidence-library__hero pre` | min-height `144px`；圆角 `19.2px`；padding 由内容居中控制；字号 `16px`；`white-space: pre-wrap` |
| `.evidence-library__grid` | 三列 `repeat(3,minmax(0,1fr))`；gap `16px`；margin-top `16px` |
| `.evidence-library__card` / `.evidence-library__section` | padding `21.6px` |
| `.evidence-library__steps` / `__phases` / `__source-grid` | grid；gap `12.8px`；margin-top `19.2px` |
| `.evidence-library__steps article` / `__phases article` / `__source-grid p` | grid；列 `auto minmax(0,1fr)`；gap `16px`；padding `16px`；圆角 `16px` |
| `.evidence-library__steps article > span` | min-width `51.2px`；padding `7.2px 11.2px`；字号 `12.48px` |
| `.evidence-library__source-grid p` | 列 `160px minmax(0,1fr)`；`860px` 以下改 `1fr` |
| `.evidence-library__mono` / source code | 必须 `overflow-wrap:anywhere`，用于长路径、OpenList 路径、URL |

后台 admin 原型精确尺寸：

| class | 当前值 |
| --- | --- |
| `.console-shell` | min-height `100vh`；grid 列 `240px 1fr` |
| `.console-sidebar` | padding `24px`；右边框 `1px` |
| `.brand-block` | margin-bottom `32px` |
| `.brand-title` | 字号 `21.6px`；字重 `700` |
| `.nav-list` | grid；gap `8px` |
| `.nav-link` | padding `12px 14px`；圆角 `16px` |
| `.console-main` | padding `24px`；唯一后台主滚动容器 `overflow-y:auto` |
| `.page-stack` / `.section-stack` | grid；gap `24px` |
| `.page-header h1` / `.chat-shell-header h1` | 字号 `32px` |
| `.card` | padding `20px`；圆角 `24px`；边框 `1px` |
| `.metric-grid` | 三列 `repeat(3,minmax(0,1fr))`；gap `16px` |
| `.two-column-grid` | 两列 `repeat(2,minmax(0,1fr))`；gap `16px` |
| `.metric-card` | min-height `128px` |
| `.metric-value` | margin-top `12px`；字号 `32px` |
| `.button-row` / `.chat-input-row` / `.evidence-control-row` | flex；gap `12px` |
| `.field-stack` | flex basis `320px`；gap `8px` |
| `.action-button` | padding `12px 18px`；圆角 `16px`；hover 只允许 `translateY(-1px)` |
| `.timeline-grid` | 六列 `repeat(6,minmax(0,1fr))`；gap `12px` |
| `.timeline-step` | padding `14px 10px`；圆角 `16px`；字号 `13.12px` |
| `.meta-grid` | 列 `120px minmax(0,1fr)`；gap `10px 14px`；字号 `14.4px` |
| `.badge-grid` | flex-wrap；gap `8px` |
| `.evidence-admin-steps article` | 列 `auto minmax(0,1fr)`；gap `14px`；padding `14px`；圆角 `18px` |
| `.provider-table th/td` | padding `14px 16px` |
| `.ai-layout` | min-height `calc(100vh - 48px)`；列 `220px minmax(0,1fr) 280px`；gap `16px` |
| `.chat-shell` | grid rows `auto 1fr auto`；`min-height:0` |
| `.chat-thread` | gap `12px`；padding `20px 0`；内部滚动 `overflow-y:auto` |
| `.chat-bubble` | max-width `80%`；padding `14px`；圆角 `20px` |
| `.text-input` | width `100%`；padding `12px 14px`；圆角 `16px` |

断点规则：

| 断点 | 当前行为 |
| --- | --- |
| `max-width: 1240px` | `.home-feed-grid` 从 3 columns 改 2 columns |
| `max-width: 1200px` | 遗留 `.home-workbench__lead-grid` 和 `.home-workbench__content-grid` 变单列；当前首页不再依赖它们 |
| `max-width: 1100px` | 遗留 HomeWorkbench 网格和 workbench 列表页网格变单列 |
| `max-width: 900px` | `body.home-mode` 恢复页面级滚动；`.home-feed-shell` 改 block；宽度 `calc(100% - 24px)`；左栏不 sticky；主 Feed `overflow: visible`；Feed columns 改 1 |
| `max-width: 860px` | `evidence-library` hero/grid 变单列，source grid 变单列 |
| drawer `max-width: 760px` | `.home-article-drawer` 宽 `100vw`；header padding `14px`；drawer body padding `16px`；TOC 从 sticky 侧栏改正文上方块 |
| `max-width: 720px` | `.workbench-page` 顶部 padding 改 `18.4px`；stats 单列 |
| admin `max-width: 1100px` | `.console-shell` 从 `240px 1fr` 改单列；sidebar 改底边框；`.metric-grid`、`.two-column-grid`、`.ai-layout`、`.timeline-grid` 全部单列 |

重叠与卡顿禁止规则：

- 桌面首页只允许一个主内容纵向滚动容器：`.home-feed-main`。左侧 `.home-feed-rail` 可内部滚动，但不得驱动主内容定位。点击筛选、打开/关闭 drawer 不得重置 `.home-feed-main.scrollTop`。
- 任意两列 / 三列网格子项必须保留 `min-width: 0`；会显示标题、摘要、标签、路径、代码的元素必须设置 `overflow-wrap: anywhere` 或明确的 `line-clamp`。
- 首页文章阅读必须通过 `.home-article-drawer` 克隆隐藏的 `.home-article-reader` 内容；完整文章页继续保留给 SEO、分享和深度阅读。
- `.home-article-toc` 只能 sticky 在 drawer 内部，不能脱离 drawer 覆盖 Feed。
- 首页卡片不允许新增绝对定位浮层作为主要信息容器；封面图层只能留在 `.home-feed-card__cover` 内，不能跨出父级。
- `.bookmark` 是唯一允许跨出 `.home-feed-card` 外边界的常驻视觉物件；卡片本体因此允许 `overflow: visible`，但封面、正文、标签、图表和媒体仍不得溢出内容区。
- hover 动效只允许 `translateY(-2px)` 或 `translateX(2px)` 级别，不得改变布局尺寸。
- 任何新增首页内容必须先抽象成 FeedItem 类型之一：`post`、`note`、`project`、`book`、`music`、`github`、`bilibili`、`update`。不要再恢复多模块堆叠首页。
- 图表、书架、音乐也必须作为 FeedItem 或详情页进入系统；不要另起首页模块堆叠。
- admin 页长表格、长日志、长路径只允许在 `.table-shell` / `.log-lines pre` / `.meta-grid code` 内换行或滚动；不得让 `.console-main` 横向溢出。
- 如果页面出现重叠，优先检查：网格最小列宽、`min-width: 0`、长文本换行、sticky 父容器、移动断点是否生效，而不是靠增大 z-index 盖过去。

#### 0.7.5.15b Homepage Feed / Drawer Contract

首页目标已经从“模块堆叠式工作台”改成“连续内容流”：

```txt
Profile Rail
+ Masonry-like Feed
+ Right Article Drawer
```

当前实现选择：

- 不新增 React / nanostores / masonry 依赖，先用 Astro 静态渲染、CSS columns 和原生 JS drawer/filter 保持发布链稳定。
- Feed 数据来自文章、札记、项目、书架、音乐、GitHub 快照、Bilibili 配置和更新卡片，统一在 `apps/web/src/pages/index.astro` 组装。
- 首页 Feed 卡片和左栏摘要入口统一使用右侧 `.home-article-drawer` 打开；不允许一部分类别跳页、一部分类别开抽屉。
- 文章 / 札记 / 项目 drawer 内正文来自 Astro 已渲染的 Markdown 内容，不再发起客户端 fetch。
- 书架、音乐、GitHub 图表、GitHub 仓库、Bilibili、更新卡片也必须先打开 drawer；drawer 顶部的“完整页面”链接再进入 `/github/`、`/books/`、`/music/`、`/evidence-library/` 或外部站点。
- 完整详情页仍保留：`/posts/[slug]/`、`/notes/[slug]/`、`/projects/[slug]/`、`/github/`、`/books/`、`/music/` 用于 SEO、分享和深度阅读。
- Bilibili 链接当前集中在 `apps/web/src/lib/profile.ts`；`bilibiliConfigured: false` 时不得进入首页 Feed、drawer 或首页 tabs，只能作为设置 / profile 配置待办存在，不伪造账号信息。

首页内容模型：

```ts
type FeedItem =
  | { type: "post"; drawerId: string }
  | { type: "note"; drawerId: string }
  | { type: "project"; drawerId: string }
  | { type: "book"; drawerId: string; href?: string }
  | { type: "music"; drawerId: string; href?: string }
  | { type: "github"; variant: "repo" | "heatmap" | "line" | "language" | "team"; drawerId: string; href?: string }
  | { type: "bilibili"; drawerId: string; href: string }
  | { type: "update"; drawerId: string; href: string };
```

交互硬规则：

- Filter 只隐藏 / 显示已有 Feed 卡片，不重建列表，不重置滚动。
- Drawer 打开时记录触发卡片和 `.home-feed-main.scrollTop`；关闭后恢复 scrollTop，再 focus 回到原卡片，且使用 `preventScroll`。
- Drawer 内 TOC 来自 Astro `render(entry).headings`，H2/H3 以内展示。
- 不把正文 HTML 通过 API 拉取，避免首页阅读依赖网络请求。
- 首页卡片内不得再放直接跳转的内链作为主要打开方式；主点击行为必须是 drawer，完整页只放在 drawer action。
- 以后如果接入 `@egjs/react-grid` 或 React Aria，必须保持同样的 FeedItem / drawer 语义，不得回到多模块堆叠。

#### 0.7.5.15c Visualization / Showcase Layer Contract

当前新的执行结论是：旧 GitHub 图表资产不应被 Feed 首页压缩掉，也不应恢复为旧 HomeWorkbench 多模块堆叠；它们应升级为独立的 Visualization / Showcase 层。

分层固定为：

```text
数据层：apps/web/src/data/
派生层：apps/web/src/lib/analytics.ts
展示层：apps/web/src/components/visualizations/ 和 apps/web/src/components/showcase/
```

当前已落地的 P0/P1 骨架：

```text
apps/web/src/lib/
├── analytics.ts
├── github.ts
└── profile.ts

apps/web/src/data/
├── books.ts
├── music.ts
└── github-overview.emptyinkpot.json

apps/web/src/components/visualizations/
├── ChartCard.astro
├── GitHubHeatmap.astro
├── GitHubMonthlyLine.astro
├── GitHubLanguageDonut.astro
├── GitHubRepoMatrix.astro
└── TeamSignalGraph.astro

apps/web/src/components/showcase/
├── BookCover.astro
├── BookshelfCard.astro
├── AlbumCover.astro
└── MusicCard.astro
```

页面层级固定为：

```text
首页 /            只放摘要、mini 图表、Feed 卡片和 Drawer
/github/          完整 GitHub 仪表盘
/books/           完整书架
/music/           音乐 / 歌单 / 专辑墙
/posts/[slug]/    文章完整阅读
右侧 drawer        快速阅读模式
```

图表实现规则：

- 热力图用 div grid 静态渲染，不新增图表库。
- 折线图用 SVG polyline 静态渲染。
- 语言 donut 用 CSS `conic-gradient`。
- 团队图第一版用静态关系图，不做复杂力导向图。
- 所有图表必须包进 `ChartCard`，不得在首页裸放。

Showcase 实现规则：

- 书架元数据继续用 `apps/web/src/data/books.ts` 作为唯一前台真源；需要长笔记时再升级 content collection。
- 音乐第一阶段用 `apps/web/src/data/music.ts`，图片约定放 `apps/web/public/images/music/`。
- 首页只放书架 / 音乐摘要卡片；主点击行为打开 drawer，完整内容通过 drawer action 进入 `/books/` 和 `/music/`。

#### 0.7.5.15c.3 Private Bookshelf / Reader Contract

`/books/` 当前升级为站内私人阅读系统入口，不再只是 Showcase 卡片页。边界固定为：

```text
MyBlog
├─ /books/          微信读书式书架：封面墙、分类、搜索、最近阅读
├─ /books/[id]/     书籍详情：元数据、OpenList 路径、进入 reader
├─ /reader/[id]/    在线阅读器：EPUB 用 react-reader，PDF 用 react-pdf
└─ /settings/       OpenList Base URL、书籍目录、阅读主题、最近阅读开关

OpenList
├─ /api/openlist/status         检查服务端 OpenList 连接与公开 root
├─ /api/openlist/get            读取单个文件信息，返回本站 raw 代理 URL
├─ /api/openlist/raw            代理真实文件流，供 reader / preview 使用
├─ /api/openlist/list           列出允许公开 root 内的目录
├─ /api/openlist/index          读取服务端文件索引
└─ /api/openlist/index/rebuild  递归扫描 OpenList，生成文件数据库
```

当前本机 OpenList 事实：

- 工程路径：`E:\My Project\OpenList`
- 服务器本机 HTTP：`http://127.0.0.1:5244`，前台不再直连该地址，统一通过 `blog.tengokukk.com/api/openlist/*` 代理。
- 已验证存储挂载：`/夸克网盘`
- 已验证 API：`POST /api/fs/list`、`POST /api/fs/get`
- `server/handles/fsread.go` 的 `FsGetResp` 包含 `raw_url`
- 不把 OpenList token、网盘 cookie 或其他 secret 写入 MyBlog 前端；私有鉴权与 raw 文件读取必须走 `apps/admin-next` 服务端代理。
- 文件数据库第一版写入 `public-data/openlist-index/files.json`；OpenList 负责文件存储，MyBlog/OpenList Index 负责语义索引，默认递归到 8 层并索引最多 50000 个条目。

书籍系统实现规则：

- 书籍文件源属于 OpenList；书名、作者、分类、标签、阅读状态、`sourceType`、`openlistPath` 属于 `apps/web/src/data/books.ts`。
- `openlistPath` 写绝对路径时直接使用该路径；写相对路径时拼接 `/settings/` 的 `openlistBooksPath`。Reader 默认调用 `/api/openlist/get` 与 `/api/openlist/raw`，不让浏览器直接访问 OpenList。
- 浏览器本地设置写入 `emptyinkpot-book-settings`；阅读主题继续同步 `emptyinkpot-reader-theme`，与首页 reader drawer 共用主题 token。
- 阅读进度写入 `emptyinkpot-book-progress:<id>`；最近阅读写入 `emptyinkpot-book-recent`。
- EPUB reader 使用 `react-reader`，其底层为 `epubjs`；PDF reader 使用 `react-pdf`，其底层为 PDF.js。
- PDF.js worker 当前使用 React-PDF 支持的 HTTPS CDN worker URL，避免线上 Nginx 对 `.mjs` worker 的 MIME 配置影响 reader。
- `/books/` 的视觉目标是“个人书架 / 阅读状态”，不是后台控制面；导航仍由顶部 Feed tabs 和详情页入口承担。

首页硬规则追加：

- 首页只保留一个主 Feed。
- 图表、书籍、音乐都是 FeedItem。
- 左栏只放摘要，详情页放完整内容。
- 不再把 GitHub 热力图、折线图、语言分布、团队信号作为独立首页模块堆叠回去。

#### 0.7.5.15c.1 Project Studio / 项目工坊 Contract

`/projects/` 不再只是项目链接列表；当前目标是把它升级为 `Project Studio / 项目工坊`，与 `/books/`、`/music/`、`/github/`、`/knowledge/` 并列，承担项目、仓库、模块、Wiki 与协作记录的统一入口。

`/projects/[slug]/` 当前进一步升级为 `Project Workbench`：GitHub repo 工作台 + Obsidian 式左侧导航 + NapCat 式应用壳 + Heritage 视觉气质。它不是普通博客详情页，而是打开后可以进入 Wiki、Timeline、Issues、Commits、Contributors 的项目工作区。

页面分类：

| 路由 | 页面模式 | 职责 |
| --- | --- | --- |
| `/projects/` | list / dashboard | 项目工坊首页；展示项目卡片网格、项目状态、GitHub 信号和最近项目动态 |
| `/projects/[slug]/` | app workspace / project-workbench | 单个 GitHub 项目工作台；展示 GitHub 状态栏、Wiki 编辑器、Timeline、Modules、Issues、PR、Commits、Contributors、Graph |

现行实现边界：

- 当前实现仍基于 Astro content collection：`apps/web/src/content/projects/*.md`。
- GitHub 协作信号以 `apps/web/src/data/github-overview.emptyinkpot.json` 和 `apps/web/src/lib/github.ts` 作为构建期兜底；生产站通过 `/api/github/*` 运行时覆盖 repo、issues、pulls、commits、contributors 等状态。
- `apps/web/src/lib/projects.ts` 负责把项目 frontmatter 与 GitHub snapshot 合成为 `ProjectStudioView`。
- GitHub 第一阶段只作为协作后端和编辑入口：Wiki 条目使用 GitHub edit URL；不在站点内伪造多人编辑后台。
- Decap CMS、TinaCMS、Outline、Wiki.js 是后续增强方向；未接入前不得写成已落地事实。

项目内容模型：

```ts
type ProjectFrontmatter = {
  title: string;
  description: string;
  type: "game" | "tool" | "open" | "site" | "archive";
  status: "planned" | "active" | "paused" | "archived";
  progress: number; // 0-100
  date?: Date;
  stack: string[];
  repo?: string;
  demo?: string;
  modules: Array<{
    id?: string;
    name: string;
    status: "planned" | "draft" | "in-progress" | "done" | "paused";
    progress: number;
  }>;
  wiki: Array<{
    title: string;
    path: string;
    summary?: string;
    type: "overview" | "world" | "faction" | "character" | "card" | "system" | "doc";
  }>;
  milestones: Array<{
    title: string;
    date?: Date;
    summary?: string;
  }>;
};
```

推荐外部 GitHub 项目仓结构：

```text
repo/
├─ README.md
├─ project.json
├─ wiki/
│  ├─ index.md
│  ├─ world.md
│  ├─ factions.md
│  ├─ characters/
│  └─ cards/
├─ data/
│  ├─ modules.json
│  ├─ cards.json
│  └─ timeline.json
└─ assets/
   └─ covers/
```

Project card contract：

- MUST 显示 type bookmark、项目名、description、status/date、progress、modules/issues/contributors、stack tags 和 actions。
- MUST 使用 Heritage project 语义色：`#2f5d50`；卡片背景保持白色，边界使用 `#cbbda9`。
- MUST 提供“进入项目空间”；有 `repo` 时提供 GitHub 外链。
- MUST 在长标题、长路径、长标签下保持 `min-width:0` 与可换行，不得撑破两列网格。
- FORBIDDEN：卡片内嵌卡片、营销 hero 风、随机渐变、客户端 live GitHub fetch、把 GitHub API 失败变成页面失败。

Project Workbench workspace contract：

```text
/projects/[slug]/
├─ Fullscreen App Shell：隐藏全站 chrome，页面自身承担导航、状态与工作区
├─ Left Sidebar：品牌锚点、图标导航、当前态、API / GitHub 写入说明
├─ Main Workspace
│  ├─ Sticky Statusbar：breadcrumb/repo、branch、updated、issues、PR、contributors、API badge、actions
│  ├─ Work Panels：Wiki Editor、Timeline、Modules、Issues、PR、Commits
│  └─ Pending States：API 未接入时显示真实 pending，不伪造成功
└─ Right Inspector：contributors、wiki files、mini graph
```

NapCat-derived visual contract：

- MUST 使用 app-shell 思维：页面高度为 `100dvh`，左侧、主区、右侧各自滚动；移动端再降级为普通流。
- MUST 使用左侧品牌锚点 + 图标化导航：导航项需要有短 icon marker、当前态、hover 位移和 active 状态，不只是文字列表。
- MUST 使用 sticky 顶部状态栏：它承担面包屑 / repo context / status metrics / action buttons，不再放超大宣传标题。
- MUST 使用高密度工作面板：Wiki、Timeline、Modules、Issues、PR、Commits 都是可操作面板；一屏必须看到多个状态或操作。
- MUST 使用受控 frosted panel：仅 app shell、sticky statusbar、work panel、inspector section 可使用 `backdrop-filter`；不要把整站所有卡片都变成玻璃。
- MUST 保持 Heritage 语义色：主色 `--heritage-green`，系统提示 `--heritage-purple`，风险 `--heritage-red`，强调 `--heritage-gold`；不要照搬 NapCat 粉蓝主题。
- MUST 保持 Astro 静态前台：当前不引入 HeroUI、React Router 或全量 dashboard 框架；React / motion 只能作为局部 island 能力，NapCat 只提供布局和状态语言。
- FORBIDDEN：直接复制 NapCat 源码、照搬 NapCat 品牌 / 文案 / 主题、引入不必要前端依赖、用毛玻璃掩盖信息稀疏、把项目页退回营销 hero。

#### 0.7.5.15c.2 Mature Template Increment Contract

本轮新方向不是继续手搓所有页面，而是把 MyBlog 拆成“成熟模板 + 动效库 + GitHub CMS + 少量缝合代码”。执行方式必须是增量改造，不能破坏现有 Heritage 色彩、内容真源和静态发布链路。

当前已落地的事实：

- `apps/web` 已接入 `@astrojs/react`，允许在 Astro 页面中使用 React islands 和客户端 hydration。
- `apps/web` 已安装 `react`、`react-dom`、`cmdk`、`lucide-react`、`motion`，作为项目工坊、设置页和未来动态首页的最小 React 交互基座。
- `/projects/[slug]/` 已新增 `ProjectWorkbenchCommand` React island，提供 `Ctrl/Command + K` 命令面板；它只跳转到现有锚点或 GitHub edit 外链，不写 GitHub、不伪造 API。
- 当前尚未初始化完整 `shadcn/ui` 组件目录，尚未接入 TinaCMS / Decap CMS，尚未接入 React Flow；这些仍是后续阶段。

成熟模板分层：

| 层 | 当前边界 | 后续推荐 |
| --- | --- | --- |
| 前台展示 | Astro content collections，Heritage 主题，静态构建 | 继续保留 Astro；首页可逐步引入 Magic UI / Motion Primitives 风格的 React islands |
| 项目工坊 / 工作台 | Astro 页面 + React command island + 静态 GitHub snapshot | 逐步迁移工作区内部控件到 React + shadcn/ui 范式 |
| 设置页 | Astro + 原生 JS 写入 localStorage token | 后续用 React + shadcn form / slider / switch / tabs 重构，但必须沿用现有 visual settings key |
| 内容编辑 | GitHub edit fallback | P1 选 Decap CMS 或 TinaCMS；P2 再做自有 API commit |
| 世界观 / Graph | 静态 SVG / 确定性预览 | 世界观编辑用 React Flow；知识探索用 Cytoscape / force graph |

Template source policy：

- 可参考 Astrofy、Astro themes、shadcn dashboard templates、Magic UI、Aceternity UI、Motion Primitives、TinaCMS、Decap CMS、Outline、Wiki.js。
- 只允许吸收布局范式、组件合同、交互模式和源码组织方式；不得整段复制外部项目源码进本仓。
- 任何 template block 进入 MyBlog 前，都必须改写成 MyBlog token：`--heritage-green`、`--heritage-purple`、`--heritage-red`、`--heritage-gold`、`--heritage-bg`、`--heritage-card`。
- 不允许为了“模板感”改掉中文 UI、内容真源、README truth layer、部署链路或 GitHub token 安全边界。

React island contract：

- React islands 只用于 app-like 交互：命令面板、tabs、table、form、drawer、toast、settings preview、graph editor。
- 文章正文、普通列表页、RSS、sitemap、content collection 渲染继续优先使用 Astro。
- 每个 React island 必须有明确边界：输入 props、输出 DOM、是否触发 API、失败/空态行为。
- 所有可写操作默认 pending，只有服务端 API / CMS 接入后才能把按钮改成真实写入。
- 禁止把 GitHub token、Tina token、OAuth secret 或 CMS secret 放进客户端 island。

shadcn/ui 增量规则：

- 以后初始化 shadcn 时，优先在 `apps/web` 内执行，不能新开并行前台项目。
- 只允许按需添加组件：`button`、`card`、`tabs`、`table`、`dialog`、`sheet`、`command`、`form`、`input`、`textarea`、`badge`、`tooltip`、`dropdown-menu`、`toast`、`progress`、`separator`、`scroll-area`。
- shadcn 默认主题必须被 Heritage wrapper 覆盖；不要引入蓝紫渐变、纯 SaaS 灰白或一键主题色覆盖整站。
- `cmdk` 当前承担 Command Palette 基座；未来 shadcn `command` 必须复用或替换这个边界，不能并存两套命令面板。

CMS 增量规则：

- Decap CMS 适合最小 GitHub-backed 内容编辑。Decap 官方说明其 GitHub backend 需要 GitHub auth，并通过 GitHub API 读取和更新仓库内容；所以生产接入必须配置 OAuth / Git Gateway / 自托管 auth proxy。
- TinaCMS 适合可视化编辑与 Markdown / MDX / JSON 内容模型。Tina 官方说明其内容以 Markdown、MDX、JSON 文件形式存储在 Git 中；接入前必须明确它编辑哪些 collection，不得接管整个仓。
- P0 继续使用 GitHub edit fallback。
- P1 先选一个 CMS，不要 Tina 和 Decap 同时接。
- P2 自有 API commit 只能放在服务端边界，不能放进 Astro 静态前台。

Reality Pass / 闭环修复规则：

当前阶段不再优先新增 UI、动效或页面入口，而是把已有功能从 `Content OS Mockup` 收敛为 `Content OS Runtime`。所有工作按闭环优先级排序：

```text
P0：项目工作台 GitHub 写入
P1：视觉素材持久化
P2：统一搜索索引
P3：Graph 数据化 / 可编辑化
P4：贴纸 / 印章跨页面统一
P5：书架 OpenList 体验兜底
P6：Bilibili 配置或隐藏
P7：设置页本地模式 / 后台连接边界
```

Reality Pass 禁止事项：

- 不新增新的手账卡片样式、新 Banner 动效、新贴纸视觉样式或新占位模块，除非它直接关闭上述 P0-P7 的某个闭环。
- 不把 localStorage demo 写成 CMS，不把静态 GitHub snapshot 写成实时同步，不把 API pending 写成已连接。
- 不在 Astro 静态前台暴露 `GITHUB_TOKEN`、CMS secret、OpenList token 或任何写入凭据。
- 不在 API 未接入时请求不存在的 endpoint 制造 404，也不把失败写入 localStorage 当成功。

Reality Pass 当前源码对齐：

- Project Workbench 顶部必须显示真实连接状态；`data-github-api-ready="true"` 时通过 `/api/github/repo`、`/api/github/issues`、`/api/github/pulls`、`/api/github/commits`、`/api/github/contributors` 运行时同步，失败时保留构建期兜底。
- `2026-05-05` 起，生产 `blog.tengokukk.com/api/` 已代理到 `myblog-admin-next.service`，GitHub API 写入边界为 `apps/admin-next`；项目页已接入 live fetch，Wiki 与 Timeline 写入继续通过服务端 API commit 到 GitHub。
- `/settings/` 必须说明“外观偏好 / 内容端口”为当前浏览器本地模式，并列出 GitHub API、CMS、Visual Upload、OpenList 的连接状态。
- `/visuals/` 当前 `emptyinkpot-visual-items` 仍是本地素材编辑器；接 API 前只允许导出 JSON 或手动合入 `apps/web/src/data/visuals.ts`。
- `/search/` Pagefind 与首页 overlay 的分裂必须在 P2 收口；P2 前不得声称本地贴纸、印章、高亮已经进入 Pagefind。
- `/knowledge/` 当前是静态 SVG + localStorage 节点注入；P3 前不得声称它是 React Flow / Cytoscape 级可编辑图谱。
- `bilibiliConfigured: false` 时首页不展示 Bilibili 占位卡片或 tab。

动效增量规则：

- 首页可逐步引入 Marquee、NumberTicker、ScrollReveal、FilmGrain，但不得恢复 Dashboard / Bento 大入口卡；每次只引入一种页面级能力。
- 动效必须尊重现有 `graphMotion` / motion settings；未来 settings 应统一增加“动效强度” token。
- 动效不可遮挡内容、不可影响首屏可读性、不可制造横向溢出。

Homepage implementation contract：

- `/` 是 `Content OS Home`，不是营销 landing，也不是项目工作台详情页。
- MUST 保留 Banner，并把 Banner 作为首页情绪层；Banner 可展示轻量 metrics，但不得退化为 Dashboard。
- MUST 删除首页顶部 Dashboard / Bento 大卡片区：不得恢复 Project Studio、GitHub、Knowledge、Books、Music 这类首屏大入口卡，也不得恢复装饰性进度条。
- MUST 使用 `.home-quickbar` 替代 Dashboard：QuickBar 只承载 Command、项目工坊、知识图谱、书架、视觉素材、GitHub、搜索、设置等轻量入口，不承载正文内容或大块数据。
- MUST 让 Feed 成为主角：桌面结构为 `.home-feed-main` 主列 + 右侧 `.home-feed-rail` 辅助栏，侧栏弱化为 Profile / Reading Memory / Mini Graph，不再承担导航或统计 Dashboard。
- MUST 按 NapCatQQ 的侧栏原则处理首页右栏：外层 `.home-feed-rail` 是唯一承载边框、背景、阴影和受控 blur 的连续面板；内部 `.home-feed-profile` / `.home-feed-rail-card` / stats 只能是轻量 section 或 row，使用分隔线、弱 hover 背景和轻位移反馈，不允许卡片套卡片、统计盒子网格或厚重内边框。
- MUST 在主区首屏展示动态 Hero 指标：posts、repos、projects、knowledge nodes；数字可用 React island ticker，但必须在低动效偏好下直接显示最终值。
- MUST 维持书籍唯一真源：书籍元数据只来自 `apps/web/src/data/books.ts` 的 `books: BookItem[]`，首页 Feed、书架页、书籍详情页、Reader、Knowledge 搜索和图谱都必须使用 `book.id` 作为节点 ID 与路由 ID，不得再用 `book.title` 派生第二套 ID。
- MUST 在首页顶部 Feed tabs 中把“书架”实现为 `data-feed-filter="book"` 的首页内筛选，不得直接链接到 `/books/`；`/books/` 作为完整书架页，只从 drawer action、Command Palette 或明确的“完整书架”入口进入。
- MUST 在首页 Feed 保留具体图书卡片；图书卡片必须展示书籍封面，点击打开阅读 drawer，drawer 内必须同时提供 `书籍详情`（`/books/[id]/`）、`开始阅读`（`/reader/[id]/`）和 `完整书架`（`/books/`）。
- MAY 使用全站 Hover Preview 交互层：内容卡可以通过 `data-hover-preview` 暴露预览数据；hover 只负责快速预览，click 仍负责打开 drawer 或明确跳转。
- Hover Preview MUST 默认关闭，并由设置页 `交互实验 / 启用 Hover 预览浮层` 控制；启用后必须 portal 到 body，并具备延迟打开、延迟关闭、跟随鼠标、viewport flip/shift 避让。当前实现使用 `@floating-ui/react` + `motion/react`，不得退回被父容器 overflow 裁剪的局部绝对定位。
- MUST 将首页 Feed 卡片进一步收口为“手账风卡片系统”：不得使用紫/绿硬竖线作为主要视觉语义；卡片语义色必须转为纸张压痕、照片/书封倾斜、CSS 回形针、印章/贴纸等真实物件隐喻。
- MUST 避免在 Feed 卡片系统里使用大面积渐变；Heritage 模式下卡片、mark 区和压痕应以纯色、半透明色、边框、阴影和材质关系表达层级。
- `.home-feed-card` 在 Heritage 模式下必须保持纸张卡片：`border: 1px solid var(--heritage-line-strong)`、纯色纸面、`::before` 纸张压痕、`.card-paperclip` 夹纸结构；`.bookmark` 语义标签保留原先书签/折角形状，不改成胶带条。
- `.card-paperclip` 必须使用 Bootstrap Icons `paperclip` 开源 SVG 轮廓作为图形源，锚定在卡片右上边缘并与卡片边框重叠；不得手搓脱位线圈、可见色块贴片，或只画一个浮在卡片表面的图标框。
- 图文/书籍卡片的封面必须像夹入卡片的照片或书页：有纸白边、轻阴影、轻微旋转和 hover 微动；视觉素材卡仍可保留沉浸媒体，但不能恢复纯 UI 色条。
- MUST 使用 Activity Marquee 展示最近文章、项目进度、GitHub 更新、书架、音乐、Knowledge 状态；它只能横向展示短句，不承载正文内容。
- MUST 在首页提供全站 Command Palette，键盘入口是 `Ctrl/Command + K`，可见 QuickBar 按钮只显示“全局检索”；快捷键规则必须收纳进旁边的 `?` 帮助按钮，不在主按钮上展示 `Ctrl K` 文案。
- MUST 继续保留原有 Feed、阅读 drawer、本地高亮、批注、印章、搜索层和设置联动。
- FORBIDDEN：恢复首页 Dashboard / Bento 大卡片、把首页改成单屏 hero、删除 feed、删除阅读记忆系统、用全屏粒子/光束遮挡内容、引入横向滚动、照搬 Magic UI / Aceternity 默认主题。

参考来源：

- Astro React integration：`https://docs.astro.build/guides/integrations-guide/react/`
- shadcn Vite / existing project setup：`https://ui.shadcn.com/docs/installation/vite`
- cmdk command menu：`https://github.com/pacocoursey/cmdk`
- TinaCMS docs：`https://tina.io/docs`
- Decap CMS GitHub backend：`https://decapcms.org/docs/github-backend/`

Project Workbench implementation contract：

- MUST 在 `projects/[slug].astro` 使用 `BaseLayout hideSiteChrome appMode`，隐藏全站 SiteHeader / SiteFooter，让项目页成为应用工作台。
- MUST 使用 `.project-workbench` 作为详情页根 class；`.project-os` / `.project-space` 只保留为旧样式兼容，不再作为目标实现。
- MUST 使用左侧 `.project-workbench__sidebar` 承载导航，主区 `.project-workbench__main` 是主要滚动工作区，右侧 `.project-workbench__inspector` 承载贡献者、Wiki 文件和 Graph 辅助信息。
- MUST 使用 NapCat 式 panel density：允许顶栏、面板、右侧 inspector section 使用 8px radius、轻阴影、半透明背景与受控 blur；禁止卡片套卡片和展示页堆卡片。
- MUST 保留 `/projects/` 作为入口列表；不要把列表页也强行做成全屏应用。
- MUST 保留 Astro 静态主链路。Project Command 可用 React island；Wiki / Timeline 编辑器和 GitHub runtime sync 使用原生局部 JS 调用服务端 API。
- MUST 明确浏览器前端不能直接安全写 GitHub。所有写入必须经过服务端 API 中间层，不得把 token 暴露给前端。
- Wiki 保存按钮调用 `/api/github/file/save`；失败时显示 warning，不得伪造成功。
- Timeline 保存按钮调用 `/api/projects/[slug]/timeline`，目标是后端更新仓库 `data/timeline.json`；当前公开静态站不写 localStorage。
- 当前生产项目页根节点使用 `data-github-api-ready="true"`；未配置 repo 或 API 失败时只做局部降级，不请求不存在的 endpoint，不把失败当成功。
- GitHub 状态栏、Issues、PR、Commits、Contributors 当前由 `/api/github/*` 运行时覆盖；构建期 snapshot 只作为首屏 fallback。
- Graph 第一版是确定性静态预览；不得引入随机力导向布局。
- FORBIDDEN：在 Project Workbench 内恢复全站顶部导航、超大宣传标题、重复卡片容器、后台表单按钮感、大面积渐变、客户端直连 GitHub 写入、用假数据冒充 PR / commit / issue 列表。

Required API contract for GitHub write-back：

```text
GET  /api/github/repo?repo=owner/name
GET  /api/github/commits?repo=owner/name
GET  /api/github/issues?repo=owner/name
GET  /api/github/pulls?repo=owner/name
GET  /api/github/contributors?repo=owner/name
POST /api/github/file/read
POST /api/github/file/save
POST /api/projects/[slug]/timeline
```

`POST /api/github/file/save` body：

```json
{
  "repo": "emptyinkpot/project-vita",
  "path": "wiki/index.md",
  "content": "markdown",
  "message": "更新 Wiki：wiki/index.md"
}
```

`POST /api/projects/[slug]/timeline` body：

```json
{
  "title": "完成世界观 Wiki 初稿",
  "body": "补充阵营、角色和卡牌基础设定。",
  "repo": "emptyinkpot/project-vita"
}
```

后端规则：

- API 必须运行在 `apps/admin-next`、独立 serverless 函数或其他服务端边界，不能放在静态 Astro 前端里假装可用。
- 当前源码已在 `apps/admin-next/app/api/github/**` 和 `apps/admin-next/app/api/projects/[slug]/timeline/route.js` 落地最小 route handlers；生产 `blog.tengokukk.com/api/` 已代理到 admin-next，是否可写取决于服务器环境中的 `GITHUB_TOKEN` / `GH_TOKEN`。
- 当前生产运行态：`myblog-admin-next.service` 监听 `127.0.0.1:4117`，nginx `blog.tengokukk.com/api/` 代理到该服务；服务端环境文件为 `/etc/myblog-admin-next.env`。
- `GITHUB_TOKEN` 只能存在服务端环境变量。
- 写文件前必须读取当前文件 SHA，再调用 GitHub contents API 创建 commit。
- Timeline 持久化文件固定为项目仓库 `data/timeline.json`。
- 失败时前端必须显示明确失败状态，不能把失败写进 localStorage 当成功。

状态规则：

- loading：静态构建页不显示全页 skeleton；GitHub runtime sync 只在局部指标、列表和状态徽标显示 loading，不阻断项目正文。
- empty：无项目时 `/projects/` 显示添加 `apps/web/src/content/projects/` 条目的提示；模块、时间线缺失时显示局部空态；Issues / PR 没有 live 数据时显示真实 empty，不伪造列表。
- error：缺失 repo 或 snapshot 未匹配时页面降级为手动项目空间；API 读取或写入失败时显示明确失败状态，并保留构建期 fallback。

升级路线：

| 阶段 | 能力 | 约束 |
| --- | --- | --- |
| P0 | Project Studio 入口、Project Workbench 详情、GitHub edit links、构建期 fallback、Wiki / Timeline 编辑器 | 已落地；不伪造写入 |
| P1 | `/api/github/*` 与 `/api/projects/[slug]/timeline`，GitHub repo / commits / contributors / issues / PR runtime sync | 已开始落地；页面内编辑通过服务端 API commit 到 GitHub |
| P2 | Decap CMS / TinaCMS / Outline / Wiki.js、Project Graph | 需要 API 保护 GitHub token，不允许前端直连写入 |
| P3 | Project Graph 与 Knowledge Graph 深联动、成员权限、PR / diff / 版本历史 | 使用统一 Knowledge Index，不引随机力导向 |

AI / implementation checklist：

1. 先判断页面是 `/projects/` list/dashboard 还是 `/projects/[slug]/` app workspace / project-workbench。
2. 复用 `projects` content collection 和 `buildProjectStudioView()`，不得在页面内重复解析 repo、wiki、timeline。
3. 优先提供 GitHub snapshot fallback；运行时只允许请求本站 `/api/github/*` 中间层，不允许前端直连 GitHub token。
4. `/projects/` 使用 `.project-studio-*`；`/projects/[slug]/` 使用 `.project-workbench*`。不要把 `.project-space` 或 `.project-os` 当作新目标。
5. 每个新增字段必须同步 `apps/web/src/content.config.ts` 与 README 内容模型。
6. 发布前必须跑 `npm run lint`、`npm run check`、`npm run build`，并验证 `/projects/`、`/projects/[slug]/` 和首页 `项目工坊` filter。

#### 0.7.5.15d Knowledge Layer / Reader System Contract

这次新方向不是“再加几个 UI 功能”，而是把首页和阅读抽屉升级为一个轻量 `Knowledge Layer`。核心判断固定为：

```text
Highlight = 记忆点
Search = 入口
Graph = 结构
Bookmark Object = 可触摸的内容隐喻
Reader Drawer = 临时展开的书页
```

当前第一版仍保持 `Astro 静态构建 + 客户端 localStorage`，不引入后端，不把搜索、标记、图谱拆成三套孤岛。

当前落地文件：

```text
apps/web/src/lib/knowledge/
├── anchors.ts       三锚点 Highlight 基础：quote / position / dom path
├── graph.ts         radial graph 布局
├── search.ts        无依赖搜索 fallback
├── storage.ts       reader history / bookmarks / highlights / annotations key 与纯函数
└── types.ts         KnowledgeSearchDoc / HighlightRecord / GraphNode 等类型

apps/web/src/pages/
├── data/knowledge-index.json.ts   静态知识索引
└── knowledge/index.astro          Knowledge Graph 页面
```

首页已对齐的 Reader v1 能力：

- Feed 卡片使用真实 `Bookmark Object` 视觉隐喻：书签从卡片顶部插入，不再只是 UI 标签。
- 书签颜色语义固定：post 紫、project/GitHub 绿、note/book 红、music 金。
- 标题颜色跟随书签语义色，视觉识别由颜色完成。
- `Cmd/Ctrl + K` 打开 Knowledge Search Overlay；首页也提供搜索按钮。
- Search 同时搜索 Astro 渲染的 drawer 内容、书架、音乐、GitHub 和本地 highlight。
- `J / K` 浏览可见 Feed 卡片，`Enter` 打开当前卡片 drawer，`Esc` 关闭 drawer 或搜索。
- Reader Drawer 保存阅读历史到 `emptyinkpot-reading-history`。
- Reader Drawer 必须把 `emptyinkpot-reading-history` 升级为 Reader Memory：每条记录至少保存 `id/title/href/timestamp/lastReadAt/scrollTop/progress`，再次打开同一 drawer 时恢复 `scrollTop`，滚动时节流写回 `progress`，首页侧栏和 Drawer 记忆面板都要显示最近阅读进度。
- Reader Drawer 支持收藏到 `emptyinkpot-reader-bookmarks`。
- Reader Drawer 支持 `light / sepia / dark` 三种阅读主题，存储键为 `emptyinkpot-reader-theme`。
- Reader Drawer 支持选中文本后保存本地 highlight 到 `emptyinkpot-reader-highlights`；当前恢复已经使用 `quote / position / dom path` 三锚点，旧的 exact-only 记录仍可用 quote fallback 恢复。
- Reader Drawer 打开时会生成折叠态 Reader Memory Panel：默认只显示“阅读记忆”入口，展开后显示最近阅读、收藏、标记，点击可直接回访对应 drawer 或标记位置。
- Search 的本地 highlight 结果会携带 `highlightId`，点击后打开对应 drawer 并滚动聚焦到具体标记。
- 如果内容变更导致三锚点都无法定位，drawer 顶部显示 orphan highlight 提示，不静默丢失本地记录。
- Seal System 使用 `emptyinkpot-reader-seals` 保存卡片 / 文章印章；`selected / important / insight / unfinished / reread / archive / done / canon` 表达人工判断。
- Seal Definition 使用 `emptyinkpot-seal-definitions` 作为后续自定义印章入口；默认定义集中在 `apps/web/src/lib/knowledge/seals.ts`，页面不得再各自硬编码一套印章表。
- Search 会把本地 seal 作为 `type: "seal"` 的结果纳入统一入口；Graph 页面提供 seal 类型节点，并在浏览器端读取本地印章记录，把真实盖章对象连回对应内容节点。
- Visual Knowledge Layer 使用 `apps/web/src/data/visuals.ts` 保存视觉素材节点；`visual` 是和 post / project / book / music 并列的一等内容类型，不允许退化成普通 `<img>`。
- `/visuals/` 展示视觉素材墙；首页 Feed 可插入 `.visual-feed-card`，点击后仍走 Reader Drawer，而不是跳出当前阅读流。
- Visual 节点必须进入 Search 和 Graph：Search type 为 `visual`，Graph 节点 id 为 `visual:<id>`，并通过 tags / related 连接文章、项目、书架和其他视觉素材。
- Drawer 顶部有阅读进度条，关闭后继续遵守 scrollTop 恢复规则。

Highlight 工程合同：

```ts
type HighlightAnchor = {
  quote: TextQuoteSelector;
  position: TextPositionSelector;
  dom: DomPathSelector;
  contentHash: string;
};
```

恢复顺序固定：

```text
contentHash 相同 -> TextPositionSelector
TextQuoteSelector exact/prefix/suffix
DomPathSelector
fuzzy quote fallback
orphan highlight
```

当前 v1 已有 `anchors.ts` 基础实现；首页内联脚本已按同一三锚点顺序执行恢复。后续如果把首页脚本拆成 island，应直接复用 `anchors.ts`，不能退回只存纯文本。

Reader Knowledge Engine 合同：

```text
阅读正文
-> 精准高亮
-> 生成记忆节点
-> 进入 Search
-> 进入 Graph
-> Graph 反向打开 Reader 并定位到高亮
```

- Highlight 是记忆，Search 是入口，Graph 是关系；三者必须使用同一批 Knowledge contracts，不得各自发明数据结构。
- 高亮保存必须至少包含 `quote / position / dom / contentHash` 三锚点；恢复顺序固定为 `position -> quote -> dom -> fuzzy quote -> orphan`。
- orphan highlight 不删除；Reader 顶部显示无法定位的原文摘录，后续再提供重新定位 / 删除 / 保留操作。
- `ReaderCommand` 是 Reader / Search / Graph 的统一命令协议：`openArticle`、`openHighlight`、`searchTag`、`focusGraphNode`。
- 本地第一版使用 URL 参数和 `CustomEvent("reader-command")` 实现：`/?reader=post:id`、`/?reader=post:id&highlight=...`、`/?searchTag=...`、`/knowledge/?focus=post:id`。
- Reader Drawer 内的 `.reader-mini-graph` 是当前文章的局部知识网络：当前文章、最多 3 条强关联、最多 3 个 tag、最多 3 条本地 highlight / annotation。
- Graph 页面读取 `emptyinkpot-reader-highlights` 后可把本地 highlight 注入为图谱节点；点击 highlight 节点回到 Reader 并滚动到对应 mark。
- Graph 页面读取 `emptyinkpot-reader-annotations` 后可把本地 annotation 注入为图谱节点；annotation 优先连接对应 highlight，缺失时连接 article。
- `/knowledge/` 点击 article / note / project 节点进入 Reader；点击 tag 节点进入首页 Search；collection / seal 节点保留 Inspector 行为。

自动关系生成规则：

```text
同 tag -> related
同 series -> strong related
正文链接到另一篇 -> linked
标题 / 摘要关键词重合 -> semantic related
同类型内容 -> weak related
```

- 第一版使用确定性规则，实现在 `apps/web/src/lib/knowledge/relations.ts`，不引 AI、不引 embedding。
- `score >= 4` 才保留关系；每个节点最多保留 8 条 related edge，防止 Graph 变成毛线团。
- Drawer 底部“继续阅读”和 Graph 的 related / linked edge 必须复用同一个关系评分模块。

Search 工程合同：

```text
build: content collections / books / music / github snapshot
  -> /data/knowledge-index.json
client: index docs + local highlights
  -> Search Overlay
```

第一版不引 FlexSearch；当前用无依赖搜索，避免为了搜索引入新的 React island。后续如果引 FlexSearch，只能替换 `lib/knowledge/search.ts` 的搜索引擎，不得改变 `KnowledgeSearchDoc` 数据合同。

Graph 工程合同：

Graph 不做随机力导向毛线团。默认布局是：

```text
Level 0: self / emptyinkpot
Level 1: collections
Level 2: content nodes
Level 3: tags / highlights / seals
```

当前 `/knowledge/` 使用 `buildRadialGraph()` 做静态 radial SVG。后续如果引 `react-force-graph`，仍必须保留 `KnowledgeGraphNode` / `KnowledgeGraphLink` 的语义分层。

Bookmark Object 视觉合同：

- `.bookmark` 是“物件”，不是普通 tag。
- 书签必须从卡片顶部伸出，模拟插入纸页。
- 书签必须使用 clip-path 做底部缺口。
- 卡片必须 `overflow: visible`，允许书签露出。
- hover 只能轻微拉直书签，不允许卡片大幅漂浮。

#### 0.7.5.15e Home IA Refactor Contract

首页信息架构固定为：

```text
侧栏 = 你是谁 / 阅读记忆 / 小型知识状态
顶部 = 你在看什么
中间 = 内容流
```

核心原则：

- 主导航只能有一个，且只能在 `.home-feed-toolbar` 的 `.home-feed-tabs` 内。
- `.home-feed-rail` 不再承载站点导航，不得恢复文章 / 札记 / 项目 / GitHub / 书架 / 音乐的左侧按钮矩阵。
- `.home-feed-rail` 只放 Profile、Reading Memory、Mini Graph；不得恢复 Signals 统计卡、Quick Actions 按钮组、GitHub 热力图和小柱状图。
- `.home-quickbar` 是 Dashboard 替代物，只能是轻量横向入口；不得承载大标题、大摘要、进度条或多行数据。
- 顶部 tabs 使用轻量标签式视觉，不做厚边框、重阴影、胶囊按钮组。
- 导航 = 横向；阅读/状态 = 侧栏；内容 = Feed。

当前源码落点：

```text
apps/web/src/pages/index.astro
├── .home-feed-main
│   ├── .home-hero-banner
│   ├── .home-quickbar
│   ├── .home-activity-marquee
│   ├── .home-feed-toolbar
│   └── .home-feed-grid
├── .home-feed-rail
│   ├── .home-feed-profile
│   ├── .home-feed-memory
│   └── .home-feed-stats
└── .home-feed-toolbar
    └── .home-feed-tabs
```

左侧状态数据规则：

- Reading Memory 从 `emptyinkpot-reading-history` 读取最近阅读。
- Knowledge Stats 从 `emptyinkpot-reader-highlights`、`emptyinkpot-reader-annotations`、`emptyinkpot-reader-bookmarks` 和 `emptyinkpot-reading-history` 读取计数。
- 侧栏本地状态只读 localStorage，不改变内容源、不写后端。

下一步优先级：

```text
P0 done:
- Bookmark Object
- Reader local history/bookmark/highlight v1
- Search Overlay v1
- Knowledge index endpoint
- Static Knowledge Graph page

P1 done:
- 首页 highlight 恢复切到 anchors.ts 三锚点
- orphan highlight UI
- Reader Memory Panel：最近阅读 / 收藏 / 标记
- Search 结果支持跳转到具体 highlight

P2 partial:
- Graph hover/click 交互
- Graph cluster/type 过滤
- Graph Inspector：标题、类型、分区、meta、打开入口
- Reader Knowledge Engine：`relations.ts` 确定性关系评分、Reader mini graph、Graph/Reader URL 命令联动
- Graph 本地 highlight / annotation 节点注入：读取 `emptyinkpot-reader-highlights` 和 `emptyinkpot-reader-annotations` 后生成本地记忆 node，并反向打开 Reader 定位
- Seal Palette：卡片 / 当前文章盖章
- Seal 结果进入 Search；Seal 类型节点进入 Graph
- Reader Memory Panel 默认折叠为浮层，不再打断正文流
- Drawer 文章底部 Related 继续阅读

P2 remaining:
- FlexSearch 或等价搜索引擎
- 高亮精准重定位和重绑 UI
- Graph 默认限量节点继续维持当前 slice 策略；后续如内容量扩大，再把限量策略抽到 `lib/knowledge/graph.ts`
- AI 摘要、主题聚类、知识缺口提示
```

#### 0.7.5.15f Frontend Reproduction Checklist

如果把本仓交给另一个开发者复刻当前前台，不应只看截图，应按以下顺序验收：

1. 获取源码：`git clone https://github.com/emptyinkpot/emptyinkpot.github.io`，进入 `apps/web`。
2. 安装依赖：在仓库根执行 `npm install`。
3. 本地质量门：依次执行 `npm run lint`、`npm run check`、`npm run build`。
4. 本地预览：使用 Astro preview 或现有 npm script 预览 `apps/web/dist`。
5. 首页结构验证：`/` 必须是 `Profile/Signals/Memory/Stats Rail + Top Tabs + Masonry-like Feed + Right Article Drawer`，不是旧 HomeWorkbench 多模块堆叠，也不是左侧导航矩阵。
6. 默认主题验证：首屏 `<html data-theme="heritage">`；不设置 localStorage 时默认 Heritage。
7. 书签验证：首页 Feed 卡应出现 `.bookmark`，其数量应与可见 Feed 卡主视觉匹配；书签从卡片顶部露出。
8. Banner 验证：首页主 Feed 顶部必须有 `.home-hero-banner`；默认不得存在粒子 canvas 或半透明小形状装饰；鼠标移动会改变至少一层 `transform`；动效不得影响 Feed 滚动。
9. 抽屉验证：点击 Feed 卡和左栏 Reading Memory 记录可打开 `.home-article-drawer`；关闭后回到原滚动位置；完整页链接只在 drawer action 中出现。
10. 搜索验证：`Cmd/Ctrl + K` 打开 Knowledge Search；搜索 GitHub、书籍、音乐和文章标题都应返回结果。
11. Reader 验证：drawer 内 light / sepia / dark 可切换；收藏写入 `emptyinkpot-reader-bookmarks`；阅读历史写入 `emptyinkpot-reading-history`。
12. Knowledge 验证：`/knowledge/` 返回 200，图谱使用 radial / level 语义；`/data/knowledge-index.json` 返回构建期索引。
13. Graph 交互验证：`/knowledge/` 的 cluster 按钮必须能过滤节点；hover 节点只强调一跳关系；点击或键盘 Enter 选择节点后 Inspector 必须更新标题、类型、分区和打开入口。
14. Seal 验证：首页卡片 hover 出现盖章入口；选择印章后卡片和对应 drawer 标题区出现 `.knowledge-seal`；localStorage 写入 `emptyinkpot-reader-seals`；Search 的 `seal` tab 可搜到印章结果。
15. Visual 验证：`/visuals/` 返回 200；首页存在 `.visual-feed-card`；点击视觉卡打开 drawer；Search 的 `visual` tab 可搜到视觉节点；`/knowledge/` 存在 `visual:*` 节点。
16. Reader Knowledge Engine 验证：保存本地 highlight / annotation 后，Drawer mini graph 的标记列出现对应记忆；`/knowledge/` 注入 highlight / annotation node；点击这些 node 返回首页 Reader 并定位到 `.reader-highlight[data-highlight-id]`。
17. Graph 联动验证：`/knowledge/?focus=post:id` 会选中目标节点；点击 post/note/project 节点进入 `/?reader=...`；点击 tag 节点进入 `/?searchTag=...` 并打开首页 Search。
18. 视觉验收：默认画面不得出现大面积 blur、玻璃、neon、发光 hover；卡片 radius 约 `4px`，按钮 radius 约 `3px`，边界线清晰可见。
19. 移动验收：`max-width:900px` 后首页转单列；drawer `max-width:760px` 后占满屏宽；文本不得压住按钮或溢出容器。

可用浏览器断言：

```js
document.documentElement.dataset.theme === "heritage"
document.querySelectorAll(".home-hero-banner").length === 1
document.querySelectorAll(".home-feed-card").length > 0
document.querySelectorAll(".bookmark").length > 0
document.querySelectorAll(".home-feed-nav").length === 0
document.querySelectorAll(".home-feed-tabs [data-feed-filter]").length >= 9
document.querySelectorAll(".home-feed-card a[href^='/posts/'], .home-feed-card a[href^='/notes/'], .home-feed-card a[href^='/projects/']").length === 0
```

当前在线参考入口：

- 首页：`https://blog.tengokukk.com/`
- GitHub Showcase：`https://blog.tengokukk.com/github/`
- Bookshelf：`https://blog.tengokukk.com/books/`
- Music：`https://blog.tengokukk.com/music/`
- Knowledge Graph：`https://blog.tengokukk.com/knowledge/`
- Knowledge Index：`https://blog.tengokukk.com/data/knowledge-index.json`

#### 0.7.5.15g MyBlog Final UI Contract v1

本节是当前首页、Drawer、阅读系统、Search、Graph 的最终收口合同。它不新建一套并行命名，而是约束当前真实代码：

```text
/                         Profile Rail + Feed + Drawer Reader + Search Overlay
/knowledge/                Knowledge Graph
/github/ /books/ /music/   Showcase detail pages
/data/knowledge-index.json Search / Graph 的构建期索引
```

最终信息架构：

```text
首页负责发现
Drawer 负责快速阅读
Search 负责进入
Graph 负责回访
详情页负责深度展示
```

最终视觉原则：

```text
背景 = 纸
卡片 = 白
面板 = 米色
颜色 = 只由书签 / 高亮 / 图谱节点表达
阴影 = 少用
边线 = 清楚
```

当前代码映射：

| 合同概念 | 当前真实 selector / 文件 | 说明 |
| --- | --- | --- |
| Content OS shell | `.home-feed-shell` in `index.astro` / `global.css` | 首页两列骨架 |
| Profile Rail | `.home-feed-rail`、`.home-feed-profile`、`.home-feed-rail-card` | 左栏只放摘要、记忆入口和快速链接 |
| Feed | `.home-feed-main`、`.home-feed-toolbar`、`.home-feed-grid` | 主滚动与瀑布流 |
| FeedCard | `.home-feed-card` | 统一白色内容容器 |
| Bookmark Object | `.bookmark` | 内容分类的唯一强颜色来源 |
| Drawer Reader | `.home-article-layer`、`.home-article-drawer` | 右侧临时书页 |
| Search Overlay | `.knowledge-search-layer`、`.knowledge-search-panel` | Cmd/Ctrl + K command palette |
| Graph View | `/knowledge/`、`.knowledge-page`、`.knowledge-graph-svg` | 静态 radial / clustered graph |
| Hero Banner | `.home-hero-banner` | Feed 顶部的横向氛围层 |

最终 token：

```css
:root[data-theme="heritage"] {
  --heritage-bg: #f5f1e8;
  --heritage-card: #ffffff;
  --heritage-paper: #efe8da;
  --heritage-paper-deep: #e0d6c3;

  --heritage-line: #d8cfc2;
  --heritage-line-strong: #cbbda9;
  --heritage-line-heavy: #b8aa95;

  --heritage-ink: #1e1b18;
  --heritage-muted: #6b645c;

  --heritage-purple: #6b2d5c;
  --heritage-red: #9e2a2b;
  --heritage-green: #2f5d50;
  --heritage-gold: #c9a227;

  --motion-fast: 120ms;
  --motion-base: 180ms;
  --motion-slow: 260ms;
  --ease-standard: cubic-bezier(.2, 0, .2, 1);
}
```

Surface rules：

- `body.home-mode` 使用 `#f5f1e8` 和 44px 低透明网格，表示纸面。
- `.home-feed-card`、`.chart-card`、`.showcase-card` 使用 `#ffffff`，让内容容器干净，不再和背景一起发脏。
- `.home-feed-profile`、`.home-feed-rail-card`、`.home-article-drawer__header`、Search panel 使用米色面板或纸面；左栏承担状态属性，顶部 tabs 承担导航属性。
- 结构边界默认 `#cbbda9`；弱分隔可用 `#d8cfc2`；页面大分区可用 `#b8aa95`。

FeedCard rules：

- `.home-feed-card` 必须 `position: relative; overflow: visible; border-radius: 4px; border: 1px solid var(--heritage-line-strong); background: var(--heritage-card)`。
- `.home-feed-card` hover 只允许 `translateY(-1px)`，不得增加厚阴影，不得改变瀑布流 item 尺寸。
- `.home-feed-card h2` 字号约 `20px`、行高 `1.32`、字重 `600-650`，颜色跟随 `--bookmark-color`。
- `.home-feed-card p` 字号约 `14px`、行高约 `1.72`，只用 `#6b645c` 作为次级文本。
- 颜色只来自 `.bookmark`、highlight、graph node；普通卡片面不得再使用大色块或玻璃渐变。

Bookmark rules：

- `.bookmark` 是物件，不是 tag；必须从卡片顶部露出。
- `.bookmark` 固定 `top:-8px; left:14px/16px`，使用底部缺口 `clip-path`。
- hover 时书签从 `rotate(-1.4deg)` 到 `rotate(-0.2deg) translateY(-1px)`。
- post=紫，note/book=红，project/github=绿，music=金；标题颜色跟随同一语义色。

Drawer Reader rules：

- `.home-article-layer` 负责 backdrop + drawer layer，不得直接 display none 后瞬移。
- `.home-article-backdrop` 使用 `opacity` 过渡，背景 `rgba(30,27,24,.28)`。
- `.home-article-drawer` 宽度 `min(980px,100vw)`，右侧滑入，`transform` 过渡 `180ms cubic-bezier(.2,0,.2,1)`。
- 关闭 drawer 必须等过渡结束后再 hidden；关闭后恢复 `.home-feed-main.scrollTop` 并 focus 回原触发卡片。
- reader themes 使用 `emptyinkpot-reader-theme`，仍只允许 `light / sepia / dark`。
- Reader Memory 不得默认展开占据正文流；当前实现为右上折叠浮层 `.reader-memory-panel`，点击“阅读记忆”后显示最近阅读 / 收藏 / 标记。
- 正文标题结构以 `.home-article-intro` 为权威标题块：轻 meta、强 h1、lead summary；辅助信息进入侧边或底部，不再方框套方框。
- `.home-article-related` 是文章底部“继续阅读”入口，最多展示 3 条相关内容，负责让阅读从单篇流向下一篇。

Reader Page 排版规则：

- 阅读页不得按后台面板思路堆模块；正文是流动阅读路径，辅助状态必须进入折叠浮层、侧边目录或底部延伸区。
- 顶部信息只保留 `meta -> h1 -> lead` 三层：meta 轻、标题强、lead 负责一句话概括；不得在标题下再放大块信息框。
- 标题不是海报；`.home-article-intro h1` 必须降到阅读级字号，字号由 `--type-title-scale` 控制，标题不得再用独立 `18ch` 版心破坏正文轴线。需要特殊换行时用内容层手动换行，而不是给 h1 单独设窄宽度。
- Reader 必须只有一个内容版心：`.home-article-intro`、`.home-article-content`、`.reader-mini-graph`、`.home-article-related` 都使用 `--reader-column-width`。标题、lead、正文、related 左右边界必须对齐同一条 content column。
- `.home-article-reader__grid` 是 Obsidian 式结构：TOC 列 + `minmax(0,var(--reader-column-width))` 主列，并通过 `justify-content:center` 稳定主轴。
- 正文字号、行高、段距分别由 `--type-body-size`、`--type-body-line`、`--reader-paragraph-gap` 控制；`h2 / h3 / blockquote / mark / ul / ol / code` 负责制造阅读节奏，不允许所有段落等权堆叠。
- TOC 是轻侧栏，不是内容卡片；它只辅助定位，不抢正文视觉权重。
- TOC 不得显示浏览器默认粗滚动条；当前 `.home-article-toc` 使用 `scrollbar-width:none` 和 `::-webkit-scrollbar{display:none}`。
- 阅读结束不能是死路；`.home-article-related` 必须给出继续阅读入口，优先使用同类型和共享 tags 的内容。
- 色彩只服务注意力：标题、书签、高亮、印章、Graph 节点可以使用语义色；正文容器和辅助面板保持安静。
- Highlight 不得过亮；默认 gold 约 `rgba(201,162,39,.28)`，purple/green/red 约 `.18` 透明度。`/settings/` 可以在 `subtle / normal / strong` 之间切换，但不得让高亮遮住正文阅读。
- Reader Memory 默认仍是折叠浮层；`readerMemoryPanel:"expanded"` 只作为本地偏好展开，不得把最近阅读 / 收藏 / 标记塞回正文流。

Knowledge UI System：

- Graph、Reader、Search 共用同一套 Knowledge Index；Highlight 是记忆，Graph 是关系，Search 是入口。
- `graphDensity:"low"` 必须隐藏边缘记忆节点和对应边，避免 Graph 变成毛线团；`medium` 是默认；`high` 保留更多节点和标签。
- `graphLabels:"important"` 默认只保留主要节点标签，隐藏 tag / highlight / annotation / seal 等边缘标签；`all` 显示全部；`none` 隐藏全部标签。
- `graphMotion:false` 必须关闭 Graph node/link transition，尊重低动效偏好。
- Graph 点击 article / highlight / tag 的行为继续通过 Reader/Search command 打通：article 打开 Reader，highlight 打开 Reader 并定位 mark，tag 打开搜索筛选。

Search rules：

- `.knowledge-search-layer` 是 command palette，不是新页面。
- 打开方式固定为 `Cmd/Ctrl + K` 或首页搜索按钮。
- Search panel 宽 `min(720px, calc(100vw - 28px))`，边框 `2px solid var(--heritage-line-strong)`。
- Search 可以补 fade 动效，但不得破坏 Esc 优先关闭搜索、再关闭 drawer 的顺序。

Hero Banner rules：

- `.home-hero-banner` 位于 `.home-feed-main` 顶部、`.home-feed-toolbar` 之前；它是情绪层，不是内容卡片，也不能进入 FeedItem 计数。
- Banner 必须是横向长图容器，高度约 `150px-210px`，边框使用 `var(--heritage-line-strong)`，圆角 `4px`。
- 层级固定为：`bg` 远景、`mid` 中景、`front` 前景、`overlay` 遮罩、`content` 品牌文字。
- Banner 上的全部文字和图片必须接入 `/settings/` 的 `content.banner`：`kicker/title/subtitle/springLabel/summerLabel/autumnLabel/winterLabel/bgImage/midImage/frontImage`。空值沿用默认文案和默认图片。
- Banner DOM 必须保留 `data-hero-kicker`、`data-hero-title`、`data-hero-subtitle`、`data-hero-layer`，并同步提供 `data-copy-key`，便于全站内容端口统一覆盖。
- 鼠标移动只驱动轻微 parallax：远景约 `10px`，中景约 `20px`，前景约 `34px`；不得做大幅晃动。
- 默认不得启用粒子 canvas、半透明圆点、斜纹、漂浮色块等装饰层；Banner 的气氛由真实横向图片、轻微 parallax 和必要的文字可读性遮罩承担。
- 四季自动切换由客户端按月份写入 `data-season`：spring、summer、autumn、winter；当前只切换季节 label 和本地 fallback 图片入口，不改变布局，也不叠加装饰粒子。
- 当前默认图片先使用 `apps/web/public/images/home/homepage-floral-bg.png` 横向裁切。后续替换真实多层素材时使用：

```text
apps/web/public/images/hero/
├── spring-bg.jpg
├── spring-mid.png
├── spring-front.png
├── summer-bg.jpg
├── summer-mid.png
├── summer-front.png
├── autumn-bg.jpg
├── autumn-mid.png
├── autumn-front.png
├── winter-bg.jpg
├── winter-mid.png
└── winter-front.png
```

- 如果真实素材尚未准备好，代码必须保留本地 fallback，不允许请求外部图床或留下破图。
- Banner 文案只允许品牌和气质信号，例如 `EMPTYINKPOT`、`Content OS · Tangible Knowledge UI`；不得写成使用说明或功能介绍。

Graph rules：

- Graph 不做随机星云；必须保留中心、collection、content、tag/highlight/seal 的层级。
- `/knowledge/` 的视觉容器使用白色 panel + 纸面 graph canvas。
- 当前 `/knowledge/` 已使用 cluster sectors：writing、engineering、reading、media、github；hover 强调一跳关系，点击节点更新 Inspector。
- Graph 过滤入口固定在左侧 cluster list：All、Writing、Engineering、Reading、Media、GitHub、Tags、Seals。
- Graph 仍是静态 SVG + 轻量客户端脚本，不引随机力导向；后续即使替换渲染库，也必须保留现有节点/边语义与 Inspector 行为。
- Graph 和 Reader 通过 URL command 联动；Graph 不直接复制 Drawer 模板，跨页打开统一回到首页 Reader。
- 本地 highlights / annotations 属于浏览器侧记忆节点，Graph 首屏从 localStorage 注入；构建期 Knowledge Index 不写入用户本地标记。

Tangible Knowledge UI 扩展规则：

```text
Bookmark = 分类
Highlight = 记忆
Annotation = 思考
Seal = 人工判断
Sticker = 情绪 / 临时想法 / 可视批注
Graph = 回访结构
```

- Seal System 已作为 P2 落地，但不能替代 bookmark。印章表达“精选 / 重要 / 洞见 / 未完 / 重读 / 归档 / 完成 / 正典”等人工判断。
- `.knowledge-seal` 是压印物件，不是 icon；支持 circle / square / oval / vertical / ticket 五种形态，带内环、副文字、轻微旋转、multiply 压印感、rough / aged / ink 质感和 `seal-stamp-in` 盖章动画。
- `.seal-palette` 负责选择印章；当前第一版支持 Feed 卡片 / 当前文章盖章与移除。它保存一个最新判断，仍不做批量管理页。
- `SealPlacement.x / y` 必须参与渲染；默认位置在卡片右上方，但从点击入口进入时会记录相对位置，后续拖拽盖章不得丢弃这个字段。
- Graph 必须同时保留静态 seal 类型节点和本地 placement link：`seal:<type> -> targetId`。这保证“印章 = 判断”能回流到 Knowledge Graph，而不是只停留在视觉层。
- Annotation 必须绑定 Highlight；高亮只保存原文片段，批注保存个人思考。
- Seal、Annotation、Highlight 都必须进入统一 Knowledge Artifact System；当前 Seal 已进入 Search 和 Graph 类型节点，Highlight / Annotation 已进入 Search、Reader mini graph 和 Graph 本地节点。
- 第一版仍保持 localStorage；引入后端前不得改变 `HighlightRecord`、`KnowledgeSearchDoc`、`KnowledgeGraphNode`、`KnowledgeGraphLink` 合同。

Sticker System 合同：

```ts
type StickerItem = {
  id: string;
  targetId: string;
  targetType: "feed-card" | "article" | "image" | "book" | "project" | "wiki" | "visual";
  kind: "tape" | "note" | "label" | "emoji" | "image" | "marker" | "task" | "warning" | "world";
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  color?: string;
  note?: string;
  createdAt: number;
  updatedAt: number;
};
```

- Sticker 不是 emoji 装饰，而是 `Visual Annotation Layer`：表达情绪、临时想法、任务、世界观标记和非结构化批注。
- P0 存储键固定为 `emptyinkpot-stickers`；贴纸必须绑定 `targetId`，当前 `/visuals/` 使用 `visual:<id>` 作为目标。
- `/visuals/` 每张视觉素材卡必须支持 4 类轻量贴纸：`note` 便签、`tape` 胶带、`task` 任务、`marker` 标记。
- P0 贴纸必须可拖拽、可缩放、可旋转、可编辑文字、可删除，并在刷新后从 localStorage 恢复。
- Search 必须把本地贴纸作为 `type: "sticker"` 纳入统一搜索；Graph 必须把本地贴纸作为 `sticker:*` 节点连接回目标内容。
- 交互语义固定：Hover = 预览；Click = Drawer / 编辑；Drag = 操作；Scroll = 浏览。贴纸拖拽不得触发页面跳转或 Drawer。

Sticker roadmap:

```text
P0 current:
- /visuals visual card stickers
- note / tape / task / marker presets
- localStorage persistence
- drag / resize / rotate / edit / delete
- Search sticker results
- Graph local sticker nodes

P1:
- sticker palette manager
- color picker and custom sticker text
- card / article / drawer sticker layer
- keyboard delete / duplicate

P2:
- Moveable rotation handles and snap lines
- custom PNG sticker import
- sticker filter and batch management

P3:
- tldraw moodboard / worldbuilding board
- GitHub / CMS persistence
- Fabric.js export / image composition
```

Seal roadmap:

```text
P0 current:
- shared seal definitions
- localStorage placements
- Feed / Reader stamping
- Search seal results
- Graph local seal links
- pressed-paper visual with stamp-in motion

P1:
- settings -> knowledge system -> custom seal manager
- clean / rough / aged / ink preview
- user-defined label, subLabel, shape and color

P2:
- drawstamputils-style Canvas texture generation
- drag placement using x / y
- batch stamping and filter presets

P3:
- GitHub / CMS persistence
- import / export seal templates
- highlight-level and project-wiki-level stamps
```

Visual Knowledge Layer 合同：

```ts
type VisualItem = {
  id: string;
  title: string;
  image: string;
  type: "poster" | "illustration" | "layout" | "color" | "reference";
  summary: string;
  note: string;
  tags: string[];
  palette: {
    dominant: string;
    colors: string[];
  };
  seal?: string;
  related?: {
    posts?: string[];
    books?: string[];
    projects?: string[];
    visuals?: string[];
  };
};
```

- Visual 不是装饰图，也不是 banner 备选项；它表达“情绪、概念、世界观素材、风格锚点、设计 token 来源”。
- 当前 P0 数据源为 `apps/web/src/data/visuals.ts`，示例资产位于 `apps/web/public/images/visuals/`。
- `.visual-feed-card` 必须是可打开 Drawer、可盖章、可搜索、可进入 Graph 的内容卡。
- Drawer 中必须显示大图、笔记、标签、调色板和可复制设计 token；后续接入 Color Thief / image annotation 时仍沿用同一数据结构。
- `/visuals/` 是视觉素材库首页，使用 masonry-like column layout；不要把它做成营销 landing page。
- 全站导航必须有 `/visuals/` 的显式入口，中文标签为“视觉素材”，避免图片内容只藏在首页 Feed 过滤器里。
- `/visuals/` 提供本地编辑器，使用 `emptyinkpot-visual-items` 保存可编辑素材集合；支持编辑标题、类型、图片地址、本地图片预览、摘要、笔记、标签、来源和调色板。
- 本地编辑器的“导出 JSON”用于把浏览器草稿合入 `apps/web/src/data/visuals.ts`；正式上传 / 多人协作阶段再改为 GitHub API、TinaCMS 或 Decap CMS 写回仓库。

Visual roadmap:

```text
P0 current:
- VisualItem data
- /visuals visual wall
- /visuals local visual editor
- /visuals sticker layer
- site navigation visual category
- homepage visual feed cards
- drawer detail / palette / token copy
- Search visual docs
- Search sticker docs
- Graph visual nodes and tag links
- Graph local sticker links

P1:
- Color Thief palette extraction
- user-uploaded source image registry
- settings preview for visual card density

P2:
- react-image-annotate region notes
- image annotation localStorage schema
- visual item to article / project backlinks

P3:
- React Flow / xyflow visual graph editing
- drag visual into graph
- AI tagging and design token generation pipeline
```

最终验收标准：

```text
首页：
- 默认 heritage
- 卡片白色，背景纸色
- 颜色只来自书签 / highlight / graph node
- 三列瀑布流稳定，900px 以下单列

Drawer：
- 180ms 滑入 / 退出
- Esc 关闭
- 关闭后回到原滚动位置
- 阅读进度、收藏、reader theme 可用

Search：
- Cmd/Ctrl + K 打开
- Esc 关闭
- 可搜文章、书、音乐、GitHub、高亮、印章

Graph：
- 不随机
- 中心 / 分区 / 层级清晰
- 节点语义色和 Heritage 色板一致
```

#### 0.7.5.16 Frontend Refactor Priority

前台升级建议默认按以下顺序推进，而不是同时大改所有页面：

1. 先重排首页 Workbench 的结构，把首页改成控制台式信息节奏。
2. 再给内容体系补状态标签与状态语义。
3. 再把搜索页升级为更强交互式搜索入口。
4. 再升级内容页模板，补元信息、关系与操作入口。
5. 最后补 `System Bar`、统计面板与 dashboard 感。

这条顺序的核心是：先建立系统感，再补细节视觉。

#### 0.7.5.17 Target Admin Console Information Architecture

`admin-next` 的目标不应只是“有几个后台页面”，而应是清晰的控制台结构。推荐第一版信息架构直接固定为：

```text
apps/admin-next/app/
├─ admin/
│  ├─ layout.tsx
│  ├─ dashboard/page.tsx
│  ├─ ai/page.tsx
│  ├─ publish/page.tsx
│  ├─ token-pool/page.tsx
│  ├─ content/page.tsx
│  └─ logs/page.tsx
│
├─ api/
│  ├─ ai/generate/route.ts
│  ├─ publish/build/route.ts
│  ├─ publish/release/route.ts
│  ├─ publish/rollback/route.ts
│  └─ token-pool/status/route.ts
│
└─ components/
   ├─ admin/
   ├─ ai/
   ├─ publish/
   └─ token-pool/
```

这一层属于目标结构，不代表当前仓已经存在这些文件。

#### 0.7.5.18 Target Admin Surface Contracts

第一版 `admin-next` 推荐先稳定以下页面职责，而不是一开始就扩成完整 CMS：

- `Dashboard`
  - 一眼看清 release、发布健康度、文章/草稿数量、AI 任务数、provider 可用数
- `Content`
  - 管理内容列表、状态、后续的草稿入口
- `AI Writer`
  - 承载 topic / outline / draft / rewrite / seo / review 的可视 pipeline
- `Publish`
  - 承载 build、release、rollback、health check 与日志
- `Token Pool`
  - 展示 provider scoring、fallback、cooldown、失败次数、延迟、成功率
- `Logs`
  - 展示发布、AI、provider 与运行错误日志

如果按执行优先级排序，第一批默认应该优先把 `Dashboard`、`Publish`、`Token Pool` 做成控制台骨架，再接真实 API。

#### 0.7.5.19 Target Admin UI Language

`admin-next` 与前台 Astro 建议共用同一套“系统 UI”语言，避免形成两套割裂风格。第一版建议固定如下基线：

- 背景
  - `neutral-950`
- 卡片
  - `neutral-900 + border-neutral-800 + rounded-2xl`
- 主按钮
  - `blue / green`
- 危险按钮
  - `red`
- 状态颜色
  - `healthy / success -> green`
  - `draft / cooldown / pending -> yellow`
  - `error / failed -> red`
  - `ai-generated -> purple or accent`

推荐复用的基础组件命名：

- `StatusBadge`
- `MetricCard`
- `ActionButton`
- `LogPanel`
- `StateTimeline`
- `ProviderTable`
- `ChatPanel`

如果真正进入实现阶段，这些名字应优先沉淀为共享组件，而不是页面内联重复。

#### 0.7.5.20 Target Publish And AI Interaction Surfaces

`Publish` 页面推荐默认围绕状态机而不是按钮堆叠来设计。第一版发布状态机应显式表现：

```text
idle
-> checking
-> building
-> uploading
-> switching
-> health_checking
-> success

failure path:
failed
-> rollbacking
-> rollbacked
```

`AI Writer` 页面推荐默认采用三栏结构，而不是单栏表单：

```text
left: pipeline
center: conversation / generation panel
right: metadata / seo / status / save actions
```

`Token Pool` 页面推荐默认按 provider 表格展示，而不是只显示 key 或 provider 名称；至少应显式展示：

- provider name
- status
- success rate
- latency
- cost level
- fail count

这三块页面的共同目标是：让后台先成为“控制台”，再逐步接入真实 token pool、publish、AI pipeline。

#### 0.7.5.21 Target Admin Delivery Order

`admin-next` 的实现顺序建议固定为：

1. `P0`
   - `Admin layout`
   - `Dashboard`
   - `Publish Center` 静态 UI
   - `Token Pool` 静态表格
2. `P1`
   - `/api/token-pool/status`
   - `/api/publish/release`
   - `/api/publish/rollback`
   - 发布状态机接真实 API
3. `P2`
   - `AI Writer` chat UI
   - `/api/ai/generate`
   - token-pool 接入
   - `save draft`
4. `P3`
   - `Content` 管理页
   - `Logs`
   - `Analytics`
   - 自动发布 agent

默认原则不是“一次把后台做全”，而是先把控制台骨架稳定，再逐个接真实系统边界。

## 当前前台实现清单

本节只记录当前已经真实存在的前台页面、组件与支撑模块，供下一轮拆分到 `web-astro` 或对接 `admin-next` 时作为现状索引。

### 当前页面路由

- 顶层页面：
  - `apps/web/src/pages/index.astro`
  - `apps/web/src/pages/about.astro`
  - `apps/web/src/pages/api-keys.astro`
  - `apps/web/src/pages/books/index.astro`
  - `apps/web/src/pages/evidence-library/index.astro`
  - `apps/web/src/pages/github/index.astro`
  - `apps/web/src/pages/knowledge/index.astro`
  - `apps/web/src/pages/music/index.astro`
  - `apps/web/src/pages/settings.astro`
  - `apps/web/src/pages/search.astro`
  - `apps/web/src/pages/updates.astro`
- 列表/详情页：
  - `apps/web/src/pages/books/[id].astro`
  - `apps/web/src/pages/reader/[id].astro`
  - `apps/web/src/pages/posts/index.astro`
  - `apps/web/src/pages/posts/[slug].astro`
  - `apps/web/src/pages/notes/index.astro`
  - `apps/web/src/pages/notes/[slug].astro`
  - `apps/web/src/pages/projects/index.astro`
  - `apps/web/src/pages/projects/[slug].astro`
  - `apps/web/src/pages/tags/index.astro`
  - `apps/web/src/pages/tags/[slug].astro`
  - `apps/web/src/pages/categories/index.astro`
  - `apps/web/src/pages/categories/[slug].astro`
  - `apps/web/src/pages/series/index.astro`
  - `apps/web/src/pages/series/[slug].astro`
- 站点输出页：
  - `apps/web/src/pages/data/knowledge-index.json.ts`
  - `apps/web/src/pages/robots.txt.ts`
  - `apps/web/src/pages/rss.xml.ts`

### 当前 legacy HomeWorkbench 组件

以下组件仍存在于代码库，属于旧 HomeWorkbench 体系资产，不是当前首页默认结构。后续如果复用，应先抽取有价值的数据展示或小组件，不能把旧多模块堆叠首页整体恢复回来：

- `apps/web/src/components/home/HomeWorkbenchDeck.astro`
- `apps/web/src/components/home/HomeWorkbenchFeatureBand.astro`
- `apps/web/src/components/home/HomeWorkbenchHero.astro`
- `apps/web/src/components/home/HomeWorkbenchLatestPosts.astro`
- `apps/web/src/components/home/HomeWorkbenchMaintenance.astro`
- `apps/web/src/components/home/HomeWorkbenchPanel.astro`
- `apps/web/src/components/home/HomeWorkbenchPlanned.astro`
- `apps/web/src/components/home/HomeWorkbenchProjectNotes.astro`
- `apps/web/src/components/home/HomeWorkbenchRoutes.astro`
- `apps/web/src/components/home/HomeWorkbenchScripts.astro`
- `apps/web/src/components/home/HomeWorkbenchSearch.astro`
- `apps/web/src/components/home/HomeWorkbenchSectionLine.astro`
- `apps/web/src/components/home/HomeWorkbenchSidebar.astro`
- `apps/web/src/components/home/HomeWorkbenchSignals.astro`
- `apps/web/src/components/home/HomeWorkbenchTaxonomy.astro`
- `apps/web/src/components/home/HomeWorkbenchUtility.astro`

### 当前 Visualization / Showcase 组件

- Visualization 组件：
  - `apps/web/src/components/visualizations/ChartCard.astro`
  - `apps/web/src/components/visualizations/GitHubHeatmap.astro`
  - `apps/web/src/components/visualizations/GitHubMonthlyLine.astro`
  - `apps/web/src/components/visualizations/GitHubLanguageDonut.astro`
  - `apps/web/src/components/visualizations/GitHubRepoMatrix.astro`
  - `apps/web/src/components/visualizations/TeamSignalGraph.astro`
- Showcase 组件：
  - `apps/web/src/components/showcase/BookCover.astro`
  - `apps/web/src/components/showcase/BookshelfCard.astro`
  - `apps/web/src/components/showcase/AlbumCover.astro`
  - `apps/web/src/components/showcase/MusicCard.astro`
- Bookshelf / Reader React islands：
  - `apps/web/src/components/books/BookshelfGrid.tsx`
  - `apps/web/src/components/books/BookReader.tsx`
  - `apps/web/src/components/books/EpubReader.tsx`
  - `apps/web/src/components/books/PdfReader.tsx`

### 当前 Knowledge Layer 模块

- 页面与数据端点：
  - `apps/web/src/pages/knowledge/index.astro`
  - `apps/web/src/pages/data/knowledge-index.json.ts`
- 类型与纯函数：
  - `apps/web/src/lib/knowledge/types.ts`
  - `apps/web/src/lib/knowledge/anchors.ts`
  - `apps/web/src/lib/knowledge/storage.ts`
  - `apps/web/src/lib/knowledge/search.ts`
  - `apps/web/src/lib/knowledge/graph.ts`
- 首页内联交互：
  - `apps/web/src/pages/index.astro` 内的 drawer、reader、search、keyboard navigation、bookmark、history、highlight 脚本

Knowledge Layer 的复刻边界是数据合同优先：`KnowledgeSearchDoc`、`KnowledgeGraphNode`、`KnowledgeGraphLink` 和 `HighlightRecord` 不能因换 UI 库而改变。后续可以把首页内联脚本拆成 island 或共享模块，但不得拆散 Search、Reader Memory、Graph 的统一数据来源。

### GitHub 可视化资产与旧首页配置

README 之前只零散记录了 `HomeWorkbenchSignals`、`apps/web/src/lib/github.ts`、`apps/web/src/data/github-overview.emptyinkpot.json` 与部分 CSS class，没有把 GitHub 热力图、折线图、团队图、饼状图作为一套资产清单完整写清。当前真实状态如下：

| 能力 | 数据源 | 构建/类型入口 | 视觉入口 | 当前首页状态 |
| --- | --- | --- | --- | --- |
| GitHub 热力图 | `overview.months`、`overview.weeks`、`overview.totalContributions` | 旧：`buildCheckInData()`；新：`buildGitHubAnalytics()` in `apps/web/src/lib/analytics.ts` | 新：`GitHubHeatmap.astro` + `ChartCard.astro`；旧：`.home-workbench__cell--0..4` | 首页已作为 mini Feed 图表恢复；`/github/` 展示完整版 |
| GitHub 月度折线图 | `overview.monthly` | 旧：`buildGitHubData()`；新：`buildGitHubAnalytics()` | 新：`GitHubMonthlyLine.astro`；旧：`.home-workbench__linechart` | 首页已作为 mini Feed 图表恢复；`/github/` 展示完整版 |
| GitHub 语言饼状图 / donut | `overview.languages` | 旧：`buildGitHubData()`；新：`buildGitHubAnalytics()` | 新：`GitHubLanguageDonut.astro`；旧：`.home-workbench__donut` | 首页已作为 mini Feed 图表恢复；`/github/` 展示完整版 |
| 团队图 / 团队信号 | `overview.profile`、`overview.repos` 加本地团队配置 | 旧：`buildTeamSignals()`；新：`TeamSignalGraph.astro` 直接吃 profile/repos | 新：`TeamSignalGraph.astro`；旧：`HomeWorkbenchSignals.astro` | 不塞回首页；`/github/` 展示静态关系图 |
| 仓库矩阵 | `overview.repos` | `githubItems` in `apps/web/src/pages/index.astro`；新：`GitHubRepoMatrix.astro` | 新 Feed 卡片 `.home-feed-card--github`；详情页 `GitHubRepoMatrix.astro` | 当前首页展示仓库卡片；`/github/` 展示完整矩阵 |

这套 GitHub 数据的长期真源是：

- 快照文件：`apps/web/src/data/github-overview.emptyinkpot.json`
- 校验与读取：`apps/web/src/lib/github.ts`
- 新派生层：`apps/web/src/lib/analytics.ts`
- 旧首页 payload 生成：`apps/web/src/lib/home.ts`
- 新首页 Feed 使用：`apps/web/src/pages/index.astro`

后续如果要扩展 GitHub 数据仪表盘，不应重新抓一套数据或手写静态图；应从上述 snapshot 和 `analytics.ts` 继续派生，做成独立 Feed 卡或 `/github/` 详情页。当前 README 的判断是：旧可视化资产已升级为 Visualization 层，首页只保留 mini 卡片和摘要，完整内容进入 `/github/`。

### 当前共享组件与内容页组件

- 共享组件：
  - `apps/web/src/components/shared/ArticleCard.astro`
  - `apps/web/src/components/shared/FeaturedCard.astro`
  - `apps/web/src/components/shared/SiteHeader.astro`
  - `apps/web/src/components/shared/SiteFooter.astro`
  - `apps/web/src/components/shared/WorkbenchPageIntro.astro`
- 内容页组件：
  - `apps/web/src/components/post/GiscusComments.astro`

### 当前布局、lib 与内容层

- 布局：
  - `apps/web/src/layouts/BaseLayout.astro`
- 前台支撑模块：
  - `apps/web/src/lib/content.ts`
  - `apps/web/src/lib/analytics.ts`
  - `apps/web/src/lib/github.ts`
  - `apps/web/src/lib/home.ts`
  - `apps/web/src/lib/postCovers.ts`
  - `apps/web/src/lib/site.ts`
  - `apps/web/src/lib/updateLog.ts`
  - `apps/web/src/lib/books/types.ts`
  - `apps/web/src/lib/books/openlist.ts`
  - `apps/web/src/lib/books/storage.ts`
- 当前内容集合：
  - `apps/web/src/content/posts/`
  - `apps/web/src/content/notes/`
  - `apps/web/src/content/projects/`
  - `apps/web/src/content/pages/`
- 当前轻数据：
  - `apps/web/src/data/books.ts`
  - `apps/web/src/data/music.ts`
  - `apps/web/src/data/github-overview.emptyinkpot.json`
  - `apps/web/src/lib/profile.ts`

### 当前平台化拆分原则

后续从当前实现过渡到目标结构时，默认遵守以下拆分策略：

- 当前 `apps/web` 先视为未来 `apps/web-astro` 的真实前身，不做平行双写。
- 当前首页工作台组件优先留在展示层；不要为了接后台而把业务写回 Astro 组件。
- 内容 schema、AI pipeline、发布逻辑、token-pool 调度应进入 `modules/` 或 `kernel/`，不要塞回 `apps/web/src/lib/`。
- `admin-next` 先做控制面，不要反向侵入当前 Astro 展示层的只读边界。

### 当前前台改造映射

后续细化时，可先按以下映射理解现有资产，而不是从零开始重写：

- 首页控制台入口
  - `HomeWorkbenchHero`
  - `HomeWorkbenchDeck`
  - `HomeWorkbenchSidebar`
- Quick Actions / 操作层
  - `HomeWorkbenchSearch`
  - `HomeWorkbenchRoutes`
  - `HomeWorkbenchUtility`
- Content Feed / 内容流
  - `HomeWorkbenchLatestPosts`
  - `ArticleCard`
  - `FeaturedCard`
- Signals / System Panels
  - `HomeWorkbenchSignals`
  - `HomeWorkbenchTaxonomy`
  - `HomeWorkbenchMaintenance`
  - `HomeWorkbenchProjectNotes`
  - `HomeWorkbenchPlanned`

这层映射的意义是：优先做重组、抽象和 contract 收敛，而不是简单推倒重写。

## 本地源码仓定位

- 当前这台机器上的正式本地源码仓路径：`E:\My Project\MyBlog`
- 当前工作副本就是 `emptyinkpot.github.io / MyBlog` 的可编辑源码边界
- Git 长期真源仍是 `https://github.com/emptyinkpot/emptyinkpot.github.io`
- 本地路径可以迁移，但任何时候都应只保留一个活跃写作面，避免再并行维护旧临时 working copy 或静态快照目录
- 如果后续再次移动本地仓，应先更新控制层说明，再继续编辑、构建或发布

## 中心入口（先看这里）

- 网站中心：`apps/web/`
- 前端现状说明：`apps/web/README.md`
- 规划中心：`docs/plans/update-plan.md`
- 执行中心：`docs/architecture/astro-blog-redesign-checklist.md`
- 记录中心：`docs/maintenance/astro-redesign-execution-log.md`
- 首页抽象设计说明：`docs/architecture/homepage-editorial-ui-readme.md`

## 入口

- 站点应用：`apps/web/`
- 工程文档：`docs/`
- 公开数据：`public-data/`
- 工具脚本：`tools/`

## 当前架构结论

- `apps/web/` 是唯一正式站点入口
- 开发、构建、预览、部署都只走 Astro 主链路
- Hexo 兼容链路已经停止维护，不再作为正式能力保留
- 内容发布以 `apps/web/src/content/` 与 `public-data/` 为准
- 架构规范类公开文档以 `apps/web/src/content/posts/` 为唯一真源，不再在 `docs/` 或根目录维护重复副本

## 默认提交目标

- 默认 Git 远端仓库：`https://github.com/emptyinkpot/emptyinkpot.github.io`
- 默认集成分支：`origin/main`
- 默认协作方式：`feature branch + Pull Request`
- 非紧急情况不直接推送到 `main`，优先从功能分支发起 PR 合并
- 后续如需更换提交目标，应优先先更新本节说明，再执行提交或推送

## GitHub 工具链约定

- 当前这台电脑已安装全局 `GitHub CLI`
- `gh` 当前版本：`2.89.0`
- `gh` 安装位置：`C:\Program Files\GitHub CLI\gh.exe`
- 当前 `gh` 已登录账号：`emptyinkpot`
- 当前仓库默认仍以 `git + feature branch + PR` 为主流程，`gh` 作为辅助入口

推荐使用顺序：

1. 用 `git` 处理分支、提交、rebase、push
2. 用 `gh` 处理认证检查、仓库查看、PR 创建、PR 查看、Issue 查看
3. 如果 `git push` 走 `https` 出现 Windows `schannel` 或 TLS 握手异常，优先切换远端到 SSH 再推送

推荐命令：

```bash
gh auth status
gh repo view emptyinkpot/emptyinkpot.github.io
gh pr create
gh pr view
```

推送异常时的推荐处理：

```bash
git remote set-url origin git@github.com:emptyinkpot/emptyinkpot.github.io.git
git push origin <branch-name>
```

说明：

- 如果刚安装完 `gh` 后当前终端提示“找不到命令”，通常不是没装成功，而是当前终端还没刷新 `PATH`
- 解决方式优先是重新打开一个新的终端窗口
- 临时也可以直接执行：`"C:\Program Files\GitHub CLI\gh.exe"`

## 腾讯云 CLI 约定

- 当前这台电脑已安装全局 `tccli`
- `tccli` 当前版本：`3.1.65.1`
- 当前轻量服务器地域：`ap-shanghai`
- 当前轻量服务器实例 ID：`lhins-jqpgc12e`
- 当前轻量服务器公网 IP：`124.220.233.126`

推荐用途：

1. 用 `tccli` 查询轻量服务器实例、地域、防火墙规则等云资源状态
2. 用 `ssh` 进入服务器修改 `Nginx`、系统服务、站点文件和日志
3. 不把云资源查询和服务器内系统操作混成同一层

推荐命令：

```bash
tccli --version
tccli lighthouse DescribeInstances --region ap-shanghai
tccli lighthouse DescribeFirewallRules --region ap-shanghai --InstanceId lhins-jqpgc12e
tccli lighthouse DescribeRegions
```

说明：

- 如果刚安装完 `tccli` 后当前终端提示“找不到命令”，通常也是因为当前终端还没刷新 `PATH`
- 解决方式优先是重新打开一个新的终端窗口
- 轻量服务器相关命令优先明确带上 `--region ap-shanghai`
- 如果后续要轮换腾讯云密钥，建议先更新本机 `tccli` 认证，再继续跑自动化命令

## Pull Request 规则

- PR 默认目标仓库：`https://github.com/emptyinkpot/emptyinkpot.github.io`
- PR 默认目标分支：`main`
- 分支命名建议使用 `feat/`、`fix/`、`docs/`、`refactor/` 等前缀加简短英文主题
- PR 标题必须简洁明确，推荐中英双语，并直接描述本次变更结果
- PR 描述必须中英双语，且内容保持简洁，只写必要背景、变更范围、验证结果与风险说明
- PR 提交前必须完成本地验证；至少写明已执行的命令与结果，例如 `npm run check`、`npm run build`
- PR 不混入临时文件、空文件、调试产物或与主题无关的改动

推荐 PR 描述结构：

1. 摘要 / Summary
2. 变更内容 / Changes
3. 验证结果 / Verification
4. 风险与备注 / Risks & Notes

## 根目录精简建议

如果按当前规范继续收口，建议最终根目录尽量保持为：

```text
MyBlog/
├─ .github/
├─ .runtime/
├─ apps/
├─ docs/
├─ public-data/
├─ tests/
├─ tools/
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md
```

说明：

- `apps/` 是现行应用层，当前正式站点入口在 `apps/web/`
- `docs/` 是规划、架构、治理和维护记录中心
- `public-data/` 是公开数据真源
- `tests/` 是测试与验证入口
- `tools/` 是校验、生成和迁移脚本入口
- `.runtime/` 是运行层外置目录

## 计划文档规则

计划文档统一存放在 `docs/plans/`。

读取顺序建议如下：

1. 先读 `docs/plans/update-plan.md`，了解仓库总方向
2. 再读按日期命名的专项计划文档，了解某一轮改造的目标与边界
3. 最后再进入 `docs/architecture/` 和 `docs/maintenance/` 查看实施与执行记录

命名规范：

- 统一使用 `YYYY-MM-DD-中文主题名.md`
- 日期使用绝对日期
- 主题名直接描述计划对象与目标，不使用 `final`、`new`、`temp` 之类状态词

书写规范：

- 计划文档优先写“目标、范围、执行项、验收标准”
- 架构实现细节放到 `docs/architecture/`
- 执行过程和验证记录放到 `docs/maintenance/`
- 对外公开发布的计划类内容，以 `apps/web/src/content/posts/` 中的站内文章版本为唯一真源

## 常用命令

```bash
npm run dev
npm run lint
npm run check
npm run build
npm run preview
```

## ESLint 使用步骤

为了让代码更可靠，建议把 ESLint 作为每次改动后的第一道检查。

推荐执行顺序：

1. 开发或修改代码
2. 在仓库根目录执行 `npm run lint`
3. 修复 ESLint 报出的代码问题
4. 再执行 `npm run check`
5. 最后执行 `npm run build`

作用说明：

- `npm run lint`
  - 优先发现未使用变量、可疑写法、无效转义、Astro/TypeScript 规则问题
- `npm run check`
  - 检查更新日志、内容治理、仓库治理规则
- `npm run build`
  - 确认站点最终可以正常构建与发布

日常最小质量门：

```bash
npm run lint
npm run check
npm run build
```

如果只是临时检查单个文件，也可以使用：

```bash
npx eslint apps/web/src/lib/updateLog.ts
```

## 云端部署说明

这一节用于指导把当前 `MyBlog` 项目部署到云端服务器。

当前项目和旧的启动壳工程不同，它是一个已经收口到 `Astro + GitHub Pages` 主链路的单站点仓库，所以云端部署建议优先分成两类：

- 方案 A：继续使用 GitHub Pages 作为正式发布链路
- 方案 B：将当前仓库部署到你自己的云服务器，作为自托管静态站点

如果你后续准备自己上云，建议优先按方案 B 执行。

### 当前项目的云端定位

- 正式站点源码入口：`apps/web/`
- 仓库根目录负责统一脚本、治理规则与部署前检查
- 站点构建产物目录：`apps/web/dist/`
- 发布前最小检查顺序：

```bash
npm run lint
npm run check
npm run build
```

### 建议的云端目录结构

建议在云服务器上使用固定项目目录，例如：

```text
/srv/myblog/
├─ repo/          # 仓库工作目录
├─ scripts/       # 部署脚本
├─ releases/      # 可选，历史构建产物
└─ shared/        # 可选，共享配置
```

其中仓库实际可放在：

```text
/srv/myblog/repo
```

### 云端环境建议

推荐最小环境：

- 系统：Ubuntu 22.04 或更新版本
- Node.js：22.x
- npm：随 Node.js 安装
- Nginx：用于托管静态站点
- Git：用于拉取仓库

推荐先检查：

```bash
node -v
npm -v
git --version
nginx -v
```

### 首次上云部署步骤

#### 1. 登录云服务器

示例：

```bash
ssh <user>@<server-ip>
```

#### 2. 创建项目目录

```bash
sudo mkdir -p /srv/myblog/repo
sudo chown -R $USER:$USER /srv/myblog
cd /srv/myblog/repo
```

#### 3. 拉取仓库

```bash
git clone https://github.com/emptyinkpot/emptyinkpot.github.io.git .
git checkout main
```

如果服务器已经存在仓库，则执行：

```bash
git pull --ff-only origin main
```

#### 4. 安装依赖

当前仓库有根目录依赖，也有 `apps/web/` 子应用依赖，因此两层都要安装：

```bash
npm ci
cd apps/web
npm ci
cd /srv/myblog/repo
```

#### 5. 执行发布前检查

```bash
npm run lint
npm run check
npm run build
```

如果这三步都通过，就说明当前代码已经具备可发布条件。

#### 6. 配置 Nginx 托管构建产物

Astro 构建完成后，正式静态产物在：

```text
/srv/myblog/repo/apps/web/dist
```

一个最小 Nginx 站点配置示例：

```nginx
server {
    listen 80;
    server_name <your-domain>;

    root /srv/myblog/repo/apps/web/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

保存后执行：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 日常更新步骤

以后每次更新站点，建议固定按下面顺序执行：

```bash
cd /srv/myblog/repo
git pull --ff-only origin main
npm ci
cd apps/web && npm ci && cd /srv/myblog/repo
npm run lint
npm run check
npm run build
sudo systemctl reload nginx
```

### 建议写入你自己的服务器信息

后续你正式上云后，建议把下面这些信息补到本节，方便以后自己维护：

- 云服务器 IP：
- SSH 用户：
- SSH 登录命令：
- 项目部署目录：
- Nginx 站点配置文件位置：
- 正式访问域名：
- HTTPS 证书方式：
- 发布命令：

当前已经落地的服务器信息如下：

```text
当前项目对应服务器

- 主机 IP：124.220.233.126
- SSH 用户：ubuntu
- SSH 命令：ssh ubuntu@124.220.233.126
- 轻量服务器地域：ap-shanghai
- 轻量服务器实例 ID：lhins-jqpgc12e
- OpenClaw 项目目录：/srv/openclaw
- MyBlog 项目目录：/srv/myblog
- MyBlog 静态站点目录：/srv/myblog/site
- Nginx 配置：/etc/nginx/sites-available/myblog.conf
- 当前访问地址：https://blog.tengokukk.com/
- HTTP 入口：http://blog.tengokukk.com/
- OpenClaw 健康检查：http://124.220.233.126:5000/health
- HTTPS：已配置，证书由 certbot + Let's Encrypt 签发
```

说明：

- 当前 `MyBlog` 与 `OpenClaw` 已按同级关系部署
- `OpenClaw` 继续占用 `5000` 端口
- `MyBlog` 目前由 Nginx 托管在 `80/443` 端口
- 这次采用的是“本机构建 + 上传 `apps/web/dist` 到服务器”的方式，而不是服务器本地 Git 构建
- `http://blog.tengokukk.com/` 当前会自动跳转到 `https://blog.tengokukk.com/`

### 当前轻量服务器防火墙规则

当前已通过 `tccli lighthouse DescribeFirewallRules --region ap-shanghai --InstanceId lhins-jqpgc12e` 验证到以下规则：

- `TCP 443`：允许，来源 `0.0.0.0/0`
- `TCP 5000`：允许，来源 `0.0.0.0/0`
- `TCP 22`：允许，来源 `0.0.0.0/0`
- `TCP 80`：允许，来源 `0.0.0.0/0`
- `ICMP ALL`：允许，来源 `0.0.0.0/0`
- `TCP 3389`：允许，来源 `0.0.0.0/0`
- `UDP 3389`：允许，来源 `0.0.0.0/0`

当前判断：

- 博客对外访问所需规则已经齐全，核心是 `80/443`
- `5000` 目前仍对公网开放，因为现有 `OpenClaw` 还在直接使用该端口
- `3389` 对这台 Ubuntu 轻量服务器不是当前必需规则，后续可以评估删除

后续建议：

1. 若不再需要公网直连 `5000`，应优先收口到域名或反向代理后再关闭
2. 若没有远程桌面实际用途，可删除 `3389 TCP/UDP`
3. 若不依赖公网 Ping，可评估关闭 `ICMP`

### 云端日常维护命令清单

下面这组命令是当前项目已经实测可用的最小维护清单。

#### 腾讯云资源层

```bash
tccli lighthouse DescribeInstances --region ap-shanghai
tccli lighthouse DescribeFirewallRules --region ap-shanghai --InstanceId lhins-jqpgc12e
tccli lighthouse DescribeDisks --region ap-shanghai
```

#### 服务器连接层

```bash
ssh ubuntu@124.220.233.126
```

#### 服务器内部巡检

```bash
sudo systemctl status nginx
sudo ss -ltnp
curl -I http://127.0.0.1/
curl -k -I https://127.0.0.1/
```

#### 博客站点更新

```bash
npm run lint
npm run check
npm run build
scp -r apps/web/dist/. ubuntu@124.220.233.126:/tmp/myblog-dist-upload
ssh ubuntu@124.220.233.126 "sudo rm -rf /srv/myblog/site/* && sudo cp -r /tmp/myblog-dist-upload/. /srv/myblog/site/ && sudo chown -R www-data:www-data /srv/myblog/site && rm -rf /tmp/myblog-dist-upload"
```

#### 上线后验证

```bash
curl -I http://blog.tengokukk.com/
curl -I https://blog.tengokukk.com/
curl -I http://124.220.233.126:5000/health
```

### 给博客加正式域名怎么做

如果你要给博客加正式域名，推荐按下面顺序操作。

#### 1. 先准备一个域名

例如：

- `blog.example.com`
- `www.example.com`

推荐优先用独立子域名，不要先和现有项目抢同一个根域。

#### 2. 在域名服务商处添加 DNS 解析

最常见做法是加一条 `A` 记录：

```text
主机记录：blog
记录类型：A
记录值：124.220.233.126
```

如果你想让根域直接访问，也可以把根域 `@` 指向这台服务器，但这通常要结合你整体站点规划再决定。

#### 3. 修改 Nginx 配置中的 `server_name`

当前配置文件位置：

```text
/etc/nginx/sites-available/myblog.conf
```

将：

```nginx
server_name _;
```

改成：

```nginx
server_name blog.example.com;
```

如果你要同时支持多个域名，也可以写成：

```nginx
server_name blog.example.com www.example.com;
```

改完后执行：

```bash
sudo /usr/sbin/nginx -t
sudo systemctl reload nginx
```

### 给博客加 HTTPS 怎么做

当前服务器已经装好了 Nginx，所以下一步最常见、也最推荐的方案是：

- 使用 `certbot`
- 让 Let’s Encrypt 自动签发证书
- 由 Nginx 托管 HTTPS

#### 1. 安装 certbot

Ubuntu 常用命令：

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
```

#### 2. 确保域名已经解析到服务器

在申请证书前，必须先保证：

- `blog.example.com` 已经指向 `124.220.233.126`

可以本地检查：

```bash
nslookup blog.example.com
```

或：

```bash
ping blog.example.com
```

#### 3. 申请并自动写入 HTTPS 配置

```bash
sudo certbot --nginx -d blog.example.com
```

如果你还有 `www` 域名：

```bash
sudo certbot --nginx -d blog.example.com -d www.example.com
```

执行后，通常会自动完成：

- 证书申请
- Nginx HTTPS 配置写入
- HTTP 跳转 HTTPS

#### 4. 验证 HTTPS

证书成功后，可检查：

```bash
curl -I https://blog.example.com
```

也可以浏览器直接访问：

```text
https://blog.example.com
```

### HTTPS 配置后的推荐状态

理想状态建议变成：

```text
MyBlog
- http://124.220.233.126/         # 可选，作为临时入口
- https://blog.example.com        # 正式入口

OpenClaw
- http://124.220.233.126:5000     # 当前服务入口
```

### 后续建议

- 博客正式对外入口尽量使用域名 + HTTPS
- 服务器 IP 只作为运维调试入口，不建议长期作为正式访问地址
- 等博客域名稳定后，再决定是否要给 `OpenClaw` 也加单独域名或反向代理入口

### 回滚建议

如果某次更新后站点异常，建议至少保留一种回滚方式：

- 方式 1：回退 Git 提交后重新构建
- 方式 2：保留上一版 `dist/` 产物并切回

最简单的回滚方式：

```bash
cd /srv/myblog/repo
git log --oneline -5
git checkout <previous-commit>
npm run build
sudo systemctl reload nginx
```

### 当前部署口径

当前项目的正式部署口径是：

- 仓库主分支：`main`
- 正式站点源码：`apps/web/`
- 正式构建产物：`apps/web/dist/`
- 发布前质量门：`npm run lint` -> `npm run check` -> `npm run build`
- 当前正式访问入口：`https://blog.tengokukk.com/`

如果后续你改为完全云端自托管，可以继续保留 GitHub 仓库作为代码真源，但把服务器作为正式访问入口。

## 每次更新规范

这一节用于统一“从开始改代码，到最终合并发布”的标准流程。

建议以后每次更新都按这个顺序执行，不要跳步。

新增协作要求：

- 只要本次改动已经确认要保留，就不能只停留在本地，必须继续完成上传云端
- 这里的“上传云端”默认指至少完成一次远端推送，并触发正式发布链路或同步到当前服务器
- 如果当次无法上传，必须明确说明阻塞原因，不能默认把未发布状态当作完成
- 对 Codex / 协作代理的默认要求也是一样：每次完成改动后，除非用户明确阻止，否则应继续执行上传与发布动作

### 1. 开始改动前

- 先确认当前工作分支，不直接在长期脏分支上继续叠改
- 默认从 `main` 拉最新代码，再切出功能分支
- 分支命名建议使用：
  - `feat/<topic>`
  - `fix/<topic>`
  - `docs/<topic>`
  - `refactor/<topic>`
  - `chore/<topic>`

推荐命令：

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feat/<topic>
```

### 2. 开发或修改内容

- 代码改动优先落到正式目录
- 站点代码统一放在 `apps/web/`
- 工程文档统一放在 `docs/`
- 公开发布内容统一放在 `apps/web/src/content/posts/`
- 工具脚本统一放在 `tools/`

静态资源约定：

- 站点运行时图片统一放在 `apps/web/public/images/`
- 品牌资源统一放在 `apps/web/public/images/branding/`
- 首页或全局背景资源统一放在 `apps/web/public/images/home/`
- 文章配图或文章专属公开图片统一放在 `apps/web/public/images/posts/<slug>/`
- 仅供文章源码引用的局部素材，优先放在 `apps/web/src/content/posts/assets/<slug>/`
- 不再直接使用、但需要保留的备份图片，统一放在 `apps/web/public/images/branding/archive/` 或对应资源目录下的 `archive/`
- 代码、内容和设计文件中的图片引用，应优先指向上述正式目录，不要继续引用仓库根目录散落文件
- 仓库根目录不应长期存放图片；下载图、导出图、临时截图在整理后要移动到正式目录或删除

禁止做法：

- 不要新建 `temp`、`copy`、`final`、`backup` 之类的临时文件名长期保留
- 不要把运行产物、调试文件、临时副本提交进仓库
- 不要在没有真实脚本时，只为了“以后可能会用”就先建空目录占位

### 3. 本地第一道检查：ESLint

代码改完后，先执行：

```bash
npm run lint
```

如果只想临时检查某个文件，可以执行：

```bash
npx eslint apps/web/src/lib/updateLog.ts
```

要求：

- 先修完 ESLint 报错，再进入下一步
- 不要带着已知 lint 问题继续提 PR

### 4. 第二道检查：仓库治理

执行：

```bash
npm run check
```

这一层主要检查：

- 更新日志结构
- 内容治理规则
- 仓库治理规则

要求：

- `npm run check` 必须通过
- 如果是文档、文章、更新日志变更，这一步尤其不能省

### 5. 第三道检查：构建验证

执行：

```bash
npm run build
```

要求：

- 构建通过后，才说明当前版本具备发布条件
- 如果是站点页面、内容路由、Astro 配置相关改动，这一步必须执行

### 6. 提交前自查

提交前建议先看：

```bash
git status --short
git diff --stat
```

确认点：

- 只包含本次主题相关文件
- 没有临时文件
- 没有空文件
- 没有无关目录改动
- 没有误提交的副本文件

### 7. 提交规范

提交信息保持简洁明确，推荐使用：

- `feat: ...`
- `fix: ...`
- `docs: ...`
- `refactor: ...`
- `chore: ...`

示例：

```bash
git add .
git commit -m "feat: add root ESLint workflow and publishing guide"
```

要求：

- 一次提交只解决一组明确问题
- 不要把 unrelated 改动混进同一个 commit

### 8. 推送与 PR 规范

默认协作方式是：

- `feature branch + Pull Request`

推送分支：

```bash
git push -u origin <branch-name>
```

如果当前环境已经安装 `gh`，推荐在推送前先确认：

```bash
gh auth status
gh repo view emptyinkpot/emptyinkpot.github.io
```

PR 规则：

- 目标仓库默认是 `https://github.com/emptyinkpot/emptyinkpot.github.io`
- 目标分支默认是 `main`
- PR 标题必须中英双语、简洁明确
- PR 描述必须中英双语
- PR 描述必须写明：
  - 摘要 / Summary
  - 变更内容 / Changes
  - 验证结果 / Verification
  - 风险与备注 / Risks & Notes

### 9. PR 必填验证项

正常情况下，PR 里至少应写清下面这些执行结果：

- `npm run lint`
- `npm run check`
- `npm run build`

如果某一步没执行，也必须明确写原因，不能省略不写。

### 10. 合并后收尾

PR 合并后建议立即做收尾清理：

```bash
git checkout main
git pull --ff-only origin main
git branch -D <branch-name>
git fetch --prune origin
```

目标：

- 删除本地功能分支
- 清理远端已删除分支的跟踪引用
- 保持本地和远端 `main` 同步

### 11. 发布前最小质量门

如果这次更新会影响正式站点或正式文档发布，最少必须保证：

```bash
npm run lint
npm run check
npm run build
```

然后再执行：

- 推送分支
- 发起 PR
- 合并到 `main`
- 按需同步到云端服务器

### 12. 一条完整示例流程

```bash
git checkout main
git pull --ff-only origin main
git checkout -b feat/<topic>

# 修改代码或文档

npm run lint
npm run check
npm run build

git status --short
git diff --stat
git add .
git commit -m "feat: <summary>"
git push -u origin feat/<topic>

# 发起 PR，填写中英双语说明和验证结果

gh auth status
gh pr create

git checkout main
git pull --ff-only origin main
git branch -D feat/<topic>
git fetch --prune origin
```

## README 约束

`README.md` 必须和当前工程保持真实映射关系，不能脱离仓库现状单独演化。

执行约束如下：

- README 中写到的目录，必须在仓库中真实存在
- README 中写到的命令，必须在当前工程里真实可执行
- README 中写到的部署链路，必须和当前项目实际发布方式一致
- README 中写到的工具、脚本、校验项，必须能在仓库里找到对应入口
- README 中写到的规范，必须和当前工程结构、PR 流程、发布流程一致

禁止做法：

- 不要把其他项目的说明直接复制进当前 README
- 不要保留已经失效的旧路径、旧目录、旧命令
- 不要写“未来可能会这样”的假定结构，除非明确标注为规划
- 不要在 README 中维护和实际工程不一致的云端信息、构建信息或发布信息

推荐做法：

- 每次改动目录结构、命令入口、部署方式后，同步检查 README 是否需要更新
- 每次提交 README 改动前，至少核对一次对应目录、脚本、命令是否真实存在
- 如果内容属于规划而不是现状，应优先写入 `docs/plans/`，而不是伪装成 README 中的现行说明

## 文档索引

- 工程文档总入口：`docs/README.md`
- 总规划：`docs/plans/update-plan.md`
- 架构方案：`docs/architecture/astro-blog-redesign-plan.md`
- 执行清单：`docs/architecture/astro-blog-redesign-checklist.md`
- 维护记录：`docs/maintenance/README.md`
