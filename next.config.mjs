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
        // 1. Usamos la URL segura de Cloud Run (HTTPS).
        // 2. QUITAMOS '/api' del destino, porque en Cloud Run tu app escucha en la raíz.
        //    Ejemplo: /api-proxy/prices -> https://...run.app/prices
        destination: 'https://price-api-306428363316.us-central1.run.app/:path*', 
      },
    ]
  },
}

export default nextConfig