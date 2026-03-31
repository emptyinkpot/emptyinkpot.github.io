# 模板文档索引

`docs/templates/` 用于承接可复用的工程文档模板，帮助仓库维护记录保持一致格式。

## 当前文档

- `docs/templates/update-log-entry.md`：公开更新日志条目模板

## 使用顺序

1. 需要编写公开更新日志时，先参考 `docs/templates/update-log-entry.md`
2. 再结合 `docs/maintenance/update-log-spec.md` 确认字段和质量要求
3. 生成草稿时可配合 `tools/new-update-entry.mjs`

## 使用约定

- 模板只定义格式与字段，不承担最终记录职责
- 最终公开更新写入 `public-data/updates/index.md`
- 维护规范与过程说明仍以 `docs/maintenance/` 为准
