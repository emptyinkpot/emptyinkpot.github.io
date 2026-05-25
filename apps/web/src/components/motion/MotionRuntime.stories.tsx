import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { StoryCanvas } from '../../stories/StoryCanvas';
import { MotionConfig, motion, useReducedMotion } from '../../lib/motion';
import { Button, Surface } from '../ui';

function MotionRuntimeProbe() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
      <Surface className="grid gap-4">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <span className="text-xs font-medium uppercase text-[var(--muted)]">Motion runtime</span>
            <h2 className="m-0 text-xl font-semibold text-[var(--text)]">Motion for React is available</h2>
          </div>
          <Button variant="secondary">Compose motion surface</Button>
        </div>
        <motion.div
          animate={{ opacity: 1, scale: 1, x: 0 }}
          aria-label="Motion animated surface"
          className="h-2 rounded-full bg-[var(--accent)]"
          initial={{ opacity: 0.35, scale: 0.92, x: -24 }}
          whileHover={{ scaleX: 1.02 }}
        />
        <p className="m-0 text-sm text-[var(--muted)]">
          Reduced motion preference: {prefersReducedMotion ? 'enabled' : 'not requested'}
        </p>
      </Surface>
    </MotionConfig>
  );
}

const meta = {
  title: 'Design System/Motion Runtime',
  tags: ['ai-generated'],
  decorators: [
    (Story) => (
      <StoryCanvas kind="wide">
        <div className="w-full max-w-3xl">
          <Story />
        </div>
      </StoryCanvas>
    )
  ]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const RuntimeProbe: Story = {
  render: () => <MotionRuntimeProbe />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Motion for React is available' })).toBeVisible();
    await expect(canvas.getByLabelText('Motion animated surface')).toBeVisible();
  }
};
