# 架构文档索引

`docs/architecture/` 用于承接当前站点的架构方案、实施路线与执行清单。

## 当前文档

- `docs/architecture/astro-blog-redesign-plan.md`：整体技术路线、信息架构、阶段划分与实施建议
- `docs/architecture/astro-blog-redesign-checklist.md`：执行清单、阶段状态与验收项
- `docs/architecture/rainyun-backend-api-contract.md`：Rainyun 专题后台接口契约（API、鉴权、审计）
- `docs/architecture/rainyun-safe-mode-test-matrix.md`：Safe Mode 可测试行为矩阵（状态迁移、接口分支、前端映射）

## 使用顺序

1. 先读 `docs/architecture/astro-blog-redesign-plan.md`，确认整体方案与目标结构
2. 再读 `docs/architecture/astro-blog-redesign-checklist.md`，确认当前执行项与阶段状态
3. 涉及后台能力实现时，先看 `docs/architecture/rainyun-backend-api-contract.md`
4. 涉及联调与回归时，补充查看 `docs/architecture/rainyun-safe-mode-test-matrix.md`
5. 需要总规划时，补充查看 `docs/plans/README.md`
6. 需要执行记录时，补充查看 `docs/maintenance/astro-redesign-execution-log.md`

## 使用约定

- 新的实施方案、架构设计与结构性决策优先进入 `docs/architecture/`
- 过程记录不要写回这里，改放入 `docs/maintenance/`
- 仓库级治理规则不要写回这里，改放入 `docs/governance/`
