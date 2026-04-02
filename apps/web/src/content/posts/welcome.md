---
title: 欢迎来到 emptyinkpot
description: 站点初始化说明，记录当前唯一 Astro 站点的开发入口、发布方式与后续扩展方向。
date: 2026-03-26 20:40:39
slug: welcome
tags:
  - Hexo
  - GitHub Pages
categories:
  - 建站
---

这篇文章是博客的第一篇内容，用来确认站点已经成功初始化。

这个站点现在已经具备这些基础能力：

- 本地运行 Astro 开发预览
- 推送到 GitHub 后自动发布到 GitHub Pages
- 已具备文章、项目、Notes、搜索与 RSS 等内容结构
- 支持后续继续扩展页面、组件与内容集合

## 下一步可以做什么

你接下来可以从这几个地方开始：

```bash
npm run dev
```

本地预览站点；

```bash
npm run build
```

检查正式构建是否通过；

修改 `apps/web/src/content/`、`apps/web/src/pages/` 或 `apps/web/src/components/`，继续完善站点内容与界面。

## 写作位置

现行文章、Notes 与项目内容都维护在 `apps/web/src/content/` 下，使用 Markdown 编写即可。

根目录保留的 Hexo 目录只作为历史资产与迁移参考，不再承担正式发布入口。

以后你每次提交到 `main`，GitHub Actions 都会自动重新构建并发布这套唯一站点。
