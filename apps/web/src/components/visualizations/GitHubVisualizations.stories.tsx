import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { buildGitHubAnalytics } from '../../lib/analytics';
import snapshot from '../../data/github-overview.emptyinkpot.json';
import ChartCard from './ChartCard';
import GitHubHeatmap from './GitHubHeatmap';
import GitHubLanguageDonut from './GitHubLanguageDonut';
import GitHubMonthlyLine from './GitHubMonthlyLine';
import GitHubRepoMatrix from './GitHubRepoMatrix';
import TeamSignalGraph from './TeamSignalGraph';

const analytics = buildGitHubAnalytics(snapshot.overview);

const meta = {
  tags: ['ai-generated']
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ContributionCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 980 }}>
      <ChartCard
        kicker="GitHub"
        title="贡献热力图"
        summary="公开贡献日历的 Storybook 投影。"
        metric={`${analytics.totalContributions} total`}
      >
        <GitHubHeatmap weeks={analytics.heatmapWeeks.slice(-12)} compact={true} />
      </ChartCard>
      <ChartCard kicker="Monthly" title="月度贡献折线" summary="最近 12 个月贡献趋势。" metric="trend">
        <GitHubMonthlyLine points={analytics.monthly} />
      </ChartCard>
      <ChartCard kicker="Language" title="语言分布" summary="公开仓库语言聚合。" metric={analytics.topLanguage?.label}>
        <GitHubLanguageDonut languages={analytics.languages} />
      </ChartCard>
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: '贡献热力图' })).toBeVisible();
    await expect(canvas.getByRole('img', { name: 'GitHub monthly contribution line chart' })).toBeVisible();
  }
};

export const RepoAndTeamSignals: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 980 }}>
      <GitHubRepoMatrix repos={analytics.repos} />
      <TeamSignalGraph profile={snapshot.overview.profile} repos={analytics.repos} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link', { name: /blog/i })[0]).toHaveAttribute(
      'href',
      'https://github.com/emptyinkpot/blog'
    );
    await expect(canvas.getByText('@emptyinkpot')).toBeVisible();
  }
};
