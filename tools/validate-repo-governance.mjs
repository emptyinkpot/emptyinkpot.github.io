import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const issues = [];

validateMigrationStatus();
validatePackageScripts();
validatePagesWorkflow();
validateWorkspaceGovernance();
validateRuntimeMigrationGovernance();

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
    .filter((line) => line.startsWith('| `apps/web/src/content/posts/'));

  if (!rows.length) {
    issues.push(`\`${migrationStatusPath}\` does not contain any tracked Astro content rows`);
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

    const [astroFile, status, scope, notes] = columns.map(stripBackticks);

    if (!fileExists(astroFile)) {
      issues.push(`Tracked Astro content file is missing: ${astroFile}`);
    }

    if (status === '现行') {
      if (!scope || scope === '-') {
        issues.push(`Current Astro content row is missing scope: ${astroFile}`);
        return;
      }
      if (!notes || notes === '-') {
        issues.push(`Current Astro content row is missing notes: ${astroFile}`);
      }
    }
  });
}

function validatePackageScripts() {
  const packageJsonPath = resolvePath('package.json');
  const packageJson = JSON.parse(readText(packageJsonPath));
  const scripts = packageJson.scripts ?? {};

  Object.entries(scripts).forEach(([name, command]) => {
    const normalizedCommand = String(command).toLowerCase();
    if (normalizedCommand.includes('hexo')) {
      issues.push(`Hexo command is no longer allowed in package scripts: ${name}`);
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

function validateWorkspaceGovernance() {
  const manifestPath = resolvePath('workspace.manifest.json');
  if (!fs.existsSync(manifestPath)) {
    issues.push('workspace.manifest.json is required so build/deploy authority is machine-readable');
    return;
  }

  const manifest = JSON.parse(readText(manifestPath));
  const project = JSON.parse(readText(resolvePath('project.json')));
  const requiredCapabilityKeys = [
    'canBuild',
    'canDeploy',
    'canModifyRuntime',
    'canTouchPWA',
    'canModifyRuntimeSchema',
    'canModifyOpenListAuthority'
  ];

  if (!manifest.workspaceId) {
    issues.push('workspace.manifest.json is missing workspaceId');
  }
  if (!manifest.workspaceType) {
    issues.push('workspace.manifest.json is missing workspaceType');
  }
  if (!manifest.capabilities || typeof manifest.capabilities !== 'object') {
    issues.push('workspace.manifest.json is missing capabilities');
  } else {
    requiredCapabilityKeys.forEach((key) => {
      if (typeof manifest.capabilities[key] !== 'boolean') {
        issues.push(`workspace.manifest.json capabilities.${key} must be boolean`);
      }
    });
  }

  if (!fileExists('tools/deploy-guard.mjs')) {
    issues.push('tools/deploy-guard.mjs is required for deployment authority checks');
  }
  if (!fileExists('tools/deploy-static-site.mjs')) {
    issues.push('tools/deploy-static-site.mjs is required so deploys go through deploy guard');
  }
  if (!fileExists('workspaces/canonical.json')) {
    issues.push('workspaces/canonical.json is required');
  }
  if (!fileExists('workspaces/experimental.json')) {
    issues.push('workspaces/experimental.json is required');
  }
  if (!fileExists('workspaces/sandbox.json')) {
    issues.push('workspaces/sandbox.json is required');
  }

  const allowedRoots = [manifest.root, ...(manifest.allowedRoots ?? [])].filter(Boolean);
  if (project.localSourceRoot && !allowedRoots.includes(project.localSourceRoot)) {
    issues.push('workspace.manifest.json allowedRoots must include project.json localSourceRoot');
  }

  if (manifest.workspaceType === 'canonical' && manifest.deploymentAuthority !== true) {
    issues.push('canonical workspace must declare deploymentAuthority=true');
  }

  const packageJson = JSON.parse(readText(resolvePath('package.json')));
  if (!packageJson.scripts?.['check:workspace']) {
    issues.push('package.json is missing check:workspace script');
  }
  if (!packageJson.scripts?.['deploy:site']) {
    issues.push('package.json is missing deploy:site script');
  }
}

function validateRuntimeMigrationGovernance() {
  if (!fileExists('runtime-migration.json')) {
    issues.push('runtime-migration.json is required for Runtime Migration Sprint authority tracking');
  }
  if (!fileExists('tools/validate-runtime-migration.mjs')) {
    issues.push('tools/validate-runtime-migration.mjs is required');
  }
  if (!fileExists('packages/runtime-overlay/README.md')) {
    issues.push('packages/runtime-overlay/README.md is required');
  }
  if (!fileExists('packages/runtime-store/README.md')) {
    issues.push('packages/runtime-store/README.md is required');
  }
  const packageJson = JSON.parse(readText(resolvePath('package.json')));
  if (!packageJson.scripts?.['check:runtime-migration']) {
    issues.push('package.json is missing check:runtime-migration script');
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
