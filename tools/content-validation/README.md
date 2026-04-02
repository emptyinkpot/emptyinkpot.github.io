# 内容治理校验接口预留

`tools/content-validation/` 用于承接后续更细的内容治理能力，目前作为仓库规划中的明确接口位置保留。

当前约定：

- 现阶段已落地的内容治理入口仍为根目录脚本 [`tools/validate-content-governance.mjs`](tools/validate-content-governance.mjs)
- 当需要拆分更细的校验能力时，优先把可复用的内容校验模块下沉到这里
- 适合逐步迁入的能力包括：站内链接校验、RSS 条目校验、搜索索引校验、front matter 规则集拆分
- 该目录只承接现行 Astro 内容治理，不再为 Hexo 历史层新增正式能力

建议后续结构示例：

```text
content-validation/
├─ links/
├─ rss/
├─ search/
└─ shared/
```
