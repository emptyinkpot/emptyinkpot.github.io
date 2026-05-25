import type { BookItem } from '../../lib/books/types';

export const storyBooks: BookItem[] = [
  {
    id: 'designing-data-intensive-applications',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    status: 'reading',
    statusLabel: '阅读中',
    note: '分布式系统、数据模型、复制与流处理。',
    category: 'Engineering',
    tags: ['database', 'distributed-system', 'architecture'],
    sourceType: 'pdf',
    openlistPath: '/Obsidian/books/ddia.pdf',
    cover: ''
  },
  {
    id: 'shape-up',
    title: 'Shape Up',
    author: 'Ryan Singer',
    status: 'finished',
    statusLabel: '已读',
    note: '产品开发周期、边界和 betting table。',
    category: 'Product',
    tags: ['product', 'planning'],
    sourceType: 'epub',
    openlistPath: '/Obsidian/books/shape-up.epub',
    cover: ''
  },
  {
    id: 'the-visual-display',
    title: 'The Visual Display of Quantitative Information',
    author: 'Edward Tufte',
    status: 'planned',
    statusLabel: '待读',
    note: '视觉表达、信息密度和图形设计。',
    category: 'Design',
    tags: ['visualization', 'design'],
    sourceType: 'external',
    openlistPath: '/Obsidian/books/tufte',
    cover: ''
  }
];
