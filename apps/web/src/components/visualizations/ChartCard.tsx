import type { ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Surface } from '../ui/Surface';

type ChartCardProps = {
  kicker: string;
  title: string;
  summary?: string;
  metric?: string;
  href?: string;
  compact?: boolean;
  children?: ReactNode;
};

export default function ChartCard({ kicker, title, summary, metric, href, compact = false, children }: ChartCardProps) {
  const className = ['chart-card', compact ? 'chart-card--compact' : ''].filter(Boolean).join(' ');

  return (
    <Surface as="article" className={className} padding="none" variant="quiet">
      <header className="chart-card__header">
        <div>
          <span>{kicker}</span>
          <h2>{title}</h2>
        </div>
        {metric ? <strong>{metric}</strong> : null}
      </header>
      {summary ? <p>{summary}</p> : null}
      <div className="chart-card__body">{children}</div>
      {href ? (
        <Button asChild={true} className="chart-card__link" size="sm" variant="quiet">
          <a href={href}>查看完整页</a>
        </Button>
      ) : null}
    </Surface>
  );
}
