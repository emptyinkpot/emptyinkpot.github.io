import type { RepoMatrixItem } from '../../lib/analytics';
import type { GitHubOverview } from '../../lib/github';

type TeamSignalGraphProps = {
  profile: GitHubOverview['profile'];
  repos: RepoMatrixItem[];
};

export default function TeamSignalGraph({ profile, repos }: TeamSignalGraphProps) {
  const visibleRepos = repos.slice(0, 4);

  return (
    <div className="team-signal-graph" data-github-viz="team-signal">
      <div className="team-signal-graph__root">
        <img src={profile.avatarUrl} alt={profile.name} data-github-profile="avatar" />
        <strong data-github-profile="name">{profile.name}</strong>
        <span data-github-profile="login">@{profile.login}</span>
      </div>
      <div className="team-signal-graph__branches">
        {visibleRepos.map((repo) => (
          <a href={repo.htmlUrl} key={repo.name}>
            <strong>{repo.name}</strong>
            <span>{repo.language || 'repo'}</span>
          </a>
        ))}
        <a href="https://github.com/emptyinkpot/blog/actions">
          <strong>Automation</strong>
          <span>Actions / VPS</span>
        </a>
      </div>
    </div>
  );
}
