# emptyinkpot / apps-web

`apps/web/` 是当前仓库唯一对外发布的 Astro 站点应用，也是整个项目的前端主实现。

如果你现在要找“前端代码到底在哪、首页是怎么拼起来的、页面想表达什么”，优先看这份 README。

## 当前现状

- 当前仓库已经收拢为单站点结构，不再维护旧 Hexo 运行链路
- 对外页面、内容路由、静态资源和首页编排都以 `apps/web/` 为准
- 首页不是传统博客列表页，而是一张“编辑化工作台首页”
- 当前首页同时承担站点主入口、内容导航、状态展示、项目与笔记聚合这几种职责
- 设计稿存在于 `designs/homepage.pen`，前端实现则在 `apps/web/src/`

一句话理解：

这是一个以 Astro 为底座、以内容集合为真源、以“编辑化首页”作为统一入口的个人站点前端。

## 前端代码位置

最常用的几个位置如下：

- 页面入口：`apps/web/src/pages/`
- 首页入口：`apps/web/src/pages/index.astro`
- 首页组件：`apps/web/src/components/home/`
- 共享组件：`apps/web/src/components/shared/`
- 内容真源：`apps/web/src/content/`
- 首页数据编排：`apps/web/src/lib/home.ts`
- 通用内容聚合：`apps/web/src/lib/content.ts`
- 全局样式：`apps/web/src/styles/global.css`
- 站点静态资源：`apps/web/public/`
- 站点配置：`apps/web/astro.config.mjs`

## 项目组成

### 1. 页面层

位于 `apps/web/src/pages/`。

职责：

- 声明路由
- 组织页面级数据
- 决定页面使用哪些组件

当前典型入口包括：

- `index.astro`：首页
- `search.astro`：搜索页
- `updates.astro`：更新记录页
- `about.astro`：关于页
- `posts/`、`projects/`、`notes/`、`series/`、`tags/`、`categories/`：内容列表与详情入口

### 2. 组件层

位于 `apps/web/src/components/`。

职责：

- 承接具体视觉模块
- 复用首页与内容页的结构块
- 把页面编排和表现细节拆开

当前重点目录：

- `components/home/`：首页专用组件
- `components/shared/`：头部、通用壳层、共享展示组件
- `components/post/`：文章类页面相关组件

### 3. 内容层

位于 `apps/web/src/content/`。

职责：

- 存放真正的文章、笔记、项目和独立页面内容
- 作为前端内容真源

当前内容集合包括：

- `posts/`
- `notes/`
- `projects/`
- `pages/`

### 4. 数据编排层

位于 `apps/web/src/lib/`。

职责：

- 把内容真源整理成首页或页面可以直接消费的结构
- 管理首页各模块的展示数据
- 维护与 GitHub、更新记录、封面图等相关的辅助逻辑

当前最重要的文件：

- `home.ts`：首页模块数据与展示结构
- `content.ts`：内容聚合与查询
- `postCovers.ts`：文章封面映射
- `site.ts`：站点级配置

### 5. 样式与静态资源层

样式位于 `apps/web/src/styles/`，资源位于 `apps/web/public/`。

职责：

- 定义全局背景、颜色、间距、排版基础
- 存放运行时真正会被页面引用的图片与图标

当前资源目录约定：

- `public/images/branding/`：品牌资源
- `public/images/home/`：首页与全局背景资源
- `public/images/posts/`：文章公开配图

## 首页组成

当前首页可以理解为 5 组连续叙事，而不是零散卡片拼接。

### 1. Hero 组

包括主标题区、站点定位、主 CTA、右侧 snapshot。

作用：

- 第一时间告诉用户“这是什么站”
- 明确当前站点的内容重心
- 给出进入文章、项目、工作流的第一步入口

### 2. Charts 组

包括热力图、活跃折线图等。

作用：

- 把“站点是持续维护中的”这件事可视化
- 连接内容更新、项目推进与站点活跃度
- 让首页不只是信息架构，也具备运行态和节奏感

### 3. Latest 组

包括最新文章列表。

作用：

- 承接 Hero 之后最直接的内容入口
- 让用户看到站点当前在写什么
- 建立“最近更新”和“长期结构”之间的连接

### 4. Taxonomy 组

包括 Topics / Series 两部分。

作用：

- 把零散文章重组为主题入口和系列入口
- 让用户不只按时间读，也能按主题读
- 让首页具备内容地图属性

### 5. Project / Notes / Signals / Routes 组

作用：

- 告诉用户这个站不只有文章，还包括项目、笔记、状态与辅助入口
- 把“内容系统”和“工作系统”并在同一页里讲清楚

## 交互逻辑

这个前端不是强交互应用，但首页依然有明确的交互层次。

### 1. 第一层交互：全站导航

用户进入站点后，先通过顶部导航和首页首屏确定主入口。

典型路径：

- 首页 -> 文章列表
- 首页 -> 项目页
- 首页 -> 搜索页
- 首页 -> 关于页

### 2. 第二层交互：首页卡片入口

首页各模块本质上都是内容入口卡。

交互目标不是“在首页完成所有阅读”，而是：

- 让用户快速判断站点内容结构
- 找到最值得点击的下一步
- 从首页跳转到文章、项目、系列、分类、搜索等更具体页面

### 3. 第三层交互：内容聚合与导流

首页里的 `latest`、`topics`、`series`、`project`、`notes` 并不是平行孤岛。

它们之间的逻辑应当是：

- `Hero` 建立站点定位
- `Charts` 建立活跃感和维护感
- `Latest` 告诉用户现在在更新什么
- `Taxonomy` 告诉用户长期结构是什么
- `Project / Notes / Signals / Routes` 告诉用户站点还能往哪继续走

也就是说，首页交互逻辑更像“编辑化导览”，而不是“内容瀑布流”。

### 4. 第四层交互：搜索与辅助入口

搜索、更新、关于、项目等属于辅助但稳定的二级入口。

它们负责：

- 提供效率型访问方式
- 托住首页没有展开讲完的信息
- 让重度使用者可以跳过首页导览，直接进具体内容

## 画面风格

当前前端画面风格不是极简产品后台，也不是传统博客主题，而是偏“编辑部工作台 + 海报式内容首页”。

可以概括为以下几条：

### 1. 编辑化首页

- 首页强调编排感
- 模块之间有明显分区
- 重点不是无限滚动，而是建立秩序和导览

### 2. 暖灰白底 + 深紫信息色

- 大面积基底应偏中性暖白或半透明暖灰白
- 深紫只用在强调块、状态块和品牌识别上
- 不希望整页铺满发粉色底，因为会显脏、显糊

### 3. 统一卡片系统

- 当前项目已经统一去掉圆角，整体使用直角卡片
- 卡片之间依赖网格、留白、描边和对齐来建立系统感
- 真正的整体感来自统一骨架，而不是单卡装饰

### 4. 内容优先而不是装饰优先

- 图表、标签、摘要卡都服务于内容导览
- 视觉应该帮助用户理解结构，而不是只做气氛
- 首页必须能回答“这里有什么、先看什么、接下来去哪”

## 设计稿与前端的关系

当前设计稿在：

- `designs/homepage.pen`

它的作用是：

- 明确首页的模块关系和视觉目标
- 帮助统一卡片系统、间距体系和模块节奏

它不是前端运行时代码，也不是内容真源。

前端实现仍然以 `apps/web/src/` 为准。

简单说：

- `.pen` 解决“应该长什么样”
- `src/` 解决“页面如何运行”
- `content/` 解决“页面展示什么内容”

## 当前最重要的认知

如果你要继续改这个前端，最值得先记住的是：

1. 这是单站点仓库，前端主入口只有 `apps/web/`
2. 首页是一个内容系统总入口，不是普通博客列表页
3. `home.ts` 决定首页很多模块展示什么，`index.astro` 决定怎么装配，`components/home/` 决定长什么样
4. 设计稿和前端实现要互相校对，但不要把设计稿当成运行时代码
5. 视觉风格应该持续往“统一骨架、干净暖白、深紫强调、编辑化导览”这个方向收

## 常用命令

```bash
npm install
npm run dev
npm run build
npm run preview
```

如果从仓库根目录运行，也可以直接使用：

```bash
npm run dev
npm run build
npm run preview
```

## 相关文档

- 工程文档总入口：`docs/README.md`
- 总规划：`docs/plans/update-plan.md`
- 架构方案：`docs/architecture/astro-blog-redesign-plan.md`
- 执行清单：`docs/architecture/astro-blog-redesign-checklist.md`
- 首页抽象设计说明：`docs/architecture/homepage-editorial-ui-readme.md`
- giscus 配置：`docs/maintenance/giscus-setup.md`
