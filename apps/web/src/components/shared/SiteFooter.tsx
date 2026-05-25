import { withBase } from '../../lib/site';

export default function SiteFooter() {
  return (
    <footer className="page-wrap pb-10 pt-8 text-sm text-stone-500">
      <div className="glass-card rounded-[2rem] px-6 py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-stone-700">emptyinkpot</p>
            <p>面向长期写作、项目沉淀与持续维护记录的结构化内容站。</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a className="footer-link" href="https://github.com/emptyinkpot/blog" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a className="footer-link" href={withBase('/rss.xml')}>
              RSS
            </a>
            <a className="footer-link" href={withBase('/updates')}>
              更新日志
            </a>
            <a className="footer-link" href="https://blog.tengokukk.com/" target="_blank" rel="noreferrer">
              当前站点
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
