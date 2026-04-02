# emptyinkpot.github.io

`emptyinkpot.github.io` 当前已经收拢为单站点仓库：对外站点由 `apps/web/` 生成，工程文档统一收纳在 `docs/`。

## 中心入口（先看这里）

- 网站中心：`apps/web/`
- 规划中心：`docs/plans/update-plan.md`
- 执行中心：`docs/architecture/astro-blog-redesign-checklist.md`
- 记录中心：`docs/maintenance/astro-redesign-execution-log.md`

## 入口

- 站点应用：`apps/web/`
- 工程文档：`docs/`
- 公开数据：`public-data/`
- 工具脚本：`tools/`

## 当前架构结论

- `apps/web/` 是唯一正式站点入口
- 开发、构建、预览、部署都只走 Astro 主链路
- Hexo 兼容链路已经停止维护，不再作为正式能力保留
- 内容发布以 `apps/web/src/content/` 与 `public-data/` 为准
- 架构规范类公开文档以 `apps/web/src/content/posts/` 为唯一真源，不再在 `docs/` 或根目录维护重复副本

## 默认提交目标

- 默认 Git 远端仓库：`https://github.com/emptyinkpot/emptyinkpot.github.io`
- 默认集成分支：`origin/main`
- 默认协作方式：`feature branch + Pull Request`
- 非紧急情况不直接推送到 `main`，优先从功能分支发起 PR 合并
- 后续如需更换提交目标，应优先先更新本节说明，再执行提交或推送

## Pull Request 规则

- PR 默认目标仓库：`https://github.com/emptyinkpot/emptyinkpot.github.io`
- PR 默认目标分支：`main`
- 分支命名建议使用 `feat/`、`fix/`、`docs/`、`refactor/` 等前缀加简短英文主题
- PR 标题必须简洁明确，推荐中英双语，并直接描述本次变更结果
- PR 描述必须中英双语，且内容保持简洁，只写必要背景、变更范围、验证结果与风险说明
- PR 提交前必须完成本地验证；至少写明已执行的命令与结果，例如 `npm run check`、`npm run build`
- PR 不混入临时文件、空文件、调试产物或与主题无关的改动

推荐 PR 描述结构：

1. 摘要 / Summary
2. 变更内容 / Changes
3. 验证结果 / Verification
4. 风险与备注 / Risks & Notes

## 根目录精简建议

如果按当前规范继续收口，建议最终根目录尽量保持为：

```text
MyBlog/
├─ .github/
├─ .runtime/
├─ apps/
├─ docs/
├─ public-data/
├─ tests/
├─ tools/
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md
```

说明：

- `apps/` 是现行应用层，当前正式站点入口在 `apps/web/`
- `docs/` 是规划、架构、治理和维护记录中心
- `public-data/` 是公开数据真源
- `tests/` 是测试与验证入口
- `tools/` 是校验、生成和迁移脚本入口
- `.runtime/` 是运行层外置目录

## 计划文档规则

计划文档统一存放在 `docs/plans/`。

读取顺序建议如下：

1. 先读 `docs/plans/update-plan.md`，了解仓库总方向
2. 再读按日期命名的专项计划文档，了解某一轮改造的目标与边界
3. 最后再进入 `docs/architecture/` 和 `docs/maintenance/` 查看实施与执行记录

命名规范：

- 统一使用 `YYYY-MM-DD-中文主题名.md`
- 日期使用绝对日期
- 主题名直接描述计划对象与目标，不使用 `final`、`new`、`temp` 之类状态词

书写规范：

- 计划文档优先写“目标、范围、执行项、验收标准”
- 架构实现细节放到 `docs/architecture/`
- 执行过程和验证记录放到 `docs/maintenance/`
- 对外公开发布的计划类内容，以 `apps/web/src/content/posts/` 中的站内文章版本为唯一真源

## 常用命令

```bash
npm run dev
npm run lint
npm run check
npm run build
npm run preview
```

## ESLint 使用步骤

为了让代码更可靠，建议把 ESLint 作为每次改动后的第一道检查。

推荐执行顺序：

1. 开发或修改代码
2. 在仓库根目录执行 `npm run lint`
3. 修复 ESLint 报出的代码问题
4. 再执行 `npm run check`
5. 最后执行 `npm run build`

作用说明：

- `npm run lint`
  - 优先发现未使用变量、可疑写法、无效转义、Astro/TypeScript 规则问题
- `npm run check`
  - 检查更新日志、内容治理、仓库治理规则
- `npm run build`
  - 确认站点最终可以正常构建与发布

日常最小质量门：

```bash
npm run lint
npm run check
npm run build
```

如果只是临时检查单个文件，也可以使用：

```bash
npx eslint apps/web/src/lib/updateLog.ts
```

## 文档索引

- 工程文档总入口：`docs/README.md`
- 总规划：`docs/plans/update-plan.md`
- 架构方案：`docs/architecture/astro-blog-redesign-plan.md`
- 执行清单：`docs/architecture/astro-blog-redesign-checklist.md`
- 维护记录：`docs/maintenance/README.md`
