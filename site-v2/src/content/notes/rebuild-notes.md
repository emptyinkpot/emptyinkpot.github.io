---
title: Astro 重构记录
description: 用来承接后续站点重构中的碎片记录和阶段性更新。
date: 2026-03-27
draft: false
---

这一页用来记录 `site-v2` 这次 Astro 重构的阶段性进展，也作为后续 Notes 栏目的第一条公开内容。

当前已经完成的部分：

- 新建 `site-v2/`，与现有 Hexo 站并行存在
- 接入 Astro、Tailwind、MDX、Content Collections
- 首页改为卡片式文章列表，不再直接铺全文
- 补齐文章详情页、搜索页、分类页、标签页、系列页、项目页

接下来会继续推进的内容：

- 批量迁移旧文章
- 接入 RSS、Sitemap 与 GitHub Pages 部署链路
- 完成 giscus 评论配置并验证线上可用

Notes 之后会更偏向“短更新”和“设计决策记录”，和正式文章形成互补。
