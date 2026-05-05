export type BookStatus = 'reading' | 'finished' | 'planned';

export type BookSourceType = 'epub' | 'pdf' | 'external';

export interface BookItem {
  id: string;
  title: string;
  author: string;
  status: BookStatus;
  statusLabel: string;
  note: string;
  category: string;
  tags: string[];
  sourceType: BookSourceType;
  openlistPath?: string;
  description?: string;
  cover: string;
}
