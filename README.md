---
title: MyBlog
status: canonical
---

# MyBlog
## 总体设计与实施手册

MyBlog is not a blog homepage. It is a mixed-object Knowledge Runtime Surface. Preserve feed continuity, drawer reading, and collection-as-lens behavior.

Runtime Constitution entrypoints:

- `AI_RULES.md`
- `project.frontend-runtime-contract.json`
- `contracts/frontend-runtime-contract.json`
- `contracts/runtime-authority-map.json`
- `contracts/object-projection-contract.json`
- `contracts/collection-behavior-contract.json`
- `philosophy/FRONTEND_DESIGN_PHILOSOPHY.md`
- `topology/SYSTEM_TOPOLOGY.md`
- `adr/ADR-001-collections-are-lenses-not-pages.md`

> 版本定位：本文件是 MyBlog 的唯一真源、项目说明入口与工程手册主文档。
> 文档策略：正文先给出项目说明、结构与边界，再展开运行、开发、发布与维护规则。
> 冲突处理：若本文件与任何派生文档冲突，以本文件为准；派生文档只允许补充，不允许重定义项目边界。

## 0. 项目说明入口

```yaml
projectName: MyBlog
canonicalDoc: README.md
machineReadableEntry: project.json
remoteFirstSourceRoot: ubuntu@124.220.233.126:/srv/myblog/repo
localSourceRoot: null
siteAppRoot: /srv/myblog/repo/apps/web
authoringTruthRoot: E:\Vaults\Obsidian
activeArticleTruth: /srv/myblog/repo/public-data/runtime\content-index.json
runtimeTruth: MySQL via apps/admin-next
fileTruth: E:\Vaults\Obsidian -> Syncthing -> Linux /home/vault/Obsidian hot mirror
publicContentAccess: https://blog.tengokukk.com/openlist/Obsidian/
openListLocalMount: /Obsidian -> /home/vault/Obsidian
openListPublicRoots: /Obsidian,/腾讯云COS,/夸克网盘
storageBoundary: hot runtime stays on local SSD; OpenList/COS/Quark are public access, blob backend, cold archive, and content address space only
contentRoots:
  - /srv/myblog/repo/apps/web\src\content\notes
  - /srv/myblog/repo/apps/web\src\content\projects
  - /srv/myblog/repo/apps/web\src\content\pages
buildOutputRoot: /srv/myblog/repo/apps/web\dist
docsEntrypoints:
  frontendRuntimeAudit: /srv/myblog/repo/docs/frontend-runtime-audit.md
  frontendRuntimeConvergence: /srv/myblog/repo/docs/frontend-runtime-convergence.md
  runtimeExperienceLayer: /srv/myblog/repo/docs/runtime-experience-layer.md
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
  openListEmbed: https://blog.tengokukk.com/openlist/
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
- 远端源码真相源：`ubuntu@124.220.233.126:/srv/myblog/repo`
- 站点应用：`/srv/myblog/repo/apps/web`
- 写作母库真源：`E:\Vaults\Obsidian`
- 服务器热镜像：`/home/vault/Obsidian`
- 公开内容入口：`https://blog.tengokukk.com/openlist/Obsidian/`
- OpenList 本地挂载：`/Obsidian -> /home/vault/Obsidian`
- OpenList 公开 roots：`/Obsidian,/腾讯云COS,/夸克网盘`
- 存储边界：热运行层固定在服务器本地 SSD；OpenList / COS / 夸克只做公开访问、blob 后端、冷归档和统一资源地址空间，不能当系统盘、数据库盘、Syncthing 热镜像、`/srv/myblog`、`node_modules`、Astro dist 或 Pagefind 底层。
- 新文章真源：`/srv/myblog/repo/public-data/runtime\content-index.json`
- 历史归档：`/srv/myblog/repo/apps/web\src\content\posts`
- 本地构建产物：`/srv/myblog/repo/apps/web\dist`
- 对外入口：`https://blog.tengokukk.com/`
- 史料库入口：`https://blog.tengokukk.com/evidence-library/`
- OpenList 嵌入入口：`https://blog.tengokukk.com/openlist/`
- 项目工坊入口：`https://blog.tengokukk.com/projects/`
- 显示设置入口：`https://blog.tengokukk.com/settings/`
- Android TWA 配置：`/srv/myblog/repo/apps/android-shell\twa.contract.json`
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
| 远端源码目录 | `ubuntu@124.220.233.126:/srv/myblog/repo` |
| 服务器目录 | `/srv/myblog/site` |
| 分支策略 | 默认 `feature branch + Pull Request`；非紧急情况不直接改 `main` |
| 版本控制职责 | GitHub 负责历史与协作；远端源码工作区负责开发与构建；服务器 `/srv/myblog/site` 负责静态运行 |

### 0.3.0 Remote IDE / 操作规范

MyBlog 与 Mortis 使用同一类 remote-first 仓库分布模式：

```text
GitHub
  <-> ubuntu@124.220.233.126:/srv/myblog/repo
  -> npm run check:workspace
  -> npm run check:governance
  -> npm run deploy:site
  -> /srv/myblog/site
```

- 默认远程 IDE / 编辑根：`ubuntu@124.220.233.126:/srv/myblog/repo`。
- 默认部署目标：`ubuntu@124.220.233.126:/srv/myblog/site`。
- 服务器 GitHub 写入不依赖全局 `~/.gitconfig` 或 `~/.ssh/config`；`/srv/myblog/repo` 必须使用 repo-local `core.sshCommand`，绑定 `/home/ubuntu/.ssh/myblog_source_ed25519`。
- 本机 `E:\My Project\MyBlog` 已退役；后续如果出现本地 checkout，只能作为镜像、阅读面或 SSH 故障时的 GitHub 交付面，不能作为 canonical workspace。
- SSH 不可用时，不能把本地镜像升格为真源；应记录为服务器入口故障，并在 SSH 恢复后 fast-forward 或重新 clone `/srv/myblog/repo`。

### 0.3.1 复刻当前系统的最小手册

这一节用于让另一个开发者在不了解历史对话的情况下复刻当前 MyBlog。它只写当前已验证路径，不写未落地设想。

#### 本地目录与依赖

```bash
git clone https://github.com/emptyinkpot/emptyinkpot.github.io.git MyBlog
cd MyBlog
npm ci
npm --prefix apps/web ci
npm --prefix apps/admin-next ci
```

要求：

- Node.js 使用 22.x；`apps/web/package.json` 要求 `>=22.12.0`。
- 前台站点源码在 `apps/web/`；生产 API / admin runtime 在 `apps/admin-next/`。
- 不要把 `apps/web/dist/`、`.next/`、`.runtime/`、服务器 release 目录当作源码真源。

#### 服务端环境变量

生产服务器需要 `/etc/myblog-admin-next.env`，最小结构如下。这里只列 key，不在 README 写真实 secret。

```env
PORT=4117
NODE_ENV=production

GITHUB_TOKEN=
GITHUB_OWNER=emptyinkpot
GITHUB_BRANCH=main

MYBLOG_DB_HOST=
MYBLOG_DB_PORT=
MYBLOG_DB_USER=
MYBLOG_DB_PASSWORD=
MYBLOG_DB_NAME=

OPENLIST_BASE_URL=http://127.0.0.1:5244
OPENLIST_API_PREFIX=/openlist
```

规则：

- `GITHUB_TOKEN`、`MYBLOG_DB_PASSWORD`、OpenList token、网盘 cookie 不得进入前端 bundle、README、提交记录或截图。
- MySQL 信息只由 `apps/admin-next` 读取；前台只调用同域 `/api/runtime/*`。
- OpenList 原始服务可以在服务器本机 `127.0.0.1:5244`，公开查看入口必须通过同域 `/openlist/` 反代。

#### 本地构建验证

```bash
npm run lint
npm run check
npm run build
npm run admin:build
```

`npm run build` 产出 `apps/web/dist/`；`npm run admin:build` 产出 `apps/admin-next/.next/`。

#### 生产目录

当前线上目录固定为：

```text
/srv/myblog/site                         Astro 静态站点目录
/srv/myblog/admin-next/releases/<stamp>  admin-next release 目录
/srv/myblog/admin-next/current           指向当前 release 的 symlink
/etc/myblog-admin-next.env               生产 API 环境变量
myblog-admin-next.service                systemd 服务
```

Nginx 必须满足：

```text
https://blog.tengokukk.com/          -> /srv/myblog/site
https://blog.tengokukk.com/api/*     -> http://127.0.0.1:4117/api/*
https://blog.tengokukk.com/openlist/ -> http://127.0.0.1:5244/
```

静态路由规则：MyBlog 是 Astro static site，不是 SPA。Nginx 的通用 `location /` 必须使用 `try_files $uri $uri/index.html =404;`，不得把未知路径兜到 `/index.html`。不存在的 `/collections/topic-*`、旧文章路径或任意未生成路由必须返回 404，否则会把首页伪装成有效页面，破坏 Runtime Projection 和 topic collection 的真实性。

#### 发布步骤

前台发布：

```bash
cd /srv/myblog/repo
npm run check:workspace
npm run check:governance
npm run deploy:site
```

`npm run deploy:site` is the guarded publish path. It builds `apps/web/dist`, uploads through the expected temporary directory, and preserves `/srv/myblog/site/runtime`. Do not replace it with manual `tar`, `scp`, or ad hoc `rsync` from a local or unchecked worktree.

API 发布：

```bash
npm run admin:build
tar --exclude='./node_modules' -czf myblog-admin-next.tgz -C apps/admin-next .
scp myblog-admin-next.tgz ubuntu@124.220.233.126:/tmp/
ssh ubuntu@124.220.233.126 'set -e; rel=/srv/myblog/admin-next/releases/<stamp>; sudo mkdir -p "$rel"; sudo tar -xzf /tmp/myblog-admin-next.tgz -C "$rel"; sudo chown -R ubuntu:ubuntu "$rel"; cd "$rel"; npm ci --omit=dev; sudo ln -sfn "$rel" /srv/myblog/admin-next/current; sudo systemctl restart myblog-admin-next.service; sleep 3; systemctl is-active myblog-admin-next.service'
```

部署前如果服务器磁盘接近满载，先清理旧 release 和旧 `/tmp/myblog-*.tgz`，但保留 `readlink -f /srv/myblog/admin-next/current` 指向的当前 release。

#### 复刻验证

```bash
curl -I https://blog.tengokukk.com/
curl -I https://blog.tengokukk.com/books/
curl -sS https://blog.tengokukk.com/api/openlist/status
curl -sS https://blog.tengokukk.com/api/runtime/reader/memory?limit=1
curl -sS https://blog.tengokukk.com/api/runtime/reader/highlights?limit=1
ssh ubuntu@124.220.233.126 'systemctl is-active myblog-admin-next.service && df -h /'
```

预期：

- `/` 与 `/books/` 返回 200。
- `/api/runtime/reader/memory` 与 `/api/runtime/reader/highlights` 返回 `{"ok":true,...}`。

#### Android TWA 复刻

当前 Android 是 PWA/TWA shell，不是第二套客户端。生成真源是 `apps/android-shell/twa.contract.json`，产物在 `.runtime/android-twa/`，该目录是可丢弃构建输出。

```bash
npm run android:twa:validate
npm run android:twa:build:test-signed
adb install .runtime/android-twa/app-release-signed.apk
adb shell pm verify-app-links --re-verify com.tengokukk.myblog
adb shell pm get-app-links com.tengokukk.myblog
```

`blog.tengokukk.com` 必须显示 `verified`。当前 Android shell 的业务真源仍是线上 Web Runtime；这台 MIUI 设备上 Bubblewrap 的 browserhelper 启动链会停在启动页，因此生成配置使用 `launcherMode: webview-shell`，用极薄 WebView Activity 直接加载线上站点，不复制 OpenList、搜索、Graph 或 Reader 业务逻辑。
- 首次访问 Runtime API 会自动确保 `reader_memory` 与 `reader_highlights` 两张表存在。
- 书架新增书籍来自 OpenList 当前配置的书籍目录，默认 `/Obsidian/docs/books/original`；旧 `/夸克网盘/obsidian/data/docs/books/original` 已删除，不得再作为书籍或文章来源。封面来自 `public-data/openlist-covers/manifest.json` 和已落盘真实封面缓存，不在访客访问时临时解析。

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
站点壳代码更新
  ↓
/srv/myblog/repo
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

Obsidian 内容更新
  ↓
Syncthing / server-side vault sync
  ↓
/home/vault/Obsidian/docs
  ↓
server-side runtime projector
  ↓
runtime/content-index.json
  ↓
OpenList public identity: /openlist/Obsidian/docs/...
  ↓
SSE / runtime fetch
  ↓
首页卡片 / Runtime Reader
```

- `ubuntu@124.220.233.126:/srv/myblog/repo` 是 canonical 远端源码工作区。
- `apps/web/` 是唯一正式站点入口。
- `apps/admin-next/` 是当前生产 API / admin runtime 根目录；线上由 `myblog-admin-next.service` 监听 `127.0.0.1:4117`，Nginx 将 `https://blog.tengokukk.com/api/*` 代理到该服务。
- `apps/web/dist/` 是当前正式静态构建产物目录。
- `/srv/myblog/site` 是当前云端静态运行目录。
- `https://blog.tengokukk.com/` 是当前唯一公开站点入口。

### 0.5.2 Content And Build Truth

- Content Source Base 当前收束为五层：Windows Vault `E:\Vaults\Obsidian` 是唯一可编辑写作真源，Linux `/home/vault/Obsidian` 是 Syncthing 热镜像，OpenList `/openlist/Obsidian/` 是统一公开内容入口，`content-index.json` 是面向前端的派生索引，Astro 只做 UI Shell。
- Vault File Truth / Obsidian 文件真源是本机 `E:\Vaults\Obsidian`；服务器 `/home/vault/Obsidian` 只是热镜像，OpenList 是公开文件访问层，不是第二内容系统。
- Authoring Truth / 写作母库真源是 `E:\Vaults\Obsidian`，服务器投影输入是 `/home/vault/Obsidian/docs`；它承载长期原稿、私人笔记、资料、草稿、附件引用和未发布知识，不直接等同公开博客。
- Article Truth / 文章真源只有一条：`public-data/runtime/content-index.json` 承载 Obsidian/OpenList 的 Runtime MarkdownObject 投影。首页 Feed、文章列表、`/posts/[slug]/`、RSS、分类、标签、专题、Knowledge search 和 Graph 都从这里派生，不能直接遍历整个 OpenList docs 目录。
- Books Truth / 书籍存在性可以来自 OpenList 旧书籍目录或 COS 文件索引；这只适用于 `/books/` 文件对象，不得外推为博客文章、Obsidian 写作母库或 Runtime MarkdownObject 的第二真源。
- Content Root Truth / 站点内容根是 `apps/web/src/content/`，正式集合边界是 `notes`、`projects`、`pages`；公开文章不再注册 Astro content collection。
- OpenList 是统一 Public Content Access / 公网文件入口，不是 CMS，也不决定文章 existence；Vault 同步必须优先走成熟文件系统同步层：Obsidian local vault -> Syncthing / Obsidian Sync -> Linux `/home/vault/Obsidian`。MyBlog 不上传 Vault 文件、不通过 scp 同步正文、不重造双向同步协议。
- MySQL 是 Runtime Truth / 运行时状态层，不承载文章正文真源；它只保存阅读记忆、高亮、批注、关系、历史、贴纸和后续 Graph runtime。
- Obsidian 到网站之间必须存在 Runtime Projection：Linux `/home/vault/Obsidian/docs` -> default-project all public Markdown -> normalize -> render Markdown with shared prose pipeline -> write `/srv/myblog/site/runtime/content-index.json` -> SSE -> homepage cards / Runtime Reader refresh。当前临时策略是“都显示”：`docs` 下 Markdown 默认进入 Runtime MarkdownObject；只有 `draft: true`、`published: false`、`visibility: private/draft` 或 `private/drafts/assets/.obsidian` 等硬私有路径会被排除。普通 Obsidian 内容变更不得触发 Astro build、Pagefind、scp 或全站 deploy；只有站点壳代码、路由或静态资源变化才走 `npm run deploy:site`。
- Runtime MarkdownObject 是公开文章进入前端前的唯一对象模型，必须包含 `sourcePath`、`openlistPath`、`openlistUrl`、`sourceRoot: "vault"`、`kind`、`folderTags`、`visibility`、`published`、`runtimeFeed`、`relations` 和 `card`。`sourcePath` 只表示内部热镜像路径；`openlistPath/openlistUrl` 才是前端公开来源入口。卡片 UI 只能读取 `MarkdownObject.card.eyebrow / card.chips / card.subtitle`，禁止首页、列表页或组件自己从 `tags/categories` 临时生成展示标签。
- 当前 `tags/categories/folderTags/card.chips` 只是 `derivedTaxonomy`：来源限于 frontmatter、文件夹路径和 Obsidian wikilink，属于 filesystem/frontmatter/wikilink 派生，不是 AI 语义标签、ontology、embedding cluster 或知识图谱真源。
- AI Semantic Pipeline 当前是 `active-sidecar-generator`：只允许写 `*.semantic.json` sidecar，例如 `foo.md -> foo.semantic.json`；sidecar 可包含 `entities/topics/relations/collections/clusters/model/generatedAt`，但永远是 projection，不得回写 Markdown 正文或 frontmatter，不得覆盖 `tags/categories` 的人工显式字段。2026-05-08 已用云端 `sub2api.tengokukk.com` 的 `coze-glm-shell` / `Coze GLM` 跑通一篇有效 sidecar，runtime projection 已读为 `semantic.status=active`。
- KnowledgeCollection 是 Runtime MarkdownObject 之上的阅读上下文层：文章、视觉、书籍、项目和 repo 后续都应先进入 Collection，再投影到首页、Graph、Search、Reader 或 Gallery。首页的 canonical surface 是混合对象瀑布流和 feed tabs，默认 tab 必须是 `all`，不得让 Collection 接管首页或把 feed 退化成 collection-only 目录。首页 collection card 只是 runtime lens：点击打开 Reader Drawer / Reading Session，背景 masonry、tabs 和 scroll context 必须保持活着。当前文章正文是中心，集合目录是上下文轨道；集合内切换文章不得 full reload，只允许 Drawer 内切换并用 URL state 同步。首页 Drawer 的 Collection 模板必须使用 `.home-reader-session`：不得渲染 collection hero、stats、summary card、object card grid 或 `.home-drawer-summary` 卡片递归。`/collections/` 是备用集合入口列表，不能替代首页；`/collections/[slug]/` 只为 folder / series collection 生成独立 Reading Session Surface；topic collection 只保留为 metadata / search / Graph 维度，默认不得预渲染成静态集合页。
- Runtime 构建边界：`apps/web/public/runtime/content-index.json` 是前端 metadata index，供首页、集合入口、标签、分类、RSS、Graph 和搜索索引使用；正文、预渲染 `html` 和 `toc` 只能从 `/runtime/articles/*.json` 单篇 detail payload 读取。不得让通用页面在 build-time 读取 70MB+ full index，也不得让 Collection Reading Session 退回卡片目录或跳转 `/posts/` 才能阅读。
- Markdown Presentation Truth 是 `apps/web/src/lib/markdown/pipeline.ts` 与 `apps/web/src/styles/global.css` 的 `.prose-shell`。Runtime MarkdownObject 文章必须使用同一套 rehype pipeline：GFM table、Obsidian callout、table wrapper、rehype-pretty-code/Shiki、heading slug 和 prose typography；Quartz 只作为 Markdown rendering system 参考，不整体替换 MyBlog 站点。
- `docs/` 承担工程文档、规划、架构与维护记录，不作为公开文章真源的并列写作面。
- 当前发布模式是“本地构建 -> 上传 `apps/web/dist/` -> Nginx 托管”，不是服务器内 Git 构建。
- 当前 `apps/admin-next/` 承载 GitHub runtime API、OpenList 代理 / 索引 / 封面预热，以及 MySQL Reader Runtime API；验证命令是 `npm run admin:build`，线上发布物位于 `/srv/myblog/admin-next/releases/*` 并通过 `/srv/myblog/admin-next/current` 切换。
- 当前 `public-data/evidence-library/` 是史料素材库的数据真源；`apps/admin-next/app/admin/evidence-library/` 已具备 OpenList 扫描入队和 Remotion manifest 导出原型。

#### 0.5.2a Content Infrastructure Reduction Lane

- MyBlog 当前已经进入 Content Infrastructure 范畴；`content-index.json`、RSS prerender、OpenList projection、atomic write、watcher 和 deploy glue 都属于基础设施问题，不应继续无边界自研。
- 当前 active 线仍是 Runtime MarkdownObject：`public-data/runtime/content-index.json` 与 `/srv/myblog/site/runtime/content-index.json` 是公开文章投影索引；但它只能作为过渡 projection，不得继续膨胀成 JSON database、搜索引擎、CMS 或文件同步协议。
- Quartz 是第一候选底座：优先研究 / fork / 接入 `jackyzha0/quartz` 的 Obsidian Markdown pipeline、wikilink、backlink、graph、RSS、search、SPA/incremental 和 content index 思路；未完成迁移前，Quartz 只允许写成 `candidate-not-integrated`，不得写成 active site engine。
- Contentlayer 是 Astro-native 候选：如果继续保留 Astro 前台，应优先评估 Contentlayer 或同级 typed content pipeline 来替代自写 schema / watch / projection glue；未安装接入前状态是 `candidate-not-installed`。
- Meilisearch 是搜索目标：动态对象、OpenList 文件索引、KnowledgeObject snapshot、Directus metadata 和 Immich import 的搜索不得继续塞进 giant runtime JSON；上线前 Pagefind 只叫静态 archive 搜索，不叫全站统一搜索。
- Coolify 是部署候选：当前部署仍是 `npm run deploy:site`；后续应评估 Coolify 接管 Git deploy、env、healthcheck、rollback、cron 和 compose，减少手写 SSH / PowerShell quoting / smoke glue。未部署前不得写成 active deployment platform。
- OpenList 只保留冷层和公开文件入口：`/Obsidian` 是 Linux hot mirror 的 public access identity，`/腾讯云COS` 和 `/夸克网盘` 是 blob / cold archive backend；OpenList 不参与 runtime build、projection authority、数据库、Pagefind、Astro dist、Syncthing 热镜像或 node_modules。
- 禁止新增新的自研 watcher、构建同步器、RSS 竞态补丁、搜索 JSON、部署 wrapper 或 “runtime governance” 文件来掩盖成熟系统应接管的问题。下一步必须先写迁移计划和 readiness evidence，再 clone / install / start 外部系统。

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

- 当前内容系统分层：文章只读 Runtime MarkdownObject；`notes`、`projects`、`pages` 仍是 Astro content collections。
- 旧 Astro posts collection 已移除。
- `notes` 承担轻量记录；`projects` 承担项目索引；`pages` 承担独立页面内容。
- `evidence-library` 承担史料素材、待标注队列、OpenList 路径、Remotion 导出 manifest 的结构化数据。
- 当前标签页、分类页、系列页都建立在 Runtime MarkdownObject 元数据之上，而不是独立索引服务。
- Obsidian Vault 是认知空间；MyBlog 是发布空间。Obsidian Markdown 中的 `[[双链]]`、附件路径、私有笔记、未发布草稿和碎片笔记必须经过 Normalize Layer 后才允许进入 Runtime MarkdownObject index。
- Normalize Layer 必须处理：frontmatter 补全、slug 稳定化、`draft` / `published` 过滤、Obsidian 双链解析、附件引用迁移、图片公开路径重写、标签归一化、摘要生成或校验。
- Quartz 4、Logseq Publish、Obsidian Publish 和 TinaCMS 只作为 Content Pipeline / Git-backed editing 的参考系统；MyBlog 保留 Astro 前端和现有视觉系统，不整体替换为这些项目。

### 0.5.6 Runtime Services Truth

- 生产服务端 API 由 `apps/admin-next/` 构建，线上 systemd 服务名是 `myblog-admin-next.service`。
- 生产服务环境文件是 `/etc/myblog-admin-next.env`；该文件只能放在服务器上，不进入 Git。
- `GITHUB_TOKEN` / `GH_TOKEN` 只供 `apps/admin-next/app/api/github/**` 与项目写回 API 使用。
- `MYBLOG_DB_HOST`、`MYBLOG_DB_PORT`、`MYBLOG_DB_USER`、`MYBLOG_DB_PASSWORD`、`MYBLOG_DB_NAME` 只供 MySQL Runtime Layer 使用。
- OpenList 前台入口是同域 `/openlist/` iframe；文件 API、raw 文件读取、索引重建和封面预热统一走 `/api/openlist/*`，不让前台直连 `127.0.0.1:5244` 或公网 OpenList 端口。
- 腾讯云 COS 是 OpenList 的对象存储扩展层，不是数据库盘，也不是 Immich / Postgres 的主文件系统。COS 负责书籍原件、视觉素材原图、视频和归档文件；服务器本地盘只保留索引、封面 / 页面缓存、数据库和运行时缓存。
- Reader Runtime 当前已落地两张 MySQL 表：`reader_memory` 与 `reader_highlights`。`apps/admin-next/lib/runtime-db.js` 是 schema canonical owner。

### 0.5.7 Architecture Codex Truth

- `/codex/` 是 MyBlog 的 Architecture Codex / 系统设计档案入口，不是普通博客列表，也不是 README 的重复。
- Codex 数据真源是 `apps/web/src/data/architectureCodex.ts`；页面入口是 `apps/web/src/pages/codex/index.astro` 与 `apps/web/src/pages/codex/[slug].astro`。
- README 只保留系统合同、复刻步骤和 canonical 规则；设计考古、拒绝方案、运行时取舍、未来方向和术语表必须沉淀到 Codex。
- 每个 Codex entry 必须包含：`Inspiration`、`Rejected`、`Runtime`、`Tradeoff`、`Future Direction`、`Related Systems`。没有这些字段的新功能只能算临时 UI，不算长期架构。
- 每次更新 `apps/web/` 的前端 UI、交互、阅读器、视觉系统、首页信息架构或 frontend runtime，都必须同步刷新对应 Codex entry，保证 `/codex/` 是新鲜的、可复刻的、经过长期打磨的系统设计档案。不能只改源码不改 Codex。
- 开始修改前端文件前，必须先在对话里用文字说明正在改动什么、为什么改、将同步哪一个 Codex entry / README section；如果本次前端改动确实不需要更新 Codex，也必须先说明原因。
- 现有 Codex entry：`frontend-runtime-archaeology`、`frontend-runtime-convergence`、`runtime-experience-layer`、`reader-system`、`runtime-architecture`、`content-pipeline`、`composable-service-stack`、`knowledge-runtime`、`visual-system`、`design-language`、`collection-stack`。
- Codex 术语是项目词汇系统的真源，例如 `Runtime Kernel`、`Runtime Experience Layer`、`Interactive Object`、`Spatial Layer`、`Reader Pool`、`Knowledge Runtime`、`Book Object`、`Collection Stack`、`Editorial Metadata`。后续 AI 维护代码前，应优先读取相关 Codex entry，而不是从聊天记录推断。
- `docs/frontend-runtime-audit.md` 是前端运行时考古入口；它按用户行为 -> DOM -> event -> state -> render -> hydration -> network -> animation -> authority -> fallback 追踪系统，不允许只用组件树解释前端。
- `docs/frontend-runtime-convergence.md` 是前端运行时收束入口；新增全局快捷键、overlay、drawer、custom event、localStorage key 前，必须写清当前 owner、目标 owner、fallback owner 和 storage classification。
- `docs/runtime-experience-layer.md` 是交互质感和 runtime coherence 入口；新增 Drawer/Search/Overlay/Visuals/Graph 动效或组件库前，必须写清它属于 Spatial Layer、Interactive Object、Continuous Surface 还是 Command Runtime。

## 0.6 Constraint Layer

本层只写硬约束、禁止行为和系统不变量。

### 0.6.1 Forbidden Actions

- 不要把旧临时 working copy、静态快照目录或归档目录重新当作活跃源码仓。
- 不要把 `docs/`、根目录零散 Markdown、或服务器运行目录写成公开文章真源。
- 不要把 OpenList 的 `/夸克网盘/obsidian`、`/夸克网盘/ObsidianArchive`、`/腾讯云COS` 或任何网盘挂载写成 Obsidian 写作真源；它们只能是 legacy、cold archive、blob backend 或 public access，不是可编辑 authority。
- 不要把本地预览地址、临时端口或未验证子域名写成当前正式公开入口。
- 不要在未完成 `npm run lint`、`npm run check`、`npm run build` 前把改动当作可发布版本。
- 不要把服务器运行目录当作长期 source of truth，GitHub 仓库仍是长期真源。
- 不要把前端审计降级成“解释组件树”。涉及首页、Drawer、Reader、Command、Search、Graph、Visuals、OpenList/Pinterest shell、Settings 或 runtime fetch 的改动，必须更新 `docs/frontend-runtime-audit.md` 或说明为何无需更新。

### 0.6.2 System Invariants

- `apps/web/` 是唯一正式站点应用入口。
- `apps/admin-next/` 不是当前公开站点入口，也不是当前生产发布物来源。
- `E:\Vaults\Obsidian` 是唯一 Obsidian 写作真源；`/home/vault/Obsidian` 只是 Syncthing runtime hot mirror，不允许手工编辑。
- OpenList 是 content control plane / public content identity，Runtime MarkdownObject 的公开来源必须使用 `/openlist/Obsidian/docs/...`，不得把 `/home/vault/Obsidian` 裸路径暴露给前端。
- `public-data/runtime/content-index.json` 是唯一公开文章 active article truth。
- `apps/web/src/content/notes`、`projects`、`pages` 只负责各自对象，不承接公开文章。
- `https://blog.tengokukk.com/` 是唯一公开站点入口。
- `/srv/myblog/site` 是当前正式云端运行目录。
- 同一时刻只允许一个活跃本地源码仓边界。

### 0.6.3 Source-Of-Truth Map

- 长期源码真源：GitHub 仓库 `emptyinkpot/emptyinkpot.github.io`
- 当前远端活源码仓：`ubuntu@124.220.233.126:/srv/myblog/repo`
- 当前 Obsidian 写作真源：`E:\Vaults\Obsidian`
- 当前服务器热镜像：`/home/vault/Obsidian`
- 当前公开内容抽象层：OpenList `/openlist/Obsidian`
- 当前公开文章真源：`public-data/runtime/content-index.json`
- 当前 Runtime 状态真源：MySQL via `apps/admin-next`
- 当前大文件 / 冷归档后端：OpenList 挂载的 Quark / COS / S3 / WebDAV storage backend
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

1. 先运行 `npm run check:workspace`，确认当前 workspace 拥有本次操作需要的 capability。
2. 在拥有 deploy authority 的 workspace 完成编辑与构建；当前 deploy-authoritative workspace 是 `/srv/myblog/repo`。
3. 确认 `apps/web/dist/` 是本轮有效构建产物。
4. 使用 `npm run deploy:site` 发布到 `/srv/myblog/site`；该命令会先执行 `tools/deploy-guard.mjs`。
5. 不要从未经 workspace guard 校验的 worktree 手工 `scp` 到生产目录。
6. 不要先改服务器再回补本地源码仓。

### 0.7.2.1 Workspace Capability Governance

MyBlog 允许多个 runtime workspace、AI worktree 和 projection 环境并存；事故根因不是“存在多个 workspace”，而是旧 worktree 拥有了实际 deploy 行为却没有当前 runtime authority。因此本仓采用 Workspace Capability System：

```text
workspace
  !=
authority
```

机器合同：

- 当前 workspace 声明：`workspace.manifest.json`
- workspace 分级模板：`workspaces/canonical.json`、`workspaces/experimental.json`、`workspaces/sandbox.json`
- 部署前守门脚本：`tools/deploy-guard.mjs`
- 生产发布入口：`npm run deploy:site`
- 本地校验入口：`npm run check:workspace`

能力分级：

| Workspace | 默认路径 / 用途 | 允许 | 禁止 |
| --- | --- | --- | --- |
| canonical | `/srv/myblog/repo` | build、deploy、runtime、schema、PWA、OpenList authority | 无 |
| experimental | `C:\Users\ASUS-KL\.codex-runtime\worktrees\*` | UI、feed、drawer、animations、visual prototype、Codex draft | deploy、PWA、runtime-books、runtime schema、OpenList authority |
| sandbox | 一次性 prototype | research、throwaway demo | build/deploy、server runtime、production content |

部署规则：

- `deploymentAuthority=true` 只是声明，最终必须由 `tools/deploy-guard.mjs` 校验。
- `.codex-runtime/worktrees/*` 默认不拥有部署能力；即使能构建，也不能发布到 `/srv/myblog/site`。
- 如果某个 worktree 的实验成果要上线，先把改动提升回拥有对应 capability 的 workspace，再构建和部署。
- 修改 PWA、Reader Runtime、OpenList authority、runtime schema、部署脚本或服务端运行时前，必须确认当前 workspace 有对应 capability。
- 任何 workspace capability 变更必须同步更新 `README.md`、`project.json`、`workspace.manifest.json`、`workspaces/*.json` 和 `/codex/runtime-federation/`。

### 0.7.3 Publish Checklist

1. 确认改动落在正确真源边界。
2. 执行 `npm run check:workspace`。
3. 执行 `npm run lint`。
4. 执行 `npm run check`。
5. 执行 `npm run build`。
6. 若改动涉及公开内容路由或首页交互，补一轮本地可见结果验证。
7. 完成提交、推送与 PR 更新后，再判断是否需要发布到 `/srv/myblog/site`；发布必须走 `npm run deploy:site`。

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

#### 0.7.5.0 Content Pipeline Target

目标内容链路不是 `Obsidian Vault -> 网站` 的直接同步，也不是只写一个博客侧同步脚本，而是先统一 Vault 文件真源，再从 Vault-backed / Git-backed CMS 发布：

```text
Obsidian local vault
  ↕ Syncthing / Obsidian Sync
Linux hot mirror /home/vault/Obsidian
  ↕
OpenList public content access /openlist/Obsidian
  ↓
/home/vault/Obsidian/docs subtree
  ↓
Git mirror / working copy
  ↓
TinaCMS 或 Decap CMS
  ↓
Publish Pipeline
  ↓
Normalized Markdown
  ↓
Astro Content Collections
  ↓
Astro Build
  ↓
Public Site
```

设计合同：

- Content Source Base：Windows Vault `E:\Vaults\Obsidian` = 唯一可编辑写作真源；Linux `/home/vault/Obsidian` = Syncthing 热镜像；OpenList `/openlist/Obsidian/` = 公开内容访问层；`public-data/runtime/content-index.json` = 前端派生索引；Astro = UI Shell。
- Linux 路径 `/home/vault/Obsidian` 是完整 Vault 热镜像，必须包含 `docs`、`image`、`.obsidian`、canvas、PDF 和附件。Syncthing / Obsidian Sync 负责这一层的文件同步，MyBlog 不再手工镜像 `data/image`。
- `/home/vault/Obsidian/docs` 是 projector 输入子树；`/openlist/Obsidian/docs/...` 是前端公开 source identity。OpenList 不决定文章是否存在，但必须作为公开内容入口。
- `public-data/runtime/content-index.json` 是新文章线的 Runtime Projection Truth；旧 Astro posts collection 已移除，不再参与公开文章路由、RSS、Pagefind、分类、标签、专题或 Knowledge Graph。
- Runtime Projection 是允许从 Authoring Truth 进入公开 Feed 的通道；它不是简单文件夹复制，也不是全站发布回调，而是 MarkdownObject Index Compile。
- 当前 Runtime Projection 条件：`docs` 下 Markdown 默认进入 `MarkdownObject`；`draft: true`、`published: false`、`visibility: private/draft` 或私有路径会排除。后续可再加更细规则；新文章仍建议补齐 frontmatter：`slug`、`title`、`date`、`summary`、`tags`、`categories`。
- `tools/build-runtime-content-index.mjs` 必须把每篇公开文章归一化为 MarkdownObject：`sourcePath` 保留内部热镜像路径，`openlistPath/openlistUrl` 指向 `/openlist/Obsidian/docs/...` 公开入口，`kind` 从 frontmatter 或文件夹派生，`visibility` 从 frontmatter / `private` / `drafts` 派生，`folderTags` 来自路径段，`relations.wikilinks/assets/backlinks` 来自 Obsidian link 与 Markdown asset，`card.chips` 由 categories/tags/project/series 生成，`derivedTaxonomy` 必须声明当前分类/标签只是规则派生，`semantic` 必须声明 sidecar 槽位且 `authority=false`。
- `tools/build-runtime-content-index.mjs` 还必须从 MarkdownObject 生成 KnowledgeCollection：folder collection、series collection 和至少两个对象共享的 topic collection。Collection 必须包含 `objects`、`relations`、`tags`、`layout`、`projections`、`card` 和 `stats`；首页可以插入 folder / series collection card，但不能 collection-first 或 collection-only，默认必须保留 post / note / book / visual / github / music 等混合对象瀑布流。Collection card 不是终点，只负责打开 Reading Session。`/collections/` 提供备用集合入口，`/collections/[slug]/` 只预渲染 folder / series Reading Session：直接显示当前文章全文 + 本集合目录 + 上一篇/下一篇；topic collection 只作为 metadata / search / Graph 维度留在 runtime index，不得批量生成静态集合页。集合内 Object 切换不得跳转到 `/posts/` 或刷新整页。
- `apps/web/public/runtime/content-index.json` 只允许作为构建期 metadata index；正文、`html` 和 `toc` 必须按 `detailPath` 从 `/runtime/articles/*.json` 单篇 detail payload 加载。首页 Drawer、Collection Reading Session 和 `/posts/[slug]/` 可以读取单篇 detail；标签、分类、系列、RSS、Graph、搜索索引和普通卡片不得在 build-time 读取 full index。
- 前端文章卡片合同：`ArticleCard`、首页 Runtime Feed、`/posts/` 和 `/posts/[slug]/` 的展示标签只能读取 `MarkdownObject.card.chips`；`tags/categories` 仍可供搜索、RSS、分类页和 Graph 索引使用，但不得作为卡片 UI 的临时展示逻辑。
- Runtime Feature Registry 位于 `public-data/runtime/features.json`，公开副本位于 `apps/web/public/runtime/features.json`。它只声明当前 active runtime surface 的 authority、truth、producer、consumer 和 projection，不登记旧文章兼容系统。
- 首页 `/` 是 Runtime Surface v2：混合对象瀑布流、feed tabs、drawer peek、search、OpenList/Pinterest shell 和 runtime refresh 必须同时活着。它可以展示少量 `KnowledgeCollection` lens，但不得变成 Collection Gateway 或 collection-only feed；post / note / book / visual / github / music / project 仍是同一个 surface 里的对象投影。点击集合打开首页 Reader Drawer / Reading Session，当前文章全文是中心，集合目录是右侧上下文轨道；背景 feed、tabs 与 scroll context 保持活着。首页抽屉正文只按 `detailPath` 读取 `/runtime/articles/*.json` 内预渲染的 `html`，不得在浏览器里维护第二套 Markdown renderer。
- `/posts/` 必须只展示 Runtime MarkdownObject；不得展示 Astro posts archive。
- Runtime 文章页的 metadata 必须使用 Editorial Metadata Line，例如 `2026-05-07 / 4 min read / HISTORY / PDF ARCHIVE`；不要回退到 badge、chip、pill 或按钮式标签。`/posts/[slug]/` 是唯一公开文章详情路由；不保留 `/runtime/` 文章页面或 redirect。
- 引用私有附件、存在无法迁移的 Obsidian embed、位于 `drafts/private/assets/.obsidian` 等私有路径的文件不得进入 runtime projection。
- 后续可以参考 Quartz 4 的 Markdown pipeline、Logseq Publish 的图谱发布、TinaCMS 的 Git-backed editing，但只吸收 Normalize / Publish 思路，不替换 MyBlog 的 Astro 展示层。
- TinaCMS 是优先评估的网页编辑控制面，因为它适合 Git-backed Markdown / MDX / JSON 内容模型；Decap CMS 是轻量备选，适合最小 Markdown 后台。P1 只能选择一个 CMS，禁止 Tina 与 Decap 同时接入形成第二套编辑真源。
- CMS 不得直接编辑 `apps/web/dist/`、服务器 `/srv/myblog/site` 或 MySQL 正文表。网页编辑必须回写 Git 化的 Vault working copy，再由 Publish Pipeline 产出 Astro 发布视图。
- Quartz 4 / Flowershow / Logseq Publish 只作为 Obsidian 编译能力参考：wikilink、backlink、folder/tag listing、private/draft 过滤、Graph 和 Markdown transform。不得整体替换 MyBlog 前台。

Vault-backed CMS 目标结构：

```text
content-vault/
├─ history/
│  ├─ korea/
│  │  ├─ 朝鲜全史.md
│  │  ├─ 朝鲜历史.md
│  │  └─ 高丽史.md
│  └─ japan/
├─ design/
├─ literature/
└─ assets/
```

文件夹映射规则：

```ts
type VaultDoc = {
  path: string;             // history/korea/朝鲜全史.md
  folderTags: string[];     // ["history", "korea"]
  explicitTags: string[];   // frontmatter tags
  finalTags: string[];      // folderTags + explicitTags
  derivedTaxonomy: "filesystem-frontmatter-wikilink-derived";
  semanticSidecar: string;   // history/korea/朝鲜全史.semantic.json
  collectionId: string;     // history/korea
};
```

规则：

- `folderTags` 由路径段生成，只用于分类、Collection、Topic 和导航；不得覆盖 frontmatter 显式标签。
- `explicitTags` 来自 frontmatter；`finalTags` 是去重后的 `folderTags + explicitTags`。
- `derivedTaxonomy` 不是语义理解；它只说明系统按路径、frontmatter、wikilink 做了规则派生。
- `semanticSidecar` 是 AI Semantic Pipeline 的唯一写入面；Markdown 文件保持 truth，sidecar 保持 projection。当前脚本是 `npm run semantic:sidecars -- --limit 1`，默认复用 Mortis 的 GLM OpenAI-compatible runtime（`https://sub2api.tengokukk.com/v1` / `coze-shell`），只生成 `*.semantic.json`，不得改 Markdown 正文或 frontmatter。注意：必须使用云端 `coze-glm-shell` 对应的 GLM key；普通 OpenAI Pool key 会落到 group 3，调用 `coze-shell` 会返回 `no available accounts`。
- `collectionId` 默认等于父级文件夹路径，例如 `history/korea`；UI 可以显示为“朝鲜历史”，但对象 ID 必须稳定。
- URL 生成必须基于 `slug` 或稳定路径映射，不得用中文标题临时生成。

P0 可执行发布脚本：

```bash
# 生成 Runtime MarkdownObject index，默认读取当前 Obsidian docs vault
npm run runtime:content

# 本地调试 runtime content SSE；生产由 systemd myblog-runtime-sse.service 常驻
npm run runtime:content:sse

# 生产 runtime projector；生产由 systemd myblog-runtime-content-projector.service 常驻
npm run runtime:content:server

# 指定 Vault 根生成 runtime/content-index.json
npm run runtime:content -- --vault "E:/Vaults/Obsidian/docs"

```

脚本合同：

- Runtime Index 脚本位置：`tools/build-runtime-content-index.mjs`。
- `npm run runtime:content` 是本地构建 / 校验用生成器，会写入 `public-data/runtime/content-index.json` 和 `apps/web/public/runtime/content-index.json`，每篇文章包含 `body`、`html` 和 `toc`；它不复制 Markdown 到 Astro content collection。
- `npm run runtime:content:sync`、`npm run sync:obsidian-home`、`tools/watch-obsidian-home-sync.mjs`、`tools/sync-runtime-content-index.mjs` 和 `tools/start-obsidian-home-sync.cmd` 已移除。Windows watcher、scp runtime sync 和 Obsidian 进程内 projection 都是 deprecated glue，不能作为自动发布链路。
- Obsidian 侧只允许承担编辑与成熟文件同步：当前 active 文件真源链路是 Windows `E:\Vaults\Obsidian` -> Syncthing folder `obsidian-vault` -> Linux `/home/vault/Obsidian`。MyBlog 不注册 Obsidian 插件来接管 OpenList / 首页卡片同步。
- 2026-05-07 验收事实：Syncthing folder `obsidian-vault` 两端 `idle`，`needBytes=0`；本机新增、修改、删除 `docs/blog/__syncthing_linux_vault_acceptance_*.md` 均已同步到 `/home/vault/Obsidian/docs/blog`，并触发 `/srv/myblog/site/runtime/content-index.json` 增、改、删投影。重复验收命令是 `npm run check:vault-sync`。
- OpenList Vault 映射事实：OpenList 公开入口必须提供 `https://blog.tengokukk.com/openlist/Obsidian/`，Runtime MarkdownObject 的 `openlistPath/openlistUrl` 使用 `/openlist/Obsidian/docs/...`。现有 `/夸克网盘` 与 `/腾讯云COS` 挂载仍保留，用于冷归档、大文件和对象存储入口；`/夸克网盘/obsidian` 已于 2026-05-08 删除，不得回流为文章真源。
- 生产 `myblog-runtime-content-projector.service` 监听并扫描完整 `/home/vault/Obsidian/docs` 生成 `/srv/myblog/site/runtime/content-index.json`；它会写入 OpenList public identity，但不得通过 Astro build、Pagefind、deploy、scp 或 Windows watcher 作为变更回调。
- 首页运行时会用 `EventSource('/runtime/events')` 接收 content-index 变更通知，再 `fetch('/runtime/content-index.json')` 拉取小卡片；30 秒轮询只作为 SSE 不可用时的兜底。Obsidian 内容变更不需要重新部署首页。
- `/posts/[slug]/` 是唯一公开文章详情路由；它可监听 `/runtime/events` 并重新读取 `content-index.json` 更新已有 slug 的正文。新增 slug 要进入静态路由仍需要下一次站点壳 build，不通过 `/runtime/` 兼容入口绕过。
- 生产 SSE 服务是 `myblog-runtime-sse.service`，代码来自 `tools/runtime-content-sse-server.mjs`，nginx 仅把 `/runtime/events` 反代到 `127.0.0.1:4121`；它只监听线上 `content-index.json` 文件变更，不参与 Vault 同步、Astro build、Pagefind 或 deploy。
- Runtime Feature Registry 当前人工维护在 `public-data/runtime/features.json` 和 `apps/web/public/runtime/features.json`；新增 runtime surface 前必须先登记 authority，不得只新增 UI 入口。
- Obsidian `[[link]]` / `[[target|label]]` 会被转成普通 Markdown 锚点链接；`![[embed]]` 会阻断为待迁移注释并记录 issue，避免私有附件误公开。
- 写入后必须继续执行 `npm run check` 和 `npm run build`；Publish Pipeline 不能绕过 Astro content schema 与治理校验。

#### 0.7.5.0a Composable Service Stack Target

目标运行形态不是把 MyBlog 做成全能后端，而是组合成熟服务：

```text
OpenList + COS
  ↓
Canonical File Index
  ↓
Directus Metadata Overlay
  ↓
Meilisearch Search Runtime
  ↓
Astro / MyBlog Presentation Shell

Immich
  ↓
AI Media Runtime Snapshot
  ↓
VisualCollection / KnowledgeObject Projection
  ↓
MyBlog Visuals / Search / Graph
```

当前事实与目标边界：

- `OpenList + 腾讯云 COS` 是当前 content control plane 下的大文件 / blob 后端。COS bucket 是 `myblog-media-1410041307`，region 是 `ap-shanghai`，OpenList 挂载点是 `/腾讯云COS`，已验证 `_verify/openlist-cos.txt` 可写入并可从 bucket 侧看到；它不承担 Obsidian 写作真源。
- `Immich` 是选定的图片 / 视频 AI 媒体库运行时。当前只完成 `/srv/immich` skeleton、Nginx vhost 和前台入口；服务尚未启动，阻断项仍是 `photos.blog.tengokukk.com` DNS、独立存储卷和 root disk 空间。
- `Directus` 是目标 Metadata Overlay / 人工策展后台，目前未部署。它后续负责 books、visuals、collections、knowledge_objects 的可编辑 metadata，不保存 EPUB/PDF/图片原件。
- `Meilisearch` 是目标 Search Runtime，目前未部署。它后续接管动态书籍、视觉素材、文件索引、KnowledgeObject snapshot 和 runtime metadata 的全文 / 语义检索；Pagefind 在 Meilisearch 上线前仍是当前静态搜索。
- `Astro / MyBlog` 是 Presentation Shell，只消费 API、snapshot、manifest 和 content collection，不训练模型、不做媒体库、不做数据库后台、不承担搜索引擎职责。
- 可执行骨架位于 `infra/composable-stack/`：包含 Directus + Meilisearch 的 `docker-compose.yml`、`.env.example`、`check-readiness.sh` 和部署说明。服务器侧已同步到 `/srv/myblog/services/composable-stack/`，但 `.env` 未创建、容器未启动；该目录只表示 target runtime 可复刻入口，不表示服务已经上线。

成熟服务分工：

| 职责 | Authority | 当前状态 | MyBlog 责任 |
| --- | --- | --- | --- |
| 大文件 / blob 后端 | OpenList + Tencent COS | 已挂载并验证 COS 写入 | 通过同域 `/openlist/` 和 `/api/openlist/*` 展示 / 读取，不承担 Obsidian 写作真源 |
| 图片视频 AI 媒体库 | Immich | skeleton 已安装，未启动 | 提供入口，后续导入 API snapshot |
| 人工 metadata overlay | Directus | target，未部署 | 消费 books / visuals / collection metadata |
| 动态全文 / 语义搜索 | Meilisearch | target，未部署 | 调用 search API，展示统一结果 |
| 展示层 | Astro / MyBlog | 当前生产前台 | 组织 Feed、Drawer、Reader、Graph、Visual Collection |

硬规则：

- 不再把 `apps/web/src/data/books.ts`、build script 内联 `overlays` 或 `books-index.json` 写成完整书库 metadata authority。书籍存在性只来自 OpenList/COS 文件索引；`public-data/books/books-index.json` 只保存 path / modified / size / sourceType / cover cache 输入；人工 metadata 只进入 `public-data/books/books.metadata.json`，后续迁入 Directus 或同级 metadata DB。
- 不再把 `apps/admin-next` 扩张成完整 CMS、媒体库或搜索引擎。它只做 API gateway、import pipeline、cache/prewarm、runtime state 和外部服务桥接。
- Directus 只管结构化 metadata overlay；大文件仍归 OpenList/COS，运行时阅读状态仍归 MySQL。
- Meilisearch 上线前不得声称动态高亮、贴纸、视觉素材、OpenList 文件和 runtime books 已全部进入统一搜索。
- Immich 推理只允许发生在导入 / 同步阶段；访客打开 `/visuals/` 或首页时只能读 snapshot / API 缓存，不允许 visitor-time inference。
- 每引入一个成熟服务，必须同时更新 README、`project.json` 和 Architecture Codex，标清 `active` / `skeleton` / `target`，不能把目标架构写成现状。
- 启动 `infra/composable-stack` 前必须先把目录部署到服务器数据盘或更大卷，并运行 `./check-readiness.sh`。只有输出 `ready` 才允许执行 `docker compose up -d`；当前 root disk 不满足长期运行 Directus / Meilisearch 的空间预期。

#### 0.7.5.0b Runtime Federation Reference Systems

MyBlog 后续不再从零手写 sync、media runtime、reader engine、metadata backend 或 Android runtime。正确路线是 clone 成熟系统的系统角色，而不是复制 UI 或把第三方项目整段嵌入仓库。

Runtime Federation 同时适用于本地工程 workspace：多个 workspace 可以并行存在，但必须声明 capability。`/srv/myblog/repo` 是当前 canonical / deploy-authoritative workspace；`.codex-runtime/worktrees/*` 默认是 experimental workspace，只能做 UI、Feed、Drawer、Visual 和 Codex draft，不能部署、改 PWA、改 runtime schema 或改 OpenList authority。部署前必须通过 `tools/deploy-guard.mjs`，否则不得写入 `/srv/myblog/site`。

当前进入 `Stabilization Sprint / 收束 Sprint`，不是功能 Sprint。执行顺序固定：

1. 文件真源已实跑：`E:\Vaults\Obsidian` -> Syncthing -> Linux `/home/vault/Obsidian` hot mirror；OpenList `/openlist/Obsidian` 是公开 content control plane，不是第二真源。
2. 下一步固化 `MarkdownObject` schema：`public-data/runtime/content-index.json` 是唯一公开文章对象线。
3. 再评估并接入 Quartz 4 / Flowershow 的可复用能力：wikilink、backlink、graph、callout、semantic markdown。
4. 最后才评估 AppFlowy 协作 runtime。

成熟底座优先级固定为：

1. `Syncthing` 负责完整 Vault 文件真源同步。
2. `Quartz 4 / Flowershow` 负责 Markdown / Digital Garden substrate。
3. `Meilisearch` 负责动态搜索。
4. `Immich` 负责媒体运行时。
5. `Payload / Directus` 负责对象与 metadata admin。

MyBlog 只写 glue、projection 和 runtime contract，不再自写这些底层引擎。

冻结规则：

- AppFlowy 只保留 `infra/appflowy-cloud/` skeleton，不允许 `docker compose up`。
- Immich、Directus、Meilisearch、AppFlowy 都不得在当前 sprint 变成 active runtime。
- 不新增页面、新 overlay、新 feed、新 graph、新 AI runtime。
- 新工作只能关闭文件真源、MarkdownObject、Quartz layer 或 runtime authority 的真实缺口。

目标 federation：

```text
Obsidian `E:\Vaults\Obsidian`
  ↓
Syncthing
  ↓
Linux hot mirror `/home/vault/Obsidian`
  ↓
OpenList content control plane `/openlist/Obsidian`
  ↓
Quartz-compatible Markdown runtime layer
  ↓
MyBlog Runtime API / Object Layer Glue
  ↓
Astro UI Shell / PWA-TWA / Android / Search / CLI / AI Agent
```

成熟替换优先级：

1. `Syncthing` 接管文件真源层：替代 Windows watcher、scp content sync、Obsidian 进程内 projection 和所有 MyBlog 自研 Vault sync。
2. `Runtime MarkdownObject` 固化为唯一内容对象：先收紧 schema、slug、relation、attachment、privacy gate 和 duplicate detection。
3. `Quartz 4` 接管 Markdown / Digital Garden 基础能力：优先复用或移植 markdown pipeline、wikilink、backlink、graph、TOC、LaTeX、callout、table rendering 和 Obsidian compatibility。
4. `Meilisearch` 接管动态搜索：替代 Pagefind 对 runtime books、visuals、OpenList index、KnowledgeObject snapshot 和 metadata search 的缺口；Pagefind 只保留静态页面 fallback。
5. `Immich` 接管媒体运行时：替代 visual snapshot、thumbnail manifest、AI tagging、embedding 和 gallery runtime 的自研倾向。
6. `Payload / Directus` 接管对象与 metadata admin：只做 media/object admin、relation layer 和人工策展，不替代 Obsidian 写作真源。
7. `AppFlowy Cloud` 接管协作 runtime：只在文件真源、MarkdownObject schema 和 Quartz layer 稳定后评估启动。

Digital Garden 底座策略：

- 如果目标只是 `Obsidian -> 公开数字花园`，优先使用 Quartz / Flowershow / Obsidian Digital Garden 这类成熟底座，不在 MyBlog 内继续自研 Markdown compiler、backlink engine、graph publish、全文搜索和基础 publish runtime。
- MyBlog 当前保留自有 Astro 前台，是因为它已经承担 Runtime Feed、Reader、Visual Collection、OpenList Shell、PWA/TWA 和对象投影；这不等于 MyBlog 应该继续自研所有 Digital Garden 底层。
- 后续任何 Markdown / Graph / Backlink / Search 底层升级，必须先评估 Quartz 4、Flowershow 和 Obsidian Digital Garden 的可复用边界，再决定接入、移植或保持现状。

成熟系统角色表：

| 系统 | Role / Authority | MyBlog 应该学习或接入的部分 | 当前状态 |
| --- | --- | --- | --- |
| Obsidian | Authoring Truth | Vault 写作、双链、附件、长期原稿 | active upstream |
| Remotely Save | Vault Sync reference | 成熟 WebDAV / S3 同步参考；当前不承担 MyBlog active Obsidian 同步链 | reference only |
| Syncthing | Hot Mirror Sync | 实时、增量、非轮询、多端、断线恢复，把完整本机 Vault 同步到 Linux `/home/vault/Obsidian` | active for complete vault |
| OpenList + COS / Quark | Content Control Plane / Cold Backend | OpenList 提供 `/openlist/Obsidian` 公开 identity、API、URL、metadata 与挂载访问；COS / Quark 是 blob 和冷归档后端，不是 Obsidian 写作真源 | active control plane / backend |
| Quartz 4 | Obsidian Digital Garden substrate | Markdown transform、wikilink、backlink、graph、search、folder/tag、publish pipeline | reference / substrate candidate |
| Flowershow | Obsidian Publish / CMS-like substrate | Obsidian -> website、hosted publish、Markdown site pipeline | reference / substrate candidate |
| Payload CMS | Object / Media Admin reference | object modeling、media layer、relation layer、admin architecture | reference / metadata candidate |
| AppFlowy | Block / Collaboration Runtime target | block runtime、object graph、CRDT、collaboration、local-first sync | skeleton installed / target-not-deployed |
| AFFiNE | Workspace Runtime reference | workspace、blocks、local-first、projection、object runtime 思路 | reference only |
| Anytype | Object Graph reference | Everything is Object、稳定对象 ID、relation graph、projection | reference only |
| Immich | Media Runtime | 图片 / 视频 ingest、缩略图、EXIF、AI tagging、embedding、timeline | skeleton-not-started |
| Paperless-ngx | Document Object reference | file != document、metadata runtime、document object lifecycle | reference only |
| Mihon | Android Runtime reference | source abstraction、reader runtime、cache、downloads、update、extensions | reference only |
| Read You | Feed Runtime reference | feed sync、offline cache、reading state、信息流 projection | reference only |
| Directus | Metadata Overlay | 人工策展 metadata、relations、knowledge_objects 编辑后台 | target-not-deployed |
| Meilisearch | Search Runtime | dynamic object search、OpenList index、metadata search | target-not-deployed |
| MyBlog | Object Layer Glue / Projection Shell | KnowledgeObject glue、relation semantics、Drawer/Feed/Graph/Reader projection | active |

MyBlog 自己只写：

- `Object Layer Glue`：把 OpenList/COS、MySQL、Immich、Directus、Meilisearch 的对象投影成统一 KnowledgeObject。
- `Runtime Schema`：定义稳定 API envelope、object identity、relation、version、cache invalidation。
- `Projection Logic`：Web / PWA-TWA / Android / Search / CLI / AI Agent 如何消费同一个 Runtime。
- `Knowledge Semantics`：书籍、文章、图片、高亮、人物、地点、时间线之间的关系含义。

MyBlog 不再自研：

- sync engine
- media server
- WebDAV / object storage
- Markdown compiler / Digital Garden base
- backlink / graph publish engine
- PDF engine
- image cache / thumbnail pipeline
- auth system
- full CMS
- search engine
- Android source / download / update runtime

规则：

- Clone roles, not UI. 参考 AFFiNE / Anytype / Immich / Paperless / Mihon / Read You 的系统边界，不复制它们的视觉壳。
- Reuse garden substrate before inventing one. Markdown、wikilink、backlink、graph、search 和 digital garden publish 底层优先评估 Quartz / Flowershow。
- Replace custom runtime with mature layers. 新增功能前优先判断能否由 Syncthing、Quartz、Meilisearch、Immich、Payload / Directus 承担，不允许为了“实时”继续新增 watcher / scp / build-sync glue。
- Files are carriers; objects are identity. 文件存在性由 OpenList/COS 决定，对象身份由 KnowledgeObject 层决定。
- MyBlog writes glue, not engines. 如果某能力已有成熟系统，MyBlog 只接入、索引、投影、关联，不重写底层。
- Android is a runtime projection, not a second universe. `apps/android-shell` 只承接 PWA/TWA；Native Client 只能在 Runtime API 稳定后消费同一合同。
- 任何新 federation 成员都必须写清 authority、status、integration path、secret boundary 和 failure mode，不能只在 README 写名字。
- 当前收束期禁止把 target/skeleton 服务升级为 active runtime，除非先更新 `project.json.stabilizationSprint` 并通过治理校验。

#### 0.7.5.0c Frontend Runtime Convergence

MyBlog 当前前端已经不是普通博客组件树，而是 `Astro SSR + React islands + inline runtime + custom events + Pagefind + OpenList shell + Pinterest shell + Runtime APIs` 的系统级前端。下一阶段重点不是继续叠功能，而是 Runtime Convergence。

当前风险：

- `apps/web/src/pages/index.astro` 仍拥有大型 inline runtime：Feed、Drawer、Reader command、fallback search、keyboard、highlight、seal 和 sidebar state 都在同一片脚本里。
- `Ctrl/Cmd+K` 当前存在 Command Palette 与 fallback search 两条 authority；这是 Runtime Split Brain 的典型信号。
- OpenList shell、Pinterest shell、Book Drawer、Reader command 仍通过自由 custom event 和 delegated listener 串联。
- localStorage 同时承担 UI preference、cache、legacy migration source 和部分临时本地 authority；后续必须分类，不能继续长成 Shadow Database。
- localStorage 只能继续作为 preference / cache / legacy migration / 明确离线临时态；不得新增为 metadata DB、reader runtime truth、collection truth 或 OpenList 索引真源。

目标形态：

```text
User gesture
  -> Runtime Kernel command / overlay / drawer / navigation intent
  -> one owner updates state
  -> React island or Astro shell renders projection
  -> Runtime API / cache layer persists only through declared authority
```

当前新增的收束入口：

```text
docs/frontend-runtime-convergence.md
packages/runtime-kernel/
```

`packages/runtime-kernel` 当前只是 P0 dependency-free contract，不改变线上行为、不替代 `packages/runtime-contract`、不替代 `packages/object-model`。它定义 command、overlay、drawer、keyboard、authority 和 localStorage classification，用于后续逐个迁移 owner。

当前减法迁移立场：

```text
无 runtime-migration.json
无 packages/runtime-overlay/
无 packages/runtime-store/
无 check:runtime-migration
```

Overlay、Drawer、Focus 和 Escape 的当前真源仍是 legacy inline runtime + 既有 React islands。Radix / Vaul / Zustand / React Flow 只是已安装历史事实，不是 active owner；未接管前不进入主架构合同。

当前优先级：

| Surface | 当前 owner | 目标 owner | 状态 |
| --- | --- | --- | --- |
| Overlay | inline runtime + React islands + custom events | Radix / Vaul 候选 | legacy active |
| Book Drawer | `BookDrawerReader` + homepage drawer runtime | Vaul 候选 | legacy active |
| Command | `HomeCommandPalette` + legacy search bridge | `cmdk` + `commandStore` | partially converged |
| Store | component state / inline vars / localStorage | Zustand 候选 | no central store owner |
| Graph | SVG / inline runtime | `@xyflow/react` | blocked until object/search authority settles |
| Motion | per-component CSS / Motion usage | Runtime Experience object continuity | later phase |

Runtime Kernel 职责边界：

| 责任 | 当前要求 |
| --- | --- |
| Command bus | `Ctrl/Cmd+K` 必须最终只有一个 owner；当前 `cmdk` 已安装并活跃 |
| Keyboard layer | 全局快捷键必须声明 scope、priority、owner |
| Overlay stack | Command、Search、OpenList、Pinterest、Drawer、Modal 后续进入同一 stack / focus 规则 |
| Drawer intents | Article / Book / Visual / Project drawer 使用 typed intent，不再扩散自由事件 |
| Runtime events | 新事件先进入 `packages/runtime-kernel/src/events.ts`，legacy event 只作为 bridge |
| Storage classification | localStorage key 必须标为 `preference`、`cache`、`legacy-migration`、`temporary-local-authority` 或 `forbidden-authority` |

当前 library stance：

| Library | 状态 | 说明 |
| --- | --- | --- |
| `cmdk` | installed / active | Command Palette 基础 |
| `motion` | installed / active | 动效统一目标 |
| `@floating-ui/react` | installed / active | Hover preview / floating layer 基础 |
| `zustand` | installed / not migrated | store 依赖已安装；还没有 runtime owner 迁移过去 |
| Radix UI | installed / not migrated | dialog / popover / tabs / tooltip / context-menu primitive 已安装；overlay owner 尚未迁移 |
| Vaul | installed / not migrated | drawer runtime 候选已安装；当前 drawer 仍走既有 runtime |
| React Flow | installed / not migrated | Knowledge Graph 候选已安装；当前 graph 仍是现有实现 |

硬规则：

- 不做大爆炸重写；每次只迁移一个 interaction owner。
- 不新增全局 `document.addEventListener` / `window.addEventListener`，除非同步更新 `docs/frontend-runtime-audit.md` 和 `docs/frontend-runtime-convergence.md`。
- 不新增 `window.dispatchEvent(...)` 合同，除非先在 runtime-kernel 定义 typed command/event。
- 不把 localStorage 新 key 写成 source of truth；必须先分类。
- Zustand / Radix / Vaul / React Flow 已进入 `apps/web` 依赖，但不能因为安装就声称集成；只有具体 surface 迁移并有浏览器证据后才算 active owner。

#### 0.7.5.0d Runtime Experience Layer

Runtime Convergence 解决 owner 和 authority；Runtime Experience Layer 解决交互质感和统一体验。MyBlog 下一阶段不再以 `button / card / hero` 为主语，而以 runtime surface 为主语。

体验目标：

```text
Linear discipline
+ Arc spatial layers
+ Cosmos visual browsing
+ Immich gallery runtime
+ MyBlog reading atmosphere
```

术语升级：

| 旧说法 | 新说法 | 要求 |
| --- | --- | --- |
| Drawer | Spatial Layer | 打开下一层时保留上下文，背景被压低或安静下来 |
| Modal | Runtime Overlay | 进入统一 overlay stack、focus restore 和 Escape 规则 |
| Card | Interactive Object | 从 card -> drawer -> reader 保持对象连续性 |
| Search | Command Runtime | `Ctrl/Cmd+K` 是动作入口，不只是搜索框 |
| Reader | Continuous Surface | 阅读不应像切页面，目录、正文、进度和记忆应连续 |
| Visuals | Infinite Semantic Canvas | 后续从图片墙走向语义画布和视觉关系空间 |

当前新增入口：

```text
docs/runtime-experience-layer.md
packages/design-system/
```

`packages/design-system` 当前是 P0 token contract，不是组件库。它只定义 motion、depth、elevation、focus、surface 这些 runtime 体验 token，供后续 shadcn/Radix/Vaul/Motion 迁移复用。

当前 active / target 边界：

| 工具 | 状态 | 角色 |
| --- | --- | --- |
| `cmdk` | active | Command runtime foundation |
| `motion` | active | Motion / object continuity foundation |
| `@floating-ui/react` | active | Floating surface foundation |
| `lucide-react` | active | Icon language |
| shadcn/ui | target convention | 具体 surface 迁移时采用组件装配范式；组件目录尚未初始化 |
| Radix UI | installed / not migrated | dialog、popover、tabs、tooltip、context-menu primitive 已安装，尚未接管 surface |
| Vaul | installed / not migrated | drawer / spatial layer 候选已安装，尚未接管 drawer |
| React Flow | installed / not migrated | Knowledge Graph runtime 候选已安装，尚未接管 graph |
| tldraw | reference | future infinite canvas / annotation reference |

硬规则：

- 不再为了“高级感”新增孤立特效；交互必须服务 Spatial Layer、Interactive Object、Continuous Surface 或 Command Runtime。
- Aceternity UI、Magic UI、React Bits 只能作为 technique reference；不得直接引入通用发光、粒子、装饰 orb、bokeh、营销 hero 效果。
- 新增 z-index 必须优先使用 `--runtime-depth-*`；新增 motion 必须优先使用 `--runtime-motion-*` 和 `--runtime-ease-*`。
- 新增 focus、overlay panel、floating layer 必须优先使用 `--runtime-focus-*`、`--runtime-elevation-*`、`--runtime-surface-*`。
- shadcn 仍只是组件装配范式；Radix/Vaul/React Flow 已安装但未迁移。任何 active 声明都必须伴随实际 surface 迁移和浏览器证据。

#### 0.7.5.1 Target Platform Positioning

目标形态不再是“单纯博客站点优化”，而是：

`MyBlog Content Platform`

它是一个以前台内容站为展示面、以后台内容生产系统为控制面、以 AI 写作和发布系统为能力层的个人内容平台。

#### 0.7.5.1a Runtime Projection Client Contract

MyBlog 后续不做“博客网页套壳 App”，而是做 `MyBlog Runtime Client`。核心合同是：

```text
OpenList / COS / MySQL / Directus target / Meilisearch target / Immich target
  ↓
KnowledgeObject Graph + MyBlog Runtime API
  ↓
Web Projection / PWA-TWA / Android Native / Search / CLI / AI Agent
```

硬规则：

- 只允许一套 Runtime / Object Graph；Web、Android、Search、AI Agent 都是 projection surface。
- UI 可以重复，业务逻辑不能重复。不得在 Android 里重新维护 book existence、OpenList parsing、metadata authority、search ranking、graph relation、sync logic 或 reader memory truth。
- Android 本地 Room / cache 只能是 runtime mirror，不是新的 source of truth；必须有 schema version、etag / modified / size / sync watermark 和 eviction policy。
- Phase 1 是 PWA + Bubblewrap / Trusted Web Activity，快速得到 Android APK，更新跟随 Web Runtime。
- Phase 2 是 Runtime API 化：稳定 `/api/feed`、`/api/books`、`/api/visuals`、`/api/search`、`/api/graph` 和 `/api/runtime/*` 的 response schema。
- Phase 3 才允许 Kotlin + Compose Native Client：Compose UI、ViewModel + Flow、Ktor / Retrofit、Coil、Room、PdfRenderer / EPUB runtime、AppUpdater。
- 自动更新默认目标是 GitHub Releases + AppUpdater；F-Droid repo 是后续开源分发选项。
- 禁止把 WebView 套壳当作最终 App 架构；PWA/TWA 是过渡安装面，不是第二套系统。

#### 0.7.5.1b Content Metadata System

当前最大的边界风险不是 UI，而是 metadata 继续散落在 build scripts、manifest 和 localStorage 里形成 Shadow Database。MyBlog 的 P0 收束规则是：

```text
OpenList / COS
  = file existence + blob truth

books-index.json / visual-manifest.json / content-index.json
  = projection manifest / cache / frontend index

books.metadata.json
  = P0 editable metadata sidecar
  -> later Directus or equivalent metadata DB

MySQL
  = runtime truth: reader memory, highlights, annotations, relations, events

localStorage
  = preference / cache / legacy migration only
```

硬规则：

- Index != Metadata。`path`、`modified`、`size`、`sourceType` 属于 index；`tags`、`category`、`description`、`status`、`collection` 属于 metadata layer。
- Manifest != Truth。manifest 可以是 projection、cache 或 fallback，但不能成为人工编辑的长期数据库。
- build script 不允许出现 `const overlays = {}` 这类内联 metadata 数据库；脚本只能 normalize、join index 与 metadata sidecar、输出 projection。
- stable id 必须与文件路径分离。书籍当前使用 `metadataId` 表达语义身份，`openlistPath` 只是文件绑定；文件移动后不应制造新对象。
- P0 可用 JSON sidecar 承担 metadata layer，但 P1 必须迁向 Directus / Payload / 同级 metadata DB；MySQL 只承担 runtime state，不存文章正文或大文件。
- localStorage 新 key 必须先分类，不能写成 reader truth、metadata truth、collection truth 或 OpenList index truth。

- 当前 Web PWA surface 已有 `apps/web/public/manifest.webmanifest` 与 `apps/web/public/sw.js`。Service worker 只允许缓存静态页面和构建资产，禁止拦截 `/api/*`、`/openlist/*`、`/reader/openlist`、`/books/openlist` 和 HTTP Range 请求，避免污染 OpenList raw、PDF/EPUB Reader 和 Runtime API。
- `npm run check:pwa` 是 PWA/TWA surface 的本地质量门：检查 manifest、标准图标尺寸、service worker runtime 边界、BaseLayout 注册、android-shell 合同和 Digital Asset Links；它已接入 `npm run check`。
- `apps/android-shell/twa.contract.json` 是 Android shell 的机器合同；Bubblewrap 只能消费线上已部署并通过 installability 检查的 `https://blog.tengokukk.com/manifest.webmanifest`。
- `apps/web/public/.well-known/assetlinks.json` 是 TWA 域名信任声明；测试签名 APK 的 SHA256 指纹必须同时写入 `apps/android-shell/twa.contract.json` 和该 JSON，否则 Android 会停在启动图或降级 Custom Tabs。
- `npm run android:twa:validate` 会同时检查本地 PWA surface 与线上 manifest / service worker / homepage registration / `assetlinks.json`。
- `npm run android:twa:generate` 会从线上 manifest 自动生成 Bubblewrap 工程到 `.runtime/android-twa`；该目录是生成物，不提交，不拥有业务 authority。
- `npm run android:twa:build` 会继续生成未签名 APK 与 AAB：`.runtime/android-twa/app-release-unsigned-aligned.apk` 和 `.runtime/android-twa/app/build/outputs/bundle/release/app-release.aab`。
- `npm run android:twa:build:test-signed` 会生成本机测试签名 APK：`.runtime/android-twa/app-release-signed.apk`。该测试 keystore 只用于本机安装验证，不是发布密钥。
- `.github/workflows/android-twa.yml` 是 CI 自动生成入口，push 到相关 PWA / android-shell 文件或手动触发时会上传 APK/AAB artifact。
- Windows 本机若 Gradle 下载慢，可临时设置 `TWA_GRADLE_DISTRIBUTION_URL=https://mirrors.cloud.tencent.com/gradle/gradle-8.11.1-bin.zip` 后运行 `npm run android:twa:build`。脚本会为 Bubblewrap 生成 Android SDK 兼容视图，不修改真实 SDK。

当前 monorepo runtime skeleton：

```text
emptyinkpot.github.io
├── apps/
│   ├── web/              Astro Projection
│   ├── admin-next/       Runtime API / gateway / cache
│   └── android-shell/    PWA + Bubblewrap / TWA shell skeleton
├── packages/
│   ├── runtime-contract/ Shared Runtime API envelope and schema drafts
│   ├── object-model/     Shared KnowledgeObject schema drafts
│   ├── runtime-kernel/   Frontend command / overlay / drawer contract
│   └── design-system/    Runtime experience tokens
├── infra/
├── public-data/
└── tools/
```

`apps/android-shell` 当前只保存 TWA 合同和自动生成入口，不包含 Kotlin Native 代码。`packages/runtime-contract` 与 `packages/object-model` 是后续 Web / Android / Search / Agent 的共享合同入口，不是新数据真源。`packages/runtime-kernel` 是前端交互收束合同，只定义 command / overlay / drawer / keyboard / storage classification，不是新 store，也不拥有数据 truth。`packages/design-system` 是 Runtime Experience token contract，不是组件库。

#### 0.7.5.2 Target High-Level Architecture

```text
MyBlog/
├── apps/
│   ├── web/              # Astro Projection（当前生产前台）
│   ├── android-shell/    # PWA / TWA Android Projection skeleton
│   ├── admin-next/       # Next.js Runtime API / gateway / cache
│   └── api/              # 后续可独立拆出的 Runtime API workspace
│
├── packages/
│   ├── runtime-contract/ # API envelope / response schema
│   ├── object-model/     # KnowledgeObject schema
│   ├── runtime-kernel/   # frontend command / overlay / drawer convergence contract
│   ├── design-system/    # runtime experience / motion / depth / focus tokens
│   ├── search-client/    # 后续 Meilisearch client contract
│   ├── api-contract/     # 后续 OpenAPI / generated clients
│   └── ui-tokens/        # 后续跨 surface design tokens
│
├── infra/
├── public-data/
├── tools/
└── .runtime/
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
| `.home-feed-shell` | `display:grid`；列宽 `minmax(0,1fr) 260px`；折叠态 `minmax(0,1fr) 56px`；gap `0`；最大宽度 `min(1480px, 100% - 40px)`；高度 `100%` |
| `.home-feed-rail` | 右侧系统级侧边栏；`position: sticky; top: 0`；高度 `100vh`；内部可滚动；只允许左分割线和极浅背景 |
| `.home-feed-main` | 首页主 Feed 唯一主滚动容器；`overflow-y:auto`；右 padding `20px`；底部 padding `32px`；`min-width:0` |
| `.home-feed-toolbar` | sticky 筛选条；`top:0`；z-index `20`；gap `16px`；margin-bottom `16px`；padding `12px 0` |
| `.home-feed-grid` | CSS columns 瀑布流；桌面 `column-count:3`；column gap `16px` |
| `.home-article-drawer` | 右侧阅读抽屉；fixed；宽 `min(760px,100vw)`；高 `100vh`；z-index `90` |

首页 Feed / Drawer 精确尺寸（Glass legacy 基础值）：

以下表格记录的是 `global.css` 中仍然保留的 Glass / Workbench 基础 class 值。由于 `<html data-theme="heritage">` 是当前默认输出，这些值会被后面的 Heritage override 覆盖。复刻当前默认画面时，不得只按本表还原渐变、毛玻璃和大阴影。

| class | 当前值 |
| --- | --- |
| `.home-feed-profile` / `.home-feed-rail-card` | 作为 `.home-sidebar-section` 分组使用；无独立边框、无圆角、无阴影、无毛玻璃；只用底部分割线 |
| `.home-feed-brand` | min-height `34px`；padding `0`；gap `8px`；logo `18px × 18px`；不做 badge/pill |
| `.home-feed-avatar` | `64px × 64px`；折叠态 `32px × 32px`；圆形 |
| `.home-feed-tabs` | 顶部唯一导航；`display:flex`；gap `6px`；允许 wrap |
| `.home-feed-tab` | min-height `31px`；padding `6px 10px`；字号 `13px`；底边 `2px solid transparent`；active 只改底边和文字色 |
| `.home-feed-toolbar` | 背景 `linear-gradient(180deg, rgb(244 238 231 / var(--home-toolbar-glass-top-alpha)), rgb(244 238 231 / var(--home-toolbar-glass-bottom-alpha)))`；默认 alpha `0.94 -> 0.84`；毛玻璃变量同卡片 |
| `.home-feed-card` | `display:inline-block`；宽 `100%`；底部 margin `16px`；`break-inside: avoid`；边框 `1px rgba(255,255,255,0.7)`；背景 `linear-gradient(180deg, rgb(255 255 255 / var(--home-card-glass-top-alpha)), rgb(255 255 255 / var(--home-card-glass-bottom-alpha)))`；默认 alpha `0.92 -> 0.78`；hover `translateY(-2px)` |
| `.home-feed-card__cover` | 标准 min-height `160px`；tall `238px`；compact `118px` |
| `.home-feed-card__mark` | min-height `122px`；padding `14px` |
| `.home-feed-card__body` | padding `15px`；gap `10px` |
| `.home-feed-card h2` | 标准字号 `21px`；compact `18px`；行高 `1.12`；必须 `overflow-wrap:anywhere` |
| `.home-feed-card p` | 字号 `13px`；行高 `1.68`；必须 `overflow-wrap:anywhere` |
| `.home-feed-card__tags` | inline metadata line；字号 `11px`；字距 `0.08em`；标签间使用 `/` 分隔 |
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
| `.home-feed-shell` | `width:min(1520px,100% - 40px)`；gap `0`；padding `0` | 右侧栏是布局层，主内容自己承担内部 padding |
| `.home-feed-rail` | `border-left:1px solid #cbbda9`；radius `0`；background 极浅 `paper-deep`；shadow none | 右栏是系统级 sidebar，不是内容卡片 |
| `.home-feed-profile` / `.home-feed-rail-card` | border `0` + `border-bottom:1px solid #d8cfc2`；radius `0`；background transparent；shadow none | 栏内只做分组列表，不做模块卡片 |
| `.home-feed-card` / `.chart-card` / `.showcase-card` | border `1px solid #cbbda9`；radius `4px`；background `#ffffff`；shadow `0 1px 0 rgba(0,0,0,.04)` | 当前主内容卡片必须白，不允许恢复 `linear-gradient`、blur 和厚阴影 |
| `.home-sidebar-nav` | 固定导航列表；链接只允许弱 hover 背景和文字色变化 | 右栏上半区承担稳定入口，不恢复 dashboard |
| `.home-feed-toolbar` | background `#f5f1e8`；底边 `2px solid #d8cfc2`；sticky | 筛选时只隐藏已有卡片，不重建 DOM |
| `.home-feed-card` | `position:relative`；`overflow:visible`；`border-left-width:4px`；transition `transform var(--motion-base) var(--ease-standard)` | 允许书签露出；正文、图片、图表不得溢出卡片内容区 |
| `.home-feed-card:hover` | `translateY(-1px)`；无阴影增强 | hover 只给结构反馈，不制造漂浮感 |
| `.home-feed-card h2` | `color: var(--bookmark-color, #1e1b18)` | 标题颜色跟随书签语义色 |
| `.home-feed-card__tags` | no border；no pill；no chip background；`/` separated metadata typography | 不使用 badge / chip / SaaS filter 风 |
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
- OpenList 不是 FeedItem；它是文件源嵌入入口。首页顶部 `史料素材库` 右侧的 `OpenList` 按钮和 Command Palette 的 OpenList 命令打开全局 `.openlist-embed-layer` iframe，iframe 源为同域 `/openlist/`。
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

- 书架不再维护静态书籍种子；OpenList 当前配置的书籍目录默认 `/Obsidian/docs/books/original`，它是书籍存在性来源。旧 `/夸克网盘/obsidian/data/docs/books/original` 已删除，不能 resurrect。`public-data/books/books-index.json` 是可再生文件索引投影；`public-data/books/books.metadata.json` 是 P0 可版本化 metadata layer；任何 overlay 都不能创建、恢复或覆盖 OpenList 不存在的书。
- 音乐第一阶段用 `apps/web/src/data/music.ts`，图片约定放 `apps/web/public/images/music/`。
- 首页只放书架 / 音乐摘要卡片；主点击行为打开 drawer，完整内容通过 drawer action 进入 `/books/` 和 `/music/`。

#### 0.7.5.15c.3 Private Bookshelf / Reader Contract

`/books/` 当前升级为站内私人阅读系统入口，不再只是 Showcase 卡片页。边界固定为：

```text
MyBlog
├─ /books/          微信读书式书架：封面墙、分类、搜索、最近阅读
├─ /books/openlist/?path=...   书籍详情：由 OpenList path runtime 决定
├─ /reader/openlist/?path=...  在线阅读器：EPUB 用 react-reader，PDF 用 PDF.js / react-pdf runtime
└─ /settings/       OpenList Base URL、书籍目录、阅读主题、最近阅读开关

OpenList
├─ /api/openlist/status         检查服务端 OpenList 连接与公开 root
├─ /api/openlist/get            读取单个文件信息，返回本站 raw 代理 URL
├─ /api/openlist/raw            只读已缓存 EPUB/PDF 原始文件，供 reader / preview 使用
├─ /api/openlist/cover          按 path + modified + size 抽取并缓存书籍真实封面
├─ /api/openlist/covers/prewarm 按索引分批预热 EPUB/PDF 真实封面，只供导入/后台任务使用
├─ /api/openlist/files/prewarm  按索引分批预热 EPUB/PDF 原始文件缓存，只供导入/后台任务使用
├─ /api/openlist/pages/prewarm  按索引分批预热 PDF 前几页真实页面缓存，只供导入/后台任务使用
├─ /api/openlist/list           列出允许公开 root 内的目录
├─ /api/openlist/index          读取服务端文件索引
└─ /api/openlist/index/rebuild  递归扫描 OpenList，生成文件数据库
```

当前本机 OpenList 事实：

- 工程路径：`E:\My Project\OpenList`
- 服务器本机 HTTP：`http://127.0.0.1:5244`，前台不再直连该地址，统一通过 `blog.tengokukk.com/api/openlist/*` 代理。
- 公开嵌入路由：`https://blog.tengokukk.com/openlist/`，由 MyBlog 的 Nginx 同域反代到服务器本机 `127.0.0.1:5244`，用于 iframe 面板查看当前 OpenList UI。
- WebDAV 入口由 OpenList 自身提供，路由是 `/openlist/dav/`；它只保留为 OpenList 文件访问能力和历史参考，不承担当前 Obsidian active sync。当前 Obsidian active sync 固定为 `E:\Vaults\Obsidian` -> Syncthing `obsidian-vault` -> `/home/vault/Obsidian`，不得再把 Remotely Save / WebDAV 写成当前文章链路。WebDAV 用户如用于其他文件访问，凭据只保存在 Obsidian 插件配置或服务器环境，不进入仓库、README、日志或前端 bundle。
- 服务端 API 前缀：OpenList 当前设置了 `site_url=https://blog.tengokukk.com/openlist`，所以 `apps/admin-next` 访问本机 OpenList API 时默认使用 `OPENLIST_API_PREFIX=/openlist`。
- 已验证存储挂载：`/夸克网盘`、`/腾讯云COS`
- 已验证服务器结合挂载：`/Obsidian` 是 OpenList Local driver，指向服务器热镜像 `/home/vault/Obsidian`，只作为公网文件入口和 public identity，不是第二套 Vault 真源；admin-next `OPENLIST_PUBLIC_ROOTS` 当前为 `/Obsidian,/腾讯云COS,/夸克网盘`。
- 腾讯云 COS bucket：`myblog-media-1410041307`，地域 `ap-shanghai`，OpenList 挂载点 `/腾讯云COS`，OpenList storage id `2`，驱动 `S3`，endpoint `cos.ap-shanghai.myqcloud.com`。
- COS 目录约定：`/腾讯云COS/books` 放书籍原件或镜像，`/腾讯云COS/visuals` 放视觉素材原图，`/腾讯云COS/videos` 放视频素材，`/腾讯云COS/archive` 放归档与迁移包，`/_verify` 只用于连通性测试。
- COS 验证结果：`POST /api/fs/mkdir` 可创建目录，`PUT /api/fs/put` 可上传文件，`POST /api/fs/list` 可列出对象；COS bucket 侧已看到 `_verify/openlist-cos.txt`。
- 已验证 API：`POST /api/fs/list`、`POST /api/fs/get`、`POST /api/fs/mkdir`、`PUT /api/fs/put`、`GET /api/admin/storage/list`、`POST /api/admin/storage/create`、`POST /api/admin/storage/load_all`
- `server/handles/fsread.go` 的 `FsGetResp` 包含 `raw_url`
- 不把 OpenList token、网盘 cookie 或其他 secret 写入 MyBlog 前端；私有鉴权与 raw 文件读取必须走 `apps/admin-next` 服务端代理。
- 首页 Feed tabs 和普通页面顶部导航中的 OpenList 入口必须打开全局嵌入层，不直接跳转到公网 `:5244`。
- 文件数据库第一版写入 `public-data/openlist-index/files.json`；OpenList 负责文件存储，MyBlog/OpenList Index 负责语义索引，默认递归到 8 层并索引最多 50000 个条目。
- OpenList Index 是文件目录快照，不是 Vault 同步器。当前 Obsidian 文章与附件链路应先检查 Syncthing `obsidian-vault`、`E:\Vaults\Obsidian` 和 `/home/vault/Obsidian`；不能通过 MyBlog 的 index rebuild、visual manifest 或一次性 API upload 伪装修复。`/夸克网盘/obsidian/data` 已删除，不得回流为文章真源或书籍来源。
- 服务器磁盘策略：`/dev/vda2` 当前是 40GB root disk，Lighthouse 不支持直接 `ResizeDisks` 扩当前系统盘；新增大文件不应落到 `/srv/myblog/public-data/openlist-files` 这类本地缓存作为长期存储。长期原件进入 COS 或网盘，访客 reader 本地缓存只保留已索引、可淘汰的派生数据。OpenList 不能当系统盘、数据库盘、Syncthing 热镜像、`/srv/myblog`、`node_modules`、Astro dist 或 Pagefind 的底层文件系统；它只承担 public access、blob backend、冷归档和统一资源地址空间。
- 服务器 OpenList 存储维护入口：`npm run server:openlist-storage` 默认只审计根盘、OpenList mounts、admin-next public roots、热层目录和冷归档候选；只有显式执行 `npm run server:openlist-storage -- --prune-openlist-file-cache --apply` 才会清理 `/srv/myblog/public-data/openlist-files` 中可再生 EPUB/PDF 原件缓存，并重置 manifest。该清理不删除 `/home/vault/Obsidian`、OpenList DB、`/srv/myblog/site/runtime`、`openlist-covers` 或 `openlist-pages`。

书籍系统实现规则：

- 书籍文件源与 existence authority 属于 OpenList；`public-data/books/books-index.json` 只记录 OpenList file index projection：`openlistPath`、`modified`、`size`、`sourceType`、封面缓存输入和派生标题。书名修正、作者修正、分类、标签、note、description、status 和 collection hints 属于 metadata layer，只能写入 `public-data/books/books.metadata.json`，后续迁入 Directus 或同级 metadata DB。阅读状态不属于文件层，必须进入 MySQL Runtime Layer。
- 当前书籍资料库默认 OpenList 路径是 `/Obsidian/docs/books/original`；旧 `/夸克网盘/obsidian/data/docs/books/original` 已删除。博客书架通过 `npm run runtime:books` 从 `/api/openlist/index` 生成 `books-index.json`，前台只读该 manifest，不在访客请求里 live-list OpenList；新增 EPUB/PDF/MOBI 文件需要索引重建后出现在 `/books/`，`.md` 报告类文件不进入书架。
- `openlistPath` 写绝对路径时直接使用该路径；写相对路径时拼接 `/settings/` 的 `openlistBooksPath`。Reader 直接拼接 `/api/openlist/raw?path=...&modified=...&size=...`，不在打开抽屉时再调用 OpenList `fs/get`，也不让浏览器直接访问 OpenList。
- 原始文件缓存策略：EPUB/PDF 文件属于 OpenList 存储层，但 visitor reader 不允许每次打开都回源下载。导入链路必须先运行 `/api/openlist/index/rebuild`，再运行 `/api/openlist/files/prewarm`，把 EPUB/PDF 原始字节按 `path + modified + size` 落盘到 `public-data/openlist-files/` 并写入 `public-data/openlist-files/manifest.json`。访客访问 `/api/openlist/raw` 时只能读取 manifest 命中的本地缓存文件，并支持 HTTP Range 供 PDF.js / epub.js 分段读取；缓存未命中返回 404，不能在访客请求里临时下载 OpenList。文件变更后因为 `modified/size` 改变，下一次 index rebuild + files prewarm 会生成新缓存；未变更时所有访客复用同一份缓存文件。
- 封面策略：只使用真实来源，不生成伪封面。封面解析属于导入/索引阶段，不属于访客打开页面阶段。`/api/openlist/index/rebuild` 只更新文件索引；随后后台任务调用 `/api/openlist/covers/prewarm` 逐本预热 EPUB/PDF 封面，不能因为单本慢文件阻断整轮同步。这两个后台接口同时支持 POST JSON 和 GET query，服务器本机任务优先用 GET query，并把 OpenList raw URL 收敛到本机 `OPENLIST_BASE_URL + OPENLIST_API_PREFIX` 下载，避免导入任务绕公网网关。预热优先使用 OpenList `thumb`，否则从 EPUB 内嵌 cover 或 PDF 首页抽取真实封面，并按 `path + modified + size` 落盘缓存到 `public-data/openlist-covers/`，同时写入 `public-data/openlist-covers/manifest.json`。访客访问 `/api/openlist/cover?path=...` 时只读 manifest / 已落盘 jpg；缓存未命中就返回 404，不临时解析。manifest 命中还要校验 `modified/size`，文件变更后下一次索引重建 + prewarm 会生成新缓存；未变更时一直复用已存画面。MOBI 暂无站内封面解析器，显示明确“无封面”占位，不伪装成可识别封面。首页 Feed、书架页、详情页必须共用这套真实封面链路，不能用标题字样或 SVG poster 冒充书籍封面。
- Collection / Stack Card Layout：书籍合集不是自由 absolute 封面堆叠，而是稳定媒体对象。`.bookshelf-grid` 负责位置，必须 `align-items:start`，不得让展开合集把同一行其他卡片拉伸。`.book-collection` 是真实 grid item，必须 `contain: layout paint` 与 `isolation:isolate`；`.book-collection__button` 是固定 card 容器，必须 `overflow:hidden`；`.book-collection__stack` 是 Stack Viewport，必须有真实 `aspect-ratio` / 有界高度 / `overflow:hidden` / `contain:layout paint`。封面堆叠只允许在 Stack Viewport 内做“模拟堆叠”，不允许跨卡片溢出，不允许自由随机 transform；旋转最大约 2 度，水平偏移控制在 4-12px，阴影极弱。Grid、Stack Scene、Book Object、Metadata 四层职责必须分离；后续若引入 `react-photo-album` 或其他成熟 gallery layout，只能替换 Gallery Layout 层，不能破坏 OpenList、封面缓存、Reader Runtime 与 Knowledge Object 合同。
- Book Drawer Reader：书籍不是文件入口，而是可阅读知识对象。首页 Feed 的图书卡片点击后必须在同一个 `.home-article-drawer` 内进入阅读空间，行为对齐文章 drawer：外层 drawer 上方保留标题、阅读主题、收藏、盖章、知识图谱、详情页和完整书架动作；内嵌 book reader 在 drawer mode 不得再渲染第二层 `.book-reader-topbar`，也不得出现 PDF sticky 页码控制条。正文区域直接挂载 EPUB/PDF reader，不能只展示元数据卡，也不能 iframe 打开 OpenList。P0 复用 `apps/web/src/components/books/BookReader.tsx`、`EpubReader.tsx`、`PdfReader.tsx`：`PdfReader.tsx` 只做 mode dispatch，`page` mode 进入独立 `PdfPageReader` 保留 `react-pdf` 单页阅读，`drawer` mode 进入独立 `PdfDrawerReader`，不得在同一组件里用条件 hooks 混合两套 runtime。EPUB 在 drawer mode 使用 `react-reader` / `epub.js` 的 `manager:"continuous" + flow:"scrolled" + spread:"none"`，保留内置 TOC 与正文渲染；PDF drawer 不再走 `react-pdf` 的 `<Document>` 组件，而是直接用 `pdfjs-dist`、`PDFDataRangeTransport` 和 canvas page runtime，首个 `bytes=0-767999` 分片同时作为 length probe 与 `initialData`，且 transport 构造时必须传 `progressiveDone:true`，避免 PDF.js 把首段当成未结束 full stream 持续等待；后续由自定义 transport 控制 Range 请求，避免 PDF.js 自己触发整本 `200` 下载。PDF 抽屉允许先显示已缓存真实封面作为即时首屏，但这只是 PDF.js 初始化期间的阅读过渡，不能用生成图或标题 poster 冒充正文；第一页 canvas 渲染成功后真实 reader 必须接管。完整阅读页使用 `/reader/openlist/?path=...`，不再由 `/reader/[id]` 的静态书籍宇宙决定。PDF 大纲目录从 PDF outline 读取，缺 outline 的 PDF 不伪造目录。首页只挂一个 `BookDrawerReader` React island，并通过 `emptyinkpot:book-drawer-open` 事件按需把 reader portal 到当前抽屉挂载点；原生 drawer 脚本必须把最近一次 book-open detail 写入 `window.__emptyinkpotPendingBookDrawerOpen`，这样 React island hydrate 晚于用户点击时也能补接事件。Reader 体感必须使用渐进预热：页面空闲时预加载 `BookReader` chunk；书籍卡片进入视口附近时低优先级预取 raw 首段；hover / focus / 点击意图出现时高优先级预取 raw 首尾片段，并可把目标书籍预挂进隐藏 Reader Pool；真正点击后 reader 再继续加载剩余正文。不得在访客打开首页时全量下载所有 EPUB/PDF。
- Reader Runtime Persistence：首页书籍 drawer 不得再采用“关闭即销毁 reader”的临时挂载模型。`BookDrawerReader` 必须维护一个最近 3 本的 Reader Pool，当前书籍 reader 贴合当前 `.book-drawer-reader-panel__mount`，关闭 drawer 时只隐藏并脱开当前 mount，不卸载最近 reader；hover / focus 意图阶段可以把目标书籍先放入隐藏池内预出生，再次打开池内书籍时复用已初始化的 epub.js / pdf.js runtime，避免 EPUB 重新解析 spine、PDF.js 重新初始化 worker。池外旧书可以被 LRU 淘汰以控制内存。阅读记忆写入必须 debounce：EPUB location 写入默认约 3s 合并一次，PDF 可见页写入默认约 2.5s 合并一次；不得在滚动 / locationChanged 高频事件中直接持续打 MySQL。
- Reader Runtime 常驻化：首页 `BookDrawerReader` 启动后要在 idle 阶段预加载轻量 `BookReader` shell，并预热 PDF / EPUB runtime；不要等点击后才动态 import 整个 reader。`BookReader` shell 不得静态 import `PdfReader` 和 `EpubReader`，必须通过 `readerRuntime.ts` 按 `sourceType` 拆包加载。卡片进入视口或 hover/focus 时不仅预热 raw 文件 Range，也要调用对应 runtime preload。PDF worker 必须使用本地构建产物 URL，不依赖外部 CDN；线上 Nginx 必须为 `_astro/*.mjs` 返回 `application/javascript` 或 `text/javascript`，否则 PDF.js 会因 MIME 拒绝 module worker 并退回 fake worker，导致大 PDF 在主线程长期空白解析。PDF drawer 的 direct runtime 必须只把 `range` transport 交给 PDF.js，不把 URL 交给 PDF.js；否则 PDF.js 仍可能绕过预热策略发起整本 `200`。`disableStream` 与 `disableAutoFetch` 在 drawer direct runtime 中都必须保持 true：前者阻止 PDF.js 自己走 full stream，后者阻止它在文档 resolve 前把整本 PDF 拆成一串 206 全量补齐；非线性 PDF 仍可通过同一个自定义 transport 请求 xref / page tree / 首页渲染所需 Range。成功标准是目标书籍先出现第一页 canvas，后续按视口继续拉取必要 Range，所有 PDF 请求仍为 `/api/openlist/raw` 的 206 缓存命中，不出现整本 200。Range 预热状态必须按 `head/tail` 分开记录：首段预热完成不能阻止 hover/click 阶段继续预热尾段。

- PDF Page Cache：PDF 抽屉首屏不能阻塞在浏览器端 PDF.js 文档初始化上。`apps/admin-next/app/api/openlist/page/route.js` 通过 `apps/admin-next/lib/openlist-pdf-pages.js` 从已缓存的 OpenList PDF 文件渲染指定页，按 `path + modified + size + page + version` 写入 `/srv/myblog/public-data/openlist-pages`，返回真实页面 JPEG。`apps/web/src/components/books/PdfReader.tsx` 在 drawer mode 先挂 `CachedPdfPageList`：打开时显示前几页真实正文图，滚动到底部附近时按批次追加后续页，单页 API 第一次渲染后落盘，之后所有访客直接命中缓存；PDF.js direct runtime 在后台继续初始化并在第一页 canvas 成功后接管。新增 PDF 后应在 `/api/openlist/files/prewarm` 之后运行 `/api/openlist/pages/prewarm?path=...&pages=4` 或更高页数，避免第一个访客承担首批页面渲染成本。
- Book Drawer 的即时封面首屏必须由 Astro 静态模板直接输出缓存封面 URL，即 `book.cover || /api/openlist/cover?...`，不能依赖 `BookCover client:load` 才出现封面。React reader 可以随后接管 mount，但最早点击路径也必须有真实封面内容。
- MOBI import pipeline：MOBI 是文件源格式，不是 Reader Runtime 标准格式。前台 reader 只读 EPUB/PDF；MOBI 必须通过后台导入管线使用 Calibre 或同级工具转换为 EPUB 后再进入 reader。转换前的 MOBI 条目可以出现在书架作为外部文件对象，但不得伪装成可直接站内阅读正文。
- Reader Runtime 后续替换路线：当前 P0 仍使用 `react-reader` 与 `react-pdf`，但长期目标是把 EPUB runtime 评估迁移到 `foliate-js`，PDF runtime 评估迁移到 `react-pdf-viewer` 或同级具备虚拟滚动、搜索、缩略图和稳定 toolbar 的成熟内核。替换边界是 Reader Runtime 层，OpenList 文件缓存、MySQL Reader Memory、Highlight、Graph 和 Knowledge Object 合同不得随 UI 内核替换而漂移。
- Book Drawer UI 方向：参考 Readest、Apple Books、Kindle、微信读书、Omnivore 的“现代阅读产品”而不是后台管理页或旧 PDF 阅读器。抽屉内不得继续堆横向分区、硬边框、表单式按钮、显眼分页条；阅读内容优先，界面分区依靠留白、阴影、深浅层次和封面材质。主题切换使用轻量图标 / `Aa` 胶囊控件，不使用 `Light / Sepia / Dark` 这类后台按钮文案。书籍导语区只承担封面、标题、摘要和标签的安静过渡，不得做成带粗边框的元数据卡。Reader 容器不得出现“方框套 PDF 控件”的视觉；PDF 页面在抽屉里像纸页连续落在阅读空间中，EPUB 像长文流式阅读。
- Book Drawer Hero Layout：书籍 drawer 必须使用一体化 hero，而不是“外层标题 + 内层标题 + Reader 区”的 CMS 三段式。打开书籍时 `.home-article-drawer` 进入 `home-article-drawer--book` 状态，外层 header 只保留阅读主题、收藏、盖章、知识图谱、书籍详情、开始阅读、完整书架、关闭等动作，不再重复展示同一书名。内层 `.book-drawer-reader-panel__intro` 是唯一的书籍标题区：左侧大封面，右侧标题、摘要、catalog metadata 与阅读状态；抽屉 hero 封面必须正放，不使用歪斜、透视、书脊暗边或额外阴影，只展示书籍真实封面本身。Metadata 使用 `LIBRARY RECORD · PDF ARCHIVE · HISTORY` 这类目录线气质，弱色、小字、字距，不像调试信息或 Bootstrap 标签。留白要服务隐形结构：cover、title、summary、reader mount 在同一阅读空间内形成出版物排版，不得重新退回“网页组件堆叠”。
- Tag / Metadata UI 方向：标签不是按钮、筛选 chip 或 Bootstrap badge，而是出版物式 metadata。默认展示为 `历史 / 朝鲜 / PDF ARCHIVE` 这种 inline metadata line：无边框、无胶囊背景、无彩色块、弱色、小字号、适度字距、用 `/` 或 `·` 分隔。Feed、Book Drawer、Book Detail、Hover Preview、Showcase Card 必须优先使用 `.home-feed-card__tags` / `.book-detail-tags` 这类 typography metadata，而不是 `border + padding` 的 chip。只有真正可执行的 action 才能做成按钮；语义分类、格式、年代、主题都应像目录信息一样弱化。精选、重要、核心、必读这类状态未来可以 Seal 化；历史、朝鲜、PDF、Archive 这类分类只能 metadata 化。
- 浏览器本地设置写入 `emptyinkpot-book-settings`；阅读主题继续同步 `emptyinkpot-reader-theme`，与首页 reader drawer 共用主题 token。
- MySQL Runtime Layer P0 只承担动态状态，不替代 OpenList 或 GitHub：
  - OpenList：EPUB/PDF/MOBI 原始文件、真实封面来源、文件索引与封面缓存。
  - GitHub / 源码：Markdown、项目 Wiki、可版本化 metadata layer；`public-data/books/books.metadata.json` 是 P0 sidecar，`books-index.json` 不拥有 metadata authority。
  - MySQL：`reader_memory` 与 `reader_highlights`，后续再扩展 annotations / stickers / seals / graph links。
- MySQL 连接只允许服务端读取 `MYBLOG_DB_HOST`、`MYBLOG_DB_PORT`、`MYBLOG_DB_USER`、`MYBLOG_DB_PASSWORD`、`MYBLOG_DB_NAME`；不得把数据库连接串、密码或 token 写进前端 bundle。
- P0 schema 的 canonical owner 是 `apps/admin-next/lib/runtime-db.js`；首次 API 访问自动建库表，后续只做 `CREATE TABLE IF NOT EXISTS` 幂等校验，不新建兼容表。
- `reader_memory` 记录文章/书籍阅读进度、位置、最近阅读时间；`reader_highlights` 记录高亮文本、颜色、note 与 anchor JSON。浏览器 localStorage 只保留迁移前缓存和离线 UI 设置，不再作为 reader runtime 真源。
- 阅读进度旧 key `emptyinkpot-book-progress:<id>` 与最近阅读旧 key `emptyinkpot-book-recent` 只能作为一次性读取迁移来源；新写入走 `/api/runtime/reader/memory`。
- Reader Runtime API 合同：

| Method | Route | 职责 |
| --- | --- | --- |
| `GET` | `/api/runtime/reader/memory?limit=50` | 读取最近阅读，书籍和文章共用 |
| `GET` | `/api/runtime/reader/memory?objectId=<id>` | 读取单个对象阅读位置 |
| `POST` | `/api/runtime/reader/memory` | upsert 阅读记忆；未传 `progress/location/scrollTop` 时不得覆盖旧值 |
| `GET` | `/api/runtime/reader/highlights?limit=100` | 读取最近高亮 |
| `GET` | `/api/runtime/reader/highlights?objectId=<id>` | 读取单个对象高亮 |
| `POST` | `/api/runtime/reader/highlights` | upsert 高亮 |

- `reader_memory` 最小字段：`object_id`、`object_type`、`title`、`href`、`progress`、`location_json`、`scroll_top`、`last_read_at`、`created_at`、`updated_at`。
- `reader_highlights` 最小字段：`id`、`object_id`、`object_type`、`title`、`text`、`color`、`note`、`anchor_json`、`created_at`、`updated_at`。
- `object_id` 规则：文章使用 `post:<slug>` / `note:<slug>` 等稳定内容 ID；书籍统一使用 OpenList `openlistPath` 派生的稳定 ID。`object_id` 不得用显示标题临时生成，`books.ts` 不再分配书籍 ID。
- EPUB reader 使用 `react-reader`，其底层为 `epubjs`；PDF reader 使用 `react-pdf`，其底层为 PDF.js。
- PDF.js worker 当前使用本地构建产物 URL；生产 Nginx 对 `.mjs` 的 MIME 配置是 reader runtime 的硬门槛，发布后必须用 `curl -I https://blog.tengokukk.com/_astro/pdf.worker*.mjs` 验证 `Content-Type` 为 JavaScript 类型。
- `/books/` 的视觉目标是“个人书架 / 阅读状态”，不是后台控制面；导航仍由顶部 Feed tabs 和详情页入口承担。
- BaseLayout chrome 合同：全站传统 `SiteHeader` 已退役，任何使用 `BaseLayout` 的独立页面都不得再渲染 `Vita Atramenti logo`、站点副标题和完整顶部导航串。页面导航回到首页系统侧栏、页面内 breadcrumb / action、Command Search 和 footer；不要在普通独立页重新塞一条全站 nav。`hideSiteChrome` 现在只负责是否隐藏 footer 以及是否进入 `home-mode` / `app-mode` / `bare-mode`，不再代表顶部导航开关。
- Bookshelf chrome 合同：`/books/` 与 `/books/openlist/?path=...` 是阅读产品表面，通过 `BaseLayout hideSiteChrome barePage` 隐藏 footer 和全站 chrome，但不得使用首页 `home-mode` 或 reader `app-mode`，以保证普通页面滚动、网格布局和书架自身 topbar / breadcrumb 正常工作。`/reader/openlist/?path=...` 使用 `appMode` 的极简阅读页。`/books/[id]` 与 `/reader/[id]` 不再生成书籍实体页。

Collection / Stack Card 后续合同：

- `/books/` 当前默认是一书一卡：OpenList 返回多少本具体书，书架和首页书籍 Feed 就必须展示多少张具体书卡。
- Collection / Stack Card 只能作为后续附加视图或专题入口，不能替代默认书籍清单，不能让具体书籍从主书架里消失。
- Collection 是 Knowledge Topic，不是文件夹；文案使用 `Collection`、`Topic`、`Shelf`，不得把 OpenList 目录名直接当 UI 分类目标。
- 后续如果恢复 Collection 视图，必须使用确定性规则聚合，不接 AI 自动聚类，不新增数据库表。规则可由书名、分类和标签推断：如 `朝鲜 / 韩国 / 高丽 / Joseon / Korea` 聚成“朝鲜历史”，`战争 / 冷战 / 越南` 聚成“战争与冷战”，`设计 / 网格 / 平面` 聚成“设计方法”。
- 后续 Collection 视图必须和一书一卡主视图并存，不能把 topic 内书籍从默认 grid 中移除。
- Collection Card 顶部只展示 top 3 封面，使用真实 `BookCover` 链路，不生成 poster，不用标题图替代封面；剩余数量显示 `+N`。
- Collection Card 必须显示 topic 标题、书籍数量、最近阅读或代表书名；hover 只做轻微展开和阴影，不做大幅扑克牌散开。
- 点击 Collection Card 不跳新路由，第一版在 `/books/` 内展开该 topic 的书籍清单；具体书籍通过 `详情` 与 `阅读` 进入 `/books/openlist/?path=...` 或 `/reader/openlist/?path=...`。
- 未来 P1 才允许加入知识时间轴、Room、Graph 关系和 AI Curated Shelf；这些不写成当前已落地事实。

首页硬规则追加：

- 首页只保留一个主 Feed。
- 图表、书籍、音乐都是 FeedItem。
- 左栏只放摘要，详情页放完整内容。
- 不再把 GitHub 热力图、折线图、语言分布、团队信号作为独立首页模块堆叠回去。

#### 0.7.5.15c.1 Project Studio / 项目工坊 Contract

`/projects/` 不再只是项目链接列表；当前目标是把它升级为 `Project Studio / 项目工坊`，与 `/books/`、`/music/`、`/github/`、`/knowledge/` 并列，承担项目、仓库、模块和协作入口的统一投影。

新的协作架构判断固定为：MyBlog 不再继续自研完整协作 runtime。项目工坊的长期协作内核目标是外置 AppFlowy Cloud；MyBlog 只作为 Public Projection Shell、项目入口、GitHub 信号投影、Reader / Graph / Feed 的连接层。

当前真实状态必须写清：

- AppFlowy / AppFlowy Cloud 是 `target-not-deployed`，不是当前运行依赖。
- `/projects/[slug]/` 现行页面是 `GitHub Workbench fallback`：它可以读取 repo、issues、PR、commits、contributors，并通过服务端 API 写回 Wiki / Timeline，但它不是最终协作系统。
- AppFlowy 部署前，不再继续把 Wiki、Timeline、Kanban、Comments、Realtime Presence 等能力手搓进 MyBlog。
- 推荐部署形态是 AppFlowy Cloud 独立运行在 `project.tengokukk.com`，MyBlog 的 `/projects/[slug]/` 在配置 `appflowyUrl` 后嵌入对应 workspace。

最终形态：

```text
MyBlog
├─ Public Projection Shell
├─ Runtime Feed
├─ Reader
├─ Knowledge Graph
└─ Project Studio
      └─ Embedded AppFlowy Workspace
```

分层职责：

| 层 | Authority / runtime | 职责 |
| --- | --- | --- |
| Obsidian | authoring truth | 长期知识、Markdown、Vault 写作 |
| AppFlowy | collaboration runtime target | 项目工坊、block editor、database、kanban、comments、realtime workspace |
| MyBlog | public projection shell | Feed、Reader、Graph、项目投影、GitHub 信号、公开页面 |
| OpenList | file layer | 文件映射、公网文件访问、附件/大文件承载 |

页面分类：

| 路由 | 页面模式 | 职责 |
| --- | --- | --- |
| `/projects/` | list / dashboard | 项目工坊首页；展示项目卡片网格、项目状态、GitHub 信号和最近项目动态 |
| `/projects/[slug]/` | projection shell / fallback workbench | AppFlowy 未配置时显示 GitHub Workbench fallback；配置 `appflowyUrl` 后嵌入外置 AppFlowy workspace |

现行实现边界：

- 当前实现仍基于 Astro content collection：`apps/web/src/content/projects/*.md`。
- GitHub 协作信号以 `apps/web/src/data/github-overview.emptyinkpot.json` 和 `apps/web/src/lib/github.ts` 作为构建期兜底；生产站通过 `/api/github/*` 运行时覆盖 repo、issues、pulls、commits、contributors 等状态。
- `apps/web/src/lib/projects.ts` 负责把项目 frontmatter 与 GitHub snapshot 合成为 `ProjectStudioView`。
- GitHub 第一阶段只作为代码仓库与 fallback 编辑入口：Wiki 条目使用 GitHub edit URL 或服务端 API；不在站点内伪造多人编辑后台。
- AppFlowy Cloud 是优先协作 runtime 目标：`https://github.com/AppFlowy-IO/AppFlowy-Cloud`。
- AppFlowy 是 block / collaboration runtime reference：`https://github.com/AppFlowy-IO/AppFlowy`。
- AFFiNE、Outline 可作为 workspace / wiki UX reference；未接入前不得写成已落地事实。
- AppFlowy Cloud 可复刻部署 skeleton 位于 `infra/appflowy-cloud/`，服务器目标目录是 `/srv/myblog/services/appflowy-cloud/`。该目录只表示 target runtime 的启动入口，不表示服务已运行。
- 当前服务器状态：skeleton 已同步到 `/srv/myblog/services/appflowy-cloud/`；Docker 和 Docker Compose 可用；AppFlowy 容器未启动；官方 AppFlowy-Cloud upstream 未 clone。
- 当前阻断项：`project.tengokukk.com` DNS 未解析；`/srv/myblog/services/appflowy-cloud` 约 6GB 可用，低于 AppFlowy readiness gate 的 40GB；服务器 `.env` 只有占位值，未配置生产密钥。
- 启动前必须在服务器执行 `cd /srv/myblog/services/appflowy-cloud && ./check-readiness.sh`，只有输出 `ready` 才允许 `./install-upstream.sh` 和 `docker compose up -d`。

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
  collaborationRuntime?: "github-workbench" | "appflowy-embed" | "none";
  collaborationStatus?: "interim-active" | "target-not-deployed" | "connected" | "disabled";
  appflowyUrl?: string;
  appflowyWorkspace?: string;
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

Project Studio collaboration contract：

```text
/projects/[slug]/
├─ Collaboration Runtime Panel
│  ├─ if appflowyUrl exists: embed external AppFlowy workspace
│  └─ else: show target-not-deployed state and GitHub fallback boundary
├─ GitHub Workbench fallback
│  ├─ repo / branch / issues / PR / commits / contributors
│  ├─ Wiki fallback editor via service API
│  └─ Timeline fallback via service API
└─ Right Inspector：contributors、wiki files、mini graph
```

GitHub Workbench workspace contract：

```text
/projects/[slug]/
├─ Fullscreen App Shell：隐藏全站 chrome，页面自身承担导航、状态与工作区
├─ Left Sidebar：品牌锚点、图标导航、当前态、API / GitHub 写入说明
├─ Main Workspace
│  ├─ Collaboration Runtime Panel：AppFlowy target / embed 状态
│  ├─ Sticky Statusbar：breadcrumb/repo、branch、updated、issues、PR、contributors、API badge、actions
│  ├─ Work Panels：GitHub fallback Wiki、Timeline、Modules、Issues、PR、Commits
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
- `/projects/[slug]/` 已新增 AppFlowy Collaboration Runtime 状态面板：配置 `appflowyUrl` 才嵌入外置 workspace；未配置时显示 `target-not-deployed`，并明确 GitHub Workbench 只是 fallback。
- 当前尚未初始化完整 `shadcn/ui` 组件目录，尚未接入 TinaCMS / Decap CMS，尚未接入 React Flow；这些仍是后续阶段。

成熟模板分层：

| 层 | 当前边界 | 后续推荐 |
| --- | --- | --- |
| 前台展示 | Astro content collections，Heritage 主题，静态构建 | 继续保留 Astro；首页可逐步引入 Magic UI / Motion Primitives 风格的 React islands |
| 项目工坊 / 工作台 | Astro 页面 + React command island + GitHub Workbench fallback | 外置部署 AppFlowy Cloud 后在 `/projects/[slug]/` 嵌入 workspace；MyBlog 不再自研完整协作 runtime |
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
P2：搜索边界收束
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
- `/visuals/` 当前是 Visual Collection library：静态 `apps/web/src/data/visuals.ts` seed + `/api/runtime/visuals/snapshot` runtime hydrate + Pinterest Shell + Immich 外部入口；接 Immich API importer 前只允许导出 / 展示索引，不把前台页面变成上传后台。
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
- MUST 让 Feed 成为主角：桌面结构为 `.home-feed-main` 主列 + 右侧 `.home-feed-rail` 系统级侧边栏；主内容可以保留手账/纸张视觉，侧边栏必须工具化、扁平化、可扫读。
- MUST 把首页右栏当作 layout layer，而不是内容卡片：`.home-feed-rail` 贴右侧边缘，只允许 `border-left` / 极浅背景 / 无圆角 / 无阴影；内部 `.home-sidebar-section` 只能是分组列表，不允许卡片套卡片、stamp、badge、图表或展示型模块。
- MUST 使用“单右侧栏混合模式”：上半固定导航（项目工坊、知识图谱、书架、GitHub、设置），下半动态上下文（最近阅读、本地阅读状态）。不得升级为左中右三栏，也不得恢复 dashboard/bento。
- MUST 支持右侧栏折叠：展开态约 `260px`，折叠态约 `56px`；折叠后隐藏文字，只保留头像/短图标，折叠按钮贴在侧栏边缘，不放进内容卡片里。
- MUST 在主区首屏展示动态 Hero 指标：posts、repos、projects、knowledge nodes；数字可用 React island ticker，但必须在低动效偏好下直接显示最终值。
- MUST 维持书籍对象 ID 唯一：OpenList 书籍使用 `openlistPath` 归一化后的稳定 id。首页 Feed、书架页、详情页、Reader、Knowledge 搜索和图谱都必须使用该稳定 id，不得再用 `book.title` 或 `books.ts` 派生第二套 ID。
- MUST 在首页顶部 Feed tabs 中把“书架”实现为 `data-feed-filter="book"` 的首页内筛选，不得直接链接到 `/books/`；`/books/` 作为完整书架页，只从 drawer action、Command Palette 或明确的“完整书架”入口进入。
- MUST 在首页 Feed 保留具体图书卡片；图书卡片必须展示书籍封面，点击打开阅读 drawer，drawer 内必须同时提供 `书籍详情`（`/books/openlist/?path=...`）、`开始阅读`（`/reader/openlist/?path=...`）和 `完整书架`（`/books/`）。
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
| P2 | 停止扩展 GitHub Workbench；只保留 fallback 和 AppFlowy target panel | 不新增 Wiki / Timeline / Kanban / Comments / Presence 自研能力 |
| P3 | 等文件真源、MarkdownObject schema、Quartz Runtime Layer 稳定后，再评估 AppFlowy Cloud 独立部署 | AppFlowy 启动前必须通过 DNS、磁盘、secret、readiness gate |
| P4 | AppFlowy object / page / database snapshot 进入 Project Feed、Knowledge Graph 和 Reader references | 使用明确 importer/API，不从 iframe DOM 抓取数据 |

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

当前实现已经从纯 `Astro 静态构建 + 客户端 localStorage` 升级为 `Astro 静态前台 + apps/admin-next Runtime API + MySQL Reader Runtime`。Search、Reader Memory、Highlight 和 Graph 仍不得拆成三套孤岛；浏览器 localStorage 只保留 UI 设置、迁移前缓存与明确的离线偏好。

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
侧栏 = 系统导航 / 最近阅读 / 状态上下文
顶部 = 你在看什么
中间 = 内容流
```

核心原则：

- `.home-feed-rail` 是系统级侧边栏，不是内容卡片：必须贴右侧边缘，使用扁平分组列表、分割线和弱 hover，不得使用独立卡片边框、圆角、阴影或毛玻璃。
- 主导航采用单右侧栏混合模式：`.home-sidebar-nav` 固定提供项目工坊、知识图谱、书架、GitHub、设置；`.home-feed-toolbar` 的 tabs 继续负责 Feed 内筛选。
- `.home-feed-rail` 下半部分只放最近阅读和阅读状态上下文；不得恢复 Signals 统计卡、Quick Actions 按钮组、GitHub 热力图、小柱状图、Mini Graph 展示块或多层方框。
- `.home-feed-rail` 必须可折叠：展开态约 `260px`，折叠态约 `56px`；折叠后文字隐藏，只保留头像/短图标，状态信息不抢占主内容视线。
- `.home-quickbar` 是 Dashboard 替代物，只能是轻量横向入口；不得承载大标题、大摘要、进度条或多行数据。
- 顶部 tabs 使用轻量标签式视觉，不做厚边框、重阴影、胶囊按钮组。
- 导航 = 右侧栏固定入口 + 顶部 Feed 筛选；阅读/状态 = 侧栏上下文；内容 = Feed。

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
│   ├── .home-sidebar-collapse
│   ├── .home-feed-profile
│   ├── .home-sidebar-nav
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
| System Sidebar | `.home-feed-rail`、`.home-sidebar-nav`、`.home-feed-profile`、`.home-feed-rail-card` | 右侧系统级侧边栏，固定导航 + 动态上下文 |
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
- Search 短期保持双轨：`/search/` 只代表 Pagefind 静态 archive 搜索，首页 Command 只代表 runtime feed 搜索；贴纸进入搜索前不得声称全站统一搜索。
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
type VisualCollection = {
  id: string;
  title: string;
  source: "pixiv" | "pinterest" | "local" | "openlist";
  sourceLabel: string;
  summary: string;
  mood: string;
  tags: string[];
  palette: {
    dominant: string;
    colors: string[];
  };
  coverImages: string[];
  images: VisualItem[];
  curationNote: string;
  related?: {
    posts?: string[];
    books?: string[];
    projects?: string[];
    visuals?: string[];
  };
};

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
- 当前 canonical 模型是 `VisualCollection[]`，不是裸 `VisualItem[]`。`visualItems` 只允许作为从 collection 派生的兼容视图，不能再作为首页主模型。
- 当前 P0 数据源为 `apps/web/src/data/visuals.ts`，示例资产位于 `apps/web/public/images/visuals/`。
- 首页 `.visual-feed-card` 必须按 collection 渲染有限数量的策展入口，不能因为 Pinterest / Pixiv / OpenList 图片数量增长而无限增加单图 Feed 卡。
- Collection card 使用代表图堆叠、catalog metadata、mood、palette 和 image count 表达主题；点击进入 Drawer 或 `/visuals/` board，而不是跳成单图下载入口。
- Drawer 中必须显示 collection curation note、board、调色板和可复制 Collection token；单张图片只是 board 内节点。
- `/visuals/` 是 Visual Collection library，主视图是 collection card + board 展开；不要把它做成图片墙、营销 landing page 或后台图库。
- 全站导航必须有 `/visuals/` 的显式入口，中文标签为“视觉素材”，避免图片内容只藏在首页 Feed 过滤器里。
- Immich 是当前唯一推荐接入的 AI Media Runtime：它负责图片 / 视频 ingest、时间线、人脸、物体识别、CLIP embedding、语义搜索、EXIF、缩略图和视频关键帧；MyBlog 不训练自有视觉模型，不重复实现媒体库、缩略图和向量检索底层能力。
- Immich 不是 Astro 组件，也不是 OpenList 子页面。它必须作为独立 Docker Compose 服务部署在独立域名根路径，目标入口为 `https://photos.blog.tengokukk.com/`；禁止把它挂成 `/immich/`、`/openlist/immich/` 或其他子路径 iframe 来伪装集成。
- 当前源码已接入 Immich 前台入口：`/visuals/` 展示 Immich AI Media Runtime 入口，首页 Command Palette 可检索“Immich 媒体库”。服务器侧已安装 `/srv/immich` skeleton：官方 `docker-compose.yml`、`.env`、`library/`、`postgres/`、`check-readiness.sh` 已存在，Nginx vhost `/etc/nginx/sites-available/immich-photos.conf` 已启用并代理 `photos.blog.tengokukk.com -> 127.0.0.1:2283`。Immich 容器尚未启动。
- 2026-05-07 当前 Immich 阻断状态：`photos.blog.tengokukk.com` 在公网 DNS 仍为 NXDOMAIN；服务器 `/srv/immich` 所在根盘约 7GB 可用，低于 `check-readiness.sh` 要求的 30GB；没有独立 media volume。Nginx 用 Host 头访问 `photos.blog.tengokukk.com` 当前返回 502 是预期状态，表示 vhost 已命中但 `127.0.0.1:2283` 尚未启动。
- Immich 生产部署前置条件：`photos.blog.tengokukk.com` DNS 指向服务器；Nginx 为该域名建立独立 vhost 并反代 Immich 默认 `2283`；上传目录、缩略图、Postgres、Redis、ML cache 必须放到独立数据卷 / 外部磁盘 / 对象存储，不得继续挤占当前博客服务器 root disk。
- 启动 Immich 前必须先运行 `ssh ubuntu@124.220.233.126 '/srv/immich/check-readiness.sh'`。只有输出 `ready` 时才允许在服务器执行 `cd /srv/immich && docker compose up -d`，否则不得拉镜像或启动容器。
- Immich -> MyBlog 的长期链路是：`Immich API -> admin-next import -> MySQL runtime snapshot -> VisualCollection partition -> Search / Graph / Drawer`。访客打开页面时不得触发 AI 推理、不得重新分析图片、不得下载整库素材；导入阶段解析一次，后续吃缓存和 runtime snapshot。
- Visual System 的成熟组合服务栈是 `OpenList + COS` 做大文件 / blob 后端、`Immich` 做 AI media runtime、`Directus` 做 metadata overlay、`Meilisearch` 做 search runtime、`Astro/MyBlog` 做展示壳。当前只有 OpenList + COS 已验证，Immich 是 skeleton 未启动，Directus / Meilisearch 仍是 target runtime；源码和 UI 不得把未部署服务写成已可用能力。
- RAM++、GroundingDINO、SAM2、Qdrant 等只作为 P2/P3 扩展候选。P0/P1 不自建模型训练链路，先消费 Immich 已经成熟的媒体索引、AI tagging 和语义搜索结果。
- `/visuals/` 的本地能力只作为 manifest 预览 / JSON 导出，不再强化单图编辑器。正式上传 / 多人协作阶段应改为后台 Import Pipeline 写入 `visual-manifest.json` 或源码数据。
- Pinterest / Pixiv 的新 canonical 接法不是把官方 profile widget 当完整产品。Pinterest 完整页面会用 CSP `frame-ancestors 'self'` 阻止 iframe，官方 `embedUser` 只是 marketing widget，会强插 Follow CTA、限制无限滚动和交互；MyBlog 的全局 Pinterest 入口必须改成 `browser-session mirror -> local index -> MyBlog visual shell -> annotation / graph`。
- Pinterest 入口必须是全站导航 / 首页 Feed tabs 里紧邻 `OpenList` 的站内嵌入按钮，不是跳转链接、不是新窗口、也不是只藏在 `/visuals/` 页面内部。首页当前可见位置是 `Feed` 工具条末尾：`OpenList` 右侧的 `Pinterest`；点击后打开和 OpenList 同级的 embed layer。
- 全站 Pinterest Shell 由 `BaseLayout.astro` 持有，触发器是 `[data-pinterest-embed-open]`，关闭器是 `[data-pinterest-close]`。该层不再使用 `data-pin-do="embedUser"`，而是在站内 Masonry board 中渲染 `/api/runtime/visuals/snapshot` 的 Pinterest collections；runtime 不可用时回退到构建期 `public-data/visual-sources/visual-manifest.json`。
- Pinterest 官方 add-on 只允许用于 indexed pin 的 Save Button；禁止再把 `data-pin-do="embedUser"` 写成全局完整 Pinterest 体验。Pinterest 登录态继续留在 Pinterest/浏览器，不进入仓库、JSON、MySQL 或日志。
- MySQL runtime mirror 现在降级为本地视觉索引 / 缓存层，不是 Pinterest 的替代真相：`/api/runtime/visuals/snapshot` 只提供当前已索引 pin 的 preview URL、source URL、partition 和 metadata；实时浏览体验优先由 Pinterest embed 承担。
- 旧 bookmark sync 仍可作为后台索引管线：bookmark sync -> metadata normalize -> `visual-manifest.json` / MySQL snapshot -> frontend read local index。当前阶段只读取平台预览图 URL 和来源链接，不下载原图，不复制登录态，不生成本地图片副本。
- 当前导入入口是 `npm run import:visual-sources`，脚本位于 `tools/import-visual-sources.mjs`。
- Visual source 配置位于 `public-data/visual-sources/sources.json`，只允许记录 `url`、`title`、`collectionTitle`、`mood`、`tags`、`limit`、`enabled` 等非敏感字段。
- Visual bookmark sync 生成结果位于 `public-data/visual-sources/visual-manifest.json`，只允许记录 collection metadata、平台预览图 URL、来源链接和同步时间。manifest 字段必须保留 `mode: "bookmark-sync"` 与 `downloaded: false`，除非用户明确批准离线缩略图镜像。
- 2026-05-07 之后的 backend mirror 方向是准实时索引，不是一次性静态导入：`cron/manual trigger -> Pinterest API / Apify provider -> MySQL upsert visual_pins -> deleted_at diff -> deterministic partition -> /api/runtime/visuals/snapshot -> /visuals/ runtime hydrate`。它服务于搜索、Graph、注释和断链兜底，不阻塞前台 Pinterest Shell。
- 静态 `visual-manifest.json` 只作为构建期 fallback；前端 `/visuals/` 页面加载后必须优先请求 `/api/runtime/visuals/snapshot`，如果 DB 有当前镜像则用 runtime collections 替换静态 seed。
- Runtime 表由 `apps/admin-next/lib/runtime-db.js` 管理：`visual_sources`、`visual_pins`、`visual_sync_runs`。`visual_pins` 必须用 `source_id + pin_id` upsert，记录 `first_seen_at`、`last_seen_at`、`deleted_at`、`position_index`、`downloaded=false`。
- 同步 API：`POST /api/runtime/visuals/sync`；快照 API：`GET /api/runtime/visuals/snapshot`。生产 cron 可以每 1-10 分钟调用 sync；没有 Pinterest webhook 时不承诺秒级实时。
- 官方 Pinterest API provider 需要 `PINTEREST_ACCESS_TOKEN` 与 `PINTEREST_BOARD_ID`。未配置 token / board_id 时同步器必须返回配置错误，不能回退成“首屏 Playwright 抓取”并声称全量。
- Apify provider 用于最快接入 Pinterest saved pins / profile / board 镜像：在 Apify 里创建 scheduled Pinterest scraper，把输出 dataset 作为 mirror 输入；生产环境配置 `APIFY_TOKEN` + `APIFY_PINTEREST_DATASET_ID`，或配置 `APIFY_PINTEREST_TASK_ID` 让同步器读取该 task 最近一次成功 run 的 dataset。该 provider 必须完整分页读取 dataset items，不能只取第一批。
- `visual_sources.provider` 当前允许 `pinterest_api` 与 `apify_dataset`；`provider_config_json` 只允许存非敏感 provider 配置，如 `{ "datasetId": "..." }` 或 `{ "taskId": "..." }`。token、cookie、浏览器登录态仍只能放在服务器环境变量或平台自身 secret store。
- 全量同步语义：每次 sync 都读取 provider 当前完整分页结果，用当前 active pin 集合和 DB 旧集合做 diff；本轮未出现的旧 pin 只标记 `deleted_at`，不硬删，前端快照只读 `deleted_at IS NULL`。
- Pinterest / Pixiv 这类外部同步源必须进入 Visual Collection Partition：不要把 100 张图塞进 1 个大卡，也不要一图一卡。P0 按 `partitionPattern` 确定性拆成若干 mini moodboard collection，默认模式为 `[6, 4, 9, 12]`，例如 25 张会拆成 6 / 4 / 9 / 6 四个卡片。
- Collection card 顶部是非对称 mini moodboard 拼贴，通常用 3-4 张代表图表达这一组的视觉主题；board 内显示这一组的完整图片。后续 P2 才接 AI clustering / CLIP embedding，不能把当前切片规则伪装成 AI 聚类。
- `tools/import-visual-sources.mjs` 必须累积滚动过程中的可见 pin/artwork 并去重。Pinterest 会虚拟滚动并卸载旧 DOM，不能只在最后一屏读取 `document.images`，否则会漏掉前面已经加载过的收藏。
- 2026-05-07 当前实测状态：Pinterest 源 `https://www.pinterest.com/emptyinkstand/_pins/` 已可同步真实 pin 收藏，当前 manifest 为 25 条并拆成 4 个 partition collection；Pixiv 源在 Playwright 专用 profile 中仍返回未登录/404 页面，manifest 只记录 `syncedItems: 0` 和 warning，前端不得展示 Pixiv 登录页推荐图或 404 占位图。
- 2026-05-07 追加核验：当前线上 `/api/runtime/visuals/snapshot` 的 Pinterest `activeItems` 也是 25；本机 `npm run import:visual-sources` 复跑后仍为 25。原因不是 Pinterest Shell 前端只渲染几张，而是上游镜像源当前只产出 25 条。Playwright profile 访问 `_pins/` 会被重定向到公开 profile，并显示 `Log in / Sign up`，说明本机 browser profile 已不是有效登录态；生产 Apify dataset 当前也只提供 25 条。要达到 100/120，必须先修复上游 browser/session/API/Apify 任务的全量滚动与分页输出。
- 本机已登录浏览器 profile 位于 `.runtime/visual-import-browser-profile`；它是运行时缓存，不得提交、不得复制到 README、不得转写成 JSON 备忘。
- 禁止把 Pinterest / Pixiv 的密码、cookie、sessionStorage、localStorage auth blob、OAuth token、CSRF token、浏览器 cookie jar 明文写入仓库、日志、README、`sources.json` 或 `visual-manifest.json`。
- 离线缩略图镜像 / 下载到 OpenList、夸克网盘或 object storage 是可选后续步骤，不是当前默认行为。只有当平台预览图 URL 断链率不可接受，且用户明确批准后，才把原图或缩略图镜像到外部存储；否则前端只展示 Pinterest embed 与本地索引里的 preview URL。
- Obsidian Vault 内的本地素材不是 Visual bookmark mirror。`E:\Vaults\Obsidian\image` 这类 Vault attachment 应通过 Syncthing / Obsidian Sync 同步到 Linux `/home/vault/Obsidian/image`，再由 OpenList content control plane 或 MyBlog Publish Pipeline 消费；禁止用 Pinterest/Pixiv bookmark sync、visual-manifest 或一次性 API upload 来承担 Vault 双向同步。

Visual roadmap:

```text
P0 current:
- VisualCollection data
- VisualItem compatibility projection
- Pinterest Visual Shell with global in-site embed beside OpenList
- Pinterest Save Button on indexed pin entries
- Visual Collection Partition for imported Pinterest / Pixiv sources
- /visuals collection cards
- /visuals board expansion
- /visuals manifest export note
- /visuals sticker layer
- site navigation visual category
- homepage visual collection feed cards
- drawer collection board / palette / token copy
- Search visual docs
- Search sticker docs
- Graph visual nodes and tag links
- Graph local sticker links

P1:
- Immich AI Media Runtime 独立部署：`photos.blog.tengokukk.com` root subdomain、Docker Compose、独立存储卷、Nginx vhost、服务健康检查
- Directus metadata overlay：管理 books / visuals / collections / knowledge_objects 的人工策展字段，不保存大文件
- Meilisearch search runtime：索引 KnowledgeObject snapshot、OpenList file index、Directus metadata 和 Immich import snapshot；上线前 Pagefind 继续承担静态文章搜索
- OpenList visual source registry
- Pinterest / Pixiv bookmark sync via `tools/import-visual-sources.mjs`
- Pinterest mirror provider via `apps/admin-next/lib/visual-runtime.js` and `/api/runtime/visuals/sync`
- Apify scheduled dataset ingestion for saved pins when official Pinterest API cannot expose the needed saved collection
- admin-next Immich importer：读取 asset / album / tag / semantic metadata，写入 MySQL visual runtime snapshot，不在访客请求中跑模型
- optional thumbnail mirror pipeline after explicit approval
- Color Thief palette extraction
- settings preview for visual collection density

P2:
- react-image-annotate region notes
- image annotation localStorage schema
- VisualCollection to article / project / book backlinks
- Pinterest / Pixiv importer behind admin pipeline
- Immich semantic search result -> Visual Collection candidate -> manual curation

P3:
- React Flow / xyflow visual graph editing
- drag VisualCollection into graph
- Immich / CLIP embedding auto clustering
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
  - `apps/web/src/pages/books/openlist.astro`
  - `apps/web/src/pages/evidence-library/index.astro`
  - `apps/web/src/pages/github/index.astro`
  - `apps/web/src/pages/knowledge/index.astro`
  - `apps/web/src/pages/music/index.astro`
  - `apps/web/src/pages/settings.astro`
  - `apps/web/src/pages/search.astro`
  - `apps/web/src/pages/updates.astro`
- 列表/详情页：
  - `apps/web/src/pages/reader/openlist.astro`
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

### 当前 Home 共享片段

旧 HomeWorkbench 首页系统已经移除，不再保留可恢复的组件清单。当前只保留被内容页复用的轻量展示片段：

- `apps/web/src/components/home/HomeWorkbenchSectionLine.astro`

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

### GitHub 可视化资产

README 只记录当前仍然存在的 GitHub 数据、派生层和可视化入口。旧首页 payload 与 HomeWorkbench 图表组件已经移除，不再作为恢复路径。

| 能力 | 数据源 | 构建/类型入口 | 视觉入口 | 当前首页状态 |
| --- | --- | --- | --- | --- |
| GitHub 热力图 | `overview.months`、`overview.weeks`、`overview.totalContributions` | `buildGitHubAnalytics()` in `apps/web/src/lib/analytics.ts` | `GitHubHeatmap.astro` + `ChartCard.astro` | 首页 mini Feed 图表；`/github/` 完整版 |
| GitHub 月度折线图 | `overview.monthly` | `buildGitHubAnalytics()` | `GitHubMonthlyLine.astro` | 首页 mini Feed 图表；`/github/` 完整版 |
| GitHub 语言饼状图 / donut | `overview.languages` | `buildGitHubAnalytics()` | `GitHubLanguageDonut.astro` | 首页 mini Feed 图表；`/github/` 完整版 |
| 团队图 / 团队信号 | `overview.profile`、`overview.repos` 加本地团队配置 | `TeamSignalGraph.astro` 直接吃 profile/repos | `TeamSignalGraph.astro` | `/github/` 静态关系图 |
| 仓库矩阵 | `overview.repos` | `githubItems` in `apps/web/src/pages/index.astro` | Feed 卡片 `.home-feed-card--github`；详情页 `GitHubRepoMatrix.astro` | 当前首页展示仓库卡片；`/github/` 完整矩阵 |

这套 GitHub 数据的长期真源是：

- 快照文件：`apps/web/src/data/github-overview.emptyinkpot.json`
- 校验与读取：`apps/web/src/lib/github.ts`
- 派生层：`apps/web/src/lib/analytics.ts`
- 首页 Feed 使用：`apps/web/src/pages/index.astro`

后续如果要扩展 GitHub 数据仪表盘，不应重新抓一套数据或手写静态图；应从上述 snapshot 和 `analytics.ts` 继续派生，做成独立 Feed 卡或 `/github/` 详情页。当前 README 的判断是：旧可视化资产已升级为 Visualization 层，首页只保留 mini 卡片和摘要，完整内容进入 `/github/`。

### 当前共享组件与内容页组件

- 共享组件：
  - `apps/web/src/components/shared/ArticleCard.astro`
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
  - `apps/web/src/lib/runtimeContent.ts`
  - `apps/web/src/lib/site.ts`
  - `apps/web/src/lib/updateLog.ts`
  - `apps/web/src/lib/books/types.ts`
  - `apps/web/src/lib/books/openlist.ts`
  - `apps/web/src/lib/books/storage.ts`
- 当前内容集合：
  - `apps/web/src/content/notes/`
  - `apps/web/src/content/projects/`
  - `apps/web/src/content/pages/`
- 当前公开文章投影：
  - `public-data/runtime/content-index.json`
- 当前轻数据：
  - `apps/web/src/data/books.ts`
  - `apps/web/src/data/music.ts`
  - `apps/web/src/data/github-overview.emptyinkpot.json`
  - `apps/web/src/lib/profile.ts`

### 当前平台化拆分原则

后续从当前实现过渡到目标结构时，默认遵守以下拆分策略：

- 当前 `apps/web` 先视为未来 `apps/web-astro` 的真实前身，不做平行双写。
- 当前首页 Feed 逻辑优先留在展示层；不要为了接后台而把业务写回 Astro 组件。
- 内容 schema、AI pipeline、发布逻辑、token-pool 调度应进入 `modules/` 或 `kernel/`，不要塞回 `apps/web/src/lib/`。
- `admin-next` 先做控制面，不要反向侵入当前 Astro 展示层的只读边界。

### 当前前台改造映射

后续只围绕现有 active surface 做改造：

- 首页 Feed：`apps/web/src/pages/index.astro`
- Runtime articles：`apps/web/src/lib/runtimeContent.ts`
- 分类、标签、专题：Runtime MarkdownObject group projection
- Knowledge search / Graph：Runtime MarkdownObject + notes + projects
- GitHub visualization：`apps/web/src/lib/analytics.ts` + visualizations components

## 远端源码仓定位

- 当前正式远端源码仓路径：`ubuntu@124.220.233.126:/srv/myblog/repo`
- 远端工作副本就是 `emptyinkpot.github.io / MyBlog` 的可编辑源码边界
- Git 长期真源仍是 `https://github.com/emptyinkpot/emptyinkpot.github.io`
- 工作路径可以迁移，但任何时候都应只保留一个活跃写作面；本机 `E:\My Project\MyBlog` 已退役，只能作为同步副本，不再作为默认修改端。
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
- 公开文章只以 `public-data/runtime/content-index.json` 为准
- `apps/web/src/content/notes`、`projects`、`pages` 只负责各自对象

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
- 对外公开发布的计划类内容，以 Runtime MarkdownObject 投影进入公开站点；`docs/` 保留工程计划原文。

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
- 原稿写作优先落在 Obsidian Vault：完整 Vault 唯一可编辑真源是 `E:\Vaults\Obsidian`，服务器热镜像是 `/home/vault/Obsidian`，OpenList `/openlist/Obsidian` 只提供公开 identity / API / URL / metadata。
- Obsidian Vault 的图片、PDF、canvas 和附件由 Syncthing / Obsidian Sync 同步到 `/home/vault/Obsidian`；不要把这些文件手工复制到 `apps/web/public/images/`，也不要通过 MyBlog API 单向上传来制造第二套 Vault 真源。
- 公开文章统一通过 Runtime MarkdownObject Index Compile 落在 `public-data/runtime/content-index.json`
- 工具脚本统一放在 `tools/`

静态资源约定：

- 站点运行时图片统一放在 `apps/web/public/images/`
- 品牌资源统一放在 `apps/web/public/images/branding/`
- 首页或全局背景资源统一放在 `apps/web/public/images/home/`
- 文章配图或文章专属公开图片统一放在 `apps/web/public/images/posts/<slug>/`
- Obsidian 原稿附件继续由 Vault / OpenList 管理；公开文章只引用已经迁移到 public runtime asset 路径的资源。
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
