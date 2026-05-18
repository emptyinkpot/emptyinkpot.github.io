import fs from "node:fs"
import path from "node:path"
import { spawnSync } from "node:child_process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const contentRoot = path.join(path.dirname(repoRoot), ".myblog-quartz-content")
const userArgs = process.argv.slice(2)
const quartzArgs = ["build", "-d", contentRoot, ...withDefaultOutput(userArgs)]

try {
  assertBuildContentRoot(contentRoot)
  fs.rmSync(contentRoot, { recursive: true, force: true })
  fs.mkdirSync(contentRoot, { recursive: true })
  run(process.execPath, [
    path.join(repoRoot, "quartz/myblog/sync-content.mjs"),
    "--out",
    contentRoot,
  ])
  run(process.execPath, [path.join(repoRoot, "quartz/bootstrap-cli.mjs"), ...quartzArgs])
} finally {
  if (!process.env.MYBLOG_KEEP_BUILD_CONTENT) {
    fs.rmSync(contentRoot, { recursive: true, force: true })
  }
}

function withDefaultOutput(args) {
  if (args.includes("-o") || args.includes("--output")) return args
  return [...args, "-o", "apps/web/dist"]
}

function assertBuildContentRoot(target) {
  const resolvedTarget = path.resolve(target)
  const expectedTarget = path.resolve(path.dirname(repoRoot), ".myblog-quartz-content")
  if (resolvedTarget !== expectedTarget) {
    throw new Error(`Refusing to clean unexpected MyBlog build content root: ${resolvedTarget}`)
  }
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
  })

  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
