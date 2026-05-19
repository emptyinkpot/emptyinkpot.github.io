import type { RuntimePlugin } from '../../../../../packages/runtime-kernel/src/plugins';

export type MyBlogCapabilityAction = 'search' | 'openlist' | 'pinterest';

export type MyBlogCapabilityIcon =
  | 'search'
  | 'posts'
  | 'projects'
  | 'github'
  | 'books'
  | 'music'
  | 'visuals'
  | 'knowledge'
  | 'settings'
  | 'profile'
  | 'external';

export type MyBlogCapabilitySurface =
  | 'home'
  | 'content'
  | 'project'
  | 'code'
  | 'media'
  | 'knowledge'
  | 'runtime';

export type MyBlogCapability = {
  id: string;
  label: string;
  description: string;
  surface: MyBlogCapabilitySurface;
  icon: MyBlogCapabilityIcon;
  href?: string;
  action?: MyBlogCapabilityAction;
  external?: boolean;
  commandOrder?: number;
  navOrder?: number;
  navGlyph?: string;
};

export type MyBlogCapabilityMetrics = {
  runtimeCollections?: number;
  runtimeArticles?: number;
  latestProject?: {
    title: string;
    progress?: number;
  };
  publicRepos?: number;
  musicItems?: number;
  visualCollections?: number;
  knowledgeDocs?: number;
};

export type MyBlogHomeCommand = {
  id: string;
  label: string;
  description: string;
  href?: string;
  action?: MyBlogCapabilityAction;
  icon: MyBlogCapabilityIcon;
};

export type MyBlogSidebarNavigationItem = {
  id: string;
  label: string;
  href: string;
  glyph: string;
};

export type MyBlogSurfacePlugin = RuntimePlugin & {
  capabilities?: () => MyBlogCapability[];
};

export const myblogCapabilities: MyBlogCapability[] = [
  {
    id: 'search',
    label: '搜索当前 Feed',
    description: 'Runtime articles、项目、书架、音乐、GitHub、本地标记',
    surface: 'runtime',
    action: 'search',
    icon: 'search',
    commandOrder: 10
  },
  {
    id: 'collections',
    label: '知识集合',
    description: 'Runtime Collection',
    surface: 'knowledge',
    href: '/collections/',
    icon: 'knowledge',
    commandOrder: 20
  },
  {
    id: 'posts',
    label: '文章',
    description: 'Runtime MarkdownObject',
    surface: 'content',
    href: '/posts/',
    icon: 'posts',
    commandOrder: 30
  },
  {
    id: 'projects',
    label: '项目工坊',
    description: '项目空间',
    surface: 'project',
    href: '/projects/',
    icon: 'projects',
    commandOrder: 40,
    navOrder: 10,
    navGlyph: '项'
  },
  {
    id: 'project-workbench',
    label: '项目工作台',
    description: 'GitHub Workbench / Wiki / Timeline',
    surface: 'project',
    href: '/projects/site-v2/',
    icon: 'projects',
    commandOrder: 50
  },
  {
    id: 'github',
    label: 'GitHub',
    description: '公开仓库',
    surface: 'code',
    href: '/github/',
    icon: 'github',
    commandOrder: 60,
    navOrder: 60,
    navGlyph: 'G'
  },
  {
    id: 'books',
    label: '书架',
    description: 'OpenList 实时书库',
    surface: 'media',
    href: '/books/',
    icon: 'books',
    commandOrder: 70,
    navOrder: 30,
    navGlyph: '书'
  },
  {
    id: 'music',
    label: '音乐',
    description: '音乐记录',
    surface: 'media',
    href: '/music/',
    icon: 'music',
    commandOrder: 80
  },
  {
    id: 'visuals',
    label: '视觉素材',
    description: '视觉 collection',
    surface: 'media',
    href: '/visuals/',
    icon: 'visuals',
    commandOrder: 90,
    navOrder: 50,
    navGlyph: '视'
  },
  {
    id: 'immich',
    label: 'Immich 媒体库',
    description: 'AI 照片 / 视频管理与语义搜索',
    surface: 'media',
    href: 'https://photos.blog.tengokukk.com/',
    external: true,
    icon: 'external',
    commandOrder: 100
  },
  {
    id: 'knowledge',
    label: 'Knowledge Graph',
    description: '知识入口',
    surface: 'knowledge',
    href: '/knowledge/',
    icon: 'knowledge',
    commandOrder: 110,
    navOrder: 20,
    navGlyph: '知'
  },
  {
    id: 'openlist',
    label: 'OpenList',
    description: '嵌入查看当前文件源',
    surface: 'runtime',
    action: 'openlist',
    icon: 'external',
    commandOrder: 120
  },
  {
    id: 'pinterest',
    label: 'Pinterest',
    description: '站内嵌入视觉收藏流',
    surface: 'runtime',
    action: 'pinterest',
    icon: 'visuals',
    commandOrder: 130
  },
  {
    id: 'codex',
    label: '设计圣典',
    description: 'Architecture Codex',
    surface: 'knowledge',
    href: '/codex/',
    icon: 'knowledge',
    navOrder: 40,
    navGlyph: '典'
  },
  {
    id: 'settings',
    label: '设置',
    description: '阅读排版、Graph、视觉偏好',
    surface: 'runtime',
    href: '/settings/',
    icon: 'settings',
    commandOrder: 140,
    navOrder: 70,
    navGlyph: '设'
  }
];

export const myblogSurfacePlugins: MyBlogSurfacePlugin[] = [
  {
    manifest: {
      id: 'myblog-core-capabilities',
      name: 'MyBlog Core Capabilities',
      version: '1.0.0',
      scopes: ['surface', 'command', 'overlay']
    },
    contributes: {
      commands: ['search.open', 'openlist.open', 'pinterest.open'],
      overlays: ['search', 'openlist', 'pinterest']
    },
    capabilities: () => myblogCapabilities
  }
];

export function getMyBlogCapability(id: string) {
  return collectMyBlogCapabilities().find((capability) => capability.id === id);
}

export function getMyBlogHomeCommands(
  metrics: MyBlogCapabilityMetrics = {},
  resolveHref: (href: string) => string = (href) => href
): MyBlogHomeCommand[] {
  return collectMyBlogCapabilities()
    .filter((capability) => capability.commandOrder !== undefined)
    .sort((a, b) => (a.commandOrder ?? 0) - (b.commandOrder ?? 0))
    .map((capability) => ({
      id: capability.id,
      label: capability.label,
      description: describeCommand(capability, metrics),
      href: capability.href ? (capability.external ? capability.href : resolveHref(capability.href)) : undefined,
      action: capability.action,
      icon: capability.icon
    }));
}

export function getMyBlogSidebarNavigation(resolveHref: (href: string) => string = (href) => href): MyBlogSidebarNavigationItem[] {
  return collectMyBlogCapabilities()
    .filter((capability) => capability.navOrder !== undefined && capability.href)
    .sort((a, b) => (a.navOrder ?? 0) - (b.navOrder ?? 0))
    .map((capability) => ({
      id: capability.id,
      label: capability.label,
      href: resolveHref(capability.href as string),
      glyph: capability.navGlyph ?? capability.label.charAt(0)
    }));
}

export function collectMyBlogCapabilities(plugins: MyBlogSurfacePlugin[] = myblogSurfacePlugins): MyBlogCapability[] {
  return plugins.flatMap((plugin) => plugin.capabilities?.() ?? []);
}

function describeCommand(capability: MyBlogCapability, metrics: MyBlogCapabilityMetrics) {
  switch (capability.id) {
    case 'collections':
      return `${metrics.runtimeCollections ?? 0} 个 Runtime Collection`;
    case 'posts':
      return `${metrics.runtimeArticles ?? 0} 篇 Runtime MarkdownObject`;
    case 'projects':
      return metrics.latestProject
        ? `${metrics.latestProject.title} / ${metrics.latestProject.progress ?? 0}%`
        : capability.description;
    case 'github':
      return `${metrics.publicRepos ?? 0} 个公开仓库`;
    case 'music':
      return `${metrics.musicItems ?? 0} 条音乐记录`;
    case 'visuals':
      return `${metrics.visualCollections ?? 0} 个视觉 collection`;
    case 'knowledge':
      return `${metrics.knowledgeDocs ?? 0} 个知识入口`;
    default:
      return capability.description;
  }
}
