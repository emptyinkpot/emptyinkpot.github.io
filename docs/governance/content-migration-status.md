# 内容迁移状态表

更新时间：2026-03-31

## 1. 文档目的

这份状态表用于明确当前仓库里哪些内容已经完成从 Hexo 历史层到 Astro 现行层的迁移，哪些内容仍然只保留在历史层。

它服务于以下治理目标：

- 明确 `apps/web/src/content/` 是唯一现行内容源
- 明确 `source/_posts/` 只作为历史归档与迁移参考
- 避免后续继续在两套内容源中并行维护
- 为后续归档、清理、重定向和校验脚本提供基础数据

## 2. 判定规则

- `现行`：内容已经进入 `apps/web/src/content/`，后续更新只允许在 Astro 内容源中进行
- `归档`：内容仅保留在 Hexo 历史层，不再作为正式站点内容继续维护
- `待处理`：内容仍需判断是继续迁移、合并重写，还是仅保留归档

## 3. 内容迁移状态

| Hexo 历史文件 | Astro 现行文件 | 当前状态 | 后续规则 |
| --- | --- | --- | --- |
| `source/_posts/welcome.md` | `apps/web/src/content/posts/welcome.md` | 现行 | 后续仅更新 Astro 文件 |
| `source/_posts/hexo-blog-principle-and-setup.md` | `apps/web/src/content/posts/hexo-blog-principle-and-setup.md` | 现行 | 保留 Hexo 主题历史描述，但现行发布版本以 Astro 文件为准 |
| `source/_posts/hexo-source-posts-publish-flow.md` | `apps/web/src/content/posts/hexo-source-posts-publish-flow.md` | 现行 | 保留 Hexo 教学语境，但只维护 Astro 文件 |
| `source/_posts/openclaw-extensions-migration-and-ai-governance.md` | `apps/web/src/content/posts/openclaw-extensions-migration-and-ai-governance.md` | 现行 | 后续仅更新 Astro 文件 |
| `source/_posts/openclaw-ui-navigation-and-entry-guide.md` | `apps/web/src/content/posts/openclaw-ui-navigation-and-entry-guide.md` | 现行 | 后续仅更新 Astro 文件 |
| `source/_posts/roo-code-vscode-migration-and-usage-guide.md` | `apps/web/src/content/posts/roo-code-vscode-migration-and-usage-guide.md` | 现行 | 后续仅更新 Astro 文件 |
| `source/_posts/通用文件与模块开发规范.md` | `apps/web/src/content/posts/通用文件与模块开发规范.md` | 现行 | 规范基线以后只以 Astro 文件为准，Hexo 副本仅作历史镜像 |
| `source/_posts/astro-blog-migration-complete-guide.md` | `apps/web/src/content/posts/astro-blog-migration-complete-guide.md` | 现行 | 已重写为单站点 Astro 口径，后续仅更新 Astro 文件 |

## 4. 当前结论

- `apps/web/src/content/posts/` 已经承接当前主要文章内容
- `source/_posts/` 不再是新增内容入口
- `source/_posts/astro-blog-migration-complete-guide.md` 已完成迁移，并在 Astro 内容层中以单站点口径重写

## 5. 后续执行规则

1. 新文章一律创建在 `apps/web/src/content/` 下
2. 历史文章如需更新，先确认 Astro 中是否已有对应文件
3. 如果 Astro 中已有对应文件，禁止回到 `source/_posts/` 修改
4. 如果 Astro 中没有对应文件，必须先在本表中登记，再决定迁移还是归档
5. 后续若引入内容校验脚本，应优先校验本表中的“历史文件 -> 现行文件”映射是否完整

## 6. 与仓库结构的关系

- 现行内容事实源：`apps/web/src/content/`
- 历史内容归档层：`source/_posts/`
- 规划基线：`docs/plans/update-plan.md`
- 执行日志：`docs/maintenance/astro-redesign-execution-log.md`
- 执行清单：`docs/architecture/astro-blog-redesign-checklist.md`

## 7. 下一步建议

- 持续补充历史文章与 Astro 现行文章之间的映射登记
- 继续为公开历史记录补“历史口径”说明，避免与现行架构混淆
- 后续可补内容校验脚本，让迁移状态表可以被自动检查
