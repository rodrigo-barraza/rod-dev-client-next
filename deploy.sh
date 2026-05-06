#!/bin/bash
# ============================================================
# rod.dev — Build & Deploy to Synology NAS
#
# Thin wrapper — all logic lives in ../deploy-kit/lib.sh
# Hook: injects VAULT_SERVICE_URL as build arg and VAULT_SERVICE_TOKEN
#       as a BuildKit secret for Next.js secret resolution at build time.
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
SKIP_ENV_DEPLOY="true"

# ── Inject Vault credentials for Docker build ─────────────────
PRE_BUILD() {
  local CENTRAL_ENV="${DEPLOY_KIT_DIR}/.env.deploy"
  if [ -f "$CENTRAL_ENV" ]; then
    set -a; source "$CENTRAL_ENV"; set +a
    info "Loaded deploy-kit/.env.deploy"
  fi
  if [ -n "${VAULT_SERVICE_URL:-}" ]; then
    BUILD_ARGS="--build-arg VAULT_SERVICE_URL=${VAULT_SERVICE_URL}"
    info "Vault URL: ${VAULT_SERVICE_URL}"
  fi
  if [ -n "${VAULT_SERVICE_TOKEN:-}" ]; then
    BUILD_SECRETS="--secret id=VAULT_SERVICE_TOKEN,env=VAULT_SERVICE_TOKEN"
    info "Vault token: ****${VAULT_SERVICE_TOKEN: -8}"
  fi
}

source "${SCRIPT_DIR}/../deploy-kit/lib.sh"
