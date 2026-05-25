import type { MusicItem } from '../../data/music';
import AlbumCover from './AlbumCover';

type MusicCardProps = {
  item: MusicItem;
  compact?: boolean;
  inertCard?: boolean;
};

export default function MusicCard({ item, compact = false, inertCard = false }: MusicCardProps) {
  const className = ['showcase-card', 'showcase-card--music', compact ? 'showcase-card--compact' : '']
    .filter(Boolean)
    .join(' ');
  const href = item.href ?? '/music/';
  const content = (
    <>
      <AlbumCover title={item.title} cover={item.cover} />
      <div>
        <span>音乐 / {item.platform}</span>
        <strong>{item.title}</strong>
        <small>
          {item.artist}
          {item.album ? ` / ${item.album}` : ''}
        </small>
        <p>{item.note}</p>
        <div className="showcase-card__tags">
          {item.mood.map((tag) => (
            <em key={tag}>{tag}</em>
          ))}
        </div>
      </div>
    </>
  );

  return inertCard ? (
    <article className={className}>{content}</article>
  ) : (
    <a className={className} href={href}>
      {content}
    </a>
  );
}
