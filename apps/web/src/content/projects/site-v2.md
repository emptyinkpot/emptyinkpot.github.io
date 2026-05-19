---
title: emptyinkpot / unified site
description: 当前博客的统一站点工程，目标是以 Astro 作为唯一前台与发布入口，承载文章、专题、项目与笔记内容。
type: site
status: active
progress: 72
date: 2026-03-27
stack:
  - Astro
  - Tailwind
  - MDX
  - Nginx
repo: https://github.com/emptyinkpot/emptyinkpot.github.io
collaborationRuntime: github-workbench
collaborationStatus: interim-active
appflowyWorkspace: target:project.tengokukk.com/site-v2
modules:
  - id: content-os
    name: 内容操作系统
    status: in-progress
    progress: 78
  - id: reader-engine
    name: Reader Knowledge Engine
    status: in-progress
    progress: 68
  - id: project-studio
    name: Project Studio
    status: draft
    progress: 35
wiki:
  - title: 项目总览
    path: README.md
    type: overview
    summary: 当前站点工程说明、运行方式与发布链路。
  - title: 内容模型
    path: apps/web/src/content
    type: system
    summary: runtime MarkdownObject 文章索引 + notes / projects / pages 三个 Astro 内容集合。
  - title: 前端设计系统
    path: README.md
    type: doc
    summary: Heritage、Reader、Graph、Settings 与内容端口规范。
milestones:
  - title: Astro 主链路收口
    date: 2026-03-27
    summary: 把博客入口收敛到 Astro 单站点。
  - title: Reader Knowledge Engine
    date: 2026-04-20
    summary: 高亮、批注、Graph、Search 开始共享 Knowledge Index。
  - title: Project Studio
    date: 2026-05-05
    summary: 项目入口升级为 GitHub Workbench fallback；AppFlowy 协作 runtime 仍是外置目标，未接入当前生产页。
---

这是当前博客的统一站点工程说明。

当前目标不是继续保留 `site-v2` 作为预览副本，而是把它整理成唯一对外站点，并将内容模型、页面系统、搜索能力、评论能力与发布链路统一收口到这里。
