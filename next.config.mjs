/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },

  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        destination: 'http://34.118.235.125/:path*', // Tu IP de GCP
      },
    ]
  },
}

export default nextConfig