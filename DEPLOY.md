# Deployment Guide

## Quick Reference

```bash
# One-time setup (SSH key + Synology permissions + sudoers)
npm run setup-ssh

# Deploy to Synology NAS
npm run deploy

# Dry run (validate without deploying)
npm run deploy -- --dry-run

# Force full rebuild (no Docker cache)
npm run deploy -- --no-cache

# Deploy without git pull
npm run deploy -- --skip-pull
```

## How It Works

1. **Build** — Docker image is built locally on your dev machine
2. **Transfer** — Image is piped over SSH to the Synology (`docker save | ssh nas "docker load"`)
3. **Restart** — Container is recreated remotely via `docker compose up -d --force-recreate`
4. **Cleanup** — Old images are pruned automatically

If SSH isn't configured, the script falls back to exporting a tarball to `K:\rod-dev\` (SMB) with manual Container Manager import.

## Configuration

| File | Purpose |
|------|---------|
| `deploy.sh` | Build + deploy script |
| `setup-ssh.sh` | One-time SSH key + Synology permission setup |
| `.env.deploy` | Build-time env vars for NAS deployment (gitignored) |
| `.env.deploy.example` | Template for `.env.deploy` |
| `Dockerfile` | Multi-stage build with standalone Next.js output |
| `docker-compose.yml` | Container config with health check + log rotation |

### Build-Time Environment Variables

`NEXT_PUBLIC_*` variables are inlined by Next.js at build time. The deploy script sources `.env.deploy` and passes them as Docker build args:

```bash
# .env.deploy
NEXT_PUBLIC_RODRIGO_SERVICE=http://192.168.86.2:6666
```

---

## Deployment Evolution Roadmap

### Current: SSH Push (Single Service) ✅

```
local build → docker save | ssh | docker load → docker compose up
```

**Pros:** Simple, zero infrastructure, works now.
**Cons:** Transfers the full image every time (~76MB), no version history.

---

### Next: Private Docker Registry (When We Containerize More Services)

Spin up a `registry:2` container on the Synology to serve as a private Docker registry.

```
local build → docker push nas:5000/service → docker compose pull → up
```

**Why:** When `prism`, `tools-api`, `sessions`, etc. are all containerized, each service pushing full tarballs over SSH becomes slow. A registry only transfers **changed layers** (delta transfer), which is dramatically faster for iterative deploys.

**Steps:**
1. Deploy `registry:2` on Synology via Container Manager
2. Configure WSL Docker daemon to trust the insecure registry (`/etc/docker/daemon.json`)
3. Tag images as `192.168.86.2:5000/<service>:<tag>`
4. Update deploy scripts: `docker push` + remote `docker compose pull && up`
5. Tag convention: `:latest` + `:<git-sha-short>` for instant rollback

**Effort:** ~30 minutes. Do this when the second service gets containerized.

---

### Future: CI/CD Pipeline (Optional, Push-to-Deploy)

GitHub Actions builds + pushes on `git push`, then triggers a restart on the NAS.

```
git push → GitHub Actions build → push to GHCR/registry → webhook → NAS restart
```

**Why:** Fully hands-off — no local build, no local Docker. Just push code.

**Requires:**
- GitHub Container Registry (GHCR) or the private registry from above
- Synology reachable from GitHub (via Cloudflare Tunnel or Tailscale, both already set up)
- SSH deploy key or webhook endpoint on the NAS

**Effort:** ~1 hour. Only worth it if you want zero-touch deploys.
