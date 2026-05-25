import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import type { BookItem } from '../../lib/books/types';
import type { MusicItem } from '../../data/music';
import AlbumCover from './AlbumCover';
import BookCover from './BookCover';
import BookshelfCard from './BookshelfCard';
import MusicCard from './MusicCard';

const book: BookItem = {
  id: 'quartz-runtime',
  title: 'Quartz Runtime Notes',
  author: 'MyBlog',
  status: 'reading',
  statusLabel: '阅读中',
  note: 'Quartz/Obsidian 能力作为成熟底座进入 MyBlog 的迁移笔记。',
  category: 'Knowledge',
  tags: ['quartz', 'react'],
  sourceType: 'external',
  openlistPath: '/Obsidian/books/quartz-runtime.md',
  cover: ''
};

const music: MusicItem = {
  id: 'night-writing-loop',
  title: 'Night Writing Loop',
  artist: 'Local playlist',
  album: 'Writing desk',
  platform: 'local',
  href: '/music/',
  mood: ['night', 'writing'],
  note: '低干扰写作循环。'
};

const meta = {
  tags: ['ai-generated']
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ShowcaseCovers: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <BookCover title="Quartz Runtime Notes" />
      <AlbumCover title="Night Writing Loop" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('无封面')).toBeVisible();
    await expect(canvas.getByText('Ni')).toBeVisible();
  }
};

export const BookAndMusicCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 720 }}>
      <BookshelfCard book={book} />
      <MusicCard item={music} />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /Quartz Runtime Notes/i })).toHaveAttribute(
      'href',
      '/books/openlist/?path=%2FObsidian%2Fbooks%2Fquartz-runtime.md'
    );
    await expect(canvas.getByRole('link', { name: /Night Writing Loop/i })).toHaveAttribute('href', '/music/');
  }
};

export const InertMusicCard: Story = {
  render: () => <MusicCard item={music} inertCard={true} compact={true} />
};
