---
title: OpenClaw Extensions 模块化架构总纲：从平台壳到模块闭环
date: 2026-03-26 22:20:00
slug: openclaw-extensions-architecture-blueprint
tags:
  - OpenClaw
  - Architecture
  - Modular Monolith
  - Module System
categories:
  - 架构设计
---

这篇文档不是某个局部功能的设计说明，而是 **OpenClaw Extensions 的总架构蓝图**。

它的目标很明确：

- 把工程从“顶层杂物间 + 多份副本 + 手工路由”的混合状态，收敛成一个 **模块化单体平台**
- 让平台、模块、运行态、控制台壳、Skill、MCP 的边界都变得可解释、可迁移、可校验
- 让人和 AI 在同一份结构约束下协作，而不是各自凭感觉写平行实现

为了便于执行，这篇文章会把架构方针拆成几块：

1. 项目定位
2. 设计目标
3. 分层模型
4. 目录结构
5. 模块标准
6. `kernel` 规范
7. 路由与依赖边界
8. `module.json` 声明模型
9. 导航、页面、Skill / MCP 定位
10. 平台级必要能力
11. 示例模板
12. 最终硬约束

如果你更关心“这套方案具体怎么落地、怎么迁、怎么约束 AI”，可以继续看下一篇：

- [OpenClaw Extensions 迁移与治理手册：路线图、检查规则与 AI 执行规范](/posts/openclaw-extensions-migration-and-ai-governance/)

## 1. 项目定位

OpenClaw Extensions 不是一个“大目录里堆很多功能页面”的工程，而是一个：

> **模块化单体平台（Modular Monolith Platform）**

它由三层组成：

```text
平台层
├─ 极小 kernel
├─ control-ui-custom 平台控制台壳
└─ 网关与模块加载配置

模块层
├─ 业务模块
├─ 能力模块
└─ 集成模块

运行层
├─ cache / browser / logs / temp / state
└─ 模块特有运行数据
```

这一定义很重要，因为它决定了项目不再追求“到处抽共享”，而是追求：

- 平台克制
- 模块闭环
- 声明驱动
- 运行态外置

## 2. 核心设计目标

整个架构只追求六件事。

### 2.1 模块闭环

每个模块必须自己收口自己的：

- 前端
- 后端
- 核心业务
- 对外契约
- 插件接入

### 2.2 平台克制

顶层只保留一个极小 `kernel`，只承载平台底座，不承担任何业务实现。

### 2.3 边界清晰

每个模块都必须有明确的：

- 页面前缀
- API 前缀
- 路由所有权
- 依赖边界
- 运行态归属

### 2.4 声明驱动

导航、页面、插件、运行目录、模块依赖都由声明驱动，不再依赖分散的手工配置。

### 2.5 迁移即清理

迁移不是复制。

迁移完成后必须删除旧目录、旧路由、旧副本、旧别名，不允许长期双份共存。

### 2.6 机器可校验

架构规则不能只靠文档和自觉，必须能被工具持续验证，例如：

- `dependency-cruiser`
- ESLint import boundary 规则
- `Semgrep`
- `jscpd`
- `Knip`
- 自定义检查脚本

## 3. 总体架构分层

### 3.1 平台控制台层：`control-ui-custom`

平台控制台不是业务模块，而是平台壳。

唯一真源：

```text
E:\Auto\projects\control-ui-custom
```

它的职责是：

- 提供平台统一入口壳
- 承载启动页和控制台 UI 壳
- 使用统一共享导航和共享前端行为
- 作为平台入口存在，但不进入 `extensions` 模块树

它必须遵守三条原则：

1. 控制台源码只允许有一份真源
2. `/control-ui-custom/*` 是访问路由，不等于源码必须放在 `extensions` 下
3. 禁止控制台镜像副本出现在业务模块目录或 `extensions/public` 中

### 3.2 平台内核层：`kernel`

`kernel` 只放平台底座，不放业务能力。

允许内容：

- `config`
- `db`
- `http`
- `obs`
- `web-shell`
- `types`
- `testing`

禁止内容：

- 小说管理实现
- 经验中心实现
- 发布流程实现
- 番茄扫描实现
- 飞书业务逻辑
- 任意模块私有业务代码

### 3.3 模块层

所有模块平行存在于：

```text
E:\Auto\projects\extensions
```

模块分三类：

| 类型 | 模块 |
| --- | --- |
| 业务模块 | `novel-manager`、`automation-hub`、`experience-manager`、`file-manager`、`ai-model-hub` |
| 能力模块 | `qmd`、`memory-lancedb-pro` |
| 集成模块 | `feishu-openclaw` |

### 3.4 运行层

运行态统一外置：

```text
E:\Auto\.runtime\extensions\<module>\
```

这里统一存放：

- `cache`
- `browser`
- `logs`
- `temp`
- `state`
- 模块特有运行数据，例如 `lancedb`、`models`

## 4. 顶层目录规划

最终顶层只允许存在下面这些内容：

```text
E:\Auto\projects\extensions
├─ kernel\
├─ novel-manager\
├─ automation-hub\
├─ experience-manager\
├─ file-manager\
├─ ai-model-hub\
├─ qmd\
├─ memory-lancedb-pro\
├─ feishu-openclaw\
├─ package.json
├─ package-lock.json
├─ tsconfig.base.json
├─ .eslintrc.cjs
├─ dependency-cruiser.cjs
└─ ARCHITECTURE.md
```

### 4.1 顶层明确禁止

迁移完成后，顶层明确禁止再出现：

- `core/`
- `plugins/`
- `public/`

### 4.2 非正式目录处理

像 `linear-cn-sample` 这类示例项目，不得与正式模块并列。

处理方式只有两个：

- 迁出到 `E:\Auto\projects\sandbox` 或 `E:\Auto\projects\examples`
- 直接删除

## 5. `control-ui-custom` 专项定位

这部分必须被单独强调，因为它不是普通业务模块，而是平台控制台壳。

### 5.1 当前状态

历史上这个部分存在一个典型误区：

- 表面上看有两份 `control-ui-custom`
- 实际上项目根目录那份曾经是一个 `Junction`
- 它指向的是 `extensions/public/control-ui-custom`

也就是说，过去很容易把“真源”和“镜像”看混。

### 5.2 当前状态树

```text
E:\Auto\projects
├─ openclaw.json
├─ control-ui-custom\                  # 平台控制台目录
├─ shared\
│  ├─ nav-bar.html
│  ├─ nav-bar-behavior.js
│  └─ sync-nav-bar.sh
└─ extensions\
   └─ public\
      └─ control-ui-custom\           # 历史镜像副本
```

### 5.3 目标状态树

```text
E:\Auto\projects
├─ openclaw.json
├─ control-ui-custom\                  # 唯一真源
├─ shared\
│  ├─ nav-bar.html
│  ├─ nav-bar-behavior.js
│  └─ sync-nav-bar.sh                  # 只允许同步到真源
└─ extensions\
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

### 5.4 核心约束

- 项目根 `control-ui-custom` 是唯一真源
- `extensions/public/control-ui-custom` 是历史镜像，必须删除
- `openclaw.json` 中 `gateway.controlUi.root` 只能指向项目根控制台目录
- 同步脚本只允许同步到真源，不再同步镜像

### 5.5 验收条件

只有以下条件全部满足，才算收口完成：

1. `gateway.controlUi.root` 正确
2. 项目根控制台为实体目录
3. 镜像副本已删
4. `/control-ui-custom/*` 仍能访问
5. 没有新的控制台副本复活

## 6. 模块标准结构规范

每个正式模块都必须是一个完整闭环：

```text
<module>\
├─ module.json
├─ frontend\
│  ├─ pages\
│  ├─ components\
│  ├─ assets\
│  ├─ state\
│  └─ api\
├─ backend\
│  ├─ routes\
│  ├─ controllers\
│  ├─ services\
│  ├─ repositories\
│  └─ migrations\
├─ core\
│  ├─ domain\
│  ├─ workflows\
│  ├─ schedulers\
│  └─ utils\
├─ contracts\
│  ├─ api\
│  ├─ dto\
│  ├─ events\
│  ├─ schema\
│  └─ index.ts
├─ plugin\
│  ├─ index.ts
│  └─ manifest.ts
├─ tests\
├─ package.json
├─ tsconfig.json
└─ index.ts
```

### 6.1 各层职责

| 目录 | 负责什么 | 禁止什么 |
| --- | --- | --- |
| `frontend` | 页面、组件、状态、本模块前端 API 适配层、静态资源 | 直接访问别的模块内部资源、手拼别的模块页面路径、直连共享全局 HTML |
| `backend` | API 路由、控制器、后端服务、仓储、迁移 | 偷写前端页面逻辑、偷写其他模块业务逻辑、深层导入别的模块内部实现 |
| `core` | 纯业务领域逻辑、业务流程、业务调度、模块内部工具 | 感知 HTTP、OpenClaw、控制台壳、插件系统细节 |
| `contracts` | DTO、API 请求/响应结构、共享 schema、公开事件、对外接口定义 | 放业务实现、数据库逻辑、控制器实现、内部 utils |
| `plugin` | 模块接入、注册页面前缀、注册 API 前缀、转发 frontend/backend | 写业务规则、复杂流程、模块核心逻辑 |

## 7. `kernel` 结构规范

推荐结构如下：

```text
kernel\
├─ config\
├─ db\
├─ http\
├─ obs\
├─ web-shell\
├─ types\
└─ testing\
```

### 7.1 各子目录职责

| 目录 | 职责 |
| --- | --- |
| `config` | 环境配置、路径解析、模块发现、运行态路径计算 |
| `db` | 数据库客户端、事务、通用迁移底座、健康检查 |
| `http` | 路由类型、响应封装、错误定义、校验中间件、插件路由适配 |
| `obs` | 日志、指标、tracing、健康检查汇总 |
| `web-shell` | 导航生成、页面壳、共享布局骨架、纯无业务语义前端基础件 |
| `types` | 全局基础类型 |
| `testing` | 模块边界检查、路由归属检查、`module.json` 检查、运行态路径检查、重复实现检查 |

### 7.2 `kernel` 红线

`kernel` 内明确禁止出现业务词，例如：

- `novel`
- `fanqie`
- `experience`
- `publishing`
- `story`
- `feishu-business`

更重要的是，禁止出现这些词对应的业务实现。

## 8. 模块分类与职责划分

### 8.1 业务模块

| 模块 | 职责 |
| --- | --- |
| `novel-manager` | 小说管理、作品、章节、发布、状态机、番茄扫描、内容流水线、业务调度 |
| `automation-hub` | 调度中心、自动化任务、定时任务、自动化流程、飞书相关流程编排 |
| `experience-manager` | 经验记录、笔记、经验列管理、云同步、记忆同步、经验相关 MCP 能力 |
| `file-manager` | 文件树、文件读写、watcher、文件规则、文件管理页面和 API |
| `ai-model-hub` | 模型列表、模型部署、微调、代理接入、sandbox |

### 8.2 能力模块

| 模块 | 职责 |
| --- | --- |
| `qmd` | 检索、文档能力、CLI、MCP 能力 |
| `memory-lancedb-pro` | 记忆存取、recall、capture、governance、MCP / CLI 能力 |

### 8.3 集成模块

| 模块 | 职责 |
| --- | --- |
| `feishu-openclaw` | 飞书接入、鉴权、事件回调、bot、消息通道 |

## 9. 路由所有权规范

每个模块只拥有自己的前缀。

| 模块 | 页面前缀 | API 前缀 | 其他 |
| --- | --- | --- | --- |
| `novel-manager` | `/novel` | `/api/novel/*` | 无 |
| `automation-hub` | `/automation` | `/api/automation/*` | 无 |
| `experience-manager` | `/experience` | `/api/experience/*` | 可选 MCP |
| `file-manager` | `/file-manager` | `/api/file-manager/*` | 无 |
| `ai-model-hub` | `/ai-hub` | `/api/ai-hub/*` | 可代理本地服务 |
| `qmd` | `/qmd` | `/api/qmd/*` | `mcp:qmd`、CLI |
| `memory-lancedb-pro` | `/memory` | `/api/memory/*` | `mcp:memory`、CLI |
| `feishu-openclaw` | `/feishu` | `/api/feishu/*` | 飞书集成 |

### 9.1 强约束

- 不允许一个模块代管另一个模块路由
- 不允许一个模块注册别的模块页面前缀
- 历史别名只允许短暂存在于切换窗口，之后必须删除

### 9.2 当前必须纠偏

- `novel-manager` 代管的 `experience` API 必须迁回 `experience-manager`
- `file-manager` 路由统一为 `/api/file-manager/*`
- `automation-hub` 收敛到 `/automation`
- `experience-manager` 收敛到 `/experience`
- `novel-manager` 收敛到 `/novel`

## 10. 模块依赖与协作规范

### 10.1 允许的跨模块依赖方式

只允许两种：

1. `@extensions/<module>/contracts`
2. `@extensions/<module>` 根级 `index.ts`

### 10.2 明确禁止

禁止深层导入：

- `other-module/core/**`
- `other-module/backend/**`
- `other-module/frontend/**`
- `other-module/plugin/**`

也禁止：

- 直读别的模块配置
- 直拼别的模块页面路径
- 直操作别的模块运行目录

### 10.3 协作优先级

优先：

- `contracts`
- 公开 `index.ts`
- 事件机制

次选：

- 拥有者模块的公开 API

禁止：

- 深层导入对方内部实现
- 把对方逻辑复制一份到自己模块

### 10.4 推荐事件场景

- 发布完成通知
- 自动化任务完成通知
- 经验同步通知
- 记忆更新通知
- 运维告警通知

事件定义推荐放在：

- `<module>/contracts/events`
- 或统一事件协议层

## 11. `module.json` 作为模块身份证

每个模块必须提供 `module.json` 作为唯一注册清单。

### 11.1 最低字段要求

```json
{
  "schemaVersion": "1.0",
  "id": "novel-manager",
  "displayName": "小说管理",
  "version": "1.0.0",
  "moduleType": "business",
  "owner": "openclaw",
  "status": "active",
  "routePrefix": "/novel",
  "apiPrefix": "/api/novel",
  "mcpNamespace": null,
  "frontend": {
    "enabled": true,
    "pagesDir": "frontend/pages",
    "assetsDir": "frontend/assets",
    "clientEntry": "frontend/client/index.ts",
    "nav": []
  },
  "backend": {
    "enabled": true,
    "entry": "backend/routes/index.ts"
  },
  "plugin": {
    "enabled": true,
    "entry": "plugin/index.ts",
    "manifest": "plugin/manifest.ts"
  },
  "dependencies": [],
  "capabilities": [],
  "runtime": {
    "scope": "module",
    "dirs": ["cache", "logs", "temp", "state"]
  },
  "features": {},
  "constraints": {
    "forbidDeepImports": true,
    "allowCrossModuleAccessOnlyVia": ["contracts", "index"]
  }
}
```

### 11.2 它的作用

`module.json` 不只是元数据文件，它还应该成为模块的唯一注册清单，用来驱动：

- 自动生成导航
- 自动注册页面
- 自动注册插件
- 自动注册前缀
- 自动创建运行态目录
- 自动校验依赖
- 自动发现 MCP 能力
- 自动执行启动期检查

## 12. 导航、页面与前后端分层规范

### 12.1 导航生成规则

- 各模块在 `module.json` 中声明导航项
- `kernel/web-shell` 汇总生成导航
- 不再手改全局 HTML
- 不再维护全局业务页面模板

### 12.2 页面归属规则

- 页面只能位于模块内 `frontend/pages`
- 页面路径必须属于本模块 `routePrefix`
- 页面只能调用本模块 API 适配层或 `contracts/client`
- 页面禁止直拼别的模块 API 路径

### 12.3 `control-ui-custom` 与模块页面关系

- `control-ui-custom` 是平台控制台壳
- 不属于业务模块页面
- 业务模块可以在平台壳里被导航到
- 但控制台源码不进入 `extensions`

### 12.4 前后端分层要求

| 层 | 只负责什么 |
| --- | --- |
| `backend/routes` | 路径分发、参数校验、调用 controller、返回标准响应 |
| `controllers` | 输入输出适配、调用 service、返回结果 |
| `services` | 应用服务编排、协调 `core` 与基础设施、连接 controller 与 domain |
| `repositories` | 数据访问、查询与持久化 |
| `core` | 领域逻辑、工作流、调度、状态规则、纯业务对象 |

## 13. Skill / MCP 在本项目中的定位

我们前面讨论过一个很关键的判断：

> **MCP 是工具能力层，Skill 是组合工作流层。**

把这个判断放回项目里，会得到三个结论。

### 13.1 默认后端模式不是 Skill / MCP

业务模块默认还是：

- `frontend`
- `backend`
- `core`
- `contracts`
- `plugin`

不是所有后端都做成 Skill / MCP。

### 13.2 Skill / MCP 更适合哪里

更适合：

- `qmd`
- `memory-lancedb-pro`
- `experience-manager` 中与记忆、同步、工具暴露相关的部分
- 将来需要对 AI / Codex 提供工具能力的部分

### 13.3 不适合作为默认后端架构的场景

- 小说管理 CRUD
- 自动化任务页面
- 文件管理页面
- 普通业务后台 API

### 13.4 定位总结

- 业务模块：以后端分层为主
- 能力模块：可以 `plugin + backend + mcp + cli`
- Skill：适合作为 AI 开发规范、浏览器操作规范、项目理解规范
- MCP：适合作为工具包与能力暴露层

## 14. 平台级必须具备的能力

这些不是某个业务模块的功能，而是整个平台必须具备的能力。

### 14.1 模块发现与注册

必须能：

- 扫描各模块 `module.json`
- 校验模块合法性
- 注册插件入口
- 注册页面与导航
- 注册 API 前缀

### 14.2 路由与页面归属校验

必须能：

- 检查 `routePrefix` 唯一
- 检查 `apiPrefix` 唯一
- 检查页面是否落在本模块下
- 检查是否有代管路由

### 14.3 运行态路径统一解析

必须提供：

- 模块运行态根路径计算
- `cache / logs / temp / state` 目录创建
- 模块运行态隔离

### 14.4 边界检查

必须能检查：

- 跨模块深层导入
- `kernel` 中出现业务词
- 未声明依赖的跨模块使用
- 页面调用跨模块 API

### 14.5 重复实现治理

必须能检查：

- 双份页面
- 双份路由
- `_old`、`_new`、`_temp`、`_fixed`
- 重复业务实现

### 14.6 控制台真源校验

必须检查：

- `gateway.controlUi.root` 不得指向 `extensions`
- `extensions/public/control-ui-custom` 不得复活
- 项目根 `control-ui-custom` 必须是实体目录

## 15. 示例模板

### 15.1 业务模块模板：`novel-manager`

```text
novel-manager\
├─ module.json
├─ frontend\
│  ├─ pages\
│  │  └─ novel\
│  │     ├─ index.html
│  │     ├─ app.js
│  │     └─ styles.css
│  ├─ components\
│  ├─ assets\
│  ├─ state\
│  └─ api\
├─ backend\
│  ├─ routes\
│  │  ├─ works.routes.ts
│  │  ├─ chapters.routes.ts
│  │  ├─ publish.routes.ts
│  │  └─ health.routes.ts
│  ├─ controllers\
│  ├─ services\
│  ├─ repositories\
│  └─ migrations\
├─ core\
│  ├─ domain\
│  ├─ workflows\
│  ├─ schedulers\
│  └─ utils\
├─ contracts\
│  ├─ api\
│  ├─ dto\
│  ├─ events\
│  ├─ schema\
│  └─ index.ts
├─ plugin\
│  ├─ index.ts
│  └─ manifest.ts
├─ tests\
├─ package.json
├─ tsconfig.json
└─ index.ts
```

### 15.2 能力模块模板：`qmd`

```text
qmd\
├─ module.json
├─ frontend\
├─ backend\
├─ core\
├─ contracts\
├─ plugin\
├─ mcp\
├─ cli\
├─ tests\
├─ package.json
├─ tsconfig.json
└─ index.ts
```

### 15.3 `module.json` 模板

```json
{
  "schemaVersion": "1.0",
  "id": "novel-manager",
  "displayName": "小说管理",
  "version": "1.0.0",
  "moduleType": "business",
  "owner": "openclaw",
  "status": "active",
  "routePrefix": "/novel",
  "apiPrefix": "/api/novel",
  "mcpNamespace": null,
  "frontend": {
    "enabled": true,
    "pagesDir": "frontend/pages",
    "assetsDir": "frontend/assets",
    "clientEntry": "frontend/client/index.ts",
    "nav": [
      {
        "id": "novel-manager-home",
        "title": "小说管理",
        "path": "/novel",
        "page": "frontend/pages/novel/index.html",
        "order": 10
      }
    ]
  },
  "backend": {
    "enabled": true,
    "entry": "backend/routes/index.ts"
  },
  "plugin": {
    "enabled": true,
    "entry": "plugin/index.ts",
    "manifest": "plugin/manifest.ts",
    "loadOrder": 100
  },
  "dependencies": [
    {
      "module": "kernel",
      "type": "platform",
      "required": true
    }
  ],
  "capabilities": [
    "novel.works",
    "novel.publishing",
    "novel.scanner"
  ],
  "runtime": {
    "scope": "module",
    "dirs": ["cache", "browser", "logs", "temp", "state"]
  },
  "features": {
    "publishing": true,
    "scheduler": true
  },
  "constraints": {
    "forbidDeepImports": true,
    "allowCrossModuleAccessOnlyVia": ["contracts", "index"]
  }
}
```

### 15.4 `plugin/index.ts` 模板

```ts
import { registerModulePages, registerModuleApi } from '@extensions/kernel/http/plugin-route-adapter';
import moduleMeta from '../module.json';

export function registerPlugin(app: unknown) {
  registerModulePages(app, {
    moduleId: moduleMeta.id,
    routePrefix: moduleMeta.routePrefix,
    pagesDir: 'frontend/pages'
  });

  registerModuleApi(app, {
    moduleId: moduleMeta.id,
    apiPrefix: moduleMeta.apiPrefix,
    backendEntry: 'backend/routes/index.ts'
  });
}
```

这里要强调一点：这个入口只做注册和转发，不写业务逻辑。

## 16. 最终硬约束

如果把整篇文档再压成短版约束，可以归纳为下面十条：

1. 根目录不再保留全局业务 `core / public / plugins`
2. 每个模块必须自带 `frontend + backend + core + contracts + plugin`
3. `kernel` 必须保持无业务语义
4. 跨模块访问只允许通过 `contracts` 或根级 `index.ts`
5. 禁止跨模块深层导入
6. 路由前缀归属唯一，不允许代管
7. 导航由 `module.json` 生成，不允许手改全局导航
8. 运行态必须移出源码树
9. 不允许双份页面、双份路由、双份业务实现长期共存
10. 迁移完成的标志不是“新目录能跑”，而是“旧目录已删除”

## 17. 一句话总结

这套规划的本质是：

> **把 OpenClaw 从“顶层全局业务杂物间 + 镜像副本 + 手工导航 + 路由越权”的混合工程，重构成“平台克制、模块闭环、声明驱动、边界可检查、运行态外置”的模块化单体平台。**
