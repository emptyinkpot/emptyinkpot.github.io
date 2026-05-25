import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { StoryCanvas } from '../../stories/StoryCanvas';
import { storyBooks } from '../../stories/fixtures/books';
import BookCover from './BookCover';

const meta = {
  component: BookCover,
  tags: ['ai-generated'],
  decorators: [
    (Story) => (
      <StoryCanvas kind="book">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 205px)', gap: 24, height: 297 }}>
          <Story />
        </div>
      </StoryCanvas>
    )
  ]
} satisfies Meta<typeof BookCover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CachedCover: Story = {
  args: {
    book: storyBooks[0]
  }
};

export const FallbackCover: Story = {
  args: {
    book: { ...storyBooks[0], cover: '', title: 'Generated cover disabled' },
    allowGeneratedCover: false
  }
};

export const CssCheck: Story = {
  args: {
    book: { ...storyBooks[0], cover: '', title: 'Generated cover disabled' },
    allowGeneratedCover: false
  },
  play: async ({ canvas }) => {
    const fallback = canvas.getByText('无封面').closest('.book-cover-fallback');
    await expect(fallback).toBeTruthy();
    expect(getComputedStyle(fallback as Element).display).toBe('grid');
  }
};
