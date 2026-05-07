import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const issues = [];
const migrationPath = path.resolve(rootDir, 'runtime-migration.json');
const projectPath = path.resolve(rootDir, 'project.json');
const packagePath = path.resolve(rootDir, 'apps/web/package.json');
const architectureCodexPath = path.resolve(rootDir, 'apps/web/src/data/architectureCodex.ts');

if (!fs.existsSync(migrationPath)) {
  fail(['runtime-migration.json is required for Runtime Migration Sprint authority tracking']);
}

const migration = readJson(migrationPath);
const project = readJson(projectPath);
const webPackage = readJson(packagePath);
const dependencies = webPackage.dependencies ?? {};

if (migration.schemaVersion !== 1) {
  issues.push('runtime-migration.json schemaVersion must be 1');
}

const requiredSurfaces = ['overlay', 'bookDrawer', 'command', 'store', 'graph', 'motion'];
const surfaces = migration.surfaces ?? {};

requiredSurfaces.forEach((surfaceName) => {
  const surface = surfaces[surfaceName];
  if (!surface) {
    issues.push(`runtime-migration.json is missing surfaces.${surfaceName}`);
    return;
  }
  ['currentOwner', 'targetOwner', 'migrated', 'phase', 'evidence', 'rollback'].forEach((field) => {
    if (surface[field] === undefined) {
      issues.push(`surfaces.${surfaceName} is missing ${field}`);
    }
  });
  if (surface.migrated === true && (!Array.isArray(surface.evidence) || surface.evidence.length === 0)) {
    issues.push(`surfaces.${surfaceName} is marked migrated but has no evidence`);
  }
});

const dependencyRules = {
  'overlay target uses Radix': ['@radix-ui/react-dialog', '@radix-ui/react-popover'],
  'book drawer target uses Vaul': ['vaul'],
  'command/store target uses Zustand': ['zustand'],
  'graph target uses React Flow': ['@xyflow/react'],
  'motion target uses Motion': ['motion']
};

Object.entries(dependencyRules).forEach(([label, packages]) => {
  packages.forEach((packageName) => {
    if (!dependencies[packageName]) {
      issues.push(`${label} but apps/web is missing dependency ${packageName}`);
    }
  });
});

[
  'packages/runtime-overlay',
  'packages/runtime-store',
  'packages/runtime-kernel',
  'packages/design-system'
].forEach((dir) => {
  if (!fs.existsSync(path.resolve(rootDir, dir))) {
    issues.push(`Missing runtime migration package directory: ${dir}`);
  }
});

if (project.runtimeMigration?.manifest !== 'runtime-migration.json') {
  issues.push('project.json runtimeMigration.manifest must point to runtime-migration.json');
}

const codexSource = fs.readFileSync(architectureCodexPath, 'utf8');
const entriesSection = codexSource.split('export const architectureCodexEntries: ArchitectureCodexEntry[] = [')[1]?.split('export const architectureCodexGlossary = [')[0] ?? '';
const entryBlocks = entriesSection
  .split('\n  {')
  .slice(1)
  .map((block) => `  {${block}`);

entryBlocks.forEach((block, index) => {
  if (!/slug:\s*['"][^'"]+['"]/.test(block)) {
    issues.push(`architectureCodexEntries item ${index + 1} is missing slug`);
  }
  if (!/title:\s*['"][^'"]+['"]/.test(block)) {
    issues.push(`architectureCodexEntries item ${index + 1} is missing title`);
  }
});

if (issues.length) {
  fail(issues);
}

console.log('Runtime migration contract validation passed');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fail(messages) {
  console.error(['Runtime migration validation failed:', ...messages.map((message) => `- ${message}`)].join('\n'));
  process.exit(1);
}
