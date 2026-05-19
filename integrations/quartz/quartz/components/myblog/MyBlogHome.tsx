import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import {
  myblogChannels,
  myblogSealDefinitions,
  tagStats,
  toMyBlogEntries,
  toMyBlogFeedItems,
} from "../../myblog-runtime/registry"
import { FullSlug, resolveRelative } from "../../util/path"

const nav = [
  ["项目工坊", "projects/index", "项"],
  ["知识图谱", "knowledge/index", "知"],
  ["书架", "books/index", "书"],
  ["设计圣典", "codex/index", "典"],
  ["视觉素材", "visuals/index", "视"],
  ["GitHub", "github/index", "G"],
  ["设置", "settings/index", "设"],
]

const MyBlogHome: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
  const slug = (fileData.slug ?? "index") as FullSlug
  const entries = toMyBlogEntries(allFiles).filter((entry) => entry.slug !== "index")
  const feedItems = toMyBlogFeedItems(entries)
  const tags = tagStats(entries)
  const stats = [
    { label: "Articles", value: String(entries.length) },
    { label: "Channels", value: String(myblogChannels.length) },
    { label: "Tags", value: String(tags.length) },
    { label: "Framework", value: "Quartz" },
  ]
  const activity = [
    entries[0] ? `最新文章：${entries[0].title}` : "最新文章：等待 Vault 投影",
    "阅读记忆：本地高亮、批注、收藏、印章已由 Quartz runtime 接管",
    "知识入口：Graph、Backlinks、Search 与 MyBlog 对象流合并",
    "运行时边界：OpenList/DataBase 通过 bridge 接回，不恢复 Astro 外壳",
  ]

  return (
    <main class="myblog-home myblog-home--workbench" data-myblog-home>
      <div class="home-feed-shell" data-myblog-workbench>
        <aside class="home-feed-rail" aria-label="系统导航与上下文状态" data-home-sidebar>
          <button
            class="home-sidebar-collapse"
            type="button"
            data-sidebar-collapse
            aria-label="折叠侧栏"
          >
            <span data-sidebar-collapse-icon>›</span>
          </button>

          <section class="home-feed-profile home-sidebar-section">
            <a class="home-feed-brand" href={resolveRelative(slug, "index" as FullSlug)}>
              <span class="home-feed-brand__logo" aria-hidden="true">
                墨
              </span>
              <span data-sidebar-label>emptyinkpot</span>
            </a>
            <div class="home-feed-avatar" aria-hidden="true">
              <span>EI</span>
            </div>
            <h1 data-sidebar-label>emptyinkpot</h1>
            <p data-sidebar-label>Content OS · Tangible Knowledge UI</p>
            <small class="github-live-status" data-sidebar-label>
              Quartz-native runtime
            </small>
          </section>

          <nav
            class="home-feed-rail-card home-sidebar-section home-sidebar-nav"
            aria-label="站点导航"
          >
            <span data-sidebar-label>Navigation</span>
            {nav.map(([label, href, mark]) => (
              <a class="home-sidebar-item" href={resolveRelative(slug, href as FullSlug)}>
                <b>{mark}</b>
                <span data-sidebar-label>{label}</span>
              </a>
            ))}
          </nav>

          <section class="home-feed-rail-card home-feed-memory home-sidebar-section">
            <span data-sidebar-label>Recent</span>
            <strong data-sidebar-label>最近</strong>
            <ul data-sidebar-history>
              <li>暂无记录</li>
            </ul>
          </section>

          <section class="home-feed-rail-card home-feed-stats home-sidebar-section">
            <span data-sidebar-label>Status</span>
            <strong data-sidebar-label>状态</strong>
            <div class="home-feed-stat-grid">
              <div>
                <small>高亮</small>
                <b data-sidebar-stat="highlights">0</b>
              </div>
              <div>
                <small>批注</small>
                <b data-sidebar-stat="annotations">0</b>
              </div>
              <div>
                <small>收藏</small>
                <b data-sidebar-stat="bookmarks">0</b>
              </div>
              <div>
                <small>阅读</small>
                <b data-sidebar-stat="history">0</b>
              </div>
            </div>
            <ul data-sidebar-bookmarks>
              <li>暂无收藏</li>
            </ul>
          </section>
        </aside>

        <section class="home-feed-main">
          <section class="home-hero-banner" data-hero-banner aria-label="emptyinkpot hero banner">
            <div
              class="home-hero-banner__layer home-hero-banner__layer--bg"
              data-hero-layer="bg"
            ></div>
            <div
              class="home-hero-banner__layer home-hero-banner__layer--mid"
              data-hero-layer="mid"
            ></div>
            <div
              class="home-hero-banner__layer home-hero-banner__layer--front"
              data-hero-layer="front"
            ></div>
            <div class="home-hero-banner__overlay"></div>
            <div class="home-hero-banner__content">
              <span data-hero-season-label>Seasonal Field</span>
              <h1>EMPTYINKPOT</h1>
              <p>Content OS · Tangible Knowledge UI</p>
              <div class="home-hero-banner__metrics" aria-label="站点动态指标">
                {stats.map((item) => (
                  <div>
                    <span>{item.value}</span>
                    <small>{item.label}</small>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section class="home-activity-marquee" aria-label="站点活动流">
            <div>
              {[...activity, ...activity].map((item) => (
                <span>{item}</span>
              ))}
            </div>
          </section>

          <div class="home-feed-toolbar" aria-label="首页内容筛选">
            <div>
              <span>Runtime Surface</span>
              <strong>混合对象流</strong>
            </div>
            <nav class="home-feed-tabs" aria-label="首页对象过滤">
              <button type="button" class="home-feed-tab is-active" data-feed-filter="all">
                全部
              </button>
              {["post", "knowledge", "book", "music", "github", "visual", "project", "update"].map(
                (kind) => (
                  <button type="button" class="home-feed-tab" data-feed-filter={kind}>
                    {kind}
                  </button>
                ),
              )}
              <button type="button" class="home-feed-tab" data-myblog-command-open>
                Command
              </button>
              <button type="button" class="home-feed-tab" data-search-open>
                搜索
              </button>
            </nav>
          </div>

          <section class="home-feed-grid" aria-label="内容流" data-home-feed-grid>
            {feedItems.map((item) => (
              <article
                class={`home-feed-card home-feed-card--${item.size ?? "standard"} home-feed-card--${item.type}`}
                data-feed-card
                data-feed-kind={item.type}
                data-drawer-id={item.id}
                data-seal-target={item.id}
                data-seal-title={item.title}
                data-seal-kind={item.type}
                data-hover-title={item.title}
                data-hover-summary={item.summary}
                style={`--feed-accent:${item.accent}`}
              >
                <div class={`bookmark bookmark--${item.type}`}>
                  <span>{item.type}</span>
                </div>
                <button class="seal-trigger" type="button" data-seal-trigger>
                  盖章
                </button>
                <span class="card-paperclip" aria-hidden="true"></span>
                <button class="home-feed-card__open" type="button" data-drawer-open={item.id}>
                  <div class="home-feed-card__mark">{item.type}</div>
                  <div class="home-feed-card__body">
                    <div class="home-feed-card__meta">
                      <span>{item.kicker}</span>
                      <small>{item.meta}</small>
                    </div>
                    <h2>{item.title}</h2>
                    <p>{item.summary}</p>
                    {item.tags.length ? (
                      <div class="home-feed-card__tags">
                        {item.tags.slice(0, 5).map((tag) => (
                          <span>{tag}</span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </button>
              </article>
            ))}
          </section>
        </section>
      </div>

      <div class="home-article-layer" data-article-layer hidden>
        <button
          class="home-article-backdrop"
          type="button"
          data-article-close
          aria-label="关闭阅读抽屉"
        ></button>
        <aside
          class="home-article-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby="home-article-title"
        >
          <div class="reading-progress" data-reading-progress></div>
          <header class="home-article-drawer__header">
            <div>
              <span data-article-kicker></span>
              <h2 id="home-article-title" data-article-title></h2>
            </div>
            <div class="home-article-drawer__actions">
              <div class="reader-theme-switch" aria-label="阅读主题">
                <button type="button" data-reader-theme="light" title="白天" aria-label="白天">
                  ☀
                </button>
                <button type="button" data-reader-theme="sepia" title="护眼" aria-label="护眼">
                  Aa
                </button>
                <button type="button" data-reader-theme="dark" title="夜间" aria-label="夜间">
                  ☾
                </button>
              </div>
              <button type="button" data-reader-bookmark>
                收藏
              </button>
              <button type="button" data-reader-seal>
                盖章
              </button>
              <a href={resolveRelative(slug, "knowledge/index" as FullSlug)} data-reader-graph>
                知识图谱
              </a>
              <a href="#" data-article-full>
                完整页面
              </a>
              <button type="button" data-article-close>
                关闭
              </button>
            </div>
          </header>
          <div class="home-article-drawer__body" data-article-body></div>
        </aside>
      </div>

      <div class="knowledge-search-layer" data-search-layer hidden>
        <button
          class="knowledge-search-backdrop"
          type="button"
          data-search-close
          aria-label="关闭搜索"
        ></button>
        <section
          class="knowledge-search-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Knowledge search"
        >
          <div class="knowledge-search-input-row">
            <input
              type="search"
              data-search-input
              placeholder="搜索文章、项目、书架、音乐、GitHub、标记..."
            />
            <kbd>Esc</kbd>
          </div>
          <nav class="knowledge-search-tabs" aria-label="搜索类型">
            {[
              "all",
              "post",
              "knowledge",
              "book",
              "music",
              "github",
              "visual",
              "highlight",
              "annotation",
              "seal",
              "sticker",
            ].map((kind) => (
              <button
                type="button"
                class={kind === "all" ? "is-active" : ""}
                data-search-kind={kind}
              >
                {kind}
              </button>
            ))}
          </nav>
          <div class="knowledge-search-results" data-search-results>
            <p class="knowledge-search-empty">输入关键词，搜索文章、入口和本地标记。</p>
          </div>
        </section>
      </div>

      <div class="selection-toolbar" data-selection-toolbar hidden>
        <button type="button" data-highlight-color="gold">
          金
        </button>
        <button type="button" data-highlight-color="purple">
          紫
        </button>
        <button type="button" data-highlight-color="green">
          绿
        </button>
        <button type="button" data-open-annotation>
          批注
        </button>
        <button type="button" data-copy-selection>
          复制
        </button>
      </div>

      <div class="seal-palette" data-seal-palette hidden>
        <div class="seal-palette__panel" role="dialog" aria-modal="false" aria-label="选择印章">
          <header>
            <span>Seal</span>
            <strong data-seal-target-title>选择判断</strong>
            <button type="button" data-seal-close>
              关闭
            </button>
          </header>
          <div class="seal-palette__grid">
            {myblogSealDefinitions.map((seal) => (
              <button
                type="button"
                class={`seal-palette__option knowledge-seal knowledge-seal--${seal.shape} knowledge-seal--${seal.texture}`}
                style={`--seal-color:${seal.color}`}
                data-seal-type={seal.id}
                data-seal-label={seal.label}
                data-seal-sublabel={seal.subLabel}
                data-seal-color={seal.color}
                data-seal-shape={seal.shape}
                data-seal-texture={seal.texture}
                title={seal.summary}
              >
                <span class="knowledge-seal__inner">
                  <strong>{seal.label}</strong>
                  <em>{seal.subLabel}</em>
                </span>
              </button>
            ))}
          </div>
          <button type="button" class="seal-palette__remove" data-seal-remove>
            移除当前印章
          </button>
        </div>
      </div>

      <script
        type="application/json"
        id="myblog-home-data"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            feedItems,
            channels: myblogChannels,
            seals: myblogSealDefinitions,
            tags,
          }).replace(/</g, "\\u003c"),
        }}
      />
    </main>
  )
}

export default (() => MyBlogHome) satisfies QuartzComponentConstructor
