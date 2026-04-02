---
title: 维护更新日志
date: 2026-03-27 10:40:00
---

这里用来记录博客的持续维护与迭代。

从 2026-03-27 起，这个页面升级为“公开维护日志”，目标是同时满足 4 个要求：

1. 可追溯：能回看到底改了什么、影响了哪里、对应哪次提交
2. 可约束：每条记录都使用统一字段，避免越写越散
3. 可验证：记录里保留构建、访问或功能验证信息
4. 可复用：后续写 GitHub 更新说明时，可以直接复用这里的条目

## 记录标准

- 一条日志对应一次用户可感知更新，或一次明确的里程碑推进
- 新条目统一放在最上方，保持“最新在前”
- 每条记录至少包含 6 个字段：
  - 更新内容
  - 涉及技术
  - 关联记录
  - 验证记录
  - 实现效果
  - 下一步
- 关联记录至少补 2 类信息：
  - 页面或 URL
  - 文件或目录
  - Git 提交
- 验证记录至少写 1 条真实执行过的检查

## 自动化命令

后续新增日志时，优先使用仓库里的自动化命令：

```bash
npm run new:update -- --title "更新标题" --dry-run
npm run check:updates
```

其中：

- `new:update` 用来生成统一结构的日志条目草稿
- `check:updates` 用来校验公开日志是否包含必填字段

更完整的规范、模板和执行记录在仓库内维护：

- `docs/maintenance/update-log-spec.md`
- `docs/maintenance/astro-redesign-execution-log.md`
- `docs/templates/update-log-entry.md`

<!-- UPDATE_LOG_ENTRIES -->

## 2026-04-02 / MyBlog 云端部署落地：Nginx 接入、同级项目共存与域名 HTTPS 方案

### 更新内容

- 完成 `MyBlog` 在云服务器上的首次真实部署
- 安装 `Nginx`，并将博客静态站点托管到 `80` 端口
- 保持现有 `OpenClaw` 项目继续运行在 `5000` 端口，不做覆盖
- 新增站内文章《MyBlog 云端部署实录：Nginx、同级项目共存、外网访问判断与正式域名 HTTPS》

### 涉及技术

- Astro 静态构建
- Nginx 静态站点托管
- 云服务器公网访问
- 域名解析与 HTTPS 规划

### 关联记录

- 页面：`/posts/myblog-cloud-deployment-nginx-domain-and-https-guide/`
- 文件：`apps/web/src/content/posts/myblog-cloud-deployment-nginx-domain-and-https-guide.md`
- 部署：`/srv/myblog/site`

### 验证记录

- 本地构建验证：执行 `npm run build` 通过
- 服务器访问验证：`http://124.220.233.126/` 返回 `200`
- 共存验证：`http://124.220.233.126:5000/health` 返回 `200`
- 域名验证：`http://blog.tengokukk.com/` 返回 `301` 并跳转到 `https://blog.tengokukk.com/`
- HTTPS 验证：`https://blog.tengokukk.com/` 返回 `200`

### 实现效果

- `MyBlog` 已从本地工程进入公网可访问状态
- 博客与 `OpenClaw` 已形成同级部署关系，互不覆盖
- 博客已具备正式域名与 HTTPS 入口，可作为长期对外地址使用

### 下一步

- 将站内部署文章与 README 中的线上状态持续保持同步
- 继续收口自动化发布流程，减少手工同步步骤
- 评估是否为博客和其他项目进一步按域名拆分入口

---

## 2026-03-31 / Rainyun 13009 Day 6：建立 Safe Mode 行为矩阵与回归模板

### 更新内容

- 新增 `docs/architecture/rainyun-safe-mode-test-matrix.md`，将 Safe Mode 转为可执行测试矩阵
- 新增 `docs/templates/rainyun-safe-mode-regression-template.md`，沉淀标准化回归记录模板
- 更新索引文档：`docs/architecture/README.md`、`docs/templates/README.md`

### 涉及技术

- 状态机测试设计
- API 行为分支覆盖
- 前端降级行为验证
- 回归模板标准化

### 关联记录

- 架构：`docs/architecture/rainyun-safe-mode-test-matrix.md`
- 模板：`docs/templates/rainyun-safe-mode-regression-template.md`
- 契约：`docs/architecture/rainyun-backend-api-contract.md`

### 验证记录

- 文档结构验证：行为矩阵覆盖状态迁移、接口分支、前端映射三层
- 模板可用性验证：模板已包含接口用例、前端用例、审计追溯与发布结论字段
- 治理验证：执行 `npm run check` 通过

### 实现效果

- Day 6 目标从“说明性文档”升级为“可直接执行的测试资产”
- 后续联调与回归可以统一按编号用例（SM-T/SM-A/SM-UI）执行
- Safe Mode 相关变更具备更稳定的质量门槛与复盘依据

### 下一步

- 按模板产出首份真实回归记录（至少覆盖 `SM-A03/A07/A09/A11`）
- 评估将关键失败分支转为自动化契约测试
- 进入 Day 7：执行一次完整回归并回填结果

---

## 2026-03-31 / Rainyun 13009 Day 5：补齐后台契约与回滚语义

### 更新内容

- 完善 `docs/architecture/rainyun-backend-api-contract.md` 的 Day 5 目标项
- 新增 `safe-mode/rollback` 接口契约，明确误触恢复与回滚约束
- 补充 Safe Mode 状态机、UI 映射、重复提交与网络超时处理规则

### 涉及技术

- REST API 契约设计
- Idempotency-Key 幂等语义
- Safe Mode 状态机
- 审计日志与错误码规范

### 关联记录

- 文档：`docs/architecture/rainyun-backend-api-contract.md`
- 计划：`docs/plans/rainyun-topic-13009-integration-plan.md`
- 执行：`docs/maintenance/astro-redesign-execution-log.md`

### 验证记录

- 文档一致性：接口章节已覆盖“读/写/回滚/审计”
- 规则一致性：错误码新增 `IDEMPOTENCY_KEY_REUSED`、`SAFE_MODE_TRANSITION_BLOCKED`、`SAFE_MODE_ROLLBACK_NOT_ALLOWED`
- 治理验证：执行 `npm run check:updates` 通过

### 实现效果

- Day 5 的“接口契约 + 异常处理 + 状态机”已具备可实现输入
- 后续后端实现可直接按文档落地，不再停留在概念描述
- Safe Mode 从“开关说明”升级为“可审计、可回滚”的工程方案

### 下一步

- 输出最小联调清单（请求样例、回执字段、失败分支）
- 评估是否将关键契约检查纳入治理脚本（文档校验优先）
- 进入 Day 6：补齐可测试行为矩阵与回归模板

---

## 2026-03-31 / Rainyun 13009 整合案例首版落地（前台案例文）

### 更新内容

- 新增案例文章《Rainyun 话题 13009 整合案例：前台展示、后台契约与 Safe Mode 治理》
- 将话题能力按“前台展示 / 后台契约 / 应急开关（Safe Mode）”三段结构落位到现有内容体系
- 明确“应急能力”采用可审计、可回滚口径，不使用破坏性表述

### 涉及技术

- Astro Content Collections
- Markdown front matter 规范
- 内容治理约束（slug / description / toc 等）
- 风险边界与运行策略文档化

### 关联记录

- 页面：`/posts/rainyun-topic-13009-integration-case/`
- 文件：`apps/web/src/content/posts/rainyun-topic-13009-integration-case.md`
- 规划：`docs/plans/rainyun-topic-13009-integration-plan.md`

### 验证记录

- 内容治理验证：执行 `npm run check:content` 通过
- 规则验证：新文章 front matter 已满足 `apps/web/src/content.config.ts` 约束
- 结构验证：文章已包含“功能说明 / 操作流程 / 风险声明”三段核心结构

### 实现效果

- Rainyun 13009 主题已从“仅规划”进入“前台可见”的可读状态
- 专题落地沿用现有单站点架构，不引入并行站点或并行内容源
- 后续接口契约与 Safe Mode 状态机设计有了统一对外说明入口

### 下一步

- 在 `docs/architecture/rainyun-backend-api-contract.md` 完善读写接口、鉴权与审计字段（Day 5）
- 将 Safe Mode 的 Level 1/2/3 状态机补成可测试行为矩阵（Day 6）
- 完成 `npm run check` 与 `npm run build` 的整体验证并回填执行日志（Day 7）

---

## 2026-03-27 / 补齐 `site-v2` 剩余文章迁移并建立 OpenClaw 系列

### 更新内容

- 将剩余 3 篇 Hexo 文章迁移到 `site-v2/src/content/posts/`
- 为迁移文章补齐 `description`，并给两篇 OpenClaw 文档建立 `OpenClaw Extensions` 系列
- 修正系列内互链，并在后续根路径单站点发布中继续保持可用

### 涉及技术

- Astro Content Collections
- Markdown front matter 清洗
- 站内链接兼容整理
- Pagefind / 系列页内容收录

### 关联记录

- 页面：`/`、`/posts/welcome/`、`/posts/openclaw-extensions-architecture-blueprint/`、`/series/openclaw-extensions/`
- 文件：`site-v2/src/content/posts/welcome.md`、`site-v2/src/content/posts/openclaw-extensions-architecture-blueprint.md`、`site-v2/src/content/posts/openclaw-extensions-migration-and-ai-governance.md`

### 验证记录

- 构建验证：执行 `cd site-v2 && npm run build` 成功
- 页面验证：本地请求 `/`、`/posts/openclaw-extensions-architecture-blueprint/`、`/posts/openclaw-extensions-migration-and-ai-governance/`、`/series/openclaw-extensions/` 均返回 `200`
- 内容验证：生成 HTML 已确认首页卡片列出了新增文章，系列页已串起两篇 OpenClaw 文档
- 口径说明：该条记录已按当前根路径单站点发布口径更新表述

### 实现效果

- `site-v2` 现在已经补齐当时已迁移的主要 Hexo 文章，不再只有样板内容
- 首页文章卡片、分类、标签和系列页的内容密度明显更完整
- OpenClaw 两篇长文已经形成可连续阅读的专题入口

### 下一步

- 迁移 About 与其他独立页面内容
- 继续检查旧链接兼容与重定向策略

---

## 2026-03-27 / 补齐 `giscus` 启用说明并确认仓库侧阻塞

### 更新内容

- 整理 `site-v2` 的 giscus 启用步骤
- 重写 `site-v2/README.md`，把评论启用路径和常用命令写清楚
- 在评论区 fallback 中补入直接可点击的仓库设置和 giscus 配置入口
- 明确当前真实阻塞点是 GitHub 仓库尚未开启 Discussions

### 涉及技术

- giscus
- GitHub Discussions
- 环境变量模板
- 仓库维护文档

### 关联记录

- 页面：`site-v2` 文章页评论区
- 文件：`site-v2/src/components/post/GiscusComments.astro`、`site-v2/.env.example`、`docs/maintenance/giscus-setup.md`
- 提交：`1a5a183`

### 验证记录

- 仓库验证：GitHub 仓库页面当前无 `Discussions` 标签
- 构建验证：执行 `cd site-v2 && npm run build` 成功
- 说明验证：README、`.env.example` 和 fallback 文案已对齐为同一套步骤

### 实现效果

- `giscus` 现在已经不是“模糊待办”，而是“代码已就绪、仓库设置待完成”的清晰状态
- 后续真正启用时，只需要开启 Discussions、安装 app 并填写参数
- 评论功能的剩余阻塞点被压缩到了最小范围

### 下一步

- 如仓库设置允许，开启 Discussions 并完成真实参数填充
- 继续迁移剩余文章与独立页面

---

## 2026-03-27 / 让 `site-v2` 随 Pages 一起发布到 `/site-v2/`

> 状态说明：本条为历史阶段记录，当前仓库已切换为根路径单站点发布，不再沿用 `/site-v2/` 子路径作为正式线上入口。

### 更新内容

- 改造现有 GitHub Pages workflow，在保留 Hexo 根站的同时，额外构建 `site-v2`
- 将 `site-v2` 的构建产物自动嵌入最终发布目录的 `/site-v2/` 子路径
- 为 `site-v2` 增加 `base` 感知能力，统一修正内部链接、RSS、搜索资源和 `robots.txt`

### 涉及技术

- GitHub Actions
- GitHub Pages artifact 部署
- Astro `base` 配置
- 子路径静态站点发布
- Pagefind 资源路径适配

### 关联记录

- 页面：`/site-v2/`、`/site-v2/rss.xml`、`/site-v2/search/`
- 文件：`.github/workflows/pages.yml`、`site-v2/src/lib/site.ts`、`site-v2/astro.config.mjs`
- 提交：`02d4055`

### 验证记录

- 构建验证：本地按 workflow 顺序执行 Hexo 构建、`site-v2` 子路径构建和嵌入复制，全部成功
- 路由验证：本地请求 `/site-v2/`、`/site-v2/rss.xml`、`/site-v2/search/`、`/site-v2/robots.txt` 均返回 `200`
- 内容验证：生成产物中的链接已统一带上 `/site-v2/` 前缀，RSS 链接也已正确指向子路径

### 实现效果

- `site-v2` 现在具备了和现有 Hexo 站并行发布的能力
- 后续可以在真实 Pages 环境下持续验证 Astro 新站，而不用提前切换主站
- 部署链路从“本地原型”升级为“可上线预览”

### 下一步

- 接入并验证 giscus 真实配置
- 继续迁移剩余文章与独立页面
- 检查旧链接兼容与重定向策略

---

## 2026-03-27 / `site-v2` 接入 RSS、Sitemap 与 robots.txt

### 更新内容

- 为 `site-v2` 新增 `rss.xml` 输出
- 接入 `@astrojs/sitemap`，生成站点地图
- 新增 `robots.txt`，把搜索引擎抓取入口和 Sitemap 地址补齐
- 在页面 `<head>` 和页脚中补入 RSS 入口

### 涉及技术

- Astro RSS
- `@astrojs/sitemap`
- Astro endpoint route
- XML / robots 协议

### 关联记录

- 页面：`/rss.xml`、`/sitemap-index.xml`、`/robots.txt`
- 文件：`site-v2/src/pages/rss.xml.ts`、`site-v2/src/pages/robots.txt.ts`、`site-v2/astro.config.mjs`
- 提交：`1d0e03c`

### 验证记录

- 构建验证：执行 `cd site-v2 && npm run build` 成功
- 路由验证：本地请求 `/rss.xml`、`/sitemap-index.xml`、`/robots.txt` 均返回 `200`
- 内容验证：`rss.xml` 已包含文章条目，`robots.txt` 已指向 `sitemap-index.xml`

### 实现效果

- `site-v2` 已具备 RSS 订阅与 Sitemap 输出能力
- 新站的基础 SEO / 订阅设施从“待补充”进入“已可运行”
- 后续上线 Astro 版站点时，搜索引擎发现链路会更完整

### 下一步

- 建立 Astro 的 GitHub Actions 工作流
- 接入并验证 giscus 真实配置
- 继续迁移剩余文章与独立页面

---

## 2026-03-27 / 建立维护更新日志页

### 更新内容

- 新增独立页面 `/updates/`，作为博客的长期维护更新日志入口
- 在站点导航中加入“更新日志”菜单，方便从首页和其他页面直接进入
- 约定统一记录结构，后续更新不再零散散落在提交信息里

### 涉及技术

- Hexo 独立页面
- Landscape 主题菜单配置
- Markdown 结构化记录

### 关联记录

- 页面：`/updates/`
- 文件：`source/updates/index.md`、`_config.landscape.yml`
- 提交：`b3fbf08`

### 验证记录

- 构建验证：执行 `npm run build`，成功生成 `public/updates/index.html`
- 路由验证：本地访问 `/updates/` 返回 `200`
- 导航验证：首页生成结果中已出现 `/updates/` 入口

### 实现效果

- 博客现在有了可持续追加的版本演进页面
- 后续 GitHub 提交、站点更新和功能变更都有统一的对外说明位置
- 用户可以直接看到站点最近在维护什么，而不必只靠归档页或提交历史猜测

### 下一步

- 继续补齐记录规范、执行日志和自动化约束
- 让重构执行清单与公开更新日志建立对应关系

---

## 2026-03-27 / 首页改为文章列表，点击进入全文

### 更新内容

- 调整首页展示方式，不再直接在 Home 页铺出整篇正文
- 首页改为文章列表流，每篇文章只展示标题、摘要和阅读全文入口
- 同时补充了博客搭建文章中的“提交到 GitHub”相关说明，减少部署理解偏差

### 涉及技术

- Hexo 首页生成逻辑
- Landscape 主题模板定制
- Markdown 摘要与正文分离
- Git / GitHub Pages 发布链路说明

### 关联记录

- 页面：`/`
- 文件：`_config.landscape.yml`、`source/_posts/hexo-blog-principle-and-setup.md`、`themes/landscape/layout/index.ejs`
- 提交：`9d74904`

### 验证记录

- 构建验证：执行 `npm run build`，首页静态文件成功生成
- 页面验证：首页改为列表流，详情阅读路径回到文章页
- 内容验证：主页不再直接输出整篇正文

### 实现效果

- 首页阅读压力明显降低，浏览路径更接近正常博客站点
- 用户先看列表，再按需进入详情页，信息层级更清晰
- “为什么本地改了但线上没变”这类常见误解被提前解释掉了

### 下一步

- 继续优化新站首页的信息架构和卡片编排
- 在 Astro 版新站中复用“列表进详情”的阅读路径

---

## 2026-03-27 / 新增文章：`source/_posts` 与自动发布链路说明

### 更新内容

- 新增文章《Hexo 的 source/_posts 会自动发布吗：从本地文章到线上博客的完整链路》
- 重点解释 `source/_posts`、`npm run build`、`git push origin main`、GitHub Actions 和 GitHub Pages 之间的真实关系
- 把“本地有文件”和“线上已发布”这两个容易混淆的状态明确拆开

### 涉及技术

- Hexo 内容目录结构
- Git 提交与推送流程
- GitHub Actions 自动部署
- GitHub Pages 静态站点发布

### 关联记录

- 页面：`/posts/hexo-source-posts-publish-flow/`
- 文件：`source/_posts/hexo-source-posts-publish-flow.md`
- 提交：`db67b5e`

### 验证记录

- 构建验证：执行 `npm run build`，文章页成功生成
- 路由验证：文章链接按 `posts/:slug/` 规则输出
- 内容验证：正文已覆盖从本地写作到线上发布的完整链路

### 实现效果

- 新读者更容易建立正确的博客发布心智模型
- 以后再解释文章发布链路时，可以直接引用这一篇
- 对后续写更多“博客搭建”系列文章也起到了承接作用

### 下一步

- 继续补更多面向新手的博客搭建说明文
- 在 Astro 新站中同步保留这条内容线

---

## 2026-03-27 / 新增文章：Hexo 与 GitHub Pages 工作原理总结

### 更新内容

- 新增并连续打磨文章《Hexo 博客是怎么工作的：从原理到 GitHub Pages 部署实践》
- 从 Hexo 的内容生成原理、GitHub 提供的资源类型，到完整的建站与发布步骤做了一次系统梳理
- 把“提交”和“推送”这两个常被口语混用的动作专门拆开说明

### 涉及技术

- Hexo 静态站点生成
- Markdown 与 Front Matter
- GitHub-hosted runners
- GitHub Pages 托管与 HTTPS
- 自定义域名、仓库体积与文件限制等基础设施知识

### 关联记录

- 页面：`/posts/hexo-blog-principle-and-setup/`
- 文件：`source/_posts/hexo-blog-principle-and-setup.md`
- 提交：`97e5ded`、`3a93c10`、`1ec45eb`

### 验证记录

- 构建验证：执行 `npm run build`，文章页可正常生成
- 内容验证：文章已覆盖原理、资源边界、部署步骤和提交流程
- 结构验证：正文已具备可单独引用的建站总说明属性

### 实现效果

- 博客里多了一篇可作为建站总说明的基础文章
- 后续关于部署、工作流和内容迁移的讨论都有了统一参考入口
- 对刚接触 Hexo 和 GitHub Pages 的读者更友好

### 下一步

- 与后续的 Astro 重构文章建立系列关联
- 持续补充更贴近当前仓库的配置示例

---

## 2026-03-27 / 启动 Astro 重构方案与执行清单（历史记录）

### 更新内容

- 新增 Astro 博客重构详细方案文档
- 新增执行清单版文档，把设计方向、技术路线、阶段目标和交付边界压缩成可执行列表
- 记录当时“保留 Hexo 线上站、并行推进 Astro 新站”的阶段性策略，供迁移复盘使用

### 涉及技术

- Astro
- Tailwind CSS
- MDX
- Astro Content Collections
- Pagefind
- giscus
- GitHub Pages

### 关联记录

- 页面：仓库规划文档
- 文件：`docs/architecture/astro-blog-redesign-plan.md`、`docs/architecture/astro-blog-redesign-checklist.md`
- 提交：`38769ab`

### 验证记录

- 文档验证：方案文档与执行清单均已纳入仓库
- 路线验证：技术栈、阶段顺序和最小可交付范围已明确
- 协作验证：后续开发已开始按执行清单推进

### 实现效果

- 重构不再停留在想法层面，而是进入了可跟踪、可落地的执行阶段
- 后续做首页、文章页、搜索、评论、项目展示时都有统一路线可对照
- 该阶段通过保留旧站稳定性来降低重构试错成本，现已演进为单站点收口完成后的历史记录

### 下一步

- 继续把实际执行结果同步回清单和执行日志
- 为重构过程补齐约束规范与可追溯机制

---

## 2026-03-27 / 建立 `site-v2` Astro 原型站（历史记录）

### 更新内容

- 在仓库中新增 `site-v2/`，作为当时的 Astro 重构原型站
- 已完成首页、文章列表、文章详情、分类、标签、系列、项目、Notes、搜索等基础页面骨架
- 迁移了两篇真实文章作为内容样板，并补入项目说明与重构记录

### 涉及技术

- Astro
- Tailwind CSS
- MDX
- Content Collections
- Pagefind
- giscus 预留接入
- 静态路由与内容分层

### 关联记录

- 页面：`site-v2` 原型站首页、文章页、分类页、标签页、系列页、项目页、Notes 页
- 文件：`site-v2/src/pages/`、`site-v2/src/content/`、`site-v2/src/lib/content.ts`
- 提交：`9912824`

### 验证记录

- 构建验证：执行 `cd site-v2 && npm run build` 成功
- 路由验证：已本地检查 `/`、`/posts/`、`/categories/`、`/series/`、`/notes/`、`/projects/site-v2/`
- 体验验证：首页保持卡片式列表，不显示全文流

### 实现效果

- 新站的信息架构已经从“纯计划”进入“可运行原型”
- 首页改为卡片化列表浏览，文章详情页承担全文阅读，方向已经和目标体验对齐
- 这条记录保留的是原型阶段背景；当前仓库已经进入 `site-v2` 单站点正式收口状态

### 下一步

- 补齐 RSS、Sitemap、GitHub Actions 部署链路
- 接入 giscus 实配并验证真实评论流程
- 继续迁移剩余文章与页面

---

## 2026-03-26 / 初始化 Hexo 博客并完成首次上线

### 更新内容

- 初始化 Hexo 博客项目
- 配置基础站点信息、关于页、欢迎文章与 GitHub Pages 工作流
- 完成最初版本的个人博客搭建

### 涉及技术

- Hexo
- Landscape 主题
- GitHub Actions
- GitHub Pages

### 关联记录

- 页面：`/`、`/about/`、欢迎文章页
- 文件：`_config.yml`、`_config.landscape.yml`、`source/about/index.md`、`source/_posts/welcome.md`
- 提交：`33ebc40`

### 验证记录

- 项目验证：Hexo 基础项目结构已建立
- 构建验证：站点可执行 `npm run build`
- 发布验证：GitHub Pages 工作流已进入仓库

### 实现效果

- 博客从零完成了第一个可访问版本
- 后续所有内容与迭代都有了稳定承载点
- 建立了“本地写作 + GitHub 自动部署”的基础工作流

### 下一步

- 持续补内容
- 持续优化首页与发布体验

---

## 2026-03-26 / 修复 Hexo 的 GitHub Pages 自动部署

### 更新内容

- 修复 GitHub Pages 工作流配置
- 重新打通 Hexo 构建与 Pages 部署链路
- 让代码推送后能够自动触发发布

### 涉及技术

- GitHub Actions workflow
- `npm ci`
- Hexo 构建
- GitHub Pages artifact 部署

### 关联记录

- 页面：线上博客发布链路
- 文件：`.github/workflows/pages.yml`
- 提交：`f4dfa16`

### 验证记录

- 工作流验证：Pages workflow 已回到可执行状态
- 流程验证：提交并推送后能够触发自动部署
- 结果验证：站点发布路径恢复稳定

### 实现效果

- 站点更新从手动发布转为自动发布
- 以后写新文章或改页面时，只需要提交并推送代码
- 博客维护成本明显下降，发布路径也更稳定

### 下一步

- 把同样的部署纪律延续到 Astro 新站
- 后续为新站单独建立 GitHub Actions 工作流
