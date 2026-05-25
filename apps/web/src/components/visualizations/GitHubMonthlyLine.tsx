import { getLineChartPoints, type MonthlyPoint } from '../../lib/analytics';

type GitHubMonthlyLineProps = {
  points: MonthlyPoint[];
  compact?: boolean;
};

export default function GitHubMonthlyLine({ points, compact = false }: GitHubMonthlyLineProps) {
  const width = 320;
  const height = compact ? 92 : 128;
  const polyline = getLineChartPoints(points, width, height);
  const className = ['github-line-chart', compact ? 'github-line-chart--compact' : ''].filter(Boolean).join(' ');

  return (
    <div className={className} data-github-viz="monthly-line" data-github-compact={compact ? 'true' : undefined}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="GitHub monthly contribution line chart">
        <path d={`M0 ${height} H${width}`} />
        <polyline points={polyline} />
      </svg>
      <div className="github-line-chart__labels">
        {points.map((point) => (
          <span key={point.label}>
            <strong>{point.value}</strong>
            <small>{point.label}</small>
          </span>
        ))}
      </div>
    </div>
  );
}
