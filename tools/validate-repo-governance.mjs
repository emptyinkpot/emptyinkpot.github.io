import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const issues = [];

validateMigrationStatus();
validateHistoricalBoundaryReadmes();
validatePackageScripts();
validatePagesWorkflow();

if (issues.length) {
  console.error(['Repository governance validation failed:', ...issues.map((issue) => `- ${issue}`)].join('\n'));
  process.exit(1);
}

console.log('Repository governance validation passed');

function validateMigrationStatus() {
  const migrationStatusPath = 'docs/governance/content-migration-status.md';
  const filePath = resolvePath(migrationStatusPath);
  const source = readText(filePath);
  const rows = source
    .split('\n')
    .filter((line) => line.startsWith('| `source/_posts/'));

  if (!rows.length) {
    issues.push(`\`${migrationStatusPath}\` does not contain any tracked migration rows`);
    return;
  }

  rows.forEach((row) => {
    const columns = row
      .split('|')
      .slice(1, -1)
      .map((column) => column.trim());

    if (columns.length !== 4) {
      issues.push(`Invalid migration status row: ${row}`);
      return;
    }

    const [hexoFile, astroFile, status] = columns.map(stripBackticks);

    if (!fileExists(hexoFile)) {
      issues.push(`Historical file listed in migration table is missing: ${hexoFile}`);
    }

    if (status === '现行') {
      if (!astroFile || astroFile === '-') {
        issues.push(`Current migration row is missing Astro target: ${hexoFile}`);
        return;
      }

      if (!fileExists(astroFile)) {
        issues.push(`Current Astro target listed in migration table is missing: ${astroFile}`);
      }
    }
  });
}

function validateHistoricalBoundaryReadmes() {
  const requiredReadmes = [
    'docs/historical/source-boundary.md',
    'docs/historical/themes-boundary.md',
    'docs/historical/scaffolds-boundary.md',
    'docs/historical/scripts-boundary.md'
  ];

  requiredReadmes.forEach((relativePath) => {
    if (!fileExists(relativePath)) {
      issues.push(`Historical boundary README is missing: ${relativePath}`);
    }
  });
}

function validatePackageScripts() {
  const packageJsonPath = resolvePath('package.json');
  const packageJson = JSON.parse(readText(packageJsonPath));
  const scripts = packageJson.scripts ?? {};

  Object.entries(scripts).forEach(([name, command]) => {
    const normalizedCommand = String(command).toLowerCase();
    if (normalizedCommand.includes('hexo') && !name.startsWith('legacy:')) {
      issues.push(`Hexo command must use legacy-prefixed script name: ${name}`);
    }
  });
}

function validatePagesWorkflow() {
  const workflowPath = resolvePath('.github/workflows/pages.yml');
  const workflow = readText(workflowPath);

  if (/hexo/i.test(workflow)) {
    issues.push('Pages workflow still references Hexo');
  }

  const normalizedWorkflow = workflow.replace(/path:\s+\.\/apps\/web\/dist/g, '');

  if (normalizedWorkflow.includes('/site-v2/')) {
    issues.push('Pages workflow still references the old /site-v2/ publish path');
  }

  if (!workflow.includes('path: ./apps/web/dist')) {
    issues.push('Pages workflow is not uploading the Astro dist directory');
  }
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function fileExists(relativePath) {
  return fs.existsSync(resolvePath(relativePath));
}

function resolvePath(relativePath) {
  return path.resolve(rootDir, relativePath);
}

function stripBackticks(value) {
  return value.replace(/^`|`$/g, '');
}
