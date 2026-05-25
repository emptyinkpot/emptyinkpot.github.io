import { type ReactNode } from 'react';
import { Surface } from './Surface';

export type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
};

export function EmptyState({ icon, title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <Surface as="section" className="grid max-w-xl justify-items-start gap-4" padding="lg" variant="inset">
      {icon ? (
        <div className="flex h-10 w-10 items-center justify-center rounded-[8px] border border-[var(--runtime-surface-border)] bg-[var(--surface-strong)] text-[var(--accent)]">
          {icon}
        </div>
      ) : null}
      <div className="grid gap-2">
        <h2 className="m-0 text-xl font-semibold tracking-normal text-[var(--text)]">{title}</h2>
        {description ? <p className="m-0 text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
      </div>
      {action || secondaryAction ? (
        <div className="flex flex-wrap items-center gap-2">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </Surface>
  );
}
