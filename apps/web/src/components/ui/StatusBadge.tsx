import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes } from 'react';
import { cn } from './utils';

const statusBadgeVariants = cva(
  'inline-flex h-6 w-fit items-center gap-1.5 rounded-[999px] border px-2.5 text-xs font-medium leading-none',
  {
    variants: {
      tone: {
        neutral: 'border-[var(--border)] bg-[var(--surface)] text-[var(--muted)]',
        success: 'border-[#7aa58a55] bg-[#e5efe7] text-[#2f6544]',
        warning: 'border-[#c6a75b55] bg-[#f3ead1] text-[#76571c]',
        danger: 'border-[#c96d6155] bg-[#f2ddd9] text-[#8c382f]',
        info: 'border-[#6f9bb655] bg-[#e2edf1] text-[#24566d]',
        accent: 'border-[var(--runtime-surface-border)] bg-[var(--accent-soft)] text-[var(--accent)]'
      }
    },
    defaultVariants: {
      tone: 'neutral'
    }
  }
);

const statusToneMap: Record<string, NonNullable<VariantProps<typeof statusBadgeVariants>['tone']>> = {
  active: 'success',
  healthy: 'success',
  success: 'success',
  synced: 'success',
  draft: 'warning',
  pending: 'warning',
  cooldown: 'warning',
  queued: 'warning',
  failed: 'danger',
  error: 'danger',
  blocked: 'danger',
  ai: 'accent',
  'ai-generated': 'accent',
  runtime: 'info'
};

export type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusBadgeVariants> & {
    status?: string;
    showDot?: boolean;
  };

export function getStatusTone(status?: string, tone?: StatusBadgeProps['tone']) {
  if (tone) {
    return tone;
  }
  if (!status) {
    return 'neutral';
  }
  return statusToneMap[status.toLowerCase()] ?? 'neutral';
}

export function StatusBadge({ className, children, status, tone, showDot = true, ...props }: StatusBadgeProps) {
  const resolvedTone = getStatusTone(status, tone);
  const label = children ?? status ?? resolvedTone;

  return (
    <span className={cn(statusBadgeVariants({ tone: resolvedTone }), className)} {...props}>
      {showDot ? <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current opacity-70" /> : null}
      {label}
    </span>
  );
}
