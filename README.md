# emptyinkpot.github.io

`emptyinkpot.github.io` 当前已经收拢为单站点仓库：对外站点由 `apps/web/` 生成，工程文档统一收纳在 `docs/`。

## 中心入口（先看这里）

- 网站中心：`apps/web/`
- 规划中心：`docs/plans/update-plan.md`
- 执行中心：`docs/architecture/astro-blog-redesign-checklist.md`
- 记录中心：`docs/maintenance/astro-redesign-execution-log.md`

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
- OpenClaw 项目目录：/srv/openclaw
- MyBlog 项目目录：/srv/myblog
- MyBlog 静态站点目录：/srv/myblog/site
- Nginx 配置：/etc/nginx/sites-available/myblog.conf
- 当前访问地址：http://124.220.233.126/
- OpenClaw 健康检查：http://124.220.233.126:5000/health
- HTTPS：尚未配置
```

说明：

- 当前 `MyBlog` 与 `OpenClaw` 已按同级关系部署
- `OpenClaw` 继续占用 `5000` 端口
- `MyBlog` 目前由 Nginx 托管在 `80` 端口
- 这次采用的是“本机构建 + 上传 `apps/web/dist` 到服务器”的方式，而不是服务器本地 Git 构建

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

如果后续你改为完全云端自托管，可以继续保留 GitHub 仓库作为代码真源，但把服务器作为正式访问入口。

## 每次更新规范

这一节用于统一“从开始改代码，到最终合并发布”的标准流程。

建议以后每次更新都按这个顺序执行，不要跳步。

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
