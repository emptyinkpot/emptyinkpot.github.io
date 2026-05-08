import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const localVaultRoot = process.env.MYBLOG_LOCAL_VAULT_ROOT || 'E:\\Vaults\\Obsidian';
const remote = process.env.MYBLOG_VAULT_REMOTE || 'ubuntu@124.220.233.126';
const syncthingConfig = path.join(process.env.LOCALAPPDATA || '', 'Syncthing', 'config.xml');

const failures = [];

checkLocalVault();
checkLocalSyncthingConfig();
checkRemote();

if (failures.length) {
  console.error(['Linux Vault sync validation failed:', ...failures.map((failure) => `- ${failure}`)].join('\n'));
  process.exit(1);
}

console.log('Linux Vault sync validation passed');

function checkLocalVault() {
  const required = [localVaultRoot, path.join(localVaultRoot, 'docs'), path.join(localVaultRoot, 'image'), path.join(localVaultRoot, '.obsidian')];
  required.forEach((target) => {
    if (!fs.existsSync(target) || !fs.statSync(target).isDirectory()) {
      failures.push(`Local Vault folder missing: ${target}`);
    }
  });
}

function checkLocalSyncthingConfig() {
  if (!fs.existsSync(syncthingConfig)) {
    failures.push(`Local Syncthing config missing: ${syncthingConfig}`);
    return;
  }

  const source = fs.readFileSync(syncthingConfig, 'utf8');
  [
    ['obsidian-vault', localVaultRoot]
  ].forEach(([folderId, folderPath]) => {
    if (!source.includes(`id="${folderId}"`)) {
      failures.push(`Local Syncthing folder id missing: ${folderId}`);
    }
    if (!source.includes(folderPath)) {
      failures.push(`Local Syncthing folder path missing: ${folderPath}`);
    }
  });
}

function checkRemote() {
  const script = String.raw`
set -e
echo "--- services"
systemctl is-active syncthing@ubuntu.service
systemctl is-active myblog-runtime-content-projector.service
echo "--- paths"
test -d /home/vault/Obsidian
test -d /home/vault/Obsidian/docs
test -d /home/vault/Obsidian/image
test -d /home/vault/Obsidian/.obsidian
test -d /home/vault/Obsidian/.stfolder
echo "--- projector"
systemctl cat myblog-runtime-content-projector.service | grep -F "MYBLOG_VAULT_ROOT=/home/vault/Obsidian/docs"
systemctl cat myblog-runtime-content-projector.service | grep -F "MYBLOG_VAULT_WATCH_ROOT=/home/vault/Obsidian/docs"
systemctl cat myblog-runtime-content-projector.service | grep -F "MYBLOG_RUNTIME_OPENLIST_ROOT_LABEL=/openlist/Obsidian/docs"
echo "--- openlist"
curl -fsS https://blog.tengokukk.com/openlist/Obsidian/ >/dev/null
echo "--- runtime identity"
python3 - <<'PY'
import json
from pathlib import Path
index = Path('/srv/myblog/site/runtime/content-index.json')
data = json.loads(index.read_text(encoding='utf-8'))
articles = data.get('articles') or []
if not articles:
    raise SystemExit('runtime content-index has no articles')
bad_source = [
    item.get('slug')
    for item in articles
    if str(item.get('source') or '').startswith('/home/vault')
]
missing_openlist = [
    item.get('slug')
    for item in articles
    if not str(item.get('openlistPath') or '').startswith('/openlist/Obsidian/docs/')
    or not str(item.get('openlistUrl') or '').startswith('/openlist/Obsidian/docs/')
]
bad_source_path = [
    item.get('slug')
    for item in articles
    if not str(item.get('sourcePath') or '').startswith('/home/vault/Obsidian/docs/')
]
if bad_source:
    raise SystemExit(f'runtime article source leaks /home/vault: {bad_source[:5]}')
if missing_openlist:
    raise SystemExit(f'runtime article missing OpenList identity: {missing_openlist[:5]}')
if bad_source_path:
    raise SystemExit(f'runtime article sourcePath is not Linux hot mirror: {bad_source_path[:5]}')
print(f'Runtime OpenList identity verified for {len(articles)} articles')
PY
`;

  const result = spawnSync('ssh', [remote, 'bash -s'], {
    input: script,
    encoding: 'utf8',
    stdio: ['pipe', 'pipe', 'pipe']
  });

  if (result.status !== 0) {
    failures.push(`Remote Linux Vault validation failed:\n${result.stdout}${result.stderr}`);
  }
}
