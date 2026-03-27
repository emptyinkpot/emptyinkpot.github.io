# Astro 重构执行日志

更新时间：2026-03-27

关联文档：

- `docs/astro-blog-redesign-plan.md`
- `docs/astro-blog-redesign-checklist.md`
- `docs/maintenance/update-log-spec.md`
- `source/updates/index.md`

## 当前状态

- 当前策略：保留根目录 Hexo 线上站，同时在 `site-v2/` 并行推进 Astro 重构
- 当前阶段：阶段 6 基本完成，阶段 7 部分启动
- 当前重点：补齐 RSS / Sitemap / GitHub Actions / giscus / 内容迁移

## 已完成记录

### 2026-03-27 / 重构方案与执行清单入库

- 状态：已完成
- 关联提交：`38769ab`
- 结果：
  - 新增详细方案文档
  - 新增执行清单版文档
  - 技术路线、分阶段目标和 MVP 范围明确
- 验证：
  - 文档已纳入仓库
  - 后续开发已经按该清单推进

### 2026-03-27 / `site-v2` 原型站可运行

- 状态：已完成
- 关联提交：`9912824`
- 结果：
  - Astro、Tailwind、MDX、Content Collections 已接入
  - 首页、文章页、分类、标签、系列、项目、Notes、搜索页已建立
  - 两篇真实文章已迁移为样板内容
- 验证：
  - 执行 `cd site-v2 && npm run build` 成功
  - 本地校验关键路由均返回 `200`

### 2026-03-27 / `site-v2` 接入 RSS、Sitemap 与 robots.txt

- 状态：已完成
- 关联提交：`1d0e03c`
- 结果：
  - 接入 `@astrojs/sitemap`
  - 新增 `rss.xml`
  - 新增 `robots.txt`
  - 页头与页脚已补入 RSS 入口
- 验证：
  - 执行 `cd site-v2 && npm run build` 成功
  - 本地请求 `/rss.xml`、`/sitemap-index.xml`、`/robots.txt` 均返回 `200`
  - RSS 输出已包含真实文章条目

### 2026-03-27 / `site-v2` 接入 Pages 子路径发布

- 状态：已完成
- 关联提交：`02d4055`
- 结果：
  - 现有 Pages workflow 已支持同时构建 Hexo 根站与 `site-v2`
  - `site-v2` 会被嵌入最终产物的 `/site-v2/` 子路径
  - `site-v2` 已完成内部链接、搜索资源、RSS 与 `robots.txt` 的子路径适配
- 验证：
  - 本地按 workflow 顺序完成 Hexo 构建、Astro 子路径构建和复制嵌入
  - 本地访问 `/site-v2/`、`/site-v2/rss.xml`、`/site-v2/search/`、`/site-v2/robots.txt` 均返回 `200`
  - 生成 HTML 中已正确输出 `/site-v2/` 前缀链接

### 2026-03-27 / `giscus` 启用准备完成，确认仓库侧阻塞

- 状态：部分完成
- 关联提交：`1a5a183`
- 结果：
  - `site-v2` 的 giscus 组件说明已补齐
  - `site-v2/.env.example` 已增加真实启用步骤
  - 新增 `docs/maintenance/giscus-setup.md`
  - `site-v2/README.md` 已重写为项目说明文档
- 验证：
  - 执行 `cd site-v2 && npm run build` 成功
  - GitHub 仓库页面当前没有 `Discussions` 标签
- 当前阻塞：
  - 仓库侧尚未开启 Discussions，无法生成可用的 repo/category id

### 2026-03-27 / 公开维护日志页建立

- 状态：已完成
- 关联提交：`b3fbf08`
- 结果：
  - 新增 `/updates/`
  - 首页导航可直接进入
  - 历史关键节点已回填
- 验证：
  - 执行 `npm run build` 成功
  - 本地校验 `/updates/` 返回 `200`

## 本轮补充的治理项

- 新增 `docs/maintenance/` 维护目录
- 新增公开日志模板与治理规范
- 新增 `npm run new:update`
- 新增 `npm run check:updates`
- 将执行清单补充为“原始规划 + 实际执行记录 + 下一批待办”

## 下一批优先任务

- [ ] 开启仓库 Discussions 并完成 giscus 真实配置
- [ ] 继续迁移剩余文章和 About / Pages 内容
- [ ] 评估旧链接兼容与重定向策略

## 使用约定

- 公开可见变化：同步写入 `source/updates/index.md`
- 阶段推进与验证：同步写入本文件
- 范围与阶段状态：同步写入 `docs/astro-blog-redesign-checklist.md`
