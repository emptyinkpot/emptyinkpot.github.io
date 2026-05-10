import { spawnSync } from 'node:child_process';

const args = new Set(process.argv.slice(2));
const remote = readValue('--remote') || process.env.MYBLOG_SERVER_REMOTE || 'ubuntu@124.220.233.126';
const apply = args.has('--apply');
const pruneOpenListFileCache = args.has('--prune-openlist-file-cache');

if (args.has('--help') || args.has('-h')) {
  console.log(`Usage:
  node tools/server-openlist-storage-maintenance.mjs [--remote user@host]
  node tools/server-openlist-storage-maintenance.mjs --prune-openlist-file-cache [--apply]

Default mode is audit-only. --apply is ignored unless a prune flag is also present.`);
  process.exit(0);
}

const remoteScript = String.raw({ raw: [`
set -euo pipefail

APPLY="\${MYBLOG_STORAGE_APPLY:-0}"
PRUNE_OPENLIST_FILE_CACHE="\${MYBLOG_PRUNE_OPENLIST_FILE_CACHE:-0}"
PUBLIC_DATA_ROOT="/srv/myblog/public-data"
FILE_CACHE_ROOT="\${PUBLIC_DATA_ROOT}/openlist-files"
COVER_CACHE_ROOT="\${PUBLIC_DATA_ROOT}/openlist-covers"
PAGE_CACHE_ROOT="\${PUBLIC_DATA_ROOT}/openlist-pages"

section() {
  printf '\n== %s ==\n' "$1"
}

path_size() {
  local target="$1"
  if [ -e "$target" ]; then
    du -sh "$target" 2>/dev/null | awk '{print $1 "\t" $2}'
  else
    printf 'missing\t%s\n' "$target"
  fi
}

section "root disk"
df -h /

section "openlist mounts"
python3 - <<'PY'
import json
import sqlite3

db = '/srv/openlist/data/data.db'
con = sqlite3.connect(db)
rows = con.execute('select mount_path, driver, status, disabled, addition from x_storages order by "order", id').fetchall()
for mount_path, driver, status, disabled, addition in rows:
    try:
        extra = json.loads(addition or '{}')
    except Exception:
        extra = {}
    print(json.dumps({
        'mount_path': mount_path,
        'driver': driver,
        'status': status,
        'disabled': bool(disabled),
        'root_folder_path': extra.get('root_folder_path'),
        'bucket': extra.get('bucket'),
        'region': extra.get('region'),
    }, ensure_ascii=False))
PY

section "admin-next openlist public roots"
if curl -fsS 'http://127.0.0.1:4117/api/openlist/status' >/tmp/myblog-openlist-status.json; then
  python3 - <<'PY'
import json
data = json.load(open('/tmp/myblog-openlist-status.json', encoding='utf-8'))
print(json.dumps({
    'ok': data.get('ok'),
    'baseUrl': data.get('baseUrl'),
    'apiPrefix': data.get('apiPrefix'),
    'publicRoots': data.get('publicRoots'),
    'sampleCount': len(data.get('sample') or []),
}, ensure_ascii=False))
PY
else
  printf 'admin-next status endpoint unavailable\n'
fi

section "hot layer sizes"
for target in \
  /home/vault/Obsidian \
  /home/vault/Obsidian/docs \
  /home/vault/Obsidian/image \
  /srv/myblog/site \
  /srv/myblog/site/runtime \
  /srv/myblog/site/pagefind \
  /srv/myblog/public-data \
  "$FILE_CACHE_ROOT" \
  "$PAGE_CACHE_ROOT" \
  "$COVER_CACHE_ROOT" \
  /srv/openlist/data
do
  path_size "$target"
done

section "cold archive candidates"
for target in \
  /home/vault/docs.legacy-disabled-* \
  /home/vault/image.legacy-disabled-* \
  /srv/myblog/public-data/openlist-files
do
  for expanded in $target; do
    [ -e "$expanded" ] && path_size "$expanded"
  done
done

section "openlist file cache prune"
if [ ! -d "$FILE_CACHE_ROOT" ]; then
  printf 'skip: %s is missing\n' "$FILE_CACHE_ROOT"
elif [ -L "$FILE_CACHE_ROOT" ]; then
  printf 'block: %s is a symlink\n' "$FILE_CACHE_ROOT"
  exit 2
else
  cache_files="$(find "$FILE_CACHE_ROOT" -maxdepth 1 -type f ! -name 'manifest.json' | wc -l | tr -d ' ')"
  cache_bytes="$(find "$FILE_CACHE_ROOT" -maxdepth 1 -type f ! -name 'manifest.json' -printf '%s\n' 2>/dev/null | awk '{sum += $1} END {print sum + 0}')"
  printf 'target=%s\nfiles=%s\nbytes=%s\nmode=%s\n' "$FILE_CACHE_ROOT" "$cache_files" "$cache_bytes" "$([ "$APPLY" = "1" ] && echo apply || echo dry-run)"

  if [ "$PRUNE_OPENLIST_FILE_CACHE" = "1" ] && [ "$APPLY" = "1" ]; then
    if [ "$FILE_CACHE_ROOT" != "/srv/myblog/public-data/openlist-files" ]; then
      printf 'block: unexpected cache root %s\n' "$FILE_CACHE_ROOT"
      exit 2
    fi
    backup="\${FILE_CACHE_ROOT}/manifest.json.bak-$(date +%Y%m%d%H%M%S)"
    [ -f "\${FILE_CACHE_ROOT}/manifest.json" ] && cp "\${FILE_CACHE_ROOT}/manifest.json" "$backup"
    find "$FILE_CACHE_ROOT" -maxdepth 1 -type f ! -name 'manifest.json' ! -name 'manifest.json.bak-*' -delete
    cat >"\${FILE_CACHE_ROOT}/manifest.json" <<'JSON'
{
  "version": "1.0.0",
  "updatedAt": "",
  "files": {}
}
JSON
    printf 'pruned openlist file cache; manifest backup=%s\n' "$backup"
  elif [ "$PRUNE_OPENLIST_FILE_CACHE" = "1" ]; then
    printf 'dry-run only; pass --apply to prune re-generable EPUB/PDF source cache\n'
  else
    printf 'audit only; pass --prune-openlist-file-cache to select this cache for pruning\n'
  fi
fi

section "root disk after"
df -h /
`] });

const remoteCommand = [
  `MYBLOG_STORAGE_APPLY=${apply ? '1' : '0'}`,
  `MYBLOG_PRUNE_OPENLIST_FILE_CACHE=${pruneOpenListFileCache ? '1' : '0'}`,
  'bash -s',
].join(' ');

const result = spawnSync('ssh', [remote, remoteCommand], {
  input: remoteScript,
  encoding: 'utf8',
  stdio: ['pipe', 'pipe', 'pipe'],
});

process.stdout.write(result.stdout || '');
process.stderr.write(result.stderr || '');

if (result.status !== 0) {
  process.exit(result.status || 1);
}

function readValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return '';
  return process.argv[index + 1] || '';
}
