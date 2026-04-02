# 内容迁移接口预留

`tools/content-migration/` 用于承接后续内容迁移、归档映射与批处理辅助能力，目前作为仓库规划中的明确接口位置保留。

当前约定：

- 现阶段迁移状态的正式记录仍以 `docs/governance/content-migration-status.md` 为准
- 如后续需要补充批量迁移脚本、front matter 对齐脚本、历史资源映射工具，应优先放入此目录
- 该目录保留为历史迁移记录，主要对应早期从 Hexo 到 Astro 的内容迁移过程
- 当前正式站点已经完成 Astro 主链路收口，这里不再承担现行站点运行时职责

建议后续结构示例：

```text
content-migration/
├─ posts/
├─ assets/
├─ mappings/
└─ reports/
```
