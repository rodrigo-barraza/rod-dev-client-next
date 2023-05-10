/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.rod.dev',
        port: ''
      }
    ]
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
