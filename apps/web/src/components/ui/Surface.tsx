import { cva, type VariantProps } from 'class-variance-authority';
import { type HTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from './utils';

const surfaceVariants = cva('min-w-0 rounded-[8px] border transition-shadow duration-[var(--runtime-motion-base)]', {
  variants: {
    variant: {
      default: 'border-[var(--runtime-surface-border)] bg-[var(--runtime-surface-panel)] shadow-[var(--runtime-elevation-surface)]',
      raised: 'border-[var(--runtime-surface-border)] bg-[var(--surface-strong)] shadow-[var(--runtime-elevation-raised)]',
      quiet: 'border-transparent bg-transparent shadow-none',
      inset: 'border-[var(--border)] bg-[var(--surface)] shadow-none'
    },
    padding: {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    }
  },
  defaultVariants: {
    variant: 'default',
    padding: 'md'
  }
});

export type SurfaceProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof surfaceVariants> & {
    as?: 'article' | 'aside' | 'div' | 'section';
    children?: ReactNode;
  };

export const Surface = forwardRef<HTMLElement, SurfaceProps>(
  ({ as: Comp = 'div', className, variant, padding, children, ...props }, ref) => (
    <Comp className={cn(surfaceVariants({ variant, padding }), className)} ref={ref} {...props}>
      {children}
    </Comp>
  )
);

Surface.displayName = 'Surface';
