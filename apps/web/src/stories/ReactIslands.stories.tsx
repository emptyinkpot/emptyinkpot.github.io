import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import BookCover from '../components/books/BookCover';
import BookDrawerReader from '../components/books/BookDrawerReader';
import BookReader from '../components/books/BookReader';
import BookshelfGrid from '../components/books/BookshelfGrid';
import EpubReader from '../components/books/EpubReader';
import PdfReader from '../components/books/PdfReader';
import RuntimeBookDetail from '../components/books/RuntimeBookDetail';
import RuntimeBookFeed from '../components/books/RuntimeBookFeed';
import RuntimeBookReader from '../components/books/RuntimeBookReader';
import EditIntakeWorkbench from '../components/edit-intake/EditIntakeWorkbench';
import HomeCommandPalette from '../components/react/HomeCommandPalette';
import HomeNumberTicker from '../components/react/HomeNumberTicker';
import HoverPreviewSystem from '../components/react/HoverPreviewSystem';
import ProjectWorkbenchCommand from '../components/react/ProjectWorkbenchCommand';
import { storyBooks } from './fixtures/books';
import { homeCommands, projectCommands } from './fixtures/commands';

const meta = {
  title: 'MyBlog/React Islands',
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta;

export default meta;
type Story = StoryObj;

function Canvas({
  children,
  kind = 'home'
}: {
  children: React.ReactNode;
  kind?: 'home' | 'book' | 'reader' | 'wide';
}) {
  return <main className={`storybook-canvas storybook-canvas--${kind}`}>{children}</main>;
}

function WithOpenListPath({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('path', '/Obsidian/books/storybook-book.pdf');
    window.history.replaceState(null, '', url);
  }, []);

  return <>{children}</>;
}

function WithHoverPreviewFixture() {
  useEffect(() => {
    localStorage.setItem(
      'emptyinkpot-visual-settings',
      JSON.stringify({
        interactions: {
          hoverPreview: true
        }
      })
    );
    window.dispatchEvent(
      new CustomEvent('emptyinkpot:content-settings-applied', {
        detail: {
          interactions: {
            hoverPreview: true
          }
        }
      })
    );
  }, []);

  return (
    <Canvas kind="home">
      <button
        className="home-feed-card home-feed-card--compact"
        data-hover-preview
        data-hover-type="book"
        data-hover-id="storybook-hover"
        data-hover-title="Hover Preview Story"
        data-hover-summary="这个 story 验证全局 hover preview runtime island。"
        data-hover-image="https://placehold.co/360x240/f3efe7/201b16?text=Hover+Preview"
        data-hover-tags={JSON.stringify(['Storybook', 'Runtime', 'Preview'])}
      >
        <span className="bookmark bookmark--book">
          <span>book</span>
        </span>
        <div className="home-feed-card__body">
          <span>Hover target</span>
          <h2>移动鼠标到这里</h2>
          <p>HoverPreviewSystem 会读取 data-hover-* 属性并投影浮层。</p>
        </div>
      </button>
      <HoverPreviewSystem />
    </Canvas>
  );
}

export const ComponentInventory: Story = {
  name: 'All React component inventory',
  render: () => (
    <Canvas kind="wide">
      <section className="storybook-inventory">
        {[
          'BookCover',
          'BookDrawerReader',
          'BookReader',
          'BookshelfGrid',
          'EpubReader',
          'PdfReader',
          'RuntimeBookDetail',
          'RuntimeBookFeed',
          'RuntimeBookReader',
          'EditIntakeWorkbench',
          'HomeCommandPalette',
          'HomeNumberTicker',
          'HoverPreviewSystem',
          'ProjectWorkbenchCommand'
        ].map((name) => (
          <article key={name}>
            <span>React island</span>
            <strong>{name}</strong>
          </article>
        ))}
      </section>
    </Canvas>
  )
};

export const CommandSurfaces: Story = {
  render: () => (
    <Canvas>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <HomeCommandPalette commands={[...homeCommands]} />
        <ProjectWorkbenchCommand commands={[...projectCommands]} />
        <HomeNumberTicker value={1280} suffix=" objects" />
      </div>
    </Canvas>
  )
};

export const HomeCommandPaletteIsland: Story = {
  render: () => (
    <Canvas>
      <HomeCommandPalette commands={[...homeCommands]} />
    </Canvas>
  )
};

export const ProjectWorkbenchCommandIsland: Story = {
  render: () => (
    <Canvas>
      <ProjectWorkbenchCommand commands={[...projectCommands]} />
    </Canvas>
  )
};

export const HomeNumberTickerIsland: Story = {
  render: () => (
    <Canvas>
      <HomeNumberTicker value={98456} suffix=" words" />
    </Canvas>
  )
};

export const HoverPreviewSystemIsland: Story = {
  render: () => <WithHoverPreviewFixture />
};

export const BookCoverStates: Story = {
  render: () => (
    <Canvas kind="book">
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
        {storyBooks.map((book) => (
          <BookCover book={book} key={book.id} />
        ))}
        <BookCover book={{ ...storyBooks[0], cover: '', title: 'Generated cover disabled' }} allowGeneratedCover={false} />
      </div>
    </Canvas>
  )
};

export const BookshelfGridIsland: Story = {
  render: () => (
    <Canvas kind="book">
      <BookshelfGrid />
    </Canvas>
  )
};

export const RuntimeBookFeedIsland: Story = {
  render: () => (
    <Canvas kind="home">
      <RuntimeBookFeed targetId="storybook-feed" />
    </Canvas>
  )
};

export const BookDrawerReaderIsland: Story = {
  render: () => (
    <Canvas kind="book">
      <section className="book-drawer-reader-panel">
        <header className="book-drawer-reader-panel__intro">
          <div className="book-drawer-reader-panel__copy">
            <span className="book-drawer-reader-panel__eyebrow">Drawer reader mount</span>
            <h3>BookDrawerReader</h3>
            <p>这个 story 只验证 drawer reader runtime island 已挂载并监听事件。</p>
          </div>
        </header>
        <div className="book-drawer-reader-panel__mount" data-book-drawer-reader-mount="storybook-drawer-mount" />
      </section>
      <BookDrawerReader books={storyBooks} />
    </Canvas>
  )
};

export const BookReaderPageIsland: Story = {
  render: () => (
    <Canvas kind="reader">
      <BookReader book={storyBooks[0]} />
    </Canvas>
  )
};

export const BookReaderDrawerIsland: Story = {
  render: () => (
    <Canvas kind="reader">
      <BookReader book={storyBooks[0]} mode="drawer" />
    </Canvas>
  )
};

export const EpubReaderIsland: Story = {
  render: () => (
    <Canvas kind="reader">
      <EpubReader book={storyBooks[1]} url="/storybook-fixtures/shape-up.epub" />
    </Canvas>
  )
};

export const PdfReaderPageIsland: Story = {
  render: () => (
    <Canvas kind="reader">
      <PdfReader book={storyBooks[0]} url="/storybook-fixtures/ddia.pdf" />
    </Canvas>
  )
};

export const PdfReaderDrawerIsland: Story = {
  render: () => (
    <Canvas kind="reader">
      <PdfReader book={storyBooks[0]} mode="drawer" url="/storybook-fixtures/ddia.pdf" />
    </Canvas>
  )
};

export const RuntimeBookDetailIsland: Story = {
  render: () => (
    <WithOpenListPath>
      <RuntimeBookDetail />
    </WithOpenListPath>
  )
};

export const RuntimeBookReaderIsland: Story = {
  render: () => (
    <WithOpenListPath>
      <RuntimeBookReader />
    </WithOpenListPath>
  )
};

export const EditIntakeWorkbenchIsland: Story = {
  render: () => <EditIntakeWorkbench />
};
