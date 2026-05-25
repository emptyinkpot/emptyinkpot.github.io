import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from './utils';

export const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] border text-sm font-medium',
    'transition-[background,border-color,color,box-shadow,transform] duration-[var(--runtime-motion-fast)] ease-[var(--runtime-ease-standard)]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--runtime-focus-ring)] focus-visible:ring-offset-[var(--runtime-focus-offset)] focus-visible:ring-offset-[var(--page-bg)]',
    'disabled:pointer-events-none disabled:opacity-50'
  ],
  {
    variants: {
      variant: {
        primary: 'border-transparent bg-[var(--accent)] text-white shadow-[var(--runtime-elevation-surface)] hover:bg-[#173b4e]',
        secondary:
          'border-[var(--runtime-surface-border)] bg-[var(--runtime-surface-panel)] text-[var(--text)] hover:bg-[var(--surface-strong)]',
        quiet: 'border-transparent bg-transparent text-[var(--muted)] hover:bg-[var(--accent-soft)] hover:text-[var(--text)]',
        destructive: 'border-transparent bg-[#a13c32] text-white hover:bg-[#842f28]',
        outline: 'border-[var(--border)] bg-transparent text-[var(--text)] hover:bg-[var(--surface)]'
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-10 px-5',
        icon: 'h-9 w-9 p-0'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    leadingIcon?: ReactNode;
    trailingIcon?: ReactNode;
    loading?: boolean;
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { asChild = false, className, children, variant, size, leadingIcon, trailingIcon, loading = false, disabled, ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} disabled={disabled || loading} ref={ref} {...props}>
        {loading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : leadingIcon}
        {children}
        {trailingIcon}
      </Comp>
    );
  }
);

Button.displayName = 'Button';
