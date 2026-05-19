import type { PluggableList } from 'unified';

export type MyBlogRuntimeResource = {
  id: string;
  html: string;
};

export type MyBlogPlugin = {
  name: string;
  markdown?: {
    rehypePlugins?: PluggableList;
  };
  resources?: (ctx: Record<string, unknown>) => {
    head?: MyBlogRuntimeResource[];
    afterBody?: MyBlogRuntimeResource[];
  };
};

export const prettyCodeOptions: {
  theme: string;
  keepBackground: boolean;
};

export const myblogPlugins: MyBlogPlugin[];

export function defineMyBlogPlugin(plugin: MyBlogPlugin): MyBlogPlugin;
export function getMarkdownRehypePlugins(plugins?: MyBlogPlugin[]): PluggableList;
export function getMyBlogRuntimeResources(
  ctx?: Record<string, unknown>,
  plugins?: MyBlogPlugin[]
): {
  head: MyBlogRuntimeResource[];
  afterBody: MyBlogRuntimeResource[];
};
