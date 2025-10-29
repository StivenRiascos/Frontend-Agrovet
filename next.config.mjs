/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
    buildActivityPosition: 'bottom-right',
  },
}

export default nextConfig
