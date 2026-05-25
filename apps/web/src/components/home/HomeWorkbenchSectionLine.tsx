type HomeWorkbenchSectionLineProps = {
  leading: string;
  trailing: string;
  tone?: 'default' | 'snap';
  tight?: boolean;
};

export default function HomeWorkbenchSectionLine({
  leading,
  trailing,
  tone = 'default',
  tight = false
}: HomeWorkbenchSectionLineProps) {
  const className = [
    'home-workbench__sectionline',
    tight ? 'home-workbench__sectionline--tight' : '',
    tone === 'snap' ? 'home-workbench__sectionline--snap' : ''
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={className}>
      <span>{trailing}</span>
      <div aria-hidden="true" />
      <span>{leading}</span>
    </div>
  );
}
