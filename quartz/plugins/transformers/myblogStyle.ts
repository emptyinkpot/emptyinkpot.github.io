import { QuartzTransformerPlugin } from "../types"
import { h } from "preact"

const myblogCss = `
:root {
  --myblog-page-bg: #f3efe7;
  --myblog-page-bg-strong: #ede7dd;
  --myblog-surface: rgba(255, 255, 255, 0.74);
  --myblog-surface-strong: rgba(255, 255, 255, 0.9);
  --myblog-border: rgba(87, 74, 60, 0.14);
  --myblog-text: #201b16;
  --myblog-muted: #6f6257;
  --myblog-accent: #1f4a5f;
  --myblog-accent-2: #6b2d5c;
  --myblog-green: #2f5d50;
  --myblog-shadow: 0 22px 70px rgba(64, 49, 32, 0.08);
  --myblog-focus: rgba(47, 93, 80, 0.42);
}

html {
  background: var(--myblog-page-bg);
}

body {
  background:
    linear-gradient(90deg, rgba(107, 45, 92, 0.035) 1px, transparent 1px),
    linear-gradient(180deg, rgba(47, 93, 80, 0.028) 1px, transparent 1px),
    linear-gradient(180deg, #f7f4ee 0%, var(--myblog-page-bg) 100%);
  background-size: 44px 44px, 44px 44px, auto;
  color: var(--myblog-text);
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at 18% 0%, rgba(207, 221, 226, 0.42), transparent 34%),
    radial-gradient(circle at 86% 4%, rgba(235, 225, 210, 0.62), transparent 28%);
  z-index: -1;
}

.page {
  max-width: 1480px;
}

.page > #quartz-body .sidebar {
  padding-top: 1.4rem;
}

.left.sidebar {
  border-right: 1px solid var(--myblog-border);
}

.right.sidebar {
  border-left: 1px solid var(--myblog-border);
}

.page-title {
  border-bottom: 1px solid var(--myblog-border);
  padding-bottom: 0.9rem;
  font-family: var(--headerFont);
  letter-spacing: 0;
}

.page-title a {
  color: var(--myblog-text);
}

.page-title a::after {
  content: "Quartz Garden";
  display: block;
  margin-top: 0.25rem;
  color: var(--myblog-muted);
  font-family: var(--bodyFont);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.search > .search-button,
.darkmode,
.readermode {
  border: 1px solid var(--myblog-border);
  background: var(--myblog-surface);
  box-shadow: none;
}

.explorer,
.graph,
.backlinks,
.toc,
.recent-notes {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface);
  box-shadow: var(--myblog-shadow);
  backdrop-filter: blur(18px);
}

.explorer {
  padding: 0.85rem;
}

.graph,
.backlinks,
.toc {
  padding: 0.9rem;
}

.center {
  min-width: 0;
}

.center > article {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface-strong);
  box-shadow: var(--myblog-shadow);
  padding: clamp(1.2rem, 3vw, 2.4rem);
}

.popover-hint {
  border-bottom: 1px solid var(--myblog-border);
  margin-bottom: 1.4rem;
  padding-bottom: 1rem;
}

.article-title {
  color: var(--myblog-text);
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1.08;
  letter-spacing: 0;
}

.content-meta {
  color: var(--myblog-muted);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.tags {
  gap: 0.45rem;
}

a.internal,
a.tag-link,
.tags a {
  border: 1px solid rgba(31, 74, 95, 0.12);
  border-radius: 999px;
  background: rgba(31, 74, 95, 0.08);
  color: var(--myblog-accent);
}

article p,
article li {
  line-height: 1.85rem;
}

article h2 {
  border-top: 1px solid var(--myblog-border);
  padding-top: 1rem;
}

blockquote {
  border-left-color: var(--myblog-accent);
  background: rgba(255, 255, 255, 0.52);
  padding: 0.6rem 0 0.6rem 1rem;
}

pre,
figure[data-rehype-pretty-code-figure] {
  border-radius: 8px;
  box-shadow: none;
}

code {
  border: 1px solid rgba(31, 74, 95, 0.1);
  background: rgba(31, 74, 95, 0.075);
  color: #244a5a;
}

img,
video,
audio {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
}

footer {
  color: var(--myblog-muted);
}

.myblog-source-line {
  margin: 0.35rem 0 0;
  color: var(--myblog-muted);
  font-family: var(--bodyFont);
  font-size: 0.78rem;
  line-height: 1.5;
}

.myblog-source-line a {
  color: var(--myblog-accent);
}

.myblog-reading-progress {
  position: fixed;
  inset: 0 auto auto 0;
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--myblog-accent), var(--myblog-accent-2));
  z-index: 9999;
  transition: width 120ms ease;
}

.myblog-topnav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface-strong);
  box-shadow: var(--myblog-shadow);
  padding: 0.75rem;
}

.myblog-topnav__brand {
  display: grid;
  gap: 0.1rem;
  min-width: 10rem;
  color: var(--myblog-text);
}

.myblog-topnav__brand span,
.myblog-kicker,
.myblog-channel span,
.myblog-feed-card span,
.myblog-runtime-page__links span {
  color: var(--myblog-muted);
  font-family: var(--bodyFont);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.myblog-topnav__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.35rem;
}

.myblog-topnav__links a,
.myblog-home__actions a,
.myblog-home__actions button,
.myblog-runtime-page__status a,
.myblog-runtime-page__status span {
  border: 1px solid rgba(31, 74, 95, 0.14);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.55);
  color: var(--myblog-accent);
  padding: 0.45rem 0.7rem;
  font: inherit;
  font-size: 0.82rem;
  cursor: pointer;
}

.myblog-topnav__links a.is-active,
.myblog-home__actions a {
  background: var(--myblog-accent);
  color: #fffaf2;
}

body[data-slug="index"] .left.sidebar,
body[data-slug="index"] .right.sidebar {
  display: none;
}

body[data-slug="index"] #quartz-body {
  grid-template-columns: minmax(0, 1fr);
}

body[data-slug="index"] .center {
  max-width: none;
}

body[data-slug="index"] .page-header .popover-hint {
  display: none;
}

.myblog-home,
.myblog-runtime-page {
  display: grid;
  gap: 1.25rem;
}

.myblog-home__hero,
.myblog-runtime-page__hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(18rem, 0.8fr);
  gap: 1rem;
  align-items: stretch;
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface-strong);
  box-shadow: var(--myblog-shadow);
  padding: clamp(1.2rem, 3vw, 2rem);
}

.myblog-home h1,
.myblog-runtime-page h1 {
  margin: 0.25rem 0 0;
  color: var(--myblog-text);
  font-size: clamp(2.2rem, 6vw, 5rem);
  line-height: 0.98;
  letter-spacing: 0;
}

.myblog-home__hero-copy > p:not(.myblog-kicker),
.myblog-runtime-page__hero > p:not(.myblog-kicker),
.myblog-channel p,
.myblog-feed-card p,
.myblog-runtime-page__panel p,
.myblog-runtime-page__panel li {
  color: var(--myblog-muted);
  line-height: 1.75;
}

.myblog-home__actions,
.myblog-runtime-page__status {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1rem;
}

.myblog-home__signal {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.6rem;
}

.myblog-home__signal div,
.myblog-channel,
.myblog-feed-card,
.myblog-side-panel,
.myblog-runtime-page__panel {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.58);
  padding: 1rem;
}

.myblog-home__signal span,
.myblog-home__signal strong,
.myblog-channel strong,
.myblog-channel small,
.myblog-feed-card strong,
.myblog-feed-card small,
.myblog-runtime-page__links strong {
  display: block;
}

.myblog-home__signal strong {
  margin-top: 0.3rem;
  color: var(--myblog-text);
  font-size: 1.4rem;
}

.myblog-section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

.myblog-section-head h2,
.myblog-side-panel h2,
.myblog-runtime-page__panel h2 {
  margin: 0;
  color: var(--myblog-text);
  font-size: clamp(1.25rem, 2vw, 1.8rem);
}

.myblog-channel-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.7rem;
}

.myblog-channel,
.myblog-feed-card,
.myblog-runtime-page__links a {
  color: inherit;
  text-decoration: none;
  transition:
    border-color 160ms ease,
    transform 160ms ease,
    background 160ms ease;
}

.myblog-channel:hover,
.myblog-feed-card:hover,
.myblog-runtime-page__links a:hover {
  border-color: rgba(31, 74, 95, 0.28);
  background: rgba(255, 255, 255, 0.82);
  transform: translateY(-2px);
}

.myblog-channel strong,
.myblog-feed-card strong {
  margin-top: 0.35rem;
  color: var(--myblog-text);
  font-size: 1rem;
}

.myblog-channel small,
.myblog-feed-card small {
  color: var(--myblog-accent);
  font-size: 0.76rem;
  font-weight: 800;
}

.myblog-home__body,
.myblog-runtime-page__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(18rem, 0.36fr);
  gap: 1rem;
}

.myblog-feed__list,
.myblog-runtime-page__links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
}

.myblog-tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.myblog-tag-cloud a {
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  border: 1px solid rgba(31, 74, 95, 0.12);
  border-radius: 999px;
  background: rgba(31, 74, 95, 0.07);
  color: var(--myblog-accent);
  padding: 0.35rem 0.55rem;
  font-size: 0.8rem;
}

.myblog-runtime-page__links a {
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.48);
  padding: 0.75rem;
}

.myblog-command-layer {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: grid;
  place-items: start center;
  padding: 10vh 1rem;
  background: rgba(24, 20, 16, 0.32);
  backdrop-filter: blur(8px);
}

.myblog-command-layer[hidden] {
  display: none;
}

.myblog-command-panel {
  width: min(760px, 100%);
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: var(--myblog-surface-strong);
  box-shadow: var(--myblog-shadow);
  padding: 0.75rem;
}

.myblog-command-panel input {
  width: 100%;
  border: 1px solid var(--myblog-border);
  border-radius: 8px;
  background: #fffaf2;
  padding: 0.85rem;
  color: var(--myblog-text);
  font: inherit;
}

.myblog-command-results {
  display: grid;
  gap: 0.35rem;
  max-height: 55vh;
  overflow: auto;
  margin-top: 0.65rem;
}

.myblog-command-results a {
  display: grid;
  gap: 0.2rem;
  border-radius: 8px;
  padding: 0.7rem;
  color: var(--myblog-text);
}

.myblog-command-results a:hover,
.myblog-command-results a.is-active {
  background: rgba(31, 74, 95, 0.08);
}

:focus-visible {
  outline: 2px solid var(--myblog-focus);
  outline-offset: 3px;
}

@media (max-width: 800px) {
  .left.sidebar,
  .right.sidebar {
    border: 0;
  }

  .center > article {
    padding: 1rem;
  }

  .myblog-topnav,
  .myblog-home__hero,
  .myblog-runtime-page__hero,
  .myblog-home__body,
  .myblog-runtime-page__grid {
    grid-template-columns: 1fr;
  }

  .myblog-channel-grid,
  .myblog-feed__list,
  .myblog-runtime-page__links {
    grid-template-columns: 1fr;
  }
}
`

const myblogScript = `
(() => {
  const ensureProgress = () => {
    let bar = document.querySelector(".myblog-reading-progress")
    if (!bar) {
      bar = document.createElement("div")
      bar.className = "myblog-reading-progress"
      document.body.prepend(bar)
    }
    return bar
  }

  const updateProgress = () => {
    const bar = ensureProgress()
    const scrollTop = window.scrollY || document.documentElement.scrollTop
    const height = document.documentElement.scrollHeight - window.innerHeight
    const progress = height > 0 ? Math.min(1, Math.max(0, scrollTop / height)) : 0
    bar.style.width = progress * 100 + "%"
  }

  const addSourceLine = () => {
    const header = document.querySelector(".popover-hint")
    if (!header || header.querySelector(".myblog-source-line")) return
    const source = document.querySelector("meta[name='myblog-source-path']")?.getAttribute("content")
    const openlist = document.querySelector("meta[name='myblog-openlist-url']")?.getAttribute("content")
    if (!source && !openlist) return

    const line = document.createElement("p")
    line.className = "myblog-source-line"
    if (openlist) {
      const link = document.createElement("a")
      link.href = openlist
      link.textContent = source || "OpenList source"
      line.append("Source: ", link)
    } else {
      line.textContent = "Source: " + source
    }
    header.append(line)
  }

  const setupCommand = async () => {
    const triggers = [...document.querySelectorAll("[data-myblog-command-open]")]
    if (!triggers.length) return
    let runtime = null
    try {
      const response = await fetch("/static/myblog-runtime.json")
      runtime = response.ok ? await response.json() : null
    } catch {
      runtime = null
    }

    const layer = document.createElement("div")
    layer.className = "myblog-command-layer"
    layer.hidden = true
    layer.innerHTML = '<section class="myblog-command-panel" role="dialog" aria-modal="true"><input aria-label="Search MyBlog runtime" placeholder="搜索文章、入口、标签" /><div class="myblog-command-results"></div></section>'
    document.body.append(layer)
    const input = layer.querySelector("input")
    const results = layer.querySelector(".myblog-command-results")
    const toRoute = (slug) => {
      const normalized = String(slug || "")
      if (!normalized) return "/"
      if (normalized === "index") return "/"
      if (normalized.endsWith("/index")) return "/" + normalized.slice(0, -"/index".length) + "/"
      return "/" + normalized
    }
    const docs = [
      ...(runtime?.channels || []).map((item) => ({
        title: item.title,
        description: item.description,
        href: toRoute(item.slug),
        kind: item.kicker,
      })),
      ...(runtime?.content || []).map((item) => ({
        title: item.title || item.slug,
        description: item.description || "",
        href: toRoute(item.slug),
        kind: (item.tags || [])[0] || "content",
      })),
    ]

    const render = () => {
      const query = input.value.trim().toLowerCase()
      const matched = docs
        .filter((item) => [item.title, item.description, item.kind].join(" ").toLowerCase().includes(query))
        .slice(0, 12)
      results.replaceChildren(
        ...matched.map((item) => {
          const link = document.createElement("a")
          link.href = item.href
          link.innerHTML = "<span></span><strong></strong><small></small>"
          link.querySelector("span").textContent = item.kind || "MyBlog"
          link.querySelector("strong").textContent = item.title || "Untitled"
          link.querySelector("small").textContent = item.description || item.href
          return link
        }),
      )
    }

    const open = () => {
      layer.hidden = false
      input.focus()
      render()
    }
    const close = () => {
      layer.hidden = true
    }
    triggers.forEach((trigger) => trigger.addEventListener("click", open))
    input.addEventListener("input", render)
    layer.addEventListener("click", (event) => {
      if (event.target === layer) close()
    })
    window.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        open()
      }
      if (event.key === "Escape" && !layer.hidden) close()
    })
  }

  document.addEventListener("nav", () => {
    addSourceLine()
    updateProgress()
  })
  window.addEventListener("scroll", updateProgress, { passive: true })
  window.addEventListener("resize", updateProgress)
  addSourceLine()
  updateProgress()
  setupCommand()
})()
`

export const MyBlogStyle: QuartzTransformerPlugin = () => ({
  name: "MyBlogStyle",
  externalResources() {
    return {
      css: [{ content: myblogCss, inline: true }],
      js: [
        {
          loadTime: "afterDOMReady",
          contentType: "inline",
          script: myblogScript,
          spaPreserve: true,
        },
      ],
      additionalHead: [
        (pageData) =>
          h("meta", {
            name: "myblog-source-path",
            content: String(pageData.frontmatter?.sourcePath ?? ""),
          }),
        (pageData) =>
          h("meta", {
            name: "myblog-openlist-url",
            content: String(pageData.frontmatter?.openlistUrl ?? ""),
          }),
        () => h("meta", { name: "theme-color", content: "#f3efe7" }),
      ],
    }
  },
})
