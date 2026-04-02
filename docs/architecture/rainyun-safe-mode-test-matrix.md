# Rainyun Safe Mode 可测试行为矩阵（Day 6）

更新时间：2026-03-31

关联文档：

- `docs/plans/rainyun-topic-13009-integration-plan.md`
- `docs/architecture/rainyun-backend-api-contract.md`
- `docs/templates/rainyun-safe-mode-regression-template.md`

## 1. 目标

将 Safe Mode 的状态迁移、接口分支和前端表现转成可执行测试矩阵，作为 Day 6 的联调与回归基线。

## 2. 测试前置条件

- API 前缀：`/api/admin/v1`
- 鉴权：`Authorization: Bearer <token>`，且具备 `safe_mode:read` 与 `safe_mode:write`
- 写请求统一带 `Idempotency-Key`
- 高风险切换（`level=3`）带 `X-High-Risk-Confirmed: true`

## 3. 状态迁移矩阵

| 编号 | 初始 level | 目标 level | 是否允许 | 预期结果 | 关键断言 |
| --- | --- | --- | --- | --- | --- |
| SM-T01 | 0 | 1 | 是 | `200 OK` | 联系方式/外链隐藏 |
| SM-T02 | 0 | 2 | 是 | `200 OK` | 页面切到只读维护页 |
| SM-T03 | 0 | 3 | 是 | `200 OK` | 全站公告显示，交互组件停用 |
| SM-T04 | 1 | 0 | 是 | `200 OK` | 恢复正常模式，入口恢复 |
| SM-T05 | 1 | 2 | 是 | `200 OK` | 直接升级到只读维护页 |
| SM-T06 | 1 | 3 | 是 | `200 OK` | 进入高风险模式 |
| SM-T07 | 2 | 1 | 是 | `200 OK` | 从只读模式降级到轻度隐藏 |
| SM-T08 | 2 | 0 | 是 | `200 OK` | 退出 Safe Mode |
| SM-T09 | 2 | 3 | 是 | `200 OK` | 升级到高风险模式 |
| SM-T10 | 3 | 2 | 是 | `200 OK` | 从高风险降级到只读模式 |
| SM-T11 | 3 | 1 | 是 | `200 OK` | 从高风险降级到轻度隐藏 |
| SM-T12 | 3 | 0 | 是 | `200 OK` | 从高风险恢复正常 |

## 4. 接口行为矩阵

| 编号 | 场景 | 请求 | 预期 |
| --- | --- | --- | --- |
| SM-A01 | 读取状态 | `GET /safe-mode` | `200`，返回 `data.level` 与 `activatedAt` |
| SM-A02 | 正常设置 | `POST /safe-mode` | `200`，返回最新状态 |
| SM-A03 | 缺少 reason | `POST /safe-mode` | `422`，`VALIDATION_ERROR` |
| SM-A04 | 缺少 ticket | `POST /safe-mode` | `422`，`VALIDATION_ERROR` |
| SM-A05 | level=3 无二次确认 | `POST /safe-mode` | `403` 或 `422`，拒绝高风险切换 |
| SM-A06 | 相同 key + 相同 body | 重放请求 | `200`，返回首次结果 |
| SM-A07 | 相同 key + 不同 body | 重放请求 | `409`，`IDEMPOTENCY_KEY_REUSED` |
| SM-A08 | 高频切换超阈值 | 连续写入 | `409`，`SAFE_MODE_TRANSITION_BLOCKED` |
| SM-A09 | 回滚成功 | `POST /safe-mode/rollback` | `200`，状态回到目标事件前 |
| SM-A10 | 回滚目标不存在 | `POST /safe-mode/rollback` | `404` |
| SM-A11 | 回滚目标不连续 | `POST /safe-mode/rollback` | `409`，`SAFE_MODE_ROLLBACK_NOT_ALLOWED` |
| SM-A12 | 读取审计 | `GET /audit-events` | `200`，含 `before/after/requestId` |

## 5. 前端行为矩阵

| 编号 | level | 页面行为 | 校验点 |
| --- | --- | --- | --- |
| SM-UI01 | 0 | 正常页面 | 评论、搜索、表单可用 |
| SM-UI02 | 1 | 轻度降级 | 联系方式与外链隐藏 |
| SM-UI03 | 2 | 只读维护页 | 公告可见，互动入口不可操作 |
| SM-UI04 | 3 | 全站应急公告 | 评论、搜索、表单全部停用 |
| SM-UI05 | 3 -> 1 | 降级恢复 | 高风险公告消失，仅保留轻度限制 |
| SM-UI06 | 1 -> 0 | 完整恢复 | 所有受限入口恢复可用 |

## 6. 回归执行顺序（建议）

1. 先执行接口基础项：`SM-A01` 到 `SM-A05`
2. 再执行幂等与频控：`SM-A06` 到 `SM-A08`
3. 再执行回滚分支：`SM-A09` 到 `SM-A11`
4. 最后执行前端映射：`SM-UI01` 到 `SM-UI06`
5. 结束时执行审计抽样：`SM-A12`

## 7. 通过标准

- 状态迁移矩阵 12 项全部通过
- 接口行为矩阵关键项（`SM-A03/A07/A08/A09/A11`）全部通过
- 前端行为矩阵 6 项全部通过
- 每次写操作都能在审计日志中按 `requestId` 追溯
