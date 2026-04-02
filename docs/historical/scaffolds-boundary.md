# Hexo scaffolds 历史说明

`scaffolds/` 是仓库保留的 Hexo 历史脚手架目录，不再承担当前站点的正式内容创建职责。

当前边界：

- 现行内容创建统一进入 `apps/web/src/content/`
- 不再使用 `hexo new` 作为正式写作入口
- 此目录仅保留作历史追溯与结构参考

如果后续需要新增仓库级脚本或模板，应优先放入 `tools/` 或 `docs/templates/`。
