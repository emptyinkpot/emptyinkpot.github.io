import HomeWorkbenchSectionLine from '../home/HomeWorkbenchSectionLine';

type StatItem = {
  label: string;
  value: string;
};

type WorkbenchPageIntroProps = {
  kicker: string;
  title: string;
  summary: string;
  stats?: StatItem[];
};

export default function WorkbenchPageIntro({ kicker, title, summary, stats = [] }: WorkbenchPageIntroProps) {
  return (
    <section className="workbench-page__intro home-workbench__card home-workbench__card--panel">
      <HomeWorkbenchSectionLine leading={kicker} trailing="Workbench Page" tight={true} />
      <div className="workbench-page__intro-copy">
        <h1>{title}</h1>
        <p>{summary}</p>
      </div>
      {stats.length > 0 ? (
        <div className="workbench-page__stats">
          {stats.map((stat) => (
            <div className="workbench-page__stat" key={`${stat.label}:${stat.value}`}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
