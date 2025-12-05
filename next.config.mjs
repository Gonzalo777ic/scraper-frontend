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
        // CORRECCIÓN CRÍTICA:
        // 1. Usamos la IP del LoadBalancer (34.61.235.12)
        // 2. Agregamos el prefijo '/api' porque tu infraestructura lo requiere
        destination: 'http://34.61.235.12/api/:path*', 
      },
    ]
  },
}

export default nextConfig