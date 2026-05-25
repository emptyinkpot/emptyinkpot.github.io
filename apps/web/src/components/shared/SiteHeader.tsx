import { stripBase, withBase } from '../../lib/site';

type NavItem =
  | {
      href: string;
      label: string;
    }
  | {
      action: 'openlist' | 'pinterest';
      label: string;
    };

const navItems: NavItem[] = [
  { href: '/', label: '首页' },
  { href: '/posts', label: '文章' },
  { href: '/series', label: '专题' },
  { href: '/projects', label: '项目工坊' },
  { href: '/github', label: 'GitHub' },
  { href: '/books', label: '书架' },
  { href: '/music', label: '音乐' },
  { href: '/visuals', label: '视觉素材' },
  { href: '/knowledge', label: '知识图谱' },
  { href: '/codex', label: '设计圣典' },
  { href: '/evidence-library', label: '史料库' },
  { action: 'openlist', label: 'OpenList' },
  { action: 'pinterest', label: 'Pinterest' },
  { href: '/updates', label: '更新' },
  { href: '/settings', label: '设置' },
  { href: '/search', label: '搜索' },
  { href: '/about', label: '关于' }
];

type SiteHeaderProps = {
  pathname?: string;
};

export default function SiteHeader({ pathname = '/' }: SiteHeaderProps) {
  const currentPath = stripBase(pathname);

  return (
    <header className="page-wrap pt-6 md:pt-8">
      <div className="glass-card flex flex-col gap-4 rounded-[2rem] px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <a className="flex items-center gap-3 md:gap-4" href={withBase('/')}>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden md:h-16 md:w-16">
            <img
              src={withBase('/images/branding/vita-atramenti-logo.png')}
              alt="Vita Atramenti logo"
              className="h-full w-full scale-[1.24] object-contain"
              loading="eager"
              decoding="async"
            />
          </span>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.32em] text-stone-500">emptyinkpot</p>
            <p className="text-sm text-stone-700">结构化写作、项目记录与维护笔记</p>
          </div>
        </a>

        <nav className="flex flex-wrap items-center gap-2 text-sm text-stone-600">
          {navItems.map((item) => {
            if ('action' in item) {
              return (
                <button
                  className="rounded-full px-4 py-2 text-left transition hover:bg-white/75 hover:text-stone-900"
                  data-openlist-embed-open={item.action === 'openlist' ? true : undefined}
                  data-pinterest-embed-open={item.action === 'pinterest' ? true : undefined}
                  key={item.action}
                  type="button"
                >
                  {item.label}
                </button>
              );
            }

            const active = item.href === '/' ? currentPath === '/' : currentPath === item.href || currentPath.startsWith(`${item.href}/`);

            return (
              <a
                className={[
                  'rounded-full px-4 py-2 transition',
                  active ? 'bg-stone-900 text-stone-50 shadow-sm' : 'hover:bg-white/75 hover:text-stone-900'
                ].join(' ')}
                href={withBase(item.href)}
                key={item.href}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
