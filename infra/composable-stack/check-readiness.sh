#!/usr/bin/env bash
set -euo pipefail

MIN_FREE_GB="${MIN_FREE_GB:-10}"
REQUIRED_DATA_MOUNT="${REQUIRED_DATA_MOUNT:-/data}"
STACK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  echo "blocked: docker is not installed" >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "blocked: docker compose plugin is not available" >&2
  exit 1
fi

if [ ! -f "$STACK_ROOT/.env" ]; then
  echo "blocked: .env is missing; copy .env.example to .env and fill secrets" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
. "$STACK_ROOT/.env"
set +a

STACK_DATA_ROOT="${STACK_DATA_ROOT:-/data/myblog/composable-stack}"

if ! mountpoint -q "$REQUIRED_DATA_MOUNT"; then
  echo "blocked: $REQUIRED_DATA_MOUNT is not a mounted filesystem" >&2
  exit 1
fi

case "$STACK_DATA_ROOT" in
  "$REQUIRED_DATA_MOUNT"/*) ;;
  *)
    echo "blocked: STACK_DATA_ROOT must live under $REQUIRED_DATA_MOUNT, got $STACK_DATA_ROOT" >&2
    exit 1
    ;;
esac

mkdir -p "$STACK_DATA_ROOT"

available_gb="$(df -BG "$STACK_DATA_ROOT" | awk 'NR==2 { gsub(/G/, "", $4); print $4 }')"
if [ "${available_gb:-0}" -lt "$MIN_FREE_GB" ]; then
  echo "blocked: only ${available_gb}GB free at $STACK_DATA_ROOT; need at least ${MIN_FREE_GB}GB" >&2
  exit 1
fi

mkdir -p "$STACK_DATA_ROOT/postgres"

for dir in "$STACK_DATA_ROOT/directus/uploads" "$STACK_DATA_ROOT/directus/extensions" "$STACK_DATA_ROOT/meilisearch"; do
  mkdir -p "$dir"
  if [ ! -w "$dir" ]; then
    echo "blocked: $dir is not writable" >&2
    exit 1
  fi
done

if [ ! -d "$STACK_DATA_ROOT/postgres" ]; then
  echo "blocked: $STACK_DATA_ROOT/postgres is missing" >&2
  exit 1
fi

echo "ready"
