import * as Component from "../components"
import * as Plugin from "../plugins"

export const myblogQuartzBundle = {
  components: {
    content: Component.MyBlogContent(),
    home: Component.MyBlogHome(),
    runtimePageFactory: Component.MyBlogRuntimePage,
    topNav: Component.MyBlogTopNav(),
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["frontmatter", "git", "filesystem"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: false }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.MyBlogStyle(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest" }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "katex" }),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage({
        pageBody: Component.MyBlogContent(),
      }),
      Plugin.MyBlogRuntimePages(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
    ],
  },
}

export const myblogQuartzComponents = myblogQuartzBundle.components
export const myblogQuartzPlugins = myblogQuartzBundle.plugins
