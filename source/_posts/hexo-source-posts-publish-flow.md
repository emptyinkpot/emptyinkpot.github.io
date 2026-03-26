---
title: Hexo 的 source/_posts 会自动发布吗：从本地文章到线上博客的完整链路
date: 2026-03-27 00:08:00
slug: hexo-source-posts-publish-flow
tags:
  - Hexo
  - GitHub Pages
  - GitHub Actions
  - Blogging
categories:
  - 建站
---

昨天在搭这个博客时，我很自然地问了自己一个问题：

> `E:\MyBlog\source\_posts` 下面的文章，是不是放进去就会自动出现在博客上？

答案是：

**会进入博客源码，但不会“凭空自动上线”。**

更准确地说：

- 放进 `source/_posts/`，代表文章已经进入 **Hexo 的内容源**
- 执行构建，代表文章会被 **生成成网页**
- 推送到 GitHub，代表会触发 **GitHub Actions 自动发布**
- 工作流成功后，文章才会真正出现在线上博客

这篇文章就把这条链路完整讲清楚。

## 1. 先说结论

如果只记一句话，可以记这个：

**`source/_posts` 是文章源目录，不是自动发布按钮。**

在我现在这套博客配置里，完整流程是：

```text
把 Markdown 放进 source/_posts
-> Hexo 读取文章
-> npm run build 生成 public/ 静态网页
-> git push origin main
-> GitHub Actions 自动构建与部署
-> 博客上线
```

所以：

- 放文件进去，不等于线上立刻可见
- 但只要你后续推送到 `main`，它就会自动发布

## 2. `source/_posts` 到底是什么

在 Hexo 里，`source/_posts/` 是默认的**文章源目录**。

你可以把它理解成：

- 它存放的是博客文章的 Markdown 源文件
- Hexo 构建时会优先扫描这里
- 扫到的文章会被渲染成真正的 HTML 页面

当前这个博客目录大致是这样：

```text
E:\MyBlog
├─ source\
│  ├─ _posts\          # 文章源目录
│  └─ about\           # 独立页面，不属于文章列表
├─ public\             # Hexo 构建后的静态站点
├─ _config.yml         # 站点主配置
└─ .github\
   └─ workflows\
      └─ pages.yml     # GitHub Pages 自动发布工作流
```

这里最重要的关系是：

- `source/_posts/` 放文章源码
- `public/` 放构建后的网页文件

## 3. 一篇文章是怎么被识别的

并不是所有放进 `source/_posts/` 的文件都会正常显示为文章。

一篇标准文章，至少要是一个 Markdown 文件，并且通常会带有 Front Matter，也就是文件头部的元数据。

例如：

```md
---
title: 我的第一篇文章
date: 2026-03-27 00:00:00
slug: my-first-post
tags:
  - Hexo
categories:
  - 建站
---

这里是正文。
```

这里每个字段的作用可以简单理解为：

| 字段 | 作用 |
| --- | --- |
| `title` | 文章标题 |
| `date` | 发布时间 |
| `slug` | 最终链接的一部分 |
| `tags` | 标签 |
| `categories` | 分类 |

结合我当前博客的配置：

```yml
permalink: posts/:slug/
```

所以如果文章写了：

```yml
slug: my-first-post
```

它最终就会生成到：

```text
/posts/my-first-post/
```

## 4. 放进 `source/_posts` 后，到底发生了什么

文章放进去以后，会经历四步。

### 第一步：进入博客源码

你把 Markdown 文件放进：

```text
E:\MyBlog\source\_posts\
```

这一刻，它只是进入了本地博客源码。

此时：

- Hexo 可以在本地识别它
- Git 也能看到它是一个新增文件
- 但线上博客还完全不知道这篇文章存在

### 第二步：Hexo 构建它

当你执行：

```bash
npm run build
```

Hexo 实际上会运行：

```bash
hexo generate
```

然后它会：

1. 读取 `source/_posts` 下的文章
2. 读取文章头部 Front Matter
3. 套用主题模板
4. 输出到 `public/`

也就是说，真正给浏览器访问的不是 Markdown，而是构建后的静态网页。

### 第三步：推送到 GitHub

如果你本地已经写好了文章，还需要把源码提交并推送：

```bash
git add .
git commit -m "Add new post"
git push origin main
```

只有这一步完成后，GitHub 上的仓库才会看到你的新文章。

### 第四步：GitHub Actions 自动发布

这个仓库里已经配置了自动发布工作流：

```text
.github/workflows/pages.yml
```

当前逻辑是：

1. 监听 `main` 分支的 push
2. 安装 Node.js
3. 执行 `npm ci`
4. 执行 `npm run build`
5. 上传 `public/`
6. 部署到 GitHub Pages

所以“自动发布”真正发生在这里：

> **不是你把文件放进 `source/_posts` 的那一刻，而是你把改动推到 GitHub 的那一刻。**

## 5. 这套博客里，什么叫“自动发布”

很多人会把“自动发布”理解成：

> 只要我在本地某个目录里新建文件，网站就会自己变。

这其实不准确。

对这个博客来说，所谓自动发布，准确含义是：

> **只要你把变更 push 到 `main`，GitHub Actions 就会自动构建并发布。**

所以自动的是：

- 自动构建
- 自动部署

不是：

- 自动监听你本地磁盘
- 自动把你没提交的文件传上网

## 6. 哪些情况文章不会上线

这个问题反而最值得说清楚。

即使文章已经在 `source/_posts` 里，下面这些情况它也不会出现在博客上。

### 情况 1：你只是放在本地，还没推送

这是最常见的情况。

如果文章只存在于：

```text
E:\MyBlog\source\_posts\
```

但你没有执行：

```bash
git push origin main
```

那它不会出现在线上。

### 情况 2：推送了，但 GitHub Actions 失败

如果工作流运行失败，例如：

- 依赖安装失败
- Hexo 构建失败
- 配置文件写错
- Markdown 里有导致渲染异常的问题

那文章也不会成功发布。

### 情况 3：文章是草稿

Hexo 支持 draft，但我当前博客配置里：

```yml
render_drafts: false
```

这意味着草稿默认不会被渲染到正式站点里。

### 情况 4：文章日期、路径或元数据写得不合理

比如：

- Front Matter 格式错误
- `slug` 冲突
- 文件不是有效 Markdown
- 日期字段写得很奇怪

这些都可能导致文章生成结果不符合预期。

### 情况 5：Pages 配置没指向 GitHub Actions

这个仓库使用的是 GitHub Actions 部署。

所以 GitHub 仓库里必须确保：

```text
Settings > Pages > Source > GitHub Actions
```

如果这里没配对，推送后也可能看不到最新内容。

## 7. 这个博客现在的真实发布链路

如果按我当前这套仓库实际配置来画，发布链路是这样的：

```text
本地文章
E:\MyBlog\source\_posts\xxx.md
        |
        v
Hexo 构建
npm run build
        |
        v
生成静态网页
E:\MyBlog\public\
        |
        v
提交源码到 GitHub
git push origin main
        |
        v
GitHub Actions 工作流
.github/workflows/pages.yml
        |
        v
部署到 GitHub Pages
https://emptyinkpot.github.io/
```

这个链路里，最容易被误解的其实是 `public/`。

`public/` 不是你平时手写内容的地方，它只是构建产物目录。  
真正应该维护的是 `source/_posts/` 里的 Markdown 源文件。

## 8. 除了文章目录，还有哪些目录和发布有关

理解完整博客结构后，会更不容易搞混。

### `source/_posts/`

文章源文件目录。

你平时新增博客文章，基本都在这里。

### `source/about/`

独立页面目录。

像“关于”这种页面，通常不走文章列表，而是单独生成固定页面。

### `_config.yml`

站点主配置。

这里会影响：

- 站点标题
- 作者
- 语言
- 时区
- 永久链接
- 文章路由生成方式

### `_config.landscape.yml`

当前主题 `landscape` 的覆盖配置。

这里主要控制：

- 菜单
- 侧边栏
- 副标题
- GitHub 链接

### `.github/workflows/pages.yml`

自动部署配置。

它决定了：推送到 GitHub 后，站点会不会自动构建和发布。

## 9. 平时写博客的正确工作流

如果这套博客已经配置好了，平时写作推荐固定成下面这几步：

### 1. 新建文章

```bash
npm run new "文章标题"
```

或者你也可以自己直接新建一个 `.md` 文件放进：

```text
source/_posts/
```

### 2. 写文章

补齐 Front Matter，写正文 Markdown。

### 3. 本地预览

```bash
npm run server
```

默认访问：

```text
http://localhost:4000/
```

### 4. 本地构建检查

```bash
npm run build
```

确保 Hexo 能正常生成页面。

### 5. 提交并推送

```bash
git add .
git commit -m "Add new post"
git push origin main
```

### 6. 等待线上自动发布

推送后，GitHub Actions 会自动构建并发布。通常等一会儿，线上就能看到。

## 10. 最容易记错的几个点

最后把最容易混淆的地方再压缩总结一下。

### 误区 1：`source/_posts` 等于线上博客

不对。

`source/_posts` 只是源码目录，不是线上站点本身。

### 误区 2：`public/` 才是我该维护的地方

也不对。

`public/` 是构建产物，不应该手工维护。你应该维护的是 Markdown 源文件。

### 误区 3：我本地能看到，线上就一定能看到

不对。

本地可见只说明 Hexo 本地能生成，不代表 GitHub 已经发布。

### 误区 4：推送后一定马上可见

也不一定。

通常需要等待 GitHub Actions 构建与 Pages 部署完成。

## 11. 最后用一句话说清楚

如果把整件事压缩成一句话，我觉得最准确的是：

> **`source/_posts` 负责存文章源码，Hexo 负责生成网页，GitHub Actions 负责自动发布，GitHub Pages 负责对外提供访问。**

所以答案不是简单的“会”或者“不会”，而是：

**放进 `source/_posts` 后，它会进入博客系统；推送到 GitHub 后，它才会自动上线。**
