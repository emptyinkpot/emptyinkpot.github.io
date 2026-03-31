# 工具目录索引

`tools/` 是当前仓库的脚本与自动化入口，承接校验、公开更新日志生成，以及后续内容迁移和内容治理扩展能力。

## 当前脚本

- `tools/new-update-entry.mjs`：生成公开更新日志条目草稿
- `tools/validate-update-log.mjs`：校验 `public-data/updates/index.md` 的结构与字段（兼容历史路径）
- `tools/validate-content-governance.mjs`：校验现行内容层的字段、链接兼容、RSS 与搜索接线
- `tools/validate-repo-governance.mjs`：校验工程文档路径、历史边界与仓库治理基线

## 预留目录

- `tools/content-migration/README.md`：内容迁移与映射工具入口说明
- `tools/content-validation/README.md`：内容治理子模块拆分入口说明

## 使用约定

- 运行统一检查时，优先使用根目录 `npm run check`
- 新的仓库级脚本统一放在 `tools/`，不要继续放回 `scripts/`
- 与历史 Hexo 相关的说明进入 `docs/historical/` 或 `docs/governance/`
- 与现行站点运行相关的实现进入 `apps/web/`
