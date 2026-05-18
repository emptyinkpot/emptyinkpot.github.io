export type VisualItem = {
  id: string;
  title: string;
  image: string;
  type: 'poster' | 'illustration' | 'layout' | 'color' | 'reference';
  source?: string;
  sourceUrl?: string;
  summary: string;
  note: string;
  tags: string[];
  palette: {
    dominant: string;
    colors: string[];
  };
  seal?: string;
  related?: {
    posts?: string[];
    books?: string[];
    projects?: string[];
    visuals?: string[];
  };
};

export type VisualCollection = {
  id: string;
  title: string;
  source: 'pixiv' | 'pinterest' | 'local' | 'openlist';
  sourceLabel: string;
  summary: string;
  mood: string;
  tags: string[];
  palette: {
    dominant: string;
    colors: string[];
  };
  coverImages: string[];
  images: VisualItem[];
  curationNote: string;
  cluster?: string;
  parentSourceId?: string;
  partitionIndex?: number;
  partitionSize?: number;
  related?: {
    posts?: string[];
    books?: string[];
    projects?: string[];
    visuals?: string[];
  };
};

type VisualManifest = {
  collections?: VisualCollection[];
};

const wanderingMagePoster: VisualItem = {
  id: 'wandering-mage-poster',
  title: '旅人魔法海报',
  image: '/images/visuals/wandering-mage-poster.svg',
  type: 'poster',
  source: 'Original visual study',
  summary: '黑金、角色中心、碎片叙事和大标题压场的情绪海报。',
  note: '这个节点用于记录“孤独旅程 / 时间主题 / 魔法世界观”的视觉锚点。核心不是角色本身，而是黑色留白、金色边框和小画框形成的叙事密度。',
  tags: ['角色设计', '世界观', '黑金', '情绪', '海报'],
  palette: {
    dominant: '#1f1b18',
    colors: ['#1f1b18', '#c9a227', '#f5f1e8', '#6b2d5c', '#9e2a2b']
  },
  seal: 'insight',
  related: {
    projects: ['site-v2'],
    visuals: ['hibiscus-layout-study']
  }
};

const hibiscusLayoutStudy: VisualItem = {
  id: 'hibiscus-layout-study',
  title: 'Hibiscus 植物排版',
  image: '/images/visuals/hibiscus-layout-study.svg',
  type: 'layout',
  source: 'Original layout study',
  summary: '花卉、粉绿对比、日式图鉴感和强版心控制的平面设计参考。',
  note: '这个节点用于记录“植物主体 + 大标题 + 色块 + 小字说明”的排版节奏。它更适合转译成首页 Hero、书籍封面、项目设定页和视觉卡片系统。',
  tags: ['花卉', '排版', '色彩', '粉绿', '图鉴'],
  palette: {
    dominant: '#e9b6c8',
    colors: ['#e9b6c8', '#2f5d50', '#f5f1e8', '#9e2a2b', '#c9a227']
  },
  seal: 'selected',
  related: {
    posts: ['content-os-homepage-frontend-design-system'],
    visuals: ['wandering-mage-poster']
  }
};

const importedVisualManifest = (await import('../../../../public-data/visual-sources/visual-manifest.json')).default as VisualManifest;

export const localVisualCollections: VisualCollection[] = [
  {
    id: 'dark-fantasy-black-gold',
    title: 'Dark Fantasy / Black & Gold',
    source: 'local',
    sourceLabel: 'LOCAL CURATED STUDY',
    summary: '用黑色留白、金色边框和角色中心构图组织“孤独旅程”的视觉馆藏。',
    mood: 'Monochrome Witch / Archive Night',
    tags: ['dark fantasy', 'black gold', 'character', 'poster', 'worldbuilding'],
    palette: wanderingMagePoster.palette,
    coverImages: [wanderingMagePoster.image],
    images: [wanderingMagePoster],
    curationNote:
      '这个 collection 不是单张海报收藏，而是未来收纳黑金角色、魔法世界观、碎片叙事和暗色档案感素材的策展容器。首页只展示代表图，完整素材进入 board。',
    related: wanderingMagePoster.related
  },
  {
    id: 'botanical-pink-layout',
    title: 'Botanical Pink / Editorial Plate',
    source: 'local',
    sourceLabel: 'LOCAL CURATED STUDY',
    summary: '用粉绿对比、植物主体和图鉴版心组织“植物编辑设计”的视觉馆藏。',
    mood: 'Botanical Pink / Magazine Plate',
    tags: ['botanical', 'editorial', 'pink green', 'layout', 'catalog'],
    palette: hibiscusLayoutStudy.palette,
    coverImages: [hibiscusLayoutStudy.image],
    images: [hibiscusLayoutStudy],
    curationNote:
      '这个 collection 用来收纳花卉、图鉴、杂志式版心和温暖纸面色彩。它应该像 Are.na channel 或 Eagle board，而不是图片瀑布流。',
    related: hibiscusLayoutStudy.related
  }
];

export const importedVisualCollections: VisualCollection[] = Array.isArray(importedVisualManifest.collections)
  ? importedVisualManifest.collections
  : [];

export const visualCollections: VisualCollection[] = [...localVisualCollections, ...importedVisualCollections];

export const visualItems: VisualItem[] = visualCollections.flatMap((collection) => collection.images);
