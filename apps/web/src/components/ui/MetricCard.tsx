import { type ReactNode } from 'react';
import { Surface, type SurfaceProps } from './Surface';
import { cn } from './utils';

export type MetricCardProps = Omit<SurfaceProps, 'children'> & {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  trend?: ReactNode;
  icon?: ReactNode;
};

export function MetricCard({
  className,
  label,
  value,
  description,
  trend,
  icon,
  variant = 'default',
  padding = 'md',
  ...props
}: MetricCardProps) {
  return (
    <Surface as="article" className={cn('grid gap-3', className)} padding={padding} variant={variant} {...props}>
      <div className="flex min-w-0 items-start justify-between gap-3">
        <span className="min-w-0 text-xs font-medium uppercase text-[var(--muted)]">{label}</span>
        {icon ? <span className="shrink-0 text-[var(--accent)]">{icon}</span> : null}
      </div>
      <div className="flex min-w-0 items-end justify-between gap-3">
        <strong className="min-w-0 text-2xl font-semibold leading-none tracking-normal text-[var(--text)]">{value}</strong>
        {trend ? <span className="shrink-0 text-xs font-medium text-[var(--accent)]">{trend}</span> : null}
      </div>
      {description ? <p className="m-0 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
    </Surface>
  );
}
