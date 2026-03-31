# themes/ 目录边界说明

更新时间：2026-03-30

`themes/` 目录是当前仓库保留的 Hexo 历史主题层，不再承担现行站点的界面实现职责。

## 当前定位

- 只作为历史主题资产归档
- 不再参与 Astro 单站点的正式构建与发布
- 不再作为当前界面迭代的修改入口

## 当前内容

- `landscape/`：Hexo 时期使用过的主题模板、样式与脚本资源

## 使用规则

1. 当前界面修改统一进入 `site-v2/src/components/`、`site-v2/src/layouts/`、`site-v2/src/styles/`
2. 不再向 `themes/landscape/` 增加现行功能
3. 如需追溯旧主题行为，仅作为历史参考使用
4. 如后续需要进一步收敛，优先通过 `docs/governance/historical-assets-boundary.md` 约束，而不是继续扩展主题目录

## 相关文档

- `docs/plans/update-plan.md`
- `docs/governance/historical-assets-boundary.md`
- `docs/historical/source-boundary.md`
