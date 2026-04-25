#!/bin/bash
# ============================================================
# Rod Dev Client — Build & Deploy to Synology NAS
# Builds the Docker image locally and copies it to K: (NAS)
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
IMAGE_NAME="rod-dev-client"
NAS_DOCKER_DIR="/mnt/k/rod-dev"
TARBALL="${IMAGE_NAME}.tar.gz"

echo ""
echo "══════════════════════════════════════════════════════"
echo "  🚀 Rod Dev Client — Deploy to Synology"
echo "══════════════════════════════════════════════════════"

# 1. Pull latest changes
echo ""
echo "📥 Pulling latest changes..."
cd "$SCRIPT_DIR"
git pull

# 2. Build Docker image
echo ""
echo "🔨 Building Docker image..."
docker build -t "${IMAGE_NAME}:latest" .

# 3. Export image to tarball
echo ""
echo "📦 Exporting image..."
docker save "${IMAGE_NAME}:latest" | gzip > "/tmp/${TARBALL}"

# 4. Copy to NAS
echo ""
echo "📤 Copying to NAS (K:)..."
mkdir -p "${NAS_DOCKER_DIR}"
cp "/tmp/${TARBALL}" "${NAS_DOCKER_DIR}/${TARBALL}"
cp "${SCRIPT_DIR}/docker-compose.yml" "${NAS_DOCKER_DIR}/docker-compose.yml"

# 5. Cleanup temp file
rm -f "/tmp/${TARBALL}"

echo ""
echo "══════════════════════════════════════════════════════"
echo "  ✅ Image exported to: ${NAS_DOCKER_DIR}/${TARBALL}"
echo ""
echo "  Next steps in Synology Container Manager:"
echo "    1. Image → Add → From File → select ${TARBALL}"
echo "    2. Project → rod-dev → Action → Stop"
echo "    3. Project → rod-dev → Action → Start"
echo "══════════════════════════════════════════════════════"
echo ""
