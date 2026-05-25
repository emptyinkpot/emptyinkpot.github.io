import HomeWorkbenchSectionLine from '../home/HomeWorkbenchSectionLine';
import { MetricCard } from '../ui/MetricCard';
import { Surface } from '../ui/Surface';

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
    <Surface
      as="section"
      className="workbench-page__intro home-workbench__card home-workbench__card--panel"
      padding="none"
      variant="quiet"
    >
      <HomeWorkbenchSectionLine leading={kicker} trailing="Workbench Page" tight={true} />
      <div className="workbench-page__intro-copy">
        <h1>{title}</h1>
        <p>{summary}</p>
      </div>
      {stats.length > 0 ? (
        <div className="workbench-page__stats">
          {stats.map((stat) => (
            <MetricCard
              className="workbench-page__stat"
              key={`${stat.label}:${stat.value}`}
              label={stat.label}
              padding="none"
              value={stat.value}
              valueFirst={true}
              variant="quiet"
            />
          ))}
        </div>
      ) : null}
    </Surface>
  );
}
