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

  document.addEventListener("nav", () => {
    addSourceLine()
    updateProgress()
  })
  window.addEventListener("scroll", updateProgress, { passive: true })
  window.addEventListener("resize", updateProgress)
  addSourceLine()
  updateProgress()
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
