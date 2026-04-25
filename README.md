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
  search: https://blog.tengokukk.com/search/
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
- `apps/web/dist/` 是当前正式静态构建产物目录。
- `/srv/myblog/site` 是当前云端静态运行目录。
- `https://blog.tengokukk.com/` 是当前唯一公开站点入口。

### 0.5.2 Content And Build Truth

- 正式内容真源是 `apps/web/src/content/`。
- 架构规范类公开文章真源是 `apps/web/src/content/posts/`。
- `docs/` 承担工程文档、规划、架构与维护记录，不作为公开文章真源的并列写作面。
- 当前发布模式是“本地构建 -> 上传 `apps/web/dist/` -> Nginx 托管”，不是服务器内 Git 构建。

### 0.5.3 Observability Truth

- 当前公开站点入口：`https://blog.tengokukk.com/`
- 当前云端站点目录：`/srv/myblog/site`
- 当前 Nginx 配置：`/etc/nginx/sites-available/myblog.conf`
- 当前 README 不把未验证的额外公开 health/debug 路径写成既成事实。

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
- `apps/web/src/content/` 是内容真源。
- `https://blog.tengokukk.com/` 是唯一公开站点入口。
- `/srv/myblog/site` 是当前正式云端运行目录。
- 同一时刻只允许一个活跃本地源码仓边界。

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

### 0.7.3 AI Execution Protocol

1. 先读取 `0. 项目说明入口`，确认源码仓、公开入口与运行目录。
2. 再读取 `Truth Layer`，确认真实入口、内容真源与构建产物边界。
3. 再读取 `Constraint Layer`，确认禁止动作与系统不变量。
4. 最后按 `Strategy Layer` 顺序执行验证、提交与发布。

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
