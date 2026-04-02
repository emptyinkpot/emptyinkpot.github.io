# source/ 目录边界说明

更新时间：2026-03-31

`source/` 目录曾是仓库保留的 Hexo 历史内容层，已于 2026-04-02 删除。

## 当前定位

- 只保留为历史归档与迁移参考
- 不再参与 `https://emptyinkpot.github.io/` 的正式发布
- 不再作为新文章、页面或资源的默认写入位置

## 子目录含义

- `_posts/`：Hexo 历史文章源文件
- `about/`：Hexo 历史独立页面
- `images/`：Hexo 历史图片资源
- `updates/`：公开维护日志的历史兼容入口（删除前已完成真源迁移）

## 使用规则

1. 新增内容统一进入 `apps/web/src/content/`
2. 如需处理历史文章，先检查 `docs/governance/content-migration-status.md`
3. 不要再把历史 `source/` 结构视为现行发布入口
4. 如果某项历史内容仍需保留，优先补充映射说明，而不是恢复双轨维护
5. 更新日志真源已统一到 `public-data/updates/index.md`

## 相关文档

- `docs/plans/update-plan.md`
- `docs/governance/content-migration-status.md`
- `docs/governance/historical-assets-boundary.md`
- `docs/maintenance/update-log-spec.md`
