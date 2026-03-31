# 内容迁移接口预留

`tools/content-migration/` 用于承接后续内容迁移、归档映射与批处理辅助能力，目前作为仓库规划中的明确接口位置保留。

当前约定：

- 现阶段迁移状态的正式记录仍以 `docs/governance/content-migration-status.md` 为准
- 如后续需要补充批量迁移脚本、front matter 对齐脚本、历史资源映射工具，应优先放入此目录
- 该目录面向 `source/` 到 `site-v2/src/content/` 的迁移与归档场景，不承担现行站点运行时职责
- 如果未来评估要把 Hexo 历史层整体迁入 `legacy/`，相关辅助脚本也应先在这里收敛

建议后续结构示例：

```text
content-migration/
├─ posts/
├─ assets/
├─ mappings/
└─ reports/
```
