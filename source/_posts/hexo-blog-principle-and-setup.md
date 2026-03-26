---
title: 这个博客是怎么工作的，以及我是怎么把 Hexo 搭起来的
date: 2026-03-26 21:05:00
slug: hexo-blog-principle-and-setup
tags:
  - Hexo
  - GitHub Pages
  - 静态博客
categories:
  - 建站
---

这篇文章想把两件事讲清楚：

1. 这个博客的运行原理是什么；
2. 从零搭一个 Hexo 博客的步骤是什么。

如果你以后想自己再搭一个类似的站点，照着这篇文章走就可以。

## 这个博客的原理是什么

这个博客本质上是一个**静态网站**。

所谓静态网站，就是页面在发布之前就已经生成好了。访问者打开网站时，服务器直接把现成的 HTML、CSS、JavaScript 和图片文件发出去，不需要像传统动态网站那样每次都实时查数据库、拼页面。

这套博客的工作流程可以理解成下面四步：

1. 我们在本地写 Markdown 文章；
2. Hexo 读取文章、配置和主题模板；
3. Hexo 把它们编译成静态网页，输出到 `public/`；
4. GitHub Pages 把这些静态文件发布到线上。

所以这套博客里有两个很重要的角色：

- `Hexo`：负责“把内容变成网页”
- `GitHub Pages`：负责“把网页放到网上给别人访问”

换句话说，Hexo 是静态站点生成器，GitHub Pages 是静态站点托管平台。

## 这个仓库里各部分分别干什么

现在这个博客仓库里，最重要的几个位置如下：

- `_config.yml`：站点主配置，比如标题、作者、网址、语言、永久链接
- `_config.landscape.yml`：当前主题的覆盖配置
- `source/_posts/`：文章目录，博客正文都写在这里
- `source/about/`：独立页面，比如“关于”
- `scaffolds/`：新建文章时使用的模板
- `.github/workflows/pages.yml`：GitHub Actions 自动发布配置

平时写博客，最常接触的是 `source/_posts/`。  
平时改站点信息，最常接触的是 `_config.yml`。

## Hexo 是怎么把文章变成页面的

Hexo 在运行时，大致会做下面这些事：

1. 读取 `source/` 里的 Markdown 文件
2. 读取文章头部的 Front Matter，例如标题、时间、标签、分类
3. 读取主题模板和站点配置
4. 把内容渲染成 HTML
5. 把结果输出到 `public/`

例如你写了一篇文章：

```md
---
title: 我的第一篇文章
date: 2026-03-26 21:00:00
tags:
  - Hexo
categories:
  - 建站
---

这里是正文。
```

Hexo 生成后，最终会得到一个真正可以访问的网页文件。  
浏览器访问时，看到的已经不是 Markdown，而是生成后的 HTML 页面。

## 为什么这类博客适合个人使用

Hexo + GitHub Pages 很适合个人博客，主要因为这几个优点：

- 成本低，基本可以免费使用
- 结构简单，不需要数据库
- 写作体验好，直接用 Markdown
- 发布方便，推送代码就能自动部署
- 安全性和稳定性通常不错，因为线上只是静态文件

它的取舍也很明确：

- 适合内容展示型网站
- 不适合复杂后台系统
- 评论、搜索、统计等能力通常要靠第三方服务或额外插件补充

## GitHub 实际免费提供了哪些资源

很多人第一次接触 GitHub Pages 时，都会有一个很直接的感受：

“这不就是把代码传上去，然后借 GitHub 的机器把网站托管起来吗？”

这个理解方向没错，只是更准确的说法应该是：

**你是在使用 GitHub 官方提供的仓库托管、构建计算和静态网站发布能力。**

对这个博客来说，GitHub 主要提供了下面这些资源。

### 1. 仓库存储

首先，你有一个 Git 仓库来存放博客源码。

这个仓库里保存的是：

- Hexo 配置
- 主题配置
- Markdown 文章
- 自动部署工作流
- 依赖声明文件

也就是说，GitHub 先帮你保存了“网站的源代码和内容”。

不过这个存储不是无限的。GitHub 官方对 GitHub Pages 源仓库给出的建议是：

- Pages 源仓库推荐控制在 1 GB 以内
- 普通 Git 仓库里，文件超过 50 MiB 会收到警告
- 普通 Git 仓库里，文件超过 100 MiB 会被直接拒绝

所以博客里适合放文章、图片、少量 PDF 和前端资源，不适合长期堆很多超大文件。

### 2. GitHub Actions 构建算力

当你把代码推送到仓库后，并不是 GitHub Pages 凭空“懂了”你的 Hexo 项目，而是 GitHub Actions 会先帮你跑构建。

在我们现在这个项目里，工作流会做这些事：

1. 拉取仓库代码
2. 安装 Node.js
3. 安装依赖
4. 执行 `npm run build`
5. 上传 `public/` 目录
6. 部署到 GitHub Pages

这一步使用的是 GitHub 提供的构建机器。

对于**公共仓库**，GitHub 官方文档说明标准 GitHub-hosted runners 是**免费且不限量**的。像我们工作流里常用的 `ubuntu-latest`，标准规格是：

- 4 个 CPU
- 16 GB 内存
- 14 GB SSD

所以你推送代码以后，实际上是 GitHub 在替你跑一次构建，而不是你自己的电脑一直在线给别人服务。

### 3. GitHub Pages 静态网站托管

构建完成后，GitHub Pages 会把生成好的静态文件发布出去。

也就是说，线上真正对外提供访问的是：

- HTML
- CSS
- JavaScript
- 图片
- 字体
- 其他静态附件

这些文件会被 GitHub 的 Pages 服务托管，所以别人访问时，不需要你的电脑开机。

GitHub 官方当前给出的主要限制是：

- 已发布站点大小不能超过 1 GB
- Pages 部署超过 10 分钟会超时
- 站点带宽有 100 GB/月的软限制
- Pages 有可能触发速率限制

如果超出这些范围，GitHub 可能会限制服务，或者建议你把大文件放到其他地方，例如 Releases 或第三方 CDN。

### 4. 默认域名

GitHub Pages 会直接给你一个默认域名：

```text
https://用户名.github.io/
```

像这个博客现在使用的就是：

```text
https://emptyinkpot.github.io/
```

这意味着你不用先买服务器，也不用自己配 Web 服务，就已经有了一个公网可访问的网站入口。

### 5. 自定义域名能力

如果你以后想把博客换成自己的域名，例如：

```text
https://blog.example.com/
```

GitHub Pages 也支持。

官方文档明确支持：

- `www.example.com` 这样的 `www` 子域名
- `blog.example.com` 这样的自定义子域名
- `example.com` 这样的根域名

所以 GitHub 给的不只是一个 `github.io` 地址，还给了你把它接到自己域名上的能力。

### 6. HTTPS 证书与加密访问

GitHub Pages 还提供 HTTPS 支持。

这意味着访问者打开你的网站时，流量可以通过 HTTPS 加密传输，避免被中间人轻易篡改或偷窥。

对于 `github.io` 域名，GitHub Pages 会自动提供 HTTPS。  
如果你使用自定义域名，只要 DNS 配置正确，也可以启用并强制使用 HTTPS。

这也是为什么一个个人博客即使没有自己买服务器证书，也能直接以 `https://` 的形式访问。

### 7. 发布流程自动化

GitHub 还提供了自动化发布链路。

你不需要每次手动上传 HTML 文件，只要：

1. 改文章
2. 提交 Git
3. 推送到 `main`

GitHub 就会自动完成构建和部署。

这背后依赖的其实是两部分资源协同工作：

- GitHub Actions 负责算力
- GitHub Pages 负责托管

### 8. 版本历史与回滚能力

因为博客本身就是一个 Git 仓库，所以 GitHub 还免费给了你版本历史管理能力。

这意味着你可以：

- 回看每次修改了什么
- 找回误删的文章
- 比较不同版本的改动
- 在出问题时回滚到某个旧提交

这对博客非常有价值，因为文章、配置和部署记录都留在同一个版本系统里。

## 这些资源的边界是什么

虽然 GitHub 给了很多免费能力，但它不是一台“什么都能跑”的通用服务器。

这套方案的边界主要有这些：

- 它适合静态网站，不适合自己跑后端程序
- 它不提供你自己的数据库
- 它不适合长期存放很多超大文件
- 它不适合拿来做电商站、在线交易站或 SaaS 主业务站点
- 它也不适合处理敏感交易，例如密码、信用卡信息之类的场景

还有一个很容易踩坑的点：

虽然 GitHub 支持 Git LFS 来存大文件，但**Git LFS 不能用于 GitHub Pages 站点**。  
也就是说，你不能指望把超大资源扔进 Git LFS，再让 Pages 像普通静态文件一样对外提供。

如果你的博客以后真的要挂很多大资源，更合适的做法通常是：

- 大文件放 GitHub Releases
- 图片放对象存储或 CDN
- 博客正文和页面继续放在 GitHub Pages

## 用一句话总结 GitHub 给了什么

如果把这套博客拆开看，GitHub 实际上提供的是：

- 一个保存源码的仓库
- 一台替你自动构建的云端机器
- 一个能把静态文件公开发布的网站托管服务
- 一个默认域名
- 一个可选的自定义域名接入能力
- 一个 HTTPS 能力
- 一套 Git 版本管理和自动部署链路

所以这不是“网页镜像”，也不是“偷偷白嫖漏洞”，而是**在使用 GitHub 官方开放的静态站点基础设施**。

## 从零建立一个 Hexo 博客的步骤

下面这套流程，就是这次搭这个博客时走过的核心步骤。

### 1. 准备环境

至少需要安装：

- Node.js
- Git

检查命令可以这样跑：

```bash
node -v
npm -v
git --version
```

## 2. 创建 GitHub 仓库

如果希望博客直接部署在根地址：

```text
https://你的用户名.github.io/
```

那仓库名就必须是：

```text
你的用户名.github.io
```

这次我们使用的仓库就是：

```text
emptyinkpot/emptyinkpot.github.io
```

## 3. 初始化 Hexo

可以直接使用：

```bash
npx hexo-cli init myblog
```

或者在当前目录初始化：

```bash
npx hexo-cli init .
```

初始化完成后，Hexo 会自动生成基础目录结构，并安装依赖。

## 4. 配置站点信息

打开 `_config.yml`，至少要改这些字段：

```yml
title: emptyinkpot
author: emptyinkpot
language: zh-CN
timezone: Asia/Shanghai
url: https://emptyinkpot.github.io
root: /
```

如果是项目页部署，例如：

```text
https://用户名.github.io/myblog/
```

那 `url` 和 `root` 都要跟着调整。

## 5. 写第一篇文章

新建文章：

```bash
npm run new "我的第一篇文章"
```

文章会生成到：

```text
source/_posts/
```

写作时最关键的是 Front Matter，也就是文件最上方这段元数据：

```yml
---
title: 文章标题
date: 2026-03-26 21:00:00
tags:
  - 标签1
categories:
  - 分类1
---
```

正文直接写 Markdown 就可以。

## 6. 本地预览

启动本地开发服务器：

```bash
npm run server
```

默认访问地址通常是：

```text
http://localhost:4000/
```

Hexo 会把你当前的文章和页面渲染出来，方便先在本地确认效果。

## 7. 生成静态文件

如果只想手动生成站点，可以执行：

```bash
npm run build
```

这一步本质上就是调用：

```bash
hexo generate
```

生成后的文件会放在：

```text
public/
```

这个目录里的内容，就是最终要发布到线上的网页。

## 8. 配置 GitHub Actions 自动部署

为了做到“提交代码后自动发布”，可以在仓库里加一个工作流文件：

```text
.github/workflows/pages.yml
```

它的核心逻辑通常是：

1. 拉取仓库代码
2. 安装 Node.js
3. 执行 `npm ci`
4. 执行 `npm run build`
5. 把 `public/` 上传为 Pages 制品
6. 部署到 GitHub Pages

这样以后每次推送到 `main`，GitHub 就会自动构建并发布。

## 9. 在 GitHub 中启用 Pages

除了工作流文件，还要去仓库网页里手动设置一次：

```text
Settings > Pages > Source > GitHub Actions
```

这一步很关键。  
如果没有把发布源切到 `GitHub Actions`，工作流就算存在，站点也不一定会按我们预期更新。

## 10. 提交并推送

最后把源码推上去：

```bash
git add .
git commit -m "Initialize Hexo blog"
git push origin main
```

推送成功后，GitHub Actions 就会自动执行，完成构建和发布。

## 以后写博客时的日常流程

以后基本只要记住这几步：

1. 新建文章
2. 写 Markdown
3. 本地预览
4. 提交并推送

对应命令通常就是：

```bash
npm run new "文章标题"
npm run server
git add .
git commit -m "Add new post"
git push origin main
```

## 这套方案最核心的理解

如果只记一句话，我觉得可以记这个：

**Hexo 负责生成网页，GitHub Pages 负责发布网页，Markdown 负责承载内容。**

你写的是内容，Hexo 负责把内容排版成网站，GitHub 负责把网站放到互联网上。

## 结语

个人博客并不复杂，难点通常不在技术本身，而在第一次把“内容、生成、部署”这三件事串起来。

一旦这条链路跑通，后面写博客就会变得很轻松：  
写文章，提交代码，等待自动发布。

这也是我喜欢 Hexo 的原因之一。它足够简单，也足够实用。

## 参考链接

- GitHub Pages 限制：<https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits>
- GitHub Pages 自定义工作流：<https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages>
- GitHub Actions 托管 Runner 规格：<https://docs.github.com/en/actions/reference/runners/github-hosted-runners>
- GitHub Pages 自定义域名：<https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages>
- GitHub Pages HTTPS：<https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https>
- GitHub 大文件限制：<https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github>
- Git LFS：<https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-git-large-file-storage>
