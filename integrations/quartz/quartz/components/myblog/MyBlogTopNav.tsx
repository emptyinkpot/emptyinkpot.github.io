import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { myblogChannels, primaryNavChannelIds } from "../../myblog-runtime/registry"
import { FullSlug, resolveRelative } from "../../util/path"

const MyBlogTopNav: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const slug = (fileData.slug ?? "index") as FullSlug
  return (
    <nav class="myblog-topnav" aria-label="MyBlog primary navigation">
      <a class="myblog-topnav__brand" href={resolveRelative(slug, "index" as FullSlug)}>
        <span>emptyinkpot</span>
        <strong>MyBlog Quartz</strong>
      </a>
      <div class="myblog-topnav__links">
        {myblogChannels
          .filter((item) => primaryNavChannelIds.includes(item.id))
          .map((item) => (
            <a
              href={resolveRelative(slug, item.slug as FullSlug)}
              class={String(slug).startsWith(item.id) ? "is-active" : ""}
              data-myblog-nav={item.id}
            >
              {item.title}
            </a>
          ))}
      </div>
    </nav>
  )
}

export default (() => MyBlogTopNav) satisfies QuartzComponentConstructor
