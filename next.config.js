/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint: {
  //   // Warning: This allows production builds to successfully complete even if
  //   // your project has ESLint errors.
  //   ignoreDuringBuilds: true,
  // },
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
        protocol: 'https',
        hostname: 'assets.rod.dev',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'generations.rod.dev',
        port: ''
      },
    ]
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
