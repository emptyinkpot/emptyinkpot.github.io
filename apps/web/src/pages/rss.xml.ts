import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { getExcerptFromBody, sortPosts } from '../lib/content';
import { absoluteUrl } from '../lib/site';

export async function GET(context: { site: URL | undefined }) {
  const posts = sortPosts(await getCollection('posts', ({ data }) => !data.draft));
  const site = absoluteUrl('/', context.site);

  return rss({
    title: 'emptyinkpot',
    description: 'emptyinkpot 的文章订阅源，聚焦结构化技术写作、项目整理与个人知识沉淀。',
    site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description ?? post.data.summary ?? getExcerptFromBody(post.body, 180),
      pubDate: post.data.date,
      categories: [...post.data.categories, ...post.data.tags, ...(post.data.series ? [post.data.series] : [])],
      link: new URL(`posts/${post.id}/`, site).toString()
    })),
    customData: `<language>zh-cn</language>`
  });
}
