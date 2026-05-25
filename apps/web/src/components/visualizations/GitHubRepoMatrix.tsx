import { formatDate } from '../../lib/content';
import type { RepoMatrixItem } from '../../lib/analytics';

type GitHubRepoMatrixProps = {
  repos: RepoMatrixItem[];
  compact?: boolean;
};

export default function GitHubRepoMatrix({ repos, compact = false }: GitHubRepoMatrixProps) {
  const className = ['github-repo-matrix', compact ? 'github-repo-matrix--compact' : ''].filter(Boolean).join(' ');

  return (
    <div className={className} data-github-viz="repo-matrix" data-github-compact={compact ? 'true' : undefined}>
      {repos.map((repo) => (
        <a className="github-repo-matrix__item" href={repo.htmlUrl} key={repo.name}>
          <strong>{repo.name}</strong>
          <span>
            {repo.language || 'Unknown'} / {repo.stars} stars / {repo.issues} issues
          </span>
          <small>{formatDate(new Date(repo.updatedAt))}</small>
        </a>
      ))}
    </div>
  );
}
