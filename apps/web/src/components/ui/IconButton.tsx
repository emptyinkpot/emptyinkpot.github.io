import * as Tooltip from '@radix-ui/react-tooltip';
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { Button, type ButtonProps } from './Button';

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> &
  Pick<ButtonProps, 'variant'> & {
    icon: ReactNode;
    label: string;
    tooltip?: string;
  };

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon, label, tooltip = label, variant = 'quiet', ...props }, ref) => {
    const button = (
      <Button aria-label={label} ref={ref} size="icon" variant={variant} {...props}>
        {icon}
      </Button>
    );

    if (!tooltip) {
      return button;
    }

    return (
      <Tooltip.Provider delayDuration={250}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="z-[var(--runtime-depth-command)] rounded-[8px] border border-[var(--runtime-surface-border)] bg-[var(--text)] px-2.5 py-1.5 text-xs text-white shadow-[var(--runtime-elevation-floating)]"
              sideOffset={8}
            >
              {tooltip}
              <Tooltip.Arrow className="fill-[var(--text)]" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  }
);

IconButton.displayName = 'IconButton';
