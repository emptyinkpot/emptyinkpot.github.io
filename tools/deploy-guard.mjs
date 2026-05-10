import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const args = new Set(process.argv.slice(2));
const intent = args.has('--intent=check') || args.has('--check') ? 'check' : 'deploy';
const issues = [];

const manifestPath = path.resolve(rootDir, 'workspace.manifest.json');
const projectPath = path.resolve(rootDir, 'project.json');

if (!fs.existsSync(manifestPath)) {
  fail([
    'Missing workspace.manifest.json.',
    'This workspace has no declared capability profile and cannot be used for deployment.'
  ]);
}

const manifest = readJson(manifestPath);
const project = fs.existsSync(projectPath) ? readJson(projectPath) : {};
const capabilities = manifest.capabilities ?? {};
const currentRoot = normalizePath(rootDir);
const allowedRoots = [manifest.root, ...(manifest.allowedRoots ?? [])]
  .filter(Boolean)
  .map(normalizePath);

requireField('workspaceId');
requireField('workspaceType');
requireField('capabilities');

if (!allowedRoots.includes(currentRoot)) {
  issues.push(`Current root is not declared as an allowed root for this workspace: ${rootDir}`);
}

if (isCodexRuntimeWorktree(currentRoot) && manifest.deploymentAuthority) {
  issues.push('A .codex-runtime worktree is not allowed to declare deploymentAuthority=true for MyBlog.');
}

if (manifest.profile && !fs.existsSync(path.resolve(rootDir, manifest.profile))) {
  issues.push(`Workspace profile does not exist: ${manifest.profile}`);
}

if (project.localSourceRoot && manifest.deploymentAuthority) {
  const projectRoot = normalizePath(project.localSourceRoot);
  if (!allowedRoots.includes(projectRoot)) {
    issues.push(`Deploy-authoritative workspace does not include project.json localSourceRoot: ${project.localSourceRoot}`);
  }
}

if (intent === 'deploy') {
  if (!capabilities.canDeploy) {
    issues.push(`Workspace ${manifest.workspaceId} does not have capabilities.canDeploy=true.`);
  }
  if (manifest.deploymentAuthority !== true) {
    issues.push(`Workspace ${manifest.workspaceId} does not have deploymentAuthority=true.`);
  }
  if (manifest.forbiddenFeatures?.includes('deployment')) {
    issues.push(`Workspace ${manifest.workspaceId} forbids deployment.`);
  }
  if (!manifest.deployment?.buildOutputRoot) {
    issues.push('Deployment manifest is missing deployment.buildOutputRoot.');
  }
}

if (issues.length) {
  fail(issues);
}

console.log(
  `Workspace guard passed: ${manifest.workspaceId} (${manifest.workspaceType}) intent=${intent}`
);

function requireField(field) {
  if (manifest[field] === undefined || manifest[field] === null) {
    issues.push(`workspace.manifest.json is missing required field: ${field}`);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function normalizePath(value) {
  return path.resolve(String(value)).replaceAll('\\', '/').toLowerCase();
}

function isCodexRuntimeWorktree(value) {
  return value.includes('/.codex-runtime/worktrees/');
}

function fail(messages) {
  console.error(['Workspace guard failed:', ...messages.map((message) => `- ${message}`)].join('\n'));
  process.exit(1);
}
