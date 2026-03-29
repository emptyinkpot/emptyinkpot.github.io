import type { CollectionEntry } from 'astro:content';
import rooGuideCover from '../content/posts/assets/roo-vscode-guide/roo-cover.svg';

const coverRegistry: Record<string, string> = {
  'roo-code-vscode-migration-and-usage-guide': rooGuideCover,
  'roo-vscode-guide': rooGuideCover
};

export function getPostCover(post: CollectionEntry<'posts'>) {
  if (post.data.cover && coverRegistry[post.data.cover]) {
    return coverRegistry[post.data.cover];
  }

  if (post.id in coverRegistry) {
    return coverRegistry[post.id];
  }

  return post.data.cover;
}
