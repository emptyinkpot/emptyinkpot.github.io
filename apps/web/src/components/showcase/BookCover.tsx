type BookCoverProps = {
  title: string;
  cover?: string;
};

export default function BookCover({ title, cover }: BookCoverProps) {
  return (
    <div className="showcase-cover showcase-cover--book">
      {cover ? <img src={cover} alt={title} loading="lazy" /> : <span>无封面</span>}
    </div>
  );
}
