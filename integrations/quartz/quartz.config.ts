import { QuartzConfig } from "./quartz/cfg"
import { myblogQuartzPlugins } from "./quartz/myblog-runtime/plugins"

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
  plugins: myblogQuartzPlugins,
}

export default config
