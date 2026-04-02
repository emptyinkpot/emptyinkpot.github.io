# 历史资产边界说明

更新时间：2026-03-31

## 1. 文档目的

这份文档用于记录仓库中 Hexo 历史层的清理边界与删除结论，避免它们继续被误认为现行开发入口。

当前仓库已经完成单站点收敛：

- 对外正式站点只由 `apps/web/` 生成（`site-v2/` 为历史阶段命名）
- 现行内容事实源只在 `apps/web/src/content/`
- Hexo 历史目录和配置已于 2026-04-02 从仓库移除，仅保留文档记录

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

以下目录或文件已经不再承担正式发布职责，且已从仓库删除：

- `source/`
- `themes/`
- `_config.yml`
- `_config.landscape.yml`
- `scaffolds/`
- `scripts/`

## 3. 历史层中各目录的最终含义

### 3.1 `source/`

该目录已于 `2026-04-02` 删除。

删除前曾承载：

- `source/_posts/`：历史文章源文件
- `source/about/`：历史独立页面
- `source/images/`：历史图片资源
- `source/updates/`：更新日志兼容入口

规则：

- 禁止把新文章继续写入 `source/_posts/`
- 禁止把 `source/about/` 当作现行独立页面入口
- 如果历史文章需要继续维护，先检查 `docs/governance/content-migration-status.md` 中是否已经存在 Astro 对应项

### 3.2 `themes/`

该目录已于 `2026-04-02` 删除。

- `themes/landscape/` 曾承载 Hexo 时期主题模板与资源

规则：

- 禁止继续把界面修改落到 `themes/landscape/`
- 任何现行界面调整都必须进入 `apps/web/src/components/`、`apps/web/src/layouts/` 或 `apps/web/src/styles/`

### 3.3 `_config.yml` 与 `_config.landscape.yml`

这两份配置已于 `2026-04-02` 删除。

规则：

- 不再作为正式站点配置真源
- 现行站点配置以 `apps/web/astro.config.mjs` 和 Astro 代码侧配置为准

### 3.4 `scaffolds/` 与 `scripts/`

这两部分已于 `2026-04-02` 删除。

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
3. 继续把残留文档口径统一到 Astro 单一主链路
4. 如无必要，不再引入新的历史兼容目录

## 6. 与其他文档的关系

- 总规划基线：`docs/plans/update-plan.md`
- 内容迁移状态：`docs/governance/content-migration-status.md`
- 执行日志：`docs/maintenance/astro-redesign-execution-log.md`
- 执行清单：`docs/architecture/astro-blog-redesign-checklist.md`
