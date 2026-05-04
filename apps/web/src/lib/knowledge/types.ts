export type KnowledgeNodeType = 'post' | 'note' | 'project' | 'book' | 'music' | 'github' | 'highlight';

export type KnowledgeSearchDoc = {
  id: string;
  type: KnowledgeNodeType;
  title: string;
  content: string;
  tags: string[];
  href?: string;
  drawerId?: string;
  highlightId?: string;
  sourceId?: string;
  updatedAt?: string;
};

export type HighlightColor = 'gold' | 'purple' | 'red' | 'green' | 'blue';

export type TextQuoteSelector = {
  type: 'TextQuoteSelector';
  exact: string;
  prefix: string;
  suffix: string;
};

export type TextPositionSelector = {
  type: 'TextPositionSelector';
  start: number;
  end: number;
};

export type DomPathSelector = {
  type: 'DomPathSelector';
  startPath: number[];
  startOffset: number;
  endPath: number[];
  endOffset: number;
};

export type HighlightAnchor = {
  quote: TextQuoteSelector;
  position: TextPositionSelector;
  dom: DomPathSelector;
  contentHash: string;
};

export type HighlightRecord = {
  id: string;
  articleId: string;
  title: string;
  text: string;
  color: HighlightColor;
  note?: string;
  anchor: HighlightAnchor;
  createdAt: number;
  updatedAt: number;
};

export type AnnotationRecord = {
  id: string;
  articleId: string;
  highlightId: string;
  body: string;
  color: HighlightColor;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type BookmarkRecord = {
  id: string;
  title: string;
  href?: string;
  createdAt: number;
};

export type ReadingHistoryItem = {
  id: string;
  title: string;
  href?: string;
  timestamp: number;
};

export type KnowledgeGraphNodeType =
  | 'self'
  | 'collection'
  | 'post'
  | 'note'
  | 'project'
  | 'book'
  | 'music'
  | 'tag'
  | 'highlight';

export type KnowledgeGraphNode = {
  id: string;
  label: string;
  type: KnowledgeGraphNodeType;
  level: number;
  weight: number;
  x?: number;
  y?: number;
};

export type KnowledgeGraphLink = {
  source: string;
  target: string;
  type: 'contains' | 'tagged' | 'references' | 'highlighted' | 'related';
  weight: number;
};
