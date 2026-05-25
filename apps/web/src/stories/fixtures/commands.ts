export const homeCommands = [
  {
    id: 'search',
    label: '全局检索',
    description: '搜索文章、项目、书架和本地标记。',
    action: 'search',
    icon: 'search'
  },
  {
    id: 'books',
    label: '书架',
    description: '进入 ReadingObject Shelf。',
    href: '/books/',
    icon: 'books'
  },
  {
    id: 'github',
    label: 'GitHub',
    description: '打开项目运行态概览。',
    href: '/github/',
    icon: 'github'
  }
] as const;

export const projectCommands = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: '项目运行概览。',
    href: '#dashboard',
    kind: 'internal',
    icon: 'dashboard'
  },
  {
    id: 'issues',
    label: 'Issues',
    description: '查看 GitHub Issues。',
    href: '#issues',
    kind: 'internal',
    icon: 'issues'
  },
  {
    id: 'github',
    label: 'GitHub Repo',
    description: '打开远端仓库。',
    href: 'https://github.com/emptyinkpot/blog',
    kind: 'external',
    icon: 'github'
  }
] as const;
