# Runtime 内容状态表

更新时间：2026-05-07

## 1. 文档目的

这份状态表只记录当前公开文章系统的真实 authority。旧内容集合迁移表已经停止作为治理依据，不再维护兼容文章线。

## 2. 当前公开文章 Authority

| 对象类型 | 当前状态 | Authority | 维护说明 |
| --- | --- | --- | --- |
| Runtime MarkdownObject | 现行 | `public-data/runtime/content-index.json` | 首页 Feed、`/posts/`、`/posts/[slug]/`、RSS、分类、标签、专题、Knowledge search 和 Graph 的唯一公开文章投影 |

## 3. 判定规则

- Linux Vault `/home/vault/docs` 是上游写作母库；OpenList 只是 `/home/vault` 的公网文件映射层。
- `public-data/runtime/content-index.json` 是公开文章投影真源。
- 旧静态文章 collection 已移除，不作为路由、RSS、搜索、分类、标签、专题或 Graph 的 authority。
- 新公开文章必须通过 Runtime MarkdownObject Index Compile 进入公开站点。

## 4. 质量门

- `npm run runtime:content` 负责生成 Runtime MarkdownObject index。
- `npm run check:content` 校验 Runtime article slug、title、summary/description、date、body/html 和 feed projection。
- `npm run check:governance` 校验本文件只把 Runtime MarkdownObject 标记为现行 authority。

## 5. 当前结论

- 当前公开文章线只有一条：Runtime MarkdownObject。
- 旧内容集合文件不作为公开文章系统、archive route 或兼容入口保留。
