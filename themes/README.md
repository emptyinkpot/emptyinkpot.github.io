# Hexo 历史主题层入口

`themes/` 是仓库保留的 Hexo 历史主题层，不再承担当前站点的正式界面开发职责。

## 当前子目录

- `themes/landscape/`：Hexo 时期主题模板与样式资源

## 使用约定

- 现行界面改动统一进入 `site-v2/src/components/`、`site-v2/src/layouts/` 与 `site-v2/src/styles/`
- 不要继续把样式或模板修改落到 `themes/landscape/`
- 需要确认边界时，先看 `docs/governance/historical-assets-boundary.md`
- 需要查看本目录的详细说明时，见 `docs/historical/themes-boundary.md`
