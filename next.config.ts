// ============================================================
// rod.dev — Next.js Configuration
// ============================================================
// Bootstraps secrets from Vault (or .env fallback) at startup
// and injects them into process.env for the app.
// ============================================================

import type { NextConfig } from "next";
// @ts-expect-error — JS-only vault client, no type declarations
import { createVaultClient } from "@rodrigo-barraza/utilities/node";

// ── Bootstrap secrets at build/dev time ────────────────────────
const vault = createVaultClient({
  localEnvFile: "./.env",
  fallbackEnvFile: "../vault-service/.env",
});

const secrets = await vault.fetch();

// Inject into process.env so the app can read them
Object.assign(process.env, secrets);

const nextConfig: NextConfig = {
  output: "standalone",
  turbopack: {},
  transpilePackages: ["@rodrigo-barraza/utilities"],
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.rod.dev",
      },
    ],
  },

  env: {
    NEXT_PUBLIC_RODRIGO_SERVICE: secrets.NEXT_PUBLIC_RODRIGO_SERVICE,
    ROD_DEV_MINIO_BUCKET_NAME: secrets.ROD_DEV_MINIO_BUCKET_NAME,
    ROD_DEV_ASSETS_MINIO_BUCKET_NAME: secrets.ROD_DEV_ASSETS_MINIO_BUCKET_NAME,
    RENDER_API: secrets.RENDER_API,
  },
};

export default nextConfig;
