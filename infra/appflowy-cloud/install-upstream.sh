#!/usr/bin/env bash
set -euo pipefail

STACK_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$STACK_ROOT/.env"

if [ ! -f "$ENV_FILE" ]; then
  echo "blocked: .env is missing" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1090
. "$ENV_FILE"
set +a

APPFLOWY_CLOUD_REPO="${APPFLOWY_CLOUD_REPO:-https://github.com/AppFlowy-IO/AppFlowy-Cloud.git}"
APPFLOWY_CLOUD_REF="${APPFLOWY_CLOUD_REF:-main}"
APPFLOWY_CLOUD_UPSTREAM_DIR="${APPFLOWY_CLOUD_UPSTREAM_DIR:-upstream}"
UPSTREAM="$STACK_ROOT/$APPFLOWY_CLOUD_UPSTREAM_DIR"

if [ -e "$UPSTREAM/.git" ]; then
  git -C "$UPSTREAM" fetch --depth 1 origin "$APPFLOWY_CLOUD_REF"
  git -C "$UPSTREAM" checkout FETCH_HEAD
else
  git clone --depth 1 --branch "$APPFLOWY_CLOUD_REF" "$APPFLOWY_CLOUD_REPO" "$UPSTREAM"
fi

if [ ! -f "$UPSTREAM/.env" ]; then
  if [ -f "$UPSTREAM/.env.example" ]; then
    cp "$UPSTREAM/.env.example" "$UPSTREAM/.env"
  else
    touch "$UPSTREAM/.env"
  fi
  chmod 600 "$UPSTREAM/.env"
fi

cat >> "$UPSTREAM/.env" <<EOF

# MyBlog host integration overrides.
APPFLOWY_BASE_URL=${APPFLOWY_BASE_URL:-https://project.tengokukk.com}
APPFLOWY_WEB_URL=${APPFLOWY_BASE_URL:-https://project.tengokukk.com}
APPFLOWY_WEBSOCKET_BASE_URL=${APPFLOWY_WEBSOCKET_BASE_URL:-wss://project.tengokukk.com/ws}
NGINX_PORT=${NGINX_PORT:-127.0.0.1:18080}
NGINX_TLS_PORT=${NGINX_TLS_PORT:-127.0.0.1:18443}
GOTRUE_ADMIN_EMAIL=${GOTRUE_ADMIN_EMAIL}
GOTRUE_ADMIN_PASSWORD=${GOTRUE_ADMIN_PASSWORD}
GOTRUE_JWT_SECRET=${GOTRUE_JWT_SECRET}
POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
EOF

echo "installed official AppFlowy-Cloud at $UPSTREAM"
echo "Review $UPSTREAM/.env before docker compose up -d."
