import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor } from 'storybook/test';
import { StoryCanvas, StoryOpenListPath } from '../../stories/StoryCanvas';
import { storyBooks } from '../../stories/fixtures/books';
import BookReader from './BookReader';
import BookDrawerReader from './BookDrawerReader';
import BookshelfGrid from './BookshelfGrid';
import EpubReader from './EpubReader';
import PdfReader from './PdfReader';
import RuntimeBookDetail from './RuntimeBookDetail';
import RuntimeBookFeed from './RuntimeBookFeed';
import RuntimeBookReader from './RuntimeBookReader';

const meta = {
  component: RuntimeBookFeed,
  tags: ['ai-generated'],
  decorators: [
    (Story) => (
      <StoryCanvas kind="home">
        <Story />
      </StoryCanvas>
    )
  ]
} satisfies Meta<typeof RuntimeBookFeed>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FeedProjection: Story = {
  args: {
    targetId: 'storybook-feed'
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText('books-index：3 本')).toBeVisible());
    await expect(canvas.getByText('OpenList 书架')).toBeVisible();
  }
};

export const DrawerReaderMount: Story = {
  render: () => (
    <StoryCanvas kind="book">
      <section className="book-drawer-reader-panel">
        <header className="book-drawer-reader-panel__intro">
          <div className="book-drawer-reader-panel__copy">
            <span className="book-drawer-reader-panel__eyebrow">Drawer reader mount</span>
            <h3>BookDrawerReader</h3>
            <p>这个 story 验证 drawer reader runtime island 已挂载并监听事件。</p>
          </div>
        </header>
        <div className="book-drawer-reader-panel__mount" data-book-drawer-reader-mount="storybook-drawer-mount" />
      </section>
      <BookDrawerReader books={storyBooks} />
    </StoryCanvas>
  )
};

export const VisualShelf: Story = {
  render: () => (
    <StoryCanvas kind="book">
      <BookshelfGrid />
    </StoryCanvas>
  ),
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getAllByText('Designing Data-Intensive Applications').length).toBeGreaterThan(0));
    await expect(canvas.getByText(/books-index 已加载 3 本/)).toBeVisible();
  }
};

export const PageReader: Story = {
  render: () => (
    <StoryCanvas kind="reader">
      <BookReader book={storyBooks[0]} />
    </StoryCanvas>
  ),
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText('/storybook-fixtures/designing-data-intensive-applications.pdf')).toBeVisible());
  }
};

export const ReaderEngines: Story = {
  render: () => (
    <StoryCanvas kind="reader">
      <div style={{ display: 'grid', gap: 24 }}>
        <EpubReader book={storyBooks[1]} url="/storybook-fixtures/shape-up.epub" />
        <PdfReader book={storyBooks[0]} url="/storybook-fixtures/ddia.pdf" />
      </div>
    </StoryCanvas>
  )
};

export const OpenListDetail: Story = {
  render: () => (
    <StoryOpenListPath>
      <RuntimeBookDetail />
    </StoryOpenListPath>
  ),
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText('Storybook Runtime Book')).toBeVisible());
    await expect(canvas.getByText('/Obsidian/books/storybook-book.pdf')).toBeVisible();
  }
};

export const OpenListReader: Story = {
  render: () => (
    <StoryOpenListPath>
      <RuntimeBookReader />
    </StoryOpenListPath>
  ),
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText(/openlist-storybook-book/)).toBeVisible());
  }
};
