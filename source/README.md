# Hexo 历史内容层入口

`source/` 是仓库保留的 Hexo 历史内容层，不再作为当前站点的正式开发入口。

## 当前子目录

- `source/_posts/`：历史文章归档
- `source/about/`：历史独立页面归档
- `source/images/`：历史图片资源归档
- `source/updates/`：当前公开更新日志真源

## 使用约定

- 新内容统一进入 `site-v2/src/content/`
- 不要把 `source/` 中的修改视为现行站点修改
- 需要确认边界时，先看 `docs/governance/historical-assets-boundary.md`
- 需要查看本目录的详细说明时，见 `docs/historical/source-boundary.md`
