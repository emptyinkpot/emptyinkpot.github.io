export type KnowledgeNodeType = 'post' | 'note' | 'project' | 'book' | 'music' | 'github' | 'visual' | 'highlight' | 'annotation' | 'seal' | 'sticker' | 'repost';

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

export type SealType = 'selected' | 'important' | 'insight' | 'unfinished' | 'reread' | 'archive' | 'done' | 'canon' | 'custom';

export type SealPlacement = {
  id: string;
  sealId?: string;
  type: SealType;
  label: string;
  subLabel?: string;
  color: string;
  shape: 'circle' | 'square' | 'oval' | 'vertical' | 'ticket';
  texture?: 'clean' | 'rough' | 'aged' | 'ink';
  targetId: string;
  targetType: 'card' | 'article' | 'highlight' | 'book' | 'project' | 'wiki' | 'graph-node';
  title: string;
  kind?: string;
  href?: string;
  drawerId?: string;
  x: number;
  y: number;
  rotation: number;
  createdAt: number;
  updatedAt: number;
};

export type StickerKind = 'tape' | 'note' | 'label' | 'emoji' | 'image' | 'marker' | 'task' | 'warning' | 'world';

export type StickerItem = {
  id: string;
  targetId: string;
  targetType: 'feed-card' | 'article' | 'image' | 'book' | 'project' | 'wiki' | 'visual';
  kind: StickerKind;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  color?: string;
  note?: string;
  createdAt: number;
  updatedAt: number;
};

export type BookmarkRecord = {
  id: string;
  title: string;
  href?: string;
  createdAt: number;
};

export type RepostRecord = {
  id: string;
  type: 'RepostObject';
  targetId: string;
  commentary: string;
  snapshot: {
    id: string;
    kind: KnowledgeNodeType;
    title: string;
    kicker: string;
    summary: string;
    href?: string;
    coverSrc?: string;
    accent?: string;
    tags: string[];
  };
  createdAt: number;
  updatedAt: number;
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
  | 'visual'
  | 'tag'
  | 'highlight'
  | 'annotation'
  | 'seal'
  | 'sticker'
  | 'repost';

export type KnowledgeGraphNode = {
  id: string;
  label: string;
  type: KnowledgeGraphNodeType;
  level: number;
  weight: number;
  cluster?: 'writing' | 'engineering' | 'reading' | 'media' | 'github' | 'visual' | 'archive';
  href?: string;
  summary?: string;
  meta?: string;
  x?: number;
  y?: number;
};

export type KnowledgeGraphLink = {
  source: string;
  target: string;
  type: 'contains' | 'tagged' | 'references' | 'highlighted' | 'annotated' | 'linked' | 'related';
  weight: number;
};

export type ReaderCommand =
  | { type: 'openArticle'; articleId: string }
  | { type: 'openHighlight'; articleId: string; highlightId: string }
  | { type: 'searchTag'; tag: string }
  | { type: 'focusGraphNode'; nodeId: string };
