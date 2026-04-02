# GitHub Pages 发布排查记录（2026-03-31）

更新时间：2026-03-31

## 背景

- 触发场景：已完成本地提交并推送后，访问 `https://emptyinkpot.github.io/` 观察到“页面看起来没有变化”。
- 目标：确认是否已经发布到远端、是否部署成功、是否存在缓存或访问口径偏差，并沉淀可复用排查流程。

## 适用范围

- 场景 A：本地 `git push` 成功，但用户反馈线上页面无变化。
- 场景 B：Actions 显示成功，但页面内容与预期不一致。
- 场景 C：不同网络环境看到的页面不一致，怀疑缓存或代理链路问题。

## 快速入口（3 分钟判定）

1. 本地与远端是否同步：`git status -sb`
2. 目标提交是否部署成功：检查最新 `push` 工作流 `conclusion=success`
3. 线上是否有新路由/新 HTML 标记：`curl.exe -I` 与 `curl.exe -s` 取证

若以上三项均成立，优先判定为“缓存或预期偏差”，而不是“未发布”。

## 本次完整处理流程（按时间顺序）

1. 确认推送状态

   - 本地分支推送成功：`main -> main`
   - 目标提交：`c8f52d5ef1792900ab32d4505bb8e40f231d1509`
   - 二次确认：`git status -sb` 返回 `## main...origin/main`（本地与远端同步）

2. 排查推送失败风险（代理干扰）

   - 检查到 Git 配置代理：
     - `http.proxy=http://127.0.0.1:7890`
     - `https.proxy=http://127.0.0.1:7890`
   - 使用一次性禁用代理参数推送（不改全局配置）：
     - `git -c http.proxy= -c https.proxy= push origin main`

3. 验证 GitHub Actions 是否完成部署

   - 查询最近工作流运行状态。
   - 与目标提交匹配的 `push` 事件运行成功：
     - run id: `23800915251`
     - conclusion: `success`
     - head_sha: `c8f52d5ef1792900ab32d4505bb8e40f231d1509`

4. 验证线上是否已存在新站路由

   - 请求：`https://emptyinkpot.github.io/api-keys/`
   - 返回：`HTTP/1.1 200 OK`
   - `Last-Modified` 显示为本次部署时间窗口内

5. 验证首页 HTML 特征

   - 首页响应中可见新站特征，例如：
     - `meta name="generator" content="Astro v6.1.1"`
     - 导航存在 `Updates`、`Search` 等当前结构
   - 结论：服务端内容已更新，不是“未发布”。

## 结论

- 代码已推送，部署已成功，线上资源已更新。
- “看起来原样”更可能来自浏览器/链路缓存、或对“变化预期”与实际提交内容不一致。
- 带查询参数访问（如 `?v=timestamp`）仅用于绕过缓存调试，不是新网址。

## 模块化 SOP（可直接执行）

### 模块 1：确认本地状态

- 输入：本地仓库
- 操作：

```powershell
git status -sb
git log -1 --oneline
```

- 判定：
  - 通过：显示 `main...origin/main` 且最新提交为预期变更。
  - 失败：先完成提交/推送，再进入下一模块。
- 输出：目标 `head_sha`。

### 模块 2：推送与网络代理隔离

- 输入：模块 1 的 `head_sha`
- 操作：

```powershell
git config --get http.proxy
git config --get https.proxy
git -c http.proxy= -c https.proxy= push origin main
```

- 判定：
  - 通过：推送输出含 `main -> main`。
  - 失败：记录报错并优先排查代理/网络。
- 输出：确认已到远端的 `head_sha`。

### 模块 3：部署状态核验（Actions）

- 输入：模块 2 的 `head_sha`
- 操作：

```powershell
$r = Invoke-RestMethod -Uri "https://api.github.com/repos/emptyinkpot/emptyinkpot.github.io/actions/runs?per_page=5"
$r.workflow_runs | Select-Object -First 5 status,conclusion,event,head_sha,html_url
```

- 判定：
  - 通过：存在 `event=push` 且 `head_sha` 匹配、`conclusion=success`。
  - 失败：打开对应 `html_url` 查看失败步骤并修复后重试模块 3。
- 输出：部署运行链接与结论。

### 模块 4：线上内容取证（HTTP + HTML）

- 输入：部署成功结论
- 操作：

```powershell
curl.exe -I https://emptyinkpot.github.io/
curl.exe -I https://emptyinkpot.github.io/api-keys/
curl.exe -s https://emptyinkpot.github.io/ | findstr /i "Astro Updates Search"
```

- 判定：
  - 通过：关键路由 `200 OK`，首页含新站关键标记。
  - 失败：可能为构建产物或路由配置问题，回查 workflow 与构建目录。
- 输出：响应头证据（`Last-Modified`/`Age`/`X-Cache`）与 HTML 关键片段。

### 模块 5：客户端缓存验证

- 输入：模块 4 的服务端证据
- 操作：
  - 浏览器强刷：`Ctrl + F5`
  - 临时绕缓存访问：`https://emptyinkpot.github.io/?v=YYYYMMDD-HHmm`
- 判定：
  - 若带参数可见新内容：缓存问题成立。
  - 若仍无差异：进入模块 6 做“预期偏差”核对。
- 输出：缓存是否命中结论。

### 模块 6：预期偏差核对（变更是否真的包含该 UI）

- 输入：用户预期页面变化点
- 操作：

```powershell
git show --name-only --oneline -1
```

- 判定：
  - 通过：提交确实包含目标页面文件变更。
  - 失败：当前提交未包含用户期待的 UI 变更，需要补充提交。
- 输出：变更范围与“应见变化”的对照结论。

## 决策树

- Actions 失败 -> 先修 CI/CD，再验证线上。
- Actions 成功 + 线上关键标记已更新 -> 优先判定缓存或预期偏差。
- Actions 成功 + 线上关键标记未更新 -> 回查发布目录、分支、Pages 配置。

## 注意事项

- 在 PowerShell 中，`curl` 是 `Invoke-WebRequest` 别名，行为与 `curl.exe` 不同。为避免交互提示，请优先使用 `curl.exe`。
- 不建议长期依赖查询参数访问，确认发布后应回到正式地址：`https://emptyinkpot.github.io/`。

## 复盘记录模板（复制即用）

```md
# Pages 排查复盘（YYYY-MM-DD）

- 目标提交：<sha>
- 用户反馈：<现象>

## 模块执行结果

- 模块 1（本地状态）：通过/失败（证据：）
- 模块 2（推送与代理）：通过/失败（证据：）
- 模块 3（Actions）：通过/失败（run:）
- 模块 4（线上取证）：通过/失败（HTTP/HTML 证据：）
- 模块 5（缓存验证）：通过/失败（结论：）
- 模块 6（预期偏差）：通过/失败（结论：）

## 最终结论

- 根因：<缓存 / 预期偏差 / 部署失败 / 配置错误>
- 处理动作：<已执行动作>
- 后续防护：<脚本化 / 文档化 / 提醒项>
```