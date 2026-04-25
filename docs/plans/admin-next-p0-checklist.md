# admin-next P0 实施清单

## 目标

在 `apps/admin-next` 落地一个最小可运行的 Next.js App Router 控制台骨架，不改变当前 Astro 站点的只读展示边界，也不接真实发布或模型提供方。

## P0 范围

- `app/admin/layout.jsx`
- `app/admin/dashboard/page.jsx`
- `app/admin/publish/page.jsx`
- `app/admin/token-pool/page.jsx`
- `app/admin/ai/page.jsx`
- `app/admin/content/page.jsx`
- `app/admin/logs/page.jsx`
- `app/api/ai/generate/route.js`
- `app/api/publish/build/route.js`
- `app/api/publish/release/route.js`
- `app/api/publish/rollback/route.js`
- `app/api/token-pool/status/route.js`
- 共享组件与 mock data

## 硬约束

- `apps/web` 仍是当前真实前台；P0 不改变 Astro 发布链路。
- `apps/admin-next` 只做控制台原型，不直接写内容、不直接调真实 provider、不直接切换服务器 `current`。
- Route handlers 允许返回 mock 数据，但路径和返回形状应贴近未来真实边界。
- 发布中心只表现状态机与日志壳，不宣称已经接入真实发布链。

## 验收标准

- `npm --prefix apps/admin-next run build` 通过。
- `/admin/dashboard`、`/admin/publish`、`/admin/token-pool` 能构成完整控制台骨架。
- `/api/publish/release`、`/api/publish/rollback`、`/api/token-pool/status`、`/api/ai/generate` 存在并返回 JSON。
- UI 风格遵守 README 中 `admin-next` 的统一控制台语言。

## P1 入口

- 把 `publish` 状态机接到真实 API。
- 把 `token-pool/status` 接到真实 provider scoring 数据。
- 把 `AI Writer` 接到真实 token-pool 与 writing pipeline。
