---
title: VS Code 中 Codex 与 Roo Code 操作指南：配置位置、改 Key、MCP 变更与排障修复
date: 2026-03-30 12:30:00
slug: roo-code-vscode-migration-and-usage-guide
description: 将 VS Code 中 Codex 与 Roo Code 的配置位置、API Key 更换、MCP 配置变更、运行态排障与修复流程合并为一份统一操作指南。
tags:
  - VS Code
  - Codex
  - Roo Code
  - API Key
  - MCP
  - AI Tooling
categories:
  - AI 工具链
  - 开发环境
series: VS Code AI 工具链
featured: true
cover: roo-vscode-guide
---

这篇文章把原先分散在多份文档里的内容收口成一份可以直接执行的手册，只聚焦一个场景：

> **在 VS Code 里，怎么维护 Codex、Roo Code 以及相关 MCP 配置，怎么改 key，怎么判断谁在生效，怎么排障。**

本文不再把 Cursor 当活动真源，也不再把配置对比、路径清单、修复剧本拆散到多份文档里。

## 适用范围

这份手册覆盖四类问题：

- Codex 的 API Key、Base URL、模型配置改到哪里
- Roo Code 的 key、活动配置名、运行态缓存该看哪里
- Roo 的 MCP / Skill 入口应该改哪些地方
- 改完以后 VS Code 还是用旧配置时，应该按什么顺序修

如果你只记一句话，记这句就够了：

> **磁盘配置只是证据，不是自动真相；VS Code 扩展宿主里的运行态，也必须一起核对。**

## 先认清活动真源

先把边界划清，不然后面每一次排障都会变成“到底是谁在生效”。

在这套环境里，活动真源应该这样理解：

- Codex 的磁盘真源在 `C:\Users\ASUS-KL\.codex`
- Roo Code 的磁盘真源在 `C:\Users\ASUS-KL\.roo`
- VS Code 的扩展运行态真源在 `C:\Users\ASUS-KL\AppData\Roaming\Code\User\globalStorage`
- Roo 的 MCP 活动入口以 `C:\Users\ASUS-KL\.roo\mcps\*\server.mjs` 为准
- `.cursor` 只适合作为历史归档或迁移参考，不再适合作为活动配置说明

这条边界非常关键。只要活动真源不唯一，后面出现旧 key、旧 provider、旧任务自动恢复污染时，你很难判断应该先修哪一层。

## 本机关键位置总表

下面这张表就是以后排障时最先该翻的地方。

| 场景 | 位置 | 主要用途 | 备注 |
| --- | --- | --- | --- |
| Codex API Key | `C:\Users\ASUS-KL\.codex\auth.json` | 存放 `OPENAI_API_KEY` | 改 key 的第一落点 |
| Codex 连接配置 | `C:\Users\ASUS-KL\.codex\config.toml` | Base URL、模型等连接参数 | 不同客户端的 URL 拼接逻辑可能不同 |
| Codex 全局状态 | `C:\Users\ASUS-KL\.codex\.codex-global-state.json` | 用户偏好与状态 | 不是 API key 真源 |
| Roo 历史磁盘候选文件 | `C:\Users\ASUS-KL\.roo\.env.local` | 旧文档里曾作为候选入口 | 在当前这台机器上不应再当作主控来源 |
| Roo 活动配置状态 | `C:\Users\ASUS-KL\AppData\Roaming\Code\User\globalStorage\state.vscdb` | `currentApiConfigName` 与 secret 索引 | 当前应优先检查这里 |
| Roo 扩展私有存储 | VS Code `globalStorage` 下 Roo 专属目录 | 任务历史、provider 绑定、派生配置 | 旧任务自动恢复最容易污染这里 |
| Roo MCP 配置 | Roo VS Code 全局存储内的 `mcp_settings.json` | MCP 挂载关系 | 改 MCP 后通常要 reload |
| Roo MCP 实际入口 | `C:\Users\ASUS-KL\.roo\mcps\*\server.mjs` | 标准 stdio MCP server 入口 | `start.cmd` 只能算探针，不等于标准入口 |

## 操作总原则

所有修改都建议按下面五条原则执行：

- 先定唯一真源，再动派生配置，避免一边改历史候选文件一边改当前运行态存储
- 先备份，再写入，尤其是 `auth.json`、`config.toml`、`state.vscdb`
- 运行态一定要比对，不要因为磁盘文件已经更新，就默认 VS Code 也已经切过去
- 日志、文档、审计记录里只保留 key 指纹，不保留明文
- 没有明确“哪份才是当前真源”之前，不要同时修改多个来源

这也是为什么排障顺序永远应该是：

1. 先确认磁盘真源
2. 再确认 VS Code 运行态
3. 再决定是修文件、修活动配置名，还是重启扩展宿主

## Codex 改 Key 的标准做法

Codex 这边的结构相对简单，重点是分清哪个文件存 key，哪个文件存连接参数。

### 1. 先备份两个文件

至少先备份：

- `C:\Users\ASUS-KL\.codex\auth.json`
- `C:\Users\ASUS-KL\.codex\config.toml`

### 2. 改 `auth.json`

Codex 的 API Key 真源在 `auth.json`，关键字段是：

```json
{
  "auth_mode": "apikey",
  "OPENAI_API_KEY": "sk-***"
}
```

需要换 key 时，优先改这里，不要去 `.codex-global-state.json` 里找。

### 3. 改 `config.toml`

如果这次不仅换 key，还换了 Base URL、代理网关或者默认模型，再改 `config.toml`。

最重要的原则不是“把值都改掉”，而是：

- key 放 `auth.json`
- 连接参数放 `config.toml`
- 状态偏好不要拿来当认证来源

### 4. 不要误改 `.codex-global-state.json`

`.codex-global-state.json` 存的是状态和偏好，不是 API 配置真源。

如果把它当成主入口去修，通常只会浪费排障时间。

### 5. 改完后再验证

验证时至少看两件事：

- Codex 当前请求是否已经使用新 key 指纹
- Base URL 是否符合当前客户端的拼接逻辑

这里有一个非常容易踩坑的点：

- 某些客户端会把 `base_url` 直接当作根地址
- 某些客户端会自行追加 `/v1`

所以不要把一个客户端的 Base URL 原样抄给另一个客户端。

## Roo Code 改 Key 的标准做法

Roo 这边比 Codex 更容易出现“你改了某个文件，但实际运行态根本不认它”的问题，所以必须先承认一件事：在当前这台机器上，`.env.local` 不应再被当成 Roo API Key 的主控入口。

### 第 1 层：先看 VS Code 运行态真源

Roo 当前应优先检查：

```text
C:\Users\ASUS-KL\AppData\Roaming\Code\User\globalStorage\state.vscdb
```

这里不是文本文件，而是 SQLite 数据库。真正需要关注的是：

- `currentApiConfigName`
- Roo 扩展相关 secret 项索引
- 当前活动 provider 是否仍指向旧配置

### 第 2 层：再检查 Roo 扩展私有存储

如果 `state.vscdb` 已经指向目标配置，但 Roo 新任务仍然拿旧 key，就继续检查 Roo 在 VS Code `globalStorage` 下的私有存储。

这时重点看：

```text
C:\Users\ASUS-KL\AppData\Roaming\Code\User\globalStorage\state.vscdb
```

需要检查的是 Roo 对应的全局状态记录里，`currentApiConfigName` 是否还指向旧配置名。

典型症状是：

- `state.vscdb` 里的活动配置看似已切换
- 新任务却仍然走旧 provider
- 恢复旧任务时继续报旧 key 的 `401`

这时候就不能只盯一个状态库键名，还要继续查 Roo 私有存储和历史绑定。

### 第 3 层：把 `.env.local` 降级为历史候选文件

`C:\Users\ASUS-KL\.roo\.env.local` 在旧文档里曾被当作候选入口，但按这台机器当前已定位到的行为，它不应再被当成 Roo 当前 API Key 的主控来源。

如果这个文件还存在，只应把它视为：

- 历史残留
- 迁移期候选文件
- 需要清理或归档的旧入口

重点看三类内容：

- 任务历史是否还绑定旧配置名
- provider 绑定信息是否仍指向旧 key / 旧 model / 旧 base
- 是否存在自动恢复旧任务后把旧配置重新带回来的情况

这里最重要的原则是：

- 可以重写受控的映射关系
- 不要无脑清空全部任务历史

盲删所有历史虽然简单，但副作用太大，也容易把本来还能追溯的问题证据一起删掉。

### 第 4 层：最后刷新运行态

Roo 这类 VS Code 扩展非常依赖扩展宿主状态。

所以在下面这些内容改完以后，都建议执行一次：

```text
Developer: Reload Window
```

尤其是你改了：

- `currentApiConfigName`
- Roo 扩展 secret 相关配置
- `mcp_settings.json`
- Roo 的技能目录
- `server.mjs`

如果只是改磁盘，不让扩展宿主重新加载，旧运行态可能继续生效。

## Roo 的 MCP / Skill 配置应该怎么改

Roo 这里还有一类常见误区，就是把 `start.cmd` 当成了真正的 MCP 服务入口。

### 真正该看的入口

Roo 当前活动 MCP 入口应统一指向：

```text
C:\Users\ASUS-KL\.roo\mcps\*\server.mjs
```

也就是说：

- `server.mjs` 才是标准 stdio MCP server 入口
- `start.cmd` 更像探针、启动包装器或 smoke 验证脚本

如果一个目录里只有 `start.cmd`、`README.md`、`server.json`，它不一定就是可长期挂载的 MCP server。

### 改 MCP 时要动哪些地方

通常要同时核对：

- Roo VS Code 全局存储中的 `mcp_settings.json`
- Roo 备用存储中的 `mcp_settings.json`
- `C:\Users\ASUS-KL\.roo\mcps\*\server.mjs`

如果你只改 `start.cmd`，却没改真正挂载的入口，Roo 里看到的仍然可能是旧行为。

### 改完后为什么一定要 reload

因为扩展宿主不会保证即时重新扫描这些变更。

所以只要 MCP、Skill 或 server 入口动过，最稳妥的标准动作就是：

```text
Developer: Reload Window
```

## 三套最常用的修复剧本

下面这三套剧本，是把散落的修复文档收口后的标准顺序。

## 剧本一：重置 Roo 当前活动配置名

适用场景：

- Roo 磁盘配置已经正确
- VS Code 状态仍指向旧配置名
- 问题边界清晰，可逆

标准步骤：

1. 先采集当前状态快照
2. 备份目标状态文件或记录
3. 把 `currentApiConfigName` 改为目标配置名
4. 记录前后指纹差异，不记录明文 key
5. 标记需要 reload 或扩展宿主重启

## 剧本二：重建标准配置投影

适用场景：

- 真正的配置真源已经确定
- 派生文件缺失、残缺或陈旧
- 修复动作可以只覆盖受管字段

标准步骤：

1. 先读取唯一真源
2. 校验关键字段是否完整
3. 备份目标派生文件
4. 只重写受管字段，不覆盖用户其它无关配置
5. 回扫一次，确认诊断结果是否改善

这套剧本特别适合处理：

- Roo 的 `mcp_settings.json`
- Roo 的活动 provider 映射
- 某些由标准模板生成出来的配置

## 剧本三：受控重启 VS Code 扩展宿主

适用场景：

- 磁盘和状态都已经对齐
- 运行态仍旧顽固使用旧值
- 没有更安全的直接修改入口

标准步骤：

1. 先保留“运行态仍旧陈旧”的证据
2. 标记需要重启扩展宿主
3. 必要时调用本地辅助脚本执行受控重启
4. 重启完成后重新诊断

这套剧本比“关掉所有 VS Code 窗口重来”更稳，也更利于定位到底是哪一个窗口或哪一个扩展宿主被污染。

## Roo 最常见的一类故障：明明改了，为什么还是旧 key

这类问题基本都不是单层问题，而是运行态状态和私有存储叠在一起：

- 第一层是 `state.vscdb` 里的活动配置仍指向旧值
- 第二层是 Roo 私有存储或恢复任务把旧 provider 重新带回来

这类问题的标准判断顺序应该是：

1. 先看 `state.vscdb` 里的活动配置名是否仍指向旧值
2. 再看 Roo secret 项和私有存储是否仍绑定旧 provider
3. 再看 Roo 自己的任务历史和 provider 绑定是否把旧配置重新带回来
4. 最后再重启对应扩展宿主，而不是一上来就全局清空

实践里，如果你看到类似下面的现象，就几乎可以按这个顺序排：

- 新任务依然报旧 key 的 `401`
- 某个窗口恢复旧任务后把旧 provider 又带回来了
- 明明磁盘配置正确，日志里却继续出现旧 key 指纹

真正修好之后，应该出现的结果是：

- 新任务不再产生旧 key 指纹
- 新请求走的是当前目标 provider
- 旧任务即使存在，也不会继续污染新的启动流程

## Base URL 还有一个很容易被忽略的坑

同一套代理服务，在不同客户端里不一定该填同一个 Base URL。

这台机器上的一个实际例子就是：

- `https://apikey.soxio.me/openai/chat/completions` 返回 `404`
- `https://apikey.soxio.me/openai/v1/chat/completions` 可以工作
- `https://apikey.soxio.me/openai/responses` 也可以工作

这说明一个很重要的经验：

> **不要把某个客户端里已经能用的 Base URL，不加验证地照抄给另一个客户端。**

正确做法是：

- 先确认客户端是否会自动补 `/v1`
- 再确认它实际请求的是 `chat/completions` 还是 `responses`
- 最后再决定 `config.toml` 或 Roo 当前活动配置里该填哪个根地址

## 最小验证清单

每次改完配置，至少做一轮下面这份最小验证：

- Codex 读取到的是新 `OPENAI_API_KEY` 指纹
- Codex 的 Base URL 与当前客户端拼接逻辑一致
- `state.vscdb` 里的 `currentApiConfigName` 指向当前真源
- Roo secret 项和私有存储没有继续指向旧 provider
- Roo 的任务历史没有继续把旧配置回写成活动值
- 改了 MCP / Skill / `server.mjs` 后已经执行过 `Developer: Reload Window`
- 新任务或新请求不再出现旧 key 的 `401`
- 日志里不再出现旧 key 指纹

如果这八项里有一项没过，就不要急着下结论说“已经修好了”。

## 明确不要做的事

下面这些操作应视为高风险动作，除非你已经确认边界和回滚方案：

- 无脑删除全部任务历史
- 在日志、脚本、文档里写入明文 API Key
- 还没确认真源就同时改多处配置
- 把 `.cursor`、旧副本目录或过期缓存继续当成活动来源
- 改完 MCP、Skill 或状态数据库后不做 reload 就直接验证
- 在没有明确唯一真源的情况下改写模糊来源

## 结语

把 Codex、Roo Code、VS Code `globalStorage`、MCP 配置这些东西拆开看时，它们好像只是几份零散文件；但真正稳定的做法，从来不是“哪里报错改哪里”，而是先建立一套清晰的操作顺序：

- 先认清真源
- 再修改磁盘配置
- 再对齐活动状态
- 再刷新运行态
- 最后用最小验证清单收口

只要顺序对了，后面的排障会简单很多；顺序乱了，哪怕只是一把旧 key，也会在多个配置源和多个窗口之间来回污染。
