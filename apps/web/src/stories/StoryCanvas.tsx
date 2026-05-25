import type { ReactNode } from 'react';

export function StoryCanvas({
  children,
  kind = 'home'
}: {
  children: ReactNode;
  kind?: 'home' | 'book' | 'reader' | 'wide';
}) {
  return <main className={`storybook-canvas storybook-canvas--${kind}`}>{children}</main>;
}

export function StoryOpenListPath({ children }: { children: ReactNode }) {
  const url = new URL(window.location.href);
  url.searchParams.set('path', '/Obsidian/books/storybook-book.pdf');
  window.history.replaceState(null, '', url);

  return <>{children}</>;
}
