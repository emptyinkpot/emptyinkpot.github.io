const repo = import.meta.env.PUBLIC_GISCUS_REPO;
const repoId = import.meta.env.PUBLIC_GISCUS_REPO_ID;
const category = import.meta.env.PUBLIC_GISCUS_CATEGORY;
const categoryId = import.meta.env.PUBLIC_GISCUS_CATEGORY_ID;
const isConfigured = Boolean(repo && repoId && category && categoryId);
const repoSettingsUrl = 'https://github.com/emptyinkpot/blog/settings';
const giscusConfigUrl = 'https://giscus.app/zh-CN';

export default function GiscusComments() {
  return (
    <section className="glass-card rounded-[2rem] p-6">
      <p className="section-kicker mb-3">Feedback</p>
      {isConfigured ? (
        <>
          <p className="max-w-3xl text-sm leading-7 text-stone-600">
            评论系统使用 giscus，基于 GitHub Discussions。你可以直接用 GitHub 账号参与讨论和 reactions。
          </p>
          <div className="giscus mt-6" />
          <script
            async
            crossOrigin="anonymous"
            data-category={category}
            data-category-id={categoryId}
            data-emit-metadata="0"
            data-input-position="bottom"
            data-lang="zh-CN"
            data-mapping="pathname"
            data-reactions-enabled="1"
            data-repo={repo}
            data-repo-id={repoId}
            data-strict="0"
            data-theme="preferred_color_scheme"
            src="https://giscus.app/client.js"
          />
        </>
      ) : (
        <div className="space-y-3 text-sm leading-7 text-stone-600">
          <p>giscus 组件骨架已经接好，但当前仓库侧配置还没完成，所以评论区暂时不会真正加载。</p>
          <p>
            要真正启用它，先去
            <a className="underline decoration-[rgba(31,74,95,0.3)] underline-offset-4" href={repoSettingsUrl} rel="noreferrer" target="_blank">
              仓库设置
            </a>
            开启 Discussions，再到
            <a className="underline decoration-[rgba(31,74,95,0.3)] underline-offset-4" href={giscusConfigUrl} rel="noreferrer" target="_blank">
              giscus 配置页
            </a>
            生成 `PUBLIC_GISCUS_*` 参数。
          </p>
          <p>变量模板已经放在 `apps/web/.env.example`，补齐后重新构建即可直接启用。</p>
        </div>
      )}
    </section>
  );
}
