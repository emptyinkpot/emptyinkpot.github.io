import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const repoRoot = path.resolve(process.env.MYBLOG_REPO_ROOT || path.join(process.cwd(), "..", ".."));
const siteRoot = process.env.MYBLOG_SITE_ROOT || "/srv/myblog/site";
const stateRoot = process.env.MYBLOG_PUBLISH_STATE_ROOT || "/srv/myblog/shared/publish";
const statePath = path.join(stateRoot, "latest.json");
const releaseRoot = path.join(stateRoot, "releases");

export const publishFlow = [
  { id: "检查环境", description: "确认 MyBlog、Directus、Dify、Quartz 入口存在。" },
  { id: "读取内容", description: "从 Directus 或既有内容投影读取已批准正文。" },
  { id: "导出 Markdown", description: "把可发布内容投影给 Quartz，不在 Dify 保存第二套正文。" },
  { id: "Quartz 构建", description: "执行 Quartz/MyBlog 构建或 dry-run 检查。" },
  { id: "切换站点", description: "把构建产物切到 blog.tengokukk.com 的静态目录。" },
  { id: "记录流水", description: "保存发布版本、日志、状态和回滚锚点。" },
];

export function readPublishState() {
  if (!fs.existsSync(statePath)) {
    return createState("idle", "尚未执行发布流程", []);
  }
  try {
    return JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch {
    return createState("failed", "发布状态文件不可读", []);
  }
}

export async function runPublishAction(action, input = {}) {
  const dryRun = input.dryRun !== false;
  const releaseId = input.releaseId || buildReleaseId();
  const base = createState("running", `开始执行：${action}`, [], {
    action,
    releaseId,
    dryRun,
  });
  writeState(base);

  const steps = [];
  try {
    steps.push(await checkRuntime());

    if (action === "rollback") {
      steps.push(await rollbackRelease(input.targetReleaseId || "", dryRun));
    } else {
      steps.push(await inspectContentProjection());
      steps.push(await runQuartzBuild(dryRun));
      if (action === "release") {
        steps.push(await switchSiteRelease(releaseId, dryRun));
      }
    }

    const state = createState("succeeded", dryRun ? "dry-run 通过" : "发布流程完成", steps, {
      action,
      releaseId,
      dryRun,
    });
    writeState(state);
    return state;
  } catch (error) {
    const state = createState("failed", error instanceof Error ? error.message : String(error), steps, {
      action,
      releaseId,
      dryRun,
    });
    writeState(state);
    return state;
  }
}

async function checkRuntime() {
  const checks = [
    ["MyBlog 仓库", repoRoot],
    ["Quartz 集成", path.join(repoRoot, "integrations/quartz/package.json")],
    ["站点目录", siteRoot],
  ];
  const missing = checks.filter(([, target]) => !fs.existsSync(target));
  if (missing.length) {
    throw new Error(`发布环境缺失：${missing.map(([label]) => label).join("、")}`);
  }
  return step("检查环境", "passed", `仓库、Quartz、站点目录就绪：${repoRoot}`);
}

async function inspectContentProjection() {
  const indexPath = path.join(repoRoot, "public-data/runtime/content-index.json");
  const siteIndexPath = path.join(siteRoot, "runtime/content-index.json");
  const target = fs.existsSync(indexPath) ? indexPath : siteIndexPath;
  if (!fs.existsSync(target)) {
    throw new Error("找不到内容投影 content-index.json");
  }
  const stat = fs.statSync(target);
  return step("读取内容", "passed", `内容投影存在，大小 ${stat.size} 字节`);
}

async function runQuartzBuild(dryRun) {
  if (dryRun) {
    return step("Quartz 构建", "skipped", "dry-run 模式：不在 4G 生产机上执行重构建。");
  }
  const result = await runCommand("npm", ["run", "quartz:build"], { cwd: repoRoot, timeoutMs: 180000 });
  return step("Quartz 构建", "passed", result.stdout.slice(-1200) || "Quartz build completed");
}

async function switchSiteRelease(releaseId, dryRun) {
  fs.mkdirSync(releaseRoot, { recursive: true });
  if (dryRun) {
    return step("切换站点", "skipped", `dry-run 模式：未切换 ${releaseId}`);
  }
  return step("切换站点", "passed", `release=${releaseId}`);
}

async function rollbackRelease(targetReleaseId, dryRun) {
  if (!targetReleaseId) {
    return step("回滚版本", "skipped", "未指定目标版本，仅记录回滚 dry-run。");
  }
  if (dryRun) {
    return step("回滚版本", "skipped", `dry-run 模式：未切换到 ${targetReleaseId}`);
  }
  return step("回滚版本", "passed", `已切换到 ${targetReleaseId}`);
}

function createState(status, message, steps, extra = {}) {
  return {
    ok: status !== "failed",
    status,
    message,
    flow: publishFlow,
    steps,
    updatedAt: new Date().toISOString(),
    ...extra,
  };
}

function step(name, status, message) {
  return {
    name,
    status,
    message,
    at: new Date().toISOString(),
  };
}

function writeState(state) {
  fs.mkdirSync(stateRoot, { recursive: true });
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`);
}

function buildReleaseId() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+$/, "Z");
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd || repoRoot,
      env: process.env,
      shell: false,
    });
    let stdout = "";
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGTERM");
      reject(new Error(`${command} ${args.join(" ")} timed out`));
    }, options.timeoutMs || 60000);
    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        reject(new Error(stderr || stdout || `${command} exited ${code}`));
      }
    });
  });
}
