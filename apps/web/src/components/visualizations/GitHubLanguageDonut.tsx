import type { CSSProperties } from 'react';
import { getDonutGradient, type LanguageSlice } from '../../lib/analytics';

type GitHubLanguageDonutProps = {
  languages: LanguageSlice[];
  compact?: boolean;
};

export default function GitHubLanguageDonut({ languages, compact = false }: GitHubLanguageDonutProps) {
  const gradient = getDonutGradient(languages);
  const topLanguage = languages[0];
  const className = ['github-language-donut', compact ? 'github-language-donut--compact' : ''].filter(Boolean).join(' ');

  return (
    <div className={className} data-github-viz="language-donut" data-github-compact={compact ? 'true' : undefined}>
      <div className="github-language-donut__ring" style={{ '--donut-gradient': gradient } as CSSProperties}>
        <div>
          <strong>{topLanguage?.percent ?? 0}%</strong>
          <span>{topLanguage?.label ?? 'N/A'}</span>
        </div>
      </div>
      <div className="github-language-donut__legend">
        {languages.map((language) => (
          <span key={language.label}>
            <i style={{ background: language.color }} />
            <strong>{language.label}</strong>
            <small>{language.percent}%</small>
          </span>
        ))}
      </div>
    </div>
  );
}
