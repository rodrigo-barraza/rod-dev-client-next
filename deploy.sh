#!/bin/bash
# ============================================================
# rod.dev — Build & Deploy to Synology NAS
#
# Thin wrapper — all logic lives in ../deploy-kit/lib.sh
# Hook: injects NEXT_PUBLIC_RODRIGO_SERVICE as build arg.
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
SKIP_ENV_DEPLOY="true"   # Vault bootstrap is handled by centralized deploy-kit/.env.deploy

# ── Inject NEXT_PUBLIC_* as Docker build arg ──────────────────
PRE_BUILD() {
  local CENTRAL_ENV="${DEPLOY_KIT_DIR}/.env.deploy"
  if [ -f "$CENTRAL_ENV" ]; then
    set -a; source "$CENTRAL_ENV"; set +a
    info "Loaded deploy-kit/.env.deploy"
  fi
  if [ -n "${NEXT_PUBLIC_RODRIGO_SERVICE:-}" ]; then
    BUILD_ARGS="--build-arg NEXT_PUBLIC_RODRIGO_SERVICE=${NEXT_PUBLIC_RODRIGO_SERVICE}"
    info "API URL: ${NEXT_PUBLIC_RODRIGO_SERVICE}"
  fi
}

# ── Conditionally sync centralized .env.deploy → .env ─────────
EXTRA_SSH_SYNC() {
  local CENTRAL_ENV="${DEPLOY_KIT_DIR}/.env.deploy"
  if [ -f "$CENTRAL_ENV" ]; then
    cat "$CENTRAL_ENV" | ssh "$NAS_HOST" "cat > '${NAS_COMPOSE_DIR}/.env'"
    info "Synced deploy-kit/.env.deploy → .env"
  fi
}

source "${SCRIPT_DIR}/../deploy-kit/lib.sh"
