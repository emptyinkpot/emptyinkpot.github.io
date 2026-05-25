import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { StoryCanvas } from '../../stories/StoryCanvas';
import { homeCommands, projectCommands } from '../../stories/fixtures/commands';
import HomeCommandPalette from './HomeCommandPalette';
import HomeNumberTicker from './HomeNumberTicker';
import HoverPreviewSystem from './HoverPreviewSystem';
import ProjectWorkbenchCommand from './ProjectWorkbenchCommand';

const meta = {
  component: HomeCommandPalette,
  tags: ['ai-generated'],
  decorators: [
    (Story) => (
      <StoryCanvas kind="home">
        <Story />
      </StoryCanvas>
    )
  ]
} satisfies Meta<typeof HomeCommandPalette>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Trigger: Story = {
  args: {
    commands: [...homeCommands]
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: '全局检索' })).toBeVisible();
  }
};

export const OpenCommandLayer: Story = {
  args: {
    commands: [...homeCommands]
  },
  play: async ({ canvas, userEvent, canvasElement }) => {
    await userEvent.click(canvas.getByRole('button', { name: '全局检索' }));
    await expect(canvasElement.ownerDocument.querySelector('.home-command__layer')).toBeTruthy();
  }
};

export const ObjectCount: Story = {
  render: () => (
    <StoryCanvas kind="home">
      <HomeNumberTicker value={1280} suffix=" objects" />
    </StoryCanvas>
  ),
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText('1,280 objects')).toBeVisible());
  }
};

export const ProjectCommand: Story = {
  render: () => (
    <StoryCanvas kind="home">
      <ProjectWorkbenchCommand commands={[...projectCommands]} />
    </StoryCanvas>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /Command/ })).toBeVisible();
  }
};

export const HoverTarget: Story = {
  render: () => (
    <StoryCanvas kind="home">
      <button
        className="home-feed-card home-feed-card--compact"
        data-hover-preview={JSON.stringify({
          type: 'book',
          id: 'storybook-hover',
          title: 'Hover Preview Story',
          summary: '这个 story 验证全局 hover preview runtime island。',
          image: 'https://placehold.co/360x240/f3efe7/201b16?text=Hover+Preview',
          tags: ['Storybook', 'Runtime', 'Preview']
        })}
        data-hover-type="book"
        data-hover-id="storybook-hover"
        data-hover-title="Hover Preview Story"
        data-hover-summary="这个 story 验证全局 hover preview runtime island。"
        data-hover-image="https://placehold.co/360x240/f3efe7/201b16?text=Hover+Preview"
        data-hover-tags={JSON.stringify(['Storybook', 'Runtime', 'Preview'])}
        type="button"
      >
        <div className="home-feed-card__body">
          <span>Hover target</span>
          <h2>移动鼠标到这里</h2>
          <p>HoverPreviewSystem 会读取 data-hover-* 属性并投影浮层。</p>
        </div>
      </button>
      <HoverPreviewSystem />
    </StoryCanvas>
  ),
  play: async ({ canvas, userEvent, canvasElement }) => {
    await userEvent.hover(canvas.getByText('移动鼠标到这里'));
    const body = within(canvasElement.ownerDocument.body);
    await expect(await body.findByText('Hover Preview Story')).toBeTruthy();
  }
};
