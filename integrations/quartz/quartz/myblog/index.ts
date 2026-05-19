import { myblogQuartzComponents } from "./components"
import { myblogQuartzLayouts } from "./layouts"
import { myblogQuartzPlugins } from "./plugins"

export {
  defaultContentPageLayout,
  defaultListPageLayout,
  myblogHomePageLayout,
  sharedPageComponents,
} from "./layouts"

export { myblogQuartzComponents, myblogQuartzLayouts, myblogQuartzPlugins }

export const myblogQuartz = {
  components: myblogQuartzComponents,
  layouts: myblogQuartzLayouts,
  plugins: myblogQuartzPlugins,
} as const
