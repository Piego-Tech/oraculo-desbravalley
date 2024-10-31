import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'piegotech.com', // Substitua pelo domínio da sua imagem
        port: '',
        pathname: '/assets/img/logo-home.png', // Ajuste conforme necessário
      },
    ],
  }
};

export default nextConfig;
