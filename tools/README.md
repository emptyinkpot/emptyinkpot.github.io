# 工具目录索引

`tools/` 是当前仓库的脚本与自动化入口，承接校验、公开更新日志生成，以及后续内容迁移和内容治理扩展能力。

## 当前脚本

- `tools/new-update-entry.mjs`：生成公开更新日志条目草稿
- `tools/validate-update-log.mjs`：校验 `public-data/updates/index.md` 的结构与字段（兼容历史路径）
- `tools/validate-content-governance.mjs`：校验现行内容层的字段、链接兼容、RSS 与搜索接线
- `tools/validate-repo-governance.mjs`：校验工程文档路径、历史边界与仓库治理基线

## 当前约定

- 当前仓库不再保留仅含 `README.md` 的工具占位目录
- 若后续确实需要拆分子模块，应在产生实际脚本或可执行能力时再建立对应目录
- 在此之前，现行工具统一收口在 `tools/` 根层

## 使用约定

- 运行统一检查时，优先使用根目录 `npm run check`
- 新的仓库级脚本统一放在 `tools/`，不要继续放回 `scripts/`
- 与历史 Hexo 相关的说明进入 `docs/historical/` 或 `docs/governance/`
- 与现行站点运行相关的实现进入 `apps/web/`
