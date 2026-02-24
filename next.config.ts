/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me', // O novo domínio adicionado aqui
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

module.exports = nextConfig;