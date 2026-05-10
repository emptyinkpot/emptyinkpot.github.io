#!/usr/bin/env bash
set -euo pipefail

STACK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$STACK_ROOT/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "blocked: .env is missing; copy .env.example to .env and fill secrets" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

MIN_FREE_GB="${MIN_FREE_GB:-40}"
EXPECTED_SERVER_IP="${EXPECTED_SERVER_IP:-124.220.233.126}"
APPFLOWY_PUBLIC_HOST="${APPFLOWY_PUBLIC_HOST:-project.tengokukk.com}"

if ! command -v docker >/dev/null 2>&1; then
  echo "blocked: docker is not installed" >&2
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "blocked: docker compose plugin is not available" >&2
  exit 1
fi

available_gb="$(df -BG "$STACK_ROOT" | awk 'NR==2 { gsub(/G/, "", $4); print $4 }')"
if [ "${available_gb:-0}" -lt "$MIN_FREE_GB" ]; then
  echo "blocked: only ${available_gb}GB free at $STACK_ROOT; need at least ${MIN_FREE_GB}GB" >&2
  exit 1
fi

resolved_ip="$(getent ahostsv4 "$APPFLOWY_PUBLIC_HOST" | awk 'NR==1 { print $1 }' || true)"
if [ -z "$resolved_ip" ]; then
  echo "blocked: DNS for $APPFLOWY_PUBLIC_HOST does not resolve" >&2
  exit 1
fi

if [ "$resolved_ip" != "$EXPECTED_SERVER_IP" ]; then
  echo "blocked: DNS for $APPFLOWY_PUBLIC_HOST resolves to $resolved_ip, expected $EXPECTED_SERVER_IP" >&2
  exit 1
fi

for name in GOTRUE_ADMIN_EMAIL GOTRUE_ADMIN_PASSWORD GOTRUE_JWT_SECRET POSTGRES_PASSWORD; do
  value="${!name:-}"
  if [ -z "$value" ]; then
    echo "blocked: $name is empty in .env" >&2
    exit 1
  fi
done

if ss -ltn | awk '{print $4}' | grep -Eq ':(18080|18443)$'; then
  echo "blocked: loopback AppFlowy ports 18080/18443 are already in use" >&2
  exit 1
fi

echo "ready"
