import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { myblogChannels, tagStats, toMyBlogEntries } from "./shared"
import { FullSlug, resolveRelative } from "../../util/path"

const MyBlogHome: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const slug = (fileData.slug ?? "index") as FullSlug
  const entries = toMyBlogEntries(allFiles).filter((entry) => entry.slug !== "index")
  const featured = entries.slice(0, 9)
  const tags = tagStats(entries)
  const stats = [
    { label: "Quartz pages", value: String(entries.length) },
    { label: "Knowledge tags", value: String(tags.length) },
    { label: "Runtime channels", value: String(myblogChannels.length) },
    { label: "Primary framework", value: "Quartz" },
  ]

  return (
    <main class="myblog-home" data-myblog-home>
      <section class="myblog-home__hero" aria-labelledby="myblog-home-title">
        <div class="myblog-home__hero-copy">
          <p class="myblog-kicker">Quartz-native MyBlog</p>
          <h1 id="myblog-home-title">MyBlog 已进入 Quartz 的组件、插件和内容管线。</h1>
          <p>
            这里不是旧 Astro 外壳，也不是单纯换皮。内容、搜索、图谱、反链、RSS、阅读器入口和 MyBlog
            工作台被收束到 Quartz 原生页面模型里。
          </p>
          <div class="myblog-home__actions">
            <a href="#myblog-feed">阅读最新内容</a>
            <button type="button" data-myblog-command-open>
              打开工作台
            </button>
          </div>
        </div>
        <div class="myblog-home__signal" aria-label="MyBlog runtime summary">
          {stats.map((item) => (
            <div>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section class="myblog-home__channels" aria-labelledby="myblog-channels-title">
        <div class="myblog-section-head">
          <p class="myblog-kicker">Recovered Surface</p>
          <h2 id="myblog-channels-title">旧 MyBlog 功能入口</h2>
        </div>
        <div class="myblog-channel-grid">
          {myblogChannels.map((channel) => (
            <a
              class="myblog-channel"
              href={resolveRelative(slug, channel.slug as FullSlug)}
              data-myblog-channel={channel.id}
            >
              <span>{channel.kicker}</span>
              <strong>{channel.title}</strong>
              <p>{channel.description}</p>
              <small>{channel.status}</small>
            </a>
          ))}
        </div>
      </section>

      <section class="myblog-home__body" id="myblog-feed">
        <div class="myblog-feed">
          <div class="myblog-section-head">
            <p class="myblog-kicker">Latest Projection</p>
            <h2>最新公开内容</h2>
          </div>
          <div class="myblog-feed__list">
            {featured.map((entry) => (
              <a
                class="myblog-feed-card"
                href={resolveRelative(slug, entry.href as FullSlug)}
                data-myblog-preview={entry.slug}
              >
                <span>{entry.kind}</span>
                <strong>{entry.title}</strong>
                <p>{entry.description || "这篇内容来自 MyBlog Vault，经 Quartz 内容管线发布。"}</p>
                <small>{entry.date || "undated"}</small>
              </a>
            ))}
          </div>
        </div>
        <aside class="myblog-side-panel">
          <div>
            <p class="myblog-kicker">Tag Index</p>
            <h2>知识标签</h2>
          </div>
          <div class="myblog-tag-cloud">
            {tags.map(([tag, count]) => (
              <a href={resolveRelative(slug, `tags/${tag}` as FullSlug)}>
                {tag}
                <span>{count}</span>
              </a>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default (() => MyBlogHome) satisfies QuartzComponentConstructor
