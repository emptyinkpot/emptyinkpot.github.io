# Rainyun 专题后台接口契约（API / 鉴权 / 审计）

更新时间：2026-03-31

关联计划：`docs/plans/rainyun-topic-13009-integration-plan.md`

## 1. 文档目标

本文定义“案例整合专题”所需的最小后台接口契约，用于支撑：

- 站点配置读取与编辑
- 应急开关（Safe Mode）状态切换
- 操作留痕与审计追溯

说明：当前仓库仍以静态站发布为主，本契约是后端实现前置设计稿，可先以 Mock/本地 JSON/Serverless 形式验证，再逐步替换为正式服务。

## 2. 设计边界

- 接口前缀：`/api/admin/v1`
- 数据格式：`application/json; charset=utf-8`
- 时间格式：ISO8601（UTC），例如 `2026-03-31T14:20:00Z`
- 幂等策略：写接口支持 `Idempotency-Key`
- 版本策略：路径版本化（`v1`），破坏性变更升版本

## 3. 领域对象

### 3.1 SiteConfig

```json
{
  "siteTitle": "Empty Ink Pot",
  "tagline": "Write less, think deeper.",
  "theme": {
    "accent": "#0ea5e9",
    "heroStyle": "minimal"
  },
  "contacts": {
    "email": "owner@example.com",
    "github": "https://github.com/emptyinkpot"
  },
  "updatedAt": "2026-03-31T14:20:00Z",
  "version": 12
}
```

### 3.2 SafeModeState

```json
{
  "level": 0,
  "reason": "",
  "activatedAt": null,
  "activatedBy": null,
  "expiresAt": null,
  "ticket": null
}
```

`level` 定义：

- `0`：关闭（正常模式）
- `1`：隐藏敏感入口（联系方式/外链）
- `2`：只读维护页（暂停互动能力）
- `3`：全站应急公告 + 暂停交互组件

### 3.3 AuditEvent

```json
{
  "id": "evt_01JQF7X8T8JY8Q0XQY4J0V3Q4C",
  "actor": "admin:azzzw",
  "action": "safe_mode.set",
  "resource": "safe_mode",
  "before": { "level": 0 },
  "after": { "level": 2 },
  "reason": "abuse traffic spike",
  "requestId": "req_6f6f3d6a",
  "createdAt": "2026-03-31T14:22:11Z"
}
```

## 4. 鉴权与授权

## 4.1 鉴权方案（v1）

- Header：`Authorization: Bearer <token>`
- Token 最小要求：
  - 有效期（exp）
  - 签发方（iss）
  - 主题（sub，唯一管理员标识）
- 推荐先使用单管理员 Token；后续可扩展 RBAC。

## 4.2 授权范围（Scopes）

- `config:read`
- `config:write`
- `safe_mode:read`
- `safe_mode:write`
- `audit:read`

缺少 scope 返回 `403 FORBIDDEN`。

## 4.3 安全控制

- 强制 HTTPS
- 敏感写操作要求 `X-Confirm-Action: true`
- 对 `safe_mode:write` 增加频率限制（如 1 分钟最多 3 次）
- 所有写请求写入审计日志，不允许静默变更

## 5. API 契约

## 5.1 读取站点配置

- `GET /api/admin/v1/config`
- Scope：`config:read`

响应 `200`：

```json
{
  "data": {
    "siteTitle": "Empty Ink Pot",
    "tagline": "Write less, think deeper.",
    "theme": { "accent": "#0ea5e9", "heroStyle": "minimal" },
    "contacts": {
      "email": "owner@example.com",
      "github": "https://github.com/emptyinkpot"
    },
    "updatedAt": "2026-03-31T14:20:00Z",
    "version": 12
  }
}
```

## 5.2 更新站点配置

- `PUT /api/admin/v1/config`
- Scope：`config:write`
- Headers：
  - `If-Match: "12"`（乐观锁版本）
  - `Idempotency-Key: <uuid>`

请求体：

```json
{
  "siteTitle": "Empty Ink Pot",
  "tagline": "Write less, think deeper.",
  "theme": { "accent": "#22c55e", "heroStyle": "minimal" },
  "contacts": {
    "email": "owner@example.com",
    "github": "https://github.com/emptyinkpot"
  },
  "reason": "refresh spring campaign"
}
```

响应：

- `200 OK`：更新成功并返回新版本
- `409 CONFLICT`：版本冲突
- `422 UNPROCESSABLE_ENTITY`：字段校验失败

## 5.3 读取应急开关状态

- `GET /api/admin/v1/safe-mode`
- Scope：`safe_mode:read`

响应 `200`：

```json
{
  "data": {
    "level": 1,
    "reason": "temporarily hide contact links",
    "activatedAt": "2026-03-31T14:22:11Z",
    "activatedBy": "admin:azzzw",
    "expiresAt": "2026-03-31T18:22:11Z",
    "ticket": "INC-2026-0331-01"
  }
}
```

## 5.4 设置应急开关状态

- `POST /api/admin/v1/safe-mode`
- Scope：`safe_mode:write`
- Headers：
  - `X-Confirm-Action: true`
  - `Idempotency-Key: <uuid>`

请求体：

```json
{
  "level": 2,
  "reason": "suspected abuse traffic",
  "ticket": "INC-2026-0331-01",
  "expiresAt": "2026-03-31T18:22:11Z"
}
```

约束：

- `reason` 必填，长度 8-200
- `ticket` 必填，格式 `INC-YYYY-NNNN` 或等价工单号
- `level=3` 需二次确认 Header：`X-High-Risk-Confirmed: true`

响应：

- `200 OK`：变更成功
- `400 BAD_REQUEST`：参数错误
- `403 FORBIDDEN`：无权限
- `409 CONFLICT`：重复冲突写入

Idempotency 语义：

- 相同 `Idempotency-Key` + 相同请求体：返回首次成功结果（`200`）
- 相同 `Idempotency-Key` + 不同请求体：返回 `409 CONFLICT`（`IDEMPOTENCY_KEY_REUSED`）

## 5.5 回滚到上一个 Safe Mode 状态

- `POST /api/admin/v1/safe-mode/rollback`
- Scope：`safe_mode:write`
- Headers：
  - `X-Confirm-Action: true`
  - `Idempotency-Key: <uuid>`

请求体：

```json
{
  "reason": "misclick recovery",
  "ticket": "INC-2026-0331-02",
  "targetEventId": "evt_01JQF7X8T8JY8Q0XQY4J0V3Q4C"
}
```

约束：

- `targetEventId` 必须指向一条可回滚的 `safe_mode.set` 审计事件
- 若目标事件与当前状态不连续，返回 `409 CONFLICT`

响应：

- `200 OK`：回滚成功并返回当前状态
- `404 NOT_FOUND`：目标事件不存在
- `409 CONFLICT`：状态不连续或重复回滚

## 5.6 查询审计日志

- `GET /api/admin/v1/audit-events?resource=safe_mode&limit=50&cursor=<cursor>`
- Scope：`audit:read`

响应 `200`：

```json
{
  "data": [
    {
      "id": "evt_01JQF7X8T8JY8Q0XQY4J0V3Q4C",
      "actor": "admin:azzzw",
      "action": "safe_mode.set",
      "resource": "safe_mode",
      "before": { "level": 0 },
      "after": { "level": 2 },
      "reason": "suspected abuse traffic",
      "requestId": "req_6f6f3d6a",
      "createdAt": "2026-03-31T14:22:11Z"
    }
  ],
  "nextCursor": "eyJpZCI6ImV2dF8wMUpRRiJ9"
}
```

## 6. 错误码约定

统一错误结构：

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "reason is required",
    "details": {
      "field": "reason"
    },
    "requestId": "req_6f6f3d6a"
  }
}
```

错误码表：

- `UNAUTHORIZED`（401）
- `FORBIDDEN`（403）
- `VALIDATION_ERROR`（422）
- `VERSION_CONFLICT`（409）
- `IDEMPOTENCY_KEY_REUSED`（409）
- `SAFE_MODE_TRANSITION_BLOCKED`（409）
- `SAFE_MODE_ROLLBACK_NOT_ALLOWED`（409）
- `RATE_LIMITED`（429）
- `INTERNAL_ERROR`（500）

## 7. 审计规范

## 7.1 必记字段

- `actor`：操作者 ID
- `action`：动作名（如 `config.update`、`safe_mode.set`）
- `resource`：资源名
- `before` / `after`：关键字段变更快照
- `reason`：变更原因
- `requestId`：请求追踪 ID
- `createdAt`：事件时间

## 7.2 不可变更要求

- 审计记录为追加写，不可原地覆盖
- 禁止删除审计记录；如需合规清理，保留 hash 与索引痕迹

## 8. 前后端联调约定

- 前端在 `apps/web/` 通过统一客户端封装访问接口
- `safe_mode` 状态应在页面加载时可读取，并驱动 UI 降级
- 变更成功后前端必须展示操作回执（含 `requestId`）

## 8.1 Safe Mode 状态机与 UI 映射

允许迁移：

- `0 -> 1`、`0 -> 2`、`0 -> 3`
- `1 -> 0`、`1 -> 2`、`1 -> 3`
- `2 -> 0`、`2 -> 1`、`2 -> 3`
- `3 -> 2`、`3 -> 1`、`3 -> 0`

阻断规则：

- 若 5 分钟内切换次数超过阈值（建议 6 次），阻断并返回 `SAFE_MODE_TRANSITION_BLOCKED`
- 处于 `3` 时，提升/平移到 `3` 的重复请求默认幂等返回，不重复记高风险事件

前端 UI 映射：

- `level=1`：隐藏联系方式与外链按钮，正文保持可读
- `level=2`：切换只读维护页，保留公告与基础导航
- `level=3`：展示全站应急公告，暂停评论、搜索、表单等交互组件

## 8.2 异常场景处理

- 误触恢复：优先调用 `safe-mode/rollback`，并强制填写恢复原因
- 回滚失败：前端提示最近可回滚事件列表，避免盲目重试
- 重复提交：前端对写请求生成稳定 `Idempotency-Key` 并在 60 秒内复用
- 网络超时：允许前端按相同 `Idempotency-Key` 重试一次，避免双写

## 9. 最小验收标准（P2）

- 能读取/更新 `config` 且具备版本冲突保护
- 能读取/设置 `safe_mode` 且满足高风险二次确认
- 能执行 `safe-mode/rollback` 且保留完整审计链路
- 任意写操作都可在 `audit-events` 中追溯
- 未授权请求被正确拒绝并返回标准错误体

## 10. 后续演进建议

- 引入 RBAC（管理员、审计员、只读运维）
- 为 `safe_mode` 增加自动恢复任务与到期提醒
- 增加签名审计链，提升防篡改能力