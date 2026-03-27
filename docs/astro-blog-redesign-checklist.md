# 博客重构执行清单

关联详细方案：`docs/astro-blog-redesign-plan.md`

更新时间：2026-03-27

## 1. 项目目标

- [ ] 将当前 Hexo 博客升级为更现代的内容站
- [ ] 风格同时覆盖：
  - [ ] 极简高级
  - [ ] 卡片杂志感
  - [ ] 产品化技术博客
- [ ] 保持静态站部署能力
- [ ] 保留 GitHub Pages 工作流

## 2. 技术路线确认

- [ ] 主框架确定为 `Astro`
- [ ] 内容系统确定为 `Markdown / MDX + Astro Content Collections`
- [ ] 样式方案确定为 `Tailwind CSS + CSS Variables`
- [ ] 搜索方案确定为 `Pagefind`
- [ ] 第一阶段评论方案确定为 `giscus`
- [ ] 第二阶段评论增强方案预留为 `Artalk`
- [ ] 部署方案确定为 `GitHub Actions + GitHub Pages`

## 3. 内容模型确认

- [ ] 定义 `posts`
- [ ] 定义 `notes`
- [ ] 定义 `projects`
- [ ] 定义 `pages`
- [ ] 统一 front matter 字段
- [ ] 保留旧文章 `slug`
- [ ] 为旧文章补 `description`
- [ ] 规划 `series` 字段

推荐字段：

- [ ] `title`
- [ ] `description`
- [ ] `published`
- [ ] `updated`
- [ ] `slug`
- [ ] `tags`
- [ ] `category`
- [ ] `series`
- [ ] `featured`
- [ ] `draft`
- [ ] `cover`
- [ ] `toc`

## 4. 信息架构确认

- [ ] 首页 `Home`
- [ ] 文章页 `Posts`
- [ ] 系列页 `Series`
- [ ] 项目页 `Projects`
- [ ] 关于页 `About`
- [ ] 搜索入口 `Search`

## 5. 首页模块清单

- [ ] Hero 区
- [ ] Featured Post 主推卡
- [ ] Latest Posts 卡片网格
- [ ] Topics / Categories 入口
- [ ] Series 入口
- [ ] Projects 模块
- [ ] Notes 模块
- [ ] Footer CTA

首页要求：

- [ ] 不显示全文
- [ ] 只显示标题、摘要、元信息、跳转入口
- [ ] 桌面端有明显卡片编排感
- [ ] 移动端自然降级为纵向流

## 6. 文章页模块清单

- [ ] 标题区
- [ ] 发布时间 / 标签 / 分类 / 阅读时间
- [ ] TOC 目录
- [ ] 正文排版
- [ ] 代码复制
- [ ] 图片放大
- [ ] 系列导航
- [ ] 上一篇 / 下一篇
- [ ] 相关文章
- [ ] 评论区

可选增强：

- [ ] 阅读进度条
- [ ] 返回顶部
- [ ] Callout / 引文样式

## 7. 视觉系统清单

- [ ] 确定主色
- [ ] 确定中性色阶
- [ ] 确定背景色
- [ ] 确定标题字体
- [ ] 确定正文字体
- [ ] 确定代码字体
- [ ] 确定圆角体系
- [ ] 确定阴影体系
- [ ] 确定间距体系
- [ ] 确定容器宽度规则

## 8. 组件清单

- [ ] `Container`
- [ ] `SectionHeader`
- [ ] `ArticleCard`
- [ ] `FeaturedCard`
- [ ] `Tag`
- [ ] `Pagination`
- [ ] `SearchTrigger`
- [ ] `SearchModal`
- [ ] `ThemeToggle`
- [ ] `CommentBlock`
- [ ] `TOC`
- [ ] `Prose`

## 9. 项目初始化清单

- [ ] 创建迁移分支
- [ ] 新建 Astro 项目
- [ ] 安装 Tailwind
- [ ] 安装 MDX
- [ ] 接入 Sitemap
- [ ] 接入 RSS
- [ ] 建立基础目录结构
- [ ] 建立布局文件
- [ ] 建立内容集合 schema

建议命名：

- [ ] 分支：`feature/astro-redesign`
- [ ] 新站目录：`site-v2/`

## 10. 旧内容迁移清单

- [ ] 从 `source/_posts/` 迁移到 `src/content/posts/`
- [ ] 检查 Markdown 编码
- [ ] 清洗 front matter
- [ ] 补齐 description
- [ ] 保留 slug
- [ ] 校验内部链接
- [ ] 检查图片路径
- [ ] About 页面迁移
- [ ] 项目页内容整理
- [ ] Notes 内容策略确认

## 11. 搜索清单

- [ ] 选用 `Pagefind`
- [ ] 构建后生成索引
- [ ] 搜索入口可从首页打开
- [ ] 搜索入口可从文章页打开
- [ ] 标题可检索
- [ ] 摘要可检索
- [ ] 正文可检索
- [ ] 中文搜索可用

## 12. 评论与反馈清单

### 第一阶段：giscus

- [ ] 开启 GitHub Discussions
- [ ] 安装 giscus app
- [ ] 创建评论分类
- [ ] 配置 pathname 映射
- [ ] 在文章页底部接入
- [ ] 验证评论可正常提交
- [ ] 验证 reactions 可用

### 第二阶段：Artalk

- [ ] 评估是否真的需要独立评论后台
- [ ] 选择部署环境
- [ ] 配置数据库
- [ ] 部署 Artalk 服务
- [ ] 在前端接入 Artalk 组件
- [ ] 验证通知 / 审核 / 管理功能

## 13. 部署清单

- [ ] 建立 Astro 的 GitHub Actions 工作流
- [ ] 构建输出静态目录
- [ ] 构建后执行 Pagefind 索引
- [ ] 上传构建产物
- [ ] 部署到 GitHub Pages
- [ ] 验证线上首页
- [ ] 验证线上文章页
- [ ] 验证线上搜索
- [ ] 验证线上评论

## 14. SEO 与基础设施清单

- [ ] 输出 `sitemap.xml`
- [ ] 输出 RSS
- [ ] 配置 canonical
- [ ] 配置 Open Graph
- [ ] 配置 meta description
- [ ] 配置 robots.txt
- [ ] 检查页面标题模板
- [ ] 检查文章摘要逻辑

## 15. 链接兼容清单

- [ ] 保持文章旧路径规则
- [ ] 保留文章 slug
- [ ] 检查历史文章链接是否仍可访问
- [ ] 如有必要增加重定向策略

## 16. 分阶段执行顺序

### 阶段 0：规划

- [ ] 冻结视觉方向
- [ ] 冻结首页结构
- [ ] 冻结技术路线

### 阶段 1：建站骨架

- [ ] Astro 初始化
- [ ] 基础依赖接入
- [ ] 基础目录与布局完成

### 阶段 2：设计系统

- [ ] 颜色、字体、间距完成
- [ ] 基础组件完成

### 阶段 3：内容迁移

- [ ] 文章迁移完成
- [ ] 页面迁移完成
- [ ] schema 校验通过

### 阶段 4：首页

- [ ] 首页第一版完成
- [ ] 首页响应式通过

### 阶段 5：文章页

- [ ] 文章页第一版完成
- [ ] 阅读体验增强完成

### 阶段 6：结构页

- [ ] 标签页完成
- [ ] 分类页完成
- [ ] 系列页完成
- [ ] 项目页完成

### 阶段 7：搜索与评论

- [ ] 搜索完成
- [ ] giscus 完成
- [ ] Artalk 是否需要有结论

### 阶段 8：上线

- [ ] GitHub Pages 构建通过
- [ ] 线上验证通过
- [ ] 主分支切换完成

## 17. 上线前验收清单

- [ ] 首页不是全文流
- [ ] 首页具备卡片杂志感
- [ ] 文章页排版明显优于当前版本
- [ ] 搜索可用
- [ ] 评论可用
- [ ] 移动端可用
- [ ] RSS 可用
- [ ] Sitemap 可用
- [ ] GitHub Pages 可稳定部署
- [ ] 旧文章链接可访问

## 18. 第一阶段最小可交付版本

如果要控制复杂度，建议第一阶段只交付以下内容：

- [ ] Astro 站点骨架
- [ ] 首页第一版
- [ ] 文章页第一版
- [ ] 旧文章迁移
- [ ] Pagefind 搜索
- [ ] giscus 评论
- [ ] GitHub Pages 部署

这意味着第一阶段先不做：

- [ ] Artalk
- [ ] 复杂动画
- [ ] 过多专题页
- [ ] 复杂后台能力

## 19. 建议下一步

从以下顺序开始执行：

1. [ ] 创建 `feature/astro-redesign`
2. [ ] 新建 `site-v2/`
3. [ ] 初始化 Astro + Tailwind + MDX
4. [ ] 建立内容集合 schema
5. [ ] 迁移 1 到 2 篇文章做样板
6. [ ] 先完成首页和文章页样板
7. [ ] 接入搜索
8. [ ] 接入 giscus
9. [ ] 再批量迁移剩余内容
