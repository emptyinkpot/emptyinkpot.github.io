import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { getMarkdownRehypePlugins, prettyCodeOptions } from '../myblog/plugins.mjs';

export { prettyCodeOptions };

export const markdownRehypePlugins = getMarkdownRehypePlugins();

export async function renderMarkdownToHtml(markdown) {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype);

  for (const plugin of markdownRehypePlugins) {
    if (Array.isArray(plugin)) {
      processor.use(plugin[0], plugin[1]);
    } else {
      processor.use(plugin);
    }
  }

  const file = await processor.use(rehypeStringify).process(markdown);
  return String(file);
}
