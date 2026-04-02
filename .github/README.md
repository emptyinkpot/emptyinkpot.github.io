# GitHub 自动化入口

`.github/` 用于承接仓库的 GitHub 平台自动化配置。

## 当前内容

- `.github/workflows/pages.yml`：当前 Astro 单站点的 GitHub Pages 发布流水线
- `.github/dependabot.yml`：依赖更新策略配置

## 使用约定

- 发布链路以 `.github/workflows/pages.yml` 为唯一正式入口
- 仓库结构与发布边界调整时，先同步检查 `docs/plans/update-plan.md` 与 `docs/governance/historical-assets-boundary.md`
- 修改工作流前，先确认根目录 `npm run check` 与 `site-v2` 构建链路保持一致
