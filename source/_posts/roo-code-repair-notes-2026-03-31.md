---
title: Roo Code 修复记录（2026-03-31）
date: 2026-03-31 09:10:00
slug: roo-code-repair-notes-2026-03-31
tags:
  - Roo
  - VS Code
  - 修复记录
  - MCP
  - 排障
categories:
  - AI 工具链
---

这篇文章记录的是一次针对 Roo Code 在本机 VS Code 环境中的实际修复过程。它的价值不在于“修好了一个具体故障”，而在于把这次事件里真正的阻断点、修复顺序、恢复原则和下次排查应遵守的顺序沉淀下来。

## Symptom

这次故障一开始看起来像是 Roo 的历史记录或存储损坏，但后续排查证明，表面症状和真正的启动阻断点并不是同一层问题。

### 1. Roo history/storage corruption

最早暴露出来的现象，确实很像 Roo 自己的历史或存储数据损坏了。

表面上会让人怀疑：

- Roo 的历史记录已经不可用
- 私有存储内容已经坏掉
- 当前 MCP 配置投影可能已经失真
- 运行态读取的本地状态已经不可信

这类症状之所以危险，是因为它们很容易把排查方向完全锁死在 storage 层。

### 2. The actual startup blocker was extension bundle corruption

但继续往下查后，真正的结论是：

**这次真正阻断 Roo 启动的主因，不是 storage 本身，而是扩展 bundle 损坏。**

这条结论非常重要，因为它说明：

- storage 损坏可以是表层现象
- 配置不生效也可以只是连带结果
- 真正阻断启动的根因，有可能在扩展本体层

所以以后不能只根据第一层症状下结论。

## 这次修复时采取的动作

### A. Backups created first

这次处理里，第一步不是直接改，而是先做备份。

这一步必须保留为默认纪律，因为：

- 可以保留故障现场
- 可以防止修复过程中二次破坏
- 可以在判断错误时回到前一状态继续比对

以后凡是涉及 Roo 私有存储、MCP 配置、扩展目录的修复，都应该先做备份。

### B. Roo storage was repaired

接着进行了 Roo storage 层的修复。

这一层的修复是必要的，因为它直接关系到：

- 历史状态是否还能被正确读取
- 扩展私有持久化目录是否还能承担活动配置投影
- MCP 相关信息能否重新回到干净状态

但这一步虽然必要，却不是最终根因的全部答案。

### C. The broken extension bundle was patched

真正让问题被打通的一步，是对已损坏的扩展 bundle 进行修补。

这说明：

- 仅修 storage 不够
- 仅重建配置投影也不够
- 当扩展本体层已经损坏时，运行态根本无法稳定工作

这也是这次事故里最值得保留的经验。

### D. Original MCP links were restored into the active clean storage

在清理与修复完成后，还需要把原有 MCP 链接和相关接入关系恢复回当前干净的活动存储里。

因为“能启动”不等于“功能恢复完整”。

如果不把原有 MCP 链重新接回活动存储，那么后续依赖这些能力的运行链仍然会缺失。

## Active Roo storage

这次事故里，一个关键认识是：

**一定要分清当前活动 Roo storage 和历史备份、旧副本、候选目录。**

只有当前活动 storage 才真正决定：

- 当前 VS Code 会话里 Roo 在读什么
- 当前配置投影是否生效
- 当前 MCP 接入是否存在

## Active Roo MCP config

同理，活动 Roo MCP 配置才是后续判断“某个 MCP 到底是不是当前启用状态”的依据。

不能因为磁盘上看到了某个 MCP 文件或某个目录存在，就默认它已经进入当前活动链。

## Original Roo MCP config

保留原始 Roo MCP 配置的意义在于：

- 帮助恢复原来已经接入过的能力
- 作为修复后的对照基线
- 防止只修出一个“空白能启动”的状态

## Codex skills directory

这次修复还再次提醒了一件事：

Roo 的修复不能完全脱离 Codex 本地技能目录和本地能力层来理解。

因为本机工具链往往是：

- Roo 承担扩展运行态
- Codex 承担本地 skill 与部分知识能力
- 两边通过配置、目录和本地能力仓共同组成真实工作环境

## MCP servers confirmed present on disk

这次还确认了一点：

有一批 MCP servers 在磁盘上确实存在。

但这个事实只能说明“能力文件存在”，不能直接说明：

- 当前活动配置已经接入它们
- 当前 skill 已经在调用它们
- 当前运行态已经正确读取并启用它们

这也是以后判断 MCP 问题时必须保持的层次感。

## Recommended troubleshooting order next time

这次事故之后，比较稳的排查顺序应该固定成下面这样：

1. 先备份当前 storage、配置和关键目录
2. 先确认当前活动 storage 与活动配置到底是哪一份
3. 检查 MCP 配置投影是否仍然成立
4. 判断问题是 storage 层、配置层，还是扩展本体层
5. 如果现象解释不通，立即把 extension bundle corruption 纳入排查范围
6. 修复后把原有 MCP 链接恢复回活动干净存储
7. 最后再做 reload 和实际功能验证

## Important lesson from this incident

这次事故最重要的一条教训是：

**Roo 的问题不能只盯着 storage 看。**

因为：

- storage 损坏可能只是最早可见的症状
- 真正阻断启动的原因可能在扩展 bundle
- 修复时既要恢复可运行状态，也要恢复原有能力接入链

如果只修表面层，最后得到的往往只是一个“勉强能打开但功能不完整”的状态。

## Final status

这次修复最终沉淀出的状态结论是：

- 备份优先是必须保留的纪律
- storage 修复是必要步骤，但不能当成唯一根因
- 扩展 bundle 损坏是真正需要纳入标准排查范围的高优先级问题
- 修复完成后，必须把原有 MCP 接入恢复回当前活动干净存储

如果把这次事件压缩成一句话，那就是：

**当 Roo 表面上像是 storage 坏了时，不要急着把根因锁死在 storage 层；先备份，再分清活动配置，再把扩展 bundle 是否损坏纳入正式排查范围。**
