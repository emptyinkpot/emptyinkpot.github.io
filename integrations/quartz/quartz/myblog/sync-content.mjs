import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const contentRoot = path.resolve(
  readArgValue("--out") || process.env.MYBLOG_CONTENT_ROOT || path.join(repoRoot, "content"),
)
const defaultVaultRoot =
  process.env.MYBLOG_VAULT_ROOT ||
  (process.platform === "win32" ? "E:/Vaults/Obsidian/docs" : "/home/vault/Obsidian/docs")
const sourceRootLabel = process.env.MYBLOG_RUNTIME_SOURCE_ROOT_LABEL || "/home/vault/Obsidian/docs"
const openListRootLabel =
  process.env.MYBLOG_RUNTIME_OPENLIST_ROOT_LABEL || "/openlist/Obsidian/docs"

const vaultRoot = path.resolve(readArgValue("--vault") || defaultVaultRoot)

if (!fs.existsSync(vaultRoot)) {
  ensureFallbackIndex()
  process.exit(0)
}

const markdownFiles = listMarkdownFiles(vaultRoot)
const articles = markdownFiles
  .map((filePath) => toQuartzArticle(filePath, vaultRoot))
  .filter(Boolean)
  .sort((a, b) => a.outputPath.localeCompare(b.outputPath, "zh-CN"))

resetContentRoot()
for (const article of articles) {
  writeFile(article.outputPath, article.markdown)
}

if (!articles.some((article) => article.slug === "index")) {
  writeFile(
    path.join(contentRoot, "index.md"),
    [
      "---",
      "title: MyBlog",
      "description: Quartz-primary digital garden with MyBlog style plugins.",
      "tags:",
      "  - myblog",
      "  - quartz",
      "---",
      "",
      "# MyBlog",
      "",
      "This Quartz garden is generated from the public Obsidian/Vault Markdown projection.",
      "",
      articles
        .slice(0, 24)
        .map((article) => `- [[${article.linkTarget}|${article.title}]]`)
        .join("\n"),
      "",
    ].join("\n"),
  )
}

console.log(
  `Synced ${articles.length} public Markdown file(s) from ${vaultRoot} into ${contentRoot}.`,
)

function ensureFallbackIndex() {
  fs.mkdirSync(contentRoot, { recursive: true })
  const fallback = path.join(contentRoot, "index.md")
  if (fs.existsSync(fallback)) {
    console.log(`Vault root not found: ${vaultRoot}`)
    console.log("Keeping existing Quartz content.")
    return
  }

  writeFile(
    fallback,
    [
      "---",
      "title: MyBlog",
      "description: Quartz-primary MyBlog garden. Set MYBLOG_VAULT_ROOT to sync real content.",
      "tags:",
      "  - myblog",
      "  - quartz",
      "---",
      "",
      "# MyBlog",
      "",
      "Quartz is the primary framework. MyBlog behavior lives in Quartz plugins and content projection.",
      "",
    ].join("\n"),
  )
  console.log(`Vault root not found: ${vaultRoot}`)
  console.log("Created fallback content/index.md.")
}

function toQuartzArticle(absolutePath, root) {
  const relativePath = toSlash(path.relative(root, absolutePath))
  if (isPrivatePath(relativePath)) return null

  const source = fs.readFileSync(absolutePath, "utf8")
  const parsed = parseFrontmatter(source)
  const data = parsed ? parseYamlish(parsed.frontmatter) : {}
  const rawBody = parsed ? parsed.body : source
  const body = normalizeBody(rawBody)

  if (!body.trim()) return null
  if (readBoolean(data.draft) || readString(data.published).toLowerCase() === "false") return null
  if (deriveVisibility(relativePath, data) !== "public") return null

  const title = readString(data.title) || path.basename(relativePath, path.extname(relativePath))
  const date = normalizeDate(readString(data.date), fs.statSync(absolutePath).mtime)
  const updated = normalizeDate(readString(data.updated), fs.statSync(absolutePath).mtime)
  const slug = slugify(readString(data.slug) || relativePath.replace(/\.[^.]+$/, ""))
  const tags = unique([
    ...readStringList(data.tags),
    ...readStringList(data.categories),
    ...relativePath.split("/").slice(0, -1).map(slugify),
  ]).filter(Boolean)
  const sourcePath = `${sourceRootLabel.replace(/\/$/, "")}/${relativePath}`
  const openlistPath = `${openListRootLabel.replace(/\/$/, "")}/${relativePath}`
  const openlistUrl = encodeUrlPath(openlistPath)
  const outputPath = path.join(contentRoot, `${slug}.md`)
  const frontmatter = [
    "---",
    `title: ${quoteYaml(title)}`,
    `created: ${quoteYaml(date)}`,
    `modified: ${quoteYaml(updated)}`,
    `description: ${quoteYaml(readString(data.description) || readString(data.summary) || excerpt(body))}`,
    `sourcePath: ${quoteYaml(sourcePath)}`,
    `openlistPath: ${quoteYaml(openlistPath)}`,
    `openlistUrl: ${quoteYaml(openlistUrl)}`,
    `myblogId: ${quoteYaml(`md_${hash(sourcePath).slice(0, 12)}`)}`,
    "tags:",
    ...(tags.length ? tags.map((tag) => `  - ${quoteYaml(tag)}`) : ["  - myblog"]),
    "---",
    "",
  ].join("\n")

  return {
    slug,
    title,
    linkTarget: slug,
    outputPath,
    markdown: `${frontmatter}${body.trim()}\n`,
  }
}

function resetContentRoot() {
  fs.rmSync(contentRoot, { recursive: true, force: true })
  fs.mkdirSync(contentRoot, { recursive: true })
}

function listMarkdownFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name)
    if (entry.isDirectory()) return listMarkdownFiles(absolutePath)
    return /\.mdx?$/i.test(entry.name) ? [absolutePath] : []
  })
}

function isPrivatePath(relativePath) {
  const basename = path.basename(relativePath).toLowerCase()
  if (/\.(recovered|backup|bak|tmp)\.mdx?$/i.test(basename)) return true
  return relativePath
    .split("/")
    .some((segment) => segment.startsWith(".") || ["assets", "private", "drafts"].includes(segment))
}

function normalizeBody(body) {
  return body
    .replace(
      /!\[\[([^\]]+)\]\]/g,
      (_match, target) => `<!-- MyBlog unresolved embed: ${target} -->`,
    )
    .replace(/\[\[([^|\]]+)\|([^\]]+)\]\]/g, (_match, target, label) => `[[${target}|${label}]]`)
    .trim()
}

function parseFrontmatter(source) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return null
  return { frontmatter: match[1], body: source.slice(match[0].length) }
}

function parseYamlish(frontmatter) {
  const data = {}
  let currentKey = ""
  for (const line of frontmatter.split(/\r?\n/)) {
    if (/^\s*-\s+/.test(line) && currentKey) {
      data[currentKey] ||= []
      data[currentKey].push(stripQuotes(line.replace(/^\s*-\s+/, "").trim()))
      continue
    }
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
    if (!match) continue
    currentKey = match[1]
    data[currentKey] = match[2].trim() ? stripQuotes(match[2].trim()) : []
  }
  return data
}

function deriveVisibility(relativePath, data) {
  const explicitVisibility = slugify(readString(data.visibility))
  if (["public", "private", "draft"].includes(explicitVisibility)) return explicitVisibility
  if (readBoolean(data.private)) return "private"
  if (readBoolean(data.draft)) return "draft"
  if (relativePath.split("/").some((segment) => ["private", "drafts"].includes(segment)))
    return "private"
  return "public"
}

function normalizeDate(value, fallback) {
  const date = value ? new Date(value) : fallback
  if (Number.isNaN(date.getTime())) return fallback.toISOString().slice(0, 10)
  return date.toISOString().slice(0, 10)
}

function excerpt(markdown, maxLength = 150) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/[*_~|>-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
  return text.length <= maxLength ? text : `${text.slice(0, maxLength).trim()}...`
}

function readArgValue(name) {
  const index = process.argv.indexOf(name)
  return index >= 0 ? process.argv[index + 1] : ""
}

function readString(value) {
  return typeof value === "string" ? value.trim() : ""
}

function readBoolean(value) {
  if (typeof value === "boolean") return value
  return typeof value === "string" && value.toLowerCase() === "true"
}

function readStringList(value) {
  if (Array.isArray(value)) return value.map(readString).filter(Boolean)
  if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
    return value
      .slice(1, -1)
      .split(",")
      .map((item) => stripQuotes(item.trim()))
      .filter(Boolean)
  }
  return []
}

function slugify(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\\/g, "/")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
}

function quoteYaml(value) {
  return JSON.stringify(String(value ?? ""))
}

function encodeUrlPath(value) {
  return String(value)
    .split("/")
    .map((segment, index) => (index === 0 ? segment : encodeURIComponent(segment)))
    .join("/")
}

function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, "utf8")
}

function stripQuotes(value) {
  return String(value).replace(/^['"]|['"]$/g, "")
}

function toSlash(value) {
  return value.replace(/\\/g, "/")
}

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)))
}

function hash(value) {
  return crypto.createHash("sha256").update(value).digest("hex")
}
