#!/usr/bin/env bash
set -euo pipefail

MIN_FREE_GB="${MIN_FREE_GB:-30}"
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

available_gb="$(df -BG "$STACK_ROOT" | awk 'NR==2 { gsub(/G/, "", $4); print $4 }')"
if [ "${available_gb:-0}" -lt "$MIN_FREE_GB" ]; then
  echo "blocked: only ${available_gb}GB free at $STACK_ROOT; need at least ${MIN_FREE_GB}GB" >&2
  exit 1
fi

for dir in "$STACK_ROOT/directus/database" "$STACK_ROOT/directus/uploads" "$STACK_ROOT/meilisearch"; do
  mkdir -p "$dir"
  if [ ! -w "$dir" ]; then
    echo "blocked: $dir is not writable" >&2
    exit 1
  fi
done

echo "ready"
