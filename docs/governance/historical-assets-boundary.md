# 历史资产边界说明

更新时间：2026-03-31

## 1. 文档目的

这份文档用于给当前仓库中的 Hexo 历史层划定清晰边界，避免它们继续被误认为现行开发入口。

当前仓库已经完成单站点收敛：

- 对外正式站点只由 `apps/web/` 生成（`site-v2/` 为历史阶段命名）
- 现行内容事实源只在 `apps/web/src/content/`
- 根目录中的 Hexo 相关目录只保留为历史资产、迁移参考和兼容档案

## 2. 现行层与历史层的边界

### 2.1 现行层

以下目录仍然承担正式职责：

- `apps/web/`
- `.github/workflows/pages.yml`
- `docs/`
- `tools/`
- `package.json`
- `README.md`

### 2.2 历史层

以下目录或文件不再承担正式发布职责：

- `source/`
- `themes/`
- `_config.yml`
- `_config.landscape.yml`
- `scaffolds/`
- `scripts/`

## 3. 历史层中各目录的当前含义

### 3.1 `source/`

当前只作为旧 Hexo 内容归档层使用。

已确认的子目录角色：

- `source/_posts/`：历史文章源文件归档
- `source/about/`：历史独立页面归档
- `source/images/`：历史图片资源归档
- `source/updates/`：历史兼容入口（默认写入真源已迁移到 `public-data/updates/`）

规则：

- 禁止把新文章继续写入 `source/_posts/`
- 禁止把 `source/about/` 当作现行独立页面入口
- 如果历史文章需要继续维护，先检查 `docs/governance/content-migration-status.md` 中是否已经存在 Astro 对应项

### 3.2 `themes/`

当前只保留旧 Hexo 主题实现与样式资产。

- `themes/landscape/`：Hexo 时期主题模板与资源

规则：

- 禁止继续把界面修改落到 `themes/landscape/`
- 任何现行界面调整都必须进入 `apps/web/src/components/`、`apps/web/src/layouts/` 或 `apps/web/src/styles/`

### 3.3 `_config.yml` 与 `_config.landscape.yml`

这两份配置只保留为 Hexo 历史配置档案。

规则：

- 不再作为正式站点配置真源
- 现行站点配置以 `apps/web/astro.config.mjs` 和 Astro 代码侧配置为准

### 3.4 `scaffolds/` 与 `scripts/`

这两部分仍然是 Hexo 时期的辅助结构。

规则：

- 仅保留以备历史追溯
- 后续如仍有必要保留，应通过 `docs/historical/` 中的边界文档说明用途
- 新的仓库级自动化能力统一进入 `tools/`

## 4. 当前允许的维护动作

对历史层目前只允许以下动作：

- 归档说明补充
- 与现行层的映射登记
- 为迁移或重定向提供参考
- 必要时做只读型修正，例如修正文档错字或增加历史标记

以下动作默认不允许：

- 在历史层新增正式功能
- 在历史层继续新增正式内容
- 让历史层重新进入正式发布链路
- 把现行问题修复落到 Hexo 结构里

## 5. 后续收敛建议

建议按以下顺序继续收敛：

1. 持续维护 `docs/governance/content-migration-status.md`
2. 逐步为历史文档补充“历史记录”标记
3. 当前暂不把 `source/`、`themes/`、`scaffolds/`、`scripts/` 整体迁入 `legacy/`，优先保持仓库根层级稳定
4. 等公开更新日志承载方式、历史入口映射与依赖精简策略进一步稳定后，再决定是否整体收口到独立历史目录

## 6. 与其他文档的关系

- 总规划基线：`docs/plans/update-plan.md`
- 内容迁移状态：`docs/governance/content-migration-status.md`
- 执行日志：`docs/maintenance/astro-redesign-execution-log.md`
- 执行清单：`docs/architecture/astro-blog-redesign-checklist.md`
