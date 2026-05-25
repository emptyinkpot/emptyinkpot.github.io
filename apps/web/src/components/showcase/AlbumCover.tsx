type AlbumCoverProps = {
  title: string;
  cover?: string;
};

export default function AlbumCover({ title, cover }: AlbumCoverProps) {
  return (
    <div className="showcase-cover showcase-cover--album">
      {cover ? <img src={cover} alt={title} loading="lazy" /> : <span>{title.slice(0, 2)}</span>}
    </div>
  );
}
