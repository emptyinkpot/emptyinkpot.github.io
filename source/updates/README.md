# 公开更新日志入口

`source/updates/` 用于承接当前仓库的公开更新日志真源。

## 当前内容

- `source/updates/index.md`：公开更新日志主文件

## 使用约定

- 对用户可感知的公开变化，继续先写入 `source/updates/index.md`
- 站点侧由 `site-v2/src/pages/updates.astro` 负责展示这些公开条目
- 字段规范与维护流程以 `docs/maintenance/update-log-spec.md` 为准
- 需要生成草稿时，可使用 `tools/new-update-entry.mjs`
