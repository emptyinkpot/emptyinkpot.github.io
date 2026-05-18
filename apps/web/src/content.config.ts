import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const notes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false)
  })
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    type: z.enum(['game', 'tool', 'open', 'site', 'archive']).default('open'),
    status: z.enum(['planned', 'active', 'paused', 'archived']).default('planned'),
    progress: z.number().min(0).max(100).default(0),
    date: z.coerce.date().optional(),
    stack: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    demo: z.string().url().optional(),
    collaborationRuntime: z.enum(['github-workbench', 'appflowy-embed', 'none']).default('github-workbench'),
    collaborationStatus: z.enum(['interim-active', 'target-not-deployed', 'connected', 'disabled']).default('interim-active'),
    appflowyUrl: z.string().url().optional(),
    appflowyWorkspace: z.string().optional(),
    modules: z.array(z.object({
      id: z.string().optional(),
      name: z.string(),
      status: z.enum(['planned', 'draft', 'in-progress', 'done', 'paused']).default('planned'),
      progress: z.number().min(0).max(100).default(0)
    })).default([]),
    wiki: z.array(z.object({
      title: z.string(),
      path: z.string(),
      summary: z.string().optional(),
      type: z.enum(['overview', 'world', 'faction', 'character', 'card', 'system', 'doc']).default('doc')
    })).default([]),
    milestones: z.array(z.object({
      title: z.string(),
      date: z.coerce.date().optional(),
      summary: z.string().optional()
    })).default([])
  })
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional()
  })
});

export const collections = {
  notes,
  projects,
  pages
};
