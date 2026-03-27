# 维护目录

更新时间：2026-03-27

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
- `docs/templates/update-log-entry.md`
  - 公开更新日志的标准模板

## 配套自动化命令

```bash
npm run new:update -- --title "更新标题" --dry-run
npm run check:updates
```

## 维护原则

1. 公开变化进 `source/updates/index.md`
2. 过程推进进 `docs/maintenance/astro-redesign-execution-log.md`
3. 范围和阶段状态进 `docs/astro-blog-redesign-checklist.md`
4. 任何外显更新都要有验证记录
