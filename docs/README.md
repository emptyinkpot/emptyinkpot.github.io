# 工程文档索引

`docs/` 是当前仓库的工程文档统一入口，用来承载规划、架构、治理、维护记录、历史边界、模板与使用指南。

## 中心导航（先看这里）

- 规划中心：`docs/plans/update-plan.md`
- 执行中心：`docs/architecture/astro-blog-redesign-checklist.md`
- 治理中心：`docs/governance/README.md`
- 维护中心：`docs/maintenance/README.md`

## 快速入口

- 总规划：`docs/plans/README.md`
- 架构方案：`docs/architecture/astro-blog-redesign-plan.md`
- 执行清单：`docs/architecture/astro-blog-redesign-checklist.md`
- 治理目录：`docs/governance/README.md`
- 迁移状态：`docs/governance/content-migration-status.md`
- 历史边界：`docs/governance/historical-assets-boundary.md`
- 历史层索引：`docs/historical/README.md`
- 工具目录：`tools/README.md`
- 维护目录：`docs/maintenance/README.md`

## 分类目录

### `docs/plans/`

阶段计划、收敛路线与总规划。

- `docs/plans/README.md`
- `docs/plans/update-plan.md`

### `docs/architecture/`

站点架构方案、实施路线与执行清单。

- `docs/architecture/README.md`
- `docs/architecture/astro-blog-redesign-plan.md`
- `docs/architecture/astro-blog-redesign-checklist.md`

### `docs/governance/`

仓库治理、迁移状态、边界约束与长期维护规则。

- `docs/governance/README.md`
- `docs/governance/content-migration-status.md`
- `docs/governance/historical-assets-boundary.md`

### `docs/maintenance/`

维护说明、执行日志、更新日志规范与运行记录。

- `docs/maintenance/README.md`
- `docs/maintenance/astro-redesign-execution-log.md`
- `docs/maintenance/update-log-spec.md`
- `docs/maintenance/giscus-setup.md`

### `docs/historical/`

历史目录边界说明，专门解释旧 Hexo 资产的保留原因与使用限制。

- `docs/historical/README.md`
- `docs/historical/source-boundary.md`
- `docs/historical/themes-boundary.md`
- `docs/historical/scaffolds-boundary.md`
- `docs/historical/scripts-boundary.md`

### `tools/`

仓库级脚本、校验命令与后续自动化扩展入口。

- `tools/README.md`
- `tools/new-update-entry.mjs`
- `tools/validate-update-log.mjs`
- `tools/validate-content-governance.mjs`
- `tools/validate-repo-governance.mjs`

### `docs/guides/`

工具、编辑器与协作方式的使用指南。

- `docs/guides/README.md`

### `docs/templates/`

更新日志等文档模板。

- `docs/templates/README.md`
- `docs/templates/update-log-entry.md`

### `docs/archive/`

历史备份与归档文档。

- `docs/archive/README.md`

## 使用约定

- 新的工程文档优先进入 `docs/` 的对应分类目录
- 根目录与 `apps/web/` README 只保留入口信息，不再承载长篇工程说明
- 涉及历史 Hexo 结构时，先查 `docs/governance/historical-assets-boundary.md` 与 `docs/historical/`
- 涉及站点现行实现时，优先查 `apps/web/` 与 `docs/architecture/`
