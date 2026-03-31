# source/ 目录边界说明

更新时间：2026-03-31

`source/` 目录是当前仓库保留的 Hexo 历史内容层，不再作为正式站点的现行开发入口。

## 当前定位

- 只保留为历史归档与迁移参考
- 不再参与 `https://emptyinkpot.github.io/` 的正式发布
- 不再作为新文章、页面或资源的默认写入位置

## 子目录含义

- `_posts/`：Hexo 历史文章源文件
- `about/`：Hexo 历史独立页面
- `images/`：Hexo 历史图片资源
- `updates/`：公开维护日志历史兼容入口（默认真源已迁移）

## 使用规则

1. 新增内容统一进入 `apps/web/src/content/`
2. 如需处理历史文章，先检查 `docs/governance/content-migration-status.md`
3. 不要把 `source/` 中的修改视为现行发布修改
4. 如果某项历史内容仍需保留，优先补充映射说明，而不是恢复双轨维护
5. `source/updates/index.md` 当前仅作为迁移兼容读取入口，默认真源已迁移到 `public-data/updates/index.md`，现行展示页为 `apps/web/src/pages/updates.astro`

## 相关文档

- `docs/plans/update-plan.md`
- `docs/governance/content-migration-status.md`
- `docs/governance/historical-assets-boundary.md`
- `docs/maintenance/update-log-spec.md`
