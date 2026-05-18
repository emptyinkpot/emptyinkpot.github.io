import { QuartzPluginData } from "../../plugins/vfile"

export type MyBlogEntry = {
  title: string
  description: string
  href: string
  slug: string
  tags: string[]
  date: string
  kind: string
}

export type MyBlogChannel = {
  id: string
  title: string
  kicker: string
  description: string
  slug: string
  status: string
  tags: string[]
  nativeOwner?: "quartz" | "myblog-emitter" | "runtime-bridge"
}

export const myblogChannels: MyBlogChannel[] = [
  {
    id: "posts",
    title: "文章",
    kicker: "Runtime Markdown",
    description: "Vault 公开 Markdown 经 Quartz 渲染后的主内容流。",
    slug: "posts/index",
    status: "Quartz emitter page",
    tags: ["content", "rss", "search"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "notes",
    title: "札记",
    kicker: "Notes",
    description: "保留旧 MyBlog notes 路由，作为短札、记录、技术笔记入口。",
    slug: "notes/index",
    status: "Quartz emitter page",
    tags: ["notes", "writing", "content"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "collections",
    title: "专题",
    kicker: "Collections",
    description: "由 folder、series、tag 和链接关系收束出的专题阅读入口。",
    slug: "collections/index",
    status: "Quartz emitter page",
    tags: ["series", "tag", "folder"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "series",
    title: "系列",
    kicker: "Series",
    description: "保留旧 MyBlog series 路由，用于长线主题和连续写作组织。",
    slug: "series/index",
    status: "Quartz emitter page",
    tags: ["series", "longform", "topic"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "categories",
    title: "分类",
    kicker: "Categories",
    description: "保留旧 MyBlog categories 路由，作为内容分类和主题索引入口。",
    slug: "categories/index",
    status: "Quartz emitter page",
    tags: ["category", "index", "content"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "tags",
    title: "标签",
    kicker: "Quartz Tags",
    description: "标签体系由 Quartz 原生 TagPage 负责，是 MyBlog 知识结构的一等入口。",
    slug: "tags/index",
    status: "Quartz TagPage",
    tags: ["tag", "quartz", "knowledge"],
    nativeOwner: "quartz",
  },
  {
    id: "knowledge",
    title: "知识图谱",
    kicker: "Knowledge",
    description: "Quartz Graph、Backlinks、Search 与 MyBlog 元数据共同构成知识索引。",
    slug: "knowledge/index",
    status: "MyBlog runtime page",
    tags: ["graph", "backlinks", "memory"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "books",
    title: "书架",
    kicker: "Bookshelf",
    description: "保留旧 MyBlog 书库入口，承接 OpenList 与阅读器运行时。",
    slug: "books/index",
    status: "Runtime bridge",
    tags: ["books", "openlist", "reader"],
    nativeOwner: "runtime-bridge",
  },
  {
    id: "books-openlist",
    title: "OpenList 书库",
    kicker: "Books / OpenList",
    description: "保留旧 /books/openlist 路由，承接 OpenList 书籍源和运行时书库索引。",
    slug: "books/openlist/index",
    status: "Runtime bridge",
    tags: ["books", "openlist", "runtime"],
    nativeOwner: "runtime-bridge",
  },
  {
    id: "music",
    title: "音乐",
    kicker: "Showcase",
    description: "保留音乐/氛围素材展台，作为写作与视觉素材的辅助索引。",
    slug: "music/index",
    status: "Static index",
    tags: ["music", "mood", "showcase"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "visuals",
    title: "视觉素材",
    kicker: "Visual Library",
    description: "保留 Pinterest/视觉板入口，用于图像素材、色彩 token 和场景参考。",
    slug: "visuals/index",
    status: "Static index",
    tags: ["visual", "palette", "pinterest"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "github",
    title: "GitHub",
    kicker: "Project Telemetry",
    description: "承接旧站 GitHub activity、repo matrix 和工程状态入口。",
    slug: "github/index",
    status: "Runtime bridge",
    tags: ["github", "activity", "projects"],
    nativeOwner: "runtime-bridge",
  },
  {
    id: "projects",
    title: "项目工坊",
    kicker: "Project Workbench",
    description: "保留旧 MyBlog projects 路由和项目工作台入口。",
    slug: "projects/index",
    status: "Quartz emitter page",
    tags: ["projects", "workbench", "github"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "codex",
    title: "设计圣典",
    kicker: "Architecture Codex",
    description: "保留旧 Architecture Codex 的公开入口，记录设计语言、运行时和内容管线。",
    slug: "codex/index",
    status: "Static index",
    tags: ["codex", "architecture", "design"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "evidence-library",
    title: "史料库",
    kicker: "Evidence Library",
    description: "保留史料素材、OpenList、Remotion 和证据解析工作流入口。",
    slug: "evidence-library/index",
    status: "Runtime bridge",
    tags: ["evidence", "source", "openlist"],
    nativeOwner: "runtime-bridge",
  },
  {
    id: "reader",
    title: "阅读器",
    kicker: "Reader",
    description: "保留旧 /reader 路由，承接 PDF/EPUB/Markdown 阅读运行时。",
    slug: "reader/index",
    status: "Runtime bridge",
    tags: ["reader", "books", "memory"],
    nativeOwner: "runtime-bridge",
  },
  {
    id: "reader-openlist",
    title: "OpenList 阅读",
    kicker: "Reader / OpenList",
    description: "保留旧 /reader/openlist 路由，承接 OpenList 文件阅读入口。",
    slug: "reader/openlist/index",
    status: "Runtime bridge",
    tags: ["reader", "openlist", "runtime"],
    nativeOwner: "runtime-bridge",
  },
  {
    id: "openlist",
    title: "OpenList",
    kicker: "Source Runtime",
    description: "保留旧 OpenList 弹层/入口语义，作为内容源和文件源运行时边界。",
    slug: "openlist/index",
    status: "Runtime bridge",
    tags: ["openlist", "source", "files"],
    nativeOwner: "runtime-bridge",
  },
  {
    id: "pinterest",
    title: "Pinterest",
    kicker: "Visual Mirror",
    description: "保留旧 Pinterest 镜像入口，承接视觉流同步和 board 索引。",
    slug: "pinterest/index",
    status: "Runtime bridge",
    tags: ["pinterest", "visual", "mirror"],
    nativeOwner: "runtime-bridge",
  },
  {
    id: "settings",
    title: "设置",
    kicker: "Reader Runtime",
    description: "保留视觉、阅读、图谱密度和本地偏好设置入口。",
    slug: "settings/index",
    status: "Local preference",
    tags: ["settings", "theme", "reader"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "search",
    title: "搜索",
    kicker: "Search",
    description: "保留旧 /search 路由；实际搜索能力由 Quartz Search 组件和 MyBlog 命令面板承担。",
    slug: "search/index",
    status: "Quartz Search + MyBlog command",
    tags: ["search", "command", "index"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "updates",
    title: "更新",
    kicker: "Updates",
    description: "保留旧 updates 路由，作为站点改动、内容同步和运行时变化入口。",
    slug: "updates/index",
    status: "Quartz emitter page",
    tags: ["updates", "changelog", "runtime"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "about",
    title: "关于",
    kicker: "About",
    description: "保留旧 about 路由，说明 emptyinkpot/MyBlog 的站点定位和内容边界。",
    slug: "about/index",
    status: "Quartz emitter page",
    tags: ["about", "identity", "site"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "api-keys",
    title: "API Keys",
    kicker: "Runtime Settings",
    description: "保留旧 api-keys 路由，作为运行时凭据配置说明入口；不在静态站泄露秘密。",
    slug: "api-keys/index",
    status: "Local runtime boundary",
    tags: ["api", "keys", "runtime"],
    nativeOwner: "myblog-emitter",
  },
  {
    id: "edit-intake",
    title: "编辑摄入",
    kicker: "Edit Intake",
    description: "保留旧 edit-intake 工作台入口，用于内容摄入、草稿处理和结构化编辑。",
    slug: "edit-intake/index",
    status: "Runtime bridge",
    tags: ["edit", "intake", "workflow"],
    nativeOwner: "runtime-bridge",
  },
]

export const primaryNavChannelIds = [
  "posts",
  "series",
  "projects",
  "github",
  "books",
  "music",
  "visuals",
  "knowledge",
  "codex",
  "evidence-library",
  "openlist",
  "pinterest",
  "updates",
  "settings",
  "search",
  "about",
]

export function toMyBlogEntries(allFiles: QuartzPluginData[]): MyBlogEntry[] {
  return allFiles
    .filter((file) => file.slug && !String(file.slug).startsWith("tags/"))
    .map((file) => {
      const frontmatter = (file.frontmatter ?? {}) as Record<string, unknown>
      const title = String(frontmatter.title ?? file.slug ?? "Untitled")
      const description = String(file.description ?? frontmatter.description ?? "")
      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags.map(String) : []
      const date = file.dates?.modified?.toISOString().slice(0, 10) ?? ""
      const slug = String(file.slug)
      const kind = tags[0] ?? inferKind(slug)
      return {
        title,
        description,
        href: slug === "index" ? "index" : slug,
        slug,
        tags,
        date,
        kind,
      }
    })
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "zh-CN"))
}

export function pageDescription(channel: MyBlogChannel) {
  const copy: Record<string, string[]> = {
    posts: [
      "文章入口保留旧 MyBlog 的 Runtime Markdown 内容流，但渲染和索引归 Quartz 管。",
      "最新内容来自公开 Vault 投影，参与 Quartz 搜索、Graph、Backlinks、RSS 和 sitemap。",
    ],
    collections: [
      "专题入口承接旧站 series/categories/collections 信息架构。",
      "当前以 Quartz tags、folders、frontmatter 和链接关系作为第一阶段集合边界。",
    ],
    knowledge: [
      "知识图谱入口把旧 MyBlog Knowledge Runtime 收束到 Quartz Graph 与 Backlinks。",
      "后续 DataBase/OpenList 运行时数据通过 static/myblog-runtime.json 与专用 bridge 接入。",
    ],
    books: [
      "书架入口保留旧 MyBlog Bookshelf、OpenList、PDF/EPUB reader 的用户路径。",
      "静态 Quartz 页面负责入口与索引，运行时阅读器作为 MyBlog Quartz bridge 接回。",
    ],
    music: [
      "音乐入口保留旧站 showcase 语义，作为写作氛围和素材组织层。",
      "它不再是 Astro 页面，而是 Quartz emitter 生成的 MyBlog runtime page。",
    ],
    visuals: [
      "视觉素材入口保留 Pinterest mirror、palette token、image board 的信息架构。",
      "Quartz 页面负责索引与导航，动态同步由后续 runtime bridge 承接。",
    ],
    github: [
      "GitHub 入口保留旧站 repo matrix、activity heatmap、language donut 的位置。",
      "静态页先承载工程入口，runtime 数据后续从 canonical provider 注入。",
    ],
    codex: [
      "设计圣典入口保留旧 Architecture Codex 的公开路径。",
      "Quartz-native 后，README、配置、组件和 runtime 页面共同作为架构说明入口。",
    ],
    "evidence-library": [
      "史料库入口保留 OpenList、Remotion、Evidence Resolver 和素材标注工作流。",
      "Quartz 负责公开入口与链接结构，服务端解析能力后续接回 runtime bridge。",
    ],
    settings: [
      "设置入口保留旧站视觉、阅读、图谱密度、本地偏好和内容开关概念。",
      "当前设置写入浏览器 localStorage，并通过 MyBlog Quartz runtime script 应用。",
    ],
    search: [
      "搜索入口保留旧 MyBlog command/search 路由。",
      "Quartz 原生 Search 负责全文索引，MyBlog command 面板读取 static/myblog-runtime.json。",
    ],
  }
  return copy[channel.id] ?? [channel.description]
}

export function tagStats(entries: MyBlogEntry[]) {
  const counts = new Map<string, number>()
  for (const entry of entries) {
    for (const tag of entry.tags) {
      if (!tag.trim()) continue
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "zh-CN"))
    .slice(0, 18)
}

function inferKind(slug: string) {
  const first = slug.split("/")[0]
  if (!first || first === "index") return "home"
  return first
}
