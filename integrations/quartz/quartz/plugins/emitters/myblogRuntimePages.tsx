import HeaderConstructor from "../../components/Header"
import BodyConstructor from "../../components/Body"
import { pageResources, renderPage } from "../../components/renderPage"
import { MyBlogRuntimePage } from "../../components"
import { QuartzComponentProps } from "../../components/types"
import { FullPageLayout } from "../../cfg"
import { QuartzEmitterPlugin } from "../types"
import { QuartzPluginData, defaultProcessedContent } from "../vfile"
import { myblogChannels } from "../../myblog/registry"
import { defaultListPageLayout, sharedPageComponents } from "../../myblog/layouts"
import { FullSlug, pathToRoot } from "../../util/path"
import { write } from "./helpers"

type MyBlogRuntimePagesOptions = Partial<FullPageLayout>

export const MyBlogRuntimePages: QuartzEmitterPlugin<MyBlogRuntimePagesOptions> = (userOpts) => {
  const optsFor = (id: string): FullPageLayout => ({
    ...sharedPageComponents,
    ...defaultListPageLayout,
    pageBody: MyBlogRuntimePage({ id }),
    ...userOpts,
  })

  const Header = HeaderConstructor()
  const Body = BodyConstructor()

  return {
    name: "MyBlogRuntimePages",
    getQuartzComponents() {
      return [
        sharedPageComponents.head,
        Header,
        Body,
        ...sharedPageComponents.header,
        ...defaultListPageLayout.beforeBody,
        ...defaultListPageLayout.left,
        ...defaultListPageLayout.right,
        sharedPageComponents.footer,
        ...myblogChannels.map((channel) => MyBlogRuntimePage({ id: channel.id })),
      ]
    },
    async *emit(ctx, content, resources) {
      const allFiles = content.map((item) => item[1].data)
      for (const channel of myblogChannels.filter((item) => item.nativeOwner !== "quartz")) {
        const slug = channel.slug as FullSlug
        const fileData: QuartzPluginData = {
          slug,
          frontmatter: {
            title: channel.title,
            description: channel.description,
            tags: channel.tags,
          },
          description: channel.description,
        }
        const [tree, file] = defaultProcessedContent(fileData)
        const cfg = ctx.cfg.configuration
        const externalResources = pageResources(pathToRoot(slug), resources)
        const componentData: QuartzComponentProps = {
          ctx,
          fileData: file.data,
          externalResources,
          cfg,
          children: [],
          tree,
          allFiles,
        }

        const layout = optsFor(channel.id)
        const rendered = renderPage(cfg, slug, componentData, layout, externalResources)
        yield write({ ctx, content: rendered, slug, ext: ".html" })
      }

      const runtimeIndex = {
        generatedAt: new Date().toISOString(),
        framework: "quartz",
        rule: "Quartz is the only primary framework; MyBlog runtime surfaces are Quartz emitters/components/plugins.",
        channels: myblogChannels,
        content: allFiles.map((file) => ({
          slug: file.slug,
          title: file.frontmatter?.title,
          description: file.description ?? file.frontmatter?.description,
          tags: file.frontmatter?.tags ?? [],
          dates: file.dates,
        })),
      }
      yield write({
        ctx,
        slug: "static/myblog-runtime.json" as FullSlug,
        ext: "",
        content: JSON.stringify(runtimeIndex, null, 2),
      })
    },
  }
}
