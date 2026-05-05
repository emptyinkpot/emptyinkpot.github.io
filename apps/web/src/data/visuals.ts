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

export const visualItems: VisualItem[] = [
  {
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
  },
  {
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
  }
];
