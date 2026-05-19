import { myblogQuartzComponents } from "./components"
import { myblogQuartzLayouts } from "./layouts"
import { myblogQuartzPlugins } from "./plugins"
import * as Registry from "./registry"

export * from "./registry"
export {
  defaultContentPageLayout,
  defaultListPageLayout,
  myblogHomePageLayout,
  sharedPageComponents,
} from "./layouts"

export { myblogQuartzComponents, myblogQuartzLayouts, myblogQuartzPlugins }

export const myblogQuartz = {
  registry: Registry,
  components: myblogQuartzComponents,
  layouts: myblogQuartzLayouts,
  plugins: myblogQuartzPlugins,
} as const
