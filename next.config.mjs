/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',            // exporta como site estático
  images: { unoptimized: true } // desativa otimização de imagens
};

export default nextConfig;
