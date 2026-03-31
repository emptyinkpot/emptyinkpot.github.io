---
title: OpenClaw Extensions 迁移与治理手册：路线图、检查规则与 AI 执行规范
description: 面向 OpenClaw Extensions 的迁移治理手册，覆盖阶段拆解、验收标准、目录收口、删除策略与 AI 执行边界。
date: 2026-03-26 22:32:00
slug: openclaw-extensions-migration-and-ai-governance
tags:
  - OpenClaw
  - Migration
  - Governance
  - AI Engineering
categories:
  - 工程治理
---

如果上一篇文章回答的是“这个平台最终应该长成什么样”，那这篇文章回答的就是：

> **它应该按什么顺序迁、怎么验收、哪些东西必须删，以及 AI / Codex 在这个项目里应该如何被约束。**

这不是一份“可以参考”的松散建议，而是一份可以直接执行的 **迁移治理手册**。
如果你想先看完整架构蓝图，再回来读迁移步骤，可以先读上一篇：

- [通用文件与模块开发规范：面向低耦合高内聚的模块化工程总纲](../general-modular-architecture-blueprint/)

## 1. 当前现状与核心问题

当前 `E:\Auto\projects\extensions` 顶层仍然只有：

```text
E:\Auto\projects\extensions
├─ core
├─ plugins
└─ public
```

这套结构的问题已经很明确：

1. 顶层 `core / plugins / public` 仍是全局业务杂物间，违反模块闭环。
2. `novel-manager` 仍在代管一部分 `experience` 接口，路由所有权失真。
3. `core` 中混有大量小说私有能力，并且反向依赖 `plugins/novel-manager`，边界方向错误。
4. 运行态目录仍混在源码树里，`browser / cache / logs / storage / temp / data` 没有外置。
5. 路由风格不统一，已经出现 `/file-manager/api/*` 与未来标准 `/api/file-manager/*` 不一致的问题。
6. 导航与页面仍有手工拼接、页面直读共享 HTML、旧别名路由并存的问题。
7. `extensions/public/control-ui-custom` 只是镜像副本，不是实际在线入口，应该退出正式源码结构。
8. `linear-cn-sample` 等示例目录与正式模块并列，持续污染边界。

## 2. 迁移总原则

迁移不是把代码“挪一下”，而是一次结构清理。

### 2.1 六条执行原则

1. 先收口平台壳，再迁模块。
2. 先搭底座，再纠偏路由。
3. 先做样板模块，再平推其他模块。
4. 每迁完一个模块就删旧目录。
5. 不搞长期双份共存。
6. 迁移完成的标志是“旧目录已删除”，不是“新目录能跑”。

### 2.2 迁移阶段固定顺序

```text
阶段 0：control-ui-custom 专项收口
阶段 1：workspace + kernel + 检查机制
阶段 2：路由所有权纠偏
阶段 3：novel-manager 样板迁移
阶段 4：experience-manager / automation-hub / file-manager / ai-model-hub
阶段 5：qmd / memory-lancedb-pro / feishu-openclaw
阶段 6：总切换 + 删除旧目录
```

## 3. `control-ui-custom` 专项收口计划

这一项必须在所有正式模块迁移之前完成。
原因很简单：

- 它会持续制造“平台壳”和“业务模块页面”的混淆。
- 它会把“访问路由”和“源码目录”混在一起。
- 如果不先收口，后面所有模块迁移都会建立在错误认知上。

### 3.1 当前补充发现

在正式执行专项时，还额外确认了一件隐藏问题：

1. `E:\Auto\projects\control-ui-custom` 历史上并不是实体目录，而是一个 `Junction`。
2. 这个 `Junction` 的目标正是 `E:\Auto\projects\extensions\public\control-ui-custom`。
3. 因此这里不是简单的“双份目录”，而是“一份真实目录 + 一个链接壳”。
4. 所以收口时不仅要删镜像，还必须把项目根目录恢复为真实实体目录。

### 3.2 当前状态树

```text
E:\Auto\projects
├─ openclaw.json
├─ control-ui-custom\                               # 实际在线控制台目录
│  ├─ assets\
│  ├─ shared\
│  ├─ index.html
│  ├─ launch.html
│  └─ bootstrap.js
├─ shared\
│  ├─ nav-bar.html
│  ├─ nav-bar-behavior.js
│  └─ sync-nav-bar.sh                              # 当前会同步两份 control-ui-custom
└─ extensions\
   └─ public\
      └─ control-ui-custom\                        # 历史镜像副本
```

### 3.3 收口后的目标树

```text
E:\Auto\projects
├─ openclaw.json
├─ control-ui-custom\                               # 唯一真源
│  ├─ assets\
│  ├─ shared\
│  ├─ index.html
│  ├─ launch.html
│  └─ bootstrap.js
├─ shared\
│  ├─ nav-bar.html
│  ├─ nav-bar-behavior.js
│  └─ sync-nav-bar.sh                              # 只允许同步到真源
└─ extensions\
   ├─ ARCHITECTURE.md
   ├─ kernel\
   ├─ novel-manager\
   ├─ automation-hub\
   ├─ experience-manager\
   ├─ file-manager\
   ├─ ai-model-hub\
   ├─ qmd\
   ├─ memory-lancedb-pro\
   └─ feishu-openclaw\
```

### 3.4 专项收口执行步骤

#### 第 1 组：真源确认

1. 确认 `E:\Auto\projects\control-ui-custom` 为唯一保留目录。
2. 确认 `E:\Auto\projects\extensions\public\control-ui-custom` 为镜像副本，不再保留。
3. 确认 `openclaw.json` 中 `gateway.controlUi.root` 固定指向 `E:/Auto/projects/control-ui-custom`。
4. 如果项目中 `control-ui-custom` 当前是 `Junction` 或其他链接壳，必须先拆掉链接关系，再恢复为真实实体目录。
5. 删除镜像副本之前，必须先搞清楚项目根目录是否依赖该镜像副本存在。

#### 第 2 组：配置收口

6. 禁止任何配置把 `gateway.controlUi.root` 指向 `extensions/public/control-ui-custom`。
7. 禁止后续再创建新的 `control-ui-custom-copy`、`control-ui-custom-fixed` 等副本目录。
8. 保留浏览器访问地址 `/control-ui-custom/index.html`、`/control-ui-custom/launch.html`、`/control-ui-custom/chat`，但只从真源目录提供资源。

#### 第 3 组：同步链路收口

9. 修改 `E:\Auto\projects\shared\sync-nav-bar.sh`，只允许同步到：
   - `E:\Auto\projects\shared`
   - `E:\Auto\projects\control-ui-custom\assets`
   - `E:\Auto\projects\control-ui-custom\shared`
10. 从同步脚本中移除：
   - `E:\Auto\projects\extensions\public\control-ui-custom\assets`
   - `E:\Auto\projects\extensions\public\control-ui-custom\shared`
11. 清理所有“为了同步两份控制台”而写的注释、说明和经验文档误导表述。

#### 第 4 组：目录删除

12. 删除 `E:\Auto\projects\extensions\public\control-ui-custom` 整个目录。
13. 删除后重新校验：
   - `http://127.0.0.1:5000/control-ui-custom/index.html`
   - `http://127.0.0.1:5000/control-ui-custom/launch.html`
   - `http://127.0.0.1:5000/control-ui-custom/chat`
14. 确认业务页面中引用的 `/control-ui-custom/assets/*` 仍然正常。

#### 第 5 组：自动化防回退

15. 在架构检查中新增规则：若 `gateway.controlUi.root` 指向 `extensions` 下任何目录，直接报错。
16. 在架构检查中新增规则：若再次出现 `extensions/public/control-ui-custom`，直接报错。
17. 在后续模块迁移中，不允许再把控制台源码拷贝进任何业务模块目录。

### 3.5 专项验收标准

只有以下条件全部满足，才算 `control-ui-custom` 收口完成：

1. `openclaw.json` 只指向 `E:\Auto\projects\control-ui-custom`。
2. `E:\Auto\projects\extensions\public\control-ui-custom` 已删除。
3. `sync-nav-bar.sh` 不再同步镜像副本。
4. `/control-ui-custom/*` 访问路径仍然可用。
5. `extensions` 根下不再出现任何控制台镜像副本。
6. `E:\Auto\projects\control-ui-custom` 必须是实体目录，不能再是 `Junction`、软链接或其他链接壳。

## 4. 当前来源到目标模块的主要归位关系

| 当前来源 | 目标归属 | 处理原则 |
| --- | --- | --- |
| `plugins/novel-manager/**` | `novel-manager/**` | 整体归位，`plugin` 变薄 |
| `core/audit/**` | `novel-manager/core/**` 或 `novel-manager/backend/**` | 审核属于小说业务，不留在 `kernel` |
| `core/content-craft/**` | `novel-manager/core/**` | 内容工艺属于小说业务核心 |
| `core/content-pipeline/**` | `novel-manager/core/**` | 内容流水线属于小说业务流程 |
| `core/pipeline/**` | `novel-manager/core/**` | 番茄扫描等业务流程归小说模块 |
| `core/publishing/**` | `novel-manager/core/**` | 发布流程属于小说业务 |
| `core/smart-scheduler/**` | `novel-manager/core/**` | 调度属于小说业务核心 |
| `core/state-machine/**` | `novel-manager/core/**` | 状态机属于小说业务领域 |
| `core/database/**` 中通用部分 | `kernel/db/**` | 只保留连接、事务、通用基建 |
| `core/database/**` 中业务表相关部分 | 对应业务模块 `backend/repositories/**` | 表、仓储、业务查询回模块 |
| `core/config.*` 中通用部分 | `kernel/config/**` | 仅保留通用环境配置 |
| `core/config.*` 中业务配置 | 对应模块 `module.json` 或模块 `backend/config/**` | 模块自己收口 |
| `plugins/experience-manager/**` | `experience-manager/**` | 维持已有分层思路，继续归一 |
| `plugins/automation-hub/**` | `automation-hub/**` | 前后端合并入模块 |
| `plugins/file-manager/**` | `file-manager/**` | 修正路由风格后归位 |
| `plugins/ai-model-hub/**` | `ai-model-hub/**` | 代理壳与实际服务边界收清 |
| `plugins/qmd/**` | `qmd/**` | 作为能力模块收口 |
| `plugins/memory-lancedb-pro/**` | `memory-lancedb-pro/**` | 作为能力模块收口 |
| `plugins/feishu-openclaw-plugin/**` | `feishu-openclaw/**` | 统一命名，去掉 `-plugin` 后缀 |

## 5. 从基线到总切换的完整执行步骤

下面这份顺序是强约束，没有完成上一步，不允许跳到下一步。

### A. 基线盘点阶段

1. 导出当前顶层目录清单、插件清单、页面清单、路由清单。
2. 导出 `openclaw.json` 当前 `plugins.load.paths`、路由前缀、控制台页面根路径。
3. 导出当前 `extensions/core` 中所有目录及其被谁引用。
4. 导出所有跨目录导入，重点关注：
   - `core -> plugins`
   - `plugins -> core`
   - `plugins -> public`
5. 标记所有旧页面别名和旧 API 别名，例如：
   - `/novel-manager`
   - `/novel-manager.html`
   - `/auto.html`
   - `/experience.html`
   - `/file-manager/api/*`
6. 生成迁移前清单文件，作为后续比对基线。

### B. 平台底座阶段

7. 在 `extensions` 根下建立 workspace 与 `package.json`。
8. 建立 `tsconfig.base.json`。
9. 建立统一路径别名规则，只允许：
   - `@extensions/kernel/*`
   - `@extensions/<module>`
   - `@extensions/<module>/contracts`
10. 建立 `.eslintrc.cjs` 与 import boundary 规则。
11. 建立 `dependency-cruiser.cjs`，禁止跨模块深层导入。
12. 建立 `kernel/testing` 下的校验脚本：
   - 模块边界检查
   - `module.json` 检查
   - 路由前缀检查
   - 重复实现检查
   - 运行态路径检查
13. 建立 `kernel/config/runtime-paths.ts`，统一解析 `E:\Auto\.runtime\extensions\<module>`。
14. 建立 `kernel/web-shell`，提供统一导航生成和页面壳能力。

### C. 模块骨架阶段

15. 在顶层创建正式模块目录：
   - `novel-manager`
   - `automation-hub`
   - `experience-manager`
   - `file-manager`
   - `ai-model-hub`
   - `qmd`
   - `memory-lancedb-pro`
   - `feishu-openclaw`
16. 给每个模块创建标准目录骨架：
   - `frontend`
   - `backend`
   - `core`
   - `contracts`
   - `plugin`
   - `tests`
17. 给每个模块创建 `module.json`、`package.json`、`tsconfig.json`、`index.ts`。
18. 先不删除旧目录，只建立新模块承接位置。

### D. 路由所有权纠偏阶段

19. 从 `novel-manager` 中拆出所有 `experience` 相关 API。
20. 把这些接口迁入 `experience-manager/backend/routes`。
21. 保证 `novel-manager` 只保留 `/api/novel/*`。
22. 保证 `experience-manager` 只保留 `/api/experience/*`。
23. 把 `file-manager` 的 `/file-manager/api/*` 统一改到 `/api/file-manager/*`。
24. 把 `automation-hub` 的页面入口统一到 `/automation`。
25. 把 `experience-manager` 的页面入口统一到 `/experience`。
26. 把 `novel-manager` 的页面入口统一到 `/novel`。
27. 保留旧别名只允许存在于切换窗口，切换完成后立即删除。

### E. `novel-manager` 样板迁移阶段

28. 把 `plugins/novel-manager` 的页面资源迁入 `novel-manager/frontend/pages/novel`。
29. 把 `plugins/novel-manager/services` 拆分为：
   - 通用应用服务 -> `novel-manager/backend/services`
   - 纯业务逻辑 -> `novel-manager/core`
30. 把 `plugins/novel-manager/utils` 拆分为：
   - 纯业务工具 -> `novel-manager/core/utils`
   - 插件适配工具 -> `novel-manager/plugin`
   - 通用无业务工具 -> `kernel/*`
31. 把 `core/audit` 迁入 `novel-manager`。
32. 把 `core/content-craft` 迁入 `novel-manager`。
33. 把 `core/content-pipeline` 迁入 `novel-manager`。
34. 把 `core/pipeline` 迁入 `novel-manager`。
35. 把 `core/publishing` 迁入 `novel-manager`。
36. 把 `core/smart-scheduler` 迁入 `novel-manager`。
37. 把 `core/state-machine` 迁入 `novel-manager`。
38. 把小说相关数据库访问从 `core/database` 拆到 `novel-manager/backend/repositories`。
39. 把小说公开 DTO、请求响应结构、事件定义放入 `novel-manager/contracts`。
40. 重写 `novel-manager/plugin/index.ts`，只负责：
   - 注册 `/novel`
   - 注册 `/api/novel/*`
   - 调用模块 backend / frontend 入口
41. 删除 `plugins/novel-manager` 旧实现。
42. 删除 `core` 中已迁出的小说业务目录。

### F. `experience-manager` 迁移阶段

43. 把 `plugins/experience-manager/src` 拆成 `frontend / backend / core / contracts / plugin`。
44. 把页面迁入 `experience-manager/frontend/pages/experience`。
45. 把 `records / notes / columns / cloud` 路由分别拆成独立 route 文件。
46. 把 MCP 相关能力放在 `experience-manager/mcp`。
47. 把公开类型和事件定义放入 `experience-manager/contracts`。
48. 清理对旧 `plugins/experience-manager` 路径的引用。
49. 删除 `plugins/experience-manager` 旧目录。

### G. `automation-hub` 迁移阶段

50. 把 `plugins/automation-hub/public` 页面迁入 `automation-hub/frontend/pages/automation`。
51. 把定时任务、飞书自动化、消息记录拆成独立后端 `route / service`。
52. 把插件入口缩成单一接入点。
53. 删除 `/auto.html` 长期入口。
54. 删除 `plugins/automation-hub` 旧目录。

### H. `file-manager` 迁移阶段

55. 把 `plugins/file-manager/public` 迁入 `file-manager/frontend/pages/file-manager`。
56. 把 `tree / file / watch` API 改造为 `backend/routes`。
57. 统一文件管理 API 前缀到 `/api/file-manager/*`。
58. 把文件系统、监听器、规则引擎分别收口到 `core` 与 `backend/services`。
59. 删除 `plugins/file-manager` 旧目录。

### I. `ai-model-hub` 迁移阶段

60. 把代理层、模型管理、部署管理、微调管理拆开。
61. 前端页面迁入 `ai-model-hub/frontend/pages/ai-hub`。
62. 后端路由统一到 `/api/ai-hub/*`。
63. 本地脚本或启动器放到模块 `scripts`，不再散落顶层。
64. 删除 `plugins/ai-model-hub` 旧目录。

### J. 能力模块与集成模块迁移阶段

65. 把 `qmd` 规范为：
   - `frontend`
   - `backend`
   - `core`
   - `contracts`
   - `plugin`
   - `mcp`
   - `cli`
66. 把 `memory-lancedb-pro` 规范为：
   - `frontend`
   - `backend`
   - `core`
   - `contracts`
   - `plugin`
   - `mcp`
   - `cli`
67. 把 `feishu-openclaw-plugin` 重命名并迁入 `feishu-openclaw`。
68. 删除 `plugins/qmd`、`plugins/memory-lancedb-pro`、`plugins/feishu-openclaw-plugin` 目录。

### K. 配置切换阶段

69. 调整 `openclaw.json`：
   - `plugins.load.paths` 指向各模块自己的 `plugin`
   - 不再指向 `extensions/plugins/*`
70. 控制台页面和业务页面全部改成从模块内 `frontend/pages` 提供。
71. 导航由 `module.json` 动态生成，不再手改共享导航 HTML。
72. 校验所有路由前缀无冲突。
73. 校验所有页面前缀无冲突。

### L. 运行态外置阶段

74. 建立 `E:\Auto\.runtime\extensions\<module>` 运行目录。
75. 将原 `extensions/core/browser` 迁出。
76. 将原 `extensions/core/cache` 迁出。
77. 将原 `extensions/core/logs` 迁出。
78. 将原 `extensions/core/storage` 迁出。
79. 将原 `extensions/core/temp` 迁出。
80. 修正所有运行态路径引用，全部通过 `kernel/config/runtime-paths.ts` 获取。

### M. 清理收尾阶段

81. 搜索并清理所有旧引用：
   - `extensions/plugins/`
   - `extensions/core/`
   - `extensions/public/`
82. 搜索并清理所有旧别名路由。
83. 搜索并清理 `_old`、`_new`、`_temp`、`_fixed` 等补丁式目录和文件。
84. 删除顶层 `extensions/core`。
85. 删除顶层 `extensions/plugins`。
86. 删除顶层 `extensions/public`。
87. 删除 `extensions/public/control-ui-custom` 镜像副本。
88. 迁出或删除 `linear-cn-sample`。

### N. 最终验收阶段

89. 运行模块边界检查。
90. 运行 `module.json` 合法性检查。
91. 运行路由前缀冲突检查。
92. 运行重复实现检查。
93. 启动网关验证每个模块页面是否可打开：
   - `/novel`
   - `/automation`
   - `/experience`
   - `/file-manager`
   - `/ai-hub`
   - `/qmd`
   - `/memory`
   - `/feishu`
94. 验证各模块 API 是否按标准前缀工作。
95. 验证源码树中已无运行态目录。
96. 验证顶层只剩平行模块、`kernel` 与 workspace 文件。

## 6. 执行中绝对不能犯的错

迁移期间，下面这些错误是硬性禁止的：

1. 不能先删旧目录，再补新目录。
2. 不能边迁移边新建副本目录长期共存。
3. 不能把小说业务继续塞进 `kernel`。
4. 不能让 `novel-manager` 再代管 `experience-manager` 的路由。
5. 不能把前端页面继续留在模块外。
6. 不能把运行态目录继续留在源码树。
7. 不能先改 `openclaw.json` 指向新路径，但新插件入口还没准备好。
8. 不能遗漏 `import / export / require` 路径修正。
9. 不能迁完代码却不删除旧实现。

## 7. 自动化治理规则

为了防止工程回退，治理规则必须工具化。

### 7.1 推荐工具

- `dependency-cruiser`
- ESLint import boundary 规则
- `Semgrep`
- `jscpd`
- `Knip`
- 自定义 `module.json` 检查脚本
- 自定义路由归属检查脚本
- 自定义 `control-ui-custom` 真源检查脚本

### 7.2 必做检查项

- 模块边界检查
- `module.json` 检查
- 路由前缀冲突检查
- 页面归属检查
- 运行态路径检查
- 重复实现检查
- 控制台路径检查

### 7.3 必须能拦住的问题

自动化治理至少要能拦住下面这些问题：

- 禁止跨模块深层导入
- 禁止 `kernel` 出现业务代码
- 禁止模块绕过 `contracts` 或根级 `index.ts`
- 检查路由前缀冲突
- 检查页面归属冲突
- 检查 `module.json` 字段完整性
- 检查运行目录声明合法性
- 检查 `_new / _old / _temp / _fixed` 等补丁式目录
- 检查 `gateway.controlUi.root` 不得指向 `extensions` 下任何路径
- 检查 `extensions/public/control-ui-custom` 不得复活

## 8. 模块迁移完成的验收清单

每迁完一个模块，都必须逐项通过：

1. 页面已归位到模块 `frontend/pages`。
2. API 已归位到模块 `backend/routes`。
3. 业务核心已归位到模块 `core`。
4. 公开契约已归位到模块 `contracts`。
5. 插件入口已归位到模块 `plugin`。
6. 旧模块目录已删除。
7. 不再依赖顶层旧目录。
8. 不再深层导入其他模块。
9. 运行态已移出源码。
10. `module.json` 已能驱动页面、导航、插件注册。

## 9. 迁移完成判定

一个模块只有满足以下条件，才算真正迁完：

1. 页面已归位到模块内部。
2. API 已归位到模块内部。
3. 核心业务已归位到模块内部。
4. 导入路径已修正。
5. 对旧顶层目录无深层依赖。
6. 旧副本已删除。
7. 路由前缀无冲突。
8. 导航已由 `module.json` 生成。
9. 运行态已迁出源码。

## 10. 迁移优先级总表

| 优先级 | 模块 | 原因 |
| --- | --- | --- |
| P0 | `novel-manager` | 业务最重、污染 `kernel` 最严重、路由越权最明显 |
| P1 | `experience-manager` | 先接回自己接口，消除 `novel-manager` 代管 |
| P1 | `automation-hub` | 页面和接口都较薄，适合快速收口 |
| P1 | `file-manager` | 路由风格不统一，需要先统一前缀 |
| P2 | `ai-model-hub` | 代理型模块，边界相对清晰 |
| P2 | `qmd` | 能力模块，适合独立成产品化结构 |
| P2 | `memory-lancedb-pro` | 能力模块，已经较独立 |
| P2 | `feishu-openclaw` | 集成模块，最后统一命名和入口 |

## 11. 给 AI / Codex 的项目开发规则摘录

为了防止 AI 继续制造平行实现，建议把下面这 10 条作为固定开发规则：

1. 先读 `ARCHITECTURE.md`。
2. 先找需求对应的模块归属。
3. 优先修改现有模块，不允许新建平行实现。
4. 跨模块访问只能走 `contracts` 或根级 `index.ts`。
5. 不允许在 `kernel` 写业务逻辑。
6. 页面必须归位到模块 `frontend/pages`。
7. API 必须归位到模块 `backend/routes`。
8. 迁移完成后必须删除旧路径。
9. 若新增页面、导航或插件配置，必须更新 `module.json`。
10. 若新增运行态目录，必须通过统一 runtime 规则声明。

## 12. 最终硬约束短版

如果把全部治理要求再压缩一次，可以变成下面 10 条：

1. 根目录不再保留全局业务 `core / public / plugins`。
2. 每个模块必须自带 `frontend + backend + core + contracts + plugin`。
3. `kernel` 必须保持无业务语义。
4. 跨模块访问只允许通过 `contracts` 或根级 `index.ts`。
5. 禁止跨模块深层导入。
6. 路由前缀归属唯一，不允许代管。
7. 导航必须由 `module.json` 生成，不允许手改全局导航。
8. 运行态数据必须移出源码树。
9. 不允许双份页面、双份路由、双份业务实现长期共存。
10. 迁移完成的标志不是“新目录能跑”，而是“旧目录已删除”。

## 13. 本计划的直接执行结论

这份迁移手册最后落到行动上，可以浓缩成五句话：

1. 以后不再使用 `modules/` 这一层。
2. 以后不再保留所谓兼容层目录。
3. 顶层 `core / plugins / public` 最终都会删，不是保留。
4. 真正的模块化不是“把代码挪一下”，而是把页面、路由、核心、契约、插件入口全部收回模块内。
5. `novel-manager` 必须作为第一块样板模块先做，因为它决定后续所有模块怎么落地。

## 14. 一句话总结

这套迁移与治理方案的本质是：

> **把 OpenClaw 从“顶层全局业务杂物堆 + 镜像副本 + 手工导航 + 路由越权”的混合工程，重构成“平台克制、模块闭环、声明驱动、边界可检查、运行态外置”的模块化单体平台，并让这套规则可以被人和 AI 一起稳定执行。**
