---
title: Content OS 首页前端设计规范：从静态博客到动态内容入口
description: 记录 MyBlog 首页这次从内容流升级为 Content OS Home 的设计思路、组件边界、动效规范和后续增量路线。
date: 2026-05-05 08:55:00
slug: content-os-homepage-frontend-design-system
summary: 首页不再只是文章列表，而是一个能显示站点状态、快速进入内容系统、承载项目工坊和知识系统的动态入口；这篇文章记录对应的前端规范。
tags:
  - Frontend
  - UI
  - Design System
  - Astro
  - React
categories:
  - 前端工程
series: MyBlog Content OS
featured: true
draft: false
toc: true
---

这次首页改造的目标不是做一个更大的 hero，也不是把博客包装成营销页。

真正要解决的问题是：MyBlog 现在已经不只是文章站，它同时承载文章、笔记、项目工坊、GitHub 状态、书架、音乐、Knowledge Graph、阅读高亮和本地标记。因此首页必须从“内容列表”升级成一个可操作的 **Content OS Home**。

## 一、首页的定位

首页的职责分成三层：

1. 展示站点身份
2. 暴露系统状态
3. 提供快速操作入口

所以首页不能只放一组卡片，也不能只放一段欢迎语。它应该打开后就能回答：

- 这个站当前有什么内容
- 哪些系统正在运行
- 最近发生了什么
- 我要去文章、项目、GitHub、书架、音乐、Knowledge 或设置，应该怎么走

## 二、保留 Heritage，而不是照搬模板

这轮参考了成熟模板和动效库的思路，例如 shadcn dashboard、Magic UI、Aceternity、Motion Primitives，但没有直接照搬它们的视觉。

原因很简单：MyBlog 已经有自己的 Heritage 气质。它的色彩、字体和纸张质感不应该被默认 SaaS 灰白、蓝紫渐变或炫光背景覆盖。

因此所有新增组件都遵守这条规则：

```text
成熟模板提供结构
Heritage token 决定视觉
```

核心 token 仍然是：

```css
--heritage-green
--heritage-purple
--heritage-red
--heritage-gold
--heritage-bg
--heritage-card
```

## 三、新增组件边界

### 1. Dynamic Hero

Hero 不再只显示站点名，而是显示站点状态。

当前首屏指标包括：

- Posts
- Repos
- Projects
- Knowledge Nodes

数字通过 React island `HomeNumberTicker` 做轻量滚动，但它必须尊重低动效偏好：如果用户开启 `prefers-reduced-motion`，直接显示最终值，不播放动画。

### 2. Bento Content Entry

Bento 不是装饰网格，而是功能入口。

当前首页 Bento 包括：

- Project Studio
- GitHub
- Knowledge
- Books
- Music

每个入口都必须能点击进入真实页面，并且显示当前系统的真实信号，例如项目进度、GitHub 活动、书架状态或音乐状态。

### 3. Activity Marquee

活动流用于让首页有“正在运行”的感觉。

它只展示短句，不承载正文内容：

- 最新文章
- 当前项目进度
- GitHub 最近更新
- 书架条目
- 音乐条目
- Knowledge 状态

Marquee 的作用是系统信号，不是跑马灯广告。

### 4. Command Palette

首页增加 `HomeCommandPalette`，默认快捷键是：

```text
Ctrl / Command + K
```

它提供快速跳转：

- 搜索全站
- 文章
- 项目工坊
- 项目工作台
- GitHub
- 书架
- 音乐
- Knowledge Graph
- 设置

Command Palette 是成熟应用的核心入口。它让首页不再只是“看”，而是可以直接“操作”。

## 四、保留原有系统

这次不是推倒重写。

必须保留的原有能力包括：

- 首页左侧个人状态栏
- GitHub signals
- Reading memory
- Knowledge stats
- Feed 内容流
- 阅读 drawer
- 本地高亮
- 批注
- 印章
- 搜索层
- 设置页的视觉偏好联动

新增组件只放在这些能力上方和旁边，不能替代它们。

## 五、动效规范

首页允许动效，但动效必须有边界。

允许：

- 数字滚动
- Bento 轻入场
- Hover spotlight
- Activity marquee
- 纸张质感

禁止：

- 全屏粒子遮挡内容
- 滚动劫持
- 大面积炫光背景
- 动效造成文字重叠
- 动效造成横向溢出
- 为了动画引入整页 React 化

## 六、React Island 规则

Astro 继续负责内容渲染。

React 只用于局部交互：

- Command Palette
- Number Ticker
- 未来的 Tabs / Table / Form / Graph Editor

每个 React island 都必须明确：

- 输入 props 是什么
- 是否请求 API
- 是否写入数据
- API 未接入时如何降级
- 是否会影响静态构建

当前首页的 React island 不请求 GitHub API，也不会写入任何数据。

## 七、GitHub 和 CMS 边界

浏览器前端不能直接安全写 GitHub。

因此首页和项目工作台都遵守这条链路：

```text
前端交互
  ↓
服务端 API / CMS
  ↓
GitHub API
```

当前阶段继续使用 GitHub edit fallback。后续可以接入 Decap CMS 或 TinaCMS，但不能同时接两套 CMS，也不能把 token 放进前端。

## 八、后续路线

推荐增量顺序：

1. 首页继续补 SpotlightCard 和 ScrollReveal
2. 项目工作台内部控件迁移到 shadcn 风格
3. 设置页迁移到 React form / slider / switch
4. 接入一个 CMS，优先 Decap 或 Tina 二选一
5. 世界观图谱使用 React Flow
6. GitHub 写入能力放进服务端 API

这套规范的核心不是“更花”，而是让 MyBlog 的首页变成一个成熟的内容系统入口。

最终目标是：

```text
博客可阅读
项目可进入
知识可检索
状态可感知
操作可触达
```

这就是 Content OS Home 的标准。
