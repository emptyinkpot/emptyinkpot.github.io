# 治理文档索引

`docs/governance/` 用于承接仓库治理规则、迁移状态、边界约束与长期维护基线。

## 当前文档

- `docs/governance/content-migration-status.md`：历史内容到现行内容层的迁移状态表
- `docs/governance/historical-assets-boundary.md`：现行层与 Hexo 历史层的总边界说明

## 使用顺序

1. 先看 `docs/governance/historical-assets-boundary.md`，明确哪些目录仍是正式职责、哪些只是历史资产
2. 涉及文章与页面迁移时，再看 `docs/governance/content-migration-status.md`
3. 需要执行层记录时，转到 `docs/maintenance/astro-redesign-execution-log.md`
4. 需要总体路线时，转到 `docs/plans/update-plan.md`

## 使用约定

- 新的仓库治理规则优先收录到 `docs/governance/`
- 与过程记录相关的内容进入 `docs/maintenance/`
- 与实施方案、执行清单相关的内容进入 `docs/architecture/`
- 与历史目录逐项说明相关的内容进入 `docs/historical/`
