# Cursor 使用 Codex API 正式接入说明

更新时间：2026-03-28 06:45（Asia/Shanghai）

## 文档位置

- 当前正式文档：`E:\MyBlog\docs\cursor-codex-api-integration.md`
- 旧备注跳转文件：`E:\Cursor-API-接入备注.md`
- 自动固化脚本：`E:\Finalize-Cursor-Codex.ps1`
- 自动固化日志：`E:\cursor-codex-finalize.log`

## 目标

这份文档记录的是：

- 如何让本地 Cursor 复用当前 Codex 正在使用的 API
- 这次已经实际做过哪些操作
- 为什么最终采用当前这套接入方案
- 后续如果要自己维护、复查、回滚，应该怎么做

## 当前正式接入结果

- Cursor 已启用自定义 OpenAI Key
- Cursor 的 Base URL 已修正为：`https://apikey.soxio.me/openai/v1`
- Cursor 的主要 AI 入口已按稳定方案统一到：`gpt-5.3-codex`
- 当前 Codex 本机检测到的模型仍然是：`gpt-5.4`

补充说明：

- `gpt-5.4` 不是最终在 Cursor 中落地的正式模型
- 正式接入最终落地为 `gpt-5.3-codex`
- 原因不是接口不能访问，而是 Cursor 本地模型目录和运行时回写逻辑对 `gpt-5.4` 不稳定

## 这次接入涉及到的本地文件

### Codex 侧

- Codex 配置：`C:\Users\ASUS-KL\.codex\config.toml`
- Codex 鉴权：`C:\Users\ASUS-KL\.codex\auth.json`

### Cursor 侧

- Cursor 用户目录：`C:\Users\ASUS-KL\AppData\Roaming\Cursor\User`
- Cursor 内部数据库：`C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb`
- Cursor 普通设置文件：`C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\settings.json`

## 这次实际检测到的 Codex 配置

- `base_url = https://apikey.soxio.me/openai`
- `model = gpt-5.4`
- API Key 存在于 `auth.json` 的 `OPENAI_API_KEY`

说明：

- Codex 配置中的 `base_url` 不是 Cursor 最终应该直接使用的地址
- 通过接口探测后，Cursor 适合使用的根地址应改为：
  - `https://apikey.soxio.me/openai/v1`

## 完整接入步骤

### 1. 先确认 Codex 当前实际在用什么 API

要确认三件事：

- API Key 来自哪里
- Base URL 是什么
- 当前模型是什么

本次结果：

- Key 来自 `C:\Users\ASUS-KL\.codex\auth.json`
- 原始 Base URL 来自 `C:\Users\ASUS-KL\.codex\config.toml`
- 当前模型是 `gpt-5.4`

### 2. 验证网关真正可用的 OpenAI 兼容路径

不能只看配置文件，需要验证实际接口路径。

本次探测结果：

- `https://apikey.soxio.me/openai/chat/completions` 返回 `404`
- `https://apikey.soxio.me/openai/v1/chat/completions` 可访问
- 同一个地址在 `stream=false` 时返回：
  - `400 {"detail":"Stream must be set to true"}`
- 同一个地址在 `stream=true` 时可以正常流式返回

结论：

- Cursor 的 `openAIBaseUrl` 不能填 `/openai`
- 正确的兼容根地址应填 `/openai/v1`

### 3. 确认哪些模型这个网关真的支持

本次实测结果：

- `gpt-5.4`：接口可返回
- `gpt-5.3-codex`：接口可返回
- `gpt-5.2-codex`：接口可返回
- `gpt-5.2`：接口可返回
- `gpt-5.4-medium`：不支持

### 4. 先备份 Cursor 本地数据库

接入前必须备份：

- `state.vscdb`

本次生成过的数据库备份包括：

- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-backup-20260328-062610`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-backup-20260328-063352`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-backup-20260328-063747`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-backup-20260328-064122`

### 5. 修改 Cursor 内部数据库，而不是只改 `settings.json`

这一步是关键。

Cursor 的 OpenAI Key / Base URL / 模型覆盖，不在普通的 `settings.json` 里。
真正相关的数据在：

- SQLite 数据库：`state.vscdb`
- 表：`ItemTable`

涉及到的关键项：

- `cursorAuth/openAIKey`
- `src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser`

### 6. 写入 OpenAI Key

将当前 Codex 使用的同一套 API Key 写入：

- `ItemTable.key = cursorAuth/openAIKey`

### 7. 写入 OpenAI Base URL 与启用开关

在 reactive storage JSON 中写入：

- `useOpenAIKey = true`
- `openAIBaseUrl = https://apikey.soxio.me/openai/v1`

### 8. 选择 Cursor 可稳定识别的正式模型

这里不能只看接口支持，还要看 Cursor 自己的模型目录是否认这个模型。

本次尝试过程：

- 一开始尝试把主要入口切到 `gpt-5.4`
- 运行中的 Cursor 会把部分入口重新写回 `default`
- 继续核对后发现 Cursor 当前本地模型目录里没有 `gpt-5.4`

所以最终正式接入采用：

- `gpt-5.3-codex`

原因：

- Cursor 原生识别它
- 当前网关实测支持它
- 它更贴近编程场景
- 它不会像 `gpt-5.4` 那样在当前环境下被频繁重置

### 9. 写入主要模型入口

本次统一写入的入口有：

- `cmd-k`
- `composer`
- `background-composer`
- `composer-ensemble`
- `plan-execution`
- `spec`
- `deep-search`
- `quick-agent`

统一写入为：

- `modelName = gpt-5.3-codex`
- `maxMode = false`

同时还写入了：

- `previousModelBeforeDefault`
- `modelOverrideEnabled`

目的：

- 减少 Cursor 启动后把模型又改回 `default`
- 让 `gpt-5.3-codex` 留在当前可用模型覆盖集里

### 10. 处理“Cursor 运行时回写配置”的问题

这次遇到的一个实际问题是：

- Cursor 运行中时，会不断把部分模型配置回写
- 所以就算数据库里刚写进去，也可能马上又被改掉

为了解决这个问题，这次增加了自动固化脚本：

- `E:\Finalize-Cursor-Codex.ps1`

脚本逻辑：

1. 持续等待，直到 Cursor 完全退出
2. 自动备份 `state.vscdb`
3. 自动再次把正式配置写回数据库
4. 把过程写到日志：`E:\cursor-codex-finalize.log`

## 这次我已经实际做过的操作

### 已完成的检测

- 检测了当前 Codex 本地配置来源
- 检测了当前 API Key 长度与实际存储位置
- 逆向定位了 Cursor 本地配置落点
- 探测了网关真实可用的 OpenAI 兼容路径
- 探测了多种模型的实际可用性

### 已完成的写入

- 已把当前 Codex 的 API Key 写入 Cursor
- 已启用 `useOpenAIKey = true`
- 已把 Base URL 改为 `/openai/v1`
- 已把主要 AI 入口稳定到 `gpt-5.3-codex`

### 已完成的保护措施

- 已多次备份 Cursor 数据库
- 已保留旧备注的跳转文件
- 已部署自动固化脚本，处理 Cursor 运行时回写问题

## 相关知识点

### 知识点 1：Cursor 的模型/API 配置不主要存放在 `settings.json`

普通用户往往会先去看：

- `settings.json`

但这次真正相关的是：

- `state.vscdb`

也就是说：

- UI 里的模型、Key、Base URL 状态
- 很大一部分实际保存在内部数据库中

### 知识点 2：Cursor 的 OpenAI 校验逻辑和真实可用性不是一回事

Cursor 设置页在校验 OpenAI Key / Base URL 时，会调用：

- `${openAIBaseUrl}/chat/completions`

而且它默认发：

- `stream=false`

但当前这个网关要求：

- `stream=true`

因此会出现：

- 设置页看起来校验失败
- 实际流式聊天仍然可用

所以判断是否接入成功时，不能只看设置页提示，要看真实对话是否能成功返回。

### 知识点 3：Base URL 要用兼容 API 的根路径，而不是随便截一段

这次从 Codex 检测到的原始地址是：

- `https://apikey.soxio.me/openai`

但 Cursor 最终要拼接：

- `/chat/completions`

如果直接用原始地址，就会变成：

- `/openai/chat/completions`

这次实际返回 `404`

因此必须改成：

- `https://apikey.soxio.me/openai/v1`

### 知识点 4：接口支持某模型，不代表 Cursor 本地目录就稳定支持这个模型名

这次 `gpt-5.4` 在接口层是能访问的。
但在 Cursor 当前本地模型目录里，它不是一个稳定可保持的正式项。

结果就是：

- 你能写进去
- 但运行中的 Cursor 可能又把它回写掉

所以正式接入时，必须同时考虑：

- 网关是否支持该模型
- Cursor 是否本地识别该模型
- Cursor 运行时会不会回写它

### 知识点 5：`default` 不等于你指定的真实模型

Cursor 里的 `default` 更像：

- 自动选择
- 默认切换
- 平台层封装入口

它不等于：

- 明确指定到某个 OpenAI-compatible 模型

如果你想真正让它走自己的 API 和指定模型，就需要把具体入口改成具体模型名，而不是停留在 `default`。

### 知识点 6：Tab Completion 等能力不一定跟着这次接入一起接管

这次接入主要影响的是：

- Composer
- Cmd-K
- Agent 类入口

但 Cursor 的一些内建能力可能仍然继续走：

- Cursor 自己的服务
- 官方链路
- 非你当前自定义 OpenAI Key 的通道

所以“正式接入”并不等于“Cursor 所有 AI 能力都完全换源”。

## 当前建议的使用方式

### 正常使用

- 保持当前正式模型为 `gpt-5.3-codex`
- Base URL 保持为 `https://apikey.soxio.me/openai/v1`

### 当 Cursor 还开着的时候

- 不要指望手工改完数据库后立刻永久生效
- 运行中的 Cursor 可能会回写配置

### 最稳的收口方式

1. 完全退出 Cursor
2. 等自动固化脚本执行完成
3. 查看日志 `E:\cursor-codex-finalize.log`
4. 重新打开 Cursor
5. 新开对话测试 `Composer` / `Cmd-K` / Agent 入口

## 验证方式

可以按下面顺序验证：

1. 先完全退出 Cursor
2. 查看 `E:\cursor-codex-finalize.log` 是否出现成功日志
3. 再打开 Cursor
4. 新开一个 Composer 对话
5. 再测试 Cmd-K
6. 如果有 Agent 类入口，再测试 Agent

验证重点：

- 是否能正常返回内容
- 是否仍然走你自己的网关
- 不要只依赖设置页的校验提示

## 回滚方式

1. 退出 Cursor
2. 选择一个之前的 `state.vscdb.codex-backup-*` 备份
3. 用备份覆盖当前：
   - `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb`
4. 重新打开 Cursor

## 常见报错排查

### 报错：`Free plans can only use Auto. Switch to Auto or upgrade plans to continue.`

这条报错通常不表示：

- API Key 一定没写进去
- Base URL 一定填错了

它更常见表示的是：

- Cursor 当前前端状态仍然把你当成“免费计划下在选命名模型”
- 它没有把当前会话识别成“正在使用自己的 OpenAI Key”

这次本地代码里已经可以确认：

- Cursor 这版设置页存在 `Bring-your-own-key`
- 设置页里存在 `Using key` / `Not using key` 开关
- 免费用户的命名模型可用性判断，与模型数据库配置不是同一个层面

因此出现这条报错时，优先按下面步骤处理：

1. 打开 Cursor 设置
2. 进入模型或 AI 相关设置页
3. 找到 `Bring-your-own-key`
4. 重新粘贴你自己的 API Key
5. 确认开关显示为 `Using key`
6. 确认 Base URL 为 `https://apikey.soxio.me/openai/v1`
7. 重启 Cursor
8. 新开一个对话，再选 `GPT-5.3 Codex`

本次正式接入建议的模型仍然是：

- `gpt-5.3-codex`

不建议这时切到：

- `Auto`
- `gpt-5.4`
- `gpt-5.4-medium`

原因：

- `Auto` 会重新落回 Cursor 自己的默认调度逻辑
- `gpt-5.4` 在当前本地环境里不稳定，容易被回写
- `gpt-5.4-medium` 当前网关不支持

如果你已经手动确认：

- `Bring-your-own-key` 已启用
- 页面明确显示 `Using key`
- Base URL 正确
- 仍然无法选择 `GPT-5.3 Codex`

那么更大的可能就是：

- 这个 Cursor 版本或当前账号状态，仍然对免费计划限制了命名模型选择

这时有两个现实选择：

- 升级 Cursor 套餐后继续使用命名模型
- 暂时退回 `Auto`

也就是说，这个报错的根因不一定是“接入失败”，也可能是“账号层和前端策略层仍然在拦”。 

## 最终结论

这次已经不是“只是把 API Key 填进去”的阶段，而是完成了一个可落地、可复查、可回滚的正式接入方案。

正式方案核心如下：

- API Key：复用当前 Codex 正在使用的那一套
- Base URL：`https://apikey.soxio.me/openai/v1`
- 正式模型：`gpt-5.3-codex`
- 自动固化：`E:\Finalize-Cursor-Codex.ps1`
- 正式文档：`E:\MyBlog\docs\cursor-codex-api-integration.md`
