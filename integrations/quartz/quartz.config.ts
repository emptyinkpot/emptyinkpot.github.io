import { QuartzConfig } from "./quartz/cfg"
import * as Component from "./quartz/components"
import * as Plugin from "./quartz/plugins"

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "MyBlog",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: null,
    locale: "zh-CN",
    baseUrl: "blog.tengokukk.com",
    ignorePatterns: ["private", "templates", ".obsidian", ".trash", "**/*.semantic.json"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "Noto Serif SC",
        body: "Noto Serif SC",
        code: "IBM Plex Mono",
      },
      colors: {
        lightMode: {
          light: "#f3efe7",
          lightgray: "#ded6ca",
          gray: "#b6a999",
          darkgray: "#4e443b",
          dark: "#201b16",
          secondary: "#1f4a5f",
          tertiary: "#6b2d5c",
          highlight: "rgba(31, 74, 95, 0.1)",
          textHighlight: "#fff23688",
        },
        darkMode: {
          light: "#151412",
          lightgray: "#2d2a26",
          gray: "#6f675d",
          darkgray: "#d6cec2",
          dark: "#f4efe6",
          secondary: "#8fb4c3",
          tertiary: "#d29ac4",
          highlight: "rgba(143, 180, 195, 0.16)",
          textHighlight: "#b3aa0288",
        },
      },
    },
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

export default config
