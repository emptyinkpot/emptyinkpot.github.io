# giscus 接入说明

更新时间：2026-03-27

## 当前结论

`apps/web` 的 giscus 组件代码已经接好，但真实启用还缺 GitHub 仓库侧设置。

当前阻塞点：

- 仓库 `emptyinkpot/emptyinkpot.github.io` 还没有开启 Discussions

## 需要完成的步骤

1. 进入仓库设置：
   - `https://github.com/emptyinkpot/emptyinkpot.github.io/settings`
2. 开启 Discussions
3. 安装 giscus GitHub App 到当前仓库
4. 创建一个用于评论映射的 Discussions 分类
   - 推荐名称：`Comments`
   - 也可以使用 `General`
5. 打开：
   - `https://giscus.app/zh-CN`
6. 填入仓库：
   - `emptyinkpot/emptyinkpot.github.io`
7. 读取并保存以下参数：
   - `PUBLIC_GISCUS_REPO_ID`
   - `PUBLIC_GISCUS_CATEGORY`
   - `PUBLIC_GISCUS_CATEGORY_ID`
8. 在 `apps/web/.env` 中填入：

```env
PUBLIC_GISCUS_REPO=emptyinkpot/emptyinkpot.github.io
PUBLIC_GISCUS_REPO_ID=...
PUBLIC_GISCUS_CATEGORY=Comments
PUBLIC_GISCUS_CATEGORY_ID=...
```

9. 重新构建：

```bash
cd apps/web
npm run build
```

## 代码位置

- 组件：`apps/web/src/components/post/GiscusComments.astro`
- 环境变量模板：`apps/web/.env.example`

## 验证标准

满足以下条件后，才算 giscus 完成：

- 文章页底部能够正常加载评论区
- 能使用 GitHub 账号发起评论
- reactions 可见且可点击
- pathname 映射正常，不会把不同文章混到同一讨论串
