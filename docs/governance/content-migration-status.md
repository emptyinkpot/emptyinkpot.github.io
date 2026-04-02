# Astro 内容状态表

更新时间：2026-04-02

## 1. 文档目的

这份状态表用于明确当前仓库里哪些内容已经进入 Astro 正式内容层，并作为现行发布真源持续维护。

它服务于以下治理目标：

- 明确 `apps/web/src/content/` 是唯一现行内容源
- 避免后续继续引入非正式内容真源
- 为内容治理与校验脚本提供基础数据

## 2. 判定规则

- `现行`：内容已经进入 `apps/web/src/content/`，后续更新只允许在 Astro 内容源中进行
- `专题`：按长期内容资产管理
- `记录`：按阶段性记录或案例内容管理

## 3. 内容状态

| Astro 现行文件 | 当前状态 | 内容范围 | 维护说明 |
| --- | --- | --- | --- |
| `apps/web/src/content/posts/welcome.md` | 现行 | 专题 | 站点欢迎与首页引导文章 |
| `apps/web/src/content/posts/hexo-blog-principle-and-setup.md` | 现行 | 专题 | 保留建站教学语境，但只维护 Astro 文件 |
| `apps/web/src/content/posts/hexo-source-posts-publish-flow.md` | 现行 | 专题 | 保留 Hexo 历史教学语境，但只维护 Astro 文件 |
| `apps/web/src/content/posts/openclaw-extensions-migration-and-ai-governance.md` | 现行 | 专题 | OpenClaw 工程治理内容 |
| `apps/web/src/content/posts/openclaw-ui-navigation-and-entry-guide.md` | 现行 | 专题 | OpenClaw 导航与入口内容 |
| `apps/web/src/content/posts/openclaw-gateway-start-stop-architecture.md` | 现行 | 专题 | OpenClaw 网关启停与运行态说明 |
| `apps/web/src/content/posts/openclaw-startup-retrospective-and-required-checklist.md` | 现行 | 记录 | OpenClaw 启动复盘与必备配置清单 |
| `apps/web/src/content/posts/openclaw-engineering-governance-startup-and-navigation-overview.md` | 现行 | 专题 | OpenClaw 总稿与统一导航 |
| `apps/web/src/content/posts/roo-code-vscode-migration-and-usage-guide.md` | 现行 | 专题 | Roo Code 与 VS Code 迁移使用说明 |
| `apps/web/src/content/posts/roo-code-repair-notes-2026-03-31.md` | 现行 | 记录 | Roo Code 修复记录 |
| `apps/web/src/content/posts/roo-and-codex-apikey-and-local-configuration-guide.md` | 现行 | 专题 | Roo 与 Codex 配置真源说明 |
| `apps/web/src/content/posts/vscode-roo-codex-local-retrieval-index.md` | 现行 | 专题 | VS Code 与本地检索结构索引 |
| `apps/web/src/content/posts/roo-codex-vscode-local-operations-overview.md` | 现行 | 专题 | Roo、Codex 与 VS Code 本地运维总稿 |
| `apps/web/src/content/posts/database-api-plan.md` | 现行 | 专题 | 数据库 API 架构方案 |
| `apps/web/src/content/posts/engineering-lessons-learned.md` | 现行 | 记录 | 排障与工程经验收束 |
| `apps/web/src/content/posts/blog-building-and-hexo-to-astro-migration-overview.md` | 现行 | 专题 | 建站与迁移总稿 |
| `apps/web/src/content/posts/通用文件与模块开发规范.md` | 现行 | 专题 | 模块化规范基线，以 Astro 文件为准 |
| `apps/web/src/content/posts/astro-blog-migration-complete-guide.md` | 现行 | 专题 | 单站点 Astro 迁移说明 |
| `apps/web/src/content/posts/rainyun-topic-13009-integration-case.md` | 现行 | 记录 | 业务专题集成案例 |

## 4. 当前结论

- `apps/web/src/content/posts/` 已经承接当前公开文章内容
- 后续新增与维护一律只在 Astro 内容层进行
- 仓库治理脚本会直接校验 Astro 正式内容文件是否存在

## 5. 后续执行规则

1. 新文章一律创建在 `apps/web/src/content/` 下
2. 已列入本表的内容，只允许维护 Astro 文件
3. 新增内容进入正式目录前，应先确认其内容范围与维护语义
4. 后续内容治理脚本优先校验本表中的 Astro 正式内容文件是否完整

## 6. 与仓库结构的关系

- 现行内容事实源：`apps/web/src/content/`
- 规划基线：`docs/plans/update-plan.md`
- 执行日志：`docs/maintenance/astro-redesign-execution-log.md`
- 执行清单：`docs/architecture/astro-blog-redesign-checklist.md`

## 7. 下一步建议

- 持续补充内容范围与维护语义说明
- 后续可补内容校验脚本，让状态表可以被自动检查
- 如需新增 `pages`、`notes`、`projects` 状态表，可沿用相同结构
