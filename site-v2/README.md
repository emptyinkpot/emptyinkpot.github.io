# emptyinkpot / site-v2

Astro 版博客重构原型，当前与根目录 Hexo 站并行维护。

## 当前定位

- 根目录 Hexo 站：继续作为当前线上主站
- `site-v2/`：新的 Astro 内容站原型
- GitHub Pages 预览路径：`/site-v2/`

当前已经完成：

- Astro + Tailwind + MDX + Content Collections
- 首页、文章页、分类、标签、系列、项目、Notes、搜索页
- RSS、Sitemap、robots.txt
- GitHub Pages 子路径预览部署

## 常用命令

在 `site-v2/` 目录运行：

```bash
npm install
npm run dev
npm run build
npm run preview
```

## 本地构建

默认本地构建：

```bash
npm run build
```

如果要模拟 GitHub Pages 上的 `/site-v2/` 子路径部署，使用：

```bash
SITE_BASE=/site-v2/ npm run build
```

在 Windows PowerShell 中可写为：

```powershell
$env:SITE_BASE='/site-v2/'
npm run build
Remove-Item Env:SITE_BASE
```

## giscus 配置

`site-v2` 的评论组件已经接好，但真实启用还依赖 GitHub 仓库设置。

当前需要先完成：

1. 在仓库设置中开启 Discussions
2. 安装 giscus GitHub App
3. 创建一个用于评论映射的 Discussions 分类
4. 到 `https://giscus.app/zh-CN` 生成仓库与分类参数
5. 在 `site-v2/.env` 中填入对应变量

可直接复制 `site-v2/.env.example` 作为起点。

## 相关文档

- `docs/astro-blog-redesign-plan.md`
- `docs/astro-blog-redesign-checklist.md`
- `docs/maintenance/astro-redesign-execution-log.md`
- `docs/maintenance/giscus-setup.md`
