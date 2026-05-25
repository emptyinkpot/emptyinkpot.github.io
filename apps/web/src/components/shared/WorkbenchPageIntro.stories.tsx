import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import GiscusComments from '../post/GiscusComments';
import HomeWorkbenchSectionLine from '../home/HomeWorkbenchSectionLine';
import ArticleCard from './ArticleCard';
import SiteFooter from './SiteFooter';
import SiteHeader from './SiteHeader';
import WorkbenchPageIntro from './WorkbenchPageIntro';

const article = {
  id: 'runtime-react-story',
  slug: 'runtime-react-story',
  title: 'React 化 Storybook 投影记录',
  subtitle: '把低风险展示层从 Astro component 收敛到 React component。',
  excerpt: 'Storybook 现在能识别 React island 和迁移出的展示组件。',
  body: '',
  collection: 'posts',
  category: 'blog',
  tags: ['React', 'Storybook'],
  date: '2026-05-25',
  updated: '2026-05-25',
  readingMinutes: 4,
  wordCount: 1200,
  href: '/posts/runtime-react-story/',
  sourcePath: 'docs/runtime-react-story.md',
  openlistPath: '/openlist/Obsidian/docs/runtime-react-story.md',
  openlistUrl: '/openlist/Obsidian/docs/runtime-react-story.md',
  backlinks: [],
  wikilinks: [],
  assets: [],
  folderTags: ['blog']
};

const meta = {
  tags: ['ai-generated']
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const IntroSurface: Story = {
  render: () => (
    <WorkbenchPageIntro
      kicker="React Runtime"
      title="组件化迁移入口"
      summary="页面 shell 保持 Astro，展示组件改为 React 并进入 Storybook。"
      stats={[
        { label: 'stories', value: '22+' },
        { label: 'runtime', value: 'React' }
      ]}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: '组件化迁移入口' })).toBeVisible();
    await expect(canvas.getByText('React Runtime')).toBeVisible();
  }
};

export const RuntimeArticleCard: Story = {
  render: () => <ArticleCard article={article} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'React 化 Storybook 投影记录' })).toHaveAttribute(
      'href',
      '/posts/runtime-react-story/'
    );
  }
};

export const SiteChromeAndFeedback: Story = {
  render: () => (
    <div>
      <SiteHeader pathname="/posts" />
      <main className="page-wrap" style={{ display: 'grid', gap: 16, paddingBlock: 24 }}>
        <HomeWorkbenchSectionLine leading="React component shell" trailing="Storybook indexed" tone="snap" />
        <GiscusComments />
      </main>
      <SiteFooter />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: '文章' })).toHaveClass(/bg-stone-900/);
    await expect(canvas.getByText('Feedback')).toBeVisible();
  }
};
