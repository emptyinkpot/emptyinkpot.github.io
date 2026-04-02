# 维护目录

更新时间：2026-03-31

这个目录用于承接博客维护过程中的“过程治理”信息，重点解决 4 件事：

- 可追溯：知道改了什么、为什么改、对应哪次提交
- 可约束：记录格式统一，不依赖临时发挥
- 可自动化：新增与校验有命令可跑
- 信息优质：公开日志、内部执行记录和执行清单彼此能对上

## 目录说明

- `docs/maintenance/update-log-spec.md`
  - 更新日志治理规范
  - 说明哪些信息必填、什么时候更新、如何保证质量
- `docs/maintenance/astro-redesign-execution-log.md`
  - Astro 重构过程中的内部执行记录
  - 用来承接阶段状态、完成项、验证结果与下一步
- `docs/maintenance/pages-deploy-troubleshooting-2026-03-31.md`
  - GitHub Pages 发布排查记录（案例沉淀）
  - 用来承接“已推送但用户感知未更新”类问题的模块化排查流程（含决策树与复盘模板）
- `docs/architecture/astro-blog-redesign-checklist.md`
  - 当前重构执行清单
  - 用来承接范围、阶段状态与待办
- `docs/templates/update-log-entry.md`
  - 公开更新日志的标准模板

## 配套自动化命令

```bash
npm run new:update -- --title "更新标题" --dry-run
npm run check:updates
```

## 维护原则

1. 当前公开变化写入 `public-data/updates/index.md`，`apps/web/src/pages/updates.astro` 负责同步展示现有公开条目
2. 过程推进进 `docs/maintenance/astro-redesign-execution-log.md`
3. 范围和阶段状态进 `docs/architecture/astro-blog-redesign-checklist.md`
4. 任何外显更新都要有验证记录
5. 更新日志脚本与页面只认 `public-data/updates/index.md`，不再保留旧入口回退
