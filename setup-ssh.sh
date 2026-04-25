#!/bin/bash
# ============================================================
# One-time SSH setup for Synology NAS deploys
#
# Run this once to configure passwordless SSH access to the NAS.
# After running, 'npm run deploy' will be fully automated.
#
# Handles:
# - SSH key generation + copy
# - Synology home directory permission fix (known DSM issue)
# - NOPASSWD sudoers for docker commands (non-interactive deploys)
# ============================================================

set -euo pipefail

NAS_IP="192.168.86.2"
NAS_USER="rodrigo"
SSH_KEY="$HOME/.ssh/synology_ed25519"
SSH_ALIAS="nas"

# Synology puts docker in /usr/local/bin, not in the default SSH PATH
DOCKER_BIN="/usr/local/bin/docker"

BOLD="\033[1m"
CYAN="\033[36m"
GREEN="\033[32m"
YELLOW="\033[33m"
RED="\033[31m"
DIM="\033[2m"
RESET="\033[0m"

echo ""
echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════════${RESET}"
echo -e "${CYAN}${BOLD}  🔑 Synology SSH Setup${RESET}"
echo -e "${CYAN}${BOLD}══════════════════════════════════════════════════════${RESET}"

# ── 1. Generate key ───────────────────────────────────────────
if [ -f "$SSH_KEY" ]; then
  echo -e "\n  ${GREEN}✔ SSH key already exists:${RESET} ${DIM}${SSH_KEY}${RESET}"
else
  echo -e "\n  Generating ed25519 key pair..."
  ssh-keygen -t ed25519 -f "$SSH_KEY" -C "wsl-deploy-$(hostname)" -N ""
  echo -e "  ${GREEN}✔ Key generated${RESET}"
fi

# ── 2. Copy key to NAS ───────────────────────────────────────
echo -e "\n  Copying public key to ${NAS_USER}@${NAS_IP}..."
echo -e "  ${YELLOW}You'll be prompted for your Synology password (possibly twice):${RESET}"
echo ""
ssh-copy-id -i "$SSH_KEY" "${NAS_USER}@${NAS_IP}"

# ── 3. Fix Synology permissions ──────────────────────────────
# Synology DSM's OpenSSH rejects authorized_keys if the home
# directory or .ssh folder is group/world-writable.
echo -e "\n  ${YELLOW}Fixing Synology home directory permissions...${RESET}"
echo -e "  ${DIM}(you may be prompted for your password one more time)${RESET}"
echo ""
ssh -o StrictHostKeyChecking=no "${NAS_USER}@${NAS_IP}" "
  chmod 700 ~
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
  echo 'Permissions fixed'
"

# ── 4. Add SSH config alias ──────────────────────────────────
SSH_CONFIG="$HOME/.ssh/config"

if grep -q "^Host ${SSH_ALIAS}$" "$SSH_CONFIG" 2>/dev/null; then
  echo -e "\n  ${GREEN}✔ SSH alias '${SSH_ALIAS}' already in config${RESET}"
else
  echo -e "\n  Adding '${SSH_ALIAS}' alias to ${SSH_CONFIG}..."
  mkdir -p "$HOME/.ssh"
  cat >> "$SSH_CONFIG" <<EOF

# Synology NAS — deploy target
Host ${SSH_ALIAS}
    HostName ${NAS_IP}
    User ${NAS_USER}
    IdentityFile ${SSH_KEY}
    StrictHostKeyChecking no
EOF
  chmod 600 "$SSH_CONFIG"
  echo -e "  ${GREEN}✔ SSH config updated${RESET}"
fi

# ── 5. Verify passwordless SSH ────────────────────────────────
echo -e "\n  Verifying passwordless connection..."
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes "$SSH_ALIAS" "echo 'SSH OK'" 2>/dev/null; then
  echo -e "  ${RED}✖ Passwordless SSH still failing${RESET}"
  echo ""
  echo -e "  ${YELLOW}Manual fix — SSH into the NAS and run:${RESET}"
  echo -e "  ${DIM}  ssh ${NAS_USER}@${NAS_IP}${RESET}"
  echo -e "  ${DIM}  chmod 700 ~ && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys${RESET}"
  exit 1
fi
echo -e "  ${GREEN}✔ SSH connection verified (no password needed)${RESET}"

# ── 6. Verify Docker CLI ─────────────────────────────────────
echo -e "\n  Checking Docker..."
DOCKER_VER=$(ssh "$SSH_ALIAS" "${DOCKER_BIN} --version 2>/dev/null" || true)
if [ -z "$DOCKER_VER" ]; then
  echo -e "  ${RED}✖ Docker not found at ${DOCKER_BIN}${RESET}"
  echo -e "  ${DIM}  Ensure Container Manager is installed in DSM${RESET}"
  exit 1
fi
echo -e "  ${GREEN}✔ ${DOCKER_VER}${RESET}"

# ── 7. Setup NOPASSWD sudo for docker ────────────────────────
# The docker socket is root-only on Synology. We need sudo for
# docker commands, but non-interactively (no password prompt).
echo -e "\n  Setting up passwordless sudo for docker..."
echo -e "  ${YELLOW}Enter your Synology password if prompted:${RESET}"
echo ""

# Use a heredoc via ssh -t for the interactive sudo
ssh -t "$SSH_ALIAS" "
  SUDOERS_FILE='/etc/sudoers.d/docker-deploy'
  if [ -f \"\$SUDOERS_FILE\" ]; then
    echo 'Sudoers rule already exists'
  else
    echo '${NAS_USER} ALL=(ALL) NOPASSWD: ${DOCKER_BIN}, ${DOCKER_BIN}-compose, /usr/local/bin/dockerd' | sudo tee \"\$SUDOERS_FILE\" > /dev/null
    sudo chmod 440 \"\$SUDOERS_FILE\"
    echo 'Sudoers rule created'
  fi
"

# Verify sudo docker works without password
if ssh -o BatchMode=yes "$SSH_ALIAS" "sudo ${DOCKER_BIN} ps --format '{{.Names}}'" 2>/dev/null; then
  echo -e "  ${GREEN}✔ sudo docker works without password${RESET}"
else
  echo -e "  ${RED}✖ sudo docker still requires a password${RESET}"
  echo -e "  ${DIM}  Try SSHing into the NAS manually and running:${RESET}"
  echo -e "  ${DIM}  echo '${NAS_USER} ALL=(ALL) NOPASSWD: ${DOCKER_BIN}' | sudo tee /etc/sudoers.d/docker-deploy${RESET}"
  exit 1
fi

# Show running containers
echo -e "\n  ${DIM}Running containers:${RESET}"
ssh "$SSH_ALIAS" "sudo ${DOCKER_BIN} ps --format '  {{.Names}}\t{{.Status}}'" 2>/dev/null || true

echo ""
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════${RESET}"
echo -e "${GREEN}${BOLD}  ✅ Setup complete — 'npm run deploy' is now fully automated${RESET}"
echo -e "${GREEN}${BOLD}══════════════════════════════════════════════════════${RESET}"
echo ""
