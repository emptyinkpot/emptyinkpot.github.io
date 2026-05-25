import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowRight, Check, Database, RefreshCw, Search, Settings, Sparkles } from 'lucide-react';
import { expect } from 'storybook/test';
import { StoryCanvas } from '../../stories/StoryCanvas';
import { Button, EmptyState, IconButton, MetricCard, StatusBadge, Surface } from './index';

const meta = {
  title: 'Design System/UI Primitives',
  tags: ['ai-generated'],
  decorators: [
    (Story) => (
      <StoryCanvas kind="wide">
        <div className="grid w-full max-w-5xl gap-6">
          <Story />
        </div>
      </StoryCanvas>
    )
  ]
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Actions: Story = {
  render: () => (
    <Surface className="flex flex-wrap items-center gap-3">
      <Button leadingIcon={<Search className="h-4 w-4" />}>Search runtime</Button>
      <Button trailingIcon={<ArrowRight className="h-4 w-4" />} variant="secondary">
        Open drawer
      </Button>
      <Button variant="outline">Inspect source</Button>
      <Button variant="quiet">Dismiss</Button>
      <Button loading={true}>Syncing</Button>
      <IconButton icon={<Settings className="h-4 w-4" />} label="Runtime settings" />
    </Surface>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Search runtime' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Runtime settings' })).toBeVisible();
  }
};

export const StatusAndMetrics: Story = {
  render: () => (
    <div className="grid gap-4">
      <Surface className="flex flex-wrap items-center gap-2">
        <StatusBadge status="healthy" />
        <StatusBadge status="pending" />
        <StatusBadge status="failed" />
        <StatusBadge status="runtime" />
        <StatusBadge status="AI generated" tone="accent" />
      </Surface>
      <div className="grid gap-3 md:grid-cols-3">
        <MetricCard
          description="Storybook indexed React surfaces."
          icon={<Sparkles className="h-4 w-4" />}
          label="Stories"
          trend="+ UI"
          value="27+"
        />
        <MetricCard
          description="MSW and fixtures isolate runtime dependencies."
          icon={<Database className="h-4 w-4" />}
          label="Runtime truth"
          trend="read-only"
          value="fixture"
          variant="raised"
        />
        <MetricCard
          description="Component tests run through Storybook Vitest."
          icon={<Check className="h-4 w-4" />}
          label="Coverage"
          trend="passing"
          value="browser"
        />
      </div>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('healthy')).toBeVisible();
    await expect(canvas.getByText('Stories')).toBeVisible();
    await expect(canvas.getByText('browser')).toBeVisible();
  }
};

export const EmptyRuntimeState: Story = {
  render: () => (
    <EmptyState
      action={<Button leadingIcon={<RefreshCw className="h-4 w-4" />}>Retry sync</Button>}
      description="The primitive keeps empty, loading and blocked surfaces visually consistent without inventing a new data owner."
      icon={<Database className="h-5 w-5" />}
      secondaryAction={<Button variant="secondary">Open logs</Button>}
      title="No runtime snapshot available"
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'No runtime snapshot available' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Retry sync' })).toBeVisible();
  }
};
