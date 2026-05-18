import Content from "../pages/Content"
import MyBlogHome from "./MyBlogHome"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const MarkdownContent = Content()
const Home = MyBlogHome()

const MyBlogContent: QuartzComponent = (props: QuartzComponentProps) => {
  if (props.fileData.slug === "index") {
    return <Home {...props} />
  }

  return <MarkdownContent {...props} />
}

MyBlogContent.css = [Home.css, MarkdownContent.css].filter(Boolean).join("\n")
MyBlogContent.beforeDOMLoaded = [Home.beforeDOMLoaded, MarkdownContent.beforeDOMLoaded]
  .filter(Boolean)
  .join("\n")
MyBlogContent.afterDOMLoaded = [Home.afterDOMLoaded, MarkdownContent.afterDOMLoaded]
  .filter(Boolean)
  .join("\n")

export default (() => MyBlogContent) satisfies QuartzComponentConstructor
