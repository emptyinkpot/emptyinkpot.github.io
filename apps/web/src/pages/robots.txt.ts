import type { APIRoute } from 'astro';
import { absoluteUrl } from '../lib/site';

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = absoluteUrl('/sitemap-index.xml', site);

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8'
    }
  });
};
