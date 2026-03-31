# Cursor 使用 Codex API 与权限状态说明

更新时间：2026-03-28 07:21:44 +08:00

## 文档定位

这份文档记录的是这台机器上 Cursor 的三类信息：

- 如何把 Cursor 接到当前 Codex 正在使用的 OpenAI-compatible API
- 这次我实际做过哪些检测、写入、备份和校验
- Cursor 当前真实权限状态、风险边界，以及以后如何自检，避免文档过时

这份文档刻意把两件事分开写：

- 目标接入状态：希望 Cursor 最终稳定落到什么配置
- 最新实测状态：我在本机刚刚重新读取到的实际值

如果两者冲突，以“最新实测状态”为准。

## 文档与相关文件位置

- 正式文档：`E:\MyBlog\docs\cursor-codex-api-integration.md`
- 旧备注跳转文件：`E:\Cursor-API-接入备注.md`
- 自动固化脚本：`E:\Finalize-Cursor-Codex.ps1`
- 自动固化日志：`E:\cursor-codex-finalize.log`

## 结论速览

- Cursor 已启用自定义 OpenAI Key：`useOpenAIKey = true`
- Cursor 当前 Base URL 为：`https://apikey.soxio.me/openai/v1`
- 当前账号状态仍显示：`membershipType = free`
- 目标正式模型仍然建议使用：`gpt-5.3-codex`
- 但最新实测里，`composer` 主入口当前又被回写成了 `default`
- 当前这台机器上，Cursor 的 Agent 不是“完全权限”状态
- 当前这台机器上，`sandboxSupported = false`
- 当前这台机器上，命令执行在本机 `LocalProcess host` 上，不是在隔离沙箱里

最重要的现实结论只有两条：

1. API 接入这部分已经做成了，而且有脚本可以在 Cursor 退出后固化。
2. 权限这部分不稳定，刚才尝试过写成“完全权限”，但 Cursor 运行时又回写成了受限状态。

## 本机最新实测状态

以下内容来自我在 2026-03-28 07:21 左右直接读取本机 Cursor 状态库和日志的结果。

### API 与模型相关

| 项目 | 最新值 | 说明 |
| --- | --- | --- |
| `useOpenAIKey` | `true` | Cursor 已启用自定义 Key |
| `openAIBaseUrl` | `https://apikey.soxio.me/openai/v1` | 当前数据库里的实际 Base URL |
| `membershipType` | `free` | 账号层仍是免费计划 |
| `cmd-k` | `gpt-5.3-codex` | 已固定 |
| `composer` | `default` | 当前主 Composer 入口没有稳定固定住 |
| `background-composer` | `gpt-5.3-codex` | 已固定 |
| `composer-ensemble` | `gpt-5.3-codex` | 已固定 |
| `plan-execution` | `gpt-5.3-codex` | 已固定 |
| `spec` | `gpt-5.3-codex` | 已固定 |
| `deep-search` | `gpt-5.3-codex` | 已固定 |
| `quick-agent` | `gpt-5.3-codex` | 已固定 |

补充说明：

- 目标状态本来是把以上所有入口都固定到 `gpt-5.3-codex`
- 但最新读取结果里，`composer` 当前是 `default`
- 这说明运行中的 Cursor 仍然存在状态回写行为
- `E:\Finalize-Cursor-Codex.ps1` 的作用，就是在 Cursor 完全退出后把目标模型状态重新写回去

### Agent 权限相关

| 项目 | 最新值 | 说明 |
| --- | --- | --- |
| `agent.autoRun` | `true` | Agent 可以自动执行一部分动作 |
| `agent.fullAutoRun` | `false` | 当前不是 `Run Everything` |
| `triage.fullAutoRun` | `false` | 当前不是全自动委派模式 |
| `yoloEnableRunEverything` | `false` | 没有开启完全放权 |
| `yoloOutsideWorkspaceDisabled` | `true` | 工作区外写入保护当前是开着的 |
| `yoloDeleteFileDisabled` | `false` | 文件删除保护当前是关着的 |
| `yoloMcpToolsDisabled` | `false` | MCP 工具保护当前是关着的 |
| `playwrightProtection` | `false` | 浏览器工具保护当前是关着的 |

这组值的含义是：

- 它不是默认纯只读
- 但它也不是“完全权限”
- 它现在更接近“能跑命令、能改文件，但仍受一部分模式和工作区边界限制”的状态

### 运行环境相关

| 项目 | 最新值 | 说明 |
| --- | --- | --- |
| `sandboxSupported` | `false` | 这台机器上 Cursor 没有真正可用的命令沙箱 |
| Shell Exec Host | `LocalProcess host` | 命令直接在本机进程环境执行 |
| 当前工作区 | `file:///e%3A/` | Cursor 当前最后活跃窗口打开的是整个 `E:\` |

这意味着：

- 如果以后把 `External-File Protection` 也关掉，而工作区还是 `E:\`，那可操作范围会非常大
- 即便 UI 里出现 “Run in Sandbox” 一类文案，这台机器的日志也明确显示沙箱能力当前不可用

## 这次涉及到的本地文件

### Codex 侧

- `C:\Users\ASUS-KL\.codex\config.toml`
- `C:\Users\ASUS-KL\.codex\auth.json`

### Cursor 侧

- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\settings.json`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\storage.json`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\logs\20260328T064748\window1\renderer.log`
- `E:\Program Files (x86)\cursor\resources\app\out\vs\workbench\workbench.desktop.main.js`

### 本次生成或确认过的备份

- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-backup-20260328-062610`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-backup-20260328-063352`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-backup-20260328-063747`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-backup-20260328-064122`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-backup-20260328-064746`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb.codex-fullperm-backup-20260328-071800`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb-wal.codex-fullperm-backup-20260328-071800`
- `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb-shm.codex-fullperm-backup-20260328-071800`

## Codex 当前实际使用的配置

本次从 Codex 本地配置里确认到：

- `base_url = https://apikey.soxio.me/openai`
- `model = gpt-5.4`
- API Key 存在于 `auth.json` 的 `OPENAI_API_KEY`

这里有一个关键区别：

- Codex 的原始 `base_url` 是 `https://apikey.soxio.me/openai`
- Cursor 最终应该使用的是 `https://apikey.soxio.me/openai/v1`

原因是 Cursor 和网关的拼接逻辑与 Codex 不完全一样。

## API 正式接入的完整步骤

### 1. 先确认 Codex 到底在用什么

这一步确认三件事：

- API Key 从哪来
- 原始 Base URL 是什么
- 当前 Codex 模型是什么

本次确认结果：

- Key 来自 `C:\Users\ASUS-KL\.codex\auth.json`
- 原始 Base URL 来自 `C:\Users\ASUS-KL\.codex\config.toml`
- 当前 Codex 模型是 `gpt-5.4`

### 2. 验证网关真正可用的 OpenAI-compatible 路径

这一步不能只看配置文本，必须看真实接口行为。

本次探测结果：

- `https://apikey.soxio.me/openai/chat/completions` 返回 `404`
- `https://apikey.soxio.me/openai/v1/chat/completions` 可以访问
- 当前网关对非流式请求表现不友好
- 流式聊天接口才是更接近 Cursor 实际使用场景的路径

结论：

- Cursor 的 `openAIBaseUrl` 不能写成 `/openai`
- 应该写成 `/openai/v1`

### 3. 验证网关支持哪些模型

本次实测中，可访问或曾确认可返回的模型包括：

- `gpt-5.4`
- `gpt-5.3-codex`
- `gpt-5.2-codex`
- `gpt-5.2`

本次确认不建议使用：

- `gpt-5.4-medium`

### 4. 备份 Cursor 数据库

这是正式接入前必须做的动作。

至少要备份：

- `state.vscdb`

如果 Cursor 正在运行，最好连同下面两个文件一起备份：

- `state.vscdb-wal`
- `state.vscdb-shm`

### 5. 修改的不是普通 `settings.json`

这次最关键的知识点之一就是：

- 普通 `settings.json` 并不是 Cursor 里模型、BYOK、权限状态的主存储
- 真正关键的数据主要在 `state.vscdb`

核心落点：

- 表：`ItemTable`
- 关键键：`cursorAuth/openAIKey`
- 关键键：`src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser`

### 6. 写入 OpenAI Key

这一步把当前 Codex 正在使用的同一套 Key 写给 Cursor。

落点：

- `ItemTable.key = cursorAuth/openAIKey`

注意：

- 文档不记录完整明文 Key
- 只记录来源和写入位置

### 7. 写入 BYOK 开关和 Base URL

在 `applicationUser` 这段 JSON 里写入或确认：

- `useOpenAIKey = true`
- `openAIBaseUrl = https://apikey.soxio.me/openai/v1`

### 8. 选择 Cursor 更稳定识别的正式模型

正式接入时不能只看接口支持，还要看 Cursor 本地是否稳定认这个模型名。

本次最终建议：

- 正式使用 `gpt-5.3-codex`

原因：

- 网关支持它
- Cursor 对它的识别更稳定
- 它比 `gpt-5.4` 更适合作为当前环境下的正式固定模型

### 9. 写入各 AI 入口的模型配置

目标入口包括：

- `cmd-k`
- `composer`
- `background-composer`
- `composer-ensemble`
- `plan-execution`
- `spec`
- `deep-search`
- `quick-agent`

目标状态是统一写成：

- `modelName = gpt-5.3-codex`
- `maxMode = false`

并配套写入：

- `previousModelBeforeDefault`
- `modelOverrideEnabled`

### 10. 处理 Cursor 运行时回写

这是这次最现实的问题之一。

我已经确认到：

- Cursor 运行中会回写部分模型配置
- 权限配置也可能被运行态覆盖
- 所以“数据库里刚写好”不等于“最终稳定生效”

为了解决模型和 API 接入的稳定性，这次已经放了自动固化脚本：

- `E:\Finalize-Cursor-Codex.ps1`

它的真实作用是：

1. 等 Cursor 完全退出
2. 备份 `state.vscdb`
3. 把 `openAIBaseUrl`、`useOpenAIKey` 和各模型入口重新写回
4. 记录日志到 `E:\cursor-codex-finalize.log`

它当前不做的事情：

- 不负责固化权限相关开关
- 不负责把 Agent 永久切成 `Run Everything`

## 到目前为止我实际做过的操作

### 已完成的检测

- 检查了 Codex 的本地配置来源
- 检查了 Codex 的 `base_url` 与模型
- 逆向定位了 Cursor 的实际配置落点
- 读取了 Cursor 本地状态库 `state.vscdb`
- 验证了网关真实可用的 `/openai/v1` 路径
- 检查了 Cursor 本地代码里的 Agent 权限文案和默认值
- 检查了运行日志里的 `sandboxSupported=false`
- 检查了当前工作区是 `E:\`

### 已完成的写入

- 已把当前 Codex 使用的 API Key 写入 Cursor
- 已启用 `useOpenAIKey = true`
- 已把 Base URL 写成 `https://apikey.soxio.me/openai/v1`
- 已把多数 AI 入口固定到 `gpt-5.3-codex`
- 已部署 `E:\Finalize-Cursor-Codex.ps1` 用于在 Cursor 退出后重新固化模型与 API 配置

### 已完成但当前未稳定保留的写入

我曾经把权限相关字段临时写成过更激进的状态，包括：

- `yoloEnableRunEverything = true`
- `yoloOutsideWorkspaceDisabled = false`
- `agent.fullAutoRun = true`
- `triage.fullAutoRun = true`

但最新实测再次读取数据库时，当前值已经回到了：

- `yoloEnableRunEverything = false`
- `yoloOutsideWorkspaceDisabled = true`
- `agent.fullAutoRun = false`
- `triage.fullAutoRun = false`

所以这里必须明确写清楚：

- “曾写入成功”不等于“当前仍生效”
- 以最新回读结果为准

## 在 Cursor 里到底怎么用，应该选哪个模型

### 理想情况

如果 Cursor 设置页已经识别你在使用自己的 Key，而且能手动选命名模型，那么当前建议：

- 优先选 `gpt-5.3-codex`

不建议当前直接作为正式模型使用：

- `Auto`
- `gpt-5.4`
- `gpt-5.4-medium`

原因：

- `Auto` 不是固定模型，更像 Cursor 的路由入口
- `gpt-5.4` 在这台机器上的 Cursor 配置里不稳定
- `gpt-5.4-medium` 当前不建议使用

### 如果界面提示 `Free plans can only use Auto`

这条提示不一定代表 API 没接上。

更常见的几种解释是：

- 当前会话没有被前端识别成 “Using key”
- 免费计划的前端或账号层逻辑仍然限制命名模型选择
- 当前主 `composer` 入口又回到了 `default`

也就是说：

- 本地数据库里启用了 BYOK
- 不代表前端一定会立刻放开命名模型选择

### 关于 `Auto` 的真实含义

本地证据能说明的只有：

- `Auto` 更像 Cursor 的路由层，不是一个固定模型名
- 它不是一个你可以从本地配置里直接映射成单一上游 API 的名字

本地证据不能诚实说明的内容：

- 不能仅凭当前文件就断言 `Auto` 一定使用了哪一个具体上游模型
- 也不能仅凭当前文件就断言 `Auto` 一定走你自己的 API

如果你想尽量明确走自己的 API，而不是继续交给 `Auto` 路由，那就要尽量满足这几个条件：

- `Bring-your-own-key` 明确显示 `Using key`
- Base URL 保持正确
- 目标入口被固定成具体模型名，而不是 `default`
- 重开 Cursor 后重新开新对话测试

## Cursor 里的模型是否对电脑有完全权限

最新实测结论：

- 当前不是完全权限

但也不是没有权限。

当前 Agent 的能力边界更准确地说是：

- 可以计划任务
- 可以搜索
- 可以编辑文件
- 可以运行命令
- 但当前不是 `Run Everything`
- 工作区外保护当前仍然开启

## 什么情况下它才接近“完全权限”

要接近你理解中的“完全权限”，至少通常要同时满足下面这些条件：

- `yoloEnableRunEverything = true`
- `agent.fullAutoRun = true`
- `triage.fullAutoRun = true`
- `yoloOutsideWorkspaceDisabled = false`
- 相关保护项按需要关闭
- Cursor 进程本身拥有足够高的 Windows 权限

即便这样，也仍然要记住：

- 它拿到的只是 Cursor 进程本身的权限
- 如果你不是以管理员身份启动 Cursor，它也不会凭空越过 UAC 变成系统管理员

## 当前这台机器上的权限风险边界

这部分是最容易被误解的，所以单独列出来。

### 已确认的风险

- `sandboxSupported = false`
- 命令执行在 `LocalProcess host`
- 当前工作区是整个 `E:\`

这意味着：

- 一旦你把工作区外保护关掉，风险范围会非常大
- 即使看到“Run in Sandbox”之类的说法，也不能把它当成这台机器上真实生效的隔离保障

### 当前仍然存在的限制

- `Run Everything` 没开
- `fullAutoRun` 没开
- 工作区外保护没关

所以最新实测状态下，Cursor 还没有达到你要求的“完全权限”。

## 为什么这份文档不会很快过时

我这次做了三件事，专门降低过时风险：

1. 把“目标状态”和“最新实测状态”拆开写
2. 把所有容易变动的项都改成“本机最后一次回读结果”
3. 加上自检命令，后面可以自己复核

也就是说，这份文档不是靠“记忆中的结论”写的，而是靠：

- 当前数据库回读
- 当前日志回读
- 当前脚本内容
- 当前本地 Cursor 代码文案

## 自检方法

以后如果你再改过配置，或者怀疑文档过时，直接复跑下面几类检查。

### 1. 检查最新的 API、模型和权限状态

```powershell
@'
import sqlite3, json
path = r"C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb"
conn = sqlite3.connect(path)
cur = conn.cursor()
key = "src.vs.platform.reactivestorage.browser.reactiveStorageServiceImpl.persistentStorage.applicationUser"
row = cur.execute("SELECT CAST(value AS TEXT) FROM ItemTable WHERE key=?", (key,)).fetchone()
data = json.loads(row[0])
print(json.dumps({
  "useOpenAIKey": data.get("useOpenAIKey"),
  "openAIBaseUrl": data.get("openAIBaseUrl"),
  "membershipType": data.get("membershipType"),
  "aiSettings": data.get("aiSettings", {}).get("modelConfig"),
  "composerState": {
    "yoloEnableRunEverything": data.get("composerState", {}).get("yoloEnableRunEverything"),
    "yoloOutsideWorkspaceDisabled": data.get("composerState", {}).get("yoloOutsideWorkspaceDisabled"),
    "yoloDeleteFileDisabled": data.get("composerState", {}).get("yoloDeleteFileDisabled"),
    "yoloMcpToolsDisabled": data.get("composerState", {}).get("yoloMcpToolsDisabled"),
    "playwrightProtection": data.get("composerState", {}).get("playwrightProtection"),
    "modes4": data.get("composerState", {}).get("modes4"),
  }
}, ensure_ascii=False, indent=2))
conn.close()
'@ | py -3 -
```

### 2. 检查这台机器是否真的有沙箱

```powershell
rg -n "sandboxSupported=false|LocalProcess host" `
  "C:\Users\ASUS-KL\AppData\Roaming\Cursor\logs\20260328T064748\window1\renderer.log"
```

### 3. 检查当前工作区是不是整个 `E:\`

```powershell
Get-Content -Raw "C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\storage.json"
```

重点看：

- `lastActiveWindow.folder`
- `backupWorkspaces.folders`

### 4. 检查自动固化脚本到底固化了什么

```powershell
Get-Content "E:\Finalize-Cursor-Codex.ps1"
```

如果脚本里没有写权限相关字段，那就不要误以为它会帮你固定 `Run Everything`。

## 回滚方式

如果要回滚到之前的状态，按这个顺序做：

1. 完全退出 Cursor
2. 选一个你要恢复的 `state.vscdb` 备份
3. 用备份覆盖当前：
   - `C:\Users\ASUS-KL\AppData\Roaming\Cursor\User\globalStorage\state.vscdb`
4. 如果当时有对应的 `-wal` 和 `-shm` 备份，也一并恢复
5. 再打开 Cursor

## 关键知识点汇总

### 知识点 1：Cursor 的主配置不在 `settings.json`

- `settings.json` 很普通
- 真正关键的是 `state.vscdb`

### 知识点 2：Codex 的原始 `base_url` 不能直接照抄给 Cursor

- Codex 当前读取到的是 `/openai`
- Cursor 这里最终要用的是 `/openai/v1`

### 知识点 3：设置页校验失败，不等于聊天一定不可用

- 当前网关对非流式请求并不友好
- Cursor 设置页的校验逻辑和真实聊天链路不是一回事

### 知识点 4：接口支持某模型，不等于 Cursor 本地就稳定支持这个模型名

- `gpt-5.4` 在接口层可访问
- 但在当前 Cursor 环境里不够稳定

### 知识点 5：`default` 不等于你指定了固定模型

- `default` 更像平台路由入口
- 它不是“我明确就用这个模型”的意思

### 知识点 6：`Auto` 不是一个你能本地精确指认的固定上游模型

- 它更接近 Cursor 的路由层
- 不能诚实地把它说成某一个单独 API

### 知识点 7：权限配置会被运行中的 Cursor 回写

- 这次已经实际观察到这一点
- 所以必须以最新回读为准

### 知识点 8：当前自动固化脚本只固化 API 和模型，不固化权限

- `E:\Finalize-Cursor-Codex.ps1` 当前只处理接入配置
- 不处理永久权限放开

### 知识点 9：这台机器上没有真正可用的命令沙箱

- 日志明确显示 `sandboxSupported=false`
- 命令跑在本机 `LocalProcess host`

### 知识点 10：如果工作区是整个 `E:\`，权限风险会被放大

- 保护一旦关掉，影响范围就不是一个项目目录，而是整个盘

## 现在最实用的建议

- 如果你的目标是稳定用自己的 API，优先让 Cursor 完全退出，然后让 `E:\Finalize-Cursor-Codex.ps1` 跑完，再重新打开测试
- 如果你的目标是“真的完全权限”，那就不能只看这份文档，必须在 Cursor 退出状态下重新写权限项，并在重启后立刻复核它有没有又被回写
- 如果 UI 还提示 `Free plans can only use Auto`，先不要直接判断接入失败，要先区分是前端限制、账号层限制，还是主入口被回写成了 `default`

