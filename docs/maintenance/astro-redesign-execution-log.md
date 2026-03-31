# Astro 重构执行日志

更新时间：2026-03-31

关联文档：

- `docs/architecture/astro-blog-redesign-plan.md`
- `docs/architecture/astro-blog-redesign-checklist.md`
- `docs/maintenance/update-log-spec.md`
- `docs/plans/update-plan.md`
- `public-data/updates/index.md`

## 当前状态

- 当前策略：对外站点已经统一收敛到 `apps/web/`（由 `site-v2/` 过渡），根目录 Hexo 结构仅作为历史资产保留
- 当前阶段：单站点发布、内容迁移状态、历史边界说明与工程文档分类收拢已经建立基础闭环
- 当前重点：按 `docs/plans/update-plan.md` 的 P0/P1/P2 推进下一阶段治理，优先完成 P0 文档口径与导航一致性收口

## 2026-03-31 / 阶段 F-H 过渡兼容推进（`apps/web` 与公开更新真源切换）

- 状态：已完成
- 结果：
  - GitHub Pages workflow 已切换为构建并上传 `apps/web/dist`
  - 更新日志写入与校验脚本已切换到 `public-data/updates/index.md`，并保留 `source/updates/index.md` 兼容兜底
  - 站点侧更新日志读取已支持新旧路径候选，保障迁移期可读
  - 内容治理脚本已支持优先检查 `apps/web/`，未迁移场景回退 `site-v2/`
  - 文档入口已补齐新口径：`README.md`、`docs/README.md`、`docs/templates/README.md`
- 验证：
  - 已执行 `npm run check`
  - `check:updates`、`check:content`、`check:governance` 全部通过

## 2026-03-31 / 下一阶段规划落版（P0/P1/P2）

- 状态：已完成
- 结果：
  - 在 `docs/plans/update-plan.md` 增补“下一阶段规划（2026-03-31）”
  - 明确 P0（本周）、P1（下一轮）、P2（持续演进）的任务与完成标准
  - 将文档口径治理、文档导航治理、校验基线治理列为 P0 首批动作
- 验证：
  - 计划文档时间戳已更新为 `2026-03-31`
  - 规划项已覆盖“目标-动作-验收标准”三要素

## 已完成记录

### 2026-03-30 / 工程文档收拢到 `docs/` 分类目录

- 状态：已完成
- 结果：
  - 将架构、治理、指南、归档、历史边界、维护、计划、模板文档统一收拢到 `docs/` 分类目录
  - 将根目录 `README.md` 与 `site-v2/README.md` 精简为最小入口页
  - 修正 `tools/validate-repo-governance.mjs`、维护文档与文章中的新路径引用
  - 重写 `docs/governance/historical-assets-boundary.md`、`docs/historical/source-boundary.md`、`docs/historical/themes-boundary.md`、`docs/plans/update-plan.md` 以修复乱码并统一口径
- 验证：
  - 目录结构已与 `docs/` 分类方案对齐
  - 关键入口文档已收敛到最小说明
  - 新路径已切换到 `docs/architecture/`、`docs/governance/`、`docs/plans/` 等分类目录

### 2026-03-30 / 增加仓库治理校验并接入发布前检查

- 状态：已完成
- 结果：
  - 新增 `tools/validate-repo-governance.mjs`
  - 根目录新增 `npm run check:governance` 并并入 `npm run check`
  - Pages workflow 在构建前执行治理检查
  - 为 `scaffolds/` 与 `scripts/` 补齐历史边界说明
- 验证：
  - `npm run check` 已能串联治理检查
  - 发布链路已不再跳过仓库结构约束

### 2026-03-30 / 建立内容治理与接口预留说明

- 状态：已完成
- 结果：
  - 新增 `tools/validate-content-governance.mjs`
  - 新增 `tools/content-validation/README.md` 与 `tools/content-migration/README.md`
  - 将内容字段、链接兼容、RSS 与搜索相关检查并入 `npm run check:content`
- 验证：
  - 内容治理检查已接入统一检查入口
  - 迁移与内容校验的后续扩展位置已经明确

### 2026-03-30 / 为 `site-v2` 建立公开更新页同步入口

- 状态：已完成
- 结果：
  - 新增 `site-v2/src/lib/updateLog.ts`，直接读取 `source/updates/index.md`
  - 新增 `site-v2/src/pages/updates.astro`，在现行站点中展示公开更新日志
  - 在站点导航与页脚中增加 `Updates` 入口
  - 将同步策略写入 `docs/maintenance/update-log-spec.md` 与 `docs/maintenance/README.md`
- 验证：
  - `source/updates/index.md` 仍作为公开更新日志真源
  - 现行站点已可同步展示公开更新条目

### 2026-03-30 / 迁移 Astro 重构完整指南到现行内容层

- 状态：已完成
- 结果：
  - 新增 `site-v2/src/content/posts/astro-blog-migration-complete-guide.md`
  - 将原迁移复盘重写为单站点 Astro 口径
  - 在 `docs/governance/content-migration-status.md` 中登记为现行内容
- 验证：
  - 文章 front matter 已对齐当前 Astro 内容模型
  - 文章中的工程文档链接已切换到新的 `docs/` 分类目录

### 2026-03-30 / 单站点入口与公开口径收口

- 状态：已完成
- 结果：
  - 根目录脚本默认转发到 `site-v2/`
  - GitHub Pages workflow 改为只构建 Astro 并发布到 `https://emptyinkpot.github.io/`
  - 首页、文章列表、Hero、页脚与说明文档已统一为单站点口径
- 验证：
  - 配置、文档与公开页面不再把 `/site-v2/` 作为正式线上子路径
  - 发布入口、内容入口与文档入口已能对应到单一事实源

### 2026-03-27 / 补齐 `site-v2` 剩余文章迁移

- 状态：已完成
- 结果：
  - 将剩余 Hexo 文章迁移到 `site-v2/src/content/posts/`
  - 补齐 `description`、系列与内部链接
- 验证：
  - 迁移后内容已进入现行内容源
  - 文章页、系列页与站内路由可正常承载迁移后的内容

### 2026-03-27 / 迁移 About 页面到 `site-v2`

- 状态：已完成
- 结果：
  - 将历史 About 页面迁移到 `site-v2/src/pages/about.astro`
  - 保留原有语义并补充 Astro 重构背景
- 验证：
  - About 页面已进入现行路由 `/about/`

### 2026-03-27 / giscus 准备与配置接入

- 状态：已完成
- 结果：
  - 建立 `site-v2/.env.example`
  - 接入评论组件并补齐 `docs/maintenance/giscus-setup.md`
- 验证：
  - 评论配置说明与环境变量入口已经就位

### 2026-03-27 / 重构方案与执行清单入库

- 状态：已完成
- 结果：
  - 建立架构方案文档与执行清单
  - 明确技术路线、阶段目标与最小可交付范围
- 验证：
  - 后续重构已按该方案与清单持续推进

## 本轮补充的治理项

- 新增 `docs/` 分类目录并完成工程文档收拢
- 修正 `README.md`、`site-v2/README.md` 为最小入口文档
- 修正治理脚本与工程文档引用路径
- 修复多份工程文档的编码乱码问题
- 更新日志真源已迁移到 `public-data/updates/index.md`，并保留旧路径兼容读取

## 下一批优先任务

- P0-1：继续清理仍残留在历史记录中的旧路径文案，并统一补“历史阶段”提示
- P0-2：校对 `docs/README.md`、`docs/plans/README.md` 与执行日志引用一致性
- P0-3：每次文档调整后执行 `npm run check`，并将结果回写执行日志

## 使用约定

- 公开可见变化：同步写入 `public-data/updates/index.md`
- 过程推进与验证：同步写入本文件
- 范围与阶段状态：同步写入 `docs/architecture/astro-blog-redesign-checklist.md`
