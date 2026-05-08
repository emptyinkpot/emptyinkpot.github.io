import rss from '@astrojs/rss';
import { getRuntimeArticles } from '../lib/runtimeContent';
import { absoluteUrl } from '../lib/site';

export async function GET(context: { site: URL | undefined }) {
  const articles = getRuntimeArticles();
  const site = absoluteUrl('/', context.site);

  return rss({
    title: 'emptyinkpot',
    description: 'emptyinkpot 的文章订阅源，来自 Runtime MarkdownObject。',
    site,
    items: articles.map((article) => ({
      title: article.title,
      description: article.description || article.summary,
      pubDate: new Date(article.date),
      categories: [...article.categories, ...article.tags, ...(article.series ? [article.series] : [])],
      link: new URL(`posts/${article.slug}/`, site).toString()
    })),
    customData: `<language>zh-cn</language>`
  });
}
