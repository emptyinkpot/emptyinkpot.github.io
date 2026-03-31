# 博客更新计划

更新时间：2026-03-31

## 1. 当前总目标

当前仓库不再继续维护“Hexo 线上站点 + Astro 预览站”的双轨模式，而是正式收敛为：

- `apps/web/` 作为唯一对外站点应用（`site-v2/` 为历史阶段命名）
- 线上地址统一为 `https://emptyinkpot.github.io/`
- 根目录只承担仓库治理、历史资产保留、工程文档与辅助脚本职责
- 旧 Hexo 结构保留为历史参考与迁移档案，不再参与正式发布

这次整理遵循《通用文件与模块开发规范》的核心原则：

- 单一事实源
- 职责分层
- 高内聚、低耦合
- 平台壳层克制
- 明确现行层与历史层边界

## 2. 当前架构结论

### 2.1 站点角色收敛

当前仓库中各层职责调整为：

1. `apps/web/`：唯一线上站点、唯一页面装配层、唯一发布入口
2. `apps/web/src/content/`：现行内容事实源
3. `docs/`：规划、治理、维护记录、执行清单、历史边界与指南文档
4. `tools/`：仓库级辅助脚本与后续校验工具入口
5. `source/`：旧 Hexo 内容归档层，仅作迁移参考
6. `themes/`、`_config.yml`、`_config.landscape.yml`：旧 Hexo 历史资产，仅保留，不再承担现行发布职责

### 2.2 已完成的收敛动作

- 根目录 `package.json` 已将默认开发、构建、预览命令转发到 `apps/web/`
- GitHub Actions 已改为直接构建 `apps/web/` 并发布到根路径
- 根目录 `README.md` 与 `apps/web/README.md` 已精简为最小入口文档
- `apps/web/` 的首页、文章页与说明文案已统一为单站点口径
- 线上地址固定为 `https://emptyinkpot.github.io/`
- `docs/` 已建立分类目录：`architecture/`、`governance/`、`guides/`、`archive/`、`historical/`、`maintenance/`、`plans/`、`templates/`

### 2.3 已完成的治理动作

- 已建立 `docs/governance/content-migration-status.md` 作为内容迁移状态表
- 已建立 `docs/governance/historical-assets-boundary.md` 作为历史资产边界说明
- 已将 `source/`、`themes/`、`scaffolds/`、`scripts/` 的目录说明统一收拢到 `docs/historical/`
- 已建立 `tools/validate-repo-governance.mjs` 用于校验迁移表、历史边界文档、脚本命名与 Pages workflow
- 已建立 `tools/validate-content-governance.mjs` 用于校验内容字段、链接兼容与内容约束
- 已将 `npm run check` 收敛为仓库统一检查入口

## 3. 现行更新原则

后续整理与开发统一遵守以下原则：

- 任何新增前台能力默认进入 `apps/web/`
- 任何新增内容默认写入 `apps/web/src/content/`
- 根目录不再继续扩展 Hexo 站点能力
- 历史 Hexo 资产只允许承担“归档、映射、迁移参考”职责
- 页面装配、内容查询、展示组件、站点配置必须严格分层
- 发布配置统一围绕 `https://emptyinkpot.github.io/` 的 Astro 根路径部署展开

## 4. 当前推荐目录职责

### 4.1 现行正式层

- `apps/web/src/content/`：内容事实源
- `apps/web/src/pages/`：页面装配层
- `apps/web/src/components/`：展示组件层
- `apps/web/src/lib/`：站点工具、内容处理与 URL 逻辑
- `apps/web/astro.config.mjs`：站点发布配置基线
- `.github/workflows/pages.yml`：唯一发布流水线

### 4.2 仓库治理层

- `docs/architecture/`：架构方案与执行清单
- `docs/governance/`：治理规则、迁移状态与边界文档
- `docs/maintenance/`：过程记录、治理规范与维护说明
- `docs/plans/`：阶段计划与总规划
- `docs/guides/`：工具与使用指南
- `docs/archive/`：历史备份文档
- `docs/templates/`：文档模板
- `tools/`：后续迁移、校验与生成脚本入口

### 4.3 历史归档层

- `source/`：旧 Hexo 内容源归档
- `themes/`：旧 Hexo 主题归档
- `_config.yml`：旧 Hexo 站点配置归档
- `_config.landscape.yml`：旧 Hexo 主题配置归档
- `scaffolds/`、`scripts/`：旧 Hexo 辅助结构，保留为历史资料

## 5. 当前目标结构

```text
.
|- .github/
|  \- workflows/
|     \- pages.yml
|- docs/
|  |- architecture/
|  |- governance/
|  |- maintenance/
|  |- plans/
|  |- guides/
|  |- archive/
|  |- historical/
|  \- templates/
|- tools/
|- apps/
|  \- web/
|- source/
|- themes/
|- README.md
\- package.json
```

说明：

- 只有 `apps/web/` 负责对外站点能力
- `docs/` 是工程文档统一入口
- `source/` 与 `themes/` 暂不删除，但定位严格降级为历史层

## 6. 分阶段执行计划

## 阶段 A：发布入口统一

目标：让 Astro 成为唯一正式发布入口。

当前状态：已完成。

完成标准：

- `npm run dev`、`npm run build`、`npm run preview` 默认指向 Astro
- GitHub Actions 不再构建 Hexo 线上产物
- 线上根路径直接对应 Astro 站点

## 阶段 B：内容事实源统一

目标：把实际维护动作全部收敛到 `apps/web/src/content/`。

当前状态：已完成。

完成标准：

- 新文章、新页面、新 notes、新项目统一进入 Astro 内容层
- `source/` 不再作为现行写作入口
- `docs/governance/content-migration-status.md` 持续维护历史到现行的映射关系

## 阶段 C：公开口径统一

目标：从“v2 / 预览 / 双轨”切换到“唯一站点”表述。

当前状态：已完成。

完成标准：

- 首页、文章列表、About、项目说明不再出现旧口径
- 公开导航与页脚已收口为现行站点表述
- 更新页已接入现行站点路由体系

## 阶段 D：历史层边界隔离

目标：保留 Hexo 历史资产，但不再污染现行结构认知。

当前状态：已完成基础收口。

完成标准：

- `docs/governance/historical-assets-boundary.md` 明确现行层与历史层边界
- `docs/historical/` 为 `source/`、`themes/`、`scaffolds/`、`scripts/` 提供边界说明
- 新功能不再继续落到 Hexo 结构中

## 阶段 E：质量门禁与内容治理补齐

目标：让单站点模式具备长期维护能力。

当前状态：已完成基础门禁，后续可继续增强。

完成标准：

- `npm run check` 能覆盖更新日志、内容治理与仓库治理检查
- 关键内容字段、链接兼容、RSS 与搜索接线具备基础校验
- 发布链路围绕 Astro 单站点持续稳定运行

## 7. 最近建议执行顺序

### 第一轮

- 完成核心页面与公开文档的单站点口径清理
- 持续维护 `docs/governance/content-migration-status.md`
- 确认新增内容默认只进入 Astro 内容源

### 第二轮

- 清理历史 `/site-v2/` 子路径表述
- 清理“预览站 / 新站 / 并行站”类文案
- 为历史 Hexo 目录补齐边界说明

### 第三轮

- 将链接兼容检查、字段校验与治理脚本统一接入 `npm run check`
- 评估旧 Hexo 历史层是否整体迁入 `legacy/`，当前结论为暂不迁移
- 为 `tools/content-validation/` 与 `tools/content-migration/` 预留后续能力入口

### 第四轮

- 将工程文档统一整理到 `docs/` 分类目录
- 根目录与 `apps/web/` 仅保留最小入口 `README`
- 修正文档引用、路径索引与校验脚本
- 修复文档编码问题，保证工程文档可持续维护

## 8. 后续仍值得继续补强的内容

- 内容 schema 的更细字段治理
- 文档内部相对链接的自动检查
- 历史资源映射与重定向策略说明
- 工程文档索引页与分层导航
- 发布前检查与回归快照能力

## 9. 下一阶段规划（2026-03-31）

为保持“单站点 + 单一事实源”长期稳定，下一阶段按 P0/P1/P2 推进：

### P0（本周内完成）

- 文档口径治理：继续清理历史文档中的旧子路径表述，并统一补充“历史阶段”提示语
- 文档导航治理：保持 `docs/README.md`、`docs/plans/README.md` 与执行日志引用一致
- 校验基线治理：每次文档调整后固定执行 `npm run check` 并记录结果

完成标准：

- 历史文档中不再出现会被误读为现行方案的旧口径
- 文档索引入口可一跳到达总规划、执行清单与执行日志
- `npm run check` 连续通过，且结果有记录可追溯

#### P0 推进进展（2026-03-31）

- P0-1：已完成首轮收口，`docs/maintenance/`、`docs/governance/`、`docs/historical/` 关键入口已统一到 `apps/web/` 与 `public-data/updates/index.md` 口径
- P0-2：已完成首轮校对，`docs/README.md`、`docs/plans/README.md` 与执行日志入口引用一致
- P0-3：已执行 `npm run check`，`check:updates`、`check:content`、`check:governance` 全部通过；结果已写入执行日志

### P1（下一轮迭代）

- 内容 schema 细化：补充 front matter 的细粒度约束与异常提示
- 文档链接检查：增加文档相对链接校验，减少路径漂移风险
- 历史映射说明：补充重定向与历史资源映射策略文档

完成标准：

- 新增或变更内容字段时有明确校验反馈
- 工程文档内部断链可在发布前被发现
- 历史资源去向有统一说明入口

### P2（持续演进）

- 发布前回归快照：形成可复用的发布前检查与对照记录
- 治理脚本扩展：为 `tools/content-validation/` 与 `tools/content-migration/` 增补可执行能力

完成标准：

- 发布前具备最小可审计证据链
- 内容迁移与治理增强具备明确扩展路径

## 9.1 网站中心化合并清单（新增）

为落实“该合并的合并、网站要有中心”，统一按以下口径执行：

### 中心定义

- 网站唯一中心：`apps/web/`
- 规划唯一中心：`docs/plans/update-plan.md`
- 执行唯一中心：`docs/architecture/astro-blog-redesign-checklist.md`
- 记录唯一中心：`docs/maintenance/astro-redesign-execution-log.md`

### 合并优先级

1. **入口合并**：所有 README 与索引文档优先指向上述 4 个中心文件，避免多入口并列叙述
2. **口径合并**：现行描述统一使用 `apps/web/` 与 `public-data/updates/index.md`；`site-v2/`、`source/updates/index.md` 仅作为历史兼容说明
3. **职责合并**：计划写 `docs/plans/`，实现写 `docs/architecture/`，过程写 `docs/maintenance/`，边界写 `docs/governance/`
4. **历史合并**：历史目录说明集中到 `docs/historical/`，不在现行文档中重复展开历史细节

### 验收标准（中心化）

- 根目录与 `docs/README.md` 均可一跳到达中心文件
- 同一主题不再在多个文档重复定义“最终口径”
- 新增文档默认挂靠一个中心文件，避免游离文档

## 10. 最终结论

当前项目接下来的正确方向，不是继续维持 Hexo 与 Astro 两套并行站点，而是：

- 用 Astro 作为唯一站点壳层
- 用 `apps/web/src/content/` 作为唯一现行内容源
- 用 `docs/` 承载规划、治理、维护与历史边界文档
- 用明确的历史层约束替代模糊的双轨并存

当这条边界稳定后，整个仓库会更符合《通用文件与模块开发规范》所强调的单一职责、清晰边界与可持续演进原则。

## 11. 规范符合性评估（对照《通用文件与模块开发规范》）

更新时间：2026-03-31

评估基线：`source/_posts/通用文件与模块开发规范.md`

### 11.1 当前已符合项

- **单一事实源方向**：对外站点已收敛到 `apps/web/`，发布入口已统一。
- **文档集中方向**：工程文档已集中到 `docs/` 分层目录（architecture/governance/maintenance/plans 等）。
- **治理可校验方向**：已建立 `npm run check` 统一检查入口，覆盖 updates/content/governance。
- **历史边界方向**：`source/`、`themes/`、`scaffolds/`、`scripts/` 已明确为历史层并有边界文档。

### 11.2 当前偏差项（需继续收敛）

- **顶层目录仍偏混合**：仍保留 `_config.yml`、`_config.landscape.yml` 等历史配置在顶层，语义上属于历史层资产。
- **应用壳层命名不统一**：现行应用目录仍为 `site-v2/`（带阶段语义），不符合长期稳定命名原则。
- **文档与历史层并存可读性成本**：`source/` 同时承载历史文章与公开更新真源，需更明确标注现行/历史职责。
- **工具目录语义可进一步分层**：`tools/` 已有校验脚本，但尚未按 generate/validate/migrate 的能力分组。

### 11.3 评估结论

当前仓库已达到“可持续维护的基础合规”，但尚未达到“命名与结构完全中性化、长期化”的目标。
下一步应优先做 **命名去阶段化**、**顶层语义收口**、**文档与工具目录再分层**。

## 12. 文档集中与命名重构规划（新文件树）

说明：本节为结构规划，不等同于立即执行迁移。执行时按阶段逐步落地并保持 `npm run check` 持续通过。

### 12.1 重构目标

- 去除目录命名中的阶段词（如 `v2`），改为长期稳定语义。
- 将“现行层 / 治理层 / 历史层 / 运行层”在顶层显式分离。
- 继续集中工程文档，避免说明分散在根目录与历史目录。
- 工具脚本按职责分组，便于自动化扩展。

### 12.2 目标文件树（规划版）

```text
.
|- apps/
|  \- web/
|     |- src/
|     |- astro.config.mjs
|     |- package.json
|     \- tsconfig.json
|- docs/
|  |- architecture/
|  |- governance/
|  |- maintenance/
|  |- plans/
|  |- guides/
|  |- historical/
|  |- templates/
|  \- archive/
|- tools/
|  |- validate/
|  |- migrate/
|  |- generate/
|  \- README.md
|- legacy/
|  |- hexo-source/
|  |- hexo-themes/
|  |- hexo-scaffolds/
|  |- hexo-scripts/
|  \- hexo-config/
|- public-data/
|  \- updates/
|     \- index.md
|- tests/
|- .runtime/
|- package.json
\- README.md
```

### 12.3 命名与归档规则

- `site-v2/` -> `apps/web/`（去阶段化，保留“应用壳”语义）
- `source/updates/index.md` -> `public-data/updates/index.md`（明确“公开数据真源”语义）
- `source/`（其余历史内容）-> `legacy/hexo-source/`
- `themes/` -> `legacy/hexo-themes/`
- `scaffolds/` -> `legacy/hexo-scaffolds/`
- `scripts/` -> `legacy/hexo-scripts/`
- `_config.yml` 与 `_config.landscape.yml` -> `legacy/hexo-config/`
- `tools/*.mjs` 按职责迁移到 `tools/validate/`、`tools/migrate/`、`tools/generate/`

### 12.4 分阶段执行建议

#### 阶段 F（命名与路径兼容）

- 建立 `apps/web/`（初期可与 `site-v2/` 并行），补别名或脚本转发。
- 统一更新文档与脚本引用，确保开发命令不受影响。
- 完成后将 `site-v2/` 标记为迁移中目录，并设置删除窗口。

#### 阶段 G（历史层归档收口）

- 新建 `legacy/` 并迁移 Hexo 历史资产。
- 更新 `docs/historical/` 与治理脚本中的路径白名单。
- 确保历史资产仅承担归档与映射职责。

#### 阶段 H（公开数据与工具分层）

- 将更新日志真源迁移到 `public-data/updates/index.md`。
- 调整 `apps/web` 与 `tools/validate-update-log` 的读取路径。
- 将 `tools/` 脚本按 validate/migrate/generate 分组并更新命令入口。

### 12.5 验收标准

- 顶层目录语义可一眼区分：现行应用、治理文档、工具、历史层、运行层。
- 不再出现阶段性命名作为长期正式目录名。
- `npm run check` 与发布流程在重构后持续通过。
- 文档引用、脚本引用、更新日志真源路径一致且可追溯。
