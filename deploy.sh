#!/bin/bash
# ============================================================
# rod.dev — Build & Deploy to Synology NAS
#
# Thin wrapper — all logic lives in ../deploy/lib.sh
# Hook: injects NEXT_PUBLIC_RODRIGO_SERVICE as build arg.
# Note: .env.deploy is optional for this service.
#
# Usage:
#   npm run deploy              # full deploy
#   npm run deploy -- --dry-run # validate without deploying
#   npm run deploy -- --skip-pull
#   npm run deploy -- --no-cache
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IMAGE_NAME="rod-dev-client"
DISPLAY_NAME="🚀 Rod Dev Client"
SKIP_ENV_DEPLOY="true"   # .env.deploy is optional for rod-dev

# ── Inject NEXT_PUBLIC_* as Docker build arg ──────────────────
PRE_BUILD() {
  if [ -f "${SCRIPT_DIR}/.env.deploy" ]; then
    set -a; source "${SCRIPT_DIR}/.env.deploy"; set +a
    info "Loaded .env.deploy"
  fi
  if [ -n "${NEXT_PUBLIC_RODRIGO_SERVICE:-}" ]; then
    BUILD_ARGS="--build-arg NEXT_PUBLIC_RODRIGO_SERVICE=${NEXT_PUBLIC_RODRIGO_SERVICE}"
    info "API URL: ${NEXT_PUBLIC_RODRIGO_SERVICE}"
  fi
}

# ── Conditionally sync .env.deploy if it exists ───────────────
EXTRA_SSH_SYNC() {
  if [ -f "${SCRIPT_DIR}/.env.deploy" ]; then
    cat "${SCRIPT_DIR}/.env.deploy" | ssh "$NAS_HOST" "cat > '${NAS_COMPOSE_DIR}/.env'"
    info "Synced .env.deploy → .env"
  fi
}

source "${SCRIPT_DIR}/../deploy/lib.sh"
