import type { Meta, StoryObj } from '@storybook/react-vite';
import BookCover from '../components/books/BookCover';
import BookshelfGrid from '../components/books/BookshelfGrid';
import HomeCommandPalette from '../components/react/HomeCommandPalette';
import HomeNumberTicker from '../components/react/HomeNumberTicker';
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

export const CommandSurfaces: Story = {
  render: () => (
    <main className="storybook-canvas storybook-canvas--home">
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <HomeCommandPalette commands={[...homeCommands]} />
        <ProjectWorkbenchCommand commands={[...projectCommands]} />
        <HomeNumberTicker value={1280} suffix=" objects" />
      </div>
    </main>
  )
};

export const BookCoverStates: Story = {
  render: () => (
    <main className="storybook-canvas storybook-canvas--book">
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        {storyBooks.map((book) => (
          <BookCover book={book} key={book.id} />
        ))}
      </div>
    </main>
  )
};

export const BookshelfRuntime: Story = {
  render: () => (
    <main className="storybook-canvas storybook-canvas--book">
      <BookshelfGrid />
    </main>
  )
};
