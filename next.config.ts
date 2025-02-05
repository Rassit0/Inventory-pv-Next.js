import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // You can adjust the size as needed (e.g., 5mb, 10mb)
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Cambia a 'https' si es necesario
        hostname: 'localhost',
        port: '3009',
        pathname: '/uploads/**', // Permite todas las rutas
      },
    ],
  },
};

export default nextConfig;
