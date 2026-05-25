import type { RuntimeMarkdownObject } from '../../lib/runtimeContent';
import { formatRuntimeDate, getRuntimeArticleCard, getRuntimeArticleReadingMinutes } from '../../lib/runtimeArticleCard';
import { toSlug } from '../../lib/content';
import { withBase } from '../../lib/site';

type ArticleCardProps = {
  article: RuntimeMarkdownObject;
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const card = getRuntimeArticleCard(article);

  return (
    <article className="home-post-card h-full p-4 md:p-4">
      <div className="mb-4 flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.22em] text-[color:var(--home-accent)]">
        <a className="relative z-10 transition hover:text-stone-900" href={withBase(`/categories/${toSlug(card.eyebrow)}/`)}>
          {card.eyebrow}
        </a>
        <span>{formatRuntimeDate(article.date)}</span>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold leading-tight text-stone-900 md:text-[1.35rem]">
          <a className="stretched-link" href={withBase(`/posts/${article.slug}/`)}>
            {article.title}
          </a>
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-stone-600">{card.subtitle}</p>
        <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
          {getRuntimeArticleReadingMinutes(article)} min read
        </p>
      </div>
    </article>
  );
}
