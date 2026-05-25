import type { HeatmapWeek } from '../../lib/analytics';

type GitHubHeatmapProps = {
  weeks: HeatmapWeek[];
  compact?: boolean;
};

export default function GitHubHeatmap({ weeks, compact = false }: GitHubHeatmapProps) {
  const className = ['github-heatmap', compact ? 'github-heatmap--compact' : ''].filter(Boolean).join(' ');

  return (
    <div
      className={className}
      aria-label="GitHub contribution heatmap"
      data-github-viz="heatmap"
      data-github-compact={compact ? 'true' : undefined}
    >
      {weeks.map((week, index) => (
        <div className="github-heatmap__week" title={week.label} key={`${week.label}:${index}`}>
          {week.days.map((day) => (
            <span
              className={`github-heatmap__cell github-heatmap__cell--${day.level}`}
              title={`${day.date}: ${day.count}`}
              aria-label={`${day.date}: ${day.count}`}
              key={day.date}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
