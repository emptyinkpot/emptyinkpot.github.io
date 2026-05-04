import { withBase } from '../lib/site';

export interface HomeBook {
  title: string;
  author: string;
  status: 'reading' | 'finished' | 'planned';
  statusLabel: string;
  note: string;
  cover?: string;
  href?: string;
}

export const books: HomeBook[] = [
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    status: 'reading',
    statusLabel: '在读',
    note: '分布式系统、数据模型、复制、分区和一致性问题的长期基础书。',
    href: withBase('/notes/')
  },
  {
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    status: 'planned',
    statusLabel: '想读',
    note: '用于校准交互、反馈、可发现性和错误恢复的设计基础。',
    href: withBase('/notes/')
  },
  {
    title: 'Site Reliability Engineering',
    author: 'Google SRE',
    status: 'planned',
    statusLabel: '想读',
    note: '站点部署、可观测性、告警和回滚体系的工程参考。',
    href: withBase('/projects/')
  }
];
