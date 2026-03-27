import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getExcerptFromBody, sortPosts } from '../lib/content';
import { absoluteUrl } from '../lib/site';

export async function GET(context: { site: URL | undefined }) {
  const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));
  const site = absoluteUrl('/', context.site);

  return rss({
    title: 'emptyinkpot / Site v2',
    description: 'Astro 版个人内容站样板，聚焦极简高级、卡片杂志感与结构化技术博客体验。',
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? getExcerptFromBody(post.body, 180),
      pubDate: post.data.date,
      categories: [...post.data.categories, ...post.data.tags, ...(post.data.series ? [post.data.series] : [])],
      link: new URL(`posts/${post.id}/`, site).toString()
    })),
    customData: `<language>zh-cn</language>`
  });
}
