import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import { myblogChannels, pageDescription, toMyBlogEntries } from "./shared"
import { FullSlug, resolveRelative } from "../../util/path"

type Options = {
  id: string
}

export default ((opts: Options) => {
  const MyBlogRuntimePage: QuartzComponent = ({ allFiles, fileData }: QuartzComponentProps) => {
    const channel = myblogChannels.find((item) => item.id === opts.id) ?? myblogChannels[0]
    const slug = (fileData.slug ?? channel.slug) as FullSlug
    const entries = toMyBlogEntries(allFiles)
      .filter((entry) => entry.slug !== "index")
      .slice(0, 16)

    return (
      <main class="myblog-runtime-page" data-myblog-runtime-page={channel.id}>
        <section class="myblog-runtime-page__hero">
          <p class="myblog-kicker">{channel.kicker}</p>
          <h1>{channel.title}</h1>
          <p>{channel.description}</p>
          <div class="myblog-runtime-page__status">
            <span>{channel.status}</span>
            {channel.tags.map((tag) => (
              <a href={resolveRelative(slug, `tags/${tag}` as FullSlug)}>{tag}</a>
            ))}
          </div>
        </section>
        <section class="myblog-runtime-page__grid">
          <div class="myblog-runtime-page__panel">
            <h2>Quartz 承接方式</h2>
            {pageDescription(channel).map((line) => (
              <p>{line}</p>
            ))}
          </div>
          <div class="myblog-runtime-page__panel">
            <h2>相关内容</h2>
            <div class="myblog-runtime-page__links">
              {entries.map((entry) => (
                <a href={resolveRelative(slug, entry.href as FullSlug)}>
                  <span>{entry.kind}</span>
                  <strong>{entry.title}</strong>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
    )
  }

  return MyBlogRuntimePage
}) satisfies QuartzComponentConstructor<Options>
